import { AnimatePresence, motion } from "framer-motion";
import { goBack } from "../state/goBack";
import { ChevronRight, Mic, SendHorizontal, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Squish } from "../components/Squish";
import { brl } from "../data/money";
import { findLesson, unitDef } from "../data/trilha";
import { useIaContext } from "../state/iaContext";
import { useTrilha } from "../state/TrilhaContext";

type Msg = { role: "user" | "ia"; text: string; offline?: boolean; note?: string; go?: { to: string; label: string } };

const DEST: Record<string, { to: string; label: string }> = {
  home: { to: "/home", label: "Início" },
  extrato: { to: "/extrato", label: "Extrato" },
  cofrinho: { to: "/cofrinhos", label: "Cofrinho" },
  missoes: { to: "/academia/missoes", label: "Missões" },
  trilha: { to: "/academia/trilha", label: "Trilha" },
  pontos: { to: "/pra-voce", label: "Pontos e Benefícios" },
  "minhas-vantagens": { to: "/minhas-vantagens", label: "Minhas Vantagens" },
  shop: { to: "/itau-shop", label: "Itaú Shop" },
  pix: { to: "/pix", label: "Pix" },
  "nova-trilha": { to: "/academia/nova-trilha", label: "Montar nova trilha" },
};

const OPEN_WORDS = /\b(abr[ea]|abrir|vai pra|vai para|ir pra|ir para|me leva|mostra|quero ver)\b/i;
const OPEN_KEYS: [RegExp, string][] = [
  [/cofrinho|caixinha/i, "cofrinho"],
  [/miss/i, "missoes"],
  [/extrato/i, "extrato"],
  [/nova trilha|pr[óo]xima trilha|outra trilha/i, "nova-trilha"],
  [/trilha|li[cç][aã]o/i, "trilha"],
  [/minhas vantagens|n[ií]vel/i, "minhas-vantagens"],
  [/shop|loja/i, "shop"],
  [/ponto/i, "pontos"],
  [/pix/i, "pix"],
  [/in[ií]cio|home/i, "home"],
];

const SUGGESTIONS = ["Quanto posso guardar esse mês?", "O que é CDI?", "Como ganho pontos no mês?", "Qual minha próxima lição?", "Quero montar uma nova trilha", "Abre o cofrinho"];

const CANNED: { k: RegExp; a: string }[] = [
  { k: /cdi|render|rendimento|liquidez/i, a: "CDI é a taxa que os bancos usam pra emprestar entre si, e ela anda junto com a Selic. Quando um cofrinho rende 100% do CDI, ele acompanha essa taxa. Liquidez diária quer dizer que você resgata quando quiser." },
  { k: /guardar|cofrinho|poupar|economizar|juntar/i, a: "Começa pequeno e fixo: defina um valor que cabe todo mês e guarde logo que o dinheiro entra, antes de gastar. No cofrinho do seu objetivo o dinheiro continua seu, separado e rendendo." },
  { k: /holerite|bruto|líquido|liquido|salário|salario|inss/i, a: "O holerite mostra o salário bruto e os descontos (INSS, IR, VT, benefícios). O que cai na conta é o líquido. Planeje sempre com o líquido." },
  { k: /crédito|credito|débito|debito|fatura|cartão|cartao/i, a: "No débito o dinheiro sai na hora da sua conta. No crédito você paga depois, na fatura. Pagar a fatura inteira até o vencimento evita juros, que no rotativo são altos." },
  { k: /pix|ted|boleto/i, a: "Pix cai na hora, 24h, usando chave. TED usa agência e conta e cai no mesmo dia útil. Boleto é uma cobrança com código de barras e vencimento." },
  { k: /fgts|13|férias|ferias/i, a: "O 13º é um salário extra no fim do ano, férias vêm com 1/3 a mais e o FGTS é um depósito mensal da empresa numa conta sua na Caixa. Ótimos pra adiantar um objetivo." },
];

export function IaChat() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  const resolve = (dest: string): Msg["go"] => {
    const lesson = dest.match(/^licao-(.+)$/)?.[1];
    if (lesson) {
      const l = findLesson(lesson);
      return l && t.unlocked(l.id) ? { to: `/academia/licao/${l.id}`, label: `Lição: ${l.title}` } : undefined;
    }
    const unit = dest.match(/^desafio-(.+)$/)?.[1];
    if (unit) {
      const u = unitDef(unit);
      return u && t.unitDone(u.id) ? { to: `/academia/desafio/${u.id}`, label: `Desafio: ${u.name}` } : undefined;
    }
    return DEST[dest];
  };

  const context = useIaContext();

  const offline = (q: string): Pick<Msg, "text" | "go"> => {
    if (OPEN_WORDS.test(q)) {
      const hit = OPEN_KEYS.find(([k]) => k.test(q));
      if (hit) return { text: `Abrindo ${DEST[hit[1]].label}.`, go: DEST[hit[1]] };
    }
    if (/saldo|quanto (eu )?tenho/i.test(q)) return { text: `Seu saldo em conta é ${brl(t.balanceCents)}${t.goal ? ` e o cofrinho ${t.goal.name} tem ${brl(t.goal.savedCents)}` : ""}.` };
    if (/próxima|proxima|lição|licao|trilha/i.test(q)) return { text: t.next ? `Sua próxima lição é "${t.next.title}". Leva uns 5 minutos.` : "Você fechou sua trilha! Me conta o que quer aprender agora e eu monto a próxima.", go: t.next ? resolve(`licao-${t.next.id}`) : DEST["nova-trilha"] };
    return { text: CANNED.find((c) => c.k.test(q))?.a ?? "Posso te ajudar com o vocabulário do dinheiro (saldo, fatura, holerite, FGTS, CDI, cofrinho) ou abrir uma tela pra você, tipo \"abre o cofrinho\"." };
  };

  const send = async (q: string) => {
    const clean = q.trim();
    if (!clean || busy) return;
    const next: Msg[] = [...msgs, { role: "user", text: clean }];
    setMsgs(next);
    setText("");
    setBusy(true);
    let reply: Msg;
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, text: tx }) => ({ role, text: tx })), context }),
      });
      const data = (await r.json()) as { text?: string; retryAfter?: number };
      if (r.ok && data.text) {
        const tag = data.text.match(/\[\[abrir:([a-z0-9-]+)\]\]/i);
        reply = { role: "ia", text: data.text.replace(/\[\[abrir:[^\]]*\]\]/gi, "").trim(), go: tag ? resolve(tag[1].toLowerCase()) : undefined };
      } else
        reply = {
          role: "ia",
          ...offline(clean),
          offline: true,
          note: r.status === 429 ? `IA.I com muita procura agora: resposta pronta. Tente de novo em ${data.retryAfter ?? 30}s.` : undefined,
        };
    } catch {
      reply = { role: "ia", ...offline(clean), offline: true };
    }
    setMsgs((m) => [...m, reply]);
    setBusy(false);
    if (reply.go) {
      const go = reply.go;
      setTimeout(() => navigate(go.to, { state: { fromAcademia: true } }), 1400);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-b from-white from-50% to-[#FDE3D3]">
      <div style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="h-3 md:h-5" />
      </div>
      <div className="flex h-[52px] shrink-0 items-center justify-end px-3">
        <Squish aria-label="Fechar" onClick={() => goBack(navigate)} className="flex h-11 w-11 items-center justify-center" scale={0.88}>
          <X size={28} strokeWidth={1.6} color="#222" />
        </Squish>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-4">
        <div className="mt-4 text-center text-[13px] text-[#555]">Hoje</div>
        <Sparkles size={28} color="#FF6200" fill="#FF6200" className="mt-10" />
        <p className="mt-4 text-[18px] leading-snug text-[#333]">Oi, Lucas! O que você precisa fazer hoje?</p>
        <p className="mt-6 text-[18px] leading-snug text-[#333]">Escolha uma opção ou digite aqui.</p>
        {msgs.length === 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Squish key={s} onClick={() => send(s)} className="rounded-full border border-[#FF6200] bg-white px-4 py-2 text-[14px] text-[#FF6200]" scale={0.95}>
                {s}
              </Squish>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={m.role === "user" ? "self-end" : "self-start"}>
                <div className={`max-w-[290px] whitespace-pre-wrap rounded-[18px] px-4 py-3 text-[15px] leading-snug ${m.role === "user" ? "rounded-br-[6px] bg-[#14215A] text-white" : "rounded-bl-[6px] bg-white text-[#333] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"}`}>
                  {m.text.split(/\*\*(.+?)\*\*/g).map((part, j) => (j % 2 ? <strong key={j}>{part}</strong> : part))}
                </div>
                {m.go && (
                  <Squish onClick={() => navigate(m.go!.to, { state: { fromAcademia: true } })} className="mt-2 inline-flex items-center gap-1 rounded-full bg-itau-orange px-3 py-[6px] text-[13px] font-semibold text-white" scale={0.95}>
                    Abrir {m.go.label} <ChevronRight size={14} />
                  </Squish>
                )}
                {m.offline ? <div className="mt-1 text-[11px] text-[#999]">{m.note ?? "Resposta pronta (IA offline no protótipo)"}</div> : m.role === "ia" && <div className="mt-1 text-[11px] text-[#999]">IA.I · Gemini · pode errar, confira informações importantes</div>}
              </motion.div>
            ))}
          </AnimatePresence>
          {busy && (
            <div className="flex gap-1 self-start rounded-[18px] bg-white px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]" aria-label="IA.I digitando">
              {[0, 1, 2].map((d) => (
                <motion.span key={d} className="h-2 w-2 rounded-full bg-[#FF6200]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }} />
              ))}
            </div>
          )}
          <div ref={end} />
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(text);
        }}
        className="shrink-0 px-5 pt-2"
        style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center gap-2 rounded-full bg-white py-2 pl-5 pr-2 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite aqui" aria-label="Mensagem para a IA.I" className="min-w-0 flex-1 bg-transparent py-2 text-[17px] text-[#222] outline-none placeholder:text-[#555]" />
          {text.trim() ? (
            <Squish type="submit" aria-label="Enviar" className="flex h-10 w-10 items-center justify-center rounded-full bg-itau-orange" scale={0.9}>
              <SendHorizontal size={20} color="white" />
            </Squish>
          ) : (
            <Squish aria-label="Falar" off className="flex h-10 w-10 items-center justify-center" scale={0.9}>
              <Mic size={24} color="#333" />
            </Squish>
          )}
        </div>
      </form>
    </div>
  );
}
