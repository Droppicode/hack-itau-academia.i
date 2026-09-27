import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, HeartHandshake, Map as MapIcon, Target, Trophy, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GOAL_ICON, IaiAvatar, Wordmark, goalDef } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { GOALS } from "../../data/trilha";
import { brl, monthsTo } from "../../data/money";
import { useTrilha } from "../../state/TrilhaContext";

const PAGES = [
  { Icon: Target, title: "Tudo começa com um objetivo", text: "Você escolhe o que quer conquistar, a gente cria um cofrinho pra ele e você vê a barra enchendo na tela inicial." },
  { Icon: BookOpen, title: "Educação financeira sem juridiquês", text: "Lições de 5 minutos pra dominar o vocabulário do dinheiro: conta, Pix, fatura, holerite, benefícios, cofrinho e mais." },
  { Icon: MapIcon, title: "Uma trilha, um passo por vez", text: "Cada lição libera a próxima. Quer ir além? Tem leitura de aprofundamento. No fim da unidade, um desafio opcional vale Pontos Itaú." },
  { Icon: Trophy, title: "Missões que ajudam o objetivo", text: "Missões da semana valem Pontos Itaú pra usar no Itaú Shop. Na missão do mês, o que fica guardado no cofrinho o mês inteiro também vira pontos." },
  { Icon: HeartHandshake, title: "Sem pressão", text: "Parou uma semana? Tudo bem. Você nunca perde pontos, e o dinheiro guardado continua seu." },
];

export function Intro() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [i, setI] = useState(0);
  const [goalId, setGoalId] = useState(t.goal?.id ?? GOALS[0].id);
  const def = goalDef(goalId);
  const [target, setTarget] = useState(t.goal?.targetCents ?? def.cents);
  const [monthly, setMonthly] = useState(t.goal?.monthlyCents ?? 10000);
  const goalPage = i === PAGES.length;
  const GoalIcon = GOAL_ICON[def.id] ?? Target;

  const start = () => {
    t.setGoal({ id: def.id, name: def.label, targetCents: target, monthlyCents: monthly });
    t.set({ introSeen: true });
    navigate("/academia/trilha", { replace: true });
  };

  const months = monthsTo(target, monthly);
  const bg = goalPage ? `linear-gradient(180deg, ${def.from}, ${def.to})` : "linear-gradient(180deg, #1F2A63, #003087)";

  return (
    <Screen bg="bg-[#1F2A63]" statusTone="light">
      <motion.div className="flex min-h-full flex-col px-6 pb-8 text-white" animate={{ background: bg }} transition={{ duration: 0.5 }}>
        <div className="flex h-[56px] items-center justify-between">
          <Squish aria-label="Fechar" onClick={() => (i > 0 ? setI(i - 1) : navigate(-1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" scale={0.88}>
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
                      setTarget(g.cents);
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

                <label className="mt-5 block text-[14px] text-white/85">
                  Quanto custa: <b className="text-white">{brl(target, false)}</b>
                  <input type="range" min={30000} max={1500000} step={10000} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="mt-1 w-full accent-[#FF6200]" />
                </label>
                <label className="mt-2 block text-[14px] text-white/85">
                  Quanto quer guardar por mês: <b className="text-white">{brl(monthly, false)}</b>
                  <input type="range" min={1000} max={100000} step={1000} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="mt-1 w-full accent-[#FF6200]" />
                </label>
                <div className="mt-2 text-[14px] text-white/85">
                  Chega lá em ~<b className="text-white">{months} {months === 1 ? "mês" : "meses"}</b>, sem contar o rendimento.
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
        <Squish onClick={() => (goalPage ? start() : setI(i + 1))} className="mt-6 w-full rounded-[14px] bg-itau-orange py-[14px] text-center text-[17px] font-bold" scale={0.97}>
          {goalPage ? (t.goal ? "Salvar objetivo e ir pra trilha" : "Criar cofrinho e começar a trilha") : "Continuar"}
        </Squish>
        <p className="mt-3 text-center text-[12px] text-white/60">Protótipo: conteúdo educacional, valores e rendimentos simulados.</p>
      </motion.div>
    </Screen>
  );
}
