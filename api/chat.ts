

export type ChatMsg = { role: "user" | "ia"; text: string };
export type ChatBody = { messages?: ChatMsg[]; context?: string };
type Result = { status: number; json: { text?: string; error?: string; retryAfter?: number } };

const SYSTEM = `Você é a IA.I, a assistente de IA dentro do app do Itaú (protótipo). Você conversa com o Lucas, cliente jovem (18 a 24 anos), na tela de chat do app, e conhece a conta dele pelo contexto abaixo.

Quem você é
- Assistente do banco: tom leve, direto e acolhedor, sem juridiquês e sem sermão. Português do Brasil, frases curtas, no máximo 3 parágrafos curtos ou uma lista curta. Pode usar **negrito** com moderação.
- Use os dados do contexto (saldo, extrato, cofrinho, objetivo, trilha, missões, pontos) para personalizar a resposta, citando valores e datas quando ajudar. Nunca invente lançamentos, valores ou produtos que não estejam no contexto.
- Você ajuda com: explicar conceitos das lições da academIA.I (conta, saldo, extrato, Pix, TED, boleto, débito, crédito, fatura, holerite, CLT, estágio, PJ, VR/VA/VT, 13º, férias, FGTS, cofrinho, CDI, liquidez, orçamento), tirar dúvidas sobre a conta e sugerir próximos passos na trilha, no cofrinho e nas missões.

Regras da academIA.I (use exatamente estas)
- Cofrinho rende 100% do CDI, liquidez diária, o dinheiro continua do cliente e pode ser resgatado quando quiser.
- Missões da semana: 30 Pontos Itaú cada (2 lições na semana; ler 1 aprofundamento).
- Missão do mês: 1 Ponto Itaú a cada R$ 20 que ficam no cofrinho o mês inteiro (vale o menor saldo do mês), a partir de R$ 50, até 50 pontos. Depositar e tirar não dá pontos.
- Desafio de fim de unidade: 7+ acertos em 10 = 20 pts por acerto, vale só o melhor resultado.
- Pontos Itaú não viram dinheiro sacável. Referência: 1.000 pts ≈ R$ 20 de desconto na fatura.

Limites
- Nunca ofereça crédito, empréstimo, aumento de limite, parcelamento ou produtos de dívida como solução ou recompensa.
- Não peça nem aceite dados sensíveis (senha, CPF completo, número de cartão, token). Se o cliente mandar, oriente a não compartilhar.
- Você não movimenta dinheiro. Se pedirem Pix, depósito ou resgate, explique e ofereça abrir a tela certa.
- Não prometa rentabilidade além do que está no contexto; tudo é simulado no protótipo.

Abrir telas
- Quando o cliente pedir para abrir/ir para uma tela, ou quando for claramente útil, termine a resposta com UMA tag exatamente no formato [[abrir:DESTINO]], em linha própria. Destinos válidos: home, extrato, cofrinho, missoes, trilha, pontos, minhas-vantagens, shop, pix, chat-fechar, licao-L1 … licao-L10 (só lições liberadas no contexto), desafio-1 (só se a Unidade 1 estiver concluída).
- Na frase antes da tag, diga que está abrindo (ex.: "Abrindo o seu cofrinho."). Nunca use a tag para destinos fora da lista.`;

type ModelQuota = { id: string; rpm: number; rpd: number };

// Free-tier quotas of the AI Studio project, minus a safety margin. Lite first: it has 3x the RPM and 25x the RPD.
const MODELS: ModelQuota[] = [
  { id: "gemini-3.5-flash-lite", rpm: 14, rpd: 480 },
  { id: "gemini-3.8-flash", rpm: 4, rpd: 18 },
];
const MAX_IN_FLIGHT = 4;
const MAX_QUEUE = 25;
const MAX_WAIT_MS = 7000;
const CLIENT_RPM = 5;
const CLIENT_RPD = 40;

type Usage = { minute: number[]; day: string; dayCount: number; coolUntil: number };
const usage = new Map<string, Usage>();
const clients = new Map<string, Usage>();
let inFlight = 0;
let queued = 0;

const ptDay = () => new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function slot(map: Map<string, Usage>, k: string): Usage {
  const now = Date.now();
  const today = ptDay();
  const u = map.get(k) ?? { minute: [], day: today, dayCount: 0, coolUntil: 0 };
  u.minute = u.minute.filter((t) => now - t < 60_000);
  if (u.day !== today) [u.day, u.dayCount] = [today, 0];
  map.set(k, u);
  return u;
}
const take = (u: Usage) => {
  u.minute.push(Date.now());
  u.dayCount++;
};
const waitSec = (u: Usage) => Math.max(1, Math.ceil((60_000 - (Date.now() - (u.minute[0] ?? Date.now()))) / 1000));

function pickModel(): ModelQuota | undefined {
  const now = Date.now();
  return MODELS.find((m) => {
    const u = slot(usage, m.id);
    return u.coolUntil <= now && u.minute.length < m.rpm && u.dayCount < m.rpd;
  });
}

function checkClient(clientId: string): Result | undefined {
  if (clients.size > 5000) clients.clear();
  const u = slot(clients, clientId);
  if (u.dayCount >= CLIENT_RPD) return { status: 429, json: { error: "client_daily_limit", retryAfter: 3600 } };
  if (u.minute.length >= CLIENT_RPM) return { status: 429, json: { error: "client_rate_limit", retryAfter: waitSec(u) } };
  take(u);
}

async function acquire(): Promise<ModelQuota | undefined> {
  if (queued >= MAX_QUEUE) return;
  queued++;
  try {
    const deadline = Date.now() + MAX_WAIT_MS;
    while (Date.now() < deadline) {
      const m = inFlight < MAX_IN_FLIGHT ? pickModel() : undefined;
      if (m) {
        inFlight++;
        take(slot(usage, m.id));
        return m;
      }
      await sleep(300);
    }
  } finally {
    queued--;
  }
}

export async function chat(body: ChatBody, key: string | undefined, clientId = "local"): Promise<Result> {
  if (!key) return { status: 503, json: { error: "no_key" } };
  const contents = (body.messages ?? [])
    .slice(-8)
    .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: String(m.text).slice(0, 1000) }] }));
  if (!contents.length || contents[contents.length - 1].role !== "user") return { status: 400, json: { error: "bad_request" } };
  const limited = checkClient(clientId);
  if (limited) return limited;
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: `${SYSTEM}\n\nContexto do cliente (simulado): ${String(body.context ?? "").slice(0, 2500)}` }] },
    contents,
    generationConfig: { temperature: 0.6, maxOutputTokens: 700 },
  });
  let last = "busy";
  for (let attempt = 0; attempt < MODELS.length; attempt++) {
    const m = await acquire();
    if (!m) break;
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m.id}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: payload,
        signal: AbortSignal.timeout(20_000),
      });
      const data = (await r.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[]; error?: { message?: string } };
      if (!r.ok) {
        last = data.error?.message ?? "upstream_error";
        if (r.status === 429 || r.status >= 500 || r.status === 404) {
          slot(usage, m.id).coolUntil = Date.now() + (r.status === 429 ? 60_000 : 15_000);
          continue;
        }
        return { status: 502, json: { error: last } };
      }
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
      if (text) return { status: 200, json: { text } };
      last = "empty";
    } catch {
      last = "timeout";
    } finally {
      inFlight--;
    }
  }
  return { status: 429, json: { error: last, retryAfter: 30 } };
}

type Req = { method?: string; body?: ChatBody; headers?: Record<string, string | string[] | undefined> };
type Res = { status: (n: number) => { json: (b: unknown) => void } };

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  try {
    const fwd = req.headers?.["x-forwarded-for"];
    const ip = (Array.isArray(fwd) ? fwd[0] : fwd)?.split(",")[0].trim() || "anon";
    const out = await chat(req.body ?? {}, process.env.GEMINI_API_KEY, ip);
    res.status(out.status).json(out.json);
  } catch {
    res.status(500).json({ error: "internal" });
  }
}
