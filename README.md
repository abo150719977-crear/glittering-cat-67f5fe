# LinguaPro 2.0

Aplicación web para aprender italiano (A1–C2): lecciones, vocabulario, ejercicios, exámenes, repaso con tarjetas, lectura en voz alta, reconocimiento de voz, progreso y tutor de IA. Cuentas con Supabase y tutor mediante una función segura de Netlify.

## Estructura
`index.html` (app) · `config.js` (datos públicos) · `manifest.webmanifest` + `icon.svg` + `sw.js` (instalable/offline) · `netlify.toml` · `supabase-setup.sql` · `netlify/functions/ai-tutor.mjs` (OpenAI en el servidor)

## 1. Supabase
1. Crea un proyecto en supabase.com.
2. **SQL Editor** → pega todo `supabase-setup.sql` → Run (crea la tabla `progress` con RLS: cada alumno solo ve y edita lo suyo).
3. **Project Settings → API**: copia *Project URL* y la clave *anon public*. Pégalas en `config.js`. (La anon es pública por diseño; nunca uses la `service_role` ni la clave de OpenAI en archivos.)
4. Tras desplegar, en **Authentication → URL Configuration** pon como *Site URL* la dirección de tu sitio Netlify y añádela en *Redirect URLs* (necesario para recuperar contraseña y confirmar correos).

## 2. Netlify
1. app.netlify.com → **Add new site → Import an existing project → GitHub** → elige el repositorio.
2. Ajustes de build: sin comando de build, *Publish directory* `.` (ya está en `netlify.toml`).
3. **Site configuration → Environment variables**: `OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` y, opcional, `OPENAI_MODEL` (por defecto `gpt-4o-mini`).
4. **Deploys → Trigger deploy** para que la función lea las variables.

## 3. Desde un iPhone
1. En *Archivos* toca el ZIP para descomprimirlo.
2. En Safari abre tu repositorio en GitHub → **Add file → Upload files** y sube los archivos sueltos (`index.html`, `config.js`, `manifest.webmanifest`, `icon.svg`, `sw.js`, `netlify.toml`, `supabase-setup.sql`, `README.md`) → *Commit changes*.
3. La función está en una carpeta: usa **Add file → Create new file**, escribe el nombre `netlify/functions/ai-tutor.mjs` (las barras crean las carpetas), pega el contenido y haz *Commit*.
4. Conecta el repositorio en Netlify (paso 2) y añade las variables.

## Limitaciones
- El reconocimiento de voz depende del navegador y solo compara palabras transcritas; no evalúa pronunciación real.
- El progreso sincroniza con la regla «gana el cambio más reciente».
- El contenido base está en el objeto `D` de `index.html`; añade temas y palabras con el mismo formato.
