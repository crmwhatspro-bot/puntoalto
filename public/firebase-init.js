/* ══════════════════════════════════════════════════════
   Firebase initialization — lazy-loaded
   ------------------------------------------------------
   A API pública `window.paFirebase` fica disponível
   imediatamente, mas o SDK do Firebase só é baixado na
   primeira interação do usuário (scroll/click/touch) ou
   após ~3s de idle — o que vier primeiro.

   Isso tira ~180 KB de JavaScript do caminho crítico.
   ══════════════════════════════════════════════════════ */

/* ── Constantes e utilidades síncronas ────────────────── */
const BROWSER_SESSION_STORAGE = 'pa-session-id';
const UTM_KEYS    = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const UTM_STORAGE = 'pa-utms';

const firebaseConfig = {
  apiKey:            'AIzaSyCUqKdv6Teh7nIY4hZilPeMZNEEwpol3Rk',
  authDomain:        'puntoalto-marketingyvientas.firebaseapp.com',
  projectId:         'puntoalto-marketingyvientas',
  storageBucket:     'puntoalto-marketingyvientas.firebasestorage.app',
  messagingSenderId: '594940254116',
  appId:             '1:594940254116:web:4f9d5addc5c30e45b71331',
  measurementId:     'G-1L211QKNWT'
};
const RECAPTCHA_V3_SITE_KEY = '6LeOabwsAAAAAKDFd4Tmhc5vQITZ43fb4DgxcEzG';

// Debug token for local dev — MUST be set BEFORE initializeAppCheck.
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

(function captureUtms() {
  try {
    const url = new URL(location.href);
    const fresh = {};
    let hasAny = false;
    for (const k of UTM_KEYS) {
      const v = url.searchParams.get(k);
      if (v) { fresh[k] = v.slice(0, 200); hasAny = true; }
    }
    if (hasAny) sessionStorage.setItem(UTM_STORAGE, JSON.stringify(fresh));
  } catch (e) { /* noop */ }
})();

function getUtms() {
  try { return JSON.parse(sessionStorage.getItem(UTM_STORAGE) || '{}'); }
  catch (e) { return {}; }
}

function newSessionId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 's-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function getBrowserSessionId() {
  try {
    let id = sessionStorage.getItem(BROWSER_SESSION_STORAGE);
    if (!id) {
      id = newSessionId();
      sessionStorage.setItem(BROWSER_SESSION_STORAGE, id);
    }
    return id;
  } catch (e) {
    return newSessionId();
  }
}

function detectDevice() {
  const ua = navigator.userAgent || '';
  if (/Mobi|Android|iPhone/i.test(ua) && !/iPad|Tablet/i.test(ua)) return 'mobile';
  if (/iPad|Tablet/i.test(ua) || (window.innerWidth >= 768 && window.innerWidth < 1024)) return 'tablet';
  return 'desktop';
}

/* ══════════════════════════════════════════════════════
   Lazy loader — memoized Promise que baixa e inicializa
   os módulos do Firebase apenas uma vez.
   ══════════════════════════════════════════════════════ */
let _readyPromise = null;

function ensureFirebase() {
  if (_readyPromise) return _readyPromise;

  _readyPromise = (async () => {
    const BASE = 'https://www.gstatic.com/firebasejs/11.0.2/';
    const [appMod, acMod, fsMod, fnMod] = await Promise.all([
      import(BASE + 'firebase-app.js'),
      import(BASE + 'firebase-app-check.js'),
      import(BASE + 'firebase-firestore.js'),
      import(BASE + 'firebase-functions.js')
    ]);

    const app = appMod.initializeApp(firebaseConfig);

    try {
      acMod.initializeAppCheck(app, {
        provider: new acMod.ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
        isTokenAutoRefreshEnabled: true
      });
    } catch (err) {
      console.warn('[PUNTO ALTO] App Check init failed:', err);
    }

    const db        = fsMod.getFirestore(app);
    const functions = fnMod.getFunctions(app, 'southamerica-east1');
    const _listSlotsFn = fnMod.httpsCallable(functions, 'listSlots');
    const _bookSlotFn  = fnMod.httpsCallable(functions, 'bookSlot');

    return { app, db, fs: fsMod, _listSlotsFn, _bookSlotFn };
  })();

  return _readyPromise;
}

/* ══════════════════════════════════════════════════════
   Public API — cada método garante o SDK antes de usar.
   ══════════════════════════════════════════════════════ */
async function addLead(payload) {
  const { db, fs } = await ensureFirebase();
  const clean = {};
  for (const [k, v] of Object.entries(payload || {})) {
    if (v == null) continue;
    if (typeof v === 'string')      clean[k] = v.slice(0, 2000);
    else if (typeof v === 'number') clean[k] = v;
    else if (typeof v === 'boolean')clean[k] = v;
    else                            clean[k] = String(v).slice(0, 2000);
  }
  clean.status     = 'new';
  clean.created_at = fs.serverTimestamp();

  try {
    const ref = await fs.addDoc(fs.collection(db, 'leads'), clean);
    console.log('[PUNTO ALTO] Firestore lead id:', ref.id);
    return ref.id;
  } catch (err) {
    console.warn('[PUNTO ALTO] Firestore error:', err);
    return null;
  }
}

async function trackFormEvent(event, data = {}) {
  try {
    const sessionId = data.sessionId;
    if (!sessionId) return null;
    const { db, fs } = await ensureFirebase();
    const ref = fs.doc(db, 'form_sessions', sessionId);

    if (event === 'opened') {
      const utms = getUtms();
      const payload = {
        session_id:         sessionId,
        browser_session_id: getBrowserSessionId(),
        source:             data.source || 'unknown',
        cta_origin:         data.cta_origin || 'unknown',
        current_step:  0,
        max_step:      0,
        path:          [],
        completed:     false,
        abandoned:     false,
        duration_ms:   0,
        utm_source:    utms.utm_source   || '',
        utm_medium:    utms.utm_medium   || '',
        utm_campaign:  utms.utm_campaign || '',
        utm_content:   utms.utm_content  || '',
        utm_term:      utms.utm_term     || '',
        referrer:      (document.referrer || '').slice(0, 500),
        device:        detectDevice(),
        page_url:      location.href.slice(0, 500),
        user_agent:    (navigator.userAgent || '').slice(0, 500),
        locale:        (document.documentElement.lang || 'es'),
        created_at:    fs.serverTimestamp(),
        last_event_at: fs.serverTimestamp()
      };
      await fs.setDoc(ref, payload);
      return true;
    }

    if (event === 'step') {
      await fs.updateDoc(ref, {
        current_step:  data.step || 0,
        max_step:      data.maxStep || data.step || 0,
        path:          Array.isArray(data.path) ? data.path.slice(-30) : [],
        duration_ms:   data.durationMs || 0,
        last_event_at: fs.serverTimestamp()
      });
      return true;
    }

    if (event === 'abandoned') {
      await fs.updateDoc(ref, {
        abandoned:     true,
        duration_ms:   data.durationMs || 0,
        last_event_at: fs.serverTimestamp()
      });
      return true;
    }

    if (event === 'submitted') {
      await fs.updateDoc(ref, {
        completed:     true,
        current_step:  7,
        max_step:      7,
        lead_id:       data.leadId || '',
        duration_ms:   data.durationMs || 0,
        last_event_at: fs.serverTimestamp()
      });
      return true;
    }

    return false;
  } catch (err) {
    console.warn('[PUNTO ALTO] trackFormEvent error:', err);
    return null;
  }
}

async function trackPageView() {
  try {
    const { db, fs } = await ensureFirebase();
    const utms = getUtms();
    const payload = {
      session_id:    getBrowserSessionId(),
      path:          (location.pathname || '/').slice(0, 200),
      page_url:      location.href.slice(0, 500),
      referrer:      (document.referrer || '').slice(0, 500),
      utm_source:    utms.utm_source   || '',
      utm_medium:    utms.utm_medium   || '',
      utm_campaign:  utms.utm_campaign || '',
      utm_content:   utms.utm_content  || '',
      utm_term:      utms.utm_term     || '',
      device:        detectDevice(),
      locale:        (document.documentElement.lang || 'es'),
      user_agent:    (navigator.userAgent || '').slice(0, 500),
      created_at:    fs.serverTimestamp()
    };
    await fs.addDoc(fs.collection(db, 'page_views'), payload);
  } catch (err) {
    console.warn('[PUNTO ALTO] trackPageView error:', err);
  }
}

async function listSlots(daysAhead = 14) {
  try {
    const { _listSlotsFn } = await ensureFirebase();
    const res = await _listSlotsFn({ daysAhead });
    return res.data?.slots || [];
  } catch (err) {
    console.warn('[PUNTO ALTO] listSlots error:', err?.code, err?.message);
    return [];
  }
}

async function bookSlot(input) {
  const { _bookSlotFn } = await ensureFirebase();
  try {
    const res = await _bookSlotFn(input || {});
    return res.data;
  } catch (err) {
    console.warn('[PUNTO ALTO] bookSlot error:', err?.code, err?.message);
    throw err;
  }
}

window.paFirebase = {
  addLead, trackFormEvent, newSessionId, getUtms,
  trackPageView, getBrowserSessionId,
  listSlots, bookSlot
};
document.dispatchEvent(new CustomEvent('paFirebaseReady'));

/* ══════════════════════════════════════════════════════
   Kickoff: primeira interação OU ~3s de idle dispara o
   download do SDK em background + grava a visita.
   ══════════════════════════════════════════════════════ */
(function scheduleBootstrap() {
  let started = false;
  const kickoff = () => {
    if (started) return;
    started = true;
    ensureFirebase()
      .then(() => trackPageView())
      .catch((err) => console.warn('[PUNTO ALTO] lazy firebase bootstrap failed:', err));
  };

  const INTERACTION_EVENTS = ['pointerdown', 'touchstart', 'keydown', 'scroll'];
  const onInteract = () => {
    INTERACTION_EVENTS.forEach((ev) => removeEventListener(ev, onInteract));
    kickoff();
  };
  INTERACTION_EVENTS.forEach((ev) =>
    addEventListener(ev, onInteract, { once: true, passive: true })
  );

  // Fallback de segurança: se o usuário nunca interagir, grava o
  // page_view ~2.5s APÓS o window.load. Com isso o SDK do Firebase
  // fica fora do caminho crítico medido pelo LCP (PageSpeed).
  const scheduleFallback = () => setTimeout(kickoff, 2500);
  if (document.readyState === 'complete') {
    scheduleFallback();
  } else {
    window.addEventListener('load', scheduleFallback, { once: true });
  }
})();
