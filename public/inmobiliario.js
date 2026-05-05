/* ════════════════════════════════════════════════════════
   PUNTO ALTO PARA INMOBILIARIAS — JS
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

/* ════════════════════════════════════════════════════════
   i18n — ES (default) · EN · PT
   ════════════════════════════════════════════════════════ */
const I18N = {
  es: {
    'logo.sub': 'PARA INMOBILIARIAS',
    'nav.services': 'Servicios', 'nav.whatsapp': 'WhatsApp', 'nav.financing': 'Financiación',
    'nav.map': 'Mapa de leads', 'nav.pricing': 'Precios', 'nav.cta': 'Diagnóstico gratis →',

    'hero.pill': 'Captación inmobiliaria · Paraguay',
    'hero.title1': 'Vendé más inmuebles.',
    'hero.title2': '<em>Perdé menos tiempo.</em>',
    'hero.sub': 'Captación con leads pre-cualificados, WhatsApp comercial que agenda visitas solo, simulador de financiación integrado y CRM con deal stage. Tu equipo deja de correr atrás de curiosos — y se enfoca en quien viene a comprar.',
    'hero.cta1': 'Quiero más leads cualificados →',
    'hero.cta2': 'Ver demo en vivo',

    'wa.contact': 'Carla · Edificio Las Lomas',
    'wa.online': 'en línea',
    'wa.placeholder': 'Escribí un mensaje…',

    'stats.s1': 'Más visitas agendadas',
    'stats.s2': 'Tiempo de respuesta al lead',
    'stats.s3': 'Leads pre-cualificados',
    'stats.s4': 'De contrato a primera campaña',

    'pain.eyebrow': 'El problema real del corredor',
    'pain.title': 'El 70% de tus leads no son <em>compradores</em>.',
    'pain.sub': 'Son curiosos, vecinos chusmeando precios, gente que "está mirando". Tu equipo agota su día respondiendo a quien nunca va a comprar — y los compradores reales se duermen sin respuesta.',
    'pain.bad.title': 'Tu funnel hoy',
    'pain.bad.l1': 'Leads desde Meta/Google',
    'pain.bad.l2': 'Respuesta más de 1 hora',
    'pain.bad.l3': 'Realmente conversaron',
    'pain.bad.l4': 'Visitas agendadas',
    'pain.bad.l5': 'Cierres en el mes',
    'pain.good.title': 'Funnel con Punto Alto',
    'pain.good.l1': 'Leads desde Meta/Google',
    'pain.good.l2': 'Respuesta <60 segundos',
    'pain.good.l3': 'Pre-cualificados por bot',
    'pain.good.l4': 'Visitas agendadas',
    'pain.good.l5': 'Cierres en el mes',

    'svc.eyebrow': 'Lo que armamos para tu inmobiliaria',
    'svc.title': 'El sistema completo — del <em>primer clic</em> al cierre.',
    'svc.sub': 'No vendemos creativos sueltos. Armamos la operación entera: ads, captación, qualification, CRM, financiación, cierre. Todo medido, todo conectado.',
    'svc.1.t': 'Ads geo-segmentados',
    'svc.1.d': 'Meta y Google con targeting por barrio, nivel socioeconómico y comportamiento de compra. Lookalike de compradores reales — no de curiosos.',
    'svc.1.tag': 'Meta · Google · Lookalike',
    'svc.2.t': 'WhatsApp que pre-califica',
    'svc.2.d': 'Bot conversacional que filtra: presupuesto, plazo de compra, financiación aprobada, zona. Solo te entrega leads listos para visita.',
    'svc.2.tag': 'Auto-respuesta <60 seg',
    'svc.3.t': 'CRM con deal stage',
    'svc.3.d': 'Funnel real del inmueble: contacto → visita agendada → visita hecha → propuesta → cierre. Cada lead, cada etapa, cada corredor.',
    'svc.3.tag': 'Pipeline · Reportes · Alertas',
    'svc.4.t': 'Landing por emprendimiento',
    'svc.4.d': 'Una página dedicada por proyecto premium: galería, planta, simulador de financiación, agenda de visita. No un sitio institucional inútil.',
    'svc.4.tag': 'Una por proyecto',
    'svc.5.t': 'Simulador de financiación',
    'svc.5.d': 'BNF, BCP, Itaú, Continental — el lead simula su cuota antes de hablar con vos. Llega ya sabiendo cuánto puede pagar.',
    'svc.5.tag': 'Bancos PY integrados',
    'svc.6.t': 'Drip de nurturing 90 días',
    'svc.6.d': 'El lead que no compra hoy compra en 6 meses. WhatsApp y email automático con nuevos inmuebles, contenido del barrio, alertas de oportunidad.',
    'svc.6.tag': 'Long-cycle automation',

    'wa.eyebrow': 'Demo en vivo',
    'wa.title': 'Probá el bot que <em>pre-califica</em> tus leads.',
    'wa.sub': 'Así conversa con un lead frío que vino desde Meta Ads. Antes de pasarle el contacto a tu corredor, ya sabe presupuesto, zona, plazo y si tiene financiación aprobada.',
    'wa.demo.contact': 'Inmobiliaria Demo',
    'wa.demo.bot': 'bot · respuesta automática',
    'wa.panel.title': 'Lo que el bot ya capturó',
    'wa.cap.zone': 'Zona de interés',
    'wa.cap.type': 'Tipo de inmueble',
    'wa.cap.budget': 'Presupuesto',
    'wa.cap.deadline': 'Plazo de compra',
    'wa.cap.financing': 'Financiación',
    'wa.score.label': 'Score de calificación',
    'wa.reset': '↻ Reiniciar conversación',

    'fin.eyebrow': 'Calculadora integrada',
    'fin.title': 'Tu lead simula la <em>cuota mensual</em> antes de llamarte.',
    'fin.sub': 'Calculadora con tasas reales de bancos paraguayos (BNF, BCP, Itaú, Continental). El lead llega sabiendo cuánto puede pagar y por cuántos años — vos solo tenés que cerrar.',
    'fin.form.title': 'Datos del inmueble',
    'fin.f.price': 'Precio del inmueble (USD)',
    'fin.f.down': 'Entrada (%)',
    'fin.f.years': 'Plazo (años)',
    'fin.f.bank': 'Banco',
    'fin.result.eyebrow': 'Cuota mensual estimada',
    'fin.b.principal': 'Capital financiado',
    'fin.b.interest': 'Intereses totales',
    'fin.b.total': 'Pagado al final',
    'fin.disclaimer': 'Cálculo referencial con tasas promedio del mercado paraguayo. La aprobación y tasa final dependen de cada banco y del perfil del cliente.',

    'roi.eyebrow': 'Para inmuebles de inversión',
    'roi.title': 'Atraé al inversionista con <em>números, no con fotos</em>.',
    'roi.sub': 'Calculadora de retorno mensual y anual. El lead investidor ve directamente el cap rate, el alquiler estimado de la zona y el ROI a 5 años — y agenda la visita con la decisión casi tomada.',
    'roi.f.price': 'Precio del inmueble',
    'roi.f.rent': 'Alquiler mensual estimado',
    'roi.f.fees': 'Gastos mensuales (mantenimiento, expensas)',
    'roi.f.appreciation': 'Apreciación anual estimada',
    'roi.r.cap': 'Cap Rate anual',
    'roi.r.cashflow': 'Cash flow mensual',
    'roi.r.5y': 'Retorno total a 5 años',
    'roi.r.payback': 'Payback estimado',

    'map.eyebrow': 'Visibilidad geográfica',
    'map.title': 'Mirá <em>desde dónde</em> vienen tus leads.',
    'map.sub': 'Cada punto en el mapa es un lead real captado en la última semana. Filtrá por barrio, presupuesto o tipo de inmueble — y ajustá tus campañas hacia las zonas que más responden.',
    'map.f.all': 'Todos los leads', 'map.f.hot': '🔥 Hot (>USD 150k)', 'map.f.invest': 'Inversión', 'map.f.first': 'Primera vivienda',
    'map.l.hot': 'Lead caliente', 'map.l.warm': 'Lead tibio', 'map.l.cold': 'Lead frío',
    'map.l.live': 'en vivo · últimos 7 días',

    'price.eyebrow': 'Inversión',
    'price.title': 'Cada plan, hecho a medida.',
    'price.sub': 'No vendemos paquetes cerrados. Armamos el plan exacto según el tamaño de tu inmobiliaria, tu cartera de inmuebles y los procesos que necesitás automatizar.',
    'price.start.eyebrow': 'Plan inicio · desde',
    'price.start.title': 'Empezá a captar como agencia, no como corredor solo.',
    'price.start.tag': 'IVA incluido',
    'price.start.desc': 'El piso para profesionalizar tu operación: landing por proyecto, ads geo-segmentados, WhatsApp con auto-respuesta, simulador de financiación y reporte mensual.',
    'price.start.cta': 'Empezar con este plan →',
    'price.ads.eyebrow': 'Verba sugerida en ads',
    'price.ads.title': 'Lo recomendado para inmuebles.',
    'price.ads.tag': 'Mínimo recomendado',
    'price.ads.desc': 'El ticket inmobiliario es alto, entonces la inversión en ads tiene que ser proporcional. Este presupuesto se paga directo a Meta/Google — fuera de la mensualidad de Punto Alto.',
    'price.custom.eyebrow': 'Plan a tu medida',
    'price.custom.title': '¿Sos developer, fideicomiso o tenés varios proyectos?',
    'price.custom.desc': 'Para operaciones complejas — múltiples emprendimientos, equipo de 5+ corredores, IA en WhatsApp 24/7 multi-idioma, integración con CRM existente, gerente de cuenta dedicado — armamos un plan exacto. Cotizamos según operación, cartera y objetivos.',
    'price.custom.cta': 'Hablemos →',
    'scope.eyebrow': 'Inversión aparte',
    'scope.title': 'Nuestros planes cubren el servicio completo de la agencia.',
    'scope.sub': 'Los ítems marcados con <span class="scope-note__mark" aria-hidden="true">*</span> se contratan directo con cada proveedor — así mantenés control total sobre tu presupuesto, sin intermediarios ni sorpresas.',
    'scope.i1.t': 'Pauta en Meta y Google Ads',
    'scope.i1.d': 'Presupuesto pagado directo a las plataformas — recomendamos Gs. 80.000/día mínimo.',
    'scope.i2.t': 'API de WhatsApp Business',
    'scope.i2.d': 'Licencia oficial de Meta — varía según números y atendentes que operen el bot.',
    'scope.i3.t': 'Hosting y dominio premium',
    'scope.i3.d': 'Recomendamos hosting dedicado para landings de proyectos grandes — costo aparte según tráfico.',

    'cta.title': 'Captá leads que <em>realmente compran.</em>',
    'cta.sub': 'Diagnóstico gratuito de 30 minutos. Te mostramos cómo armar el funnel completo para tu inmobiliaria — y qué números podés esperar en los próximos 90 días.',
    'cta.btn': 'Agendar diagnóstico →',
    'cta.trust': 'Respuesta por WhatsApp en menos de 2 horas · 100% gratuito',

    'footer.sub': 'Para Inmobiliarias',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'Para Contadores',
    'footer.copy': '© 2026 Punto Alto — Asunción, Paraguay. Captación inmobiliaria con datos.',

    'form.s1.label': 'Pregunta 1 / 5', 'form.s1.q': '¿Cómo te llamamos?', 'form.s1.ph': 'Tu nombre',
    'form.s2.label': 'Pregunta 2 / 5', 'form.s2.q': '¿Tu número de WhatsApp?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'Te contactamos ahí con la agenda',
    'form.s3.label': 'Pregunta 3 / 5', 'form.s3.q': '¿Nombre de tu inmobiliaria?', 'form.s3.ph': 'Tu inmobiliaria o equipo',
    'form.s4.label': 'Pregunta 4 / 5', 'form.s4.q': '¿Cuántos corredores son en el equipo?', 'form.s4.sub': 'Para dimensionar el plan ideal.',
    'form.s4.o1': 'Solo yo', 'form.s4.o2': '2 – 5 corredores', 'form.s4.o3': '6 – 15 corredores', 'form.s4.o4': 'Más de 15',
    'form.s5.label': 'Última pregunta', 'form.s5.q': '¿Cuál es tu mayor desafío hoy?', 'form.s5.sub': 'Elegí uno — seguimos automáticamente.',
    'form.s5.o1': 'Conseguir leads cualificados', 'form.s5.o2': 'Responder WhatsApp a tiempo',
    'form.s5.o3': 'Convertir leads en visitas', 'form.s5.o4': 'Organizar el funnel del equipo', 'form.s5.o5': 'Todo lo anterior',
    'form.next': 'Continuar →', 'form.back': '← Volver',
    'form.hint.enter': 'Presioná <kbd>Enter ↵</kbd> para continuar',
    'form.ok.title': '¡Perfecto, <span id="fxOkName"></span>!',
    'form.ok.sub': 'Te escribimos por WhatsApp en menos de 2 horas para agendar tu diagnóstico inmobiliario gratuito.',
    'form.ok.btn': 'Volver al sitio',
  },

  en: {
    'logo.sub': 'FOR REAL ESTATE',
    'nav.services': 'Services', 'nav.whatsapp': 'WhatsApp', 'nav.financing': 'Financing',
    'nav.map': 'Lead map', 'nav.pricing': 'Pricing', 'nav.cta': 'Free diagnosis →',

    'hero.pill': 'Real estate lead-gen · Paraguay',
    'hero.title1': 'Sell more properties.',
    'hero.title2': '<em>Waste less time.</em>',
    'hero.sub': 'Pre-qualified leads, a WhatsApp bot that books visits on its own, integrated mortgage simulator and a CRM with deal stages. Your team stops chasing tire-kickers — and focuses on real buyers.',
    'hero.cta1': 'I want qualified leads →',
    'hero.cta2': 'See live demo',

    'wa.contact': 'Carla · Las Lomas Building',
    'wa.online': 'online',
    'wa.placeholder': 'Type a message…',

    'stats.s1': 'More visits booked',
    'stats.s2': 'Lead response time',
    'stats.s3': 'Pre-qualified leads',
    'stats.s4': 'From contract to first campaign',

    'pain.eyebrow': "The broker's real problem",
    'pain.title': '70% of your leads are not <em>buyers</em>.',
    'pain.sub': 'They are tire-kickers, neighbors snooping prices, people "just looking". Your team burns the day responding to people who will never buy — while real buyers go cold without a reply.',
    'pain.bad.title': 'Your funnel today',
    'pain.bad.l1': 'Leads from Meta/Google',
    'pain.bad.l2': 'Reply over 1 hour',
    'pain.bad.l3': 'Actually conversed',
    'pain.bad.l4': 'Visits booked',
    'pain.bad.l5': 'Closes this month',
    'pain.good.title': 'Funnel with Punto Alto',
    'pain.good.l1': 'Leads from Meta/Google',
    'pain.good.l2': 'Reply <60 seconds',
    'pain.good.l3': 'Pre-qualified by bot',
    'pain.good.l4': 'Visits booked',
    'pain.good.l5': 'Closes this month',

    'svc.eyebrow': 'What we build for your agency',
    'svc.title': 'The whole system — from <em>first click</em> to closing.',
    'svc.sub': 'We don\'t sell loose creatives. We build the entire operation: ads, capture, qualification, CRM, financing, closing. Everything measured, everything connected.',
    'svc.1.t': 'Geo-targeted ads',
    'svc.1.d': 'Meta and Google with targeting by neighborhood, income tier and buying behavior. Lookalike of real buyers — not of curious people.',
    'svc.1.tag': 'Meta · Google · Lookalike',
    'svc.2.t': 'WhatsApp that pre-qualifies',
    'svc.2.d': 'Conversational bot that filters: budget, timeframe, approved financing, zone. Only delivers leads ready for a visit.',
    'svc.2.tag': 'Auto-reply <60 sec',
    'svc.3.t': 'CRM with deal stage',
    'svc.3.d': 'Real property funnel: contact → visit booked → visit done → offer → close. Every lead, every stage, every broker.',
    'svc.3.tag': 'Pipeline · Reports · Alerts',
    'svc.4.t': 'Landing per development',
    'svc.4.d': 'A dedicated page per premium project: gallery, floor plan, mortgage simulator, visit booking. Not a useless institutional site.',
    'svc.4.tag': 'One per project',
    'svc.5.t': 'Mortgage simulator',
    'svc.5.d': 'BNF, BCP, Itaú, Continental — the lead simulates the monthly payment before talking to you. Arrives knowing what they can afford.',
    'svc.5.tag': 'PY banks integrated',
    'svc.6.t': '90-day nurturing drip',
    'svc.6.d': 'A lead who doesn\'t buy today buys in 6 months. Automated WhatsApp and email with new properties, neighborhood content, opportunity alerts.',
    'svc.6.tag': 'Long-cycle automation',

    'wa.eyebrow': 'Live demo',
    'wa.title': 'Try the bot that <em>pre-qualifies</em> your leads.',
    'wa.sub': 'This is how it talks to a cold lead from Meta Ads. Before passing the contact to your broker, it already knows budget, zone, timeframe and whether they have financing approved.',
    'wa.demo.contact': 'Demo Real Estate',
    'wa.demo.bot': 'bot · auto-reply',
    'wa.panel.title': 'What the bot already captured',
    'wa.cap.zone': 'Zone of interest',
    'wa.cap.type': 'Property type',
    'wa.cap.budget': 'Budget',
    'wa.cap.deadline': 'Buying timeframe',
    'wa.cap.financing': 'Financing',
    'wa.score.label': 'Qualification score',
    'wa.reset': '↻ Reset conversation',

    'fin.eyebrow': 'Integrated calculator',
    'fin.title': 'Your lead simulates the <em>monthly payment</em> before calling you.',
    'fin.sub': 'Calculator with real rates from Paraguayan banks (BNF, BCP, Itaú, Continental). The lead arrives knowing what they can pay monthly and over how many years — you only have to close.',
    'fin.form.title': 'Property details',
    'fin.f.price': 'Property price (USD)',
    'fin.f.down': 'Down payment (%)',
    'fin.f.years': 'Term (years)',
    'fin.f.bank': 'Bank',
    'fin.result.eyebrow': 'Estimated monthly payment',
    'fin.b.principal': 'Financed amount',
    'fin.b.interest': 'Total interest',
    'fin.b.total': 'Paid at the end',
    'fin.disclaimer': 'Reference calculation using average market rates in Paraguay. Final approval and rate depend on each bank and on the customer profile.',

    'roi.eyebrow': 'For investment properties',
    'roi.title': 'Attract investors with <em>numbers, not photos</em>.',
    'roi.sub': 'Monthly and annual return calculator. The investor lead sees cap rate, estimated rent for the zone and 5-year ROI directly — and books a visit almost decided.',
    'roi.f.price': 'Property price',
    'roi.f.rent': 'Estimated monthly rent',
    'roi.f.fees': 'Monthly costs (maintenance, fees)',
    'roi.f.appreciation': 'Estimated annual appreciation',
    'roi.r.cap': 'Annual Cap Rate',
    'roi.r.cashflow': 'Monthly cash flow',
    'roi.r.5y': 'Total return after 5 years',
    'roi.r.payback': 'Estimated payback',

    'map.eyebrow': 'Geographic visibility',
    'map.title': 'See <em>where</em> your leads come from.',
    'map.sub': 'Each dot on the map is a real lead captured in the last week. Filter by neighborhood, budget or property type — and shift your campaigns toward the zones that respond best.',
    'map.f.all': 'All leads', 'map.f.hot': '🔥 Hot (>USD 150k)', 'map.f.invest': 'Investment', 'map.f.first': 'First home',
    'map.l.hot': 'Hot lead', 'map.l.warm': 'Warm lead', 'map.l.cold': 'Cold lead',
    'map.l.live': 'live · last 7 days',

    'price.eyebrow': 'Investment',
    'price.title': 'Every plan, tailor-made.',
    'price.sub': 'We don\'t sell closed packages. We build the exact plan based on the size of your agency, your inventory and the processes you need to automate.',
    'price.start.eyebrow': 'Starter plan · from',
    'price.start.title': 'Operate as an agency, not a solo broker.',
    'price.start.tag': 'VAT included',
    'price.start.desc': 'The floor to professionalize your operation: landing per project, geo-targeted ads, WhatsApp with auto-reply, mortgage simulator and monthly report.',
    'price.start.cta': 'Start with this plan →',
    'price.ads.eyebrow': 'Suggested ad budget',
    'price.ads.title': 'Recommended for real estate.',
    'price.ads.tag': 'Recommended minimum',
    'price.ads.desc': 'Real estate tickets are high, so the ad investment must be proportional. This budget is paid directly to Meta/Google — separate from the Punto Alto fee.',
    'price.custom.eyebrow': 'Custom plan',
    'price.custom.title': 'Are you a developer, REIT or have multiple projects?',
    'price.custom.desc': 'For complex operations — multiple developments, 5+ broker team, multilingual 24/7 WhatsApp AI, integration with existing CRM, dedicated account manager — we build an exact plan. We quote based on operation, portfolio and goals.',
    'price.custom.cta': 'Let\'s talk →',
    'scope.eyebrow': 'Separate investment',
    'scope.title': 'Our plans cover the full agency service.',
    'scope.sub': 'Items marked with <span class="scope-note__mark" aria-hidden="true">*</span> are contracted directly with each provider — keeping you in full control of your budget, no middlemen, no surprises.',
    'scope.i1.t': 'Meta and Google Ads spend',
    'scope.i1.d': 'Budget paid directly to the platforms — we recommend Gs. 80,000/day minimum.',
    'scope.i2.t': 'WhatsApp Business API',
    'scope.i2.d': 'Official Meta license — varies based on numbers and agents operating the bot.',
    'scope.i3.t': 'Premium hosting and domain',
    'scope.i3.d': 'For large project landings we recommend dedicated hosting — separate cost based on traffic.',

    'cta.title': 'Capture leads who <em>actually buy.</em>',
    'cta.sub': '30-min free diagnosis. We show you how to build the full funnel for your agency — and what numbers to expect in the next 90 days.',
    'cta.btn': 'Book diagnosis →',
    'cta.trust': 'WhatsApp reply in under 2 hours · 100% free',

    'footer.sub': 'For Real Estate',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'For Accountants',
    'footer.copy': '© 2026 Punto Alto — Asunción, Paraguay. Real estate lead-gen with data.',

    'form.s1.label': 'Question 1 / 5', 'form.s1.q': 'What should we call you?', 'form.s1.ph': 'Your name',
    'form.s2.label': 'Question 2 / 5', 'form.s2.q': 'Your WhatsApp number?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'We\'ll reach you there to schedule',
    'form.s3.label': 'Question 3 / 5', 'form.s3.q': 'Name of your real estate agency?', 'form.s3.ph': 'Your agency or team',
    'form.s4.label': 'Question 4 / 5', 'form.s4.q': 'How many brokers in your team?', 'form.s4.sub': 'To size the right plan.',
    'form.s4.o1': 'Just me', 'form.s4.o2': '2 – 5 brokers', 'form.s4.o3': '6 – 15 brokers', 'form.s4.o4': 'More than 15',
    'form.s5.label': 'Last question', 'form.s5.q': 'What\'s your biggest challenge today?', 'form.s5.sub': 'Pick one — we continue automatically.',
    'form.s5.o1': 'Getting qualified leads', 'form.s5.o2': 'Replying WhatsApp on time',
    'form.s5.o3': 'Converting leads into visits', 'form.s5.o4': 'Organizing the team funnel', 'form.s5.o5': 'All of the above',
    'form.next': 'Continue →', 'form.back': '← Back',
    'form.hint.enter': 'Press <kbd>Enter ↵</kbd> to continue',
    'form.ok.title': 'Perfect, <span id="fxOkName"></span>!',
    'form.ok.sub': 'We\'ll WhatsApp you in under 2 hours to schedule your free real estate diagnosis.',
    'form.ok.btn': 'Back to site',
  },

  pt: {
    'logo.sub': 'PARA IMOBILIÁRIAS',
    'nav.services': 'Serviços', 'nav.whatsapp': 'WhatsApp', 'nav.financing': 'Financiamento',
    'nav.map': 'Mapa de leads', 'nav.pricing': 'Preços', 'nav.cta': 'Diagnóstico grátis →',

    'hero.pill': 'Captação imobiliária · Paraguai',
    'hero.title1': 'Venda mais imóveis.',
    'hero.title2': '<em>Perca menos tempo.</em>',
    'hero.sub': 'Captação com leads pré-qualificados, WhatsApp comercial que agenda visitas sozinho, simulador de financiamento integrado e CRM com deal stage. Sua equipe para de correr atrás de curiosos — e foca em quem vem para comprar.',
    'hero.cta1': 'Quero leads qualificados →',
    'hero.cta2': 'Ver demo ao vivo',

    'wa.contact': 'Carla · Edifício Las Lomas',
    'wa.online': 'online',
    'wa.placeholder': 'Escreva uma mensagem…',

    'stats.s1': 'Mais visitas agendadas',
    'stats.s2': 'Tempo de resposta ao lead',
    'stats.s3': 'Leads pré-qualificados',
    'stats.s4': 'De contrato à primeira campanha',

    'pain.eyebrow': 'O problema real do corretor',
    'pain.title': '70% dos seus leads não são <em>compradores</em>.',
    'pain.sub': 'São curiosos, vizinhos espiando preços, pessoas que "estão olhando". Sua equipe gasta o dia respondendo a quem nunca vai comprar — e os compradores reais esfriam sem resposta.',
    'pain.bad.title': 'Seu funil hoje',
    'pain.bad.l1': 'Leads do Meta/Google',
    'pain.bad.l2': 'Resposta acima de 1 hora',
    'pain.bad.l3': 'Realmente conversaram',
    'pain.bad.l4': 'Visitas agendadas',
    'pain.bad.l5': 'Fechamentos no mês',
    'pain.good.title': 'Funil com Punto Alto',
    'pain.good.l1': 'Leads do Meta/Google',
    'pain.good.l2': 'Resposta <60 segundos',
    'pain.good.l3': 'Pré-qualificados pelo bot',
    'pain.good.l4': 'Visitas agendadas',
    'pain.good.l5': 'Fechamentos no mês',

    'svc.eyebrow': 'O que montamos para sua imobiliária',
    'svc.title': 'O sistema completo — do <em>primeiro clique</em> ao fechamento.',
    'svc.sub': 'Não vendemos criativos soltos. Montamos a operação inteira: ads, captação, qualificação, CRM, financiamento, fechamento. Tudo medido, tudo conectado.',
    'svc.1.t': 'Ads geo-segmentados',
    'svc.1.d': 'Meta e Google com targeting por bairro, faixa de renda e comportamento de compra. Lookalike de compradores reais — não de curiosos.',
    'svc.1.tag': 'Meta · Google · Lookalike',
    'svc.2.t': 'WhatsApp que pré-qualifica',
    'svc.2.d': 'Bot conversacional que filtra: orçamento, prazo, financiamento aprovado, zona. Só te entrega leads prontos para visita.',
    'svc.2.tag': 'Auto-resposta <60 seg',
    'svc.3.t': 'CRM com deal stage',
    'svc.3.d': 'Funil real do imóvel: contato → visita agendada → visita feita → proposta → fechamento. Cada lead, cada etapa, cada corretor.',
    'svc.3.tag': 'Pipeline · Relatórios · Alertas',
    'svc.4.t': 'Landing por empreendimento',
    'svc.4.d': 'Uma página dedicada por projeto premium: galeria, planta, simulador, agenda de visita. Não um site institucional inútil.',
    'svc.4.tag': 'Uma por projeto',
    'svc.5.t': 'Simulador de financiamento',
    'svc.5.d': 'BNF, BCP, Itaú, Continental — o lead simula a parcela antes de falar com você. Chega já sabendo quanto pode pagar.',
    'svc.5.tag': 'Bancos PY integrados',
    'svc.6.t': 'Drip de nurturing 90 dias',
    'svc.6.d': 'O lead que não compra hoje compra em 6 meses. WhatsApp e email automático com novos imóveis, conteúdo do bairro, alertas de oportunidade.',
    'svc.6.tag': 'Long-cycle automation',

    'wa.eyebrow': 'Demo ao vivo',
    'wa.title': 'Teste o bot que <em>pré-qualifica</em> seus leads.',
    'wa.sub': 'Assim ele conversa com um lead frio vindo do Meta Ads. Antes de passar o contato pro seu corretor, já sabe orçamento, zona, prazo e se tem financiamento aprovado.',
    'wa.demo.contact': 'Imobiliária Demo',
    'wa.demo.bot': 'bot · resposta automática',
    'wa.panel.title': 'O que o bot já capturou',
    'wa.cap.zone': 'Zona de interesse',
    'wa.cap.type': 'Tipo de imóvel',
    'wa.cap.budget': 'Orçamento',
    'wa.cap.deadline': 'Prazo de compra',
    'wa.cap.financing': 'Financiamento',
    'wa.score.label': 'Score de qualificação',
    'wa.reset': '↻ Reiniciar conversa',

    'fin.eyebrow': 'Calculadora integrada',
    'fin.title': 'Seu lead simula a <em>parcela mensal</em> antes de te ligar.',
    'fin.sub': 'Calculadora com taxas reais de bancos paraguaios (BNF, BCP, Itaú, Continental). O lead chega sabendo quanto pode pagar e em quantos anos — você só precisa fechar.',
    'fin.form.title': 'Dados do imóvel',
    'fin.f.price': 'Preço do imóvel (USD)',
    'fin.f.down': 'Entrada (%)',
    'fin.f.years': 'Prazo (anos)',
    'fin.f.bank': 'Banco',
    'fin.result.eyebrow': 'Parcela mensal estimada',
    'fin.b.principal': 'Capital financiado',
    'fin.b.interest': 'Juros totais',
    'fin.b.total': 'Pago ao final',
    'fin.disclaimer': 'Cálculo referencial com taxas médias do mercado paraguaio. A aprovação e taxa final dependem de cada banco e do perfil do cliente.',

    'roi.eyebrow': 'Para imóveis de investimento',
    'roi.title': 'Atraia o investidor com <em>números, não com fotos</em>.',
    'roi.sub': 'Calculadora de retorno mensal e anual. O lead investidor vê direto o cap rate, o aluguel estimado da zona e o ROI a 5 anos — e agenda a visita já quase decidido.',
    'roi.f.price': 'Preço do imóvel',
    'roi.f.rent': 'Aluguel mensal estimado',
    'roi.f.fees': 'Despesas mensais (manutenção, condomínio)',
    'roi.f.appreciation': 'Valorização anual estimada',
    'roi.r.cap': 'Cap Rate anual',
    'roi.r.cashflow': 'Cash flow mensal',
    'roi.r.5y': 'Retorno total em 5 anos',
    'roi.r.payback': 'Payback estimado',

    'map.eyebrow': 'Visibilidade geográfica',
    'map.title': 'Veja <em>de onde</em> vêm seus leads.',
    'map.sub': 'Cada ponto no mapa é um lead real captado na última semana. Filtre por bairro, orçamento ou tipo de imóvel — e ajuste suas campanhas para as zonas que mais respondem.',
    'map.f.all': 'Todos os leads', 'map.f.hot': '🔥 Hot (>USD 150k)', 'map.f.invest': 'Investimento', 'map.f.first': 'Primeiro imóvel',
    'map.l.hot': 'Lead quente', 'map.l.warm': 'Lead morno', 'map.l.cold': 'Lead frio',
    'map.l.live': 'ao vivo · últimos 7 dias',

    'price.eyebrow': 'Investimento',
    'price.title': 'Cada plano, sob medida.',
    'price.sub': 'Não vendemos pacotes fechados. Montamos o plano exato conforme o tamanho da imobiliária, sua carteira de imóveis e os processos que precisa automatizar.',
    'price.start.eyebrow': 'Plano início · a partir de',
    'price.start.title': 'Comece a captar como agência, não como corretor solo.',
    'price.start.tag': 'IVA incluso',
    'price.start.desc': 'O piso para profissionalizar sua operação: landing por projeto, ads geo-segmentados, WhatsApp com auto-resposta, simulador de financiamento e relatório mensal.',
    'price.start.cta': 'Começar com este plano →',
    'price.ads.eyebrow': 'Verba sugerida em ads',
    'price.ads.title': 'Recomendado para imóveis.',
    'price.ads.tag': 'Mínimo recomendado',
    'price.ads.desc': 'O ticket imobiliário é alto, então o investimento em ads precisa ser proporcional. Esse orçamento é pago direto ao Meta/Google — fora da mensalidade da Punto Alto.',
    'price.custom.eyebrow': 'Plano sob medida',
    'price.custom.title': 'É construtora, fundo ou tem vários projetos?',
    'price.custom.desc': 'Para operações complexas — múltiplos empreendimentos, equipe de 5+ corretores, IA no WhatsApp 24/7 multi-idioma, integração com CRM existente, gerente de conta dedicado — montamos um plano exato. Cotamos conforme operação, carteira e objetivos.',
    'price.custom.cta': 'Vamos conversar →',
    'scope.eyebrow': 'Investimento à parte',
    'scope.title': 'Nossos planos cobrem o serviço completo da agência.',
    'scope.sub': 'Os itens marcados com <span class="scope-note__mark" aria-hidden="true">*</span> são contratados direto com cada fornecedor — assim você mantém controle total do orçamento, sem intermediários nem surpresas.',
    'scope.i1.t': 'Verba em Meta e Google Ads',
    'scope.i1.d': 'Orçamento pago direto às plataformas — recomendamos Gs. 80.000/dia mínimo.',
    'scope.i2.t': 'API do WhatsApp Business',
    'scope.i2.d': 'Licença oficial do Meta — varia conforme números e atendentes que operam o bot.',
    'scope.i3.t': 'Hosting e domínio premium',
    'scope.i3.d': 'Recomendamos hosting dedicado para landings de projetos grandes — custo à parte conforme tráfego.',

    'cta.title': 'Capte leads que <em>realmente compram.</em>',
    'cta.sub': 'Diagnóstico gratuito de 30 minutos. Mostramos como montar o funil completo para sua imobiliária — e que números esperar nos próximos 90 dias.',
    'cta.btn': 'Agendar diagnóstico →',
    'cta.trust': 'Resposta por WhatsApp em menos de 2 horas · 100% gratuito',

    'footer.sub': 'Para Imobiliárias',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'Para Contadores',
    'footer.copy': '© 2026 Punto Alto — Assunção, Paraguai. Captação imobiliária com dados.',

    'form.s1.label': 'Pergunta 1 / 5', 'form.s1.q': 'Como te chamamos?', 'form.s1.ph': 'Seu nome',
    'form.s2.label': 'Pergunta 2 / 5', 'form.s2.q': 'Seu número de WhatsApp?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'Vamos te contatar lá com a agenda',
    'form.s3.label': 'Pergunta 3 / 5', 'form.s3.q': 'Nome da sua imobiliária?', 'form.s3.ph': 'Sua imobiliária ou equipe',
    'form.s4.label': 'Pergunta 4 / 5', 'form.s4.q': 'Quantos corretores na equipe?', 'form.s4.sub': 'Para dimensionar o plano ideal.',
    'form.s4.o1': 'Só eu', 'form.s4.o2': '2 – 5 corretores', 'form.s4.o3': '6 – 15 corretores', 'form.s4.o4': 'Mais de 15',
    'form.s5.label': 'Última pergunta', 'form.s5.q': 'Qual seu maior desafio hoje?', 'form.s5.sub': 'Escolha uma — seguimos automaticamente.',
    'form.s5.o1': 'Conseguir leads qualificados', 'form.s5.o2': 'Responder WhatsApp a tempo',
    'form.s5.o3': 'Converter leads em visitas', 'form.s5.o4': 'Organizar o funil da equipe', 'form.s5.o5': 'Tudo acima',
    'form.next': 'Continuar →', 'form.back': '← Voltar',
    'form.hint.enter': 'Aperte <kbd>Enter ↵</kbd> para continuar',
    'form.ok.title': 'Perfeito, <span id="fxOkName"></span>!',
    'form.ok.sub': 'Vamos te chamar no WhatsApp em menos de 2 horas para agendar seu diagnóstico imobiliário gratuito.',
    'form.ok.btn': 'Voltar ao site',
  }
};

const I18N_KEY = 'pa-lang';
let currentLang = 'es';

window.paApp = { I18N, getCurrentLang: () => currentLang };

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

if (document.readyState !== 'loading') {
  applyI18n(detectLang());
} else {
  document.addEventListener('DOMContentLoaded', () => applyI18n(detectLang()), { once: true });
}

/* ════════════════════════════════════════════════════════
   DOM ready: init UI
   ════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  // Language switcher
  document.querySelectorAll('.lang__btn').forEach(btn => {
    btn.addEventListener('click', () => applyI18n(btn.dataset.lang));
  });

  // Navbar scroll
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
    mobileMenu.querySelectorAll('a, button').forEach(a => {
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
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Scroll reveal ──────────────────────────────── */
  const revealItems = document.querySelectorAll('.js-reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => revealObs.observe(el));

  /* ── Counter animation ──────────────────────────── */
  const counters = document.querySelectorAll('[data-counter]');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(target * eased);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => counterObs.observe(el));

  initHeroWaMock();
  initWaDemo();
  initFinanceCalc();
  initRoiCalc();
  initMapLeads();
  initFormOverlay();
});

/* ════════════════════════════════════════════════════════
   Hero — WhatsApp mockup auto-loop
   ════════════════════════════════════════════════════════ */
function initHeroWaMock() {
  const body = document.getElementById('waMockBody');
  if (!body) return;

  const SCRIPTS = {
    es: [
      { side: 'in',  text: 'Hola, vi tu publicación de Las Lomas 🏢', delay: 0 },
      { side: 'out', text: '¡Hola! Carla por aquí 👋', delay: 1200 },
      { side: 'out', text: '¿Te interesa el departamento de 2 dormitorios o el de 3?', delay: 2200 },
      { side: 'in',  text: 'El de 2. ¿Cuánto sale la cuota financiada?', delay: 3800 },
      { side: 'out', text: 'Con 20% de entrada en BNF a 20 años: USD 850/mes 📊', delay: 5400 },
      { side: 'out', text: '¿Querés agendar la visita esta semana?', delay: 6800 },
      { side: 'in',  text: '¡Sí! El sábado a la mañana', delay: 8400 },
      { side: 'out', text: 'Listo. Sábado 10:00 ✅ Te paso la ubicación.', delay: 10000 },
    ],
    en: [
      { side: 'in',  text: 'Hi, I saw your Las Lomas listing 🏢', delay: 0 },
      { side: 'out', text: 'Hi! Carla here 👋', delay: 1200 },
      { side: 'out', text: 'Are you interested in the 2-bed or 3-bed?', delay: 2200 },
      { side: 'in',  text: 'The 2-bed. What\'s the financed monthly?', delay: 3800 },
      { side: 'out', text: 'With 20% down at BNF over 20 years: USD 850/mo 📊', delay: 5400 },
      { side: 'out', text: 'Want to schedule a visit this week?', delay: 6800 },
      { side: 'in',  text: 'Yes! Saturday morning', delay: 8400 },
      { side: 'out', text: 'Done. Saturday 10:00 ✅ I\'ll send the location.', delay: 10000 },
    ],
    pt: [
      { side: 'in',  text: 'Oi, vi seu anúncio do Las Lomas 🏢', delay: 0 },
      { side: 'out', text: 'Oi! Carla aqui 👋', delay: 1200 },
      { side: 'out', text: 'Te interessa o de 2 quartos ou o de 3?', delay: 2200 },
      { side: 'in',  text: 'O de 2. Quanto fica a parcela financiada?', delay: 3800 },
      { side: 'out', text: 'Com 20% de entrada no BNF em 20 anos: USD 850/mês 📊', delay: 5400 },
      { side: 'out', text: 'Quer agendar a visita essa semana?', delay: 6800 },
      { side: 'in',  text: 'Sim! Sábado de manhã', delay: 8400 },
      { side: 'out', text: 'Feito. Sábado 10:00 ✅ Te mando a localização.', delay: 10000 },
    ],
  };

  let timeouts = [];
  function clearAll() {
    timeouts.forEach(t => clearTimeout(t));
    timeouts = [];
    body.innerHTML = '';
  }

  function play() {
    clearAll();
    const script = SCRIPTS[currentLang] || SCRIPTS.es;
    script.forEach((msg, i) => {
      // Typing indicator
      const typingDelay = msg.delay;
      const tt = setTimeout(() => {
        const typing = document.createElement('div');
        typing.className = 'wa-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        body.appendChild(typing);
        setTimeout(() => typing.remove(), 700);
      }, typingDelay);
      timeouts.push(tt);

      // Message
      const showDelay = msg.delay + 700;
      const t = setTimeout(() => {
        const b = document.createElement('div');
        b.className = 'wa-bubble wa-bubble--' + msg.side;
        const time = new Date();
        const hh = String(time.getHours()).padStart(2, '0');
        const mm = String(time.getMinutes()).padStart(2, '0');
        b.innerHTML = msg.text + '<span class="wa-bubble__time">' + hh + ':' + mm + '</span>';
        body.appendChild(b);
        // Auto-scroll
        body.scrollTop = body.scrollHeight;
      }, showDelay);
      timeouts.push(t);
    });

    // Loop
    const loop = setTimeout(play, 14000);
    timeouts.push(loop);
  }

  play();
  document.addEventListener('localeChanged', play);
  // Replay on language change via observer
  let lastLang = currentLang;
  setInterval(() => {
    if (currentLang !== lastLang) { lastLang = currentLang; play(); }
  }, 500);
}

/* ════════════════════════════════════════════════════════
   WhatsApp demo interactiva
   ════════════════════════════════════════════════════════ */
function initWaDemo() {
  const body  = document.getElementById('waDemoBody');
  const quick = document.getElementById('waDemoQuick');
  const reset = document.getElementById('waResetBtn');
  if (!body || !quick) return;

  // Flow definition (es as source; localized labels via i18n on the next render)
  const FLOW = [
    {
      bot: { es: '¡Hola! 👋 Soy el asistente de Inmobiliaria Demo. ¿En qué barrio buscás inmueble?',
             en: 'Hi! 👋 I\'m the Demo Real Estate assistant. Which neighborhood are you looking in?',
             pt: 'Oi! 👋 Sou o assistente da Imobiliária Demo. Em qual bairro você procura?' },
      key: 'zona',
      options: {
        es: [['Villa Morra', 'Villa Morra'], ['Recoleta', 'Recoleta'], ['Centro', 'Centro'], ['Lambaré', 'Lambaré']],
        en: [['Villa Morra', 'Villa Morra'], ['Recoleta', 'Recoleta'], ['Downtown', 'Centro'], ['Lambaré', 'Lambaré']],
        pt: [['Villa Morra', 'Villa Morra'], ['Recoleta', 'Recoleta'], ['Centro', 'Centro'], ['Lambaré', 'Lambaré']],
      },
      score: 15,
    },
    {
      bot: { es: '¿Qué tipo de inmueble buscás?',
             en: 'What kind of property?',
             pt: 'Qual tipo de imóvel você busca?' },
      key: 'tipo',
      options: {
        es: [['Departamento', 'Departamento'], ['Casa', 'Casa'], ['Terreno', 'Terreno'], ['Inversión', 'Inversión']],
        en: [['Apartment', 'Departamento'], ['House', 'Casa'], ['Land', 'Terreno'], ['Investment', 'Inversión']],
        pt: [['Apartamento', 'Departamento'], ['Casa', 'Casa'], ['Terreno', 'Terreno'], ['Investimento', 'Inversión']],
      },
      score: 15,
    },
    {
      bot: { es: 'Genial 👍 ¿Cuál es tu presupuesto en USD?',
             en: 'Great 👍 What\'s your budget in USD?',
             pt: 'Ótimo 👍 Qual seu orçamento em USD?' },
      key: 'presupuesto',
      options: {
        es: [['<USD 80k', '<80k'], ['USD 80k–150k', '80–150k'], ['USD 150k–300k', '150–300k'], ['>USD 300k', '>300k']],
        en: [['<USD 80k', '<80k'], ['USD 80k–150k', '80–150k'], ['USD 150k–300k', '150–300k'], ['>USD 300k', '>300k']],
        pt: [['<USD 80k', '<80k'], ['USD 80k–150k', '80–150k'], ['USD 150k–300k', '150–300k'], ['>USD 300k', '>300k']],
      },
      score: 25,
    },
    {
      bot: { es: '¿Cuándo planeás comprar?',
             en: 'When are you planning to buy?',
             pt: 'Quando você planeja comprar?' },
      key: 'plazo',
      options: {
        es: [['Este mes', 'Este mes'], ['1-3 meses', '1-3 meses'], ['6 meses', '6 meses'], ['Solo mirando', 'Solo mirando']],
        en: [['This month', 'Este mes'], ['1-3 months', '1-3 meses'], ['6 months', '6 meses'], ['Just looking', 'Solo mirando']],
        pt: [['Este mês', 'Este mes'], ['1-3 meses', '1-3 meses'], ['6 meses', '6 meses'], ['Só olhando', 'Solo mirando']],
      },
      score: 25,
    },
    {
      bot: { es: 'Última pregunta: ¿tenés financiación pre-aprobada?',
             en: 'Last question: do you have pre-approved financing?',
             pt: 'Última pergunta: você tem financiamento pré-aprovado?' },
      key: 'financiacion',
      options: {
        es: [['Sí, BNF', 'BNF'], ['Sí, banco privado', 'Banco privado'], ['Pago contado', 'Contado'], ['No, todavía', 'No']],
        en: [['Yes, BNF', 'BNF'], ['Yes, private bank', 'Banco privado'], ['Cash payment', 'Contado'], ['Not yet', 'No']],
        pt: [['Sim, BNF', 'BNF'], ['Sim, banco privado', 'Banco privado'], ['À vista', 'Contado'], ['Ainda não', 'No']],
      },
      score: 20,
    },
  ];

  const FINISH = {
    es: '¡Perfecto! 🎯 Carla, una de nuestras corredoras especializadas, te va a contactar en los próximos 60 minutos con 3 inmuebles que matchean tu perfil.',
    en: 'Perfect! 🎯 Carla, one of our specialist brokers, will reach out within 60 minutes with 3 properties matching your profile.',
    pt: 'Perfeito! 🎯 Carla, uma de nossas corretoras especialistas, vai te contatar em até 60 minutos com 3 imóveis que combinam com seu perfil.',
  };

  let stepIdx = 0;
  let score = 0;
  let captured = {};
  let busy = false;

  function bubble(side, text) {
    const b = document.createElement('div');
    b.className = 'wa-bubble wa-bubble--' + side;
    const t = new Date();
    const hh = String(t.getHours()).padStart(2,'0');
    const mm = String(t.getMinutes()).padStart(2,'0');
    b.innerHTML = text + '<span class="wa-bubble__time">' + hh + ':' + mm + '</span>';
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  }

  function typing() {
    const t = document.createElement('div');
    t.className = 'wa-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
    return t;
  }

  function clearQuick() { quick.innerHTML = ''; }

  function renderQuick(opts) {
    clearQuick();
    opts.forEach(([label, value]) => {
      const btn = document.createElement('button');
      btn.className = 'wa-quick';
      btn.textContent = label;
      btn.addEventListener('click', () => answer(label, value));
      quick.appendChild(btn);
    });
  }

  function updateCaptured() {
    document.querySelectorAll('#waDemoCaptured li').forEach(li => {
      const k = li.dataset.key;
      if (captured[k]) {
        li.classList.add('is-filled');
        li.querySelector('strong').textContent = captured[k];
      } else {
        li.classList.remove('is-filled');
        li.querySelector('strong').textContent = '—';
      }
    });
    const fill = document.getElementById('waScoreFill');
    const val  = document.getElementById('waScoreVal');
    if (fill) fill.style.width = score + '%';
    if (val)  val.textContent  = score;
  }

  function answer(label, value) {
    if (busy) return;
    busy = true;
    bubble('out', label);
    clearQuick();
    captured[FLOW[stepIdx].key] = value;
    score = Math.min(100, score + FLOW[stepIdx].score);
    updateCaptured();
    stepIdx++;

    setTimeout(() => {
      const t = typing();
      setTimeout(() => {
        t.remove();
        if (stepIdx < FLOW.length) {
          const step = FLOW[stepIdx];
          bubble('in', step.bot[currentLang] || step.bot.es);
          renderQuick(step.options[currentLang] || step.options.es);
          busy = false;
        } else {
          bubble('in', FINISH[currentLang] || FINISH.es);
          busy = false;
        }
      }, 900);
    }, 500);
  }

  function start() {
    body.innerHTML = '';
    clearQuick();
    stepIdx = 0;
    score = 0;
    captured = {};
    updateCaptured();
    setTimeout(() => {
      const t = typing();
      setTimeout(() => {
        t.remove();
        const step = FLOW[0];
        bubble('in', step.bot[currentLang] || step.bot.es);
        renderQuick(step.options[currentLang] || step.options.es);
      }, 800);
    }, 400);
  }

  if (reset) reset.addEventListener('click', start);

  // Lazy start: only when section comes into view
  const section = document.getElementById('whatsapp');
  if (section) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          start();
          obs.disconnect();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(section);
  }
}

/* ════════════════════════════════════════════════════════
   Calculadora de financiación
   ════════════════════════════════════════════════════════ */
function initFinanceCalc() {
  const price  = document.getElementById('finPrice');
  const down   = document.getElementById('finDown');
  const years  = document.getElementById('finYears');
  const banks  = document.getElementById('finBanks');
  if (!price || !down || !years || !banks) return;

  let rate = 9.5;
  let bankName = 'BNF';

  function fmt(n) {
    return 'USD ' + Math.round(n).toLocaleString('en-US').replace(/,/g, '.');
  }

  function calc() {
    const P     = parseFloat(price.value);
    const dPct  = parseFloat(down.value);
    const yrs   = parseInt(years.value, 10);
    const principal = P * (1 - dPct / 100);
    const r     = (rate / 100) / 12;
    const n     = yrs * 12;
    const monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPaid = monthly * n;
    const interest = totalPaid - principal;

    document.getElementById('finPriceVal').textContent  = fmt(P);
    document.getElementById('finDownVal').textContent   = dPct + '%';
    document.getElementById('finYearsVal').textContent  = yrs + (currentLang === 'en' ? ' yrs' : (currentLang === 'pt' ? ' anos' : ' años'));
    document.getElementById('finMonthly').textContent   = fmt(monthly);
    document.getElementById('finPrincipal').textContent = fmt(principal);
    document.getElementById('finInterest').textContent  = fmt(interest);
    document.getElementById('finTotal').textContent     = fmt(totalPaid);
    document.getElementById('finBankHint').textContent  =
      bankName + ' · ' + rate + '% TEA · ' + yrs + (currentLang === 'en' ? ' years' : (currentLang === 'pt' ? ' anos' : ' años'));
  }

  [price, down, years].forEach(el => el.addEventListener('input', calc));

  banks.querySelectorAll('.fin-bank').forEach(btn => {
    btn.addEventListener('click', () => {
      banks.querySelectorAll('.fin-bank').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      rate     = parseFloat(btn.dataset.rate);
      bankName = btn.textContent.trim().split(/\s+/)[0];
      calc();
    });
  });

  calc();

  // Recalc on language change
  setInterval(() => {
    const hint = document.getElementById('finBankHint');
    if (hint && !hint.dataset.lang || hint.dataset.lang !== currentLang) {
      if (hint) hint.dataset.lang = currentLang;
      calc();
    }
  }, 600);
}

/* ════════════════════════════════════════════════════════
   Calculadora de ROI investidor
   ════════════════════════════════════════════════════════ */
function initRoiCalc() {
  const price = document.getElementById('roiPrice');
  const rent  = document.getElementById('roiRent');
  const fees  = document.getElementById('roiFees');
  const appr  = document.getElementById('roiAppr');
  if (!price || !rent || !fees || !appr) return;

  function fmt(n) {
    const sign = n < 0 ? '-' : '';
    return sign + 'USD ' + Math.abs(Math.round(n)).toLocaleString('en-US').replace(/,/g, '.');
  }

  function calc() {
    const P = parseFloat(price.value) || 0;
    const R = parseFloat(rent.value)  || 0;
    const F = parseFloat(fees.value)  || 0;
    const A = parseFloat(appr.value)  || 0;

    const annualNet = (R - F) * 12;
    const cap = P > 0 ? (annualNet / P) * 100 : 0;
    const cashflow = R - F;

    // 5y total return = 5y rental net + appreciation
    const apprFactor = Math.pow(1 + A/100, 5);
    const apprValue  = P * apprFactor - P;
    const total5y    = annualNet * 5 + apprValue;
    const totalPct   = P > 0 ? (total5y / P) * 100 : 0;
    const payback    = annualNet > 0 ? (P / annualNet) : 0;

    document.getElementById('roiCap').textContent    = cap.toFixed(2) + '%';
    document.getElementById('roiCash').textContent   = fmt(cashflow);
    document.getElementById('roi5y').textContent     = fmt(total5y);
    document.getElementById('roi5yPct').textContent  = (totalPct >= 0 ? '+' : '') + totalPct.toFixed(1) + '%';
    document.getElementById('roiPayback').textContent= payback > 0
      ? payback.toFixed(1) + (currentLang === 'en' ? ' yrs' : ' años')
      : '—';
  }

  [price, rent, fees, appr].forEach(el => el.addEventListener('input', calc));
  calc();
}

/* ════════════════════════════════════════════════════════
   Mapa de leads de Asunción
   ════════════════════════════════════════════════════════ */
function initMapLeads() {
  const viz   = document.getElementById('mapViz');
  const dotsC = document.getElementById('mapDots');
  const tip   = document.getElementById('mapTooltip');
  if (!viz || !dotsC) return;

  // Districts → bounding ranges (% based on viz container)
  const DISTRICTS = {
    centro:        { x:[28, 42], y:[32, 50], name:'Centro' },
    'villa-morra': { x:[48, 62], y:[48, 70], name:'Villa Morra' },
    recoleta:      { x:[64, 80], y:[44, 62], name:'Recoleta' },
    trinidad:      { x:[33, 50], y:[60, 80], name:'Trinidad' },
    lambare:       { x:[55, 75], y:[68, 88], name:'Lambaré' },
    'san-antonio': { x:[18, 32], y:[54, 76], name:'San Antonio' },
    luque:         { x:[82, 95], y:[42, 58], name:'Luque' },
  };

  // Generate 50 fake leads
  const TYPES = ['hot', 'warm', 'cold'];
  const TYPE_WEIGHTS = [0.2, 0.45, 0.35];
  const PROFILES = [
    { kind: 'hot',     budget: 'USD 220k', type: 'invest' },
    { kind: 'hot',     budget: 'USD 180k', type: 'first' },
    { kind: 'warm',    budget: 'USD 95k',  type: 'first' },
    { kind: 'warm',    budget: 'USD 130k', type: 'invest' },
    { kind: 'cold',    budget: 'USD 60k',  type: 'first' },
  ];

  function pickWeighted() {
    const r = Math.random();
    let acc = 0;
    for (let i=0; i<TYPES.length; i++) {
      acc += TYPE_WEIGHTS[i];
      if (r < acc) return TYPES[i];
    }
    return TYPES[0];
  }

  function genLeads(n) {
    const districtKeys = Object.keys(DISTRICTS);
    const leads = [];
    for (let i=0; i<n; i++) {
      const dKey = districtKeys[Math.floor(Math.random() * districtKeys.length)];
      const d    = DISTRICTS[dKey];
      const x = d.x[0] + Math.random() * (d.x[1] - d.x[0]);
      const y = d.y[0] + Math.random() * (d.y[1] - d.y[0]);
      const kind = pickWeighted();
      const baseBudget = kind === 'hot' ? (160 + Math.floor(Math.random()*200))
                       : kind === 'warm' ? (80 + Math.floor(Math.random()*70))
                       : (40 + Math.floor(Math.random()*40));
      const budget = 'USD ' + baseBudget + 'k';
      const purpose = Math.random() > 0.55 ? 'invest' : 'first';
      leads.push({ x, y, kind, budget, district: d.name, purpose, budgetNum: baseBudget });
    }
    return leads;
  }

  let allLeads = genLeads(48);
  let activeFilter = 'all';

  function renderDots() {
    dotsC.innerHTML = '';
    allLeads.forEach((lead, i) => {
      let visible = true;
      if (activeFilter === 'hot')     visible = lead.budgetNum >= 150;
      if (activeFilter === 'invest')  visible = lead.purpose === 'invest';
      if (activeFilter === 'primera') visible = lead.purpose === 'first';
      if (!visible) return;

      const dot = document.createElement('div');
      dot.className = 'map-dot map-dot--' + lead.kind;
      dot.style.left = lead.x + '%';
      dot.style.top  = lead.y + '%';
      dot.style.animationDelay = (i * 30) + 'ms';
      dot.dataset.district = lead.district;
      dot.dataset.budget   = lead.budget;
      dot.dataset.kind     = lead.kind;
      dot.dataset.purpose  = lead.purpose;

      dot.addEventListener('mouseenter', (e) => {
        const purposeLabel = lead.purpose === 'invest'
          ? (currentLang === 'en' ? 'Investment' : (currentLang === 'pt' ? 'Investimento' : 'Inversión'))
          : (currentLang === 'en' ? 'First home' : (currentLang === 'pt' ? 'Primeiro imóvel' : 'Primera vivienda'));
        tip.innerHTML = '<strong>' + lead.district + '</strong>' + lead.budget + ' · ' + purposeLabel;
        tip.hidden = false;
        tip.style.left = lead.x + '%';
        tip.style.top  = lead.y + '%';
      });
      dot.addEventListener('mouseleave', () => { tip.hidden = true; });

      dotsC.appendChild(dot);
    });
  }

  // Filter buttons
  document.querySelectorAll('.map-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-filter').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      renderDots();
    });
  });

  // Render when in view
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        renderDots();
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(viz);

  // "Live" simulation: add a new dot every 8s
  setInterval(() => {
    if (document.hidden) return;
    const newLeads = genLeads(1);
    allLeads.push(newLeads[0]);
    if (allLeads.length > 70) allLeads.shift();
    renderDots();
  }, 8500);
}

/* ════════════════════════════════════════════════════════
   Form overlay (5 perguntas)
   ════════════════════════════════════════════════════════ */
function initFormOverlay() {
  const STEPS = [
    { id: 1, field: 'f-name',    type: 'text'  },
    { id: 2, field: 'f-phone',   type: 'tel'   },
    { id: 3, field: 'f-company', type: 'text'  },
    { id: 4, field: 'rg-team',   type: 'radio' },
    { id: 5, field: 'rg-challenge', type: 'radio' },
    { id: 6, field: null,        type: 'success' },
  ];
  const TOTAL = STEPS.filter(s => s.type !== 'success').length;

  const overlay  = document.getElementById('formx');
  if (!overlay) return;
  const bar      = document.getElementById('fxBar');
  const counter  = document.getElementById('fxCounter');
  const backBtn  = document.getElementById('fxBack');
  const dotsEl   = document.getElementById('fxDots');
  const closeBtn = document.getElementById('fxClose');
  const doneBtn  = document.getElementById('fxDone');

  let current = 1;
  let animating = false;

  function open(source) {
    overlay.removeAttribute('hidden');
    requestAnimationFrame(() => overlay.classList.add('is-open'));
    document.body.style.overflow = 'hidden';

    if (window.paFirebase?.newSessionId) {
      const sid = window.paFirebase.newSessionId();
      window.paFirebase.trackFormEvent?.('opened', {
        sessionId: sid, source: 'landing-inmobiliario', cta_origin: source || 'unknown'
      });
      overlay.dataset.sid = sid;
    }

    goTo(1);
    buildDots();
    setTimeout(() => focusStep(1), 420);
    document.addEventListener('keydown', onKey);
  }

  function close() {
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
  }

  function focusStep(id) {
    const step = overlay.querySelector('[data-step="' + id + '"]');
    if (!step) return;
    const inp = step.querySelector('input:not([type="radio"])');
    if (inp) inp.focus();
  }

  function updateUI() {
    const isOk = current === STEPS.length;
    const pct  = isOk ? 100 : ((current - 1) / TOTAL) * 100;
    if (bar) bar.style.width = pct + '%';

    if (isOk) {
      if (counter) counter.textContent = '';
      if (dotsEl) dotsEl.style.opacity = '0';
      if (backBtn) backBtn.setAttribute('disabled', '');
    } else {
      if (counter) counter.textContent = current + ' / ' + TOTAL;
      if (dotsEl) dotsEl.style.opacity = '1';
      updateDots();
      if (backBtn) backBtn.toggleAttribute('disabled', current === 1);
    }
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i=1; i<=TOTAL; i++) {
      const d = document.createElement('span');
      d.className = 'fxdot' + (i === 1 ? ' active' : '');
      dotsEl.appendChild(d);
    }
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.fxdot').forEach((d, i) => {
      d.classList.toggle('active', i + 1 === current);
    });
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add('visible'); }
  }
  function clearError(id) {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('visible'); }
  }

  function validate(stepId) {
    const step = STEPS.find(s => s.id === stepId);
    if (!step) return true;
    const errMsg = currentLang === 'en' ? 'This field is required.'
                 : currentLang === 'pt' ? 'Este campo é obrigatório.'
                 : 'Este campo es requerido.';

    if (step.type === 'radio') {
      const checked = overlay.querySelector('#' + step.field + ' input:checked');
      if (!checked) {
        const errId = 'e-' + step.field.replace('rg-', '');
        showError(errId, errMsg);
        return false;
      }
      clearError('e-' + step.field.replace('rg-', ''));
      return true;
    }
    const inp = document.getElementById(step.field);
    if (!inp) return true;
    if (!inp.value.trim()) {
      showError('e-' + step.field.replace('f-', ''), errMsg);
      inp.classList.add('is-error');
      return false;
    }
    if (step.type === 'tel') {
      const digits = inp.value.replace(/\D/g, '');
      if (digits.length < 7) {
        const phoneMsg = currentLang === 'en' ? 'Enter a valid number.'
                       : currentLang === 'pt' ? 'Digite um número válido.'
                       : 'Ingresá un número válido.';
        showError('e-phone', phoneMsg);
        inp.classList.add('is-error');
        return false;
      }
    }
    inp.classList.remove('is-error');
    inp.classList.add('is-valid');
    clearError('e-' + step.field.replace('f-', ''));
    return true;
  }

  function next() {
    if (!validate(current)) return;
    if (current < STEPS.length) {
      if (current === STEPS.length - 1) submit();
      else goTo(current + 1);
    }
  }

  async function submit() {
    const name = document.getElementById('f-name')?.value?.split(' ')[0] || '';
    const okEl = document.getElementById('fxOkName');
    if (okEl) okEl.textContent = name;
    goTo(STEPS.length);

    const payload = {
      name:    document.getElementById('f-name')?.value || '',
      phone:   document.getElementById('f-phone')?.value || '',
      company: document.getElementById('f-company')?.value || '',
      team:    overlay.querySelector('#rg-team input:checked')?.value || '',
      challenge: overlay.querySelector('#rg-challenge input:checked')?.value || '',
      source: 'landing-inmobiliario',
      lang: currentLang,
      ts: Date.now(),
    };

    if (window.paFirebase?.addLead) {
      try { await window.paFirebase.addLead(payload); } catch(e) {}
    }
    if (overlay.dataset.sid && window.paFirebase?.trackFormEvent) {
      window.paFirebase.trackFormEvent('submitted', { sessionId: overlay.dataset.sid, ...payload });
    }
  }

  // Wire CTAs
  document.querySelectorAll('[data-open-form]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.openFormSource));
  });

  // Wire next buttons
  overlay.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', next));

  // Auto-advance on radio
  overlay.querySelectorAll('.fxradios input[type="radio"]').forEach(r => {
    r.addEventListener('change', () => setTimeout(next, 350));
  });

  // Enter key on text inputs
  overlay.querySelectorAll('.fxinput').forEach(inp => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); next(); }
    });
  });

  // Back
  if (backBtn) backBtn.addEventListener('click', () => { if (current > 1) goTo(current - 1); });
  // Close
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (doneBtn)  doneBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  function onKey(e) {
    if (e.key === 'Escape') close();
  }
}
