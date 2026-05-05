/* ══════════════════════════════════════════════════════
   Punto Alto — onLeadCreated
   When a new document lands in /leads, fire a WhatsApp
   template via CRM WhatsPro.

   Primary:   POST /core/v2/api/chats/create-new
   Fallback:  POST /core/v2/api/chats/send-template  (used
              when the primary call returns non-2xx)

   Protections:
     • Phone length must be 7–15 digits
     • Per-phone cooldown of 1 hour (no double-send)
     • Global cap of 30 sends / minute (flood protection)

   Secrets (set with `firebase functions:secrets:set …`):
     • CRM_WHATSPRO_TOKEN        → access-token header
     • CRM_WHATSPRO_TEMPLATE_ID  → template to send
   ══════════════════════════════════════════════════════ */

const { onDocumentCreated }        = require('firebase-functions/v2/firestore');
const { onCall, HttpsError }       = require('firebase-functions/v2/https');
const { defineSecret }             = require('firebase-functions/params');
const { initializeApp }            = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { listAvailableSlots, createBooking } = require('./calendar');

initializeApp();
const db = getFirestore();

const CRM_TOKEN       = defineSecret('CRM_WHATSPRO_TOKEN');
const CRM_TEMPLATE_ID = defineSecret('CRM_WHATSPRO_TEMPLATE_ID');

// Email da service account que as Cloud Functions de Calendar rodam como.
// Precisa ter DWD habilitada + scope calendar.events autorizado no Workspace admin
// + roles/iam.serviceAccountTokenCreator nela mesma.
const GCAL_SA_EMAIL = 'puntoalto-calendar@puntoalto-marketingyvientas.iam.gserviceaccount.com';

const API_BASE             = 'https://api.crmwhatspro.com/core/v2/api/chats';
const COOLDOWN_MS          = 60 * 60 * 1000; // 1 hour per phone
const GLOBAL_CAP_PER_MIN   = 30;             // max sends per minute across all phones
const PHONE_MIN            = 7;
const PHONE_MAX            = 15;

exports.onLeadCreated = onDocumentCreated(
  {
    document: 'leads/{leadId}',
    region: 'southamerica-east1',
    secrets: [CRM_TOKEN, CRM_TEMPLATE_ID],
    retry: false,
    timeoutSeconds: 30
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const lead = snap.data() || {};

    // ── 1) Phone validation ────────────────────────────
    const number = String(lead.phone || '').replace(/\D/g, '');
    if (number.length < PHONE_MIN || number.length > PHONE_MAX) {
      await snap.ref.update({
        crm_whatspro: {
          skipped: 'invalid-phone',
          phone_len: number.length,
          at: FieldValue.serverTimestamp()
        }
      });
      return;
    }

    // ── 2) Per-phone cooldown ──────────────────────────
    const cooldownRef = db.collection('crm_cooldowns').doc(number);
    const cooldownSnap = await cooldownRef.get().catch(() => null);
    if (cooldownSnap && cooldownSnap.exists) {
      const last = cooldownSnap.data()?.last_sent?.toMillis?.() || 0;
      if (last && (Date.now() - last) < COOLDOWN_MS) {
        await snap.ref.update({
          crm_whatspro: {
            skipped: 'cooldown',
            last_sent_ms_ago: Date.now() - last,
            at: FieldValue.serverTimestamp()
          }
        });
        return;
      }
    }

    // ── 3) Global per-minute cap (transactional) ──────
    const minuteKey = new Date().toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
    const globalRef = db.collection('crm_rate_global').doc('current');
    try {
      await db.runTransaction(async (tx) => {
        const g = await tx.get(globalRef);
        const data = g.exists ? g.data() : {};
        const count = (data.minute_key === minuteKey) ? (data.count || 0) + 1 : 1;
        if (count > GLOBAL_CAP_PER_MIN) {
          const err = new Error('rate-limit');
          err.code = 'RATE_LIMITED';
          throw err;
        }
        tx.set(globalRef, { minute_key: minuteKey, count });
      });
    } catch (err) {
      if (err && err.code === 'RATE_LIMITED') {
        await snap.ref.update({
          crm_whatspro: {
            skipped: 'global-rate-limit',
            minute_key: minuteKey,
            at: FieldValue.serverTimestamp()
          }
        });
        return;
      }
      // If the transaction itself errored (Firestore unavailable) — fail-open.
      console.warn('[onLeadCreated] rate-limit tx error, continuing:', err);
    }

    // ── 4) Send template ──────────────────────────────
    const headers = {
      'access-token': CRM_TOKEN.value(),
      'Content-Type': 'application/json'
    };
    const templateId = CRM_TEMPLATE_ID.value();

    const primary = await callApi(
      `${API_BASE}/create-new`,
      { number, templateId },
      headers
    );

    const record = {
      primary,
      at: FieldValue.serverTimestamp()
    };

    if (!primary.ok) {
      record.fallback = await callApi(
        `${API_BASE}/send-template`,
        { number, templateId, forceSend: true, verifyContact: true },
        headers
      );
    }

    // ── 5) Persist audit + cooldown (only if we actually sent) ──
    const sent = primary.ok || (record.fallback && record.fallback.ok);
    const writes = [snap.ref.update({ crm_whatspro: record })];
    if (sent) {
      writes.push(
        cooldownRef.set(
          { last_sent: FieldValue.serverTimestamp() },
          { merge: true }
        )
      );
    }
    await Promise.all(writes);
  }
);

async function callApi(url, body, headers) {
  const out = { ok: false, status: 0 };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    out.status = res.status;
    out.ok     = res.status >= 200 && res.status < 300;

    const text = await res.text().catch(() => '');
    if (text) out.body = text.slice(0, 2000);
  } catch (err) {
    out.error = String((err && err.message) || err).slice(0, 500);
  }
  return out;
}

/* ══════════════════════════════════════════════════════
   CALENDAR — slot listing + booking
   ══════════════════════════════════════════════════════ */

exports.listSlots = onCall(
  {
    region: 'southamerica-east1',
    serviceAccount: GCAL_SA_EMAIL,
    enforceAppCheck: true,
    timeoutSeconds: 15,
    cors: true
  },
  async (req) => {
    const daysAhead = Math.min(Math.max(Number(req.data?.daysAhead) || 14, 1), 30);
    try {
      const slots = await listAvailableSlots({ daysAhead });
      return { slots };
    } catch (err) {
      console.error('[listSlots]', err?.message || err);
      throw new HttpsError('internal', 'calendar-error');
    }
  }
);

exports.bookSlot = onCall(
  {
    region: 'southamerica-east1',
    serviceAccount: GCAL_SA_EMAIL,
    enforceAppCheck: true,
    timeoutSeconds: 30,
    cors: true
  },
  async (req) => {
    const data = req.data || {};
    const { leadId, startIso, name, email, phone, company } = data;

    if (!startIso || typeof startIso !== 'string') {
      throw new HttpsError('invalid-argument', 'missing-start');
    }
    const sMs = Date.parse(startIso);
    if (!sMs || sMs < Date.now() + 30 * 60 * 1000) {
      throw new HttpsError('invalid-argument', 'slot-in-past');
    }

    try {
      const result = await createBooking({
        startIso,
        name:    sanitize(name,    120),
        email:   sanitize(email,   200),
        phone:   sanitize(phone,   40),
        company: sanitize(company, 200),
        leadId:  sanitize(leadId,  80)
      });

      // Persistir no lead + progredir status
      if (leadId) {
        try {
          await db.collection('leads').doc(leadId).update({
            booking: {
              event_id:  result.eventId,
              start:     result.start,
              end:       result.end,
              meet_link: result.meetLink,
              booked_at: FieldValue.serverTimestamp()
            },
            status: 'contacted'
          });
        } catch (e) {
          console.warn('[bookSlot] lead update error:', e?.message || e);
        }
      }

      return result;
    } catch (err) {
      console.error('[bookSlot]', err?.message || err);
      const gErr = err?.errors?.[0]?.reason || '';
      if (err?.code === 409 || /conflict|taken|duplicate/i.test(gErr + ' ' + (err?.message || ''))) {
        throw new HttpsError('already-exists', 'slot-taken');
      }
      throw new HttpsError('internal', 'book-error');
    }
  }
);

function sanitize(v, max) {
  if (v == null) return '';
  return String(v).slice(0, max);
}
