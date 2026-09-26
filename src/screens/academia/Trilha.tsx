import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, Crown, Flame, Info, Lock, Star } from "lucide-react";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AcademiaTabs, IaiAvatar, ProgressBar, Wordmark } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { LESSONS, QUIZ_PASS, UNITS, type LessonId } from "../../data/trilha";
import { deltaToHome } from "../../state/homeHistory";
import { useTrilha } from "../../state/TrilhaContext";

const OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56];

export function Trilha() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [open, setOpen] = useState<LessonId | null>(null);
  let k = 0;

  const back = () => {
    const d = deltaToHome();
    if (d !== undefined) navigate(d);
    else navigate("/home", { replace: true, state: { tab: true } });
  };

  return (
    <Screen
      bg="bg-[#F7F7F7]"
      header={
        <div className="shrink-0 border-b border-[#E6E6E6] bg-white px-3 pb-3">
          <div className="flex h-[48px] items-center gap-1">
            <Squish aria-label="Voltar" onClick={back} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
              <ChevronLeft size={28} strokeWidth={1.6} />
            </Squish>
            <IaiAvatar size={26} />
            <Wordmark className="ml-1 flex-1 text-[18px] text-[#1F2A63]" />
            <Squish aria-label="Sobre a Academia Ia.i" onClick={() => navigate("/academia/intro")} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
              <Info size={22} color="#555" />
            </Squish>
          </div>
          <div className="flex items-center gap-2 px-2 text-[14px] font-semibold">
            <span className="flex items-center gap-1 rounded-full bg-[#FFF1E5] px-3 py-1 text-itau-orange">
              <Flame size={15} /> {t.streak} {t.streak === 1 ? "semana" : "semanas"}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-[#EEF1FB] px-3 py-1 text-[#1F2A63]">
              <Star size={15} /> {t.points} pts
            </span>
            <span className="ml-auto text-[#555]">Nível {t.level}</span>
          </div>
          <ProgressBar pct={t.levelPct} className="mx-2 mt-2" />
        </div>
      }
      footer={<AcademiaTabs />}
    >
      <div className="pb-10">
        {UNITS.map((u) => {
          const lessons = LESSONS.filter((l) => l.unit === u.n);
          const doneN = lessons.filter((l) => t.done(l.id)).length;
          return (
            <Fragment key={u.n}>
              <div className={`mx-4 mt-5 rounded-[16px] ${u.color} px-4 py-3 text-white`}>
                <div className="text-[12px] font-semibold uppercase tracking-wide text-white/80">Unidade {u.n}</div>
                <div className="text-[19px] font-bold leading-tight">{u.name}</div>
                <div className="text-[14px] text-white/85">
                  {u.tagline} · {doneN}/{lessons.length}
                </div>
              </div>
              <div className="relative flex flex-col items-center gap-[18px] py-6">
                {lessons.map((l) => {
                  const off = OFFSETS[k++ % OFFSETS.length];
                  const done = t.done(l.id);
                  const current = t.next?.id === l.id;
                  const locked = !t.unlocked(l.id);
                  const crown = (t.quizBest[l.id] ?? 0) >= QUIZ_PASS;
                  return (
                    <div key={l.id} className="relative" style={{ transform: `translateX(${off}px)`, zIndex: open === l.id ? 30 : 1 }}>
                      {current && (
                        <motion.div
                          className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[10px] border-2 border-[#E6E6E6] bg-white px-3 py-1 text-[13px] font-bold uppercase text-itau-orange"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        >
                          Começar
                        </motion.div>
                      )}
                      <Squish
                        aria-label={l.title}
                        onClick={() => setOpen(open === l.id ? null : l.id)}
                        className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full"
                        style={{
                          background: locked ? "#E5E5E5" : u.ring,
                          boxShadow: `0 6px 0 ${locked ? "#C9C9C9" : "rgba(0,0,0,0.25)"}`,
                        }}
                        scale={0.9}
                      >
                        {current && <motion.span className="absolute -inset-[7px] rounded-full border-[5px]" style={{ borderColor: u.ring, opacity: 0.35 }} animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.4, repeat: Infinity }} />}
                        {locked ? <Lock size={26} color="#9A9A9A" /> : done ? crown ? <Crown size={30} color="white" fill="white" /> : <Check size={32} color="white" strokeWidth={3} /> : <Star size={30} color="white" fill="white" />}
                      </Squish>
                      <AnimatePresence>
                        {open === l.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.95 }}
                            className="absolute top-[86px] z-20 w-[260px] rounded-[16px] p-4 text-white shadow-xl"
                            style={{ background: locked ? "#8A8A8A" : u.ring, left: 36 - off - 130 }}
                          >
                            <div className="text-[12px] font-semibold uppercase text-white/80">
                              Lição {l.id.slice(1)} · ~5 min
                            </div>
                            <div className="text-[17px] font-bold leading-tight">{l.title}</div>
                            {locked ? (
                              <div className="mt-2 text-[14px] text-white/90">Termine a lição anterior pra liberar.</div>
                            ) : (
                              <>
                                <div className="mt-1 text-[13px] text-white/85">
                                  {done ? (crown ? `Quiz: ${t.quizBest[l.id]}/4 · pontos garantidos` : "Lição feita · quiz vale até 100 pts") : `${l.steps.length} exercícios rápidos`}
                                </div>
                                <Squish onClick={() => navigate(`/academia/licao/${l.id}`)} className="mt-3 w-full rounded-[12px] bg-white py-[10px] text-center text-[15px] font-bold" style={{ color: u.ring }} scale={0.96}>
                                  {done ? "Refazer lição" : "Começar"}
                                </Squish>
                                {done && (
                                  <Squish onClick={() => navigate(`/academia/licao/${l.id}/aprofundar`)} className="mt-2 w-full rounded-[12px] border border-white/50 py-[9px] text-center text-[14px] font-semibold" scale={0.96}>
                                    Aprofundar + quiz
                                  </Squish>
                                )}
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </Fragment>
          );
        })}
        <p className="mx-6 text-center text-[12px] text-[#888]">Conteúdo educacional. Não é recomendação de investimento. Valores simulados.</p>
      </div>
    </Screen>
  );
}
