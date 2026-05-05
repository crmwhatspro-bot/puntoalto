/* ════════════════════════════════════════════════════════
   PUNTO ALTO PARA CONTADORES — JS
   ════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   i18n — ES (default) · EN · PT
   ════════════════════════════════════════════════════════ */
const I18N = {
  es: {
    'logo.sub': 'PARA CONTADORES',
    'nav.services': 'Servicios', 'nav.factura': 'Factura Legal',
    'nav.ruc': 'Consulta RUC', 'nav.news': 'Noticias', 'nav.pricing': 'Precios',
    'nav.cta': 'Consultoría gratis <span aria-hidden="true">→</span>',
    'nav.cta_short': 'Consultoría gratis →',

    'hero.pill': 'Automatización contable · Paraguay',
    'hero.title1': 'Tu estudio contable,',
    'hero.title2': '<em>automatizado con IA.</em>',
    'hero.sub': 'Factura legal en segundos. Consulta de RUC instantánea. Conciliación bancaria automática. Noticias tributarias del DNIT actualizadas por IA — todo en un solo portal para contadores paraguayos.',
    'hero.cta1': 'Quiero automatizar mi estudio <span aria-hidden="true">→</span>',
    'hero.cta2': 'Ver demo en vivo',

    'stats.s1': 'Facturas generadas por día', 'stats.s2': 'Consulta de RUC',
    'stats.s3': 'Precisión en conciliación',  'stats.s4': 'Monitoreo de noticias DNIT',

    'svc.eyebrow': 'Lo que automatizamos',
    'svc.title': 'Todo lo que hacés manual, nosotros lo automatizamos.',
    'svc.sub': 'Herramientas de nivel global adaptadas a la realidad tributaria paraguaya. SET, DNIT, SIFEN — todo integrado.',
    'svc.tag.coming': 'Próximamente',
    'svc.1.t': 'Factura Legal Electrónica',
    'svc.1.d': 'Generación automática de facturas legales vía SIFEN/e-Kuatia. Timbrado, XML firmado digitalmente y envío al DNIT en segundos.',
    'svc.2.t': 'Consulta de RUC Instantánea',
    'svc.2.d': 'Buscá cualquier contribuyente por RUC, razón social o nombre. Datos actualizados directo del registro oficial del DNIT.',
    'svc.2.tag': 'En vivo · TuRuc API',
    'svc.3.t': 'Conciliación Bancaria con IA',
    'svc.3.d': 'Importá extractos bancarios y dejá que la IA cruce automáticamente con tus registros contables. Detecta diferencias al instante.',
    'svc.4.t': 'Noticias Tributarias en Tiempo Real',
    'svc.4.d': 'IA que monitorea DNIT, SET, Hacienda y BCP 24/7. Recibí alertas de resoluciones, plazos y cambios que afectan a tus clientes.',
    'svc.4.tag': 'Curado · Verificado',
    'svc.5.t': 'Declaraciones Juradas',
    'svc.5.d': 'Generación asistida de DJ informativas y de liquidación. Form 500, IVA, IRE, IRP — pre-llenado automático desde tus datos.',
    'svc.6.t': 'Cumplimiento Automático',
    'svc.6.d': 'Calendario fiscal inteligente con alertas automáticas. Nunca más pierdas un vencimiento del DNIT o del SET.',

    'badge.coming': 'Próximamente',
    'factura.eyebrow': 'Vista previa',
    'factura.title': 'Generá una factura legal en <em>segundos.</em>',
    'factura.sub': 'Así va a funcionar la generación de factura electrónica con timbrado SIFEN. Requiere integración con certificado digital y homologación del DNIT — estamos en proceso.',
    'conc.eyebrow': 'Conciliación con IA',
    'conc.title': 'Tu extracto bancario, <em>conciliado automáticamente.</em>',
    'conc.sub': 'Así va a funcionar: importás el extracto CSV del banco y la IA cruza cada movimiento con tus registros contables. En desarrollo — bancos paraguayos no ofrecen API pública aún.',
    'ruc.eyebrow': 'API en vivo · Datos reales',
    'ruc.title': 'Consultá cualquier RUC del <em>Paraguay.</em>',
    'ruc.sub': 'Conectado a la API gratuita de TuRuc (turuc.com.py). Datos reales del Registro Único de Contribuyentes — buscá por RUC o razón social.',
    'news.eyebrow': 'Highlights tributarios · Actualizado cada hora',
    'news.title': 'Noticias que <em>importan</em> a tu estudio.',
    'news.sub': 'Noticias extraídas automáticamente de fuentes oficiales paraguayas cada 1 hora, filtradas por IA y seleccionadas por relevancia para estudios contables.',

    'price.eyebrow': 'Inversión',
    'price.title': 'Cada plan, hecho a medida.',
    'price.sub': 'No vendemos paquetes cerrados. Armamos el plan exacto según el tamaño de tu estudio, tu cartera de clientes y los procesos que necesitás automatizar.',
    'price.start.eyebrow': 'Plan inicio · desde',
    'price.start.title': 'Empezá con estructura real desde el día uno.',
    'price.start.tag': 'IVA incluido',
    'price.start.desc': 'El piso para automatizar tu estudio: sitio profesional, consulta de RUC integrada, portal tributario y WhatsApp comercial — listo para captar y atender clientes desde el día uno.',
    'price.start.cta': 'Empezar con este plan <span aria-hidden="true">→</span>',
    'price.ads.eyebrow': 'Verba sugerida en ads',
    'price.ads.title': 'Lo recomendado para arrancar.',
    'price.ads.tag': 'Mínimo recomendado',
    'price.ads.desc': 'Para que Google y Meta tengan datos suficientes para optimizar y traer clientes cualificados a tu estudio. Este presupuesto se paga directo a la plataforma — fuera de la mensualidad de Punto Alto.',
    'price.custom.eyebrow': 'Plan a tu medida',
    'price.custom.title': '¿Tu estudio ya está en otro nivel?',
    'price.custom.desc': 'Para operaciones más complejas —IA en WhatsApp 24/7, alertas tributarias automáticas por cliente, multi-atendente, integraciones con tu sistema contable, gerente de cuenta dedicado— armamos un plan exacto para tu caso. Cotizamos según tu operación, cartera y objetivos.',
    'price.custom.cta': 'Hablemos <span aria-hidden="true">→</span>',
    'scope.eyebrow': 'Inversión aparte',
    'scope.title': 'Nuestros planes cubren el servicio completo de la agencia.',
    'scope.sub': 'Los ítems marcados con <span class="scope-note__mark" aria-hidden="true">*</span> se contratan directo con cada proveedor — así mantenés control total sobre tu presupuesto, sin intermediarios ni sorpresas.',
    'scope.i1.t': 'Pauta en Google Ads',
    'scope.i1.d': 'Presupuesto de medios pagado directo a Google.',
    'scope.i2.t': 'API de WhatsApp Business',
    'scope.i2.d': 'Licencia facturada aparte — el costo varía según la cantidad de números y atendentes que operen el sistema.',
    'scope.i3.t': 'Email corporativo profesional',
    'scope.i3.d': 'Precio variable según usuarios — base del ecosistema digital de tu estudio.',

    'cta.title': 'Automatizá tu estudio contable.<br/><em>Empezá hoy.</em>',
    'cta.sub': 'Consultoría gratuita. 30 minutos. Te mostramos cómo automatizar tu operación contable.',
    'cta.btn': 'Agendar consultoría <span aria-hidden="true">→</span>',
    'cta.trust': 'Respuesta por WhatsApp en menos de 2 horas · 100% gratuito',

    'footer.sub': 'Para Contadores',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'Para Inmobiliarias',
    'footer.copy': '© 2026 Punto Alto — Asunción, Paraguay. Automatización contable con IA.',

    'form.overlay.aria': 'Consultoría gratuita',
    'form.s1.label': 'Pregunta 1 / 6', 'form.s1.q': '¿Cómo te llamamos?', 'form.s1.ph': 'Tu nombre',
    'form.s2.label': 'Pregunta 2 / 6', 'form.s2.q': '¿Tu número de WhatsApp?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'Te contactamos ahí con la agenda',
    'form.s3.label': 'Pregunta 3 / 6', 'form.s3.q': '¿Nombre de tu estudio contable?', 'form.s3.ph': 'Tu estudio o firma',
    'form.s4.label': 'Pregunta 4 / 6', 'form.s4.q': '¿Cuántos clientes manejás?', 'form.s4.sub': 'Para dimensionar el plan ideal.',
    'form.s4.o1': '1 – 10 clientes', 'form.s4.o2': '11 – 30 clientes', 'form.s4.o3': '31 – 50 clientes', 'form.s4.o4': 'Más de 50',
    'form.s5.label': 'Pregunta 5 / 6', 'form.s5.q': '¿Qué software contable usás hoy?', 'form.s5.sub': 'Para entender de dónde partimos.',
    'form.s5.o1': 'Excel / planillas', 'form.s5.o2': 'Tango Gestión', 'form.s5.o3': 'Bejerman',
    'form.s5.o4': 'Memory', 'form.s5.o5': 'Excel + algún sistema', 'form.s5.o6': 'Ninguno por ahora',
    'form.s6.label': 'Última pregunta', 'form.s6.q': '¿Cuál es tu mayor desafío hoy?', 'form.s6.sub': 'Elegí el principal — seguimos automáticamente.',
    'form.s6.o1': 'Mi equipo está sobrecargado', 'form.s6.o2': 'Migrar a factura electrónica (SIFEN)',
    'form.s6.o3': 'Conciliación bancaria manual', 'form.s6.o4': 'Cumplir plazos del DNIT',
    'form.s6.o5': 'Captar más clientes', 'form.s6.o6': 'Modernizar todo el estudio',
    'form.next': 'Continuar →', 'form.back': '← Volver',
    'form.hint.enter': 'Presioná <kbd>Enter ↵</kbd> para continuar',
    'form.ok.title': '¡Perfecto, <span id="fxOkName"></span>!',
    'form.ok.sub': 'Te escribimos por WhatsApp en menos de 2 horas para agendar tu consultoría gratuita.',
    'form.ok.btn': 'Volver al sitio',
  },

  en: {
    'logo.sub': 'FOR ACCOUNTANTS',
    'nav.services': 'Services', 'nav.factura': 'E-Invoicing',
    'nav.ruc': 'RUC Lookup', 'nav.news': 'News', 'nav.pricing': 'Pricing',
    'nav.cta': 'Free consultation <span aria-hidden="true">→</span>',
    'nav.cta_short': 'Free consultation →',

    'hero.pill': 'Accounting automation · Paraguay',
    'hero.title1': 'Your accounting firm,',
    'hero.title2': '<em>automated with AI.</em>',
    'hero.sub': 'Legal invoices in seconds. Instant RUC lookup. Automatic bank reconciliation. Tax news from DNIT curated by AI — all in one portal for Paraguayan accountants.',
    'hero.cta1': 'I want to automate my firm <span aria-hidden="true">→</span>',
    'hero.cta2': 'See live demo',

    'stats.s1': 'Invoices issued per day', 'stats.s2': 'RUC lookup speed',
    'stats.s3': 'Reconciliation accuracy',  'stats.s4': 'DNIT news monitoring',

    'svc.eyebrow': 'What we automate',
    'svc.title': 'Everything you do manually, we automate.',
    'svc.sub': 'World-class tools adapted to Paraguayan tax reality. SET, DNIT, SIFEN — fully integrated.',
    'svc.tag.coming': 'Coming soon',
    'svc.1.t': 'Electronic Legal Invoicing',
    'svc.1.d': 'Automatic legal invoice generation via SIFEN/e-Kuatia. Timbrado, signed XML and DNIT submission in seconds.',
    'svc.2.t': 'Instant RUC Lookup',
    'svc.2.d': 'Look up any taxpayer by RUC, business name or trade name. Live data from the official DNIT registry.',
    'svc.2.tag': 'Live · TuRuc API',
    'svc.3.t': 'AI Bank Reconciliation',
    'svc.3.d': 'Import bank statements and let AI cross-match every entry with your accounting records. Spot mismatches instantly.',
    'svc.4.t': 'Real-time Tax News',
    'svc.4.d': 'AI monitors DNIT, SET, MEF and BCP 24/7. Get alerts on resolutions, deadlines and changes affecting your clients.',
    'svc.4.tag': 'Curated · Verified',
    'svc.5.t': 'Tax Returns',
    'svc.5.d': 'Assisted generation of informative and liquidation tax returns. Form 500, VAT, IRE, IRP — pre-filled from your data.',
    'svc.6.t': 'Automatic Compliance',
    'svc.6.d': 'Smart fiscal calendar with auto-alerts. Never miss a DNIT or SET deadline again.',

    'badge.coming': 'Coming soon',
    'factura.eyebrow': 'Preview',
    'factura.title': 'Generate a legal invoice in <em>seconds.</em>',
    'factura.sub': 'How electronic invoicing with SIFEN timbrado will work. Requires digital certificate integration and DNIT homologation — in progress.',
    'conc.eyebrow': 'AI Reconciliation',
    'conc.title': 'Your bank statement, <em>auto-reconciled.</em>',
    'conc.sub': 'How it will work: import the CSV from your bank and AI matches every transaction with your accounting records. In development — Paraguayan banks don\'t offer public APIs yet.',
    'ruc.eyebrow': 'Live API · Real data',
    'ruc.title': 'Look up any RUC in <em>Paraguay.</em>',
    'ruc.sub': 'Connected to the free TuRuc API (turuc.com.py). Real data from the official taxpayer registry — search by RUC or business name.',
    'news.eyebrow': 'Tax highlights · Updated hourly',
    'news.title': 'News that <em>matters</em> to your firm.',
    'news.sub': 'News auto-extracted from official Paraguayan sources every hour, filtered by AI and selected by relevance for accounting firms.',

    'price.eyebrow': 'Investment',
    'price.title': 'Every plan, tailor-made.',
    'price.sub': 'We don\'t sell closed packages. We build the exact plan based on your firm size, client portfolio and the processes you need to automate.',
    'price.start.eyebrow': 'Starter plan · from',
    'price.start.title': 'Start with real structure from day one.',
    'price.start.tag': 'VAT included',
    'price.start.desc': 'The floor to automate your firm: professional site, integrated RUC lookup, tax portal and commercial WhatsApp — ready to capture and serve clients from day one.',
    'price.start.cta': 'Start with this plan <span aria-hidden="true">→</span>',
    'price.ads.eyebrow': 'Suggested ad budget',
    'price.ads.title': 'Recommended to start.',
    'price.ads.tag': 'Recommended minimum',
    'price.ads.desc': 'So Google and Meta have enough data to optimize and bring qualified clients to your firm. This budget is paid directly to the platform — separate from the Punto Alto fee.',
    'price.custom.eyebrow': 'Custom plan',
    'price.custom.title': 'Is your firm at another level?',
    'price.custom.desc': 'For complex operations — 24/7 WhatsApp AI, automatic per-client tax alerts, multi-agent, integration with your accounting system, dedicated account manager — we build an exact plan. We quote based on operation, portfolio and goals.',
    'price.custom.cta': 'Let\'s talk <span aria-hidden="true">→</span>',
    'scope.eyebrow': 'Separate investment',
    'scope.title': 'Our plans cover the full agency service.',
    'scope.sub': 'Items marked with <span class="scope-note__mark" aria-hidden="true">*</span> are contracted directly with each provider — keeping you in full control of your budget, no middlemen, no surprises.',
    'scope.i1.t': 'Google Ads spend',
    'scope.i1.d': 'Media budget paid directly to Google.',
    'scope.i2.t': 'WhatsApp Business API',
    'scope.i2.d': 'Licensed separately — cost varies by number of phones and agents operating the system.',
    'scope.i3.t': 'Professional corporate email',
    'scope.i3.d': 'Variable price by user — base of your firm\'s digital ecosystem.',

    'cta.title': 'Automate your accounting firm.<br/><em>Start today.</em>',
    'cta.sub': 'Free consultation. 30 minutes. We\'ll show you how to automate your accounting operation.',
    'cta.btn': 'Book consultation <span aria-hidden="true">→</span>',
    'cta.trust': 'WhatsApp reply in under 2 hours · 100% free',

    'footer.sub': 'For Accountants',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'For Real Estate',
    'footer.copy': '© 2026 Punto Alto — Asunción, Paraguay. Accounting automation with AI.',

    'form.overlay.aria': 'Free consultation',
    'form.s1.label': 'Question 1 / 6', 'form.s1.q': 'What should we call you?', 'form.s1.ph': 'Your name',
    'form.s2.label': 'Question 2 / 6', 'form.s2.q': 'Your WhatsApp number?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'We\'ll reach you there to schedule',
    'form.s3.label': 'Question 3 / 6', 'form.s3.q': 'Name of your accounting firm?', 'form.s3.ph': 'Your firm',
    'form.s4.label': 'Question 4 / 6', 'form.s4.q': 'How many clients do you manage?', 'form.s4.sub': 'To size the right plan.',
    'form.s4.o1': '1 – 10 clients', 'form.s4.o2': '11 – 30 clients', 'form.s4.o3': '31 – 50 clients', 'form.s4.o4': 'More than 50',
    'form.s5.label': 'Question 5 / 6', 'form.s5.q': 'What accounting software do you use today?', 'form.s5.sub': 'To understand where we\'re starting.',
    'form.s5.o1': 'Excel / spreadsheets', 'form.s5.o2': 'Tango Gestión', 'form.s5.o3': 'Bejerman',
    'form.s5.o4': 'Memory', 'form.s5.o5': 'Excel + some system', 'form.s5.o6': 'None for now',
    'form.s6.label': 'Last question', 'form.s6.q': 'What\'s your biggest challenge today?', 'form.s6.sub': 'Pick the main one — we continue automatically.',
    'form.s6.o1': 'My team is overworked', 'form.s6.o2': 'Migrate to e-invoicing (SIFEN)',
    'form.s6.o3': 'Manual bank reconciliation', 'form.s6.o4': 'Meeting DNIT deadlines',
    'form.s6.o5': 'Acquire more clients', 'form.s6.o6': 'Modernize the whole firm',
    'form.next': 'Continue →', 'form.back': '← Back',
    'form.hint.enter': 'Press <kbd>Enter ↵</kbd> to continue',
    'form.ok.title': 'Perfect, <span id="fxOkName"></span>!',
    'form.ok.sub': 'We\'ll WhatsApp you in under 2 hours to schedule your free consultation.',
    'form.ok.btn': 'Back to site',
  },

  pt: {
    'logo.sub': 'PARA CONTADORES',
    'nav.services': 'Serviços', 'nav.factura': 'Nota Fiscal Legal',
    'nav.ruc': 'Consulta RUC', 'nav.news': 'Notícias', 'nav.pricing': 'Preços',
    'nav.cta': 'Consultoria grátis <span aria-hidden="true">→</span>',
    'nav.cta_short': 'Consultoria grátis →',

    'hero.pill': 'Automação contábil · Paraguai',
    'hero.title1': 'Seu escritório contábil,',
    'hero.title2': '<em>automatizado com IA.</em>',
    'hero.sub': 'Nota fiscal legal em segundos. Consulta de RUC instantânea. Conciliação bancária automática. Notícias tributárias do DNIT atualizadas por IA — tudo em um só portal para contadores paraguaios.',
    'hero.cta1': 'Quero automatizar meu escritório <span aria-hidden="true">→</span>',
    'hero.cta2': 'Ver demo ao vivo',

    'stats.s1': 'Notas geradas por dia', 'stats.s2': 'Consulta de RUC',
    'stats.s3': 'Precisão na conciliação',  'stats.s4': 'Monitoramento DNIT',

    'svc.eyebrow': 'O que automatizamos',
    'svc.title': 'Tudo que você faz manual, a gente automatiza.',
    'svc.sub': 'Ferramentas de nível global adaptadas à realidade tributária paraguaia. SET, DNIT, SIFEN — tudo integrado.',
    'svc.tag.coming': 'Em breve',
    'svc.1.t': 'Nota Fiscal Eletrônica Legal',
    'svc.1.d': 'Geração automática de notas legais via SIFEN/e-Kuatia. Timbrado, XML assinado digitalmente e envio ao DNIT em segundos.',
    'svc.2.t': 'Consulta de RUC Instantânea',
    'svc.2.d': 'Busque qualquer contribuinte por RUC, razão social ou nome. Dados atualizados direto do registro oficial do DNIT.',
    'svc.2.tag': 'Ao vivo · TuRuc API',
    'svc.3.t': 'Conciliação Bancária com IA',
    'svc.3.d': 'Importe extratos bancários e deixe a IA cruzar automaticamente com seus registros contábeis. Detecta divergências na hora.',
    'svc.4.t': 'Notícias Tributárias em Tempo Real',
    'svc.4.d': 'IA que monitora DNIT, SET, Hacienda e BCP 24/7. Receba alertas de resoluções, prazos e mudanças que afetam seus clientes.',
    'svc.4.tag': 'Curado · Verificado',
    'svc.5.t': 'Declarações Juramentadas',
    'svc.5.d': 'Geração assistida de DJs informativas e de liquidação. Form 500, IVA, IRE, IRP — pré-preenchido com seus dados.',
    'svc.6.t': 'Compliance Automático',
    'svc.6.d': 'Calendário fiscal inteligente com alertas automáticos. Nunca mais perca um vencimento do DNIT ou do SET.',

    'badge.coming': 'Em breve',
    'factura.eyebrow': 'Prévia',
    'factura.title': 'Gere uma nota legal em <em>segundos.</em>',
    'factura.sub': 'Como vai funcionar a geração de nota eletrônica com timbrado SIFEN. Requer integração com certificado digital e homologação do DNIT — em andamento.',
    'conc.eyebrow': 'Conciliação com IA',
    'conc.title': 'Seu extrato bancário, <em>conciliado automaticamente.</em>',
    'conc.sub': 'Como vai funcionar: você importa o CSV do banco e a IA cruza cada movimento com seus registros contábeis. Em desenvolvimento — bancos paraguaios ainda não oferecem API pública.',
    'ruc.eyebrow': 'API ao vivo · Dados reais',
    'ruc.title': 'Consulte qualquer RUC do <em>Paraguai.</em>',
    'ruc.sub': 'Conectado à API gratuita da TuRuc (turuc.com.py). Dados reais do registro de contribuintes — busque por RUC ou razão social.',
    'news.eyebrow': 'Highlights tributários · Atualizado a cada hora',
    'news.title': 'Notícias que <em>importam</em> pro seu escritório.',
    'news.sub': 'Notícias extraídas automaticamente de fontes oficiais paraguaias a cada 1 hora, filtradas por IA e selecionadas pela relevância para escritórios contábeis.',

    'price.eyebrow': 'Investimento',
    'price.title': 'Cada plano, sob medida.',
    'price.sub': 'Não vendemos pacotes fechados. Montamos o plano exato conforme o tamanho do escritório, sua carteira de clientes e os processos que precisa automatizar.',
    'price.start.eyebrow': 'Plano início · a partir de',
    'price.start.title': 'Comece com estrutura real desde o primeiro dia.',
    'price.start.tag': 'IVA incluso',
    'price.start.desc': 'O piso para automatizar seu escritório: site profissional, consulta de RUC integrada, portal tributário e WhatsApp comercial — pronto para captar e atender clientes desde o primeiro dia.',
    'price.start.cta': 'Começar com este plano <span aria-hidden="true">→</span>',
    'price.ads.eyebrow': 'Verba sugerida em ads',
    'price.ads.title': 'Recomendado pra começar.',
    'price.ads.tag': 'Mínimo recomendado',
    'price.ads.desc': 'Pra que Google e Meta tenham dados suficientes pra otimizar e trazer clientes qualificados ao seu escritório. Esse orçamento é pago direto à plataforma — fora da mensalidade da Punto Alto.',
    'price.custom.eyebrow': 'Plano sob medida',
    'price.custom.title': 'Seu escritório já está em outro nível?',
    'price.custom.desc': 'Pra operações mais complexas — IA no WhatsApp 24/7, alertas tributários automáticos por cliente, multi-atendente, integrações com seu sistema contábil, gerente de conta dedicado — montamos um plano exato. Cotamos conforme operação, carteira e objetivos.',
    'price.custom.cta': 'Vamos conversar <span aria-hidden="true">→</span>',
    'scope.eyebrow': 'Investimento à parte',
    'scope.title': 'Nossos planos cobrem o serviço completo da agência.',
    'scope.sub': 'Os itens marcados com <span class="scope-note__mark" aria-hidden="true">*</span> são contratados direto com cada fornecedor — assim você mantém controle total do orçamento, sem intermediários nem surpresas.',
    'scope.i1.t': 'Verba em Google Ads',
    'scope.i1.d': 'Orçamento de mídia pago direto ao Google.',
    'scope.i2.t': 'API do WhatsApp Business',
    'scope.i2.d': 'Licença faturada à parte — o custo varia conforme números e atendentes que operam o sistema.',
    'scope.i3.t': 'Email corporativo profissional',
    'scope.i3.d': 'Preço variável por usuário — base do ecossistema digital do seu escritório.',

    'cta.title': 'Automatize seu escritório contábil.<br/><em>Comece hoje.</em>',
    'cta.sub': 'Consultoria gratuita. 30 minutos. Mostramos como automatizar sua operação contábil.',
    'cta.btn': 'Agendar consultoria <span aria-hidden="true">→</span>',
    'cta.trust': 'Resposta por WhatsApp em menos de 2 horas · 100% gratuito',

    'footer.sub': 'Para Contadores',
    'footer.l1': 'Punto Alto Marketing',
    'footer.l2': 'Para Imobiliárias',
    'footer.copy': '© 2026 Punto Alto — Assunção, Paraguai. Automação contábil com IA.',

    'form.overlay.aria': 'Consultoria gratuita',
    'form.s1.label': 'Pergunta 1 / 6', 'form.s1.q': 'Como te chamamos?', 'form.s1.ph': 'Seu nome',
    'form.s2.label': 'Pergunta 2 / 6', 'form.s2.q': 'Seu número de WhatsApp?', 'form.s2.ph': '981 123 456',
    'form.s2.hint': 'Vamos te chamar lá pra agendar',
    'form.s3.label': 'Pergunta 3 / 6', 'form.s3.q': 'Nome do seu escritório contábil?', 'form.s3.ph': 'Seu escritório',
    'form.s4.label': 'Pergunta 4 / 6', 'form.s4.q': 'Quantos clientes você atende?', 'form.s4.sub': 'Para dimensionar o plano ideal.',
    'form.s4.o1': '1 – 10 clientes', 'form.s4.o2': '11 – 30 clientes', 'form.s4.o3': '31 – 50 clientes', 'form.s4.o4': 'Mais de 50',
    'form.s5.label': 'Pergunta 5 / 6', 'form.s5.q': 'Qual software contábil você usa hoje?', 'form.s5.sub': 'Pra entender de onde partimos.',
    'form.s5.o1': 'Excel / planilhas', 'form.s5.o2': 'Tango Gestión', 'form.s5.o3': 'Bejerman',
    'form.s5.o4': 'Memory', 'form.s5.o5': 'Excel + algum sistema', 'form.s5.o6': 'Nenhum por enquanto',
    'form.s6.label': 'Última pergunta', 'form.s6.q': 'Qual seu maior desafio hoje?', 'form.s6.sub': 'Escolha o principal — seguimos automaticamente.',
    'form.s6.o1': 'Minha equipe está sobrecarregada', 'form.s6.o2': 'Migrar pra nota eletrônica (SIFEN)',
    'form.s6.o3': 'Conciliação bancária manual', 'form.s6.o4': 'Cumprir prazos do DNIT',
    'form.s6.o5': 'Captar mais clientes', 'form.s6.o6': 'Modernizar todo o escritório',
    'form.next': 'Continuar →', 'form.back': '← Voltar',
    'form.hint.enter': 'Aperte <kbd>Enter ↵</kbd> para continuar',
    'form.ok.title': 'Perfeito, <span id="fxOkName"></span>!',
    'form.ok.sub': 'Vamos te chamar no WhatsApp em menos de 2 horas pra agendar sua consultoria gratuita.',
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

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang__btn').forEach(btn => {
    btn.addEventListener('click', () => applyI18n(btn.dataset.lang));
  });
}, { once: true });

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
    { id: 4, field: 'rg-clients',  required: true,  type: 'radio'  },
    { id: 5, field: 'rg-software', required: true,  type: 'radio'  },
    { id: 6, field: 'rg-pain',     required: true,  type: 'radio'  },
    { id: 7, field: null,        required: false, type: 'success' },
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
      software:  radio('software'),
      pain:      radio('pain'),
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
