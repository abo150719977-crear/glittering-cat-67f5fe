# LinguaPro — versión con backend para tutor IA

## Qué incluye
- Aplicación web adaptable a móvil, tablet y ordenador.
- Academia A1 con 12 lecciones iniciales y ejercicios autocorregibles.
- Vocabulario, tarjetas de memoria y seguimiento local del progreso.
- Síntesis de pronunciación y dictado por voz del navegador cuando es compatible.
- **Tutor conversacional conectado a la API de OpenAI mediante una función serverless de Netlify.**
- La clave de API permanece en el servidor, nunca en el HTML ni en el navegador.
- Límite básico de mensajes por IP, validación de entradas y respuestas sin caché.

## Importante
El tutor IA real solo responderá después de desplegar el proyecto en Netlify y configurar una clave válida de OpenAI API. La API se factura por separado de ChatGPT; el uso puede generar costes. La clave no debe compartirse ni pegarse en el chat.

## Publicar en Netlify
La función serverless no funciona al abrir `index.html` localmente ni con un simple arrastrar y soltar de archivos estáticos. Despliega el proyecto mediante Git conectado a Netlify o mediante Netlify CLI:

1. Descomprime el ZIP y guarda la carpeta en tu ordenador.
2. Sube la carpeta a un repositorio privado de GitHub (recomendado) y conéctalo a Netlify, o despliega con Netlify CLI desde la carpeta.
3. En Netlify, abre **Site configuration → Environment variables**.
4. Crea `OPENAI_API_KEY` con tu clave secreta de la plataforma API de OpenAI.
5. Crea `OPENAI_MODEL` con `gpt-6-luna` (puedes cambiarlo por otro modelo disponible en tu proyecto API).
6. Vuelve a desplegar el sitio. Abre la página **Hablar** y envía un mensaje de prueba.

No guardes la clave en `index.html`, en GitHub, ni en un archivo público. Configura límites de gasto en tu proyecto API y revisa el consumo.

## Probar la función localmente
Necesitas Node.js y Netlify CLI. En la carpeta del proyecto:

```bash
npm install -g netlify-cli
netlify dev
```

Configura `OPENAI_API_KEY` como variable de entorno local de tu terminal antes de ejecutar el servidor. No compartas esa clave.

## Voz
El botón de micrófono usa el reconocimiento de voz del navegador para convertir voz a texto. Ese texto se envía al tutor IA. La respuesta se muestra escrita; el navegador puede leer frases italianas con el botón de pronunciación de las lecciones. Esta versión todavía no es una conversación de voz en tiempo real ni una llamada de audio bidireccional.

## Privacidad y límites de esta versión
- No hay cuentas de usuario ni sincronización entre dispositivos.
- El progreso se guarda en el navegador del dispositivo.
- No se almacenan conversaciones en una base de datos; la función envía `store: false` a la API. Aun así, el texto se transmite al proveedor de IA para generar la respuesta; consulta sus condiciones y configura la privacidad antes de un lanzamiento comercial.
- El control de frecuencia incluido es básico y en memoria; no sustituye autenticación, protección antiabuso distribuida ni controles de producción.
- A2-C2, pagos, cuentas, base de datos, panel administrativo y publicación en tiendas siguen pendientes.

## Fuentes técnicas
- [OpenAI API — Responses](https://developers.openai.com/api/docs/quickstart)
- [Autenticación y protección de claves](https://developers.openai.com/api/reference/overview)
- [Modelos disponibles](https://developers.openai.com/api/docs/models)
