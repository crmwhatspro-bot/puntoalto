/* ══════════════════════════════════════════════════════
   Punto Alto — Google Calendar booking (KEYLESS, no googleapis)
   Service account impersonates contacto@puntoalto.com.py
   via Domain-Wide Delegation + IAM signJwt.

   Tudo via plain fetch pra manter o cold start rápido
   (o pacote `googleapis` é pesado demais e dá timeout no deploy).

   Working hours: Mon–Fri 16:00–20:00 America/Asuncion
   Slot: 30 min · Buffer: 15 min entre reuniões
   ══════════════════════════════════════════════════════ */

const CALENDAR_ID = 'contacto@puntoalto.com.py';
const IMPERSONATE = 'contacto@puntoalto.com.py';
const TIMEZONE    = 'America/Asuncion';
const SLOT_MIN    = 30;
const BUFFER_MIN  = 15;
const WORK_DAYS   = [1, 2, 3, 4, 5]; // seg..sex
const DAY_START   = '16:00';
const DAY_END     = '20:00';
const MIN_LEAD_MS = 60 * 60 * 1000;

const TZ_OFFSET    = '-03:00';
const TZ_OFFSET_MS = -3 * 60 * 60 * 1000;
const SCOPES       = ['https://www.googleapis.com/auth/calendar.events'];

// PY holidays (update anualmente)
const PY_HOLIDAYS = new Set([
  '2026-01-01','2026-03-01','2026-04-02','2026-04-03',
  '2026-05-01','2026-05-14','2026-05-15','2026-06-12',
  '2026-08-15','2026-09-29','2026-12-08','2026-12-25',
  '2027-01-01','2027-03-01','2027-03-25','2027-03-26',
  '2027-05-01','2027-05-14','2027-05-15','2027-06-14',
  '2027-08-15','2027-09-29','2027-12-08','2027-12-25'
]);

/* ── Auth: keyless via metadata server + IAM signJwt ─────────────── */

async function getMetadataToken(scope) {
  const url = scope
    ? `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token?scopes=${encodeURIComponent(scope)}`
    : 'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token';
  const res = await fetch(url, { headers: { 'Metadata-Flavor': 'Google' } });
  if (!res.ok) throw new Error('metadata-token-' + res.status);
  const data = await res.json();
  return data.access_token;
}

async function getServiceAccountEmail() {
  if (process.env.FUNCTION_IDENTITY) return process.env.FUNCTION_IDENTITY;
  try {
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email',
      { headers: { 'Metadata-Flavor': 'Google' } }
    );
    if (res.ok) return (await res.text()).trim();
  } catch (e) {}
  return '';
}

let _cachedToken = null;

async function getImpersonatedAccessToken() {
  if (_cachedToken && _cachedToken.expMs > Date.now() + 60_000) {
    return _cachedToken.token;
  }

  const saEmail = await getServiceAccountEmail();
  if (!saEmail) throw new Error('no-sa-email');

  // 1) Get default token (the Cloud Function's own SA) with scope 'iam'
  const defaultToken = await getMetadataToken('https://www.googleapis.com/auth/iam');

  // 2) Build JWT claim for DWD user impersonation
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss:   saEmail,
    scope: SCOPES.join(' '),
    aud:   'https://oauth2.googleapis.com/token',
    iat:   now,
    exp:   now + 3600,
    sub:   IMPERSONATE
  };

  // 3) Sign JWT via IAM Credentials API (no private key needed)
  const signRes = await fetch(
    `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(saEmail)}:signJwt`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${defaultToken}`,
        'Content-Type':  'application/json'
      },
      body: JSON.stringify({ payload: JSON.stringify(claimSet) })
    }
  );
  if (!signRes.ok) {
    const t = await signRes.text();
    throw new Error(`signJwt-${signRes.status}: ${t.slice(0, 300)}`);
  }
  const signData = await signRes.json();

  // 4) Exchange signed JWT for access token that impersonates the user
  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion:  signData.signedJwt
  });
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error('token-exchange: ' + JSON.stringify(tokenData).slice(0, 300));
  }

  _cachedToken = {
    token: tokenData.access_token,
    expMs: Date.now() + (tokenData.expires_in || 3600) * 1000
  };
  return _cachedToken.token;
}

async function calendarFetch(path, options = {}) {
  const token = await getImpersonatedAccessToken();
  const url = `https://www.googleapis.com/calendar/v3${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!res.ok) {
    const err = new Error(`calendar-${res.status}`);
    err.status = res.status;
    err.data   = data;
    throw err;
  }
  return data;
}

/* ── Date helpers ─────────────────────────────────── */

function asuDateParts(utcMs) {
  const asu = new Date(utcMs + TZ_OFFSET_MS);
  return {
    y: asu.getUTCFullYear(),
    m: asu.getUTCMonth() + 1,
    d: asu.getUTCDate(),
    dow: asu.getUTCDay()
  };
}

function parseHHMM(str) {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + m;
}

/* ── Slot generation ───────────────────────────────── */

function generateSlots(nowUtcMs, daysAhead) {
  const startMin = parseHHMM(DAY_START);
  const endMin   = parseHHMM(DAY_END);
  const cycle    = SLOT_MIN + BUFFER_MIN;

  const times = [];
  for (let t = startMin; t + SLOT_MIN <= endMin; t += cycle) times.push(t);

  const minFuture = nowUtcMs + MIN_LEAD_MS;
  const results   = [];

  for (let i = 0; i <= daysAhead; i++) {
    const dayUtc = nowUtcMs + i * 24 * 60 * 60 * 1000;
    const parts  = asuDateParts(dayUtc);
    if (!WORK_DAYS.includes(parts.dow)) continue;

    const dateStr = `${parts.y}-${String(parts.m).padStart(2,'0')}-${String(parts.d).padStart(2,'0')}`;
    if (PY_HOLIDAYS.has(dateStr)) continue;

    for (const minutes of times) {
      const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
      const mm = String(minutes % 60).padStart(2, '0');
      const startIso = `${dateStr}T${hh}:${mm}:00${TZ_OFFSET}`;
      const startMs  = Date.parse(startIso);
      if (startMs < minFuture) continue;
      const endIso = new Date(startMs + SLOT_MIN * 60 * 1000).toISOString();
      results.push({ start: startIso, end: endIso });
    }
  }
  return results;
}

/* ── Public API ────────────────────────────────────── */

async function listAvailableSlots({ daysAhead = 14 } = {}) {
  const candidates = generateSlots(Date.now(), daysAhead);
  if (candidates.length === 0) return [];

  const timeMin = candidates[0].start;
  const timeMax = candidates[candidates.length - 1].end;

  const fb = await calendarFetch('/freeBusy', {
    method: 'POST',
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: TIMEZONE,
      items: [{ id: CALENDAR_ID }]
    })
  });

  const busy = (fb.calendars?.[CALENDAR_ID]?.busy) || [];

  return candidates.filter((s) => {
    const sMs = Date.parse(s.start);
    const eMs = Date.parse(s.end);
    return !busy.some((b) => {
      const bs = Date.parse(b.start);
      const be = Date.parse(b.end);
      return (sMs < be && eMs > bs);
    });
  });
}

async function createBooking({ startIso, name, email, phone, company, leadId }) {
  const sMs  = Date.parse(startIso);
  const eMs  = sMs + SLOT_MIN * 60 * 1000;
  const eIso = new Date(eMs).toISOString();

  const description = [
    'Reunión de diagnóstico gratuito — Punto Alto Marketing y Ventas.',
    '',
    `Nombre:   ${name    || '—'}`,
    `Teléfono: ${phone   || '—'}`,
    `Email:    ${email   || '—'}`,
    `Empresa:  ${company || '—'}`,
    '',
    `Lead ID: ${leadId || '—'}`
  ].join('\n');

  const eventBody = {
    summary: `Diagnóstico Punto Alto — ${name || 'Lead'}`,
    description,
    start: { dateTime: startIso, timeZone: TIMEZONE },
    end:   { dateTime: eIso,     timeZone: TIMEZONE },
    attendees: email ? [{ email, displayName: name || undefined }] : [],
    conferenceData: {
      createRequest: {
        requestId: `pa-${leadId || 'x'}-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 15 }
      ]
    }
  };

  const ev = await calendarFetch(
    `/calendars/${encodeURIComponent(CALENDAR_ID)}/events?conferenceDataVersion=1&sendUpdates=all`,
    { method: 'POST', body: JSON.stringify(eventBody) }
  );

  const meet =
    ev.hangoutLink ||
    ev.conferenceData?.entryPoints?.find((p) => p.entryPointType === 'video')?.uri ||
    '';

  return {
    eventId:  ev.id,
    start:    startIso,
    end:      eIso,
    meetLink: meet
  };
}

module.exports = {
  listAvailableSlots,
  createBooking,
  generateSlots,
  PY_HOLIDAYS,
  CALENDAR_ID,
  TIMEZONE,
  SLOT_MIN
};
