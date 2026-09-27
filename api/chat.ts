

export type ChatMsg = { role: "user" | "ia"; text: string };
export type ChatBody = { messages?: ChatMsg[]; context?: string };
type Result = { status: number; json: { text?: string; error?: string } };

const SYSTEM = `Você é a IA.I, assistente de IA do app Itaú, conversando com um cliente jovem (18 a 24 anos) dentro da academIA.I, a trilha de educação financeira do app.
Regras:
- Responda em português do Brasil, tom leve e direto, sem juridiquês. No máximo 3 parágrafos curtos ou uma lista curta.
- Explique conceitos de dinheiro do dia a dia (conta, saldo, extrato, Pix, TED, boleto, débito, crédito, fatura, holerite, CLT, estágio, PJ, VR/VA/VT, 13º, férias, FGTS, cofrinho, CDI, liquidez, orçamento).
- Nunca ofereça crédito, empréstimo, aumento de limite ou produtos de dívida como solução ou recompensa.
- Não peça nem use dados sensíveis (CPF, senha, número de cartão). Se o cliente mandar, oriente a não compartilhar.
- Você não movimenta dinheiro nem acessa conta real: isto é um protótipo. Se pedirem transação, explique onde fazer no app.
- Não prometa rentabilidade. 105% do CDI é uma condição simulada da missão do mês, a confirmar com o produto.
- Quando fizer sentido, sugira a próxima lição da trilha, o cofrinho do objetivo ou as missões.`;

const FALLBACK_MODELS = ["gemini-3.8-flash", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"];

export async function chat(body: ChatBody, key: string | undefined, model = "gemini-flash-latest"): Promise<Result> {
  if (!key) return { status: 503, json: { error: "no_key" } };
  const contents = (body.messages ?? [])
    .slice(-12)
    .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: String(m.text).slice(0, 2000) }] }));
  if (!contents.length || contents[contents.length - 1].role !== "user") return { status: 400, json: { error: "bad_request" } };
  const payload = JSON.stringify({
    systemInstruction: { parts: [{ text: `${SYSTEM}\n\nContexto do cliente (simulado): ${String(body.context ?? "").slice(0, 1500)}` }] },
    contents,
    generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
  });
  let last = "upstream_error";
  for (const m of [model, ...FALLBACK_MODELS.filter((f) => f !== model)]) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: payload,
    });
    const data = (await r.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[]; error?: { message?: string } };
    if (!r.ok) {
      last = data.error?.message ?? last;
      if (r.status === 429 || r.status >= 500 || r.status === 404) continue;
      return { status: 502, json: { error: last } };
    }
    const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
    if (text) return { status: 200, json: { text } };
    last = "empty";
  }
  return { status: 502, json: { error: last } };
}

type Req = { method?: string; body?: ChatBody };
type Res = { status: (n: number) => { json: (b: unknown) => void } };

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  try {
    const out = await chat(req.body ?? {}, process.env.GEMINI_API_KEY, process.env.GEMINI_MODEL || undefined);
    res.status(out.status).json(out.json);
  } catch {
    res.status(500).json({ error: "internal" });
  }
}
