/* ════════════════════════════════════════════════════════
   PUNTO ALTO — Landing + Typebot overlay
   ════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   THEME — light (default) · dark
   Aplicado lo más temprano posible para evitar flash.
   ════════════════════════════════════════════════════════ */
(function () {
  const THEME_KEY = 'pa-theme';
  function detect() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch(e) {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light';
  }
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch(e) {}
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro');
    }
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  apply(detect());

  // Bind click cuando el DOM esté listo
  const bind = () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    let rot = 0;
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      apply(current === 'light' ? 'dark' : 'light');
      // Giro simétrico: cada click suma 360° y siempre termina en posición neutral
      rot += 360;
      btn.style.transform = 'rotate(' + rot + 'deg)';
    });
    // Sync entre tabs
    window.addEventListener('storage', (e) => {
      if (e.key === THEME_KEY && e.newValue) apply(e.newValue);
    });
  };
  if (document.readyState !== 'loading') bind();
  else document.addEventListener('DOMContentLoaded', bind, { once: true });

  window.paTheme = { apply, detect };
})();

/* ════════════════════════════════════════════════════════
   i18n — ES (default) · EN · PT
   ════════════════════════════════════════════════════════ */
const I18N = {
  es: {
    'logo.sub': 'MARKETING · VENTAS · PARAGUAY',
    'nav.services': 'Servicios', 'nav.cases': 'Casos', 'nav.method': 'Método',
    'nav.paraguay': 'Paraguay', 'nav.contact': 'Contacto',
    'nav.cta': 'Diagnóstico gratis <span aria-hidden="true">→</span>',

    'hero.pill': 'Punto Alto, Asunción',
    'hero.title1': 'Crecé junto al',
    'hero.title2': '<em>Paraguay digital.</em>',
    'hero.sub': 'Construimos el funnel completo que tu empresa necesita para crecer: sitio que convierte, Google Ads de alto rendimiento, WhatsApp con IA de atención y reportes en tiempo real. Estructura de nivel global — pensada para la economía más prometedora de la próxima década.',
    'hero.cta1': 'Quiero mi diagnóstico <span aria-hidden="true">→</span>',
    'hero.cta2': 'Ver cómo lo hacemos',
    'chart.label': 'Ingresos · últimos 6 meses',
    'chart.kpi1':  'Nuevos leads hoy',
    'chart.kpi2':  'Cerrado en WhatsApp',

    'svc.eyebrow': 'Lo que hacemos',
    'svc.title':   'Un solo equipo. Todo el funnel.',
    'svc.sub':     'No vendemos piezas sueltas. Armamos el sistema entero — desde el primer clic hasta el cierre por WhatsApp.',
    'svc.1.t': 'Sitios que convierten',
    'svc.1.d': 'Páginas rápidas, bellas y pensadas 100% para vender. Nada de plantillas.',
    'svc.1.tag': 'Diseño · Dev · SEO técnico',
    'svc.2.t': 'Todo el poder de Google',
    'svc.2.d': 'Search, Display, YouTube y Discovery. La red publicitaria más grande del mundo con estrategia, creativos y optimización semanal con data.',
    'svc.2.tag': 'Performance real',
    'svc.3.t': 'WhatsApp que cierra',
    'svc.3.d': 'Scripts, flujos y técnicas comerciales avanzadas para tu equipo de atención.',
    'svc.3.tag': 'Nuestra especialidad',
    'svc.4.t': 'Reportes en tiempo real',
    'svc.4.d': 'Dashboards vivos + notificaciones automáticas. Nunca más decidir a ciegas.',
    'svc.4.tag': 'Siempre visible',

    'cases.eyebrow': 'Nuestros casos',
    'cases.title':   'Empresas que ya crecen con nosotros.',
    'cases.sub':     'Dos funnels. Dos rubros distintos. La misma obsesión por medir, optimizar y cerrar.',
    'case.mon.tag': 'VENTURE CAPITAL ADVISORY',
    'case.mon.sector': 'Venture Capital',
    'case.mon.p': 'Consultoría para venture capital con audiencia internacional. Construimos un sitio con animaciones elaboradísimas, totalmente conectadas con la identidad y el universo de la marca — una experiencia digna del ticket que manejan.',
    'case.mon.f1': 'Animaciones narrativas hechas a medida',
    'case.mon.f2': 'Identidad visual de nivel global',
    'case.mon.f3': 'Funnel listo para escalar 10×',
    'case.gua.tag': 'TRANSPORTE EJECUTIVO',
    'case.gua.sector': 'Transporte ejecutivo',
    'case.gua.p': 'Servicio premium de traslados corporativos en Asunción. Sitio elegante con formulario inteligente que agenda compromisos directo en Google Calendar con todos los detalles del viaje — cero fricción entre el lead y la reserva.',
    'case.gua.f1': 'Agenda automática en Google Calendar',
    'case.gua.f2': 'Formulario multi-paso con detalles de viaje',
    'case.gua.f3': 'Funnel listo para escalar 10×',
    'case.link': 'Visitar sitio <span aria-hidden="true">→</span>',

    'par.eyebrow': 'Por qué ahora',
    'par.title':   'El Paraguay del mundo<br/>ya empezó. <em>¿Y tu empresa?</em>',
    'par.p1': 'Leyes claras. Impuestos entre los más bajos del planeta. Y uno de los mayores potenciales de crecimiento de la próxima década.',
    'par.p2': 'Armar un funnel de ventas moderno hoy en Paraguay vale tanto como vender mucho más de tu propio producto. Si ya vendés, vas a vender el triple. Si recién empezás, vas a empezar como empresa global.',
    'par.cta': 'Hablemos de tu funnel <span aria-hidden="true">→</span>',
    'par.stat1': 'Impuesto a la renta empresarial',
    'par.stat2': 'Crecimiento PIB proyectado 2026',
    'par.stat3': 'Inversión extranjera directa',
    'par.stat4': 'Tu funnel, siempre visible',

    'met.eyebrow': 'Cómo trabajamos',
    'met.title':   'De contrato a ventas en 4 pasos.',
    'met.1.t': 'Diagnóstico',
    'met.1.d': 'Auditamos tu proceso actual, identificamos fugas y oportunidades.',
    'met.2.t': 'Construcción',
    'met.2.d': 'Sitio, ads y WhatsApp comercial listos en 15 días.',
    'met.3.t': 'Optimización semanal',
    'met.3.d': 'Cada martes revisamos data, ajustamos creativos y pulimos scripts.',
    'met.4.t': 'Reportes en vivo',
    'met.4.d': 'Todo medido, todo visible. Vos y nosotros, mirando los mismos números.',

    'nav.pricing': 'Precios',
    'prices.eyebrow': 'Inversión',
    'prices.title':   'Cada plan, hecho a medida.',
    'prices.sub':     'No vendemos paquetes cerrados. Armamos el plan exacto según el tamaño de tu empresa, tu demanda y tus objetivos.',

    'prices.starter.eyebrow': 'Plan inicio · desde',
    'prices.starter.title':   'Empezá con estructura real desde el día uno.',
    'prices.starter.amount':  'Gs. 1.500.000',
    'prices.starter.unit':    '/mes',
    'prices.starter.iva':     'IVA incluido',
    'prices.starter.desc':    'El piso para construir tu sistema digital con base sólida: sitio optimizado, anuncios activos y WhatsApp comercial integrado — listo para captar y convertir.',
    'prices.starter.cta':     'Empezar con este plan <span aria-hidden="true">→</span>',

    'prices.budget.eyebrow':  'Verba sugerida en ads',
    'prices.budget.title':    'Lo recomendado para arrancar.',
    'prices.budget.amount':   'Gs. 50.000',
    'prices.budget.unit':     '/día',
    'prices.budget.min':      'Mínimo recomendado',
    'prices.budget.desc':     'Para que Google y Meta tengan datos suficientes para optimizar y traer leads cualificados. Este presupuesto se paga directo a la plataforma — fuera de la mensualidad de Punto Alto.',

    'prices.custom.eyebrow':  'Plan a tu medida',
    'prices.custom.title':    '¿Tu empresa ya está en otro nivel?',
    'prices.custom.desc':     'Para operaciones más complejas —agente de IA en WhatsApp 24/7, multi-atendente, integraciones con CRM, Google Ads multi-red, gerente de cuenta dedicado— armamos un plan exacto para tu caso. Cotizamos según tu operación, demanda y objetivos.',
    'prices.custom.cta':      'Hablemos <span aria-hidden="true">→</span>',

    'prices.scope.eyebrow': 'Inversión aparte',
    'prices.scope.title':   'Nuestros planes cubren el servicio completo de la agencia.',
    'prices.scope.sub':     'Los ítems marcados con <span class="scope-note__mark" aria-hidden="true">*</span> se contratan directo con cada proveedor — así mantenés control total sobre tu presupuesto, sin intermediarios ni sorpresas.',
    'prices.scope.i1.t':    'Pauta en Google Ads',
    'prices.scope.i1.d':    'Presupuesto de medios pagado directo a Google.',

    'f.s7.sub':         'En unos minutos vas a recibir un mensaje nuestro por WhatsApp. Ahí nuestra IA de atención te ayuda a agendar tu consultoría gratuita con el equipo.',
    // Calendar booking keys — em pausa, manter pra retomar
    'f.book.loading':   'Cargando horarios disponibles…',
    'f.book.confirming':'Confirmando tu reunión…',
    'f.book.done.title':'¡Reunión agendada!',
    'f.book.done.sub':  'Te llega la invitación por email con el link de Google Meet.',
    'f.book.done.link': 'Abrir link de la reunión',
    'f.book.err.taken': 'Ese horario quedó tomado. Probá con otro.',
    'f.book.err.retry': 'Ver otros horarios',
    'f.book.or':        'o',
    'f.book.ai':        'Hablar con IA ahora <span aria-hidden="true">→</span>',
    'prices.scope.i3.t':    'API de WhatsApp Business',
    'prices.scope.i3.d':    'Licencia facturada aparte — el costo varía según la cantidad de números y atendentes que operen el sistema.',
    'prices.scope.i4.t':    'Email corporativo profesional',
    'prices.scope.i4.d':    'Precio variable según usuarios — base del ecosistema digital de tu empresa.',

    'toast.label': 'Mensajes enviados',
    'toast.title': '¡Ya te contactamos!',
    'toast.sub':   'Revisá tu WhatsApp y tu email — nuestra IA de atención te está esperando ahí para agendar tu consultoría gratuita.',
    'toast.wa':    'WhatsApp enviado a',
    'toast.em':    'Email enviado a',
    'toast.btn':   'Entendido ✓',

    'cta.title': 'Llevamos tu empresa<br/>al <em>punto más alto.</em>',
    'cta.p':     'Diagnóstico gratuito. 30 minutos. Cero compromiso. Resultados reales.',
    'cta.btn':   'Empezar ahora <span aria-hidden="true">→</span>',
    'cta.small': 'Respuesta por WhatsApp en menos de 2 horas · 100% gratuito',

    'foot.logo': 'Marketing · Ventas',
    'foot.copy': '© 2026 Punto Alto — Asunción, Paraguay. Llevamos tu empresa al punto más alto.',

    'f.close':  'Cerrar formulario',
    'f.next':   'Continuar →',
    'f.back':   '← Volver',
    'f.s1.label': 'Pregunta 1 / 7',
    'f.s1.q':  '¿Cómo te llamamos?',
    'f.s1.ph': 'Tu nombre',
    'f.s1.hint': 'Presioná <kbd>Enter ↵</kbd> para continuar',
    'f.s2.label': 'Pregunta 2 / 7',
    'f.s2.q':  'Mucho gusto <span id="fxHello"></span> 👋 ¿Tu WhatsApp?',
    'f.s2.hint': 'Ahí te mandamos tu diagnóstico',
    'f.s2.search': 'Buscar país...',
    'f.s3.label': 'Pregunta 3 / 7',
    'f.s3.q':  '¿Cómo se llama tu empresa?',
    'f.s3.ph': 'Nombre de tu empresa',
    'f.s3.hint': 'O el proyecto que querés lanzar',
    'f.email.label': 'Pregunta 4 / 7',
    'f.email.q':  '¿Tu email?',
    'f.email.ph': 'nombre@empresa.com',
    'f.email.sub':'Recomendamos que sea el corporativo, pero cualquiera funciona.',
    'f.s4.label': 'Pregunta 5 / 7',
    'f.s4.q':  '¿En qué rubro estás?',
    'f.s4.ph': 'Elegí una opción',
    'f.s4.o1': 'Inmobiliario', 'f.s4.o2': 'Salud & Estética',
    'f.s4.o3': 'Educación', 'f.s4.o4': 'Construcción',
    'f.s4.o5': 'Servicios profesionales', 'f.s4.o6': 'Retail / e-commerce',
    'f.s4.o7': 'Importadora / Distribuidora', 'f.s4.o8': 'Otro',
    'f.s5.label': 'Pregunta 6 / 7',
    'f.s5.q':   '¿Cuál es tu mayor desafío hoy?',
    'f.s5.sub': 'Elegí uno — seguimos automáticamente.',
    'f.s5.o1': 'No tengo sitio web profesional',
    'f.s5.o2': 'Hago ads pero no veo retorno',
    'f.s5.o3': 'Pierdo leads en WhatsApp',
    'f.s5.o4': 'No sé qué funciona y qué no',
    'f.s5.o5': 'Quiero escalar sin estructura',
    'f.s6.label': 'Última pregunta',
    'f.s6.q':   '¿Con qué presupuesto contás?',
    'f.s6.sub': 'Para recomendarte el plan ideal.',
    'f.s6.o1': 'USD 500 – 1.000 / mes',
    'f.s6.o2': 'USD 1.000 – 2.000 / mes',
    'f.s6.o3': 'USD 2.000+ / mes',
    'f.s6.o4': 'Aún no lo tengo claro',
    'f.s7.title': '¡Perfecto, <span id="fxOkName"></span>!',
    'f.s7.sub':   'En unos minutos vas a recibir un mensaje nuestro por WhatsApp. Ahí nuestra IA de atención te ayuda a agendar tu consultoría gratuita con el equipo.',
    'f.s7.btn':   'Volver al sitio',
    'f.already.label': 'Ya nos conocemos',
    'f.already.title': '¡Hola de nuevo, <span id="fxAlreadyName"></span>! 👋',
    'f.already.sub':   'Tu solicitud ya llegó. Revisá tu WhatsApp y tu email — te estamos esperando ahí para agendar tu consultoría gratuita con nuestra IA de atención.',
    'f.already.btn':   'Entendido →',
    'f.already.reset': 'Enviar otra solicitud',
    'f.err.req':   'Este campo es requerido.',
    'f.err.tel':   'Ingresá un número válido.',
    'f.err.email': 'Ingresá un email válido.',
    'f.err.radio': 'Elegí una opción.',
  },

  en: {
    'logo.sub': 'MARKETING · SALES · PARAGUAY',
    'nav.services': 'Services', 'nav.cases': 'Cases', 'nav.method': 'Method',
    'nav.paraguay': 'Paraguay', 'nav.contact': 'Contact',
    'nav.cta': 'Free diagnosis <span aria-hidden="true">→</span>',

    'hero.pill': 'Punto Alto, Asunción',
    'hero.title1': 'Grow with the',
    'hero.title2': '<em>digital Paraguay.</em>',
    'hero.sub': 'We build the complete funnel your company needs to grow: a site that converts, high-performance Google Ads, WhatsApp with AI attention and real-time reports. Global-grade structure — designed for the most promising economy of the next decade.',
    'hero.cta1': 'I want my diagnosis <span aria-hidden="true">→</span>',
    'hero.cta2': 'See how we do it',
    'chart.label': 'Revenue · last 6 months',
    'chart.kpi1':  'New leads today',
    'chart.kpi2':  'Closed on WhatsApp',

    'svc.eyebrow': 'What we do',
    'svc.title':   'One team. The entire funnel.',
    'svc.sub':     'We don\'t sell loose pieces. We build the full system — from the first click to the close on WhatsApp.',
    'svc.1.t': 'Websites that convert',
    'svc.1.d': 'Fast, beautiful pages built 100% to sell. No templates.',
    'svc.1.tag': 'Design · Dev · Technical SEO',
    'svc.2.t': 'All the power of Google',
    'svc.2.d': 'Search, Display, YouTube and Discovery. The largest ad network in the world with strategy, creatives and weekly data-driven optimization.',
    'svc.2.tag': 'Real performance',
    'svc.3.t': 'WhatsApp that closes',
    'svc.3.d': 'Scripts, flows and advanced sales techniques for your support team.',
    'svc.3.tag': 'Our specialty',
    'svc.4.t': 'Real-time reports',
    'svc.4.d': 'Live dashboards + automated alerts. Never decide blindly again.',
    'svc.4.tag': 'Always visible',

    'cases.eyebrow': 'Our cases',
    'cases.title':   'Companies already growing with us.',
    'cases.sub':     'Two funnels. Two very different industries. The same obsession with measuring, optimizing and closing.',
    'case.mon.tag': 'VENTURE CAPITAL ADVISORY',
    'case.mon.sector': 'Venture Capital',
    'case.mon.p': 'Consultancy for venture capital with an international audience. We built a site with intricate animations, fully tied to the brand identity and universe — an experience worthy of the ticket size they handle.',
    'case.mon.f1': 'Custom narrative animations',
    'case.mon.f2': 'Global-grade visual identity',
    'case.mon.f3': 'Funnel ready to scale 10×',
    'case.gua.tag': 'EXECUTIVE TRANSPORT',
    'case.gua.sector': 'Executive transport',
    'case.gua.p': 'Premium corporate transport service in Asunción. Elegant site with a smart form that schedules meetings straight into Google Calendar with all trip details — zero friction between lead and booking.',
    'case.gua.f1': 'Automatic Google Calendar scheduling',
    'case.gua.f2': 'Multi-step form with trip details',
    'case.gua.f3': 'Funnel ready to scale 10×',
    'case.link': 'Visit site <span aria-hidden="true">→</span>',

    'par.eyebrow': 'Why now',
    'par.title':   'The Paraguay the world<br/>is watching has begun. <em>And your company?</em>',
    'par.p1': 'Clear laws. Among the lowest taxes on the planet. And one of the greatest growth potentials of the next decade.',
    'par.p2': 'Building a modern sales funnel today in Paraguay is worth as much as selling much more of your own product. If you already sell, you will triple it. If you\'re just starting, you\'ll start as a global company.',
    'par.cta': 'Let\'s talk funnel <span aria-hidden="true">→</span>',
    'par.stat1': 'Corporate income tax',
    'par.stat2': 'Projected GDP growth 2026',
    'par.stat3': 'Foreign direct investment',
    'par.stat4': 'Your funnel, always visible',

    'met.eyebrow': 'How we work',
    'met.title':   'From contract to sales in 4 steps.',
    'met.1.t': 'Diagnosis',
    'met.1.d': 'We audit your current process and spot leaks and opportunities.',
    'met.2.t': 'Build',
    'met.2.d': 'Site, ads and commercial WhatsApp ready in 15 days.',
    'met.3.t': 'Weekly optimization',
    'met.3.d': 'Every Tuesday we review data, adjust creatives and polish scripts.',
    'met.4.t': 'Live reports',
    'met.4.d': 'Everything measured, everything visible. You and us, looking at the same numbers.',

    'nav.pricing': 'Pricing',
    'prices.eyebrow': 'Investment',
    'prices.title':   'Every plan, made to measure.',
    'prices.sub':     'No closed packages. We build the exact plan based on the size of your company, your demand, and your goals.',

    'prices.starter.eyebrow': 'Starter plan · from',
    'prices.starter.title':   'Start with real structure from day one.',
    'prices.starter.amount':  'Gs. 1,500,000',
    'prices.starter.unit':    '/mo',
    'prices.starter.iva':     'VAT included',
    'prices.starter.desc':    'The floor to build your digital system on solid ground: optimized site, active ads, and integrated commercial WhatsApp — ready to capture and convert.',
    'prices.starter.cta':     'Start with this plan <span aria-hidden="true">→</span>',

    'prices.budget.eyebrow':  'Suggested ad budget',
    'prices.budget.title':    'What we recommend to begin.',
    'prices.budget.amount':   'Gs. 50,000',
    'prices.budget.unit':     '/day',
    'prices.budget.min':      'Recommended minimum',
    'prices.budget.desc':     'So Google and Meta have enough data to optimize and bring qualified leads. This budget is paid directly to the platform — outside the Punto Alto monthly fee.',

    'prices.custom.eyebrow':  'Tailored plan',
    'prices.custom.title':    'Is your company already at another level?',
    'prices.custom.desc':     'For more complex operations —AI agent on WhatsApp 24/7, multi-agent, CRM integrations, multi-network Google Ads, dedicated account manager— we build the exact plan for your case. Quoted based on your operation, demand and goals.',
    'prices.custom.cta':      'Let\'s talk <span aria-hidden="true">→</span>',

    'prices.scope.eyebrow': 'Separate investment',
    'prices.scope.title':   'Our plans cover the agency service in full.',
    'prices.scope.sub':     'Items marked with <span class="scope-note__mark" aria-hidden="true">*</span> are contracted directly with each provider — so you keep full control of your budget, with no middlemen or surprises.',
    'prices.scope.i1.t':    'Google Ads spend',
    'prices.scope.i1.d':    'Media budget paid directly to Google.',

    'f.s7.sub':         'In a few minutes you\'ll receive a WhatsApp message from us. Our attention AI will help you book your free consultation with the team.',
    // Calendar booking keys — paused, keep for resume
    'f.book.loading':   'Loading available slots…',
    'f.book.confirming':'Confirming your meeting…',
    'f.book.done.title':'Meeting booked!',
    'f.book.done.sub':  'We sent the invite by email with the Google Meet link.',
    'f.book.done.link': 'Open meeting link',
    'f.book.err.taken': 'That slot was taken. Try another one.',
    'f.book.err.retry': 'See other times',
    'f.book.or':        'or',
    'f.book.ai':        'Chat with AI now <span aria-hidden="true">→</span>',
    'prices.scope.i3.t':    'WhatsApp Business API',
    'prices.scope.i3.d':    'License billed separately — cost varies by number of phone lines and agents operating the system.',
    'prices.scope.i4.t':    'Professional corporate email',
    'prices.scope.i4.d':    'Price varies by user count — the foundation of your company\'s digital ecosystem.',

    'toast.label': 'Messages sent',
    'toast.title': 'We just contacted you!',
    'toast.sub':   'Check your WhatsApp and email — our support AI is waiting for you there to book your free consultation.',
    'toast.wa':    'WhatsApp sent to',
    'toast.em':    'Email sent to',
    'toast.btn':   'Got it ✓',

    'cta.title': 'We take your company<br/>to the <em>highest point.</em>',
    'cta.p':     'Free diagnosis. 30 minutes. Zero commitment. Real results.',
    'cta.btn':   'Start now <span aria-hidden="true">→</span>',
    'cta.small': 'WhatsApp reply in under 2 hours · 100% free',

    'foot.logo': 'Marketing · Sales',
    'foot.copy': '© 2026 Punto Alto — Asunción, Paraguay. We take your company to the highest point.',

    'f.close':  'Close form',
    'f.next':   'Continue →',
    'f.back':   '← Back',
    'f.s1.label': 'Question 1 / 7',
    'f.s1.q':  'What should we call you?',
    'f.s1.ph': 'Your name',
    'f.s1.hint': 'Press <kbd>Enter ↵</kbd> to continue',
    'f.s2.label': 'Question 2 / 7',
    'f.s2.q':  'Nice to meet you <span id="fxHello"></span> 👋 Your WhatsApp?',
    'f.s2.hint': 'We\'ll send your diagnosis there',
    'f.s2.search': 'Search country...',
    'f.s3.label': 'Question 3 / 7',
    'f.s3.q':  'What\'s your company name?',
    'f.s3.ph': 'Your company name',
    'f.s3.hint': 'Or the project you want to launch',
    'f.email.label': 'Question 4 / 7',
    'f.email.q':  'Your email?',
    'f.email.ph': 'name@company.com',
    'f.email.sub':'We recommend using your work email, but any email works.',
    'f.s4.label': 'Question 5 / 7',
    'f.s4.q':  'What\'s your industry?',
    'f.s4.ph': 'Pick an option',
    'f.s4.o1': 'Real estate', 'f.s4.o2': 'Health & Beauty',
    'f.s4.o3': 'Education', 'f.s4.o4': 'Construction',
    'f.s4.o5': 'Professional services', 'f.s4.o6': 'Retail / e-commerce',
    'f.s4.o7': 'Import / Distribution', 'f.s4.o8': 'Other',
    'f.s5.label': 'Question 6 / 7',
    'f.s5.q':   'What\'s your biggest challenge today?',
    'f.s5.sub': 'Pick one — we move on automatically.',
    'f.s5.o1': 'I don\'t have a professional website',
    'f.s5.o2': 'I run ads but don\'t see returns',
    'f.s5.o3': 'I lose leads on WhatsApp',
    'f.s5.o4': 'I don\'t know what works and what doesn\'t',
    'f.s5.o5': 'I want to scale without structure',
    'f.s6.label': 'Last question',
    'f.s6.q':   'What\'s your budget?',
    'f.s6.sub': 'So we can recommend the right plan.',
    'f.s6.o1': 'USD 500 – 1,000 / month',
    'f.s6.o2': 'USD 1,000 – 2,000 / month',
    'f.s6.o3': 'USD 2,000+ / month',
    'f.s6.o4': 'Not sure yet',
    'f.s7.title': 'Perfect, <span id="fxOkName"></span>!',
    'f.s7.sub':   'In a few minutes you\'ll receive a WhatsApp message from us. Our support AI will help you book your free consultation with the team.',
    'f.s7.btn':   'Back to site',
    'f.already.label': 'We already met',
    'f.already.title': 'Hi again, <span id="fxAlreadyName"></span>! 👋',
    'f.already.sub':   'Your request is already with us. Check your WhatsApp and email — we\'re waiting for you there to book your free consultation with our support AI.',
    'f.already.btn':   'Got it →',
    'f.already.reset': 'Submit a new request',
    'f.err.req':   'This field is required.',
    'f.err.tel':   'Please enter a valid number.',
    'f.err.email': 'Please enter a valid email.',
    'f.err.radio': 'Please pick an option.',
  },

  pt: {
    'logo.sub': 'MARKETING · VENDAS · PARAGUAI',
    'nav.services': 'Serviços', 'nav.cases': 'Cases', 'nav.method': 'Método',
    'nav.paraguay': 'Paraguai', 'nav.contact': 'Contato',
    'nav.cta': 'Diagnóstico grátis <span aria-hidden="true">→</span>',

    'hero.pill': 'Punto Alto, Asunción',
    'hero.title1': 'Cresça junto ao',
    'hero.title2': '<em>Paraguai digital.</em>',
    'hero.sub': 'Construímos o funil completo que sua empresa precisa para crescer: site que converte, Google Ads de alta performance, WhatsApp com IA de atendimento e relatórios em tempo real. Estrutura de nível global — pensada para a economia mais promissora da próxima década.',
    'hero.cta1': 'Quero meu diagnóstico <span aria-hidden="true">→</span>',
    'hero.cta2': 'Ver como fazemos',
    'chart.label': 'Receita · últimos 6 meses',
    'chart.kpi1':  'Novos leads hoje',
    'chart.kpi2':  'Fechado no WhatsApp',

    'svc.eyebrow': 'O que fazemos',
    'svc.title':   'Um time só. Todo o funil.',
    'svc.sub':     'Não vendemos peças soltas. Montamos o sistema inteiro — do primeiro clique até o fechamento no WhatsApp.',
    'svc.1.t': 'Sites que convertem',
    'svc.1.d': 'Páginas rápidas, bonitas e pensadas 100% para vender. Nada de templates.',
    'svc.1.tag': 'Design · Dev · SEO técnico',
    'svc.2.t': 'Todo o poder do Google',
    'svc.2.d': 'Search, Display, YouTube e Discovery. A maior rede publicitária do mundo com estratégia, criativos e otimização semanal com dados.',
    'svc.2.tag': 'Performance real',
    'svc.3.t': 'WhatsApp que fecha',
    'svc.3.d': 'Scripts, fluxos e técnicas comerciais avançadas para sua equipe de atendimento.',
    'svc.3.tag': 'Nossa especialidade',
    'svc.4.t': 'Relatórios em tempo real',
    'svc.4.d': 'Dashboards vivos + notificações automáticas. Nunca mais decidir no escuro.',
    'svc.4.tag': 'Sempre visível',

    'cases.eyebrow': 'Nossos cases',
    'cases.title':   'Empresas que já crescem com a gente.',
    'cases.sub':     'Dois funis. Dois setores distintos. A mesma obsessão por medir, otimizar e fechar.',
    'case.mon.tag': 'VENTURE CAPITAL ADVISORY',
    'case.mon.sector': 'Venture Capital',
    'case.mon.p': 'Consultoria para venture capital com audiência internacional. Construímos um site com animações elaboradíssimas, totalmente conectadas à identidade e ao universo da marca — uma experiência à altura do ticket que eles operam.',
    'case.mon.f1': 'Animações narrativas feitas sob medida',
    'case.mon.f2': 'Identidade visual de nível global',
    'case.mon.f3': 'Funil pronto para escalar 10×',
    'case.gua.tag': 'TRANSPORTE EXECUTIVO',
    'case.gua.sector': 'Transporte executivo',
    'case.gua.p': 'Serviço premium de traslados corporativos em Assunção. Site elegante com formulário inteligente que agenda compromissos direto no Google Calendar com todos os detalhes da viagem — zero fricção entre o lead e a reserva.',
    'case.gua.f1': 'Agenda automática no Google Calendar',
    'case.gua.f2': 'Formulário multi-etapa com detalhes da viagem',
    'case.gua.f3': 'Funil pronto para escalar 10×',
    'case.link': 'Visitar site <span aria-hidden="true">→</span>',

    'par.eyebrow': 'Por que agora',
    'par.title':   'O Paraguai que o mundo<br/>já começou. <em>E a sua empresa?</em>',
    'par.p1': 'Leis claras. Impostos entre os mais baixos do planeta. E um dos maiores potenciais de crescimento da próxima década.',
    'par.p2': 'Montar um funil de vendas moderno hoje no Paraguai vale tanto quanto vender muito mais do seu próprio produto. Se você já vende, vai vender o triplo. Se está começando, vai começar como empresa global.',
    'par.cta': 'Vamos falar do seu funil <span aria-hidden="true">→</span>',
    'par.stat1': 'Imposto de renda empresarial',
    'par.stat2': 'Crescimento PIB projetado 2026',
    'par.stat3': 'Investimento estrangeiro direto',
    'par.stat4': 'Seu funil, sempre visível',

    'met.eyebrow': 'Como trabalhamos',
    'met.title':   'Do contrato às vendas em 4 passos.',
    'met.1.t': 'Diagnóstico',
    'met.1.d': 'Auditamos seu processo atual, identificamos vazamentos e oportunidades.',
    'met.2.t': 'Construção',
    'met.2.d': 'Site, ads e WhatsApp comercial prontos em 15 dias.',
    'met.3.t': 'Otimização semanal',
    'met.3.d': 'Toda terça revisamos dados, ajustamos criativos e refinamos scripts.',
    'met.4.t': 'Relatórios ao vivo',
    'met.4.d': 'Tudo medido, tudo visível. Você e a gente olhando os mesmos números.',

    'nav.pricing': 'Preços',
    'prices.eyebrow': 'Investimento',
    'prices.title':   'Cada plano, feito sob medida.',
    'prices.sub':     'Não vendemos pacotes fechados. Montamos o plano exato conforme o tamanho da sua empresa, sua demanda e seus objetivos.',

    'prices.starter.eyebrow': 'Plano início · a partir de',
    'prices.starter.title':   'Comece com estrutura real desde o primeiro dia.',
    'prices.starter.amount':  'Gs. 1.500.000',
    'prices.starter.unit':    '/mês',
    'prices.starter.iva':     'IVA incluso',
    'prices.starter.desc':    'A base para construir seu sistema digital com fundação sólida: site otimizado, anúncios ativos e WhatsApp comercial integrado — pronto pra captar e converter.',
    'prices.starter.cta':     'Começar com este plano <span aria-hidden="true">→</span>',

    'prices.budget.eyebrow':  'Verba sugerida em ads',
    'prices.budget.title':    'O recomendado para começar.',
    'prices.budget.amount':   'Gs. 50.000',
    'prices.budget.unit':     '/dia',
    'prices.budget.min':      'Mínimo recomendado',
    'prices.budget.desc':     'Para que Google e Meta tenham dados suficientes para otimizar e trazer leads qualificados. Essa verba é paga direto à plataforma — fora da mensalidade da Punto Alto.',

    'prices.custom.eyebrow':  'Plano sob medida',
    'prices.custom.title':    'Sua empresa já está em outro patamar?',
    'prices.custom.desc':     'Para operações mais complexas —agente de IA no WhatsApp 24/7, multi-atendente, integrações com CRM, Google Ads multi-rede, gerente de conta dedicado— montamos o plano exato pro seu caso. Cotado conforme sua operação, demanda e objetivos.',
    'prices.custom.cta':      'Vamos conversar <span aria-hidden="true">→</span>',

    'prices.scope.eyebrow': 'Investimento à parte',
    'prices.scope.title':   'Nossos planos cobrem o serviço completo da agência.',
    'prices.scope.sub':     'Os itens marcados com <span class="scope-note__mark" aria-hidden="true">*</span> são contratados direto com cada fornecedor — assim você mantém controle total do seu orçamento, sem intermediários nem surpresas.',
    'prices.scope.i1.t':    'Verba de Google Ads',
    'prices.scope.i1.d':    'Orçamento de mídia pago direto ao Google.',

    'f.s7.sub':         'Em alguns minutos você vai receber uma mensagem nossa pelo WhatsApp. Lá nossa IA de atendimento te ajuda a agendar sua consultoria gratuita com a equipe.',
    // Calendar booking keys — em pausa, manter pra retomar
    'f.book.loading':   'Carregando horários disponíveis…',
    'f.book.confirming':'Confirmando sua reunião…',
    'f.book.done.title':'Reunião agendada!',
    'f.book.done.sub':  'O convite chega por email com o link do Google Meet.',
    'f.book.done.link': 'Abrir link da reunião',
    'f.book.err.taken': 'Esse horário ficou ocupado. Tente outro.',
    'f.book.err.retry': 'Ver outros horários',
    'f.book.or':        'ou',
    'f.book.ai':        'Falar com IA agora <span aria-hidden="true">→</span>',
    'prices.scope.i3.t':    'API do WhatsApp Business',
    'prices.scope.i3.d':    'Licença faturada à parte — o custo varia conforme a quantidade de números e atendentes que operam o sistema.',
    'prices.scope.i4.t':    'Email corporativo profissional',
    'prices.scope.i4.d':    'Preço varia conforme usuários — base do ecossistema digital da sua empresa.',

    'toast.label': 'Mensagens enviadas',
    'toast.title': 'Acabamos de te contatar!',
    'toast.sub':   'Confere seu WhatsApp e email — nossa IA de atendimento está te esperando lá para agendar sua consultoria gratuita.',
    'toast.wa':    'WhatsApp enviado para',
    'toast.em':    'Email enviado para',
    'toast.btn':   'Entendi ✓',

    'cta.title': 'Levamos sua empresa<br/>ao <em>ponto mais alto.</em>',
    'cta.p':     'Diagnóstico gratuito. 30 minutos. Zero compromisso. Resultados reais.',
    'cta.btn':   'Começar agora <span aria-hidden="true">→</span>',
    'cta.small': 'Resposta pelo WhatsApp em menos de 2 horas · 100% gratuito',

    'foot.logo': 'Marketing · Vendas',
    'foot.copy': '© 2026 Punto Alto — Assunção, Paraguai. Levamos sua empresa ao ponto mais alto.',

    'f.close':  'Fechar formulário',
    'f.next':   'Continuar →',
    'f.back':   '← Voltar',
    'f.s1.label': 'Pergunta 1 / 7',
    'f.s1.q':  'Como podemos te chamar?',
    'f.s1.ph': 'Seu nome',
    'f.s1.hint': 'Pressione <kbd>Enter ↵</kbd> para continuar',
    'f.s2.label': 'Pergunta 2 / 7',
    'f.s2.q':  'Prazer <span id="fxHello"></span> 👋 Seu WhatsApp?',
    'f.s2.hint': 'Vamos te enviar o diagnóstico por lá',
    'f.s2.search': 'Buscar país...',
    'f.s3.label': 'Pergunta 3 / 7',
    'f.s3.q':  'Qual o nome da sua empresa?',
    'f.s3.ph': 'Nome da sua empresa',
    'f.s3.hint': 'Ou o projeto que você quer lançar',
    'f.email.label': 'Pergunta 4 / 7',
    'f.email.q':  'Seu email?',
    'f.email.ph': 'nome@empresa.com',
    'f.email.sub':'Recomendamos que seja o corporativo, mas qualquer um funciona.',
    'f.s4.label': 'Pergunta 5 / 7',
    'f.s4.q':  'Em qual setor você atua?',
    'f.s4.ph': 'Escolha uma opção',
    'f.s4.o1': 'Imobiliário', 'f.s4.o2': 'Saúde & Estética',
    'f.s4.o3': 'Educação', 'f.s4.o4': 'Construção',
    'f.s4.o5': 'Serviços profissionais', 'f.s4.o6': 'Varejo / e-commerce',
    'f.s4.o7': 'Importadora / Distribuidora', 'f.s4.o8': 'Outro',
    'f.s5.label': 'Pergunta 6 / 7',
    'f.s5.q':   'Qual seu maior desafio hoje?',
    'f.s5.sub': 'Escolha uma — seguimos automaticamente.',
    'f.s5.o1': 'Não tenho site profissional',
    'f.s5.o2': 'Faço ads mas não vejo retorno',
    'f.s5.o3': 'Perco leads no WhatsApp',
    'f.s5.o4': 'Não sei o que funciona e o que não',
    'f.s5.o5': 'Quero escalar sem estrutura',
    'f.s6.label': 'Última pergunta',
    'f.s6.q':   'Qual seu orçamento?',
    'f.s6.sub': 'Para te indicar o plano ideal.',
    'f.s6.o1': 'USD 500 – 1.000 / mês',
    'f.s6.o2': 'USD 1.000 – 2.000 / mês',
    'f.s6.o3': 'USD 2.000+ / mês',
    'f.s6.o4': 'Ainda não está claro',
    'f.s7.title': 'Perfeito, <span id="fxOkName"></span>!',
    'f.s7.sub':   'Em alguns minutos você vai receber uma mensagem nossa no WhatsApp. Lá a nossa IA de atendimento te ajuda a agendar sua consultoria gratuita com o time.',
    'f.s7.btn':   'Voltar ao site',
    'f.already.label': 'A gente já se conhece',
    'f.already.title': 'Olá de novo, <span id="fxAlreadyName"></span>! 👋',
    'f.already.sub':   'Sua solicitação já chegou. Confere seu WhatsApp e email — estamos te esperando lá para agendar sua consultoria gratuita com nossa IA de atendimento.',
    'f.already.btn':   'Entendi →',
    'f.already.reset': 'Enviar outra solicitação',
    'f.err.req':   'Este campo é obrigatório.',
    'f.err.tel':   'Digite um número válido.',
    'f.err.email': 'Digite um email válido.',
    'f.err.radio': 'Escolha uma opção.',
  }
};

const I18N_KEY = 'pa-lang';
let currentLang = 'es';

// Expõe contexto mínimo para form.js (lazy-loaded).
window.paApp = {
  I18N,
  getCurrentLang: () => currentLang
};

function applyI18n(lang) {
  const dict = I18N[lang] || I18N.es;
  currentLang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = dict[el.dataset.i18n];
    if (v != null) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = dict[el.dataset.i18nHtml];
    if (v != null) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = dict[el.dataset.i18nPh];
    if (v != null) el.placeholder = v;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const v = dict[el.dataset.i18nAria];
    if (v != null) el.setAttribute('aria-label', v);
  });

  document.documentElement.lang = lang;
  document.querySelectorAll('.lang__btn').forEach(b =>
    b.classList.toggle('is-active', b.dataset.lang === lang)
  );
  try { localStorage.setItem(I18N_KEY, lang); } catch(e){}
}

function detectLang() {
  try {
    const saved = localStorage.getItem(I18N_KEY);
    if (saved && I18N[saved]) return saved;
  } catch(e){}
  const nav = (navigator.language || 'es').slice(0,2).toLowerCase();
  return I18N[nav] ? nav : 'es';
}

// Apply asap (before DOMContentLoaded to avoid flash)
if (document.readyState !== 'loading') {
  applyI18n(detectLang());
} else {
  document.addEventListener('DOMContentLoaded', () => applyI18n(detectLang()), { once: true });
}

document.addEventListener('DOMContentLoaded', () => {

  /* ── Language switcher ───────────────────────────── */
  document.querySelectorAll('.lang__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyI18n(btn.dataset.lang);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ── Navbar scrolled ─────────────────────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── GSAP: injetado dinamicamente após o LCP ─────────
     Tira ~90 KB (gsap + ScrollTrigger) do caminho crítico.
     Scripts baixam via requestIdleCallback, depois do FCP/LCP. */
  const GSAP_URL = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js';
  const ST_URL   = 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js';

  const _loadScript = (src) => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload  = () => resolve(true);
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });

  let _gsapPromise = null;
  const _ensureGsap = () => {
    if (window.gsap) return Promise.resolve(true);
    if (!_gsapPromise) {
      _gsapPromise = _loadScript(GSAP_URL).catch(() => false);
    }
    return _gsapPromise;
  };

  let _stPromise = null;
  const _ensureScrollTrigger = () => {
    if (window.ScrollTrigger) return Promise.resolve(true);
    if (!_stPromise) {
      _stPromise = _ensureGsap().then((ok) => {
        if (!ok || !window.gsap) return false;
        return _loadScript(ST_URL).catch(() => false);
      });
    }
    return _stPromise;
  };

  // Fallback: se GSAP não carregar em 4 s, mostra o chart estaticamente
  // (ele começa com opacity:0 e vira visível só com a classe .is-ready).
  setTimeout(() => {
    const chart = document.querySelector('.chart');
    if (chart && !chart.classList.contains('is-ready') && !window.gsap) {
      chart.classList.add('is-ready');
    }
  }, 4000);

  const _runGsap = async () => {
    const ok = await _ensureGsap();
    if (!ok || !window.gsap) return;

    // Hero: split by line
    const lines = document.querySelectorAll('.hero__title .js-line');
    gsap.set(lines, { yPercent: 110 });
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(lines, { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.2);

    // Hero: reveal elements
    gsap.utils.toArray('.hero .js-reveal').forEach((el, i) => {
      gsap.from(el, {
        y: 28, opacity: 0, duration: 1, ease: 'expo.out',
        delay: 0.6 + i * 0.1
      });
    });

    // ── Growth chart animation ─────────────────────────
    const chart = document.querySelector('.chart');
    if (chart) {
      const line = chart.querySelector('.chart__line');
      const area = chart.querySelector('.chart__area');
      const dots = chart.querySelectorAll('.chart__dots circle');
      const pills = chart.querySelectorAll('.chart__pill');
      const valueEl = document.getElementById('chartValue');
      const pctEl   = document.getElementById('chartPct');
      const leadsEl = document.getElementById('kpiLeads');
      const closeEl = document.getElementById('kpiClose');

      // Measure line path length for stroke-dashoffset
      const len = line.getTotalLength ? line.getTotalLength() : 1000;
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });

      const chartTL = gsap.timeline({ delay: 0.9 });

      chartTL
        .to(chart, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out',
          onStart: () => chart.classList.add('is-ready') })
        .to(line, { strokeDashoffset: 0, duration: 2, ease: 'power2.out' }, '-=0.3')
        .to(area, { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=1.8')
        .to(dots, {
          opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)',
          stagger: 0.12,
          transformOrigin: 'center center'
        }, '-=1.6')
        .to(pills, {
          opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
          stagger: 0.15,
          onStart: () => pills.forEach(p => p.classList.add('is-ready'))
        }, '-=1.2');

      // Counter: revenue value $0 → $284,500
      chartTL.to({ v: 0 }, {
        v: 284500, duration: 2, ease: 'power2.out',
        onUpdate: function() {
          if (valueEl) valueEl.textContent =
            '$' + Math.floor(this.targets()[0].v).toLocaleString('en-US');
        }
      }, '-=2.8');

      // Counter: +312%
      chartTL.to({ v: 0 }, {
        v: 312, duration: 1.8, ease: 'power2.out',
        onUpdate: function() {
          if (pctEl) pctEl.textContent = '+' + Math.floor(this.targets()[0].v) + '%';
        }
      }, '-=2.6');

      // KPI pills counters
      chartTL.to({ v: 0 }, {
        v: 47, duration: 1.4, ease: 'power2.out',
        onUpdate: function() {
          if (leadsEl) leadsEl.textContent = Math.floor(this.targets()[0].v);
        }
      }, '-=1.5');

      chartTL.to({ v: 0 }, {
        v: 68, duration: 1.4, ease: 'power2.out',
        onUpdate: function() {
          if (closeEl) closeEl.textContent = Math.floor(this.targets()[0].v) + '%';
        }
      }, '-=1.4');

      // Subtle parallax on chart with mouse
      chart.addEventListener('mousemove', (e) => {
        const rect = chart.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
        gsap.to(chart.querySelector('.chart__card'), {
          rotationY: x, rotationX: -y, duration: 0.8, ease: 'power2.out',
          transformPerspective: 1000
        });
      });
      chart.addEventListener('mouseleave', () => {
        gsap.to(chart.querySelector('.chart__card'), {
          rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power2.out'
        });
      });
    }

    // Hero glow parallax
    const glow = document.querySelector('.hero__glow');
    if (glow) {
      window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 30;
        const y = (e.clientY / window.innerHeight - 0.5) * 30;
        gsap.to(glow, { x, y, duration: 1.2, ease: 'power3.out' });
      });
    }

    /* ── Scroll-linked animations: lazy no 1º scroll ─────
       ScrollTrigger fazia ~1 s de reflow forçado ao registrar
       40+ triggers. Adiando para o 1º scroll real, o above-fold
       pinta limpo — o usuário só vê essas animações depois de
       rolar de qualquer jeito. Fallback 10 s caso ele não role. */
    let _scrollAnimInited = false;
    const _initScrollAnim = async () => {
      if (_scrollAnimInited) return;
      _scrollAnimInited = true;
      const stOk = await _ensureScrollTrigger();
      if (!stOk || !window.ScrollTrigger) return;
      gsap.registerPlugin(ScrollTrigger);

    // Chevron parallax on scroll
    gsap.to('.hero__chevron', {
      yPercent: -20,
      rotation: 4,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // ── Scroll-linked reveals (scrub fluido) ───────────
    // Cada elemento se interpola con el scroll: más suave y orgánico.
    gsap.utils.toArray('.js-reveal').forEach(el => {
      if (el.closest('.hero')) return;
      if (el.classList.contains('case')) return;
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            end: 'top 65%',
            scrub: 1
          }
        }
      );
    });

    // ── Counters (una vez, al entrar) ──────────────────
    gsap.utils.toArray('[data-counter]').forEach(el => {
      const end = parseFloat(el.dataset.counter);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const isDecimal = end % 1 !== 0;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: 2,
            ease: 'expo.out',
            onUpdate: () => {
              const n = isDecimal ? obj.v.toFixed(1) : Math.floor(obj.v);
              el.textContent = prefix + n + suffix;
            }
          });
        }
      });
    });

    // ── Helper: stagger con scrub ──────────────────────
    const scrubStagger = (selector, triggerSel, opts = {}) => {
      const items = gsap.utils.toArray(selector);
      if (!items.length) return;
      const trigger = document.querySelector(triggerSel);
      if (!trigger) return;

      gsap.fromTo(items,
        { y: opts.y || 70, opacity: 0 },
        {
          y: 0, opacity: 1, ease: 'none',
          stagger: { each: opts.each || 0.15, from: 'start' },
          scrollTrigger: {
            trigger,
            start: opts.start || 'top 90%',
            end: opts.end || 'top 50%',
            scrub: opts.scrub || 1.2
          }
        }
      );
    };

    scrubStagger('.card', '.grid--4',  { y: 70, each: 0.12 });
    scrubStagger('.case', '.cases',    { y: 80, each: 0.18 });
    scrubStagger('.step', '.steps',    { y: 70, each: 0.14 });
    scrubStagger('.stat', '.paraguay__stats', { y: 60, each: 0.1 });

    // ── Parallax sutil en cases preview ────────────────
    gsap.utils.toArray('.case__preview-inner').forEach(el => {
      gsap.fromTo(el,
        { yPercent: 8 },
        {
          yPercent: -8, ease: 'none',
          scrollTrigger: {
            trigger: el.closest('.case'),
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    });

    // ── Parallax en el bg del hero al scrollar ─────────
    gsap.to('.hero__grid', {
      yPercent: 25, ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
    gsap.to('.hero__glow', {
      yPercent: 40, opacity: 0.4, ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // ── Section headings: sube sutilmente con scroll ───
    gsap.utils.toArray('.section__head').forEach(head => {
      gsap.fromTo(head,
        { y: 30 },
        {
          y: -20, ease: 'none',
          scrollTrigger: {
            trigger: head,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        }
      );
    });

    // ── CTA final: glow expande con scroll ─────────────
    gsap.fromTo('.cta-final__box',
      { scale: 0.96 },
      {
        scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: '.cta-final',
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1
        }
      }
    );

    // Refresh después de fuentes/imágenes
    window.addEventListener('load', () => ScrollTrigger.refresh());
    }; // ← fecha _initScrollAnim

    // Dispara na primeira rolagem; 10 s de fallback se não rolar.
    window.addEventListener('scroll', _initScrollAnim, { once: true, passive: true });
    setTimeout(_initScrollAnim, 10000);
  };

  // Dispara o GSAP quando o browser estiver ocioso (após FCP/LCP).
  if ('requestIdleCallback' in window) {
    requestIdleCallback(_runGsap, { timeout: 2000 });
  } else {
    setTimeout(_runGsap, 300);
  }


  /* ════════════════════════════════════════════════════
     FORM OVERLAY — lazy-loaded
     ----------------------------------------------------
     Toda a lógica do formulário (~27 KB) vive em form.js.
     Carregamos o arquivo só na 1ª vez que o usuário clica
     num [data-open-form], e delegamos o open() para ele.
     ════════════════════════════════════════════════════ */
  let _formLoadPromise = null;
  const _loadForm = () => {
    if (_formLoadPromise) return _formLoadPromise;
    _formLoadPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src     = 'form.js';
      s.defer   = true;
      s.onload  = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    return _formLoadPromise;
  };

  document.querySelectorAll('[data-open-form]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const src = btn.getAttribute('data-open-form-source') || 'unknown';
      try {
        await _loadForm();
        window.paForm?.open?.(src);
      } catch (err) {
        console.warn('[PUNTO ALTO] form.js load failed:', err);
      }
    });
  });
});
