/* ════════════════════════════════════════════════════════
   PUNTO ALTO PARA CONTADORES — JS
   ════════════════════════════════════════════════════════ */

/* ── Theme ─────────────────────────────────────────── */
(function () {
  const KEY = 'pa-theme';
  function detect() {
    try {
      const s = localStorage.getItem(KEY);
      if (s === 'dark' || s === 'light') return s;
    } catch(e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }
  function apply(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch(e) {}
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-label',
      t === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro');
  }
  apply(detect());

  const bind = () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    let rot = 0;
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') || 'light';
      apply(cur === 'light' ? 'dark' : 'light');
      rot += 360;
      btn.style.transform = 'rotate(' + rot + 'deg)';
    });
    window.addEventListener('storage', (e) => {
      if (e.key === KEY && e.newValue) apply(e.newValue);
    });
  };
  if (document.readyState !== 'loading') bind();
  else document.addEventListener('DOMContentLoaded', bind, { once: true });
})();

/* ── Navbar scroll ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Hamburger
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('navMobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = !mobileMenu.hidden;
      mobileMenu.hidden = open;
      burger.classList.toggle('is-open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.hidden = true;
        burger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

/* ── Scroll reveal ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(el => {
      if (el.isIntersecting) {
        el.target.classList.add('visible');
        observer.unobserve(el.target);
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.js-reveal').forEach(el => observer.observe(el));
});

/* ── Counter animation ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('[data-counter]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      obs.unobserve(el);
      const target = +el.dataset.counter;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const step = target / (dur / 16);
      let cur = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = prefix + Math.floor(cur) + suffix;
        if (cur >= target) clearInterval(timer);
      }, 16);
    });
  }, { threshold: 0.3 });
  counters.forEach(el => obs.observe(el));
});

/* ── Terminal typing animation ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const cmdEl = document.getElementById('termCmd');
  const outEl = document.getElementById('termOutput');
  if (!cmdEl || !outEl) return;

  const lines = [
    { cmd: 'punto-alto factura --generar --ruc 80012345-6', delay: 1500 },
    { out: '<span class="t-ok">✓</span> Factura electrónica generada: 001-001-0000147', delay: 600 },
    { out: '<span class="t-info">→</span> Timbrado SIFEN: 15847293', delay: 400 },
    { out: '<span class="t-info">→</span> XML firmado digitalmente', delay: 400 },
    { out: '<span class="t-ok">✓</span> Enviado al DNIT — respuesta: APROBADO', delay: 600 },
    { out: '', delay: 300 },
    { cmd: 'punto-alto ruc --consultar 80000011-5', delay: 1200 },
    { out: '<span class="t-ok">✓</span> ITAIPU BINACIONAL', delay: 500 },
    { out: '<span class="t-dim">  Estado: ACTIVO | Obligaciones: IRE, IVA</span>', delay: 400 },
    { out: '', delay: 300 },
    { cmd: 'punto-alto conciliacion --importar banco-continental.csv', delay: 1400 },
    { out: '<span class="t-ok">✓</span> 47 movimientos importados', delay: 500 },
    { out: '<span class="t-ok">✓</span> 44 conciliados automáticamente', delay: 400 },
    { out: '<span class="t-warn">!</span> 2 con diferencias — revisar', delay: 400 },
    { out: '<span class="t-warn">!</span> 1 sin registro contable', delay: 400 },
    { out: '', delay: 300 },
    { cmd: 'punto-alto noticias --hoy', delay: 1000 },
    { out: '<span class="t-info">→</span> DNIT Res. 47/2026: reporte cripto obligatorio', delay: 500 },
    { out: '<span class="t-info">→</span> SIFEN: Grupo 16 desde 1 Jun 2026', delay: 400 },
    { out: '<span class="t-warn">!</span> IDU: vencimiento 12 Abr 2026', delay: 400 },
  ];

  let cursorEl = cmdEl.parentElement.querySelector('.t-cursor');
  let i = 0;

  function typeCmd(text, cb) {
    cmdEl.textContent = '';
    if (cursorEl) cursorEl.style.display = '';
    let j = 0;
    const interval = setInterval(() => {
      cmdEl.textContent += text[j];
      j++;
      if (j >= text.length) {
        clearInterval(interval);
        if (cursorEl) cursorEl.style.display = 'none';
        cb();
      }
    }, 30);
  }

  function nextLine() {
    if (i >= lines.length) {
      // Loop
      setTimeout(() => {
        outEl.innerHTML = '';
        i = 0;
        nextLine();
      }, 3000);
      return;
    }

    const line = lines[i];
    i++;

    if (line.cmd) {
      typeCmd(line.cmd, () => {
        setTimeout(nextLine, line.delay || 500);
      });
    } else if (line.out !== undefined) {
      if (line.out) {
        outEl.innerHTML += '<div>' + line.out + '</div>';
      } else {
        outEl.innerHTML += '<div>&nbsp;</div>';
      }
      setTimeout(nextLine, line.delay || 300);
    }
  }

  // Start after a brief delay
  setTimeout(nextLine, 1200);
});

/* ══════════════════════════════════════════════════════
   FACTURA LEGAL DEMO
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnGenFactura');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const ruc = document.getElementById('fac-ruc').value || '80012345-6';
    const nombre = document.getElementById('fac-nombre').value || 'Empresa Ejemplo S.A.';
    const concepto = document.getElementById('fac-concepto').value || 'Servicio contable';
    const montoStr = document.getElementById('fac-monto').value || '3.500.000';
    const iva = document.getElementById('fac-iva').value;
    const condicion = document.getElementById('fac-condicion').value;

    // Parse amount
    const monto = parseInt(montoStr.replace(/\D/g, '')) || 3500000;
    const ivaRate = parseInt(iva) / 100;
    const subtotal = Math.round(monto / (1 + ivaRate));
    const ivaTotal = monto - subtotal;

    // Generate random timbrado and number
    const timbrado = (15000000 + Math.floor(Math.random() * 999999)).toString();
    const num = '001-001-' + String(Math.floor(Math.random() * 9999) + 100).padStart(7, '0');
    const cdc = '01' + ruc.replace(/\D/g, '').padEnd(10, '0') +
                num.replace(/-/g, '') +
                new Date().toLocaleDateString('es-PY', {day:'2-digit', month:'2-digit', year:'numeric'}).replace(/\//g, '');

    // Show generating overlay
    const genEl = document.getElementById('facGenerating');
    genEl.classList.add('is-active');

    setTimeout(() => {
      // Update preview
      document.getElementById('facClienteRuc').textContent = ruc;
      document.getElementById('facClienteNombre').textContent = nombre;
      document.getElementById('facConceptoOut').textContent = concepto;
      document.getElementById('facPrecioOut').textContent = 'Gs. ' + monto.toLocaleString('es-PY');
      document.getElementById('facIvaOut').textContent = iva + '%';
      document.getElementById('facTotalLinea').textContent = 'Gs. ' + monto.toLocaleString('es-PY');
      document.getElementById('facSubtotal').textContent = 'Gs. ' + subtotal.toLocaleString('es-PY');
      document.getElementById('facIvaTotal').textContent = 'Gs. ' + ivaTotal.toLocaleString('es-PY');
      document.getElementById('facTotal').textContent = 'Gs. ' + monto.toLocaleString('es-PY');
      document.getElementById('facTimbrado').textContent = 'Timbrado: ' + timbrado;
      document.getElementById('facNumero').textContent = num;
      document.getElementById('facCondicion').textContent = condicion === 'contado' ? 'Contado' : 'Crédito';
      document.getElementById('facFecha').textContent = new Date().toLocaleDateString('es-PY');
      document.getElementById('facCDC').textContent = cdc;

      genEl.classList.remove('is-active');
    }, 2000);
  });
});

/* ══════════════════════════════════════════════════════
   RUC LOOKUP — TuRuc API (turuc.com.py) — REAL DATA
   Base: https://turuc.com.py/api/contribuyente
   GET /{ruc}            → single contribuyente
   GET /search?search=X  → list
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const API = 'https://turuc.com.py/api/contribuyente';

  const input = document.getElementById('rucInput');
  const btnSearch = document.getElementById('btnRucSearch');
  const resultEl = document.getElementById('rucResult');
  const loadingEl = document.getElementById('rucLoading');
  const errorEl = document.getElementById('rucError');

  if (!input || !btnSearch) return;

  // Normaliza RUC: si el usuario escribe solo dígitos (ej: 800137370),
  // inserta el guión antes del último dígito → 80013737-0
  // La API de TuRuc requiere el formato XXXXXXXX-D con guión.
  function normalizeRuc(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length >= 2 && !raw.includes('-')) {
      return digits.slice(0, -1) + '-' + digits.slice(-1);
    }
    return raw;
  }

  function hideAll() {
    resultEl.hidden = true;
    loadingEl.hidden = true;
    if (errorEl) errorEl.hidden = true;
  }

  async function doSearch() {
    const rawQuery = input.value.trim();
    if (!rawQuery || rawQuery.length < 2) {
      hideAll();
      showRucError('Ingresá al menos 2 caracteres para buscar.');
      return;
    }

    hideAll();
    loadingEl.hidden = false;

    try {
      const isRuc = /^\d/.test(rawQuery);
      const query = isRuc ? normalizeRuc(rawQuery) : rawQuery;
      const url = isRuc
        ? API + '/' + encodeURIComponent(query)
        : API + '/search?search=' + encodeURIComponent(query) + '&page=0';

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(res.status === 404 ? 'not_found' : 'error');
      }

      const json = await res.json();
      let record = null;

      if (isRuc) {
        record = json.data || null;
      } else {
        const list = json.data?.contribuyentes || [];
        if (list.length > 0) {
          record = list[0];
        }
      }

      hideAll();

      if (record) {
        document.getElementById('rucResultRuc').textContent = record.ruc || '—';
        document.getElementById('rucResultNombre').textContent = record.razonSocial || '—';
        document.getElementById('rucResultFantasia').textContent = record.estado || '—';
        document.getElementById('rucResultEstado').textContent =
          record.estado === 'ACTIVO' ? 'Habilitado' :
          record.estado === 'CANCELADO' ? 'Cancelado' :
          record.estado === 'BLOQUEADO' ? 'Bloqueado' :
          record.estado === 'SUSPENSION TEMPORAL' ? 'Suspendido temporalmente' :
          record.estado || '—';
        document.getElementById('rucResultOblig').textContent =
          record.esEntidadPublica ? 'Entidad Pública' :
          record.esPersonaJuridica ? 'Persona Jurídica' : 'Persona Física';
        document.getElementById('rucResultActividad').textContent =
          'Doc: ' + (record.doc || '—') + ' | DV: ' + (record.dv ?? '—');
        resultEl.hidden = false;
      } else {
        showRucError('No se encontró ningún contribuyente con ese dato.');
      }

    } catch (err) {
      hideAll();
      if (err.message === 'not_found') {
        showRucError('RUC no encontrado en el registro del DNIT.');
      } else {
        showRucError('Error al consultar. Intentá de nuevo en unos segundos.');
      }
    }
  }

  function showRucError(msg) {
    if (errorEl) {
      const span = errorEl.querySelector('span');
      if (span) {
        span.textContent = msg;
      } else {
        errorEl.textContent = msg;
      }
      errorEl.hidden = false;
    }
  }

  // Only search on button click or Enter — never automatically
  btnSearch.addEventListener('click', doSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); doSearch(); }
  });

  // Chip shortcuts — fill input but user still needs to click
  document.querySelectorAll('.ruc-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.ruc;
      input.focus();
      doSearch();
    });
  });
});

/* ══════════════════════════════════════════════════════
   NEWS — Dynamic loader + tabs
   ══════════════════════════════════════════════════════
   1) Tenta carregar notícias frescas do webhook n8n
   2) Se conseguir, injeta acima das estáticas
   3) Se falhar, mantém as estáticas como estão
   4) Tabs filtram tanto dinâmicas quanto estáticas
   ══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // ── CONFIG: URL do webhook n8n ──
  // Trocar pela URL real do seu n8n após importar o workflow
  const NEWS_API = 'https://primary-production-56156.up.railway.app/webhook/noticias-contadores';

  const grid = document.getElementById('newsGrid');
  const sourceEl = document.querySelector('.news-source');

  // ── Fetch e renderizar notícias dinâmicas ──
  async function loadDynamicNews() {
    try {
      const res = await fetch(NEWS_API, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return;

      const data = await res.json();
      if (!data.noticias || data.noticias.length === 0) return;

      // Filtrar notícias irrelevantes (política de privacidade, etc.)
      const blocklist = ['politica de privacidad', 'politicas de privacidad', 'cookies', 'términos y condiciones'];
      const filtered = data.noticias.filter(n => {
        const lower = n.title.toLowerCase();
        return !blocklist.some(b => lower.includes(b));
      });

      if (filtered.length === 0) return;

      // Criar container para notícias dinâmicas
      const dynamicCards = filtered.map(n => createNewsCard(n));

      // Inserir no topo do grid, antes das estáticas
      const firstStatic = grid.querySelector('.news-card');
      dynamicCards.forEach(card => {
        grid.insertBefore(card, firstStatic);
      });

      // Atualizar texto de fonte
      if (sourceEl && data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        const timeStr = date.toLocaleString('es-PY', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        });
        const span = sourceEl.querySelector('span');
        if (span) {
          span.innerHTML = 'Fuentes: <strong>dnit.gov.py</strong> · <strong>abc.com.py</strong> · Última actualización automática: ' + timeStr;
        }
      }

      // Re-bind tabs para incluir novos cards
      bindTabs();

    } catch (e) {
      // Silently fail — static news remain visible
    }
  }

  function createNewsCard(noticia) {
    const card = document.createElement('a');
    card.className = 'news-card js-reveal visible';
    card.dataset.category = noticia.category || 'fiscal';
    card.dataset.dynamic = 'true';
    card.href = noticia.url || '#';
    card.target = '_blank';
    card.rel = 'noopener';

    const sourceLabel = noticia.source || 'Noticias';
    const sourceDomain = noticia.url ? new URL(noticia.url).hostname.replace('www.', '') : '';

    card.innerHTML =
      '<div class="news-card__meta">' +
        '<span class="news-card__source">' + escHtml(sourceLabel) + '</span>' +
        '<time>' + escHtml(noticia.date || '') + '</time>' +
        '<span class="news-card__live-badge">Auto</span>' +
      '</div>' +
      '<h3>' + escHtml(noticia.title) + '</h3>' +
      (noticia.summary ? '<p>' + escHtml(noticia.summary) + '</p>' : '') +
      '<span class="news-card__link">Leer en ' + escHtml(sourceDomain) + ' →</span>';

    return card;
  }

  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  // ── Tabs ──
  function bindTabs() {
    const tabs = document.querySelectorAll('.news-tab');
    const cards = document.querySelectorAll('.news-card');

    tabs.forEach(tab => {
      // Remove old listeners by cloning
      const newTab = tab.cloneNode(true);
      tab.parentNode.replaceChild(newTab, tab);

      newTab.addEventListener('click', () => {
        document.querySelectorAll('.news-tab').forEach(t => t.classList.remove('active'));
        newTab.classList.add('active');

        const cat = newTab.dataset.tab;
        document.querySelectorAll('.news-card').forEach(card => {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'none';
            });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Init
  bindTabs();
  loadDynamicNews();
});

/* ══════════════════════════════════════════════════════
   FORM OVERLAY (simplified for contadores)
   ══════════════════════════════════════════════════════ */
(function () {
  const STEPS = [
    { id: 1, field: 'f-name',    required: true,  type: 'text'   },
    { id: 2, field: 'f-phone',   required: true,  type: 'tel'    },
    { id: 3, field: 'f-company', required: true,  type: 'text'   },
    { id: 4, field: 'rg-clients',   required: true,  type: 'radio'  },
    { id: 5, field: 'rg-interest',  required: true,  type: 'radio'  },
    { id: 6, field: null,        required: false, type: 'success' },
  ];
  const TOTAL = STEPS.filter(s => s.type !== 'success').length;

  const overlay = document.getElementById('formx');
  if (!overlay) return;

  const bar      = document.getElementById('fxBar');
  const counter  = document.getElementById('fxCounter');
  const backBtn  = document.getElementById('fxBack');
  const dotsEl   = document.getElementById('fxDots');
  const closeBtn = document.getElementById('fxClose');
  const doneBtn  = document.getElementById('fxDone');

  let current = 1;
  let animating = false;

  // Funnel tracking state
  let sessionId    = null;
  let formOpenAt   = 0;
  let ctaOrigin    = 'unknown';
  let maxStep      = 0;
  let pathArr      = [];
  let hasSubmitted = false;

  function elapsed() { return formOpenAt ? Date.now() - formOpenAt : 0; }

  function open(source) {
    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';

    // Reset funnel session
    sessionId    = window.paFirebase?.newSessionId?.() || null;
    formOpenAt   = Date.now();
    ctaOrigin    = source || 'unknown';
    maxStep      = 0;
    pathArr      = [];
    hasSubmitted = false;

    if (sessionId) {
      window.paFirebase?.trackFormEvent?.('opened', {
        sessionId,
        source:     'landing-contadores',
        cta_origin: ctaOrigin
      });
    }

    goTo(1);
    buildDots();
    setTimeout(() => focusStep(1), 420);
    document.addEventListener('keydown', onKey);
  }

  function close() {
    if (sessionId && !hasSubmitted && maxStep >= 1 && maxStep < TOTAL) {
      window.paFirebase?.trackFormEvent?.('abandoned', {
        sessionId,
        durationMs: elapsed()
      });
    }

    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    setTimeout(() => {
      overlay.setAttribute('hidden', '');
      current = 1;
    }, 420);
  }

  function goTo(target) {
    if (animating) return;
    animating = true;

    const cur = overlay.querySelector('.fxstep.is-active');
    if (cur) {
      cur.classList.remove('is-active');
      cur.style.opacity = '0';
      cur.style.transform = 'translateX(-30px)';
      setTimeout(() => { cur.style.transform = ''; cur.style.opacity = ''; }, 400);
    }

    const next = overlay.querySelector('[data-step="' + target + '"]');
    if (next) {
      next.style.opacity = '0';
      next.style.transform = 'translateX(30px)';
      requestAnimationFrame(() => {
        next.classList.add('is-active');
        requestAnimationFrame(() => {
          next.style.opacity = '';
          next.style.transform = '';
          setTimeout(() => { animating = false; }, 400);
        });
      });
    }

    current = target;
    updateUI();
    setTimeout(() => focusStep(target), 420);

    // Funnel: track step progression (TOTAL is count of non-success steps;
    // step TOTAL+1 is the success screen which we treat as 'submitted', tracked in submit())
    if (sessionId && !hasSubmitted && target >= 1 && target <= TOTAL) {
      if (!pathArr.length || pathArr[pathArr.length - 1] !== target) {
        pathArr.push(target);
        if (pathArr.length > 30) pathArr = pathArr.slice(-30);
      }
      if (target > maxStep) maxStep = target;
      window.paFirebase?.trackFormEvent?.('step', {
        sessionId,
        step:        target,
        maxStep,
        path:        pathArr,
        durationMs:  elapsed()
      });
    }
  }

  function focusStep(id) {
    const step = overlay.querySelector('[data-step="' + id + '"]');
    if (!step) return;
    const input = step.querySelector('input:not([type="radio"]), select');
    if (input) input.focus();
  }

  function updateUI() {
    const isSuccess = current === STEPS.length;
    bar.style.width = (isSuccess ? 100 : ((current - 1) / TOTAL) * 100) + '%';

    if (isSuccess) {
      counter.textContent = '';
      dotsEl.style.opacity = '0';
      backBtn.setAttribute('disabled', '');
    } else {
      counter.textContent = current + ' / ' + TOTAL;
      dotsEl.style.opacity = '1';
      updateDots();
      backBtn.toggleAttribute('disabled', current === 1);
    }
  }

  function buildDots() {
    dotsEl.innerHTML = '';
    for (let i = 1; i <= TOTAL; i++) {
      const dot = document.createElement('span');
      dot.className = 'fxdot' + (i === 1 ? ' active' : '');
      dotsEl.appendChild(dot);
    }
  }

  function updateDots() {
    dotsEl.querySelectorAll('.fxdot').forEach((d, i) => {
      d.classList.toggle('active', i + 1 === current);
    });
  }

  function validate(id) {
    const step = STEPS.find(s => s.id === id);
    if (!step || !step.required) return true;

    if (step.type === 'radio') {
      const checked = overlay.querySelector('#' + step.field + ' input:checked');
      if (!checked) {
        showErr('e-' + step.field.replace('rg-', ''), 'Elegí una opción.');
        return false;
      }
      clearErr('e-' + step.field.replace('rg-', ''));
      return true;
    }

    const input = document.getElementById(step.field);
    if (!input) return true;
    if (!input.value.trim()) {
      showErr('e-' + step.field.replace('f-', ''), 'Este campo es requerido.');
      input.classList.add('is-error');
      return false;
    }
    if (step.type === 'tel') {
      const digits = input.value.replace(/\D/g, '');
      if (digits.length < 7) {
        showErr('e-' + step.field.replace('f-', ''), 'Ingresá un número válido.');
        input.classList.add('is-error');
        return false;
      }
    }
    input.classList.remove('is-error');
    input.classList.add('is-valid');
    clearErr('e-' + step.field.replace('f-', ''));
    return true;
  }

  function showErr(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('visible'); }
  }
  function clearErr(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('visible'); }
  }

  function next() {
    if (!validate(current)) return;
    if (current < STEPS.length) {
      if (current === STEPS.length - 1) {
        submit();
      } else {
        goTo(current + 1);
      }
    }
  }

  async function submit() {
    const val  = (id) => (document.getElementById(id)?.value || '').trim();
    const radio= (name) => document.querySelector(`input[name="${name}"]:checked`)?.value || '';

    const firstName = val('f-name').split(' ')[0];
    const nameEl = document.getElementById('fxOkName');
    if (nameEl) nameEl.textContent = firstName;

    const phoneRaw    = val('f-phone');
    const phoneDigits = phoneRaw.replace(/\D/g, '');
    const payload = {
      name:      val('f-name'),
      phone:     phoneDigits ? '+595' + phoneDigits : '',
      phone_raw: phoneRaw,
      phone_country: 'PY',
      phone_dial:    '595',
      company:   val('f-company'),
      clients:   radio('clients'),
      interest:  radio('interest'),
      source:    'landing-contadores',
      page_url:  window.location.href,
      referrer:  document.referrer || '',
      user_agent: navigator.userAgent,
      submitted_at: new Date().toISOString()
    };

    console.log('[PUNTO ALTO — contadores] Lead →', payload);

    hasSubmitted = true;
    goTo(STEPS.length);

    const leadId = await window.paFirebase?.addLead?.(payload);

    if (sessionId) {
      window.paFirebase?.trackFormEvent?.('submitted', {
        sessionId,
        leadId:     leadId || '',
        durationMs: elapsed()
      });
    }
  }

  // Events
  overlay.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', next);
  });

  // Radio auto-advance
  overlay.querySelectorAll('.fxradios input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      setTimeout(next, 350);
    });
  });

  // Enter on inputs
  overlay.querySelectorAll('.fxinput').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); next(); }
    });
  });

  backBtn.addEventListener('click', () => {
    if (current > 1) goTo(current - 1);
  });

  closeBtn.addEventListener('click', close);
  if (doneBtn) doneBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  // Expose
  window.openContadoresForm = open;

  // Bind all CTA buttons
  const bindCtas = () => {
    document.querySelectorAll('[data-open-form]').forEach(btn => {
      if (btn.__paBound) return;
      btn.__paBound = true;
      btn.addEventListener('click', () => {
        const src = btn.getAttribute('data-open-form-source') || 'unknown';
        open(src);
      });
    });
  };
  document.addEventListener('DOMContentLoaded', bindCtas);
  if (document.readyState !== 'loading') bindCtas();
})();

/* ── Conciliacion row animation ────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const rows = document.querySelectorAll('.conc-row[data-match]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const rows = entry.target.closest('.conc-table')?.querySelectorAll('.conc-row[data-match]');
      if (!rows) return;
      rows.forEach((row, i) => {
        row.style.opacity = '0';
        row.style.transform = 'translateX(-12px)';
        setTimeout(() => {
          row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          row.style.opacity = '1';
          row.style.transform = 'none';
        }, i * 150);
      });
    });
  }, { threshold: 0.2 });

  if (rows.length) obs.observe(rows[0]);
});
