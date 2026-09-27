import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, Clock, Info, Lock, Pencil, Sparkles, Star, Target, Trophy, Wand2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../../components/BottomSheet";
import { GoalSheet } from "../../components/GoalSheet";
import { AcademiaTabs, GOAL_ICON, HeroBg, Wordmark, goalDef } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { IaFab } from "../../components/IaFab";
import { Squish } from "../../components/Squish";
import { ExpiryNote, StreakChip } from "../../components/Streak";
import { fmtMult, lessonsOf, UNIT_POINTS_PER_RIGHT, unitDef, unitPass, unitQuiz, type Lesson, type UnitId } from "../../data/trilha";
import { brl } from "../../data/money";
import { deltaToHome, deltaToIa } from "../../state/homeHistory";
import { useTrilha } from "../../state/TrilhaContext";
import { PillButton } from "./Exercise";
import { Noise, Odometer } from "../../components/fx";

const ROW = 104;
const TILE = 62;
const xAt = (i: number) => 50 + 30 * Math.sin(i * 1.05);

type NodeState = "done" | "current" | "locked" | "soon";

function Snake({ n, progress }: { n: number; progress: number }) {
  const pts = Array.from({ length: n }, (_, i) => [xAt(i), ROW / 2 + i * ROW] as const);
  const d = pts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x} ${y}`;
    const [px, py] = pts[i - 1];
    return `${acc} C${px} ${py + ROW / 2} ${x} ${y - ROW / 2} ${x} ${y}`;
  }, "");
  const h = n * ROW;
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 100 ${h}`} preserveAspectRatio="none">
      <path d={d} fill="none" stroke="#E8DCCD" strokeWidth={14} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={2} strokeDasharray="2 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {progress > 0 && (
        <motion.path
          d={d}
          fill="none"
          stroke="#EC7000"
          strokeWidth={14}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

function Tile({ num, state, onClick }: { num: number; state: NodeState; onClick: () => void }) {
  const styles: Record<NodeState, string> = {
    done: "bg-[#14215A] text-white shadow-[0_6px_14px_rgba(20,33,90,0.3)]",
    current: "bg-gradient-to-br from-[#EC7000] to-[#FF9A3D] text-white shadow-[0_8px_20px_rgba(236,112,0,0.45)]",
    locked: "border-2 border-dashed border-[#D9CBBB] bg-white text-[#B8A898]",
    soon: "bg-[#EFE7DE] text-[#C4B6A7]",
  };
  return (
    <Squish onClick={onClick} className="relative" scale={0.9} aria-label={`Lição ${num}`}>
      {state === "current" && (
        <motion.span className="absolute -inset-[7px] rounded-[26px] border-[3px] border-[#EC7000]" animate={{ opacity: [0.9, 0.2, 0.9], scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
      )}
      <div className={`flex items-center justify-center rounded-[20px] text-[20px] font-bold tabular-nums ${styles[state]}`} style={{ width: TILE, height: TILE }}>
        {state === "locked" || state === "soon" ? <Lock size={20} /> : String(num).padStart(2, "0")}
      </div>
      {state === "done" && (
        <span className="absolute -right-[6px] -top-[6px] flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-[#FBF6F0] bg-[#EC7000]">
          <Check size={12} color="white" strokeWidth={3} />
        </span>
      )}
    </Squish>
  );
}

function ChallengeTile({ state, onClick }: { state: NodeState; onClick: () => void }) {
  const cls: Record<NodeState, string> = {
    done: "bg-[#14215A] text-[#FFB27A]",
    current: "bg-gradient-to-br from-[#FFB000] to-[#EC7000] text-white shadow-[0_8px_20px_rgba(236,112,0,0.45)]",
    locked: "border-2 border-dashed border-[#D9CBBB] bg-white text-[#B8A898]",
    soon: "bg-[#EFE7DE] text-[#C4B6A7]",
  };
  return (
    <Squish onClick={onClick} className="relative" scale={0.9} aria-label="Desafio da unidade">
      <div className={`flex items-center justify-center rounded-full ${cls[state]}`} style={{ width: TILE + 8, height: TILE + 8 }}>
        <Trophy size={28} />
      </div>
    </Squish>
  );
}

export function Trilha() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [open, setOpen] = useState<Lesson | null>(null);
  const [challenge, setChallenge] = useState<UnitId | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const def = goalDef(t.goal?.id);
  const GoalIcon = GOAL_ICON[def.id] ?? Target;
  const challengeState = (u: UnitId): NodeState => (t.unitPassed(u) ? "done" : t.unitDone(u) ? "current" : "locked");

  const back = () => {
    const d = deltaToIa() ?? deltaToHome();
    if (d !== undefined) navigate(d);
    else navigate("/home", { replace: true, state: { tab: true } });
  };

  const stateOf = (l: Lesson): NodeState => (t.done(l.id) ? "done" : t.unlocked(l.id) ? "current" : "locked");
  const openState = open ? stateOf(open) : undefined;

  return (
    <Screen
      bg="bg-[#FBF6F0]"
      statusTone="light"
      statusBg="bg-[#0E1846]"
      header={
        <div className="relative shrink-0 overflow-hidden rounded-b-[28px] px-4 pb-4 text-white">
          <HeroBg radius="0 0 28px 28px" />
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <motion.span className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#3B5BFF]/30 blur-3xl" animate={{ x: [0, 30, 0], y: [0, 20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
            <motion.span className="absolute -right-12 top-6 h-44 w-44 rounded-full bg-[#9B4DFF]/30 blur-3xl" animate={{ x: [0, -25, 0], y: [0, 25, 0] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }} />
            <motion.span className="absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-[#FF6200]/25 blur-3xl" animate={{ x: [0, 20, 0] }} transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }} />
            <Noise />
          </div>
          <div className="relative">
          <div className="flex h-[48px] items-center gap-2">
            <Squish aria-label="Voltar" onClick={back} className="-ml-1 flex h-10 w-10 items-center justify-center" scale={0.88}>
              <ChevronLeft size={28} strokeWidth={1.6} />
            </Squish>
            <Wordmark className="flex-1 text-[19px]" />
            <Squish aria-label="Sobre a AcademIA.I" onClick={() => navigate("/academia/intro")} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" scale={0.88}>
              <Info size={19} />
            </Squish>
          </div>
          <div className="mt-1 flex items-center gap-2 rounded-[18px] bg-white/10 p-3">
          <Squish onClick={() => navigate("/cofrinhos", { state: { fromAcademia: true } })} className="flex min-w-0 flex-1 items-center gap-3 text-left" scale={0.98}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px]" style={{ background: `linear-gradient(135deg, ${def.from}, ${def.to})` }}>
              <GoalIcon size={20} color="white" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <span className="truncate text-[15px] font-semibold">{t.goal?.name ?? "Seu objetivo"}</span>
                <span className="text-[12px] text-white/70">{t.goal ? `${brl(t.goal.savedCents, false)} de ${brl(t.goal.targetCents, false)}` : ""}</span>
              </div>
              <div className="mt-[6px] h-[6px] overflow-hidden rounded-full bg-white/15">
                <motion.div className="h-full rounded-full bg-[#EC7000]" initial={{ width: 0 }} animate={{ width: `${Math.max(t.goalPct, 3)}%` }} />
              </div>
            </div>
          </Squish>
          <Squish aria-label="Trocar objetivo" onClick={() => setGoalOpen(true)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10" scale={0.9}>
            <Pencil size={16} />
          </Squish>
          </div>
          <div className="mt-3 flex gap-2 text-[13px] font-semibold">
            <span className="flex items-center gap-1 rounded-full bg-[#EC7000] px-3 py-[5px]">
              <Star size={14} fill="white" /> <Odometer value={t.points} /> Pontos Itaú
            </span>
            <StreakChip />
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-[5px]">
              <Check size={14} /> {t.completed.length}
            </span>
          </div>
          <ExpiryNote className="mt-2 !bg-white/10 !text-white" />
          </div>
        </div>
      }
      footer={<AcademiaTabs />}
      overlay={<IaFab bottom={100} />}
      scrollClassName="[background-image:radial-gradient(#EADFD3_1px,transparent_1px)] [background-size:18px_18px]"
    >
      <div className="px-4 pb-8 pt-5">
        <div className="mb-2 overflow-hidden rounded-[18px] border border-[#EADFD3] bg-white">
          <Squish onClick={() => setInfoOpen((v) => !v)} aria-expanded={infoOpen} className="flex w-full items-center gap-2 px-4 py-3 text-left" scale={0.99}>
            <Sparkles size={14} color="#EC7000" />
            <span className="min-w-0 flex-1 truncate text-[12px] font-bold uppercase tracking-wider text-[#EC7000]">
              Trilha {t.trailNow.n} · {t.trailNow.source === "ia" ? "montada pela IA.I" : "montada pelas suas respostas"}
            </span>
            <ChevronDown size={18} color="#8A7B6C" className={`transition-transform ${infoOpen ? "rotate-180" : ""}`} />
          </Squish>
          <AnimatePresence initial={false}>
            {infoOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-4">
                  <div className="text-[17px] font-bold text-[#14215A]">{t.trailNow.title}</div>
                  {t.trailNow.intro && <p className="mt-1 text-[14px] leading-snug text-[#6C6257]">{t.trailNow.intro}</p>}
                  <div className="mt-2 text-[12px] text-[#8A7B6C]">Pontos de missões e desafios: {fmtMult(t.multiplier)} pela sua sequência.</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Squish onClick={() => navigate("/academia/nova-trilha")} className="mb-5 flex w-full items-center gap-2 rounded-[14px] border border-dashed border-[#D9CBBB] bg-white/70 px-3 py-2 text-left" scale={0.98}>
          <Wand2 size={16} color="#EC7000" />
          <span className="flex-1 text-[13px] font-semibold text-[#14215A]">Quer aprender outra coisa? Trocar trilha</span>
          <ChevronRight size={16} color="#8A7B6C" />
        </Squish>
        {t.trailUnits.map((u, ui) => {
          const lessons = lessonsOf(u.id);
          const why = t.trailNow.units.find((x) => x.id === u.id)?.why;
          const doneN = lessons.filter((l) => t.done(l.id)).length;
          const cur = lessons.findIndex((l) => stateOf(l) === "current");
          const nodes = lessons.length + 1;
          const progress = doneN === 0 ? 0 : (cur === -1 ? lessons.length : cur) / Math.max(nodes - 1, 1);
          const cState = challengeState(u.id);
          return (
            <section key={u.id} className="mb-6">
              <div className="relative overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(20,33,90,0.06)]">
                <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[96px] font-black leading-none" style={{ color: u.accent, opacity: 0.08 }}>
                  {String(ui + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: u.accent }}>
                    Unidade {ui + 1}
                  </span>
                  <span className="rounded-full bg-[#EFE7DE] px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider text-[#8A7B6C]">Nível {u.level}</span>
                </div>
                <div className="mt-2 text-[20px] font-bold text-[#14215A]">{u.name}</div>
                <div className="text-[14px] text-[#6C6257]">{u.tagline}</div>
                {why && (
                  <div className="mt-2 flex items-start gap-1 text-[13px] leading-snug text-[#8A4B00]">
                    <Sparkles size={13} className="mt-[2px] shrink-0" /> {why}
                  </div>
                )}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex flex-1 gap-[3px]">
                    {lessons.map((l) => (
                      <span key={l.id} className="h-[5px] flex-1 rounded-full" style={{ background: t.done(l.id) ? u.accent : "#EFE7DE" }} />
                    ))}
                  </div>
                  <span className="text-[12px] font-semibold tabular-nums text-[#6C6257]">
                    {doneN}/{lessons.length}
                  </span>
                </div>
              </div>

              <div className="relative mt-2" style={{ height: nodes * ROW }}>
                <Snake n={nodes} progress={progress} />
                {lessons.map((l, i) => {
                  const x = xAt(i);
                  const st = stateOf(l);
                  const labelRight = x < 55;
                  return (
                    <div key={l.id} className="absolute" style={{ top: i * ROW + ROW / 2 - TILE / 2, left: `calc(${x}% - ${TILE / 2}px)`, zIndex: st === "current" ? 2 : 1 }}>
                      <Tile num={i + 1} state={st} onClick={() => setOpen(l)} />
                      <Squish
                        onClick={() => setOpen(l)}
                        className={`absolute top-1/2 w-[128px] -translate-y-1/2 text-left ${labelRight ? "left-[76px]" : "right-[76px] text-right"}`}
                        scale={0.97}
                      >
                        {st === "current" && <div className="text-[11px] font-bold uppercase tracking-wider text-[#EC7000]">Você está aqui</div>}
                        <div className={`text-[14px] font-semibold leading-tight ${st === "soon" || st === "locked" ? "text-[#A89A8B]" : "text-[#14215A]"}`}>{l.title}</div>
                        {st === "done" && t.deepSeen.includes(l.id) && (
                          <div className={`mt-1 flex items-center gap-1 text-[11px] text-[#8A7B6C] ${labelRight ? "" : "justify-end"}`}>
                            <BookOpen size={11} /> aprofundado
                          </div>
                        )}
                      </Squish>
                    </div>
                  );
                })}
                {(() => {
                  const x = xAt(lessons.length);
                  const labelRight = x < 55;
                  const size = TILE + 8;
                  return (
                    <div className="absolute" style={{ top: lessons.length * ROW + ROW / 2 - size / 2, left: `calc(${x}% - ${size / 2}px)`, zIndex: 1 }}>
                      <ChallengeTile state={cState} onClick={() => setChallenge(u.id)} />
                      <Squish onClick={() => setChallenge(u.id)} className={`absolute top-1/2 w-[140px] -translate-y-1/2 text-left ${labelRight ? "left-[82px]" : "right-[82px] text-right"}`} scale={0.97}>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#EC7000]">Fim da unidade · opcional</div>
                        <div className={`text-[14px] font-semibold leading-tight ${cState === "locked" || cState === "soon" ? "text-[#A89A8B]" : "text-[#14215A]"}`}>
                          Desafio: vale Pontos Itaú
                        </div>
                        {t.unitBest[u.id] !== undefined && <div className="text-[11px] text-[#8A7B6C]">melhor: {t.unitBest[u.id]}/{unitQuiz(u.id).length}</div>}
                      </Squish>
                    </div>
                  );
                })()}
              </div>
            </section>
          );
        })}
        {t.trailDone && (
        <Squish
          onClick={() => navigate("/academia/nova-trilha")}
          className={`flex w-full items-center gap-3 rounded-[22px] p-4 text-left ${t.trailDone ? "bg-gradient-to-br from-[#14215A] to-[#2B3A87] text-white" : "border border-dashed border-[#D9CBBB] bg-white text-[#14215A]"}`}
          scale={0.98}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EC7000]">
            <Wand2 size={20} color="white" />
          </span>
          <div className="flex-1">
            <div className="text-[16px] font-bold">{t.trailDone ? "Trilha concluída! Bora pra próxima?" : "Quer aprender outra coisa?"}</div>
            <div className={`text-[13px] leading-snug ${t.trailDone ? "text-white/80" : "text-[#6C6257]"}`}>
              Conta pra IA.I o que você quer entender agora e ela monta sua próxima trilha.
            </div>
          </div>
        </Squish>
        )}
      </div>

      <BottomSheet open={!!open} onClose={() => setOpen(null)} title={open?.title ?? ""}>
        {open && (
          <div>
            <p className="-mt-2 text-[15px] leading-snug text-[#4A4A4A]">{open.learn}</p>
            {openState === "locked" ? (
              <div className="mt-4 rounded-[16px] bg-[#FBF6F0] p-4 text-[14px] text-[#6C6257]">Conclua a lição anterior da trilha pra liberar esta.</div>
            ) : (
              <>
                <div className="mt-3 flex gap-2 text-[13px] font-semibold text-[#14215A]">
                  <span className="flex items-center gap-1 rounded-full bg-[#EEF0F8] px-3 py-1">
                    <Clock size={13} /> ~3 min
                  </span>
                  <span className="rounded-full bg-[#EEF0F8] px-3 py-1">{open.steps.length} cards</span>
                  {openState === "done" && <span className="rounded-full bg-[#FFE9D6] px-3 py-1 text-[#EC7000]">Concluída</span>}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  {openState === "done" && <PillButton label="Ler aprofundamento (sem pontos)" tone="orange" onClick={() => navigate(`/academia/licao/${open.id}/aprofundar`)} />}
                  <PillButton label={openState === "done" ? "Refazer a lição" : "Começar lição"} tone={openState === "done" ? "navy" : "orange"} onClick={() => navigate(`/academia/licao/${open.id}`)} />
                </div>
              </>
            )}
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={challenge !== null} onClose={() => setChallenge(null)} title={challenge ? `Desafio: ${unitDef(challenge)?.name ?? ""}` : ""}>
        {challenge !== null && (() => {
          const cs = challengeState(challenge);
          const total = unitQuiz(challenge).length;
          return (
            <div>
              <p className="-mt-2 text-[15px] leading-snug text-[#4A4A4A]">
                Opcional. Um resumo pra aprofundar e um quiz de {total} perguntas. Com {unitPass(challenge)}+ acertos você ganha {UNIT_POINTS_PER_RIGHT} Pontos Itaú por acerto, × {fmtMult(t.multiplier)} da sua sequência.
              </p>
              {cs === "locked" ? (
                <div className="mt-4 rounded-[16px] bg-[#FBF6F0] p-4 text-[14px] text-[#6C6257]">Conclua todas as lições da unidade pra liberar o desafio.</div>
              ) : (
                <div className="mt-5">
                  <PillButton label={cs === "done" ? "Refazer o desafio" : "Abrir desafio"} tone="orange" onClick={() => navigate(`/academia/desafio/${challenge}`)} />
                </div>
              )}
            </div>
          );
        })()}
      </BottomSheet>
      <GoalSheet open={goalOpen} onClose={() => setGoalOpen(false)} />
    </Screen>
  );
}
