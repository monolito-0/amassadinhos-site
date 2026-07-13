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
    const origin = req.headers.origin || `https://${req.headers.host}`;
    const resp = await fetch(`https://formsubmit.co/ajax/${DEST}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: origin + "/",
      },
      body: JSON.stringify({
        email,
        _subject: "Novo inscrito na newsletter do site",
        _template: "table",
        _captcha: "false",
      }),
    });
    const raw = await resp.text();
    let data = {};
    try { data = JSON.parse(raw); } catch {}

    const ok = resp.ok && (data.success === true || data.success === "true");
    if (!ok) {
      return res.status(502).json({
        error: data.message || `FormSubmit HTTP ${resp.status}: ${raw.slice(0, 200)}`,
      });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}
