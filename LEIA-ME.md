# Site Amassadinhos

Site estático (HTML puro) — pronto pro Vercel, sem build.

## 1. Coloque as imagens

Na pasta `assets/`, salve:

- `assets/logo.png` — o logo do canal (a imagem quadrada 2048×2048)
- `assets/banner.png` — o cabeçalho do YouTube (versão 16:9 fica melhor)

## 2. Vídeos automáticos (YouTube Data API)

A função `api/videos.js` busca os uploads do canal e o site se monta sozinho:
o vídeo mais recente vira o destaque ("novo vídeo") e os 4 seguintes viram os cards.
Atualiza a cada 1h (cache na edge — gasta ~2 unidades/hora da cota de 10.000/dia).

Variáveis de ambiente no Vercel (Settings → Environment Variables):

- `YOUTUBE_API_KEY` (obrigatória) — sua chave. **O nome precisa ser exatamente esse.**
- `YOUTUBE_CHANNEL_HANDLE` (opcional) — handle do canal sem o @. Padrão: `amassadinhos`.
- `YOUTUBE_CHANNEL_ID` (opcional) — ID `UC...` do canal; se definido, ignora o handle.

Se a API falhar, o site cai no bloco `CONFIG` no fim do `index.html` (fallback
estático — ali também fica o `playlistUrl` dos compilados).

## 3. Publique no Vercel

Igual ao seu site pessoal:

- **Via GitHub:** crie um repositório com estes arquivos e importe no Vercel (framework: "Other", sem build command).
- **Ou direto:** em vercel.com → Add New Project → arraste esta pasta.

## Extra: newsletter

O formulário de e-mail aponta para o Formspree (placeholder). Crie um form
gratuito em formspree.io e troque `SEU_ID_AQUI` na action do form.
