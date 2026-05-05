/* ══════════════════════════════════════════════════════
   Punto Alto — Admin dashboard
   Reads /leads in realtime; allows status updates.

   ⚠️  Keep the firebaseConfig in sync with firebase-init.js.
   ══════════════════════════════════════════════════════ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app-check.js';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  updateDoc,
  doc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';

/* ── Config (mirror of firebase-init.js) ───────────────── */
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseConfig = {
  apiKey: "AIzaSyCUqKdv6Teh7nIY4hZilPeMZNEEwpol3Rk",
  authDomain: "puntoalto-marketingyvientas.firebaseapp.com",
  projectId: "puntoalto-marketingyvientas",
  storageBucket: "puntoalto-marketingyvientas.firebasestorage.app",
  messagingSenderId: "594940254116",
  appId: "1:594940254116:web:4f9d5addc5c30e45b71331",
  measurementId: "G-1L211QKNWT"
};

const RECAPTCHA_V3_SITE_KEY = '6LeOabwsAAAAAKDFd4Tmhc5vQITZ43fb4DgxcEzG';
const ADMIN_EMAILS = ['diogomarquespy@gmail.com'];

const app = initializeApp(firebaseConfig);

try {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(RECAPTCHA_V3_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  });
} catch (err) {
  console.warn('[admin] App Check init failed:', err);
}

const auth = getAuth(app);
const db   = getFirestore(app);

/* ── DOM helpers ──────────────────────────────────────── */
const $  = (id) => document.getElementById(id);
const fmtInt = (n) => new Intl.NumberFormat('es-PY').format(n);
const fmtPct = (n) => `${Math.round(n * 100)}%`;

const tzFmt = new Intl.DateTimeFormat('es-PY', {
  timeZone: 'America/Asuncion',
  day: '2-digit', month: '2-digit', year: '2-digit',
  hour: '2-digit', minute: '2-digit'
});
const tzFmtShort = new Intl.DateTimeFormat('es-PY', {
  timeZone: 'America/Asuncion',
  day: '2-digit', month: 'short'
});
const tzIsoDay = (d) => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Asuncion',
  year: 'numeric', month: '2-digit', day: '2-digit'
}).format(d);

function toast(msg, type = 'ok') {
  const el = $('toast');
  el.textContent = msg;
  el.className = `toast toast--${type}`;
  el.hidden = false;
  requestAnimationFrame(() => el.classList.add('is-show'));
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.classList.remove('is-show');
    setTimeout(() => { el.hidden = true; }, 320);
  }, 2600);
}

/* ── State ────────────────────────────────────────────── */
const state = {
  leads:     [],
  sessions:  [],
  pageViews: [],
  filters:   { search: '', source: '', status: '' },
  sort:      { key: 'created_at', dir: 'desc' },
  period:    30,
  unsub:         null,
  unsubSessions: null,
  unsubViews:    null,
  charts:   {}
};

const PERIOD_LABEL = {
  7:  'últimos 7 días',
  30: 'últimos 30 días',
  90: 'últimos 90 días'
};
const periodLabel = () => PERIOD_LABEL[state.period] || `últimos ${state.period} días`;

function getPeriodRanges(days = state.period) {
  const now = Date.now();
  const span = days * 24 * 60 * 60 * 1000;
  return {
    currentStart: now - span,
    currentEnd:   now,
    prevStart:    now - 2 * span,
    prevEnd:      now - span,
    days
  };
}

const inRange = (ms, start, end) => ms >= start && ms < end;
const ms = (d) => d?.created_at?.toMillis?.() || 0;

function leadsInPeriod(start, end) {
  return state.leads.filter((l) => inRange(ms(l), start, end));
}
function sessionsInPeriod(start, end) {
  return state.sessions.filter((s) => inRange(ms(s), start, end));
}
function pageViewsInPeriod(start, end) {
  return state.pageViews.filter((v) => inRange(ms(v), start, end));
}
function uniqueVisitors(views) {
  const set = new Set();
  for (const v of views) if (v.session_id) set.add(v.session_id);
  return set.size;
}

/* ══════════════════════════════════════════════════════
   AUTH
   ══════════════════════════════════════════════════════ */
onAuthStateChanged(auth, async (user) => {
  if (!user) return showLogin();

  if (!ADMIN_EMAILS.includes(user.email)) {
    await signOut(auth);
    showLogin('Acceso restringido. Esta cuenta no es administradora.');
    return;
  }
  showDashboard(user);
  subscribeLeads();
});

$('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('loginEmail').value.trim();
  const pass  = $('loginPassword').value;
  const errEl = $('loginError');
  errEl.textContent = '';
  $('loginSubmit').disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) {
    errEl.textContent = mapAuthError(err.code);
  } finally {
    $('loginSubmit').disabled = false;
  }
});

$('forgotLink').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = $('loginEmail').value.trim();
  if (!email) {
    $('loginError').textContent = 'Escribí tu email arriba para recibir el link de recuperación.';
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    toast('Email de recuperación enviado.');
  } catch (err) {
    $('loginError').textContent = mapAuthError(err.code);
  }
});

$('logoutBtn').addEventListener('click', async () => {
  if (state.unsub)         { state.unsub();         state.unsub = null; }
  if (state.unsubSessions) { state.unsubSessions(); state.unsubSessions = null; }
  if (state.unsubViews)    { state.unsubViews();    state.unsubViews = null; }
  await signOut(auth);
});

function mapAuthError(code) {
  const map = {
    'auth/invalid-email':      'Email inválido.',
    'auth/user-disabled':      'Cuenta deshabilitada.',
    'auth/user-not-found':     'Usuario no encontrado.',
    'auth/wrong-password':     'Contraseña incorrecta.',
    'auth/invalid-credential': 'Credenciales inválidas.',
    'auth/too-many-requests':  'Demasiados intentos. Probá en unos minutos.',
    'auth/network-request-failed': 'Sin conexión.'
  };
  return map[code] || 'No se pudo iniciar sesión.';
}

function showLogin(err) {
  $('loginView').hidden = false;
  $('dashView').hidden  = true;
  if (err) $('loginError').textContent = err;
}

function showDashboard(user) {
  $('loginView').hidden = true;
  $('dashView').hidden  = false;
  $('userEmail').textContent = user.email;
}

/* ══════════════════════════════════════════════════════
   FIRESTORE SUBSCRIPTION
   ══════════════════════════════════════════════════════ */
function subscribeLeads() {
  if (state.unsub) state.unsub();

  const q = query(
    collection(db, 'leads'),
    orderBy('created_at', 'desc'),
    limit(1000)
  );

  state.unsub = onSnapshot(q, (snap) => {
    state.leads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  }, (err) => {
    console.error('[admin] subscription error:', err);
    toast('Error al leer leads: ' + err.code, 'error');
  });

  if (state.unsubSessions) state.unsubSessions();
  const qs = query(
    collection(db, 'form_sessions'),
    orderBy('created_at', 'desc'),
    limit(1000)
  );
  state.unsubSessions = onSnapshot(qs, (snap) => {
    state.sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  }, (err) => {
    console.warn('[admin] form_sessions subscription error:', err);
  });

  if (state.unsubViews) state.unsubViews();
  const qv = query(
    collection(db, 'page_views'),
    orderBy('created_at', 'desc'),
    limit(2000)
  );
  state.unsubViews = onSnapshot(qv, (snap) => {
    state.pageViews = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  }, (err) => {
    console.warn('[admin] page_views subscription error:', err);
  });
}

/* ══════════════════════════════════════════════════════
   RENDER
   ══════════════════════════════════════════════════════ */
function render() {
  renderKpis();
  renderCharts();
  renderTable();
}

/* ── KPIs ────────────────────────────────────────────── */
function renderKpis() {
  const { currentStart, currentEnd, prevStart, prevEnd, days } = getPeriodRanges();

  // Datasets in current vs previous period
  const leadsCur  = leadsInPeriod(currentStart, currentEnd);
  const leadsPrev = leadsInPeriod(prevStart,    prevEnd);
  const sessCur   = sessionsInPeriod(currentStart, currentEnd);
  const sessPrev  = sessionsInPeriod(prevStart,    prevEnd);
  const viewsCur  = pageViewsInPeriod(currentStart, currentEnd);
  const viewsPrev = pageViewsInPeriod(prevStart,    prevEnd);

  // Visitas (sesiones únicas)
  const visits     = uniqueVisitors(viewsCur);
  const visitsPrev = uniqueVisitors(viewsPrev);
  $('kpiVisits').textContent = fmtInt(visits);
  setDelta($('kpiVisitsDelta'), visits, visitsPrev);

  // Leads
  const leads     = leadsCur.length;
  const leadsPrevN = leadsPrev.length;
  $('kpiLeads').textContent = fmtInt(leads);
  setDelta($('kpiLeadsDelta'), leads, leadsPrevN);

  // Conversión visita → lead (% de sesiones únicas que se transformaron en leads)
  const vtl     = visits     > 0 ? leads     / visits     : 0;
  const vtlPrev = visitsPrev > 0 ? leadsPrevN / visitsPrev : 0;
  $('kpiVtoL').textContent = visits === 0 ? '—' : fmtPct(vtl);
  setPctDelta($('kpiVtoLDelta'), vtl, vtlPrev);

  // Conv form (open → submit)
  const opens      = sessCur.length;
  const submits    = sessCur.filter((s) => s.completed === true).length;
  const opensPrev  = sessPrev.length;
  const submitsPrev= sessPrev.filter((s) => s.completed === true).length;
  const conv     = opens     > 0 ? submits     / opens     : 0;
  const convPrev = opensPrev > 0 ? submitsPrev / opensPrev : 0;
  $('kpiConv').textContent = opens === 0 ? '—' : fmtPct(conv);
  setPctDelta($('kpiConvDelta'), conv, convPrev, `${fmtInt(submits)}/${fmtInt(opens)}`);

  // WhatsApp success rate
  const waCur  = waStats(leadsCur);
  const waPrev = waStats(leadsPrev);
  $('kpiWa').textContent = waCur.attempted === 0 ? '—' : fmtPct(waCur.rate);
  setPctDelta($('kpiWaDelta'), waCur.rate, waPrev.rate,
    waCur.attempted === 0 ? 'sin intentos' : `${fmtInt(waCur.sent)}/${fmtInt(waCur.attempted)}`);

  // Promedio diario
  const avg     = leads      / days;
  const avgPrev = leadsPrevN / days;
  $('kpiAvg').textContent = avg < 10 ? avg.toFixed(1) : fmtInt(Math.round(avg));
  setDelta($('kpiAvgDelta'), avg, avgPrev);

  // Period hint
  const hint = $('periodHint');
  if (hint) hint.textContent = `comparado con los ${days} días previos`;
}

function waStats(leads) {
  let attempted = 0, sent = 0;
  for (const l of leads) {
    if (!l.crm_whatspro) continue;
    attempted++;
    if (l.crm_whatspro?.primary?.ok || l.crm_whatspro?.fallback?.ok) sent++;
  }
  return { attempted, sent, rate: attempted > 0 ? sent / attempted : 0 };
}

function setDelta(el, now, prev) {
  if (!el) return;
  if (prev === 0 && now === 0) { el.textContent = 'sin datos previos'; el.className = 'kpi__delta'; return; }
  if (prev === 0)              { el.textContent = '+ nuevo';            el.className = 'kpi__delta up'; return; }
  const diff = ((now - prev) / prev) * 100;
  const sign = diff > 0 ? '+' : '';
  el.textContent = `${sign}${diff.toFixed(0)}% vs período anterior`;
  el.className   = 'kpi__delta ' + (diff >= 0 ? 'up' : 'down');
}

function setPctDelta(el, now, prev, fallback = '') {
  if (!el) return;
  if (now === 0 && prev === 0) {
    el.textContent = fallback || 'sin datos previos';
    el.className = 'kpi__delta';
    return;
  }
  const diffPts = (now - prev) * 100;
  const sign = diffPts > 0 ? '+' : '';
  const pts = `${sign}${diffPts.toFixed(1)}pts vs anterior`;
  el.textContent = fallback ? `${pts} · ${fallback}` : pts;
  el.className = 'kpi__delta ' + (diffPts >= 0 ? 'up' : 'down');
}

/* ── Charts ──────────────────────────────────────────── */
function renderCharts() {
  const { currentStart, currentEnd } = getPeriodRanges();
  const leadsCur    = leadsInPeriod(currentStart, currentEnd);
  const sessionsCur = sessionsInPeriod(currentStart, currentEnd);

  renderTrendChart();
  renderDonut('chartChallenge', groupBy(leadsCur, 'challenge'));
  renderDonut('chartBudget',    groupBy(leadsCur, 'budget'));
  renderDonut('chartSource',    groupBy(leadsCur, 'source'));
  renderDonut('chartCta',       groupBy(sessionsCur, 'cta_origin'));
  renderDonut('chartUtm',       groupBy(sessionsCur, 'utm_source', 'directo'));
  renderFunnel();
}

function groupBy(rows, key, fallback = '—') {
  const out = {};
  for (const r of rows) {
    const raw = r[key];
    const v = (raw == null || raw === '') ? fallback : String(raw);
    out[v] = (out[v] || 0) + 1;
  }
  return out;
}

function renderTrendChart() {
  const canvas = $('chartTrends');
  if (!canvas) return;

  const days = state.period;
  const today = new Date();
  const labels = [];
  const visitsSets = [];
  const opens = [];
  const leads = [];

  const idxByKey = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    labels.push(tzFmtShort.format(d));
    visitsSets.push(new Set());
    opens.push(0);
    leads.push(0);
    idxByKey[tzIsoDay(d)] = days - 1 - i;
  }

  for (const v of state.pageViews) {
    const t = v.created_at?.toMillis?.();
    if (!t || !v.session_id) continue;
    const idx = idxByKey[tzIsoDay(new Date(t))];
    if (idx != null) visitsSets[idx].add(v.session_id);
  }
  for (const s of state.sessions) {
    const t = s.created_at?.toMillis?.();
    if (!t) continue;
    const idx = idxByKey[tzIsoDay(new Date(t))];
    if (idx != null) opens[idx]++;
  }
  for (const l of state.leads) {
    const t = l.created_at?.toMillis?.();
    if (!t) continue;
    const idx = idxByKey[tzIsoDay(new Date(t))];
    if (idx != null) leads[idx]++;
  }
  const visits = visitsSets.map((s) => s.size);

  if (state.charts.trends) state.charts.trends.destroy();

  const lineDataset = (label, data, color, width = 2) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: 'transparent',
    borderWidth: width,
    tension: 0.35,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: color,
    fill: false
  });

  state.charts.trends = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        lineDataset('Visitas',         visits, '#378ADD'),
        lineDataset('Aperturas form',  opens,  '#F59E0B'),
        lineDataset('Leads',           leads,  '#FF6A3D', 2.5)
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#CBD5E1',
            font: { size: 11, family: 'Inter' },
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            padding: 14
          }
        },
        tooltip: {
          backgroundColor: '#0B1828',
          borderColor: 'rgba(255,255,255,0.14)',
          borderWidth: 1,
          titleColor: '#F8FAFC',
          bodyColor: '#CBD5E1',
          padding: 10,
          displayColors: true,
          boxPadding: 4
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#94A3B8', maxTicksLimit: 10, font: { size: 11 } }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94A3B8', precision: 0, font: { size: 11 } }
        }
      }
    }
  });

  const sub = $('trendSub');
  if (sub) sub.textContent = `visitas, aperturas y leads — ${periodLabel()}`;
}

function renderFunnel() {
  const el = $('funnel');
  if (!el) return;

  const { currentStart, currentEnd } = getPeriodRanges();
  const sessions  = sessionsInPeriod(currentStart, currentEnd);
  const pageViews = pageViewsInPeriod(currentStart, currentEnd);

  // Visitas únicas (distinct session_id)
  const distinctVisits = new Set();
  for (const v of pageViews) if (v.session_id) distinctVisits.add(v.session_id);
  const visitsCount = distinctVisits.size;

  if (sessions.length === 0 && visitsCount === 0) {
    el.innerHTML = '<p class="funnel__empty">Sin sesiones registradas aún.</p>';
    return;
  }

  // 8 etapas: visita → abrió form → 5 preguntas → enviado
  const STEPS_META = [
    { label: 'Visitó',   visitCount: true },
    { label: 'Abrió',    min: 0, openCount: true },
    { label: 'Nombre',   min: 2 },
    { label: 'Teléfono', min: 3 },
    { label: 'Empresa',  min: 4 },
    { label: 'Email',    min: 5 },
    { label: 'Sector',   min: 6 },
    { label: 'Enviado',  final: true }
  ];

  const counts = STEPS_META.map((s) => {
    if (s.visitCount) return visitsCount;
    if (s.openCount)  return sessions.length;
    if (s.final)      return sessions.filter((x) => x.completed === true).length;
    return sessions.filter((x) => (x.max_step || 0) >= s.min).length;
  });
  const maxCount = Math.max(1, ...counts);

  const baseTotal = counts[0] || 0;
  el.innerHTML = STEPS_META.map((s, i) => {
    const count = counts[i];
    const pctOfTotal = baseTotal > 0 ? (count / baseTotal) * 100 : 0;
    const barPct     = (count / maxCount) * 100;
    const drop = i > 0 && counts[i - 1] > 0
      ? Math.round(((counts[i - 1] - count) / counts[i - 1]) * 100)
      : null;
    return `
      <div class="funnel__row ${s.final ? 'funnel__row--final' : ''}">
        <div class="funnel__label">${s.label}</div>
        <div class="funnel__bar">
          <div class="funnel__fill" style="width: ${barPct}%"></div>
        </div>
        <div class="funnel__stats">
          ${fmtInt(count)}
          <em>${Math.round(pctOfTotal)}%</em>
          ${drop !== null && drop > 0 ? `<span class="funnel__drop" title="Drop vs paso anterior">−${drop}%</span>` : ''}
        </div>
      </div>`;
  }).join('');
}

function renderDonut(canvasId, data) {
  const labels = Object.keys(data);
  const values = labels.map((k) => data[k]);
  const palette = ['#FF6A3D', '#378ADD', '#1D9E75', '#F59E0B', '#A78BFA', '#F472B6', '#60A5FA', '#34D399'];
  const colors  = labels.map((_, i) => palette[i % palette.length]);

  const canvas = $(canvasId);
  if (state.charts[canvasId]) state.charts[canvasId].destroy();

  if (values.length === 0) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94A3B8';
    ctx.font = "13px 'DM Sans', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('Sin datos', canvas.width / 2, canvas.height / 2);
    return;
  }

  state.charts[canvasId] = new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values, backgroundColor: colors, borderColor: '#0B1828', borderWidth: 2 }] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#CBD5E1', font: { size: 11 }, padding: 10, usePointStyle: true, pointStyle: 'circle', boxWidth: 8 }
        },
        tooltip: {
          backgroundColor: '#0B1828',
          borderColor: 'rgba(255,255,255,0.14)',
          borderWidth: 1,
          titleColor: '#F8FAFC',
          bodyColor: '#CBD5E1',
          padding: 10
        }
      }
    }
  });
}

/* ── Table ───────────────────────────────────────────── */
function renderTable() {
  const tbody = $('leadsBody');
  const rows  = applyFiltersAndSort(state.leads);

  if (rows.length === 0) {
    tbody.innerHTML = '<tr class="leads__empty"><td colspan="7">Sin resultados.</td></tr>';
    $('leadsCount').textContent = `0 de ${state.leads.length}`;
    return;
  }

  tbody.innerHTML = rows.map((l) => {
    const ms     = l.created_at?.toMillis?.();
    const when   = ms ? tzFmt.format(new Date(ms)) : '—';
    const source = (l.source || '').replace('landing-', '');
    const status = l.status || 'new';
    const waOk   = l.crm_whatspro?.primary?.ok || l.crm_whatspro?.fallback?.ok;
    const waAtt  = !!l.crm_whatspro;
    const waCls  = !waAtt ? 'wa--wait' : (waOk ? 'wa--ok' : 'wa--fail');
    const waIco  = !waAtt ? '…' : (waOk ? '✓' : '✗');

    return `
      <tr data-id="${l.id}">
        <td>${escapeHtml(when)}</td>
        <td><strong>${escapeHtml(l.name || '—')}</strong></td>
        <td>${escapeHtml(l.phone || '—')}</td>
        <td>${escapeHtml(l.company || '—')}</td>
        <td>${escapeHtml(source || '—')}</td>
        <td><span class="wa ${waCls}" title="WhatsApp">${waIco}</span></td>
        <td><span class="pill pill--${status}">${statusLabel(status)}</span></td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('tr[data-id]').forEach((tr) => {
    tr.addEventListener('click', () => openDrawer(tr.dataset.id));
  });

  $('leadsCount').textContent = rows.length === state.leads.length
    ? `${fmtInt(rows.length)} lead${rows.length === 1 ? '' : 's'}`
    : `${fmtInt(rows.length)} de ${fmtInt(state.leads.length)}`;
}

function applyFiltersAndSort(leads) {
  const { search, source, status } = state.filters;
  const s = search.trim().toLowerCase();
  let out = leads.filter((l) => {
    if (source && l.source !== source) return false;
    if (status && (l.status || 'new') !== status) return false;
    if (!s) return true;
    return (
      (l.name    || '').toLowerCase().includes(s) ||
      (l.phone   || '').toLowerCase().includes(s) ||
      (l.company || '').toLowerCase().includes(s) ||
      (l.email   || '').toLowerCase().includes(s)
    );
  });

  const { key, dir } = state.sort;
  const mult = dir === 'asc' ? 1 : -1;
  out.sort((a, b) => {
    let va = a[key], vb = b[key];
    if (key === 'created_at') {
      va = a.created_at?.toMillis?.() || 0;
      vb = b.created_at?.toMillis?.() || 0;
    } else {
      va = (va || '').toString().toLowerCase();
      vb = (vb || '').toString().toLowerCase();
    }
    if (va < vb) return -1 * mult;
    if (va > vb) return  1 * mult;
    return 0;
  });
  return out;
}

function statusLabel(s) {
  return ({
    'new':       'Nuevo',
    'contacted': 'Contactado',
    'qualified': 'Calificado',
    'converted': 'Convertido',
    'lost':      'Perdido'
  })[s] || s;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ── Period filter ───────────────────────────────────── */
document.querySelectorAll('.period__btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const p = parseInt(btn.dataset.period, 10);
    if (!p || state.period === p) return;
    state.period = p;
    document.querySelectorAll('.period__btn').forEach((b) => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    renderKpis();
    renderCharts();
  });
});

/* ── Filters + sort ──────────────────────────────────── */
$('searchInput').addEventListener('input', (e) => {
  state.filters.search = e.target.value;
  renderTable();
});
$('filterSource').addEventListener('change', (e) => {
  state.filters.source = e.target.value;
  renderTable();
});
$('filterStatus').addEventListener('change', (e) => {
  state.filters.status = e.target.value;
  renderTable();
});

document.querySelectorAll('.leads thead th[data-sort]').forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (state.sort.key === key) state.sort.dir = state.sort.dir === 'asc' ? 'desc' : 'asc';
    else { state.sort.key = key; state.sort.dir = 'desc'; }
    document.querySelectorAll('.leads thead th').forEach((x) => x.classList.remove('sorted', 'asc'));
    th.classList.add('sorted');
    if (state.sort.dir === 'asc') th.classList.add('asc');
    renderTable();
  });
});

/* ── CSV export ──────────────────────────────────────── */
$('exportBtn').addEventListener('click', () => {
  const rows = applyFiltersAndSort(state.leads);
  if (rows.length === 0) { toast('Nada para exportar.', 'error'); return; }

  const cols = [
    'id', 'created_at', 'name', 'phone', 'email', 'company',
    'sector', 'challenge', 'budget', 'source', 'status',
    'wa_ok', 'locale', 'page_url', 'referrer'
  ];
  const escape = (s) => {
    const v = s == null ? '' : String(s);
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  };
  const lines = [cols.join(',')];
  for (const l of rows) {
    const ms = l.created_at?.toMillis?.();
    const waOk = !!(l.crm_whatspro?.primary?.ok || l.crm_whatspro?.fallback?.ok);
    lines.push([
      l.id,
      ms ? new Date(ms).toISOString() : '',
      l.name, l.phone, l.email, l.company,
      l.sector, l.challenge, l.budget,
      l.source, l.status || 'new',
      waOk ? 'yes' : (l.crm_whatspro ? 'no' : ''),
      l.locale, l.page_url, l.referrer
    ].map(escape).join(','));
  }
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `puntoalto-leads-${tzIsoDay(new Date())}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast('CSV exportado.');
});

/* ══════════════════════════════════════════════════════
   DRAWER
   ══════════════════════════════════════════════════════ */
const drawer      = $('drawer');
const drawerBody  = $('drawerBody');
const drawerTitle = $('drawerTitle');

function openDrawer(id) {
  const lead = state.leads.find((l) => l.id === id);
  if (!lead) return;

  drawerTitle.textContent = lead.name || '(sin nombre)';
  drawerBody.innerHTML = drawerMarkup(lead);

  drawer.hidden = false;
  drawer.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => drawer.classList.add('is-open'));
  document.body.style.overflow = 'hidden';

  const picker = drawerBody.querySelector('.status-picker');
  if (picker) picker.addEventListener('change', async (e) => {
    const newStatus = e.target.value;
    try {
      await updateDoc(doc(db, 'leads', id), {
        status: newStatus,
        updated_at: serverTimestamp(),
        updated_by: auth.currentUser?.email || ''
      });
      toast('Estado actualizado.');
    } catch (err) {
      console.error(err);
      toast('Error: ' + err.code, 'error');
    }
  });
}

function closeDrawer() {
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { drawer.hidden = true; }, 340);
}

$('drawerScrim').addEventListener('click', closeDrawer);
$('drawerClose').addEventListener('click', closeDrawer);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !drawer.hidden) closeDrawer();
});

function drawerMarkup(l) {
  const ms = l.created_at?.toMillis?.();
  const when = ms ? tzFmt.format(new Date(ms)) : '—';
  const status = l.status || 'new';
  const wa = l.crm_whatspro || null;

  const row = (label, val, mono = false) => `
    <div class="drawer__row${mono ? ' drawer__row--mono' : ''}"><span>${escapeHtml(label)}</span><strong>${escapeHtml(val || '—')}</strong></div>`;

  const waBlock = wa ? `
    <div class="drawer__section">
      <h3>WhatsApp</h3>
      <div class="wa-status">
        <div class="wa-status__row"><span class="wa-status__label">Primary</span><span class="wa-status__val">${wa.primary?.ok ? '✓ ' : '✗ '}${wa.primary?.status || '—'}</span></div>
        ${wa.fallback ? `<div class="wa-status__row"><span class="wa-status__label">Fallback</span><span class="wa-status__val">${wa.fallback?.ok ? '✓ ' : '✗ '}${wa.fallback?.status || '—'}</span></div>` : ''}
        ${wa.skipped ? `<div class="wa-status__row"><span class="wa-status__label">Skipped</span><span class="wa-status__val">${escapeHtml(wa.skipped)}</span></div>` : ''}
      </div>
    </div>` : `
    <div class="drawer__section">
      <h3>WhatsApp</h3>
      <p style="color: var(--muted); font-size: 0.85rem; margin: 0;">Sin intento registrado aún.</p>
    </div>`;

  return `
    <div class="drawer__section">
      <h3>Estado</h3>
      <select class="status-picker">
        ${['new', 'contacted', 'qualified', 'converted', 'lost'].map(s =>
          `<option value="${s}" ${s === status ? 'selected' : ''}>${statusLabel(s)}</option>`
        ).join('')}
      </select>
    </div>

    <div class="drawer__section">
      <h3>Contacto</h3>
      ${row('Nombre', l.name)}
      ${row('Teléfono', l.phone, true)}
      ${row('Email', l.email, true)}
      ${row('Empresa', l.company)}
    </div>

    <div class="drawer__section">
      <h3>Cualificación</h3>
      ${row('Sector', l.sector)}
      ${row('Desafío', l.challenge)}
      ${row('Presupuesto', l.budget)}
      ${l.clients  ? row('Clientes',  l.clients)  : ''}
      ${l.interest ? row('Interés',   l.interest) : ''}
    </div>

    ${waBlock}

    <div class="drawer__section">
      <h3>Meta</h3>
      ${row('Creado', when, true)}
      ${row('Origen', l.source)}
      ${row('Idioma', l.locale)}
      ${row('Página', l.page_url, true)}
      ${row('Referrer', l.referrer, true)}
      ${row('User Agent', l.user_agent, true)}
      ${row('ID', l.id, true)}
    </div>`;
}
