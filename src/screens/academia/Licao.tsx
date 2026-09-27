import { AnimatePresence, motion } from "framer-motion";
import { goBack } from "../../state/goBack";
import { BookOpen, Clock, Flame, Lock, MessageSquareQuote, Target, Trophy, Unlock } from "lucide-react";
import { StreakChip } from "../../components/Streak";
import { AiBackdrop, Confetti, CountUp, DrawCheck, haptic } from "../../components/fx";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IaiAvatar } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { findLesson, fmtMult, MISSIONS, unitDef, type Step } from "../../data/trilha";
import { useTrilha } from "../../state/TrilhaContext";
import { CheckFooter, FooterWrap, PillButton, PlayerShell, QuestionBody, useAnswer } from "./Exercise";

const asQuestion = (s: Exclude<Step, { kind: "info" }>) =>
  s.kind === "tf" ? { q: s.q, options: ["Verdadeiro", "Falso"], right: s.right ? 0 : 1, why: s.why } : { q: s.q, options: s.options, right: s.right, why: s.why };

const NUM = /(R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d+)?%)/g;

const parseNum = (s: string) => Number(s.replace(/[^\d,]/g, "").replace(",", "."));

export function StoryText({ text }: { text: string }) {
  return (
    <>
      {text.split(NUM).map((part, i) => {
        if (i % 2 === 0) return part;
        const money = part.startsWith("R$");
        const n = parseNum(part);
        const dec = /,\d+/.test(part) ? (part.match(/,(\d+)/)?.[1].length ?? 0) : 0;
        const fmt = (v: number) => (money ? "R$ " : "") + v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (money ? "" : "%");
        return <CountUp key={i} to={n} delay={0.25} duration={1} format={fmt} className="font-bold text-[#EC7000]" />;
      })}
    </>
  );
}

export function Slide({ k, children }: { k: string | number; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={k} initial={{ opacity: 0, x: 56 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -56 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function CelebrationShell({ children }: { children: ReactNode }) {
  return (
    <AiBackdrop className="absolute inset-0">
      <Confetti />
      <div className="no-scrollbar h-full overflow-y-auto" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        {children}
      </div>
    </AiBackdrop>
  );
}

export function PointsBurst({ pts, base, mult, note }: { pts: number; base: number; mult: number; note: string }) {
  return (
    <div className="relative mt-5 rounded-[20px] bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
      {mult > 1 && (
        <motion.span
          initial={{ scale: 3, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: -8 }}
          transition={{ delay: 1.3, type: "spring", stiffness: 380, damping: 14 }}
          className="absolute -right-2 -top-3 rounded-full bg-gradient-to-br from-[#FFB23D] to-[#EC7000] px-3 py-[3px] text-[14px] font-extrabold text-white shadow-[0_6px_16px_rgba(236,112,0,0.5)]"
        >
          ×{fmtMult(mult).replace(/x$/, "")}
        </motion.span>
      )}
      <div className="text-[40px] font-extrabold leading-none">
        +<CountUp to={pts} from={0} delay={0.5} duration={mult > 1 ? 1.6 : 1.1} />
        <span className="ml-1 text-[18px] font-bold text-white/80">pts</span>
      </div>
      <div className="mt-1 text-[13px] text-white/75">{mult > 1 ? `${base} pts × sequência · ${note}` : note}</div>
    </div>
  );
}

export function Medal({ children, tone = "#EC7000" }: { children: React.ReactNode; tone?: string }) {
  return (
    <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 13 }} className="relative h-[124px] w-[124px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0">
        <path d="M50 3 91 26v48L50 97 9 74V26z" fill={tone} />
        <path d="M50 13 82 31v38L50 87 18 69V31z" fill="none" stroke="white" strokeOpacity={0.5} strokeWidth={2} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </motion.div>
  );
}

export function Licao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTrilha();
  const lesson = findLesson(id ?? "");
  const [queue, setQueue] = useState<number[]>(() => (lesson ? lesson.steps.map((_, i) => i) : []));
  const [pos, setPos] = useState(0);
  const [misses, setMisses] = useState(0);
  const [finished, setFinished] = useState(false);
  const [doneBefore] = useState(t.completed.length);
  const [weekLessonsBefore] = useState(t.weekLessons);
  const [hits, setHits] = useState(0);
  useEffect(() => {
    if (finished) haptic([20, 40, 60]);
  }, [finished]);
  const start = useRef(Date.now());
  const a = useAnswer();

  if (!lesson || !t.unlocked(lesson.id)) {
    return (
      <Screen bg="bg-[#FBF6F0]">
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <Lock size={40} color="#A89A8B" />
          <div className="text-[18px] font-semibold text-[#14215A]">Essa lição ainda está bloqueada</div>
          <div className="w-full">
            <PillButton label="Ir pra trilha" onClick={() => navigate("/academia/trilha", { replace: true })} />
          </div>
        </div>
      </Screen>
    );
  }

  if (finished) {
    const secs = Math.max(Math.round((Date.now() - start.current) / 1000), 1);
    const qs = lesson.steps.filter((s) => s.kind !== "info").length;
    const acc = Math.round((qs / (qs + misses)) * 100);
    const unlocks = MISSIONS.filter((m) => doneBefore < m.unlockAfter && t.completed.length >= m.unlockAfter);
    const unitComplete = t.unitDone(lesson.unit);
    const weekly = t.missions.find((m) => m.id === "w-licoes");
    const justDone = weekly && weekly.status === "concluída" && weekLessonsBefore < weekly.goal;
    return (
      <CelebrationShell>
        <div className="flex min-h-full flex-col px-6 pb-8 pt-8 text-white">
          <div className="flex flex-col items-center text-center">
            <DrawCheck size={104} />
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#FFB27A]">
              Lição concluída
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-1 text-[24px] font-bold leading-tight">
              {lesson.title}
            </motion.h1>
          </div>
          {justDone && weekly ? (
            <PointsBurst pts={Math.round(weekly.points * t.multiplier)} base={weekly.points} mult={t.multiplier} note={`missão "${weekly.title}" pronta pra resgatar`} />
          ) : (
            weekly &&
            weekly.status !== "bloqueada" &&
            weekly.status !== "resgatada" && (
              <div className="mt-5 rounded-[16px] bg-white/10 px-4 py-3 text-center text-[14px] text-white/85">
                Missão da semana: <b className="text-white">{weekly.progress}/{weekly.goal} lições</b> · vale +{Math.round(weekly.points * t.multiplier)} pts
              </div>
            )
          )}
          <div className="mt-4 flex justify-center gap-2">
            {[
              { Icon: Target, v: `${acc}%`, l: "precisão" },
              { Icon: Clock, v: `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`, l: "tempo" },
              { Icon: Flame, v: `${t.streak}`, l: t.streak === 1 ? "semana" : "semanas" },
            ].map(({ Icon, v, l }, i) => (
              <motion.div key={l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 + i * 0.08 }} className="flex flex-1 flex-col items-center rounded-[16px] bg-white/10 py-3">
                <Icon size={18} color="#FFB27A" />
                <div className="mt-1 text-[18px] font-bold tabular-nums">{v}</div>
                <div className="text-[12px] text-white/70">{l}</div>
              </motion.div>
            ))}
          </div>
          <div className="mt-3 flex justify-center">
            <StreakChip />
          </div>

          {unlocks.length > 0 && (
            <div className="mt-5 rounded-[18px] bg-white p-4 text-[#14215A]">
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#EC7000]">
                <Unlock size={14} /> Missão desbloqueada
              </div>
              {unlocks.map((m) => (
                <div key={m.id} className="mt-1 flex justify-between text-[15px] font-semibold">
                  <span>{m.title}</span>
                  <span className="text-[#EC7000]">{m.kind === "mensal" ? `até ${m.points} pts` : `+${m.points} pts`}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-start gap-3 rounded-[18px] bg-white/10 p-4">
            {unitComplete ? <Trophy size={20} color="#FFB27A" className="mt-[2px] shrink-0" /> : <BookOpen size={20} color="#FFB27A" className="mt-[2px] shrink-0" />}
            <div className="text-[14px] leading-snug text-white/90">
              {unitComplete ? (
                <>
                  <b className="text-white">{unitDef(lesson.unit)?.name} concluída!</b> O desafio final é opcional e vale Pontos Itaú.
                </>
              ) : (
                <>
                  <b className="text-white">Quer entender melhor?</b> O aprofundamento é só leitura, sem pontos.
                </>
              )}
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-6">
            {unitComplete && <PillButton label="Ir pro desafio da unidade" tone="orange" onClick={() => navigate(`/academia/desafio/${lesson.unit}`, { replace: true })} />}
            <PillButton label="Ler aprofundamento" tone={unitComplete ? "navy" : "orange"} onClick={() => navigate(`/academia/licao/${lesson.id}/aprofundar`, { replace: true })} />
            <Squish onClick={() => goBack(navigate)} className="py-3 text-center text-[15px] font-semibold text-white/85" scale={0.97}>
              Voltar pra trilha
            </Squish>
          </div>
        </div>
      </CelebrationShell>
    );
  }

  const idx = queue[pos];
  const step = lesson.steps[idx];
  const review = queue.indexOf(idx) < pos;
  const advance = () => {
    a.reset();
    if (pos + 1 >= queue.length) {
      t.completeLesson(lesson.id);
      setFinished(true);
    } else setPos(pos + 1);
  };
  const shell = { total: queue.length, pos, onClose: () => goBack(navigate), tag: `${unitDef(lesson.unit)?.name ?? "Lição"} · ${lesson.title}`, stars: hits };

  if (step.kind === "info") {
    return (
      <PlayerShell
        {...shell}
        footer={
          <FooterWrap>
            <PillButton label="Entendi" onClick={advance} />
          </FooterWrap>
        }
      >
        <Slide k={pos}>
        <div className="px-5 pt-4">
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_24px_rgba(20,33,90,0.08)]">
            <div className="bg-[#14215A] px-5 pb-5 pt-4 text-white">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#FFB27A]">Vocabulário</div>
              <div className="mt-1 text-[26px] font-bold leading-tight">{step.term}</div>
            </div>
            <p className="px-5 pt-4 text-[18px] leading-snug text-[#2A2F4A]">
              <StoryText text={step.text} />
            </p>
            {step.example ? (
              <div className="m-5 flex gap-3 rounded-[16px] bg-[#FFE9D6] p-4">
                <MessageSquareQuote size={20} color="#EC7000" className="mt-[2px] shrink-0" />
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wide text-[#EC7000]">No dia a dia</div>
                  <div className="text-[15px] leading-snug text-[#5A3A1E]">
                    <StoryText text={step.example} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-5" />
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 px-1 text-[13px] text-[#8A7B6C]">
            <IaiAvatar size={20} /> Guarde essa palavra: ela aparece na próxima pergunta.
          </div>
        </div>
        </Slide>
      </PlayerShell>
    );
  }

  const q = asQuestion(step);
  const ok = a.picked === q.right;
  return (
    <PlayerShell
      {...shell}
      footer={
        <CheckFooter
          requeue
          picked={a.picked}
          checked={a.checked}
          ok={ok}
          why={ok ? q.why : `Resposta: ${q.options[q.right]}. ${q.why}`}
          onCheck={() => {
            a.setChecked(true);
            if (ok) {
              haptic(15);
              if (!review) setHits((h) => h + 1);
            } else {
              haptic([30, 40, 30]);
              setMisses((m) => m + 1);
              setQueue((qq) => [...qq, qq[pos]]);
            }
          }}
          onNext={advance}
        />
      }
    >
      <Slide k={pos}>
        <QuestionBody {...q} review={review} picked={a.picked} checked={a.checked} onPick={a.setPicked} label={step.kind === "tf" ? "Verdadeiro ou falso" : "Escolha uma"} />
      </Slide>
    </PlayerShell>
  );
}
