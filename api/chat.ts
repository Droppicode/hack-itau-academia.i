

export type ChatMsg = { role: "user" | "ia"; text: string };
export type ChatBody = { messages?: ChatMsg[]; context?: string };
type Result = { status: number; json: { text?: string; error?: string } };

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
