// /api/subscribe — repassa o cadastro da newsletter pro FormSubmit
// (do servidor, sem esbarrar no CORS do navegador)

const DEST = "amassadinhos.oficial@gmail.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "método não permitido" });
  }

  const email = (req.body?.email || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "e-mail inválido" });
  }

  try {
    const resp = await fetch(`https://formsubmit.co/ajax/${DEST}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email,
        _subject: "Novo inscrito na newsletter do site",
        _template: "table",
        _captcha: "false",
      }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || data.success === "false" || data.success === false) {
      return res.status(502).json({ error: data.message || "falha no FormSubmit" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
