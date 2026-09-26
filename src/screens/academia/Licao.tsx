import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  Check,
  CreditCard,
  Flag,
  Gauge,
  PiggyBank,
  Receipt,
  ShieldAlert,
  Shuffle,
  Sprout,
  TrendingDown,
  TrendingUp,
  Umbrella,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IaiAvatar, ProgressBar } from "../../components/Iai";
import { Footer, PrimaryButton } from "../../components/PrimaryButton";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { Toggle } from "../../components/Toggle";
import { brl, compound, inss, monthsTo, SIM } from "../../data/money";
import { GOALS, LESSONS, REWARDS, type GoalId, type LessonId } from "../../data/trilha";
import { deltaToHome } from "../../state/homeHistory";
import { useTrilha } from "../../state/TrilhaContext";

type T = ReturnType<typeof useTrilha>;
type Card = { icon: LucideIcon; title: string; body: ReactNode };
type Content = { cards: [Card, Card]; tip: string };

const CONTENT: Record<LessonId, Content> = {
  L1: {
    cards: [
      { icon: Receipt, title: "O combinado não é o que cai", body: "Salário bruto é o valor do contrato. Líquido é o que cai na conta depois dos descontos." },
      { icon: Calculator, title: "Quem leva um pedaço", body: "INSS (sua aposentadoria), às vezes vale-transporte (até 6%) e, em salários maiores, Imposto de Renda." },
    ],
    tip: "Na hora de negociar um trampo, pergunta sempre: esse valor é bruto ou líquido?",
  },
  L2: {
    cards: [
      { icon: Shuffle, title: "Três caixinhas", body: "50% pro que é essencial (casa, transporte, comida), 30% pro que é seu (rolê, roupa, streaming) e 20% pro futuro." },
      { icon: Flag, title: "É ponto de partida, não lei", body: "Se hoje não fecha, tudo bem. Começa com 5% pro futuro e vai subindo." },
    ],
    tip: "Guardar primeiro, gastar depois: separa os 20% no dia que o dinheiro cai.",
  },
  L3: {
    cards: [
      { icon: Receipt, title: "Fixo: já tem dono", body: "Vem todo mês, quase igual: aluguel, plano de celular, assinaturas, faculdade." },
      { icon: Wallet, title: "Variável: decisão sua", body: "Muda mês a mês: delivery, rolê, roupa. É aqui que dá pra mexer rápido." },
    ],
    tip: "Revisa as assinaturas a cada 3 meses. Quase todo mundo paga uma que nem usa.",
  },
  L4: {
    cards: [
      { icon: Umbrella, title: "Reserva não é pra comprar nada", body: "É pra quando o celular quebra, o salário atrasa ou você perde o trampo. É paz." },
      { icon: PiggyBank, title: "Quanto guardar", body: "Meta clássica: de 3 a 6 meses dos seus gastos. E em lugar que você tira no mesmo dia." },
    ],
    tip: "Reserva primeiro, investimento arriscado depois. Sempre nessa ordem.",
  },
  L5: {
    cards: [
      { icon: Flag, title: "Sonho com data vira plano", body: "Objetivo bom tem três coisas: quanto custa, quando você quer e quanto guarda por mês." },
      { icon: TrendingUp, title: "Mexe em uma, muda tudo", body: "Guardar um pouco mais por mês encurta muito o prazo. Testa aí." },
    ],
    tip: "Dá um nome pro objetivo. Pote com nome é muito mais difícil de gastar.",
  },
  L6: {
    cards: [
      { icon: Sprout, title: "Juros sobre juros", body: "Seu dinheiro rende, e o rendimento também passa a render. No começo é pouco. Com tempo, vira bola de neve." },
      { icon: BarChart3, title: "O ingrediente secreto é o tempo", body: "Quem começa aos 18 com pouco muitas vezes termina com mais do que quem começa aos 30 com muito." },
    ],
    tip: "Automático vence força de vontade: agenda o valor pra sair no dia do salário.",
  },
  L7: {
    cards: [
      { icon: Wallet, title: "Pix e débito: dinheiro que já é seu", body: "Sai na hora da conta. Sem juros, sem fatura. Ótimo pro dia a dia." },
      { icon: CreditCard, title: "Crédito: dinheiro que vai ser seu", body: "Você paga depois, na fatura. Bom pra parcelar sem juros e ter proteção em compra online — se pagar a fatura inteira." },
    ],
    tip: "Crédito não é renda extra. Se não cabe no débito, provavelmente não cabe na fatura.",
  },
  L8: {
    cards: [
      { icon: AlertTriangle, title: "O botão perigoso da fatura", body: "Pagar só o mínimo joga o resto pro rotativo — um dos juros mais caros do Brasil." },
      { icon: TrendingDown, title: "Se apertou, negocia", body: "Parcelar a fatura costuma sair mais barato que ficar no rotativo. E corta o cartão até sair." },
    ],
    tip: "Coloca alerta 3 dias antes do vencimento. Juros por esquecimento é o pior tipo.",
  },
  L9: {
    cards: [
      { icon: Gauge, title: "Score é reputação", body: "De 0 a 1000, mostra pro mercado se você costuma pagar em dia. Influencia aluguel, cartão e financiamento." },
      { icon: Check, title: "O que ajuda de verdade", body: "Pagar em dia, manter cadastro atualizado e ter o Cadastro Positivo ativo. Não tem atalho pago." },
    ],
    tip: "Ninguém vende aumento de score. Se alguém cobrar pra 'limpar seu nome', é golpe.",
  },
  L10: {
    cards: [
      { icon: ShieldAlert, title: "Golpe tem roteiro", body: "Urgência, emoção e segredo: 'é seu primo, troquei de número, manda R$ 500 agora'." },
      { icon: Check, title: "Antes de mandar, para", body: "Liga pro número antigo, confere o nome do recebedor na tela do Pix e desconfia de 'central do banco' no WhatsApp." },
    ],
    tip: "Banco nunca pede senha, código ou pra você fazer Pix de 'teste'. Nunca.",
  },
  L11: {
    cards: [
      { icon: TrendingDown, title: "Tudo fica mais caro", body: "Inflação é o aumento geral dos preços. O lanche de R$ 30 hoje custa mais ano que vem." },
      { icon: Wallet, title: "Parado, seu dinheiro encolhe", body: "R$ 100 debaixo do colchão continuam R$ 100 — mas compram cada vez menos." },
    ],
    tip: "Pra não perder, seu dinheiro precisa render pelo menos a inflação.",
  },
  L12: {
    cards: [
      { icon: PiggyBank, title: "Três portas de entrada", body: "Poupança (simples, rende menos), CDB com liquidez diária e Tesouro Selic (rendem mais e dá pra tirar rápido)." },
      { icon: ShieldAlert, title: "Rendimento, risco e liquidez", body: "Pergunta sempre: quanto rende, qual o risco e em quanto tempo consigo tirar. Promessa de muito rendimento sem risco = golpe." },
    ],
    tip: "Comece pequeno, com R$ 20. O mais importante é o hábito, não o valor.",
  },
};

function Chips<V extends string | number>({ values, value, onChange, fmt }: { values: readonly V[]; value: V; onChange: (v: V) => void; fmt: (v: V) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((v) => (
        <Squish
          key={String(v)}
          onClick={() => onChange(v)}
          className={`rounded-full border-[1.5px] px-4 py-[8px] text-[15px] font-semibold ${
            v === value ? "border-itau-orange bg-[#FFF1E5] text-itau-orange" : "border-[#CFCFCF] text-[#444]"
          }`}
          scale={0.93}
        >
          {fmt(v)}
        </Squish>
      ))}
    </div>
  );
}

function Box({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[16px] bg-itau-chip p-4 ${className}`}>{children}</div>;
}

function Slider({ label, value, min, max, step, onChange, fmt }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; fmt: (v: number) => string }) {
  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between">
        <span className="text-[14px] text-[#666]">{label}</span>
        <span className="text-[20px] font-bold text-itau-orange">{fmt(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} className="mt-1 w-full accent-[#FF6200]" />
    </div>
  );
}

function Title({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <>
      <h2 className="text-[22px] font-bold leading-tight text-black">{children}</h2>
      {sub && <p className="mt-1 text-[14px] text-[#666]">{sub}</p>}
    </>
  );
}

type Choice = { q: string; options: string[]; right: number; why: string };

function ChoiceGame({ items, finish, label }: { items: Choice[]; finish: () => void; label: string }) {
  const [answers, setAnswers] = useState<(number | undefined)[]>(items.map(() => undefined));
  const all = answers.every((a) => a !== undefined);
  return (
    <>
      <div className="mt-2 flex flex-col gap-5">
        {items.map((it, i) => {
          const a = answers[i];
          return (
            <div key={it.q}>
              <div className="text-[16px] font-semibold text-[#333]">{it.q}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {it.options.map((o, j) => {
                  const picked = a === j;
                  const tone = a === undefined ? "border-[#CFCFCF] text-[#444]" : j === it.right ? "border-[#1B7F3B] bg-[#E8F5EC] text-[#1B7F3B]" : picked ? "border-[#C8102E] bg-[#FDECEE] text-[#C8102E]" : "border-[#E3E3E3] text-[#AAA]";
                  return (
                    <Squish
                      key={o}
                      onClick={() => a === undefined && setAnswers(answers.map((x, k) => (k === i ? j : x)))}
                      className={`rounded-full border-[1.5px] px-4 py-[8px] text-[15px] font-semibold ${tone}`}
                      scale={0.93}
                    >
                      {o}
                    </Squish>
                  );
                })}
              </div>
              <AnimatePresence>
                {a !== undefined && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 overflow-hidden text-[14px] leading-snug text-[#555]">
                    <b className={a === it.right ? "text-[#1B7F3B]" : "text-[#C8102E]"}>{a === it.right ? "Isso. " : "Quase. "}</b>
                    {it.why}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <PrimaryButton label={all ? label : "Responde as situações acima"} disabled={!all} onClick={finish} />
      </div>
    </>
  );
}

type P = { t: T; finish: () => void };

function PL1({ finish }: P) {
  const [gross, setGross] = useState(180000);
  const [vt, setVt] = useState(true);
  const tax = inss(gross);
  const vtCents = vt ? Math.round(gross * 0.06) : 0;
  const net = gross - tax - vtCents;
  return (
    <>
      <Title sub="Valores de exemplo. Mexe no seu.">Simula seu holerite</Title>
      <Box className="mt-4">
        <Slider label="Salário bruto" value={gross} min={80000} max={500000} step={5000} onChange={setGross} fmt={(v) => brl(v, false)} />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[15px] text-[#444]">Usa vale-transporte</span>
          <Toggle on={vt} onChange={setVt} label="Vale-transporte" />
        </div>
        <div className="mt-4 flex flex-col gap-1 text-[15px] text-[#444]">
          <div className="flex justify-between"><span>INSS</span><span>- {brl(tax)}</span></div>
          {vt && <div className="flex justify-between"><span>Vale-transporte (6%)</span><span>- {brl(vtCents)}</span></div>}
          <div className="mt-2 flex justify-between border-t border-[#DDD] pt-2 text-[18px] font-bold text-black"><span>Cai na conta</span><span>{brl(net)}</span></div>
        </div>
      </Box>
      <p className="mt-3 text-[12px] text-[#888]">Cálculo simplificado da tabela progressiva do INSS. IR não incluso.</p>
      <div className="mt-5"><PrimaryButton label="Entendi a diferença" onClick={finish} /></div>
    </>
  );
}

function PL2({ finish }: P) {
  const [income, setIncome] = useState(150000);
  const parts = [
    { label: "Essencial", pct: 50, color: "bg-itau-navy" },
    { label: "Seu", pct: 30, color: "bg-[#FF9A3D]" },
    { label: "Futuro", pct: 20, color: "bg-itau-orange" },
  ];
  return (
    <>
      <Title sub="Arrasta pra ver como fica com a sua renda.">Divide o seu mês</Title>
      <Box className="mt-4">
        <Slider label="Quanto entra por mês" value={income} min={50000} max={500000} step={5000} onChange={setIncome} fmt={(v) => brl(v, false)} />
        <div className="mt-4 flex h-[14px] overflow-hidden rounded-full">
          {parts.map((p) => <div key={p.label} className={p.color} style={{ width: `${p.pct}%` }} />)}
        </div>
        <div className="mt-3 flex flex-col gap-2">
          {parts.map((p) => (
            <div key={p.label} className="flex items-center gap-2 text-[15px]">
              <span className={`h-3 w-3 rounded-full ${p.color}`} />
              <span className="flex-1 text-[#444]">{p.label} · {p.pct}%</span>
              <motion.b key={income} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-black">{brl((income * p.pct) / 100, false)}</motion.b>
            </div>
          ))}
        </div>
      </Box>
      <div className="mt-5"><PrimaryButton label="Faz sentido" onClick={finish} /></div>
    </>
  );
}

const GASTOS = [
  { label: "Aluguel", fixed: true },
  { label: "Delivery", fixed: false },
  { label: "Plano de celular", fixed: true },
  { label: "Roupa", fixed: false },
  { label: "Streaming", fixed: true },
  { label: "Rolê de sexta", fixed: false },
];

function PL3({ finish }: P) {
  const [picks, setPicks] = useState<Record<string, boolean>>({});
  const all = GASTOS.every((g) => picks[g.label] !== undefined);
  const right = GASTOS.filter((g) => picks[g.label] === g.fixed).length;
  return (
    <>
      <Title sub="Toca em Fixo ou Variável pra cada um.">Separa esses gastos</Title>
      <div className="mt-4 flex flex-col gap-2">
        {GASTOS.map((g) => {
          const p = picks[g.label];
          return (
            <div key={g.label} className="flex items-center gap-2 rounded-[14px] bg-itau-chip px-4 py-3">
              <span className="flex-1 text-[16px] text-[#333]">{g.label}</span>
              {(["Fixo", "Variável"] as const).map((o) => {
                const val = o === "Fixo";
                const picked = p === val;
                const tone = p === undefined ? "border-[#CFCFCF] text-[#444]" : picked ? (val === g.fixed ? "border-[#1B7F3B] bg-[#E8F5EC] text-[#1B7F3B]" : "border-[#C8102E] bg-[#FDECEE] text-[#C8102E]") : "border-[#E3E3E3] text-[#AAA]";
                return (
                  <Squish key={o} onClick={() => p === undefined && setPicks({ ...picks, [g.label]: val })} className={`rounded-full border-[1.5px] px-3 py-[5px] text-[14px] font-semibold ${tone}`} scale={0.92}>
                    {o}
                  </Squish>
                );
              })}
            </div>
          );
        })}
      </div>
      {all && <p className="mt-3 text-[15px] text-[#444]">Você acertou <b>{right} de {GASTOS.length}</b>. Streaming engana: é fixo até você cancelar.</p>}
      <div className="mt-5"><PrimaryButton label={all ? "Bora" : "Separa todos"} disabled={!all} onClick={finish} /></div>
    </>
  );
}

function PL4({ finish }: P) {
  const [spend, setSpend] = useState(120000);
  const [months, setMonths] = useState(3);
  const [save, setSave] = useState(15000);
  const target = spend * months;
  return (
    <>
      <Title sub="Coloca um valor aproximado. Ninguém tá olhando.">Calcula a sua reserva</Title>
      <Box className="mt-4">
        <Slider label="Seus gastos por mês" value={spend} min={30000} max={500000} step={5000} onChange={setSpend} fmt={(v) => brl(v, false)} />
        <div className="mt-3 text-[14px] text-[#666]">Quantos meses de segurança?</div>
        <div className="mt-2"><Chips values={[3, 6] as const} value={months as 3 | 6} onChange={setMonths} fmt={(v) => `${v} meses`} /></div>
        <div className="mt-4 text-[14px] text-[#666]">Sua reserva ideal</div>
        <div className="text-[26px] font-bold text-black">{brl(target, false)}</div>
        <Slider label="Guardando por mês" value={save} min={2000} max={50000} step={1000} onChange={setSave} fmt={(v) => brl(v, false)} />
        <div className="mt-2 text-[16px] text-[#333]">Chega lá em <b>{monthsTo(target, save)} meses</b></div>
      </Box>
      <div className="mt-5"><PrimaryButton label="Anotado" onClick={finish} /></div>
    </>
  );
}

function PL5({ t, finish }: P) {
  const [goalId, setGoalId] = useState<GoalId>(t.goal?.id ?? t.diag.goal ?? "celular");
  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const [monthly, setMonthly] = useState(t.goal?.monthlyCents ?? 15000);
  const [guarda, setGuarda] = useState(true);
  const months = monthsTo(goal.cents, monthly);
  return (
    <>
      <Title>Monta um objetivo</Title>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
        {GOALS.map((g) => (
          <Squish
            key={g.id}
            onClick={() => setGoalId(g.id)}
            className={`shrink-0 rounded-full border-[1.5px] px-4 py-[8px] text-[15px] font-semibold ${g.id === goalId ? "border-itau-orange bg-[#FFF1E5] text-itau-orange" : "border-[#CFCFCF] text-[#444]"}`}
            scale={0.93}
          >
            {g.label}
          </Squish>
        ))}
      </div>
      <Box className="mt-4">
        <div className="text-[14px] text-[#666]">Custa em média</div>
        <div className="text-[24px] font-bold text-black">{brl(goal.cents, false)}</div>
        <Slider label="Por mês" value={monthly} min={3000} max={40000} step={1000} onChange={setMonthly} fmt={(v) => brl(v, false)} />
        <motion.div key={months} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-2 text-[17px] text-[#333]">
          Chega lá em <b>{months} meses</b>
        </motion.div>
      </Box>
      <Box className="mt-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[15px] font-semibold text-[#333]">Guardar num Cofrinho Itaú</div>
          <div className="text-[13px] text-[#666]">Separa {brl(monthly, false)} no dia que o salário cair. Pausa quando quiser.</div>
        </div>
        <Toggle on={guarda} onChange={setGuarda} label="Guardar no Itaú" />
      </Box>
      <div className="mt-5">
        <PrimaryButton
          label="Salvar objetivo"
          onClick={() => {
            t.set({ goal: { id: goal.id, name: goal.label, targetCents: goal.cents, monthlyCents: monthly }, guardaItau: guarda });
            finish();
          }}
        />
      </div>
    </>
  );
}

function PL6({ finish }: P) {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(10);
  const points = [1, 2, 3, 4, 5].map((k) => Math.round((years * k) / 5));
  const max = compound(monthly, years * 12, SIM.cdiYear);
  return (
    <>
      <Title sub={`Rendendo ${SIM.cdiYear * 100}% ao ano (simulado, antes de IR).`}>Vê o tempo trabalhar</Title>
      <Box className="mt-4">
        <Slider label="Guardando por mês" value={monthly} min={2000} max={50000} step={1000} onChange={setMonthly} fmt={(v) => brl(v, false)} />
        <Slider label="Por quantos anos" value={years} min={1} max={30} step={1} onChange={setYears} fmt={(v) => `${v} ${v === 1 ? "ano" : "anos"}`} />
        <div className="mt-4 flex h-[130px] items-end gap-2">
          {points.map((y, i) => {
            const total = compound(monthly, y * 12, SIM.cdiYear);
            const put = monthly * y * 12;
            return (
              <div key={i} className="flex flex-1 flex-col items-center">
                <div className="relative w-full overflow-hidden rounded-t-[6px] bg-itau-orange" style={{ height: `${(total / max) * 110}px` }}>
                  <div className="absolute bottom-0 w-full bg-itau-navy" style={{ height: `${(put / total) * 100}%` }} />
                </div>
                <span className="mt-1 text-[11px] text-[#777]">{y}a</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex gap-4 text-[13px] text-[#555]">
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-itau-navy" /> Você guardou</span>
          <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-itau-orange" /> Juros</span>
        </div>
        <div className="mt-3 text-[16px] text-[#333]">
          Você guarda <b>{brl(monthly * years * 12, false)}</b> e termina com <b>{brl(max, false)}</b>.
        </div>
      </Box>
      <div className="mt-5"><PrimaryButton label="Mind blown" onClick={finish} /></div>
    </>
  );
}

function PL7({ finish }: P) {
  return (
    <>
      <Title sub="Não tem nota. Só feedback.">O que você usaria?</Title>
      <ChoiceGame
        finish={finish}
        label="Fechou"
        items={[
          { q: "Dividir a pizza com os amigos", options: ["Pix", "Débito", "Crédito"], right: 0, why: "Pix é instantâneo e sem taxa entre pessoas." },
          { q: "Notebook de R$ 3.000 em 10x sem juros", options: ["Pix", "Débito", "Crédito"], right: 2, why: "Parcelado sem juros no crédito é ok — se as parcelas cabem no seu mês." },
          { q: "Mercado da semana", options: ["Pix", "Débito", "Crédito"], right: 1, why: "Débito sai na hora e ajuda a não gastar o que você ainda não tem." },
        ]}
      />
    </>
  );
}

function PL8({ finish }: P) {
  const [bill, setBill] = useState(30000);
  const [months, setMonths] = useState(6);
  const debt = Math.round(bill * Math.pow(1 + SIM.rotativoMonth, months));
  return (
    <>
      <Title sub={`Rotativo simulado a ${SIM.rotativoMonth * 100}% ao mês.`}>E se pagar só o mínimo?</Title>
      <Box className="mt-4">
        <Slider label="Valor que ficou pra trás" value={bill} min={5000} max={200000} step={5000} onChange={setBill} fmt={(v) => brl(v, false)} />
        <Slider label="Meses no rotativo" value={months} min={1} max={12} step={1} onChange={setMonths} fmt={(v) => `${v} ${v === 1 ? "mês" : "meses"}`} />
        <div className="mt-4 text-[14px] text-[#666]">Vira</div>
        <motion.div key={debt} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-[32px] font-bold text-[#C8102E]">{brl(debt, false)}</motion.div>
        <div className="text-[14px] text-[#555]">{(debt / bill).toFixed(1).replace(".", ",")}× o valor original</div>
      </Box>
      <div className="mt-5"><PrimaryButton label="Tô fora do rotativo" onClick={finish} /></div>
    </>
  );
}

function PL9({ finish }: P) {
  return (
    <>
      <Title>Mito ou verdade?</Title>
      <ChoiceGame
        finish={finish}
        label="Fechou"
        items={[
          { q: "Consultar o próprio score derruba ele", options: ["Mito", "Verdade"], right: 0, why: "Consultar o seu score é de graça e não afeta nada." },
          { q: "Pagar conta em dia ajuda o score", options: ["Mito", "Verdade"], right: 1, why: "Com o Cadastro Positivo, pagar em dia é o que mais pesa." },
          { q: "Dá pra pagar alguém pra aumentar o score", options: ["Mito", "Verdade"], right: 0, why: "Não existe. Quem vende isso tá aplicando golpe." },
        ]}
      />
    </>
  );
}

function PL10({ finish }: P) {
  return (
    <>
      <Title sub="Qual dessas é golpe?">Fareja o golpe</Title>
      <ChoiceGame
        finish={finish}
        label="Tô ligado"
        items={[
          { q: "“Oi, troquei de número. Me manda R$ 500 agora, depois explico”", options: ["Golpe", "Normal"], right: 0, why: "Urgência + número novo + segredo. Liga pro número antigo antes." },
          { q: "“Central Itaú: passa o código que chegou por SMS pra cancelar a compra”", options: ["Golpe", "Normal"], right: 0, why: "O banco nunca pede código, senha ou token." },
          { q: "Amigo manda QR Code do racha do Uber, nome dele aparece no Pix", options: ["Golpe", "Normal"], right: 1, why: "Conferir o nome do recebedor na tela é justamente o que protege você." },
        ]}
      />
    </>
  );
}

function PL11({ finish }: P) {
  const [value, setValue] = useState(100000);
  const [years, setYears] = useState(5);
  const real = Math.round(value / Math.pow(1 + SIM.inflationYear, years));
  return (
    <>
      <Title sub={`Inflação simulada de ${SIM.inflationYear * 100}% ao ano.`}>Quanto seu dinheiro compra depois?</Title>
      <Box className="mt-4">
        <Slider label="Dinheiro parado" value={value} min={10000} max={500000} step={10000} onChange={setValue} fmt={(v) => brl(v, false)} />
        <Slider label="Daqui a" value={years} min={1} max={20} step={1} onChange={setYears} fmt={(v) => `${v} ${v === 1 ? "ano" : "anos"}`} />
        <div className="mt-4 text-[14px] text-[#666]">Vai comprar o mesmo que hoje comprariam</div>
        <motion.div key={real} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-[30px] font-bold text-black">{brl(real, false)}</motion.div>
        <ProgressBar pct={(real / value) * 100} className="mt-2" />
      </Box>
      <div className="mt-5"><PrimaryButton label="Não quero perder pra inflação" onClick={finish} /></div>
    </>
  );
}

function PL12({ finish }: P) {
  const [value, setValue] = useState(50000);
  const opts = [
    { name: "Poupança", rate: SIM.poupancaYear, liq: "Tira quando quiser", risk: "Muito baixo" },
    { name: "CDB liquidez diária", rate: SIM.cdiYear * 0.85, liq: "Tira no mesmo dia", risk: "Baixo · FGC" },
    { name: "Tesouro Selic", rate: SIM.cdiYear * 0.87, liq: "D+1", risk: "Muito baixo · governo" },
  ];
  const results = opts.map((o) => Math.round(value * (1 + o.rate)));
  const best = Math.max(...results);
  return (
    <>
      <Title sub="12 meses, taxas simuladas já descontando IR aproximado.">Compara as três portas</Title>
      <Box className="mt-4">
        <Slider label="Valor aplicado" value={value} min={2000} max={300000} step={2000} onChange={setValue} fmt={(v) => brl(v, false)} />
      </Box>
      <div className="mt-3 flex flex-col gap-2">
        {opts.map((o, i) => (
          <div key={o.name} className={`rounded-[14px] border-[1.5px] p-4 ${results[i] === best ? "border-itau-orange bg-[#FFF1E5]" : "border-[#E3E3E3]"}`}>
            <div className="flex items-baseline justify-between">
              <span className="text-[16px] font-semibold text-[#333]">{o.name}</span>
              <span className="text-[17px] font-bold text-black">{brl(results[i], false)}</span>
            </div>
            <div className="text-[13px] text-[#666]">{o.liq} · risco {o.risk}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[12px] leading-snug text-[#888]">Educacional, não é recomendação de investimento. Rentabilidade passada não garante futura.</p>
      <div className="mt-4"><PrimaryButton label="Aprendi" onClick={finish} /></div>
    </>
  );
}

const PRACTICE: Record<LessonId, (p: P) => JSX.Element> = {
  L1: PL1, L2: PL2, L3: PL3, L4: PL4, L5: PL5, L6: PL6, L7: PL7, L8: PL8, L9: PL9, L10: PL10, L11: PL11, L12: PL12,
};

function CountUp({ to }: { to: number }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / 700, 1);
      setV(Math.round(to * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{v}</>;
}

function Reward({ id, prevLevel, onNext, onClose }: { id: LessonId; prevLevel: number; onNext?: () => void; onClose: () => void }) {
  const t = useTrilha();
  const lesson = LESSONS.find((l) => l.id === id)!;
  const leveled = t.level > prevLevel;
  const unlocked = leveled ? REWARDS.filter((r) => r.level > prevLevel && r.level <= t.level) : [];
  return (
    <div className="flex flex-col items-center px-5 pt-10 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
        className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-gradient-to-br from-[#FF6200] to-[#FF9A3D] text-[30px] font-bold text-white shadow-lg"
      >
        +<CountUp to={lesson.points} />
      </motion.div>
      <h1 className="mt-5 text-[26px] font-bold text-black">{leveled ? `Subiu pro Nível ${t.level}` : "Feito."}</h1>
      <p className="mt-1 text-[16px] text-[#555]">{t.points} pts no Minhas Vantagens{t.nextLevelAt ? ` · faltam ${t.nextLevelAt - t.points} pro próximo nível` : ""}</p>
      <ProgressBar pct={t.levelPct} className="mt-4 w-full" />
      <div className="mt-5 w-full rounded-[16px] bg-itau-chip p-4 text-left">
        <div className="text-[13px] font-semibold uppercase tracking-wide text-itau-orange">Leva essa</div>
        <div className="mt-1 text-[16px] leading-snug text-[#333]">{CONTENT[id].tip}</div>
      </div>
      {unlocked.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-3 w-full rounded-[16px] bg-itau-navy p-4 text-left text-white">
          <div className="text-[13px] text-white/75">Liberado no Minhas Vantagens</div>
          {unlocked.map((r) => (
            <div key={r.id} className="mt-2">
              <div className="text-[16px] font-semibold">{r.title}</div>
              <div className="text-[13px] text-white/70">{r.detail}</div>
            </div>
          ))}
        </motion.div>
      )}
      <div className="mt-6 flex w-full flex-col gap-3 pb-8">
        {onNext && t.next && <PrimaryButton label={`Próxima: ${t.next.title}`} onClick={onNext} />}
        <Squish onClick={onClose} className="w-full rounded-[12px] border-[1.5px] border-itau-orange py-[11px] text-center text-[16px] font-semibold text-itau-orange">
          {onNext ? "Continuar depois" : "Voltar"}
        </Squish>
      </div>
    </div>
  );
}

export function Licao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTrilha();
  const lesson = LESSONS.find((l) => l.id === id) ?? LESSONS[0];
  const c = CONTENT[lesson.id];
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [prevLevel, setPrevLevel] = useState(t.level);
  const fromPix = (location.state as { fromPix?: boolean } | null)?.fromPix;
  const Practice = PRACTICE[lesson.id];

  const close = () => {
    const delta = fromPix ? deltaToHome() : undefined;
    if (delta !== undefined) navigate(delta);
    else navigate(-1);
  };
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };
  const finish = () => {
    setPrevLevel(t.level);
    t.complete(lesson.id);
    go(3);
  };
  const canNext = t.next && t.next.id !== lesson.id;

  return (
    <Screen
      header={
        step < 3 ? (
          <div className="shrink-0 px-5 pb-2 pt-2">
            <div className="flex gap-[6px]">
              {[0, 1, 2].map((i) => (
                <Squish key={i} onClick={() => i <= step && go(i)} aria-label={`Tela ${i + 1}`} className="h-[4px] flex-1 overflow-hidden rounded-full bg-[#E3E3E3]" scale={1}>
                  <motion.div className="h-full bg-itau-orange" initial={false} animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.3 }} />
                </Squish>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <IaiAvatar size={26} />
              <span className="flex-1 truncate text-[14px] text-[#555]">
                {lesson.id} · {lesson.title}
              </span>
              <Squish aria-label="Fechar" onClick={close} className="flex h-9 w-9 items-center justify-center rounded-full" scale={0.88}>
                <X size={22} color="#333" />
              </Squish>
            </div>
          </div>
        ) : undefined
      }
      footer={
        step < 2 ? (
          <Footer>
            <PrimaryButton label={step === 0 ? "Próximo" : `Na prática · ${lesson.practice}`} onClick={() => go(step + 1)} />
          </Footer>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div key={step} initial={{ opacity: 0, x: 40 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 * dir }} transition={{ duration: 0.22 }}>
          {step < 2 && (
            <div className="px-5 pt-8">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[#FFF1E5]">
                {(() => {
                  const Icon = c.cards[step].icon;
                  return <Icon size={36} color="#FF6200" strokeWidth={1.8} />;
                })()}
              </div>
              {step === 0 && <div className="mt-6 text-[13px] font-semibold uppercase tracking-wide text-itau-orange">{lesson.hook}</div>}
              <h1 className={`${step === 0 ? "mt-2" : "mt-6"} text-[28px] font-bold leading-tight tracking-tight text-black`}>{c.cards[step].title}</h1>
              <div className="mt-4 text-[19px] leading-relaxed text-[#444]">{c.cards[step].body}</div>
            </div>
          )}
          {step === 2 && (
            <div className="px-5 pb-10 pt-6">
              <Practice t={t} finish={finish} />
            </div>
          )}
          {step === 3 && (
            <Reward
              id={lesson.id}
              prevLevel={prevLevel}
              onNext={canNext ? () => navigate(`/academia/licao/${t.next!.id}`, { replace: true, state: location.state }) : undefined}
              onClose={close}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}
