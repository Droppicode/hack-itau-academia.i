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

## E-mail de convite da AcademIA.I

Template em `email/convite.html` (`{{saudacao}}` vira "Oi, Nome!"). Envio pelo Resend com `RESEND_API_KEY`; remetente padrão `AcademIA.I (protótipo) <itau@kgmats.cc>` (troque com `EMAIL_FROM`).

```bash
npm run email:convite -- --dry-run email/exemplo.csv          # só lista quem receberia
npm run email:convite -- email/exemplo.csv                    # CSV "nome,email" (ou só "email") por linha
npm run email:convite -- "ana@exemplo.com,Ana" bia@exemplo.com
```

Em código: `import { sendInvite } from "./email/enviar.mjs"` e `await sendInvite({ to, name })`, que retorna o id do Resend.
