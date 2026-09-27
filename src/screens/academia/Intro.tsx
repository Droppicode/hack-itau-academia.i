import { AnimatePresence, motion } from "framer-motion";
import { goBack } from "../../state/goBack";
import { BookOpen, ChevronDown, Flame, Loader2, Map as MapIcon, Sparkles, Target, Trophy, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GOAL_ICON, IaiAvatar, Wordmark, goalDef } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { KNOWLEDGE, localTrail, requestTrail, type KnowledgeId } from "../../data/personalizar";
import { GOALS } from "../../data/trilha";
import { useIaContext } from "../../state/iaContext";
import { monthsTo, parseCents } from "../../data/money";
import { MoneyField, reais } from "../../components/GoalSheet";
import { useTrilha } from "../../state/TrilhaContext";

const PAGES = [
  { Icon: Target, title: "Tudo começa com um objetivo", text: "Você escolhe o que quer conquistar, a gente cria um cofrinho pra ele e você vê a barra enchendo na tela inicial." },
  { Icon: BookOpen, title: "Educação financeira sem juridiquês", text: "Lições de 5 minutos sobre o dia a dia do dinheiro, cartão, reserva, investimentos, golpes e mais. A trilha é montada pro seu objetivo e pro que você já sabe." },
  { Icon: MapIcon, title: "Uma trilha, um passo por vez", text: "Cada lição libera a próxima. Quer ir além? Tem leitura de aprofundamento. No fim da unidade, um desafio opcional vale Pontos Itaú." },
  { Icon: Trophy, title: "Missões que ajudam o objetivo", text: "Missões da semana valem Pontos Itaú pra usar no Itaú Shop. Na missão do mês, o que fica guardado no cofrinho o mês inteiro também vira pontos." },
  { Icon: Flame, title: "Sequência que multiplica", text: "Cada semana com uma compra no débito ou no crédito aumenta sua sequência: seus pontos valem até 1,2x. Pontos valem 6 meses, e o dinheiro guardado continua seu." },
];

export function Intro() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [i, setI] = useState(0);
  const [goalId, setGoalId] = useState(t.goal?.id ?? GOALS[0].id);
  const def = goalDef(goalId);
  const [targetRaw, setTargetRaw] = useState(reais(t.goal?.targetCents ?? def.cents));
  const [monthlyRaw, setMonthlyRaw] = useState(reais(t.goal?.monthlyCents ?? 10000));
  const target = parseCents(targetRaw);
  const monthly = parseCents(monthlyRaw);
  const amountsOk = target > 0 && monthly > 0;
  const [knowledge, setKnowledge] = useState<KnowledgeId | undefined>(t.profile.knowledge);
  const [situation, setSituation] = useState(t.profile.text ?? "");
  const [busy, setBusy] = useState(false);
  const context = useIaContext();
  const goalPage = i === PAGES.length;
  const GoalIcon = GOAL_ICON[def.id] ?? Target;

  const start = async () => {
    if (busy || (goalPage && !amountsOk)) return;
    const profile = { knowledge, text: knowledge === "ia" && situation.trim() ? situation.trim().slice(0, 600) : undefined };
    t.setGoal({ id: def.id, name: def.label, targetCents: target, monthlyCents: monthly });
    const personalized = !!profile.knowledge;
    const n = t.trail?.n ?? 1;
    let trail = localTrail(profile, def.id, t.doneUnits, n);
    if (personalized) {
      setBusy(true);
      trail = await requestTrail({ profile, goalId: def.id, doneUnits: t.doneUnits, currentUnits: [], context, n });
    }
    t.set({ introSeen: true, profile, trail });
    navigate("/academia/trilha", { replace: true });
  };

  const months = monthsTo(target, monthly);
  const bg = goalPage ? `linear-gradient(180deg, ${def.from}, ${def.to})` : "linear-gradient(180deg, #1F2A63, #003087)";

  return (
    <Screen bg="bg-[#1F2A63]" statusTone="light">
      <motion.div className="flex min-h-full flex-col px-6 pb-8 text-white" animate={{ background: bg }} transition={{ duration: 0.5 }}>
        <div className="flex h-[56px] items-center justify-between">
          <Squish aria-label="Fechar" onClick={() => (i > 0 ? setI(i - 1) : goBack(navigate))} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" scale={0.88}>
            <X size={20} />
          </Squish>
          {!goalPage && (
            <Squish onClick={() => setI(PAGES.length)} className="text-[15px] font-semibold text-white/80" scale={0.94}>
              Pular
            </Squish>
          )}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <IaiAvatar size={40} />
          <Wordmark className="text-[24px]" />
        </div>

        <div className="relative mt-8 flex-1">
          <AnimatePresence mode="wait">
            {goalPage ? (
              <motion.div key="goal" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                <div className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70">Antes de começar</div>
                <h1 className="mt-1 text-[26px] font-bold leading-tight">Qual é o seu objetivo principal?</h1>
                <label className="relative mt-5 block">
                  <span className="sr-only">Objetivo</span>
                  <select
                    aria-label="Objetivo principal"
                    value={goalId}
                    onChange={(e) => {
                      const g = goalDef(e.target.value);
                      setGoalId(g.id);
                      setTargetRaw(reais(g.cents));
                    }}
                    className="h-[54px] w-full appearance-none rounded-[16px] bg-white pl-4 pr-10 text-[17px] font-semibold text-[#1A1A1A] outline-none"
                  >
                    {GOALS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={20} color="#555" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
                </label>

                <motion.div key={def.id} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-5 flex items-center gap-4 rounded-[20px] bg-white/12 p-4" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-[20px] bg-white/20">
                    <GoalIcon size={34} color="white" strokeWidth={1.6} />
                  </div>
                  <div className="text-[15px] leading-snug text-white/90">{def.line}</div>
                </motion.div>

                <div className="mt-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70">Opcional · personalizar trilha</div>
                <div className="mt-1 text-[16px] font-semibold">Quanto você já sabe de educação financeira?</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {KNOWLEDGE.map((k) => (
                    <Squish
                      key={k.id}
                      aria-pressed={knowledge === k.id}
                      onClick={() => setKnowledge(knowledge === k.id ? undefined : k.id)}
                      className={`rounded-[14px] p-3 text-left ${knowledge === k.id ? "bg-white text-[#14215A]" : "bg-white/12 text-white"}`}
                      style={{ background: knowledge === k.id ? undefined : "rgba(255,255,255,0.12)" }}
                      scale={0.96}
                    >
                      <div className="flex items-center gap-1 text-[14px] font-bold leading-tight">
                        {k.id === "ia" && <Sparkles size={14} />} {k.label}
                      </div>
                      <div className={`mt-1 text-[12px] leading-snug ${knowledge === k.id ? "text-[#555]" : "text-white/75"}`}>{k.sub}</div>
                    </Squish>
                  ))}
                </div>
                {knowledge === "ia" && (
                  <textarea
                    aria-label="Conte sua situação"
                    value={situation}
                    maxLength={600}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Ex.: comecei a trabalhar agora, meu cartão sempre estoura e quero entender por onde começar a investir. Não precisa de dados pessoais."
                    className="mt-3 h-[96px] w-full resize-none rounded-[14px] bg-white p-3 text-[15px] leading-snug text-[#1A1A1A] outline-none placeholder:text-[#999]"
                  />
                )}
                <p className="mt-2 text-[12px] leading-snug text-white/70">
                  {knowledge ? "A IA.I monta sua trilha com base no seu objetivo e nessas respostas. Dá pra mudar quando quiser." : "Pulou? Tudo bem: a trilha começa pelo básico e você pode personalizar depois."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <MoneyField label="Quanto custa" value={targetRaw} onChange={setTargetRaw} />
                  <MoneyField label="Guardar por mês" value={monthlyRaw} onChange={setMonthlyRaw} />
                </div>
                <div className="mt-2 text-[14px] text-white/85">
                  {amountsOk ? (
                    <>
                      Chega lá em ~<b className="text-white">{months} {months === 1 ? "mês" : "meses"}</b>, sem contar o rendimento.
                    </>
                  ) : (
                    "Digite valores maiores que zero."
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
                {(() => {
                  const { Icon, title, text } = PAGES[i];
                  return (
                    <>
                      <motion.div className="flex h-[120px] w-[120px] items-center justify-center rounded-[32px] bg-white/10" animate={{ rotate: [0, -4, 4, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
                        <Icon size={58} color="#FF8A3D" strokeWidth={1.6} />
                      </motion.div>
                      <h1 className="mt-8 text-[28px] font-bold leading-tight">{title}</h1>
                      <p className="mt-3 text-[17px] leading-snug text-white/85">{text}</p>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex justify-center gap-[6px]">
          {[...PAGES, null].map((_, n) => (
            <Squish key={n} aria-label={`Página ${n + 1}`} onClick={() => setI(n)} className={`h-[7px] rounded-full ${n === i ? "w-6 bg-itau-orange" : "w-[7px] bg-white/30"}`} scale={0.8} />
          ))}
        </div>
        <Squish onClick={() => (goalPage ? void start() : setI(i + 1))} disabled={busy || (goalPage && !amountsOk)} className="mt-6 flex disabled:opacity-40 w-full items-center justify-center gap-2 rounded-[14px] bg-itau-orange py-[14px] text-center text-[17px] font-bold" scale={0.97}>
          {busy ? (
            <>
              <Loader2 size={18} className="animate-spin" /> IA.I montando sua trilha…
            </>
          ) : goalPage ? (
            t.goal ? "Salvar e ir pra trilha" : "Criar cofrinho e começar a trilha"
          ) : (
            "Continuar"
          )}
        </Squish>
        <p className="mt-3 text-center text-[12px] text-white/60">Protótipo: conteúdo educacional, valores e rendimentos simulados.</p>
      </motion.div>
    </Screen>
  );
}
