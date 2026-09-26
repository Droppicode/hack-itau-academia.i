import { AnimatePresence, motion } from "framer-motion";
import {
  BellRing,
  Check,
  ChevronDown,
  CreditCard,
  Eye,
  Gift,
  Landmark,
  PiggyBank,
  Route,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Umbrella,
  Wallet,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IaiAvatar, ProgressBar } from "../../components/Iai";
import { Footer, PrimaryButton } from "../../components/PrimaryButton";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { Toggle } from "../../components/Toggle";
import {
  brl,
  brlShort,
  byCategory,
  debitShare,
  fixedEntries,
  idleBeforeSalary,
  inflationLoss,
  institutions,
  l1Numbers,
  monthSummary,
  monthsTo,
  pctOfSalary,
  prevCycle,
  rotativo,
  topVariableCategory,
  zeroDay,
} from "../../data/calc";
import { GUARDOU_MANUAL, LUCAS, OTHER_BANK, OTHER_WALLET, RENDA_VARIAVEL, SIMULATED, TODAY } from "../../data/lucas";
import { GOALS, LESSONS, REWARDS, type GoalId, type LessonId } from "../../data/trilha";
import { deltaToHome } from "../../state/homeHistory";
import { useTrilha } from "../../state/TrilhaContext";

type T = ReturnType<typeof useTrilha>;

type Content = {
  concept: { icon: LucideIcon; title: string; body: ReactNode };
  case: { big: string; text: ReactNode; how: string };
};

function Chips<V extends string | number>({ values, value, onChange, fmt }: { values: V[]; value: V; onChange: (v: V) => void; fmt: (v: V) => string }) {
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

function contentFor(id: LessonId, t: T): Content {
  const entries = t.entries;
  const sum = monthSummary(entries);
  switch (id) {
    case "L1": {
      const n = l1Numbers(entries);
      const today = entries.filter((e) => e.date === TODAY && e.internal && e.cents < 0).reduce((s, e) => s - e.cents, 0);
      return {
        concept: {
          icon: Eye,
          title: "Antes de tudo: o que a gente vê",
          body: (
            <>
              <p>
                O Itaú vê o que entra e sai <b>desta conta</b>. Não vê suas outras contas — só se você deixar, e você desliga em 1 toque.
              </p>
              <p className="mt-3">Agora o conceito: todo mês é renda − saída = sobra. Simples assim.</p>
            </>
          ),
        },
        case: {
          big: `${brlShort(n.inCents)} → ${brlShort(n.outCents)}`,
          text: (
            <>
              No mês passado entraram <b>{brl(n.inCents)}</b> e saíram <b>{brl(n.outCents)}</b> em {n.days} dias.
              {today > 0 && (
                <>
                  {" "}
                  Hoje, de novo: <b>{brl(today)}</b> ({pctOfSalary(today)}% do salário) foram pra outra conta.
                </>
              )}
            </>
          ),
          how: "Soma dos lançamentos da conta Itaú de 25/08 a 27/08 (salário, débitos e Pix enviados).",
        },
      };
    }
    case "L2":
      return {
        concept: {
          icon: Route,
          title: "Tem gasto que você escolhe. Tem gasto que já tá escolhido.",
          body: <p>Fixo é o que vem todo mês, igual: casa, plano, assinatura. Variável é decisão sua, mês a mês. Saber o fixo é saber quanto do mês já tem dono.</p>,
        },
        case: {
          big: brl(sum.fixed),
          text: (
            <>
              São seus gastos fixos. O resto — <b>{brl(sum.variable)}</b> no mês passado — foi decisão sua.
            </>
          ),
          how: `Soma dos ${fixedEntries(entries).length} lançamentos recorrentes do ciclo 25/08–24/09 (Itaú + ${OTHER_WALLET}, via Open Finance simulado).`,
        },
      };
    case "L2b": {
      const fixed = sum.fixed;
      return {
        concept: {
          icon: Umbrella,
          title: "Mês bom, mês ruim",
          body: <p>Quando a renda muda, a sobra muda junto. Mas o fixo — inclusive o que você dá em casa — não muda. Por isso aqui o colchão vem antes do objetivo.</p>,
        },
        case: {
          big: RENDA_VARIAVEL.map((m) => brlShort(m.cents)).join(" · "),
          text: (
            <>
              Foi o que entrou nos últimos 3 meses. Seu fixo é {brl(fixed)}: no mês de {brlShort(RENDA_VARIAVEL[0].cents)} sobraram{" "}
              <b>{brl(RENDA_VARIAVEL[0].cents - fixed)}</b>; no de {brlShort(RENDA_VARIAVEL[1].cents)}, <b>{brl(RENDA_VARIAVEL[1].cents - fixed)}</b>.
            </>
          ),
          how: "Entradas por mês (jul–set, perfil renda variável simulado) − gastos fixos do ciclo.",
        },
      };
    }
    case "L3": {
      const goal = GOALS.find((g) => g.id === (t.diag.goal ?? "celular")) ?? GOALS[0];
      return {
        concept: {
          icon: Sparkles,
          title: "Quanto sobra de verdade",
          body: <p>Sobra sem destino some. Sobra com nome vira objetivo. É a mesma grana — muda o que você faz com ela.</p>,
        },
        case: {
          big: `~${brlShort(sum.sobra)}/mês`,
          text: (
            <>
              É o que sobra pra você. {goal.label} de {brlShort(goal.cents)} levaria <b>{monthsTo(goal.cents, sum.sobra)} meses</b> assim — ou{" "}
              <b>{monthsTo(goal.cents, 15000)}</b> com R$ 150.
            </>
          ),
          how: `Renda ${brl(sum.income)} − fixos ${brl(sum.fixed)} − variáveis ${brl(sum.variable)} no ciclo 25/08–24/09.`,
        },
      };
    }
    case "L4": {
      const idle = idleBeforeSalary(entries);
      const { real, rendendo } = inflationLoss(idle);
      return {
        concept: {
          icon: TrendingUp,
          title: "Dinheiro parado encolhe",
          body: <p>A inflação come um pedacinho do seu dinheiro todo mês. Rendendo, ele pelo menos corre junto — e dá pra tirar quando quiser.</p>,
        },
        case: {
          big: `${brl(idle)} → ${brl(real)}`,
          text: (
            <>
              Seus {brl(idle)} parados valem isso em 12 meses. Rendendo 100% do CDI, viram <b>{brl(rendendo)}</b>.
            </>
          ),
          how: `Saldo que ficou parado na conta antes do salário. Inflação ${SIMULATED.inflationYear * 100}% a.a. e CDI ${SIMULATED.cdiYear * 100}% a.a. simulados, antes de IR.`,
        },
      };
    }
    case "L5": {
      const applied = t.cdbCents || 5000;
      return {
        concept: {
          icon: Wallet,
          title: "Preso x disponível",
          body: <p>Liquidez diária quer dizer: o dinheiro rende e continua seu. Precisou, tira no mesmo dia, sem multa.</p>,
        },
        case: {
          big: brl(applied),
          text: <>Os {brl(applied)} que você aplicou: dá pra tirar hoje, agora, sem perder nada do que já rendeu.</>,
          how: "Valor aplicado na L4 em CDB liquidez diária (simulado).",
        },
      };
    }
    case "L6": {
      const times = GUARDOU_MANUAL.length;
      return {
        concept: {
          icon: Zap,
          title: "O que acontece sozinho, acontece",
          body: <p>Lembrar de guardar falha. Automático não esquece. Você escolhe o valor uma vez e ele cai no dia do salário, antes de dar tempo de gastar.</p>,
        },
        case: {
          big: `${times}× em 3 meses`,
          text: (
            <>
              Você separou {brl(GUARDOU_MANUAL[0].cents)} {times} vezes. No automático seriam <b>12 vezes por ano</b>, sem você pensar.
            </>
          ),
          how: `Transferências manuais pra caixinha na ${OTHER_WALLET} (jun–ago).`,
        },
      };
    }
    case "L7": {
      const d = debitShare(entries);
      return {
        concept: {
          icon: CreditCard,
          title: "Pix, débito e crédito não são a mesma coisa",
          body: <p>Pix é pra mandar. Débito é gastar o que tem. Crédito é gastar o que vai ter — e tem juros se não pagar. Com o cartão no celular, você paga por aproximação sem abrir app.</p>,
        },
        case: {
          big: `${d.pct}%`,
          text: <>das suas compras ({d.other} de {d.total}) são no débito de outro banco.</>,
          how: "Compras no débito no ciclo 25/08–24/09, por instituição.",
        },
      };
    }
    case "L8": {
      const x = rotativo(30000, 6);
      return {
        concept: {
          icon: ShieldCheck,
          title: "Como uma dívida pequena vira grande",
          body: <p>Pagar só o mínimo da fatura joga o resto pro rotativo — os juros mais caros do Brasil. Aqui não tem oferta de crédito: é só pra você continuar longe disso.</p>,
        },
        case: {
          big: "R$ 0 de dívida",
          text: (
            <>
              Você não tem. É assim que continua sem ter: R$ 300 no rotativo por 6 meses viram <b>{brl(x)}</b>.
            </>
          ),
          how: `Nenhum pagamento mínimo ou parcelamento de fatura no extrato. Rotativo simulado a ${SIMULATED.rotativoMonth * 100}% a.m.`,
        },
      };
    }
    case "L9": {
      const top = topVariableCategory(entries);
      return {
        concept: {
          icon: Gift,
          title: "Benefício de verdade x pegadinha",
          body: <p>Benefício bom é o que você já usaria. Se precisa gastar mais pra ganhar, é pegadinha. Olha seu gasto antes de olhar o desconto.</p>,
        },
        case: {
          big: top ? top.category : "—",
          text: <>Pelos seus gastos ({top ? brl(top.cents) : "—"} no mês), é onde benefício vale mais pra você.</>,
          how: "Maior categoria de gasto variável do ciclo 25/08–24/09.",
        },
      };
    }
    case "L10": {
      const day = zeroDay(entries);
      return {
        concept: {
          icon: Umbrella,
          title: "O mês ruim vai chegar",
          body: <p>Reserva não é pra comprar nada. É pra quando o celular quebra ou o salário atrasa — e você não precisar de ninguém.</p>,
        },
        case: {
          big: day ? `dia ${day}` : "—",
          text: <>Mês passado seu saldo zerou dia {day}. Com R$ 200 de reserva, não teria acontecido.</>,
          how: `Saldo acumulado da ${OTHER_WALLET} no ciclo 25/08–24/09.`,
        },
      };
    }
    case "L11": {
      const inst = institutions(entries);
      return {
        concept: {
          icon: Landmark,
          title: "Sua vida financeira tá espalhada",
          body: <p>Open Finance junta suas contas num lugar só. Você escolhe o que compartilhar, por quanto tempo, e desliga quando quiser.</p>,
        },
        case: {
          big: `${inst.length} lugares`,
          text: <>Você tem dinheiro em {inst.join(", ")}. Quer ver tudo junto?</>,
          how: "Instituições que aparecem como destino dos seus Pix.",
        },
      };
    }
    case "L12":
      return {
        concept: {
          icon: PiggyBank,
          title: "Onde o seu salário deveria cair",
          body: <p>Portabilidade é o seu direito de escolher onde o salário cai. Hoje ele cai aqui e sai. A pergunta é: ainda faz sentido mandar embora?</p>,
        },
        case: {
          big: `${t.retainedPct}%`,
          text: <>do seu salário hoje fica aqui — somando conta, potes e aplicação ({brl(t.retainedCents)}).</>,
          how: "Saldo Itaú + potes + CDB ÷ salário.",
        },
      };
  }
}

type ActionProps = { t: T; finish: () => void };

function ActionL1({ t, finish }: ActionProps) {
  const cats = byCategory(prevCycle(t.entries)).slice(0, 7);
  const max = cats[0]?.cents ?? 1;
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Seu extrato, por categoria</h2>
      <p className="mt-1 text-[14px] text-[#666]">Ciclo 25/08–24/09 · Itaú + carteira (Open Finance simulado)</p>
      <div className="mt-4 flex flex-col gap-3">
        {cats.map((c, i) => (
          <div key={c.category}>
            <div className="flex justify-between text-[15px]">
              <span className="text-[#333]">{c.category}</span>
              <span className="font-semibold text-[#333]">{brl(c.cents)}</span>
            </div>
            <div className="mt-1 h-[8px] rounded-full bg-[#EEE]">
              <motion.div
                className="h-full rounded-full bg-itau-orange"
                initial={{ width: 0 }}
                animate={{ width: `${(c.cents / max) * 100}%` }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <PrimaryButton label="Vi meu extrato" onClick={finish} />
      </div>
    </>
  );
}

function ActionL2({ t, finish }: ActionProps) {
  const candidates = prevCycle(t.entries)
    .filter((e) => e.cents < 0 && !e.internal)
    .sort((a, b) => Number(!!b.fixed) - Number(!!a.fixed) || a.cents - b.cents)
    .slice(0, 10);
  const [sel, setSel] = useState<string[]>(t.fixedMarked);
  const total = candidates.filter((c) => sel.includes(c.id)).reduce((s, c) => s - c.cents, 0);
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Marca pelo menos 3 gastos fixos</h2>
      <p className="mt-1 flex items-center gap-2 text-[14px] text-[#666]">
        <Sparkles size={14} color="#FF6200" /> A Ia.i sugere os que se repetem todo mês (no topo).
      </p>
      <div className="mt-3">
        {candidates.map((c) => {
          const on = sel.includes(c.id);
          return (
            <Squish
              key={c.id}
              onClick={() => setSel(on ? sel.filter((x) => x !== c.id) : [...sel, c.id])}
              className="flex w-full items-center gap-3 border-b border-[#EEE] py-[11px]"
              scale={0.98}
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-[6px] border-2 ${on ? "border-itau-orange bg-itau-orange" : "border-[#BBB]"}`}>
                {on && <Check size={14} color="white" />}
              </div>
              <span className="flex-1 text-[15px] text-[#333]">
                {c.label}
                {c.fixed && <span className="ml-2 text-[12px] text-itau-orange">recorrente</span>}
              </span>
              <span className="text-[15px] font-semibold text-[#333]">{brl(-c.cents)}</span>
            </Squish>
          );
        })}
      </div>
      <div className="mt-3 text-[15px] text-[#555]">
        Marcados: <b>{sel.length}</b> · {brl(total)}/mês
      </div>
      <div className="mt-4">
        <PrimaryButton
          label="Marcar como fixos"
          disabled={sel.length < 3}
          onClick={() => {
            t.set({ fixedMarked: sel });
            finish();
          }}
        />
      </div>
    </>
  );
}

function PoteAction({ t, finish, kind }: ActionProps & { kind: "colchao" | "reserva" }) {
  const fixed = monthSummary(t.entries).fixed;
  const opts = kind === "colchao" ? [20000, fixed, 60000] : [20000, fixed, fixed * 2];
  const [v, setV] = useState(opts[kind === "colchao" ? 1 : 0]);
  const name = kind === "colchao" ? "colchão do mês ruim" : "reserva";
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Criar o pote “{name}”</h2>
      <p className="mt-1 text-[14px] text-[#666]">Quanto você quer ter guardado nele?</p>
      <div className="mt-4">
        <Chips values={opts} value={v} onChange={setV} fmt={(x) => (x === fixed ? `${brl(x)} (1 mês de fixo)` : brl(x, false))} />
      </div>
      <Box className="mt-5 text-[15px] text-[#444]">
        O pote fica no Itaú, rende como CDB liquidez diária e você tira quando quiser. {kind === "reserva" && "Ele também recebe parte do seu aporte automático."}
      </Box>
      <div className="mt-6">
        <PrimaryButton
          label={`Criar pote de ${brl(v, false)}`}
          onClick={() => {
            t.set({ [kind]: { name, targetCents: v, savedCents: 0 } });
            finish();
          }}
        />
      </div>
    </>
  );
}

function ActionL3({ t, finish }: ActionProps) {
  const [goalId, setGoalId] = useState<GoalId>(t.diag.goal ?? "celular");
  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const [monthly, setMonthly] = useState(15000);
  const months = monthsTo(goal.cents, monthly);
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Dá um nome pra sua sobra</h2>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
        {GOALS.filter((g) => g.id !== "naosei").map((g) => (
          <Squish
            key={g.id}
            onClick={() => setGoalId(g.id)}
            className={`shrink-0 rounded-full border-[1.5px] px-4 py-[8px] text-[15px] font-semibold ${
              g.id === goalId ? "border-itau-orange bg-[#FFF1E5] text-itau-orange" : "border-[#CFCFCF] text-[#444]"
            }`}
            scale={0.93}
          >
            {g.label}
          </Squish>
        ))}
      </div>
      <Box className="mt-5">
        <div className="text-[14px] text-[#666]">Meta</div>
        <div className="text-[24px] font-bold text-black">{brl(goal.cents, false)}</div>
        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-[14px] text-[#666]">Por mês</span>
          <span className="text-[20px] font-bold text-itau-orange">{brl(monthly, false)}</span>
        </div>
        <input
          type="range"
          min={3000}
          max={30000}
          step={1000}
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          aria-label="Valor por mês"
          className="mt-2 w-full accent-[#FF6200]"
        />
        <motion.div key={months} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-3 text-[17px] text-[#333]">
          Chega lá em <b>{months} meses</b>
        </motion.div>
      </Box>
      <div className="mt-6">
        <PrimaryButton
          label="Criar objetivo"
          onClick={() => {
            t.set({ goal: { id: goal.id, name: goal.label, targetCents: goal.cents, savedCents: 0, monthlyCents: monthly }, aporte: { ...t.aporte, cents: monthly } });
            finish();
          }}
        />
      </div>
    </>
  );
}

function ActionL4({ t, finish }: ActionProps) {
  const [v, setV] = useState(2000);
  const ok = t.balanceCents >= v;
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Primeira aplicação</h2>
      <p className="mt-1 text-[14px] text-[#666]">CDB liquidez diária · a partir de R$ 20 · rende 100% do CDI</p>
      <div className="mt-4">
        <Chips values={[2000, 5000, 8000]} value={v} onChange={setV} fmt={(x) => brl(x, false)} />
      </div>
      <Box className="mt-5">
        <div className="text-[14px] text-[#666]">Em 12 meses (simulado, antes de IR)</div>
        <div className="text-[22px] font-bold text-black">{brl(inflationLoss(v).rendendo)}</div>
        <div className="mt-1 text-[13px] text-[#777]">Saldo disponível: {brl(t.balanceCents)}</div>
      </Box>
      <p className="mt-4 text-[12px] leading-snug text-[#888]">Isto é uma opção, não uma recomendação de investimento. Rentabilidade passada não garante futura.</p>
      <div className="mt-4">
        <PrimaryButton
          label={ok ? `Aplicar ${brl(v, false)}` : "Saldo insuficiente"}
          disabled={!ok}
          onClick={() => {
            t.set((s) => ({ cdbCents: s.cdbCents + v }));
            finish();
          }}
        />
      </div>
    </>
  );
}

function ActionL5({ t, finish }: ActionProps) {
  const applied = t.cdbCents || 5000;
  const [v, setV] = useState(applied);
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Simula um resgate</h2>
      <p className="mt-1 text-[14px] text-[#666]">Nada vai ser executado. É só pra ver.</p>
      <Box className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[14px] text-[#666]">Resgatar</span>
          <span className="text-[22px] font-bold text-black">{brl(v)}</span>
        </div>
        <input type="range" min={100} max={applied} step={100} value={v} onChange={(e) => setV(Number(e.target.value))} aria-label="Valor do resgate" className="mt-2 w-full accent-[#FF6200]" />
        <div className="mt-3 flex flex-col gap-2 text-[15px] text-[#333]">
          <span className="flex items-center gap-2"><Check size={16} color="#1B7F3B" /> Cai na conta hoje</span>
          <span className="flex items-center gap-2"><Check size={16} color="#1B7F3B" /> Sem multa, sem carência</span>
          <span className="flex items-center gap-2"><Check size={16} color="#1B7F3B" /> O que rendeu até ontem é seu</span>
        </div>
      </Box>
      <div className="mt-6">
        <PrimaryButton label="Entendi, deixa rendendo" onClick={finish} />
      </div>
    </>
  );
}

function ActionL6({ t, finish }: ActionProps) {
  const variable = t.diag.renda === "muda" || t.diag.casa === "quando";
  const [mode, setMode] = useState<"fixo" | "percent">(variable ? "percent" : "fixo");
  const [cents, setCents] = useState(t.goal?.monthlyCents && t.goal.monthlyCents <= 15000 ? t.goal.monthlyCents : 5000);
  const [percent, setPercent] = useState(10);
  const amount = mode === "fixo" ? cents : Math.round((LUCAS.salaryCents * percent) / 100);
  const target = t.goal ? `pote “${t.goal.name}”` : "CDB liquidez diária";
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Liga o aporte automático</h2>
      <div className="mt-3 flex rounded-[12px] bg-itau-chip p-1">
        {(["fixo", "percent"] as const).map((m) => (
          <Squish
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-[10px] py-2 text-center text-[15px] font-semibold ${mode === m ? "bg-white text-itau-orange shadow" : "text-[#666]"}`}
            scale={0.96}
          >
            {m === "fixo" ? "Valor fixo" : "% do que entrar"}
          </Squish>
        ))}
      </div>
      <div className="mt-4">
        {mode === "fixo" ? (
          <Chips values={[3000, 5000, 8000, 15000]} value={cents} onChange={setCents} fmt={(x) => brl(x, false)} />
        ) : (
          <Chips values={[5, 10, 15]} value={percent} onChange={setPercent} fmt={(x) => `${x}%`} />
        )}
      </div>
      <Box className="mt-5 text-[15px] text-[#333]">
        Todo dia {LUCAS.salaryDay}, quando o salário cair, <b>{brl(amount)}</b> vão pro {target}. Você pausa quando quiser.
        {mode === "percent" && <div className="mt-1 text-[13px] text-[#666]">Mês de renda menor, aporte menor — sozinho.</div>}
      </Box>
      <div className="mt-6">
        <PrimaryButton
          label="Ligar aporte"
          onClick={() => {
            t.set({ aporte: { on: true, cents, percent, mode } });
            finish();
          }}
        />
      </div>
    </>
  );
}

function ActionL7({ t, finish }: ActionProps) {
  const [added, setAdded] = useState(t.walletCard);
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Cartão Itaú no celular</h2>
      <p className="mt-1 text-[14px] text-[#666]">Débito por aproximação. Sem plástico, sem abrir o app.</p>
      <div className="relative mt-6 flex h-[190px] items-center justify-center">
        <div className="absolute bottom-0 h-[70px] w-[240px] rounded-[16px] bg-[#1A1A1A]" />
        <motion.div
          animate={added ? { y: 50, scale: 0.8 } : { y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="relative h-[140px] w-[230px] rounded-[16px] bg-gradient-to-br from-[#FF6200] to-[#FF9A3D] p-4 text-white shadow-xl"
        >
          <div className="text-[13px] font-semibold opacity-90">itaú · débito</div>
          <div className="absolute bottom-4 left-4 text-[15px] tracking-widest">•••• 4417</div>
        </motion.div>
      </div>
      <div className="mt-6">
        {added ? (
          <PrimaryButton label="Pronto, tá na carteira" onClick={finish} />
        ) : (
          <PrimaryButton
            label="Adicionar à carteira do celular"
            onClick={() => {
              setAdded(true);
              t.set({ walletCard: true });
            }}
          />
        )}
      </div>
    </>
  );
}

function ActionL8({ t, finish }: ActionProps) {
  const [a, setA] = useState(t.alerts);
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Alertas que te protegem</h2>
      <div className="mt-4 flex flex-col gap-3">
        <Box className="flex items-center gap-3">
          <BellRing color="#FF6200" />
          <div className="flex-1">
            <div className="text-[16px] font-semibold text-[#333]">Alerta de fatura</div>
            <div className="text-[13px] text-[#666]">3 dias antes do vencimento, e se só o mínimo for pago</div>
          </div>
          <Toggle on={a.fatura} onChange={(v) => setA({ ...a, fatura: v })} label="Alerta de fatura" />
        </Box>
        <Box>
          <div className="flex items-center gap-3">
            <ShieldCheck color="#FF6200" />
            <div className="flex-1">
              <div className="text-[16px] font-semibold text-[#333]">Limite de gasto no mês</div>
              <div className="text-[13px] text-[#666]">Aviso quando chegar em 80%</div>
            </div>
            <Toggle on={a.limite} onChange={(v) => setA({ ...a, limite: v })} label="Limite de gasto" />
          </div>
          {a.limite && (
            <div className="mt-3">
              <Chips values={[30000, 50000, 80000]} value={a.limiteCents} onChange={(v) => setA({ ...a, limiteCents: v })} fmt={(x) => brl(x, false)} />
            </div>
          )}
        </Box>
      </div>
      <div className="mt-6">
        <PrimaryButton
          label="Ativar alertas"
          disabled={!a.fatura && !a.limite}
          onClick={() => {
            t.set({ alerts: a });
            finish();
          }}
        />
      </div>
    </>
  );
}

function ActionL9({ t, finish }: ActionProps) {
  const options = REWARDS.filter((r) => r.unlock === "L9");
  const [sel, setSel] = useState(options[0].id);
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Escolhe um benefício</h2>
      <p className="mt-1 text-[14px] text-[#666]">Dos que combinam com o que você já gasta. Sem precisar gastar mais.</p>
      <div className="mt-4 flex flex-col gap-2">
        {options.map((r) => (
          <Squish
            key={r.id}
            onClick={() => setSel(r.id)}
            className={`w-full rounded-[14px] border-[1.5px] p-4 ${sel === r.id ? "border-itau-orange bg-[#FFF1E5]" : "border-[#DDD]"}`}
            scale={0.97}
          >
            <div className="text-[16px] font-semibold text-[#333]">{r.title}</div>
            <div className="text-[13px] text-[#666]">{r.detail}</div>
          </Squish>
        ))}
      </div>
      <div className="mt-6">
        <PrimaryButton
          label="Ativar no Minhas Vantagens"
          onClick={() => {
            t.set((s) => ({ activeRewards: [...new Set([...s.activeRewards, sel])] }));
            finish();
          }}
        />
      </div>
    </>
  );
}

function ActionL11({ t, finish }: ActionProps) {
  const [scopes, setScopes] = useState({ wallet: true, bank: true, saldo: true, extrato: true });
  const rows: { k: keyof typeof scopes; label: string }[] = [
    { k: "wallet", label: OTHER_WALLET },
    { k: "bank", label: OTHER_BANK },
    { k: "saldo", label: "Saldo" },
    { k: "extrato", label: "Extrato dos últimos 90 dias" },
  ];
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Você escolhe o que compartilhar</h2>
      <p className="mt-1 text-[14px] text-[#666]">Consentimento por 12 meses · revoga em 1 toque em Menu › Open Finance</p>
      <div className="mt-4">
        {rows.map((r) => (
          <div key={r.k} className="flex items-center justify-between border-b border-[#EEE] py-[13px]">
            <span className="text-[16px] text-[#333]">{r.label}</span>
            <Toggle on={scopes[r.k]} onChange={(v) => setScopes({ ...scopes, [r.k]: v })} label={r.label} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <PrimaryButton
          label="Conectar"
          disabled={!Object.values(scopes).some(Boolean)}
          onClick={() => {
            t.set({ ofConnected: true });
            finish();
          }}
        />
        <Squish onClick={finish} className="w-full rounded-[12px] border-[1.5px] border-itau-orange py-[11px] text-center text-[16px] font-semibold text-itau-orange">
          Só queria ver
        </Squish>
      </div>
    </>
  );
}

function ActionL12({ t, finish }: ActionProps) {
  const [on, setOn] = useState(t.salaryHere);
  return (
    <>
      <h2 className="text-[22px] font-bold text-black">Seu salário, seu lugar</h2>
      <Box className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[16px] font-semibold text-[#333]">Manter o Itaú como conta do salário</div>
            <div className="text-[13px] text-[#666]">Cancela a transferência automática pra outra conta. Dá pra mudar quando quiser.</div>
          </div>
          <Toggle on={on} onChange={setOn} label="Conta do salário" />
        </div>
      </Box>
      <p className="mt-4 text-[14px] text-[#666]">Continua com Pix grátis, aporte automático, potes e os benefícios do nível máximo.</p>
      <div className="mt-6">
        <PrimaryButton
          label={on ? "Confirmar" : "Agora não, só concluir"}
          onClick={() => {
            t.set({ salaryHere: on });
            finish();
          }}
        />
      </div>
    </>
  );
}

function Action({ id, t, finish }: { id: LessonId } & ActionProps) {
  switch (id) {
    case "L1":
      return <ActionL1 t={t} finish={finish} />;
    case "L2":
      return <ActionL2 t={t} finish={finish} />;
    case "L2b":
      return <PoteAction t={t} finish={finish} kind="colchao" />;
    case "L3":
      return <ActionL3 t={t} finish={finish} />;
    case "L4":
      return <ActionL4 t={t} finish={finish} />;
    case "L5":
      return <ActionL5 t={t} finish={finish} />;
    case "L6":
      return <ActionL6 t={t} finish={finish} />;
    case "L7":
      return <ActionL7 t={t} finish={finish} />;
    case "L8":
      return <ActionL8 t={t} finish={finish} />;
    case "L9":
      return <ActionL9 t={t} finish={finish} />;
    case "L10":
      return <PoteAction t={t} finish={finish} kind="reserva" />;
    case "L11":
      return <ActionL11 t={t} finish={finish} />;
    case "L12":
      return <ActionL12 t={t} finish={finish} />;
  }
}

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

function Reward({ id, onNext, onClose }: { id: LessonId; onNext?: () => void; onClose: () => void }) {
  const t = useTrilha();
  const lesson = LESSONS.find((l) => l.id === id)!;
  const unlocked = REWARDS.filter((r) => r.unlock === id);
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
      <h1 className="mt-5 text-[26px] font-bold text-black">Feito.</h1>
      <p className="mt-1 text-[16px] text-[#555]">
        {lesson.points} pts no Minhas Vantagens · total {t.points} · Nível {t.level}
      </p>
      <ProgressBar pct={t.progressPct} className="mt-4 w-full" />
      <div className="mt-1 w-full text-right text-[12px] text-[#777]">{t.progressPct}% da trilha</div>
      {unlocked.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-5 w-full rounded-[16px] bg-itau-navy p-4 text-left text-white">
          <div className="flex items-center gap-2 text-[13px] text-white/75">
            <Gift size={16} /> Liberado no Minhas Vantagens
          </div>
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
        {onNext && <div className="text-[12px] text-[#888]">No app real, a próxima chega no dia do seu salário.</div>}
      </div>
    </div>
  );
}

export function Licao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const t = useTrilha();
  const lessonId = (LESSONS.find((l) => l.id === id)?.id ?? "L1") as LessonId;
  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  const [step, setStep] = useState(0);
  const [how, setHow] = useState(false);
  const [dir, setDir] = useState(1);
  const c = contentFor(lessonId, t);
  const fromPix = (location.state as { fromPix?: boolean } | null)?.fromPix;

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
    t.complete(lessonId);
    go(3);
  };

  const next = t.next;
  const canNext = next && next.id !== lessonId && t.isUnlocked(next.id);

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
            <PrimaryButton label={step === 0 ? "Me mostra o meu caso" : `Agora a ação · ≤20 s`} onClick={() => go(step + 1)} />
          </Footer>
        ) : undefined
      }
    >
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          initial={{ opacity: 0, x: 40 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 * dir }}
          transition={{ duration: 0.22 }}
        >
          {step === 0 && (
            <div className="px-5 pt-8">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[#FFF1E5]">
                <c.concept.icon size={36} color="#FF6200" strokeWidth={1.8} />
              </div>
              <h1 className="mt-6 text-[28px] font-bold leading-tight tracking-tight text-black">{c.concept.title}</h1>
              <div className="mt-4 text-[18px] leading-relaxed text-[#444]">{c.concept.body}</div>
            </div>
          )}
          {step === 1 && (
            <div className="px-5 pt-8">
              <div className="text-[13px] font-semibold uppercase tracking-wide text-itau-orange">O seu caso</div>
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 }}
                className="mt-3 text-[38px] font-bold leading-tight tracking-tight text-black"
              >
                {c.case.big}
              </motion.div>
              <p className="mt-4 text-[19px] leading-relaxed text-[#444]">{c.case.text}</p>
              <Squish onClick={() => setHow(!how)} className="mt-6 flex items-center gap-1 text-[14px] font-semibold text-itau-navy" scale={0.95}>
                Como a gente calculou <ChevronDown size={16} className={`transition-transform ${how ? "rotate-180" : ""}`} />
              </Squish>
              <AnimatePresence>
                {how && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <Box className="mt-2 text-[14px] leading-snug text-[#555]">
                      {c.case.how}
                      <div className="mt-2 text-[12px] text-[#888]">O sistema calcula, a Ia.i só escreve a frase.</div>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          {step === 2 && (
            <div className="px-5 pb-10 pt-6">
              <Action id={lessonId} t={t} finish={finish} />
            </div>
          )}
          {step === 3 && (
            <Reward
              id={lessonId}
              onNext={canNext ? () => navigate(`/academia/licao/${next.id}`, { replace: true, state: location.state }) : undefined}
              onClose={close}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Screen>
  );
}
