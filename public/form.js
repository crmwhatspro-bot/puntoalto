/* ══════════════════════════════════════════════════════
   Punto Alto — Conversational form overlay (lazy-loaded)
   ------------------------------------------------------
   Carregado dinamicamente no 1º clique em [data-open-form].
   Expõe `window.paForm = { open(source) }` para o stub em
   script.js abrir o overlay depois que este arquivo chega.

   Dependências:
   - window.paApp.I18N, window.paApp.getCurrentLang()  (script.js)
   - window.paFirebase.{newSessionId, trackFormEvent, addLead,
     listSlots, bookSlot}                              (firebase-init.js)
   - window.gsap                                       (opcional)
   ══════════════════════════════════════════════════════ */
(function () {
  const I18N           = (window.paApp && window.paApp.I18N) || {};
  const getCurrentLang = (window.paApp && window.paApp.getCurrentLang) || (() => 'es');

  const STEPS = [
    { id: 1, field: 'f-name',    type: 'text' },
    { id: 2, field: 'f-phone',   type: 'tel' },
    { id: 3, field: 'f-company', type: 'text' },
    { id: 4, field: 'f-email',   type: 'email' },
    { id: 5, field: 'f-sector',  type: 'select' },
    { id: 6, field: 'rg-challenge', type: 'radio', name: 'challenge' },
    { id: 7, field: 'rg-budget',    type: 'radio', name: 'budget' },
    { id: 8, type: 'success' },
  ];
  const TOTAL = 7;

  /* ── Países del selector de teléfono ─────────────── */
  const COUNTRIES = [
    { code:'PY', dial:'595', name:'Paraguay',       flag:'\uD83C\uDDF5\uD83C\uDDFE', mask:'### ### ###',     min:9  },
    { code:'AR', dial:'54',  name:'Argentina',      flag:'\uD83C\uDDE6\uD83C\uDDF7', mask:'## ####-####',    min:10 },
    { code:'BO', dial:'591', name:'Bolivia',        flag:'\uD83C\uDDE7\uD83C\uDDF4', mask:'#### ####',       min:8  },
    { code:'BR', dial:'55',  name:'Brasil',         flag:'\uD83C\uDDE7\uD83C\uDDF7', mask:'(##) #####-####', min:10 },
    { code:'CA', dial:'1',   name:'Canadá',         flag:'\uD83C\uDDE8\uD83C\uDDE6', mask:'(###) ###-####',  min:10 },
    { code:'CL', dial:'56',  name:'Chile',          flag:'\uD83C\uDDE8\uD83C\uDDF1', mask:'# #### ####',     min:9  },
    { code:'CO', dial:'57',  name:'Colombia',       flag:'\uD83C\uDDE8\uD83C\uDDF4', mask:'### ### ####',    min:10 },
    { code:'CR', dial:'506', name:'Costa Rica',     flag:'\uD83C\uDDE8\uD83C\uDDF7', mask:'#### ####',       min:8  },
    { code:'EC', dial:'593', name:'Ecuador',        flag:'\uD83C\uDDEA\uD83C\uDDE8', mask:'## ### ####',     min:9  },
    { code:'SV', dial:'503', name:'El Salvador',    flag:'\uD83C\uDDF8\uD83C\uDDFB', mask:'#### ####',       min:8  },
    { code:'ES', dial:'34',  name:'España',         flag:'\uD83C\uDDEA\uD83C\uDDF8', mask:'### ## ## ##',    min:9  },
    { code:'US', dial:'1',   name:'Estados Unidos', flag:'\uD83C\uDDFA\uD83C\uDDF8', mask:'(###) ###-####',  min:10 },
    { code:'FR', dial:'33',  name:'Francia',        flag:'\uD83C\uDDEB\uD83C\uDDF7', mask:'# ## ## ## ##',   min:9  },
    { code:'DE', dial:'49',  name:'Alemania',       flag:'\uD83C\uDDE9\uD83C\uDDEA', mask:'### #######',     min:10 },
    { code:'GT', dial:'502', name:'Guatemala',      flag:'\uD83C\uDDEC\uD83C\uDDF9', mask:'#### ####',       min:8  },
    { code:'HN', dial:'504', name:'Honduras',       flag:'\uD83C\uDDED\uD83C\uDDF3', mask:'#### ####',       min:8  },
    { code:'IT', dial:'39',  name:'Italia',         flag:'\uD83C\uDDEE\uD83C\uDDF9', mask:'### ### ####',    min:9  },
    { code:'MX', dial:'52',  name:'México',         flag:'\uD83C\uDDF2\uD83C\uDDFD', mask:'## #### ####',    min:10 },
    { code:'NI', dial:'505', name:'Nicaragua',      flag:'\uD83C\uDDF3\uD83C\uDDEE', mask:'#### ####',       min:8  },
    { code:'PA', dial:'507', name:'Panamá',         flag:'\uD83C\uDDF5\uD83C\uDDE6', mask:'#### ####',       min:8  },
    { code:'PE', dial:'51',  name:'Perú',           flag:'\uD83C\uDDF5\uD83C\uDDEA', mask:'### ### ###',     min:9  },
    { code:'PT', dial:'351', name:'Portugal',       flag:'\uD83C\uDDF5\uD83C\uDDF9', mask:'### ### ###',     min:9  },
    { code:'GB', dial:'44',  name:'Reino Unido',    flag:'\uD83C\uDDEC\uD83C\uDDE7', mask:'#### ######',     min:10 },
    { code:'DO', dial:'1',   name:'R. Dominicana',  flag:'\uD83C\uDDE9\uD83C\uDDF4', mask:'(###) ###-####',  min:10 },
    { code:'UY', dial:'598', name:'Uruguay',        flag:'\uD83C\uDDFA\uD83C\uDDFE', mask:'## ### ###',      min:8  },
    { code:'VE', dial:'58',  name:'Venezuela',      flag:'\uD83C\uDDFB\uD83C\uDDEA', mask:'### ### ####',    min:10 },
  ];
  let selectedCountry = COUNTRIES[0];
  const SUCCESS_STEP = 8;
  const ALREADY_STEP = 9;
  const LEAD_KEY = 'pa-lead-submitted';

  const overlay = document.getElementById('formx');
  const stage   = document.getElementById('fxStage');
  const bar     = document.getElementById('fxBar');
  const counter = document.getElementById('fxCounter');
  const backBtn = document.getElementById('fxBack');
  const dotsEl  = document.getElementById('fxDots');
  const closeBtn= document.getElementById('fxClose');
  const doneBtn = document.getElementById('fxDone');

  if (!overlay || !stage) return; // overlay não existe nesta página

  let current = 1;
  let busy = false;
  const data = {};

  // ── Funnel tracking state ──────────────────────────
  let sessionId   = null;
  let formOpenAt  = 0;
  let ctaOrigin   = 'unknown';
  let maxStep     = 0;
  let pathArr     = [];
  let hasSubmitted= false;

  function elapsed() { return formOpenAt ? Date.now() - formOpenAt : 0; }

  // Build dots
  for (let i = 1; i <= TOTAL; i++) {
    const d = document.createElement('span');
    d.className = 'fxdot' + (i === 1 ? ' active' : '');
    dotsEl.appendChild(d);
  }
  const dots = dotsEl.querySelectorAll('.fxdot');

  /* ── Phone: country selector + mask ─────────────── */
  const phoneInput    = document.getElementById('f-phone');
  const countryBtn    = document.getElementById('fxCountryBtn');
  const countryFlag   = document.getElementById('fxCountryFlag');
  const countryDial   = document.getElementById('fxCountryDial');
  const countryDrop   = document.getElementById('fxCountryDropdown');
  const countryList   = document.getElementById('fxCountryList');
  const countrySearch = document.getElementById('fxCountrySearch');

  function applyMask(digits, mask) {
    let out = '';
    let i = 0;
    for (const ch of mask) {
      if (i >= digits.length) break;
      if (ch === '#') { out += digits[i]; i++; }
      else out += ch;
    }
    return out;
  }
  function maxDigits(mask) { return (mask.match(/#/g) || []).length; }

  function renderCountryList(filter = '') {
    if (!countryList) return;
    const norm = (s) => s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const q = norm(filter.trim());
    const items = COUNTRIES.filter(c =>
      !q || norm(c.name).includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
    );
    countryList.innerHTML = '';
    if (!items.length) {
      countryList.innerHTML = '<li class="fxphone__empty">Sin resultados</li>';
      return;
    }
    for (const c of items) {
      const li = document.createElement('li');
      li.className = 'fxphone__item' + (c.code === selectedCountry.code ? ' is-selected' : '');
      li.setAttribute('role', 'option');
      li.dataset.code = c.code;
      li.innerHTML =
        '<span class="fxphone__item-flag">' + c.flag + '</span>' +
        '<span class="fxphone__item-name">' + c.name + '</span>' +
        '<span class="fxphone__item-dial">+' + c.dial + '</span>';
      li.addEventListener('click', () => selectCountry(c));
      countryList.appendChild(li);
    }
  }

  function selectCountry(c) {
    selectedCountry = c;
    if (countryFlag) countryFlag.textContent = c.flag;
    if (countryDial) countryDial.textContent = '+' + c.dial;
    if (phoneInput) {
      const digits = phoneInput.value.replace(/\D/g, '').slice(0, maxDigits(c.mask));
      phoneInput.value = applyMask(digits, c.mask);
      phoneInput.placeholder = applyMask('981123456789'.slice(0, maxDigits(c.mask)), c.mask);
    }
    closeCountryDropdown();
    if (phoneInput) phoneInput.focus();
  }

  function openCountryDropdown() {
    if (!countryDrop) return;
    countryDrop.removeAttribute('hidden');
    requestAnimationFrame(() => countryDrop.classList.add('is-open'));
    if (countryBtn) countryBtn.setAttribute('aria-expanded', 'true');
    if (countrySearch) { countrySearch.value = ''; setTimeout(() => countrySearch.focus(), 100); }
    renderCountryList('');
  }
  function closeCountryDropdown() {
    if (!countryDrop) return;
    countryDrop.classList.remove('is-open');
    if (countryBtn) countryBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => countryDrop.setAttribute('hidden', ''), 300);
  }

  if (countryBtn) {
    countryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = countryDrop && !countryDrop.hasAttribute('hidden');
      if (isOpen) closeCountryDropdown(); else openCountryDropdown();
    });
  }
  if (countrySearch) {
    countrySearch.addEventListener('input', (e) => renderCountryList(e.target.value));
    countrySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCountryDropdown();
    });
  }
  document.addEventListener('click', (e) => {
    if (!countryDrop || countryDrop.hasAttribute('hidden')) return;
    if (!e.target.closest('.fxphone')) closeCountryDropdown();
  });

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      const digits = phoneInput.value.replace(/\D/g, '').slice(0, maxDigits(selectedCountry.mask));
      phoneInput.value = applyMask(digits, selectedCountry.mask);
    });
    phoneInput.placeholder = applyMask('981123456789'.slice(0, maxDigits(selectedCountry.mask)), selectedCountry.mask);
  }

  /* ── Lead storage ───────────────────────────────── */
  function getStoredLead() {
    try {
      const raw = localStorage.getItem(LEAD_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  }
  function saveLead(lead) {
    try { localStorage.setItem(LEAD_KEY, JSON.stringify(lead)); } catch(e){}
  }
  function clearLead() {
    try { localStorage.removeItem(LEAD_KEY); } catch(e){}
  }

  /* ── Open / close ───────────────────────────────── */
  function openForm(source) {
    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    sessionId    = window.paFirebase?.newSessionId?.() || null;
    formOpenAt   = Date.now();
    ctaOrigin    = source || 'unknown';
    maxStep      = 0;
    pathArr      = [];
    hasSubmitted = false;

    const stored = getStoredLead();
    if (stored && stored.phone && stored.email) {
      showAlready(stored);
    } else {
      current = 1;
      updateUI();
      if (sessionId) {
        window.paFirebase?.trackFormEvent?.('opened', {
          sessionId,
          source:     'landing-puntoalto',
          cta_origin: ctaOrigin
        });
      }
      showStep(1, true);
    }

    if (window.gsap) {
      gsap.fromTo('.formx__stage',
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: 'expo.out', delay: 0.1 }
      );
    }
  }

  function showAlready(lead) {
    const nameEl  = document.getElementById('fxAlreadyName');
    const phoneEl = document.getElementById('fxAlreadyPhone');
    const emailEl = document.getElementById('fxAlreadyEmail');
    const firstName = (lead.name || '').split(' ')[0];
    if (nameEl)  nameEl.textContent  = firstName;
    if (phoneEl) phoneEl.textContent = lead.phone || '—';
    if (emailEl) emailEl.textContent = lead.email || '—';

    current = ALREADY_STEP;
    showStep(ALREADY_STEP, true);
    counter.textContent = '';
    bar.style.width = '100%';
    backBtn.setAttribute('disabled', '');
    dotsEl.style.opacity = '0';
  }

  function closeForm() {
    if (sessionId && !hasSubmitted && maxStep >= 1 && maxStep < TOTAL) {
      window.paFirebase?.trackFormEvent?.('abandoned', {
        sessionId,
        durationMs: elapsed()
      });
    }

    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
    setTimeout(() => overlay.setAttribute('hidden', ''), 400);
  }

  /* ── Step navigation ────────────────────────────── */
  function showStep(target, instant = false) {
    if (busy) return;
    busy = true;

    const all = stage.querySelectorAll('.fxstep');
    const curEl = stage.querySelector('.fxstep.is-active');
    const nextEl = stage.querySelector(`[data-step="${target}"]`);
    if (!nextEl) { busy = false; return; }

    const forward = !curEl || parseInt(curEl.dataset.step, 10) < target;

    const finish = () => {
      all.forEach(s => s.classList.remove('is-active'));
      nextEl.classList.add('is-active');

      if (window.gsap && !instant) {
        gsap.fromTo(nextEl,
          { x: forward ? 60 : -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out' }
        );
      }

      current = target;
      updateUI();

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

      setTimeout(() => {
        const f = nextEl.querySelector('input:not([type=radio]), select');
        if (f) f.focus();
        busy = false;
      }, 120);
    };

    if (curEl && window.gsap && !instant) {
      gsap.to(curEl, {
        x: forward ? -60 : 60,
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
        onComplete: finish
      });
    } else {
      finish();
    }
  }

  function updateUI() {
    const isFinal = current === SUCCESS_STEP || current === ALREADY_STEP;
    const progress = isFinal ? 100 : ((current - 1) / TOTAL) * 100;
    bar.style.width = progress + '%';

    if (isFinal) {
      counter.textContent = '';
      dotsEl.style.opacity = '0';
      backBtn.setAttribute('disabled', '');
    } else {
      counter.textContent = `${current} / ${TOTAL}`;
      dotsEl.style.opacity = '1';
      dots.forEach((d, i) => d.classList.toggle('active', i + 1 === current));
      backBtn.toggleAttribute('disabled', current === 1);
    }
  }

  /* ── Validation ─────────────────────────────────── */
  const t = (k) => {
    const lang = getCurrentLang();
    return (I18N[lang] && I18N[lang][k]) || (I18N.es && I18N.es[k]) || k;
  };

  function validateCurrent() {
    const step = STEPS.find(s => s.id === current);
    if (!step) return true;

    if (step.type === 'radio') {
      const sel = document.querySelector(`input[name="${step.name}"]:checked`);
      if (!sel) { showErr('e-' + step.name, t('f.err.radio')); return false; }
      data[step.name] = sel.value;
      clearErr('e-' + step.name);
      return true;
    }

    const input = document.getElementById(step.field);
    if (!input) return true;
    const val = input.value.trim();
    const key = step.field.replace('f-', 'e-');

    if (!val) {
      showErr(key, t('f.err.req'));
      input.classList.add('is-error');
      setTimeout(() => input.classList.remove('is-error'), 500);
      return false;
    }
    if (step.type === 'tel') {
      const digits = val.replace(/\D/g, '');
      if (digits.length < (selectedCountry.min || 7)) {
        showErr(key, t('f.err.tel'));
        input.classList.add('is-error');
        return false;
      }
    }
    if (step.type === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        showErr(key, t('f.err.email'));
        input.classList.add('is-error');
        return false;
      }
    }

    input.classList.remove('is-error');
    input.classList.add('is-valid');
    clearErr(key);
    data[step.field] = val;
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

  /* ── Advance / submit ───────────────────────────── */
  function next() {
    if (busy) return;
    if (!validateCurrent()) return;

    if (current === 1) {
      const hello = document.getElementById('fxHello');
      if (hello) hello.textContent = (data['f-name'] || '').split(' ')[0];
    }

    if (current === TOTAL) {
      submit();
    } else {
      showStep(current + 1);
    }
  }

  async function submit() {
    const firstName = (data['f-name'] || '').split(' ')[0];
    const okName = document.getElementById('fxOkName');
    if (okName) okName.textContent = firstName;

    const phoneDigits = (data['f-phone'] || '').replace(/\D/g, '');
    const payload = {
      name:        data['f-name']   || '',
      phone:       phoneDigits ? '+' + selectedCountry.dial + phoneDigits : '',
      phone_raw:   data['f-phone']  || '',
      phone_country: selectedCountry.code,
      phone_dial:    selectedCountry.dial,
      company:   data['f-company']   || '',
      email:     data['f-email']     || '',
      sector:    data['f-sector']    || '',
      challenge: data['challenge']   || '',
      budget:    data['budget']      || '',
      locale:    getCurrentLang(),
      source:    'landing-puntoalto',
      page_url:  window.location.href,
      referrer:  document.referrer || null,
      user_agent:navigator.userAgent,
      submitted_at: new Date().toISOString()
    };

    console.log('[PUNTO ALTO] Lead →', payload);

    saveLead({
      name:     payload.name,
      phone:    payload.phone,
      email:    payload.email,
      company:  payload.company,
      sent_at:  payload.submitted_at
    });

    hasSubmitted = true;
    showStep(SUCCESS_STEP);

    const leadId = await window.paFirebase?.addLead?.(payload);

    if (sessionId) {
      window.paFirebase?.trackFormEvent?.('submitted', {
        sessionId,
        leadId:     leadId || '',
        durationMs: elapsed()
      });
    }
  }

  /* ── Booking flow (step 8) ─────────────────────────── */
  const bookState = {
    leadId: '', name: '', email: '', phone: '', company: '',
    slots: [],
    byDay: {},
    selectedDay: null
  };

  function showBookUI(which) {
    ['Loading', 'Picker', 'Confirming', 'Done', 'Error'].forEach(k => {
      const el = document.getElementById('fxBook' + k);
      if (el) el.hidden = (k.toLowerCase() !== which);
    });
  }

  function groupSlotsByDay(slots) {
    const out = {};
    for (const s of slots) {
      const day = s.start.slice(0, 10);
      (out[day] = out[day] || []).push(s);
    }
    return out;
  }

  function fmtDayLabel(dayStr) {
    const [y, m, d] = dayStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const dow = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][dt.getUTCDay()];
    const todayStr = (() => {
      const n = new Date();
      const ny = n.getFullYear(), nm = String(n.getMonth() + 1).padStart(2,'0'), nd = String(n.getDate()).padStart(2,'0');
      return `${ny}-${nm}-${nd}`;
    })();
    return { dow: dayStr === todayStr ? 'Hoy' : dow, num: d };
  }

  function fmtTimeLabel(startIso) {
    const m = startIso.match(/T(\d{2}):(\d{2})/);
    return m ? `${m[1]}:${m[2]}` : startIso;
  }

  function renderBookPicker() {
    const daysEl  = document.getElementById('fxBookDays');
    const timesEl = document.getElementById('fxBookTimes');
    if (!daysEl || !timesEl) return;

    const days = Object.keys(bookState.byDay).sort();
    daysEl.innerHTML = days.map(d => {
      const lbl = fmtDayLabel(d);
      const active = d === bookState.selectedDay;
      return `<button class="fxbook__day${active ? ' is-active' : ''}" data-day="${d}" role="tab" aria-selected="${active}">
        <span class="fxbook__day-dow">${lbl.dow}</span>
        <span class="fxbook__day-num">${lbl.num}</span>
      </button>`;
    }).join('');

    daysEl.querySelectorAll('.fxbook__day').forEach(btn => {
      btn.addEventListener('click', () => {
        bookState.selectedDay = btn.dataset.day;
        renderBookPicker();
      });
    });

    const todaysSlots = bookState.byDay[bookState.selectedDay] || [];
    if (todaysSlots.length === 0) {
      timesEl.innerHTML = '<div class="fxbook__times--empty">Sin horarios para este día.</div>';
      return;
    }
    timesEl.innerHTML = todaysSlots.map(s => {
      return `<button class="fxbook__time" data-start="${s.start}">${fmtTimeLabel(s.start)}</button>`;
    }).join('');
    timesEl.querySelectorAll('.fxbook__time').forEach(btn => {
      btn.addEventListener('click', () => doBookSlot(btn.dataset.start));
    });
  }

  async function doBookSlot(startIso) {
    showBookUI('confirming');
    try {
      const res = await window.paFirebase.bookSlot({
        leadId:  bookState.leadId,
        startIso,
        name:    bookState.name,
        email:   bookState.email,
        phone:   bookState.phone,
        company: bookState.company
      });

      const dt = new Date(startIso);
      const whenEl = document.getElementById('fxBookDoneWhen');
      if (whenEl) {
        whenEl.textContent = new Intl.DateTimeFormat('es', {
          timeZone: 'America/Asuncion',
          weekday: 'long', day: '2-digit', month: 'long',
          hour: '2-digit', minute: '2-digit', hour12: false
        }).format(dt);
      }
      const meetEl = document.getElementById('fxBookMeetLink');
      if (meetEl) {
        if (res?.meetLink) {
          meetEl.href   = res.meetLink;
          meetEl.hidden = false;
        } else {
          meetEl.hidden = true;
        }
      }
      showBookUI('done');
    } catch (err) {
      const msgEl = document.getElementById('fxBookErrorMsg');
      if (msgEl) {
        msgEl.textContent = (err?.code === 'functions/already-exists')
          ? 'Ese horario quedó tomado. Probá con otro.'
          : 'No pudimos agendar. Probá de nuevo o usá la IA.';
      }
      showBookUI('error');
    }
  }

  const retryBtn = document.getElementById('fxBookRetry');
  if (retryBtn) retryBtn.addEventListener('click', async () => {
    showBookUI('loading');
    let slots = [];
    try { slots = await window.paFirebase.listSlots(14); } catch (e) {}
    if (!Array.isArray(slots) || slots.length === 0) {
      showBookUI('error');
      return;
    }
    bookState.slots = slots;
    bookState.byDay = groupSlotsByDay(slots);
    bookState.selectedDay = Object.keys(bookState.byDay).sort()[0];
    renderBookPicker();
    showBookUI('picker');
  });

  /* ── Confirmation toast ─────────────────────────── */
  function hideConfirmToast() {
    const toast = document.getElementById('confirmToast');
    if (!toast) return;
    toast.classList.remove('is-open');
    document.removeEventListener('keydown', onToastKey);
    setTimeout(() => toast.setAttribute('hidden', ''), 450);
  }
  function onToastKey(e) { if (e.key === 'Escape') hideConfirmToast(); }

  const toastCloseBtn = document.getElementById('confirmToastClose');
  const toastOkBtn    = document.getElementById('confirmToastOk');
  const toastEl       = document.getElementById('confirmToast');
  if (toastCloseBtn) toastCloseBtn.addEventListener('click', hideConfirmToast);
  if (toastOkBtn)    toastOkBtn.addEventListener('click', hideConfirmToast);
  if (toastEl) toastEl.addEventListener('click', (e) => {
    if (e.target === toastEl) hideConfirmToast();
  });

  /* ── Events ─────────────────────────────────────── */
  overlay.querySelectorAll('[data-next]').forEach(btn =>
    btn.addEventListener('click', next)
  );

  overlay.querySelectorAll('.fxinput, .fxselect select').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); next(); }
    });
  });

  overlay.querySelectorAll('.fxradios input[type=radio]').forEach(r => {
    r.addEventListener('change', () => {
      setTimeout(next, 380);
    });
  });

  backBtn.addEventListener('click', () => {
    if (current > 1) showStep(current - 1);
  });

  closeBtn.addEventListener('click', closeForm);
  if (doneBtn) doneBtn.addEventListener('click', closeForm);

  const alreadyCloseBtn = document.getElementById('fxAlreadyClose');
  const alreadyResetBtn = document.getElementById('fxAlreadyReset');
  if (alreadyCloseBtn) alreadyCloseBtn.addEventListener('click', closeForm);
  if (alreadyResetBtn) alreadyResetBtn.addEventListener('click', () => {
    clearLead();
    Object.keys(data).forEach(k => delete data[k]);
    overlay.querySelectorAll('.fxinput').forEach(i => {
      i.value = '';
      i.classList.remove('is-valid', 'is-error');
    });
    overlay.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
    const sel = document.getElementById('f-sector');
    if (sel) sel.selectedIndex = 0;
    showStep(1);
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeForm();
  });

  function onKey(e) {
    if (e.key === 'Escape') closeForm();
  }

  /* ── Public API ─────────────────────────────────── */
  window.paForm = { open: openForm };
})();
