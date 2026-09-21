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
  filters:   { search: '', source: '', status: '', fields: {} },
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
  renderDonut('chartChallenge', groupByAnswer(leadsCur, 'challenge'));
  renderDonut('chartBudget',    groupByAnswer(leadsCur, 'budget'));
  renderDonut('chartSource',    groupBy(leadsCur, 'source', 'sin origen', sourceLabel));
  renderDonut('chartCta',       groupBy(sessionsCur, 'cta_origin', 'no identificado', ctaLabel));
  renderDonut('chartUtm',       groupBy(sessionsCur, 'utm_source', 'directo'));

  // Niche-specific donuts
  const contadoresLeads   = leadsCur.filter((l) => l.source === 'landing-contadores');
  const inmobiliarioLeads = leadsCur.filter((l) => l.source === 'landing-inmobiliario');

  renderDonut('chartClients',   groupByAnswer(contadoresLeads, 'clients'));
  renderDonut('chartSoftware',  groupByAnswer(contadoresLeads, 'software'));
  renderDonut('chartPain',      groupByAnswer(contadoresLeads, 'pain'));
  renderDonut('chartOperation', groupByAnswer(inmobiliarioLeads, 'operation'));
  renderDonut('chartTeam',      groupByAnswer(inmobiliarioLeads, 'team'));
  renderDonut('chartOrigin',    groupByAnswer(inmobiliarioLeads, 'origin'));

  // Visibility toggle by current source filter
  const filter = state.filters.source;
  document.querySelectorAll('[data-niche]').forEach((el) => {
    const niche = el.dataset.niche;
    let visible = false;
    if (filter === 'landing-contadores')   visible = (niche === 'contadores');
    else if (filter === 'landing-inmobiliario') visible = (niche === 'inmobiliario');
    el.hidden = !visible;
  });

  renderFunnel();
}

function groupBy(rows, key, fallback = '—', mapLabel = null) {
  const out = {};
  for (const r of rows) {
    const raw = r[key];
    const v = (raw == null || raw === '')
      ? fallback
      : (mapLabel ? mapLabel(raw) : String(raw));
    out[v] = (out[v] || 0) + 1;
  }
  return out;
}

/* Agrupa por la respuesta completa del formulario, no por el
   valor abreviado que se guarda en Firestore. */
function groupByAnswer(rows, key) {
  return groupBy(rows, key, 'Sin responder', (raw) => labelOf(key, raw));
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
  if (sub) sub.textContent = `visitas, aperturas y leads (${periodLabel()})`;
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
    tbody.innerHTML = '<tr class="leads__empty"><td colspan="9">Sin resultados.</td></tr>';
    $('leadsCount').textContent = `0 de ${state.leads.length}`;
    return;
  }

  tbody.innerHTML = rows.map((l) => {
    const ms     = l.created_at?.toMillis?.();
    const when   = ms ? tzFmt.format(new Date(ms)) : '—';
    const status = l.status || 'new';
    const waOk   = l.crm_whatspro?.primary?.ok || l.crm_whatspro?.fallback?.ok;
    const waAtt  = !!l.crm_whatspro;
    const waCls  = !waAtt ? 'wa--wait' : (waOk ? 'wa--ok' : 'wa--fail');
    const waIco  = !waAtt ? '…' : (waOk ? '✓' : '✗');
    const badge  = sourceBadge(l.source);
    const score  = qualificationScore(l);
    const dots   = qualificationDots(score);

    return `
      <tr data-id="${l.id}">
        <td>${escapeHtml(when)}</td>
        <td><strong>${escapeHtml(l.name || '—')}</strong></td>
        <td>${escapeHtml(l.phone || '—')}</td>
        <td>${escapeHtml(l.company || '—')}</td>
        <td class="leads__answers">${answerChips(l)}</td>
        <td>${badge}</td>
        <td><button class="msg-copy" data-id="${l.id}" title="Calidad ${score}/3. Clic para copiar mensaje de WhatsApp">${dots}</button></td>
        <td><span class="wa ${waCls}" title="WhatsApp">${waIco}</span></td>
        <td><span class="pill pill--${status}">${statusLabel(status)}</span></td>
      </tr>`;
  }).join('');

  tbody.querySelectorAll('tr[data-id]').forEach((tr) => {
    tr.addEventListener('click', (e) => {
      // Don't open drawer if user clicked the copy button
      if (e.target.closest('.msg-copy')) return;
      openDrawer(tr.dataset.id);
    });
  });

  tbody.querySelectorAll('.msg-copy').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const lead = state.leads.find((l) => l.id === btn.dataset.id);
      if (!lead) return;
      const text = buildWhatsAppMessage(lead);
      try {
        await navigator.clipboard.writeText(text);
        btn.classList.add('is-copied');
        const orig = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg>';
        toast('Mensaje copiado.');
        setTimeout(() => {
          btn.classList.remove('is-copied');
          btn.innerHTML = orig;
        }, 1800);
      } catch (err) {
        toast('No se pudo copiar: ' + err.message, 'error');
      }
    });
  });

  $('leadsCount').textContent = rows.length === state.leads.length
    ? `${fmtInt(rows.length)} lead${rows.length === 1 ? '' : 's'}`
    : `${fmtInt(rows.length)} de ${fmtInt(state.leads.length)}`;
}

/* Chips con la respuesta completa de cada pregunta.
   El title muestra "Pregunta → Respuesta" al pasar el mouse. */
function answerChips(l) {
  const answered = answersOf(l).filter((a) => a.answer);
  if (answered.length === 0) {
    return '<span class="answer-chip answer-chip--none">Sin respuestas</span>';
  }
  return answered.map((a) => `
    <span class="answer-chip" title="${escapeHtml(a.question + ' → ' + a.answer)}">
      <i>${escapeHtml(a.short)}</i>${escapeHtml(a.answer)}
    </span>`).join('');
}

function applyFiltersAndSort(leads) {
  const { search, source, status, fields } = state.filters;
  const s = search.trim().toLowerCase();
  const fieldPairs = Object.entries(fields || {});
  let out = leads.filter((l) => {
    if (source && l.source !== source) return false;
    if (status && (l.status || 'new') !== status) return false;
    for (const [key, val] of fieldPairs) {
      if (l[key] !== val) return false;
    }
    if (!s) return true;
    // Busca también dentro de las respuestas ya traducidas
    const answers = answersOf(l).map((a) => a.answer).join(' ').toLowerCase();
    return (
      (l.name    || '').toLowerCase().includes(s) ||
      (l.phone   || '').toLowerCase().includes(s) ||
      (l.company || '').toLowerCase().includes(s) ||
      (l.email   || '').toLowerCase().includes(s) ||
      answers.includes(s)
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

/* ── Niche helpers ───────────────────────────────────── */
function leadNiche(source) {
  if (source === 'landing-contadores')   return 'contadores';
  if (source === 'landing-inmobiliario') return 'inmobiliario';
  return 'marketing';
}

/* Qualification score: cuántas preguntas del formulario respondió */
function qualificationScore(l) {
  return fieldsOf(leadNiche(l.source)).reduce((n, f) => n + (l[f.key] ? 1 : 0), 0);
}

function qualificationDots(score) {
  let html = '<span class="msg-dots">';
  for (let i = 0; i < 3; i++) {
    html += `<i class="msg-dot${i < score ? ' is-on' : ''}"></i>`;
  }
  html += '</span>';
  return html;
}

/* Etiquetas legibles para los metadatos del lead */
function sourceLabel(source) {
  return ({
    'landing-puntoalto':    'Landing principal (puntoalto.com.py)',
    'landing-contadores':   'Landing Contadores',
    'landing-inmobiliario': 'Landing Inmobiliario'
  })[source] || source || '';
}

function ctaLabel(cta) {
  if (!cta) return '';
  return ({
    'navbar':        'Botón del menú superior',
    'navbar-mobile': 'Botón del menú superior (celular)',
    'hero':          'Botón principal del inicio',
    'paraguay':      'Sección "El país ya despegó"',
    'plan-starter':  'Card de precios · Setup único',
    'plan-custom':   'Card de precios · Plan a medida',
    'cta-final':     'Llamado final de la página',
    'exit_popup':    'Popup de salida',
    'exit-popup':    'Popup de salida',
    'unknown':       'No identificado'
  })[cta] || cta;
}

function localeLabel(loc) {
  if (!loc) return '';
  return ({ es: 'Español', en: 'Inglés', pt: 'Portugués' })[String(loc).slice(0, 2)] || loc;
}

function sourceBadge(source) {
  const n = leadNiche(source);
  const label = ({
    'contadores':   'Contadores',
    'inmobiliario': 'Inmobiliario',
    'marketing':    (source || '—').replace('landing-', '') || '—'
  })[n];
  return `<span class="badge badge--${n}">${escapeHtml(label)}</span>`;
}

/* ══════════════════════════════════════════════════════
   FORM SCHEMA — la pregunta real de cada landing y la
   respuesta completa de cada opción, sin abreviaciones.
   Fuente única de verdad: tabla, drawer, donuts y CSV
   leen de acá. Los valores marcados (anterior) son de
   versiones previas del formulario y se mantienen para
   que los leads viejos sigan siendo legibles.
   ══════════════════════════════════════════════════════ */
const FORM_SCHEMA = {
  marketing: {
    label: 'Landing principal',
    fields: [
      {
        key: 'sector',
        short: 'Rubro',
        question: '¿En qué rubro está tu empresa?',
        options: {
          'inmobiliario':   'Inmobiliario',
          'salud-estetica': 'Salud & Estética',
          'educacion':      'Educación',
          'construccion':   'Construcción',
          'servicios':      'Servicios profesionales',
          'retail':         'Retail / e-commerce',
          'importadora':    'Importadora / Distribuidora',
          'otro':           'Otro'
        }
      },
      {
        key: 'challenge',
        short: 'Mayor desafío',
        question: '¿Cuál es tu mayor desafío hoy?',
        options: {
          'sin-web':         'No tiene sitio web profesional',
          'ads-sin-retorno': 'Hace anuncios pero no ve retorno',
          'leads-whatsapp':  'Pierde leads en WhatsApp',
          'sin-datos':       'No sabe qué funciona y qué no',
          'escalar':         'Quiere escalar pero no tiene estructura'
        }
      },
      {
        key: 'budget',
        short: 'Inversión en anuncios',
        question: '¿Cuánto podés invertir en anuncios por mes?',
        options: {
          'ads-hasta-600':  'Hasta USD 600 por mes en anuncios · mensualidad USD 300',
          'ads-600-1200':   'Entre USD 600 y 1.200 por mes en anuncios · mensualidad USD 300 a 600',
          'ads-1200-2500':  'Entre USD 1.200 y 2.500 por mes en anuncios · mensualidad USD 600 a 1.250',
          'ads-2500+':      'Más de USD 2.500 por mes en anuncios · mensualidad USD 1.250 o más',
          'no-claro':       'Todavía no lo tiene claro',
          // Rangos del formulario anterior (presupuesto total, no solo ads)
          '500-1000':  'USD 500 a 1.000 por mes (presupuesto total · formulario anterior)',
          '1000-2000': 'USD 1.000 a 2.000 por mes (presupuesto total · formulario anterior)',
          '2000+':     'Más de USD 2.000 por mes (presupuesto total · formulario anterior)'
        }
      }
    ]
  },

  contadores: {
    label: 'Landing Contadores',
    fields: [
      {
        key: 'clients',
        short: 'Cartera de clientes',
        question: '¿Cuántos clientes manejás?',
        options: {
          '1-10':  'Entre 1 y 10 clientes',
          '11-30': 'Entre 11 y 30 clientes',
          '31-50': 'Entre 31 y 50 clientes',
          '50+':   'Más de 50 clientes'
        }
      },
      {
        key: 'software',
        short: 'Software contable actual',
        question: '¿Qué software contable usás hoy?',
        options: {
          'excel':    'Excel / planillas',
          'tango':    'Tango Gestión',
          'bejerman': 'Bejerman',
          'memory':   'Memory',
          'mixto':    'Excel combinado con algún sistema',
          'ninguno':  'Ninguno por ahora'
        }
      },
      {
        key: 'pain',
        short: 'Mayor desafío',
        question: '¿Cuál es tu mayor desafío hoy?',
        options: {
          'sobrecarga':   'Su equipo está sobrecargado',
          'sifen':        'Migrar a factura electrónica (SIFEN)',
          'conciliacion': 'Conciliación bancaria manual',
          'dnit':         'Cumplir los plazos del DNIT',
          'captacion':    'Captar más clientes',
          'modernizar':   'Modernizar todo el estudio'
        }
      }
    ]
  },

  inmobiliario: {
    label: 'Landing Inmobiliario',
    fields: [
      {
        key: 'operation',
        short: 'Necesidad principal',
        question: '¿Qué necesitás primero?',
        options: {
          'pagina-emprendimiento': 'Página para un emprendimiento específico',
          'catalogo':              'Catálogo de inmuebles disponibles',
          'ambos':                 'Ambos: página del emprendimiento + catálogo',
          'no-se':                 'Todavía no está seguro',
          // Opciones del formulario anterior
          'venta-nueva': 'Venta de inmuebles nuevos (formulario anterior)',
          'venta-usado': 'Venta de inmuebles usados (formulario anterior)',
          'alquiler':    'Alquiler (formulario anterior)',
          'inversion':   'Inversión / renta (formulario anterior)',
          'mixto':       'Operación mixta (formulario anterior)'
        }
      },
      {
        key: 'team',
        short: 'Unidades para publicar',
        question: '¿Cuántos inmuebles o unidades tenés para publicar?',
        options: {
          'menos-10': 'Menos de 10 unidades',
          '10-30':    'Entre 10 y 30 unidades',
          '30-100':   'Entre 30 y 100 unidades',
          '100+':     'Más de 100 unidades',
          // Tamaño de equipo del formulario anterior
          '1':    'Solo el dueño (tamaño de equipo · formulario anterior)',
          '2-5':  'Entre 2 y 5 corredores (formulario anterior)',
          '6-15': 'Entre 6 y 15 corredores (formulario anterior)',
          '15+':  'Cadena de más de 15 corredores (formulario anterior)'
        }
      },
      {
        key: 'origin',
        short: 'Origen actual de leads',
        question: '¿De dónde vienen tus leads hoy?',
        options: {
          'meta':       'Meta Ads (Facebook / Instagram)',
          'google':     'Google Ads',
          'portales':   'Portales (InfoCasas, Clasipar)',
          'indicacion': 'Solo indicación / boca a boca',
          'walkin':     'Walk-in / cartel en obra',
          'nada':       'Nada estructurado todavía'
        }
      }
    ]
  }
};

/* Todos los campos del schema, indexados por clave */
const FIELD_INDEX = {};
for (const niche of Object.keys(FORM_SCHEMA)) {
  for (const f of FORM_SCHEMA[niche].fields) FIELD_INDEX[f.key] = f;
}

const fieldsOf = (niche) => (FORM_SCHEMA[niche] || FORM_SCHEMA.marketing).fields;

/* Respuesta completa de un valor crudo. Si el valor no está
   en el schema (lead viejo, texto libre), se muestra tal cual. */
function labelOf(field, raw) {
  if (raw == null || raw === '') return '';
  const def = FIELD_INDEX[field];
  return (def && def.options[raw]) || String(raw);
}

/* Pregunta + respuesta de cada campo del formulario que el
   lead completó, en el orden en que las respondió. */
function answersOf(lead) {
  return fieldsOf(leadNiche(lead.source)).map((f) => ({
    key:      f.key,
    short:    f.short,
    question: f.question,
    raw:      lead[f.key] || '',
    answer:   labelOf(f.key, lead[f.key])
  }));
}

/* WhatsApp first-message templates per niche */
function buildWhatsAppMessage(l) {
  const firstName = (l.name || '').split(' ')[0] || 'allá';
  const niche = leadNiche(l.source);

  if (niche === 'contadores') {
    const sw   = labelOf('software', l.software);
    const cli  = labelOf('clients', l.clients);
    const pain = labelOf('pain', l.pain);
    const ctx  = [cli, sw && `trabajando con ${sw}`].filter(Boolean).join(', ');
    const dor  = pain ? ` Anotaste como principal desafío: "${pain}". Tenemos varios casos así ya resueltos.` : '';
    return `Hola ${firstName}! Soy de Punto Alto, vi que llenaste el diagnóstico para tu estudio${ctx ? ` (${ctx})` : ''}.${dor}\n\n¿Te queda bien una llamada de 30 min esta semana? Te muestro cómo quedaría tu operación automatizada y qué números esperar.`;
  }

  if (niche === 'inmobiliario') {
    const op   = labelOf('operation', l.operation);
    const team = labelOf('team', l.team);
    const orig = labelOf('origin', l.origin);
    const ctx  = [op && op.toLowerCase(), team && team.toLowerCase()].filter(Boolean).join(', ');
    const cap  = orig ? ` Hoy captás sobre todo por ${orig.toLowerCase()}: podemos potenciar eso o sumar canales nuevos.` : '';
    return `Hola ${firstName}! Soy de Punto Alto, vi que pediste el diagnóstico para tu inmobiliaria${ctx ? ` (${ctx})` : ''}.${cap}\n\n¿Te queda bien una llamada de 30 min esta semana? Te muestro el funnel completo y qué números esperar en los próximos 90 días.`;
  }

  // Landing principal
  const sector    = labelOf('sector', l.sector);
  const challenge = labelOf('challenge', l.challenge);
  const budget    = labelOf('budget', l.budget);
  const ctx = sector ? ` para ${sector.toLowerCase()}` : '';
  const dor = challenge ? ` Anotaste como principal desafío: "${challenge}".` : '';
  const inv = budget && l.budget !== 'no-claro'
    ? ' Con la inversión que marcaste ya podemos armar un plan concreto.'
    : '';
  return `Hola ${firstName}! Soy de Punto Alto, vi que pediste tu diagnóstico digital${ctx}.${dor}${inv}\n\n¿Te queda bien una llamada de 30 min esta semana? Te muestro cómo quedaría tu sitio y tu funnel, y qué números esperar.`;
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
  state.filters.fields = {};      // las respuestas cambian según la landing
  renderAnswerFilters();
  renderTable();
  renderCharts();
});
$('filterStatus').addEventListener('change', (e) => {
  state.filters.status = e.target.value;
  renderTable();
});

/* Un filtro por pregunta de la landing seleccionada, con las
   respuestas escritas completas. Sin landing elegida no se
   muestran, porque cada una pregunta cosas distintas. */
function renderAnswerFilters() {
  const box = $('answerFilters');
  if (!box) return;

  const niche = ({
    'landing-puntoalto':    'marketing',
    'landing-contadores':   'contadores',
    'landing-inmobiliario': 'inmobiliario'
  })[state.filters.source];

  if (!niche) { box.innerHTML = ''; return; }

  box.innerHTML = fieldsOf(niche).map((f) => `
    <select class="input" data-answer-filter="${f.key}" aria-label="${escapeHtml(f.question)}" title="${escapeHtml(f.question)}">
      <option value="">${escapeHtml(f.short)}: todas</option>
      ${Object.entries(f.options).map(([v, label]) =>
        `<option value="${escapeHtml(v)}">${escapeHtml(label)}</option>`).join('')}
    </select>`).join('');

  box.querySelectorAll('[data-answer-filter]').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      const key = sel.dataset.answerFilter;
      if (e.target.value) state.filters.fields[key] = e.target.value;
      else delete state.filters.fields[key];
      renderTable();
    });
  });
}
renderAnswerFilters();

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

  // Una columna por pregunta de cada landing, con la respuesta
  // completa. Así el CSV se lee sin necesidad de decodificar nada.
  const questionCols = [];
  for (const niche of Object.keys(FORM_SCHEMA)) {
    for (const f of FORM_SCHEMA[niche].fields) {
      questionCols.push({ niche, key: f.key, header: `${FORM_SCHEMA[niche].label} — ${f.short}` });
    }
  }

  const cols = [
    'ID', 'Fecha', 'Nombre', 'Teléfono', 'Email', 'Empresa',
    'Landing de origen', 'Botón que abrió el formulario', 'Estado',
    ...questionCols.map((c) => c.header),
    'Preguntas respondidas', 'WhatsApp enviado', 'Idioma', 'Página', 'Referrer'
  ];
  const escape = (s) => {
    const v = s == null ? '' : String(s);
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  };
  const lines = [cols.join(',')];
  for (const l of rows) {
    const ms = l.created_at?.toMillis?.();
    const waOk = !!(l.crm_whatspro?.primary?.ok || l.crm_whatspro?.fallback?.ok);
    const niche = leadNiche(l.source);
    lines.push([
      l.id,
      ms ? tzFmt.format(new Date(ms)) : '',
      l.name, l.phone, l.email, l.company,
      sourceLabel(l.source), ctaLabel(l.cta_origin), statusLabel(l.status || 'new'),
      // Solo se llena la columna de la landing a la que pertenece el lead
      ...questionCols.map((c) => (c.niche === niche ? labelOf(c.key, l[c.key]) : '')),
      `${qualificationScore(l)} de ${fieldsOf(niche).length}`,
      waOk ? 'Sí' : (l.crm_whatspro ? 'No' : 'Sin intento'),
      localeLabel(l.locale || l.lang), l.page_url, l.referrer
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

  const copyBtn = drawerBody.querySelector('.copy-wa-btn');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const text = copyBtn.dataset.waText || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.classList.add('is-copied');
      copyBtn.querySelector('span').textContent = '✓ Copiado al portapapeles';
      toast('Mensaje copiado.');
      setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        copyBtn.querySelector('span').textContent = 'Copiar mensaje personalizado';
      }, 2200);
    } catch (err) {
      toast('No se pudo copiar: ' + err.message, 'error');
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

  const niche = leadNiche(l.source);
  const nicheBadge = sourceBadge(l.source);
  const waMessage  = buildWhatsAppMessage(l);

  // Preguntas del formulario con la respuesta completa, tal
  // como el lead las vio y las respondió.
  const answers   = answersOf(l);
  const answered  = answers.filter((a) => a.answer).length;
  const qualBlock = `
    <div class="drawer__section">
      <h3>Respuestas del formulario</h3>
      <p class="drawer__hint">${FORM_SCHEMA[niche].label} · respondió ${answered} de ${answers.length} preguntas</p>
      <ol class="qa">
        ${answers.map((a, i) => `
          <li class="qa__item${a.answer ? '' : ' qa__item--empty'}">
            <span class="qa__num">${i + 1}</span>
            <div class="qa__body">
              <p class="qa__q">${escapeHtml(a.question)}</p>
              <p class="qa__a">${a.answer ? escapeHtml(a.answer) : 'No respondió esta pregunta'}</p>
              ${a.raw && a.raw !== a.answer
                ? `<p class="qa__raw">valor guardado: <code>${escapeHtml(a.raw)}</code></p>`
                : ''}
            </div>
          </li>`).join('')}
      </ol>
    </div>`;

  return `
    <div class="drawer__section">
      <h3>Estado</h3>
      <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap; margin-bottom: 0.6rem;">
        ${nicheBadge}
        <span class="pill pill--${status}">${statusLabel(status)}</span>
      </div>
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

    ${qualBlock}

    <div class="drawer__section">
      <h3>Primer mensaje de WhatsApp</h3>
      <button class="copy-wa-btn" data-wa-text="${escapeHtml(waMessage)}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        <span>Copiar mensaje personalizado</span>
      </button>
      <div class="copy-wa-preview">${escapeHtml(waMessage)}</div>
    </div>

    ${waBlock}

    <div class="drawer__section">
      <h3>Meta</h3>
      ${row('Creado', when, true)}
      ${row('Landing de origen', sourceLabel(l.source))}
      ${row('Botón que abrió el formulario', ctaLabel(l.cta_origin))}
      ${row('Idioma del visitante', localeLabel(l.locale || l.lang))}
      ${row('Página', l.page_url, true)}
      ${row('Referrer', l.referrer, true)}
      ${row('User Agent', l.user_agent, true)}
      ${row('ID', l.id, true)}
    </div>`;
}
