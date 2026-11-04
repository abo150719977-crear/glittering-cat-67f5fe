// Devuelve SOLO los valores públicos que necesita el navegador (la clave "anon" es pública por diseño).
export default async () => {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  const h = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (!url || !key) return new Response(JSON.stringify({ error: "Faltan SUPABASE_URL y SUPABASE_ANON_KEY en Netlify" }), { status: 500, headers: h });
  return new Response(JSON.stringify({ SUPABASE_URL: url, SUPABASE_ANON_KEY: key }), { status: 200, headers: h });
};
