// /api/videos — função serverless do Vercel
// Busca os vídeos mais recentes do canal na YouTube Data API v3.
//
// Variáveis de ambiente (Vercel → Settings → Environment Variables):
//   YOUTUBE_API_KEY        (obrigatória) — sua chave da API
//   YOUTUBE_CHANNEL_HANDLE (opcional)    — handle do canal, sem @. Padrão: "amassadinhos"
//   YOUTUBE_CHANNEL_ID     (opcional)    — ID do canal (UC...). Se definido, ignora o handle.

const API = "https://www.googleapis.com/youtube/v3";

export default async function handler(req, res) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "YOUTUBE_API_KEY não configurada no Vercel" });
  }

  try {
    // 1. Descobrir o canal e sua playlist de uploads
    const channelId = process.env.YOUTUBE_CHANNEL_ID || "";
    const handle = process.env.YOUTUBE_CHANNEL_HANDLE || "amassadinhos";

    const chParams = channelId ? `id=${channelId}` : `forHandle=${handle}`;
    const chResp = await fetch(
      `${API}/channels?part=contentDetails,snippet&${chParams}&key=${key}`
    );
    const chData = await chResp.json();
    if (!chResp.ok || !chData.items?.length) {
      return res.status(502).json({
        error: "Canal não encontrado — confira YOUTUBE_CHANNEL_HANDLE/ID",
        details: chData.error?.message || null,
      });
    }

    const channel = chData.items[0];
    const uploadsPlaylist = channel.contentDetails.relatedPlaylists.uploads;

    // 2. Buscar TODOS os uploads (paginado, até 200 vídeos)
    let items = [];
    let pageToken = "";
    do {
      const plResp = await fetch(
        `${API}/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=50` +
          (pageToken ? `&pageToken=${pageToken}` : "") +
          `&key=${key}`
      );
      const plData = await plResp.json();
      if (!plResp.ok) {
        return res.status(502).json({
          error: "Erro ao buscar vídeos",
          details: plData.error?.message || null,
        });
      }
      items = items.concat(plData.items || []);
      pageToken = plData.nextPageToken || "";
    } while (pageToken && items.length < 200);

    const videos = items
      .filter((i) => i.snippet?.resourceId?.videoId)
      .map((i) => {
        const s = i.snippet;
        const t = s.thumbnails || {};
        return {
          id: s.resourceId.videoId,
          title: s.title,
          description: (s.description || "").split("\n")[0].slice(0, 140),
          publishedAt: s.publishedAt,
          // só tamanhos 16:9 (maxres/medium) — high/standard são 4:3 com barras pretas
          thumb: (t.maxres || t.medium || t.default)?.url || null,
        };
      });

    // 3. Cache na edge do Vercel: 1h fresco + 24h stale.
    //    Protege sua cota da API (10.000 unidades/dia — isso usa ~2 por hora).
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json({
      channel: {
        id: channel.id,
        title: channel.snippet.title,
        url: channel.snippet.customUrl
          ? `https://www.youtube.com/${channel.snippet.customUrl}`
          : `https://www.youtube.com/channel/${channel.id}`,
      },
      videos,
    });
  } catch (err) {
    return res.status(500).json({ error: "Falha inesperada", details: String(err) });
  }
}
