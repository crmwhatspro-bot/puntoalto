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
    'logo.sub': 'UN PRODUCTO DE PUNTO ALTO',
    'nav.services': 'Producto', 'nav.how': 'Cómo funciona', 'nav.pricing': 'Precios', 'nav.cta': 'Empezar gratis →',

    'hero.pill': 'Inmobly · Software para inmobiliarias · 14 días gratis',
    'hero.title1': 'Tu inmobiliaria,',
    'hero.title2': '<em>online en minutos.</em>',
    'hero.sub': 'Inmobly es el software para armar la página de tu emprendimiento y publicar cada inmueble vos mismo, desde el celular. Sin developers, sin código, sin esperar a nadie.',
    'hero.cta1': 'Empezar gratis →',
    'hero.cta2': 'Ver cómo funciona',
    'hero.trust': '14 días gratis · Sin tarjeta de crédito · Cancelás cuando quieras',
    'hero.badge': 'Catálogo actualizado hace 2 min',
    'hero.mock.title': 'Edif. Las Lomas · 3 dormitorios',
    'hero.mock.zone': 'Villa Morra · 95m²',
    'hero.mock.cuota': '3 unidades disponibles',

    'stats.s1': 'De prueba gratis, sin tarjeta',
    'stats.s2': 'Para crear tu cuenta y tu primera página',
    'stats.s3': 'Autoservicio: vos subís, editás, publicás',
    'stats.s4': 'Developers o código necesarios',

    'pain.eyebrow': 'El problema real',
    'pain.title': 'Tu catálogo se merece <em>algo mejor</em> que esto.',
    'pain.sub': 'No es falta de inmuebles buenos. Es que depender de un developer o de una agencia te frena.',
    'pain.1.t': 'No tenés web propia, o depende de un developer para cualquier cambio.',
    'pain.1.d': 'Cada actualización implica escribir, esperar y pagar de nuevo.',
    'pain.2.t': 'Tu catálogo vive en un Excel o en el estado de WhatsApp.',
    'pain.2.d': 'El inmueble que ya se vendió sigue publicado, y el nuevo tarda semanas en aparecer.',
    'pain.3.t': 'Cambiar un precio te toma días, no minutos.',
    'pain.3.d': 'Depender de otro para algo que deberías poder hacer vos mismo, ahora mismo.',
    'pain.4.t': 'El comprador no encuentra la info del proyecto que le interesa.',
    'pain.4.d': 'Se va a la competencia, donde sí hay una página clara con lo que busca.',

    'svc.eyebrow': 'Qué incluye Inmobly',
    'svc.title': 'Dos herramientas. <em>Un solo panel.</em>',
    'svc.sub': 'Sin developers, sin tickets de soporte eternos. Armás vos mismo la página que vende tu proyecto, y el catálogo que nunca se queda atrás.',
    'svc.1.t': 'Página de ventas por emprendimiento',
    'svc.1.d': 'Elegís tu proyecto, cargás fotos, precio y ubicación. Tu página queda lista y online, sin depender de nadie.',
    'svc.1.l1': 'Galería, planta y avance de obra — vos los cargás',
    'svc.1.l2': 'Precio y unidades disponibles, editables en segundos',
    'svc.1.l3': 'Botón directo a WhatsApp, sin formularios eternos',
    'svc.1.tag': 'Una página por proyecto, autoservicio',
    'svc.2.t': 'Catálogo CMS de inmuebles disponibles',
    'svc.2.d': 'Cada inmueble con su propia ficha, filtros por zona y precio. Subís las fotos desde el celular y Inmobly hace el resto.',
    'svc.2.l1': 'Ficha individual por inmueble',
    'svc.2.l2': 'Filtros por zona, tipo y precio',
    'svc.2.l3': 'Subís fotos desde el celular, se publica solo',
    'svc.2.tag': 'Catálogo siempre actualizado, por vos',

    'panel.eyebrow': 'Cómo funciona · Mobile first',
    'panel.title': 'Subís fotos desde el celular. <em>Tu catálogo se actualiza solo.</em>',
    'panel.sub': 'Sacás las fotos con el celular, las subís en Inmobly, y en segundos están en tu página y en tu catálogo. Sin developers, sin tickets, sin esperar a nadie.',
    'panel.app': 'Inmobly · Admin',
    'panel.property': 'Edif. Las Lomas · 3 dorm.',
    'panel.zone': 'Tocá para subir fotos',
    'panel.photos': 'fotos publicadas',
    'panel.live': 'SYNC · EN VIVO',
    'panel.uploading': 'Subiendo',
    'panel.land.title': 'Edif. Las Lomas · 3 dormitorios',
    'panel.land.zone': 'Villa Morra · 95m²',
    'panel.land.cuota': '3 unidades disponibles',
    'panel.land.cta': 'Agendar visita por WhatsApp →',
    'panel.f1.t': 'Optimización automática',
    'panel.f1.d': 'Resize, compresión y conversión a WebP en el servidor. Cada foto carga en menos de 200ms.',
    'panel.f2.t': 'Watermark con tu logo',
    'panel.f2.d': 'Marca de agua opcional en cada foto. Protegé tu inventario contra el competidor que copia.',
    'panel.f3.t': 'WhatsApp con preview rico',
    'panel.f3.d': 'Compartí el link y aparece foto, precio y zona automáticamente. Cero esfuerzo extra.',
    'panel.f4.t': 'Multi-usuario con permisos',
    'panel.f4.d': 'Cada corredor ve solo sus inmuebles. El dueño o developer ve todo el catálogo.',
    'panel.included': 'Incluído en el plan · Hosting, CDN y optimización <strong>sin costo adicional</strong>.',
    'panel.room.living': 'Living', 'panel.room.bedroom': 'Dormitorio', 'panel.room.bath': 'Baño', 'panel.room.ext': 'Fachada',

    'price.eyebrow': 'Planes',
    'price.title': 'Empezá gratis. Pagá solo cuando estés convencido.',
    'price.sub': '14 días de prueba, sin tarjeta de crédito. Después, elegís el plan que se ajuste al tamaño de tu catálogo.',
    'price.start.eyebrow': 'Plan Inmobly · desde',
    'price.start.title': 'Tu página de emprendimiento + catálogo completo de inmuebles.',
    'price.start.tag': '14 días gratis · sin tarjeta',
    'price.start.desc': 'Incluye la página de ventas de tu proyecto, catálogo CMS para toda tu cartera de inmuebles, panel para publicar vos mismo desde el celular, hosting, CDN y optimización de fotos.',
    'price.start.cta': 'Empezar gratis →',
    'price.custom.eyebrow': '¿Portfolio grande?',
    'price.custom.title': '¿Sos developer o tenés varios emprendimientos?',
    'price.custom.desc': 'Para varios proyectos en simultáneo, catálogos grandes (100+ unidades), fotos profesionales o render 3D, y gerente de cuenta dedicado, armamos un plan a medida. Cotizamos según la cantidad de proyectos y el tamaño de tu cartera.',
    'price.custom.cta': 'Hablemos →',
    'scope.eyebrow': 'Inversión aparte',
    'scope.title': 'Nuestro plan cubre el servicio completo de la página y el catálogo.',
    'scope.sub': 'Los ítems marcados con <span class="scope-note__mark" aria-hidden="true">*</span> se contratan directo con cada proveedor, así mantenés control total sobre tu presupuesto, sin intermediarios ni sorpresas.',
    'scope.i1.t': 'Fotos profesionales o render 3D',
    'scope.i1.d': 'Para emprendimientos en pozo o que necesitan producción visual de mayor nivel: cotización aparte según proyecto.',
    'scope.i2.t': 'Hosting y dominio premium',
    'scope.i2.d': 'Recomendamos hosting dedicado para lanzamientos con tráfico alto: costo aparte según tráfico.',

    'cta.title': 'Tu inmobiliaria, con web propia <em>desde hoy.</em>',
    'cta.sub': 'Creá tu cuenta gratis, cargá tu primer inmueble y compartilo por WhatsApp en minutos. Sin tarjeta, sin compromiso.',
    'cta.btn': 'Empezar gratis →',
    'cta.btn2': '¿Portfolio grande? Hablemos →',
    'cta.trust': '14 días gratis · Sin tarjeta de crédito · Cancelás cuando quieras',

    'footer.sub': 'Un producto de Punto Alto',
    'footer.login': 'Iniciar sesión',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'Para Contadores',
    'footer.copy': '© 2026 Inmobly by Punto Alto. Asunción, Paraguay.',

    'form.s1.label': 'Pregunta 1 / 6', 'form.s1.q': '¿Cómo te llamamos?', 'form.s1.ph': 'Tu nombre',
    'form.s2.label': 'Pregunta 2 / 6', 'form.s2.q': '¿Tu número de WhatsApp?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'Te contactamos ahí con la agenda',
    'form.s3.label': 'Pregunta 3 / 6', 'form.s3.q': '¿Nombre de tu inmobiliaria o emprendimiento?', 'form.s3.ph': 'Tu inmobiliaria, developer o proyecto',
    'form.s4.label': 'Pregunta 4 / 6', 'form.s4.q': '¿Qué necesitás primero?', 'form.s4.sub': 'Elegí uno y seguimos automáticamente.',
    'form.s4.o1': 'Página para un emprendimiento específico', 'form.s4.o2': 'Catálogo de inmuebles disponibles',
    'form.s4.o3': 'Ambos', 'form.s4.o4': 'Todavía no estoy seguro',
    'form.s5.label': 'Pregunta 5 / 6', 'form.s5.q': '¿Cuántos inmuebles o unidades tenés para publicar?', 'form.s5.sub': 'Para dimensionar el catálogo.',
    'form.s5.o1': 'Menos de 10', 'form.s5.o2': 'Entre 10 y 30', 'form.s5.o3': 'Entre 30 y 100', 'form.s5.o4': 'Más de 100',
    'form.s6.label': 'Última pregunta', 'form.s6.q': '¿De dónde vienen tus leads HOY?', 'form.s6.sub': 'Elegí el origen principal y seguimos automáticamente.',
    'form.s6.o1': 'Meta Ads (Facebook / Instagram)', 'form.s6.o2': 'Google Ads',
    'form.s6.o3': 'Portales (InfoCasas, Clasipar)', 'form.s6.o4': 'Solo indicación / boca-a-boca',
    'form.s6.o5': 'Walk-in / cartel en obra', 'form.s6.o6': 'Nada estructurado todavía',
    'form.next': 'Continuar →', 'form.back': '← Volver',
    'form.hint.enter': 'Presioná <kbd>Enter ↵</kbd> para continuar',
    'form.ok.title': '¡Perfecto, <span id="fxOkName"></span>!',
    'form.ok.sub': 'Te escribimos por WhatsApp en menos de 2 horas para armar tu plan a medida.',
    'form.ok.btn': 'Volver al sitio',
  },

  en: {
    'logo.sub': 'A PUNTO ALTO PRODUCT',
    'nav.services': 'Product', 'nav.how': 'How it works', 'nav.pricing': 'Pricing', 'nav.cta': 'Start for free →',

    'hero.pill': 'Inmobly · Software for real estate agencies · 14-day free trial',
    'hero.title1': 'Your agency,',
    'hero.title2': '<em>online in minutes.</em>',
    'hero.sub': 'Inmobly is the software to build your development\'s page and publish every listing yourself, from your phone. No developers, no code, no waiting on anyone.',
    'hero.cta1': 'Start for free →',
    'hero.cta2': 'See how it works',
    'hero.trust': '14-day free trial · No credit card · Cancel anytime',
    'hero.badge': 'Catalog updated 2 min ago',
    'hero.mock.title': 'Las Lomas Building · 3 bedrooms',
    'hero.mock.zone': 'Villa Morra · 95m²',
    'hero.mock.cuota': '3 units available',

    'stats.s1': 'Free trial, no credit card',
    'stats.s2': 'To create your account and first page',
    'stats.s3': 'Self-service: you upload, edit, publish',
    'stats.s4': 'Developers or code required',

    'pain.eyebrow': 'The real problem',
    'pain.title': 'Your catalog deserves <em>better</em> than this.',
    'pain.sub': "It's not a lack of good listings. It's that depending on a developer or an agency slows you down.",
    'pain.1.t': "You don't have your own website, or it depends on a developer for any change.",
    'pain.1.d': 'Every update means messaging someone, waiting, and paying again.',
    'pain.2.t': 'Your catalog lives in a spreadsheet or a WhatsApp status.',
    'pain.2.d': 'The listing that already sold stays up, and the new one takes weeks to appear.',
    'pain.3.t': 'Changing a price takes you days, not minutes.',
    'pain.3.d': "Depending on someone else for something you should be able to do yourself, right now.",
    'pain.4.t': "Buyers can't find the info on the project they're interested in.",
    'pain.4.d': 'They go to a competitor who has a clear page with what they need.',

    'svc.eyebrow': "What's included in Inmobly",
    'svc.title': 'Two tools. <em>One single panel.</em>',
    'svc.sub': "No developers, no endless support tickets. You build the page that sells your project yourself, and the catalog that never falls behind.",
    'svc.1.t': 'Sales page per development',
    'svc.1.d': 'Pick your project, upload photos, price and location. Your page is ready and live, without depending on anyone.',
    'svc.1.l1': 'Gallery, floor plan and construction progress — you upload them',
    'svc.1.l2': 'Price and available units, editable in seconds',
    'svc.1.l3': 'Direct WhatsApp button, no endless forms',
    'svc.1.tag': 'One page per project, self-service',
    'svc.2.t': 'CMS catalog of available properties',
    'svc.2.d': 'Each listing with its own page, filters by zone and price. Upload photos from your phone and Inmobly does the rest.',
    'svc.2.l1': 'Individual page per listing',
    'svc.2.l2': 'Filters by zone, type and price',
    'svc.2.l3': 'Upload photos from your phone, it publishes itself',
    'svc.2.tag': 'Catalog always up to date, by you',

    'panel.eyebrow': 'How it works · Mobile first',
    'panel.title': 'Upload photos from your phone. <em>Your catalog updates itself.</em>',
    'panel.sub': 'Take photos with your phone, upload them in Inmobly, and seconds later they\'re on your page and in your catalog. No developers, no tickets, no waiting on anyone.',
    'panel.app': 'Inmobly · Admin',
    'panel.property': 'Las Lomas Bldg. · 3 BR',
    'panel.zone': 'Tap to upload photos',
    'panel.photos': 'published photos',
    'panel.live': 'SYNC · LIVE',
    'panel.uploading': 'Uploading',
    'panel.land.title': 'Las Lomas Building · 3 bedrooms',
    'panel.land.zone': 'Villa Morra · 95m²',
    'panel.land.cuota': '3 units available',
    'panel.land.cta': 'Book a visit on WhatsApp →',
    'panel.f1.t': 'Automatic optimization',
    'panel.f1.d': 'Resize, compression and WebP conversion on the server. Every photo loads in under 200ms.',
    'panel.f2.t': 'Watermark with your logo',
    'panel.f2.d': 'Optional watermark on every photo. Protect your inventory from competitors who copy.',
    'panel.f3.t': 'Rich WhatsApp preview',
    'panel.f3.d': 'Share the link and the photo, price and zone show up automatically. Zero extra effort.',
    'panel.f4.t': 'Multi-user with permissions',
    'panel.f4.d': 'Each broker sees only their listings. The owner or developer sees the whole catalog.',
    'panel.included': 'Included in the plan · Hosting, CDN and optimization at <strong>no extra cost</strong>.',
    'panel.room.living': 'Living', 'panel.room.bedroom': 'Bedroom', 'panel.room.bath': 'Bathroom', 'panel.room.ext': 'Exterior',

    'price.eyebrow': 'Plans',
    'price.title': 'Start for free. Pay only when you\'re convinced.',
    'price.sub': "14-day free trial, no credit card. After that, pick the plan that fits the size of your catalog.",
    'price.start.eyebrow': 'Inmobly plan · from',
    'price.start.title': 'Your development page + full property catalog.',
    'price.start.tag': '14-day free trial · no card',
    'price.start.desc': "Includes your project's sales page, a CMS catalog for your entire portfolio, a panel to publish yourself from your phone, hosting, CDN and photo optimization.",
    'price.start.cta': 'Start for free →',
    'price.custom.eyebrow': 'Large portfolio?',
    'price.custom.title': 'Are you a developer or have multiple projects?',
    'price.custom.desc': 'For several projects at once, large catalogs (100+ units), professional photos or 3D renders, and a dedicated account manager, we build a custom plan. We quote based on the number of projects and portfolio size.',
    'price.custom.cta': "Let's talk →",
    'scope.eyebrow': 'Separate investment',
    'scope.title': 'Our plan covers the full page and catalog service.',
    'scope.sub': 'Items marked with <span class="scope-note__mark" aria-hidden="true">*</span> are contracted directly with each provider, keeping you in full control of your budget, no middlemen, no surprises.',
    'scope.i1.t': 'Professional photos or 3D renders',
    'scope.i1.d': 'For pre-construction projects or ones needing higher-level visual production: quoted separately per project.',
    'scope.i2.t': 'Premium hosting and domain',
    'scope.i2.d': 'We recommend dedicated hosting for high-traffic launches: separate cost based on traffic.',

    'cta.title': 'Your agency, with its own website <em>from today.</em>',
    'cta.sub': 'Create your free account, upload your first listing and share it on WhatsApp in minutes. No card, no commitment.',
    'cta.btn': 'Start for free →',
    'cta.btn2': "Large portfolio? Let's talk →",
    'cta.trust': '14-day free trial · No credit card · Cancel anytime',

    'footer.sub': 'A Punto Alto product',
    'footer.login': 'Log in',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'For Accountants',
    'footer.copy': '© 2026 Inmobly by Punto Alto. Asunción, Paraguay.',

    'form.s1.label': 'Question 1 / 6', 'form.s1.q': 'What should we call you?', 'form.s1.ph': 'Your name',
    'form.s2.label': 'Question 2 / 6', 'form.s2.q': 'Your WhatsApp number?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': "We'll reach you there to schedule",
    'form.s3.label': 'Question 3 / 6', 'form.s3.q': 'Name of your agency or development?', 'form.s3.ph': 'Your agency, developer or project',
    'form.s4.label': 'Question 4 / 6', 'form.s4.q': 'What do you need first?', 'form.s4.sub': "Pick one and we'll continue automatically.",
    'form.s4.o1': 'A page for a specific development', 'form.s4.o2': 'A catalog of available listings',
    'form.s4.o3': 'Both', 'form.s4.o4': "I'm not sure yet",
    'form.s5.label': 'Question 5 / 6', 'form.s5.q': 'How many properties or units do you need to publish?', 'form.s5.sub': 'To size the catalog.',
    'form.s5.o1': 'Fewer than 10', 'form.s5.o2': '10 to 30', 'form.s5.o3': '30 to 100', 'form.s5.o4': 'More than 100',
    'form.s6.label': 'Last question', 'form.s6.q': 'Where do your leads come from TODAY?', 'form.s6.sub': "Pick the main source and we'll continue automatically.",
    'form.s6.o1': 'Meta Ads (Facebook / Instagram)', 'form.s6.o2': 'Google Ads',
    'form.s6.o3': 'Portals (InfoCasas, Clasipar)', 'form.s6.o4': 'Word of mouth / referrals only',
    'form.s6.o5': 'Walk-in / on-site signage', 'form.s6.o6': 'Nothing structured yet',
    'form.next': 'Continue →', 'form.back': '← Back',
    'form.hint.enter': 'Press <kbd>Enter ↵</kbd> to continue',
    'form.ok.title': 'Perfect, <span id="fxOkName"></span>!',
    'form.ok.sub': "We'll WhatsApp you in under 2 hours to build your custom plan.",
    'form.ok.btn': 'Back to site',
  },

  pt: {
    'logo.sub': 'UM PRODUTO DA PUNTO ALTO',
    'nav.services': 'Produto', 'nav.how': 'Como funciona', 'nav.pricing': 'Preços', 'nav.cta': 'Começar grátis →',

    'hero.pill': 'Inmobly · Software para imobiliárias · 14 dias grátis',
    'hero.title1': 'Sua imobiliária,',
    'hero.title2': '<em>online em minutos.</em>',
    'hero.sub': 'Inmobly é o software pra montar a página do seu empreendimento e publicar cada imóvel você mesmo, pelo celular. Sem developer, sem código, sem esperar por ninguém.',
    'hero.cta1': 'Começar grátis →',
    'hero.cta2': 'Ver como funciona',
    'hero.trust': '14 dias grátis · Sem cartão de crédito · Cancele quando quiser',
    'hero.badge': 'Catálogo atualizado há 2 min',
    'hero.mock.title': 'Edif. Las Lomas · 3 dormitórios',
    'hero.mock.zone': 'Villa Morra · 95m²',
    'hero.mock.cuota': '3 unidades disponíveis',

    'stats.s1': 'De teste grátis, sem cartão',
    'stats.s2': 'Pra criar sua conta e sua primeira página',
    'stats.s3': 'Autoatendimento: você sobe, edita, publica',
    'stats.s4': 'Developers ou código necessários',

    'pain.eyebrow': 'O problema real',
    'pain.title': 'Seu catálogo merece <em>algo melhor</em> do que isso.',
    'pain.sub': 'Não é falta de imóveis bons. É que depender de um developer ou de uma agência te trava.',
    'pain.1.t': 'Você não tem site próprio, ou ele depende de um developer pra qualquer mudança.',
    'pain.1.d': 'Cada atualização significa escrever, esperar e pagar de novo.',
    'pain.2.t': 'Seu catálogo vive numa planilha ou no status do WhatsApp.',
    'pain.2.d': 'O imóvel que já vendeu continua publicado, e o novo demora semanas pra aparecer.',
    'pain.3.t': 'Mudar um preço te toma dias, não minutos.',
    'pain.3.d': 'Depender de outra pessoa pra algo que você deveria conseguir fazer sozinho, agora mesmo.',
    'pain.4.t': 'O comprador não encontra a info do projeto que ele quer.',
    'pain.4.d': 'Ele vai pro concorrente, que tem uma página clara com o que procura.',

    'svc.eyebrow': 'O que a Inmobly inclui',
    'svc.title': 'Duas ferramentas. <em>Um só painel.</em>',
    'svc.sub': 'Nada de developer nem tickets de suporte eternos. Você monta a página que vende seu projeto, e o catálogo que nunca fica pra trás.',
    'svc.1.t': 'Página de vendas por empreendimento',
    'svc.1.d': 'Escolhe seu projeto, sobe fotos, preço e localização. Sua página fica pronta e no ar, sem depender de ninguém.',
    'svc.1.l1': 'Galeria, planta e andamento da obra — você sobe',
    'svc.1.l2': 'Preço e unidades disponíveis, editáveis em segundos',
    'svc.1.l3': 'Botão direto pro WhatsApp, sem formulário eterno',
    'svc.1.tag': 'Uma página por projeto, autoatendimento',
    'svc.2.t': 'Catálogo CMS de imóveis disponíveis',
    'svc.2.d': 'Cada imóvel com sua própria ficha, filtros por zona e preço. Você sobe as fotos pelo celular e a Inmobly faz o resto.',
    'svc.2.l1': 'Ficha individual por imóvel',
    'svc.2.l2': 'Filtros por zona, tipo e preço',
    'svc.2.l3': 'Sobe fotos pelo celular, publica sozinho',
    'svc.2.tag': 'Catálogo sempre atualizado, por você',

    'panel.eyebrow': 'Como funciona · Mobile first',
    'panel.title': 'Suba fotos pelo celular. <em>Seu catálogo se atualiza sozinho.</em>',
    'panel.sub': 'Tire as fotos pelo celular, suba na Inmobly, e em segundos elas estão na sua página e no seu catálogo. Sem developer, sem ticket, sem esperar por ninguém.',
    'panel.app': 'Inmobly · Admin',
    'panel.property': 'Edif. Las Lomas · 3 dorm.',
    'panel.zone': 'Toque para subir fotos',
    'panel.photos': 'fotos publicadas',
    'panel.live': 'SYNC · AO VIVO',
    'panel.uploading': 'Enviando',
    'panel.land.title': 'Edif. Las Lomas · 3 dormitórios',
    'panel.land.zone': 'Villa Morra · 95m²',
    'panel.land.cuota': '3 unidades disponíveis',
    'panel.land.cta': 'Agendar visita por WhatsApp →',
    'panel.f1.t': 'Otimização automática',
    'panel.f1.d': 'Resize, compressão e conversão pra WebP no servidor. Cada foto carrega em menos de 200ms.',
    'panel.f2.t': 'Watermark com seu logo',
    'panel.f2.d': "Marca d'água opcional em cada foto. Protege seu inventário do concorrente que copia.",
    'panel.f3.t': 'WhatsApp com preview rico',
    'panel.f3.d': 'Compartilhe o link e aparece foto, preço e zona automaticamente. Zero esforço extra.',
    'panel.f4.t': 'Multi-usuário com permissões',
    'panel.f4.d': 'Cada corretor vê só seus imóveis. O dono ou a construtora vê o catálogo inteiro.',
    'panel.included': 'Incluso no plano · Hospedagem, CDN e otimização <strong>sem custo adicional</strong>.',
    'panel.room.living': 'Sala', 'panel.room.bedroom': 'Quarto', 'panel.room.bath': 'Banheiro', 'panel.room.ext': 'Fachada',

    'price.eyebrow': 'Planos',
    'price.title': 'Comece grátis. Pague só quando estiver convencido.',
    'price.sub': '14 dias de teste, sem cartão de crédito. Depois, escolhe o plano que se ajusta ao tamanho do seu catálogo.',
    'price.start.eyebrow': 'Plano Inmobly · a partir de',
    'price.start.title': 'Sua página de empreendimento + catálogo completo de imóveis.',
    'price.start.tag': '14 dias grátis · sem cartão',
    'price.start.desc': 'Inclui a página de vendas do seu projeto, catálogo CMS pra toda sua carteira de imóveis, painel pra você mesmo publicar pelo celular, hospedagem, CDN e otimização de fotos.',
    'price.start.cta': 'Começar grátis →',
    'price.custom.eyebrow': 'Carteira grande?',
    'price.custom.title': 'É construtora ou tem vários empreendimentos?',
    'price.custom.desc': 'Pra vários projetos ao mesmo tempo, catálogos grandes (100+ unidades), fotos profissionais ou render 3D, e gerente de conta dedicado, montamos um plano sob medida. Cotamos conforme a quantidade de projetos e o tamanho da carteira.',
    'price.custom.cta': 'Vamos conversar →',
    'scope.eyebrow': 'Investimento à parte',
    'scope.title': 'Nosso plano cobre o serviço completo da página e do catálogo.',
    'scope.sub': 'Os itens marcados com <span class="scope-note__mark" aria-hidden="true">*</span> são contratados direto com cada fornecedor, assim você mantém controle total do orçamento, sem intermediários nem surpresas.',
    'scope.i1.t': 'Fotos profissionais ou render 3D',
    'scope.i1.d': 'Pra empreendimentos na planta ou que precisam de produção visual de nível mais alto: cotação à parte conforme o projeto.',
    'scope.i2.t': 'Hosting e domínio premium',
    'scope.i2.d': 'Recomendamos hosting dedicado pra lançamentos com tráfego alto: custo à parte conforme tráfego.',

    'cta.title': 'Sua imobiliária, com site próprio <em>desde hoje.</em>',
    'cta.sub': 'Crie sua conta grátis, suba seu primeiro imóvel e compartilhe no WhatsApp em minutos. Sem cartão, sem compromisso.',
    'cta.btn': 'Começar grátis →',
    'cta.btn2': 'Carteira grande? Vamos conversar →',
    'cta.trust': '14 dias grátis · Sem cartão de crédito · Cancele quando quiser',

    'footer.sub': 'Um produto da Punto Alto',
    'footer.login': 'Entrar',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'Para Contadores',
    'footer.copy': '© 2026 Inmobly by Punto Alto. Assunção, Paraguai.',

    'form.s1.label': 'Pergunta 1 / 6', 'form.s1.q': 'Como te chamamos?', 'form.s1.ph': 'Seu nome',
    'form.s2.label': 'Pergunta 2 / 6', 'form.s2.q': 'Seu número de WhatsApp?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'Vamos te contatar lá com a agenda',
    'form.s3.label': 'Pergunta 3 / 6', 'form.s3.q': 'Nome da sua imobiliária ou empreendimento?', 'form.s3.ph': 'Sua imobiliária, construtora ou projeto',
    'form.s4.label': 'Pergunta 4 / 6', 'form.s4.q': 'O que você precisa primeiro?', 'form.s4.sub': 'Escolha uma e seguimos automaticamente.',
    'form.s4.o1': 'Página para um empreendimento específico', 'form.s4.o2': 'Catálogo de imóveis disponíveis',
    'form.s4.o3': 'Os dois', 'form.s4.o4': 'Ainda não tenho certeza',
    'form.s5.label': 'Pergunta 5 / 6', 'form.s5.q': 'Quantos imóveis ou unidades você tem pra publicar?', 'form.s5.sub': 'Pra dimensionar o catálogo.',
    'form.s5.o1': 'Menos de 10', 'form.s5.o2': 'Entre 10 e 30', 'form.s5.o3': 'Entre 30 e 100', 'form.s5.o4': 'Mais de 100',
    'form.s6.label': 'Última pergunta', 'form.s6.q': 'De onde vêm seus leads HOJE?', 'form.s6.sub': 'Escolha a origem principal e seguimos automaticamente.',
    'form.s6.o1': 'Meta Ads (Facebook / Instagram)', 'form.s6.o2': 'Google Ads',
    'form.s6.o3': 'Portais (InfoCasas, Clasipar)', 'form.s6.o4': 'Só indicação / boca-a-boca',
    'form.s6.o5': 'Walk-in / placa na obra', 'form.s6.o6': 'Nada estruturado ainda',
    'form.next': 'Continuar →', 'form.back': '← Voltar',
    'form.hint.enter': 'Aperte <kbd>Enter ↵</kbd> para continuar',
    'form.ok.title': 'Perfeito, <span id="fxOkName"></span>!',
    'form.ok.sub': 'Vamos te chamar no WhatsApp em menos de 2 horas pra montar seu plano sob medida.',
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
  // Sem auto-detecção por navigator.language: evita que crawlers/bots
  // (locale padrão en-US) troquem o idioma sozinhos e causem reprovação
  // "Idioma não suportado" em campanhas de Ads apontando pra versão em
  // espanhol. Fica em espanhol até o usuário escolher outro no seletor.
  return 'es';
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

  initPanelDemo();
  initFormOverlay();
});

/* ════════════════════════════════════════════════════════
   Panel del corredor — upload → live sync animation
   ════════════════════════════════════════════════════════ */
function initPanelDemo() {
  const zone     = document.getElementById('panelZone');
  const dropIcon = document.getElementById('panelDropIcon');
  const progWrap = document.getElementById('panelProgressWrap');
  const progFill = document.getElementById('panelProgressFill');
  const progLabel= document.getElementById('panelProgressLabel');
  const countEl  = document.getElementById('panelCount');
  const gallery  = document.getElementById('panelGallery');
  if (!zone || !gallery) return;

  const ROOMS = ['living', 'bedroom', 'bath', 'ext'];
  let cycleIdx = 0;
  let countVal = 0;
  let timeouts = [];
  let started = false;

  const wait = (ms) => new Promise(res => {
    const t = setTimeout(res, ms);
    timeouts.push(t);
  });
  const stopAll = () => { timeouts.forEach(t => clearTimeout(t)); timeouts = []; };

  function dict() { return I18N[currentLang] || I18N.es; }

  function reset() {
    countVal = 0;
    countEl.textContent = '0';
    gallery.querySelectorAll('.panel-slot').forEach(slot => {
      slot.classList.remove('is-filled');
      slot.innerHTML = '';
    });
    zone.querySelectorAll('.panel-photo').forEach(p => p.remove());
    progWrap.classList.remove('is-visible');
    progFill.style.width = '0%';
    zone.classList.remove('is-active');
    if (dropIcon) dropIcon.style.opacity = '';
  }

  async function uploadPhoto(slotIdx) {
    const room = ROOMS[slotIdx % ROOMS.length];
    const roomLabel = dict()['panel.room.' + room] || room;

    // Step 1: photo card pops into the upload zone
    zone.classList.add('is-active');
    const photo = document.createElement('div');
    photo.className = 'panel-photo panel-photo--' + room;
    photo.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' + roomLabel;
    zone.appendChild(photo);

    // Step 2: progress bar fills 0 → 100
    progWrap.classList.add('is-visible');
    const progName = dict()['panel.uploading'] || 'Subiendo';
    const ticks = 12;
    for (let i = 1; i <= ticks; i++) {
      const pct = Math.round((i / ticks) * 100);
      progFill.style.width = pct + '%';
      progLabel.textContent = progName + '… ' + pct + '%';
      await wait(90);
    }

    // Step 3: photo "flies" to the gallery on the right
    photo.classList.add('is-flying');

    // Simultaneously: slot in landing fills
    const slot = gallery.querySelector('[data-slot="' + slotIdx + '"]');
    if (slot) {
      const slotPhoto = document.createElement('div');
      slotPhoto.className = 'panel-slot__photo panel-slot__photo--' + room;
      slotPhoto.textContent = roomLabel;
      // Delay just enough to feel like network sync
      await wait(420);
      slot.classList.add('is-filled');
      slot.appendChild(slotPhoto);
    }

    // Step 4: bump counter
    countVal++;
    countEl.textContent = countVal;
    countEl.classList.add('is-bumping');
    await wait(420);
    countEl.classList.remove('is-bumping');

    // Cleanup
    photo.remove();
    progWrap.classList.remove('is-visible');
    progFill.style.width = '0%';
    zone.classList.remove('is-active');
  }

  async function loop() {
    while (started) {
      reset();
      await wait(500);
      for (let i = 0; i < 4; i++) {
        if (!started) return;
        await uploadPhoto(i);
        await wait(700);
      }
      // Pause to admire the result, then loop
      await wait(2800);
    }
  }

  function start() {
    if (started) return;
    started = true;
    loop();
  }

  function stop() {
    started = false;
    stopAll();
  }

  // Lazy start when panel section comes into view
  const section = document.getElementById('como-funciona');
  if (!section) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) start();
      else stop();
    });
  }, { threshold: 0.15 });
  obs.observe(section);

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
}

/* ════════════════════════════════════════════════════════
   Form overlay (5 perguntas)
   ════════════════════════════════════════════════════════ */
function initFormOverlay() {
  const STEPS = [
    { id: 1, field: 'f-name',      type: 'text'  },
    { id: 2, field: 'f-phone',     type: 'tel'   },
    { id: 3, field: 'f-company',   type: 'text'  },
    { id: 4, field: 'rg-operation',type: 'radio' },
    { id: 5, field: 'rg-team',     type: 'radio' },
    { id: 6, field: 'rg-origin',   type: 'radio' },
    { id: 7, field: null,          type: 'success' },
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
      name:      document.getElementById('f-name')?.value || '',
      phone:     document.getElementById('f-phone')?.value || '',
      company:   document.getElementById('f-company')?.value || '',
      operation: overlay.querySelector('#rg-operation input:checked')?.value || '',
      team:      overlay.querySelector('#rg-team input:checked')?.value || '',
      origin:    overlay.querySelector('#rg-origin input:checked')?.value || '',
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
