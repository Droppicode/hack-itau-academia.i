import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const TEMPLATE = readFileSync(new URL("./convite.html", import.meta.url), "utf8");
const DEFAULT_FROM = "AcademIA.I (protótipo) <itau@kgmats.cc>";
const SUBJECT = "Seu primeiro salário com um objetivo 🧡 Conheça a AcademIA.I";
const EMAIL_RE = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function renderInvite(name) {
  const saudacao = name ? `Oi, ${escapeHtml(name)}!` : "Oi!";
  return TEMPLATE.replace("{{saudacao}}", saudacao);
}

export async function sendInvite({ to, name, from = process.env.EMAIL_FROM || DEFAULT_FROM, apiKey = process.env.RESEND_API_KEY }) {
  if (!apiKey) throw new Error("RESEND_API_KEY não definida");
  if (!EMAIL_RE.test(to)) throw new Error(`e-mail inválido: ${to}`);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: SUBJECT, html: renderInvite(name) }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${body.message ?? res.statusText}`);
  return body.id;
}

export function parseRecipients(text) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !/^nome\s*[,;]/i.test(l))
    .map((l) => {
      const parts = l.split(/[,;]/).map((p) => p.trim());
      const email = parts.find((p) => EMAIL_RE.test(p));
      const name = parts.find((p) => p && p !== email);
      return { email: email ?? l, name };
    });
}

async function main(argv) {
  const dryRun = argv.includes("--dry-run");
  const args = argv.filter((a) => a !== "--dry-run");
  if (!args.length) {
    console.log("Uso: npm run email:convite -- [--dry-run] <lista.csv | email[,nome] ...>\nCSV: uma pessoa por linha, \"nome,email\" ou só \"email\".");
    process.exit(1);
  }
  const recipients = args.flatMap((a) => (a.includes("@") ? parseRecipients(a) : parseRecipients(readFileSync(a, "utf8"))));
  let failed = 0;
  for (const [i, r] of recipients.entries()) {
    if (i) await new Promise((ok) => setTimeout(ok, 600));
    if (dryRun) {
      console.log(`[dry-run] ${r.email} (${r.name ?? "sem nome"})`);
      continue;
    }
    try {
      console.log(`ok   ${r.email} ${await sendInvite({ to: r.email, name: r.name })}`);
    } catch (e) {
      failed++;
      console.log(`erro ${r.email} ${e.message}`);
    }
  }
  if (!dryRun) console.log(`${recipients.length - failed}/${recipients.length} aceitos pelo Resend`);
  if (failed) process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
