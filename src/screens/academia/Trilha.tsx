import { motion } from "framer-motion";
import { Check, ChevronLeft, Clock, Flame, Info, Lock, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../../components/BottomSheet";
import { AcademiaTabs, IaiAvatar, Wordmark } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { LESSONS, QUIZ_PASS, UNITS, type Lesson } from "../../data/trilha";
import { deltaToHome } from "../../state/homeHistory";
import { useTrilha } from "../../state/TrilhaContext";
import { PillButton } from "./Exercise";

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

function QuizDots({ best }: { best?: number }) {
  return (
    <span className="flex gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-[6px] w-[6px] rounded-full" style={{ background: best !== undefined && i < best ? (best >= QUIZ_PASS ? "#EC7000" : "#B8A898") : "#E8DCCD" }} />
      ))}
    </span>
  );
}

export function Trilha() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [open, setOpen] = useState<Lesson | null>(null);

  const back = () => {
    const d = deltaToHome();
    if (d !== undefined) navigate(d);
    else navigate("/home", { replace: true, state: { tab: true } });
  };

  const stateOf = (l: Lesson): NodeState => (l.soon ? "soon" : t.done(l.id) ? "done" : t.unlocked(l.id) ? "current" : "locked");
  const openState = open ? stateOf(open) : undefined;

  return (
    <Screen
      bg="bg-[#FBF6F0]"
      statusTone="light"
      statusBg="bg-[#14215A]"
      header={
        <div className="shrink-0 rounded-b-[28px] bg-[#14215A] px-4 pb-4 text-white">
          <div className="flex h-[48px] items-center gap-2">
            <Squish aria-label="Voltar" onClick={back} className="-ml-1 flex h-10 w-10 items-center justify-center" scale={0.88}>
              <ChevronLeft size={28} strokeWidth={1.6} />
            </Squish>
            <Wordmark className="flex-1 text-[19px]" />
            <Squish aria-label="Sobre a Academia Ia.i" onClick={() => navigate("/academia/intro")} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" scale={0.88}>
              <Info size={19} />
            </Squish>
          </div>
          <div className="mt-1 flex items-center gap-3 rounded-[18px] bg-white/10 p-3">
            <IaiAvatar size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold">Nível {t.level}</span>
                <span className="text-[12px] text-white/70">{t.nextLevelAt ? `${t.nextLevelAt - t.points} pts pro próximo` : "nível máximo"}</span>
              </div>
              <div className="mt-[6px] h-[6px] overflow-hidden rounded-full bg-white/15">
                <motion.div className="h-full rounded-full bg-[#EC7000]" initial={{ width: 0 }} animate={{ width: `${Math.max(t.levelPct, 3)}%` }} />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2 text-[13px] font-semibold">
            <span className="flex items-center gap-1 rounded-full bg-[#EC7000] px-3 py-[5px]">
              <Star size={14} fill="white" /> {t.points} pts
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-[5px]">
              <Flame size={14} /> {t.streak} {t.streak === 1 ? "semana" : "semanas"}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-[5px]">
              <Check size={14} /> {t.completed.length} {t.completed.length === 1 ? "lição" : "lições"}
            </span>
          </div>
        </div>
      }
      footer={<AcademiaTabs />}
      scrollClassName="[background-image:radial-gradient(#EADFD3_1px,transparent_1px)] [background-size:18px_18px]"
    >
      <div className="px-4 pb-8 pt-5">
        {UNITS.map((u) => {
          const lessons = LESSONS.filter((l) => l.unit === u.n);
          const doneN = lessons.filter((l) => t.done(l.id)).length;
          const cur = lessons.findIndex((l) => stateOf(l) === "current");
          const progress = u.soon || doneN === 0 ? 0 : (cur === -1 ? lessons.length - 1 : cur) / Math.max(lessons.length - 1, 1);
          return (
            <section key={u.n} className={`mb-6 ${u.soon ? "opacity-70" : ""}`}>
              <div className="relative overflow-hidden rounded-[22px] bg-white p-4 shadow-[0_4px_16px_rgba(20,33,90,0.06)]">
                <span className="pointer-events-none absolute -right-2 -top-6 select-none text-[96px] font-black leading-none" style={{ color: u.accent, opacity: 0.08 }}>
                  {String(u.n).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider text-white" style={{ background: u.accent }}>
                    Unidade {u.n}
                  </span>
                  {u.soon && <span className="rounded-full bg-[#EFE7DE] px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider text-[#8A7B6C]">Em breve</span>}
                </div>
                <div className="mt-2 text-[20px] font-bold text-[#14215A]">{u.name}</div>
                <div className="text-[14px] text-[#6C6257]">{u.tagline}</div>
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

              <div className="relative mt-2" style={{ height: lessons.length * ROW }}>
                <Snake n={lessons.length} progress={progress} />
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
                        {st === "done" && (
                          <div className={`mt-1 flex ${labelRight ? "" : "justify-end"}`}>
                            <QuizDots best={t.quizBest[l.id]} />
                          </div>
                        )}
                      </Squish>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
        <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-[13px] text-[#6C6257] shadow-sm">
          <Sparkles size={14} color="#EC7000" /> Novas unidades chegando
        </div>
      </div>

      <BottomSheet open={!!open} onClose={() => setOpen(null)} title={open?.title ?? ""}>
        {open && (
          <div>
            <p className="-mt-2 text-[15px] leading-snug text-[#4A4A4A]">{open.learn}</p>
            {openState === "soon" ? (
              <div className="mt-4 rounded-[16px] bg-[#FBF6F0] p-4 text-[14px] text-[#6C6257]">Essa unidade ainda está sendo preparada. Termine a Unidade 1 enquanto isso.</div>
            ) : openState === "locked" ? (
              <div className="mt-4 rounded-[16px] bg-[#FBF6F0] p-4 text-[14px] text-[#6C6257]">Conclua a lição anterior pra liberar esta.</div>
            ) : (
              <>
                <div className="mt-3 flex gap-2 text-[13px] font-semibold text-[#14215A]">
                  <span className="flex items-center gap-1 rounded-full bg-[#EEF0F8] px-3 py-1">
                    <Clock size={13} /> ~3 min
                  </span>
                  <span className="rounded-full bg-[#EEF0F8] px-3 py-1">{open.steps.length} cards</span>
                  {openState === "done" && (
                    <span className="rounded-full bg-[#FFE9D6] px-3 py-1 text-[#EC7000]">
                      Quiz: {t.quizBest[open.id] !== undefined ? `${t.quizBest[open.id]}/4` : "não feito"}
                    </span>
                  )}
                </div>
                <div className="mt-5 flex flex-col gap-2">
                  {openState === "done" && <PillButton label="Aprofundar e fazer o quiz" tone="orange" onClick={() => navigate(`/academia/licao/${open.id}/aprofundar`)} />}
                  <PillButton label={openState === "done" ? "Refazer a lição" : "Começar lição"} tone={openState === "done" ? "navy" : "orange"} onClick={() => navigate(`/academia/licao/${open.id}`)} />
                </div>
              </>
            )}
          </div>
        )}
      </BottomSheet>
    </Screen>
  );
}
