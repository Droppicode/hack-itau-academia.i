# Itaú — protótipo interativo (Hack Itaú Academia)

Protótipo front-end (React + Vite + Tailwind + framer-motion) das telas do app Itaú, do pré-login até a confirmação do Pix. Só telas e navegação — sem regras de negócio.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build em dist/
```

Deploy na Vercel: importe o repositório (framework Vite, `vercel.json` já inclui o rewrite de SPA).

Fluxo: `/` → `/home` → `/pix` → `/pix/destinatario` → `/pix/valor` → `/pix/forma-pagamento` → `/pix/dados` → `/pix/revisao` → `/pix/sucesso`.

As imagens em `assets/` são apenas referência visual.
