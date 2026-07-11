# Site Amassadinhos

Site estático (HTML puro) — pronto pro Vercel, sem build.

## 1. Coloque as imagens

Na pasta `assets/`, salve:

- `assets/logo.png` — o logo do canal (a imagem quadrada 2048×2048)
- `assets/banner.png` — o cabeçalho do YouTube (versão 16:9 fica melhor)

## 2. Configure os links

Abra o `index.html` e procure o bloco `CONFIG` no final do arquivo. Ali você edita:

- `channelUrl` — URL do canal no YouTube
- `hero.id` — ID do vídeo em destaque (o código depois de `watch?v=` na URL)
- `videos` — título e ID de cada um dos 4 cards (a thumbnail vem do YouTube automaticamente)
- `playlistUrl` — link da playlist dos compilados

## 3. Publique no Vercel

Igual ao seu site pessoal:

- **Via GitHub:** crie um repositório com estes arquivos e importe no Vercel (framework: "Other", sem build command).
- **Ou direto:** em vercel.com → Add New Project → arraste esta pasta.

## Extra: newsletter

O formulário de e-mail aponta para o Formspree (placeholder). Crie um form
gratuito em formspree.io e troque `SEU_ID_AQUI` na action do form.
