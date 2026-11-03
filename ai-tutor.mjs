// Netlify Function: /.netlify/functions/ai-tutor
// Variables de entorno: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, (opcional) OPENAI_MODEL
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
const MODES = {
  conv: "Mantén una conversación natural en italiano adaptada al nivel. Responde en italiano y añade al final, entre paréntesis y en español, una breve traducción o aclaración. Haz una pregunta para continuar.",
  corr: "El alumno te enviará un texto en italiano. Corrígelo: muestra la versión corregida y explica en español cada error de gramática, vocabulario o expresión.",
  ej: "Propón 3 ejercicios personalizados (huecos, traducción o transformación) del nivel del alumno, basados en lo que ha escrito. No des las soluciones hasta que responda.",
  dud: "Responde en español la duda del alumno con ejemplos en italiano (con traducción)."
};
export default async (req) => {
  if (req.method !== "POST") return J({ error: "Método no permitido" }, 405);
  const { OPENAI_API_KEY: key, SUPABASE_URL: su, SUPABASE_ANON_KEY: sk, OPENAI_MODEL: model = "gpt-4o-mini" } = process.env;
  if (!key || !su || !sk) return J({ error: "Faltan variables de entorno en Netlify" }, 500);
  const tok = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  if (!tok) return J({ error: "No autenticado" }, 401);
  const u = await fetch(su.replace(/\/$/, "") + "/auth/v1/user", { headers: { apikey: sk, Authorization: "Bearer " + tok } });
  if (!u.ok) return J({ error: "Sesión no válida" }, 401);
  let b; try { b = await req.json(); } catch { return J({ error: "JSON no válido" }, 400); }
  const level = ["A1", "A2", "B1", "B2", "C1", "C2"].includes(b.level) ? b.level : "A1";
  const mode = MODES[b.mode] ? b.mode : "conv";
  const msgs = (Array.isArray(b.messages) ? b.messages : [])
    .filter((x) => x && ["user", "assistant"].includes(x.role) && typeof x.content === "string")
    .slice(-12).map((x) => ({ role: x.role, content: x.content.slice(0, 2000) }));
  if (!msgs.length) return J({ error: "Sin mensajes" }, 400);
  const system = `Eres el tutor de italiano de LinguaPro para hispanohablantes. Nivel del alumno: ${level} (MCER); usa vocabulario y gramática adecuados a ese nivel. Sé cercano y breve. Corrige errores con amabilidad. ${MODES[mode]}`;
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({ model, temperature: 0.6, max_tokens: 600, messages: [{ role: "system", content: system }, ...msgs] })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) return J({ error: j.error?.message || "Error de OpenAI" }, 502);
  return J({ reply: j.choices?.[0]?.message?.content || "" });
};
