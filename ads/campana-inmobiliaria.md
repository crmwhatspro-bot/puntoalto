# Campaña Google Ads — Punto Alto para Inmobiliarias

Documento vivo. Vamos completando juntos a medida que surgen decisiones.
Campaña anterior (Punto Alto agencia general) sirvió de base metodológica — quedó en
CPC estimado de R$ 4,95 partiendo de amplia + segmentación por tema + negativas.

---

## 1. Landing page de la campaña

`puntoalto.com.py/inmobiliario.html` — página dedicada, NO es la home general.
Diseño y copy ya están hechos (`public/inmobiliario.html`).

⚠️ **2026-08-06 — página reestructurada.** Se sacó todo lo que no fuera el foco
principal (bot de WhatsApp con demo interactiva, calculadora de financiación,
calculadora de ROI investidor, mapa de leads de Asunción) para concentrar la oferta
en **dos productos**, que ahora es lo único que vende la página:

1. **Página de ventas por emprendimiento** — una landing propia por proyecto:
   galería, planta, ubicación, avance de obra, unidades disponibles, botón directo
   a WhatsApp.
2. **Catálogo CMS de inmuebles disponibles** — cada inmueble con su ficha, filtros
   por zona/tipo/precio, panel para publicar fotos desde el celular (basado en el
   whitelabel de nandobarros.com que Diogo va a adaptar).

Resumen de lo que vende ahora la página:

- **Hero**: "Cada proyecto, su página. Cada inmueble, siempre visible." — página
  dedicada por emprendimiento + catálogo que el cliente actualiza solo.
- **Dolor (#dores)**: proyectos compartiendo una página genérica, catálogo en Excel
  desactualizado, cambios de precio que dependen de escribirle a la agencia.
- **Servicios (#servicios)**: los 2 pilares de arriba, presentados como sistema único.
- **Cómo funciona (#como-funciona)**: demo del panel de carga — sube fotos desde el
  celular, se publican solas en la página y en el catálogo (ex-"panel del corredor").
- **Precios (#precios)**: plan único desde **Gs. 1.800.000/mes** (IVA incluido,
  incluye página + catálogo completo) + verba sugerida de ads **Gs. 80.000/día**
  (pagada aparte, directo a Meta/Google). Plan a medida para developers con varios
  emprendimientos o catálogos grandes (100+ unidades).
- **CTA final (#contacto)**: overlay conversacional de 6 preguntas (nombre, WhatsApp,
  inmobiliaria/emprendimiento, qué necesita primero —página, catálogo o ambos—,
  cantidad de inmuebles a publicar, origen actual de leads).

Ya NO forman parte de la página (y por lo tanto no deberían prometerse en los anuncios):
bot de WhatsApp con pre-calificación automática, CRM con deal stage, simulador de
financiación bancaria, calculadora de ROI para inversores, mapa de leads geolocalizado.
Si alguna keyword/anuncio de las secciones siguientes apunta a esas funciones, hay
que revisarlo antes de lanzar.

Público objetivo declarado en el propio formulario: corredores solos, inmobiliarias
chicas (2-5), medianas (6-15), cadenas (15+), developers/fideicomisos con uno o
varios emprendimientos activos.

---

## 2. Objetivo de la campaña

*(pendiente de definir con Diogo — ver preguntas abiertas)*

Candidatos según el propio posicionamiento de la landing:
- Captar corredores/inmobiliarias que ya invierten en Meta/Google pero pierden leads
  por respuesta lenta o falta de calificación (dolor central de la página).
- Captar developers/fideicomisos con proyectos en lanzamiento (ticket más alto, plan custom).

---

## 3. Metodología a repetir (validada en la campaña de agencia general)

1. Palabras clave en **amplia** desde el arranque en esta campaña (a diferencia de la
   anterior, que empezó en frase/exacta) — ya se validó que en amplia + buena
   segmentación de grupos + negativas fuertes el CPC estimado baja rápido.
2. Grupos de anuncios **temáticos y coherentes** — nunca mezclar conceptos distintos en
   el mismo grupo (esto fue lo que bajó el CPC estimado de forma más consistente:
   agregar variaciones de cauda larga *dentro* del mismo tema, no temas distintos juntos).
3. Evitar jerga de agencia en las keywords — usar el lenguaje real que un corredor/dueño
   de inmobiliaria escribiría en el buscador, no términos internos de marketing.
4. Negativas agresivas desde el día uno (cursos, empleo, gratis genérico, portales
   competidores si aplica — ver sección 6).
5. CPC objetivo se calcula por **CPA real del funil**, no por perseguir un número
   redondo arbitrario — fórmula en sección 5.
6. Copys (headlines ≤30, descripciones ≤90, callouts ≤25) — considerar cognados
   ES/PT dado el público brasiguayo en zona de frontera, igual que en la campaña general.
7. Formato de entrega preferido por Diogo: **texto plano, una keyword por línea**,
   frase entre comillas `" "` y exacta entre corchetes `[ ]`, listo para copiar y pegar
   — no tablas.

---

## 4. Segmentos / grupos de anuncios (borrador — a validar)

Basado en los servicios reales de la landing. Cada grupo necesita su propio anuncio
(no reusar el mismo anuncio genérico en los 5):

1. **Captación / Leads inmobiliarios** — "generar leads inmobiliaria", "captacion de
   clientes para inmobiliaria", etc.
2. **WhatsApp para inmobiliarias** — pre-calificación, respuesta automática.
3. **CRM / gestión de corredores** — deal stage, pipeline, gestión de cartera.
4. **Financiación / simulador de crédito** — cuota, BNF, BCP, hipotecario.
5. **Publicidad para inmobiliarias (Meta/Google)** — ads geo-segmentados.

*(Sin desarrollar todavía — lo armamos keyword por keyword como hicimos con la otra
campaña, en la próxima sesión de trabajo.)*

---

## 5. Cálculo de CPC objetivo (pendiente — faltan 2 datos)

Fórmula usada en la campaña de agencia general:

```
CAC objetivo = valor del plan (o fracción, según margen tolerado)
Leads necesarios por cierre = 1 ÷ tasa de conversión lead→contrato
Costo por lead objetivo = CAC objetivo ÷ leads necesarios
CPC objetivo = costo por lead objetivo × tasa de conversión clic→lead
```

Con el plan starter de Gs. 1.800.000/mes, **faltan**:
- Tasa de conversión lead → contrato cerrado (¿cuántos diagnósticos de cada 10 cierran?)
- Tasa de conversión clic → lead (dato real, se obtiene con el tracking `paTrack` del
  sitio una vez la campaña esté corriendo — mientras tanto usamos escenarios 5-20%
  como en la campaña anterior)

⚠️ Nota pendiente de resolver: la campaña anterior mostró estimaciones en **R$ (Real
brasileño)** en la cuenta de Google Ads, pero los precios de Punto Alto están en
**Guaraníes**. Confirmar la moneda real de facturación de la cuenta antes de fijar
el CPC objetivo final, para no comparar números en monedas distintas.

---

## 6. Negativas a considerar (además de la lista base ya usada)

- Portales de terceros donde no queremos aparecer compitiendo por marca:
  `infocasas`, `clasipar`, `remax`, `century 21` (si no son partners)
- `alquiler` o `venta` en búsquedas de consumidor final buscando comprar/alquilar
  directamente (esta campaña vende SERVICIOS a inmobiliarias/corredores, no inmuebles
  al público final) — riesgo alto de confusión, hay que vigilar el reporte de términos
  de búsqueda desde el día uno.
- `trabajo`, `empleo`, `como ser corredor`, `curso de corredor inmobiliario`

---

## 7. Preguntas abiertas

- [ ] ¿La campaña apunta a corredores individuales, inmobiliarias con equipo, developers,
      o los tres a la vez en grupos separados?
- [ ] ¿Confirmar moneda de la cuenta de Google Ads (Gs. vs R$)?
- [ ] ¿Presupuesto diario/mensual de la campaña en Google Ads (separado de los
      Gs. 80.000/día que Punto Alto recomienda para las campañas DEL CLIENTE)?
- [ ] ¿Alcance geográfico: todo Paraguay o concentrado en Asunción/Gran Asunción
      (coincide con el mapa de barrios de la landing, que es solo de Asunción)?
- [ ] Tasa de conversión lead→contrato esperada para este vertical (puede diferir de
      la de la campaña general).

---

## 8. Referencia rápida — límites de caracteres Google Ads

| Elemento | Límite |
|---|---|
| Headline (RSA) | 30 caracteres |
| Descripción (RSA) | 90 caracteres |
| Callout (frase de destaque) | 25 caracteres |
| Sitelink — texto | 25 caracteres |
| Sitelink — descripción (cada línea) | 35 caracteres |
