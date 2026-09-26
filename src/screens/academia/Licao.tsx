import { motion } from "framer-motion";
import { Brain, Clock, Flame, Lock, MessageSquareQuote, Target, Unlock } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IaiAvatar } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { LESSONS, MISSIONS, type Step } from "../../data/trilha";
import { STREAK_BONUS, useTrilha } from "../../state/TrilhaContext";
import { CheckFooter, FooterWrap, PillButton, PlayerShell, QuestionBody, useAnswer } from "./Exercise";

const asQuestion = (s: Exclude<Step, { kind: "info" }>) =>
  s.kind === "tf" ? { q: s.q, options: ["Verdadeiro", "Falso"], right: s.right ? 0 : 1, why: s.why } : { q: s.q, options: s.options, right: s.right, why: s.why };

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
  const lesson = LESSONS.find((l) => l.id === id);
  const [queue, setQueue] = useState<number[]>(() => (lesson ? lesson.steps.map((_, i) => i) : []));
  const [pos, setPos] = useState(0);
  const [misses, setMisses] = useState(0);
  const [finished, setFinished] = useState(false);
  const [streakBefore] = useState(t.streak);
  const start = useRef(Date.now());
  const a = useAnswer();
  const unlocks = useMemo(() => MISSIONS.filter((m) => m.unlock === id), [id]);

  if (!lesson || lesson.soon || !t.unlocked(lesson.id)) {
    return (
      <Screen bg="bg-[#FBF6F0]">
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <Lock size={40} color="#A89A8B" />
          <div className="text-[18px] font-semibold text-[#14215A]">{lesson?.soon ? "Essa lição chega em breve" : "Essa lição ainda está bloqueada"}</div>
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
    const kept = t.streak > streakBefore && t.streak >= 2;
    return (
      <Screen bg="bg-[#14215A]" statusTone="light">
        <div className="flex min-h-full flex-col px-6 pb-8 pt-8 text-white">
          <div className="flex flex-col items-center text-center">
            <Medal>
              <span className="text-[30px] font-bold">{lesson.id.replace("L", "").padStart(2, "0")}</span>
            </Medal>
            <div className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#FFB27A]">Lição concluída</div>
            <h1 className="mt-1 text-[24px] font-bold leading-tight">{lesson.title}</h1>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            {[
              { Icon: Target, v: `${acc}%`, l: "precisão" },
              { Icon: Clock, v: `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`, l: "tempo" },
              { Icon: Flame, v: `${t.streak}`, l: t.streak === 1 ? "semana" : "semanas" },
            ].map(({ Icon, v, l }) => (
              <div key={l} className="flex flex-1 flex-col items-center rounded-[16px] bg-white/10 py-3">
                <Icon size={18} color="#FFB27A" />
                <div className="mt-1 text-[18px] font-bold tabular-nums">{v}</div>
                <div className="text-[12px] text-white/70">{l}</div>
              </div>
            ))}
          </div>
          {kept && <div className="mt-3 text-center text-[14px] font-semibold text-[#FFB27A]">Sequência mantida · +{STREAK_BONUS} pts</div>}

          {unlocks.length > 0 && (
            <div className="mt-5 rounded-[18px] bg-white p-4 text-[#14215A]">
              <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-[#EC7000]">
                <Unlock size={14} /> Missão desbloqueada
              </div>
              {unlocks.map((m) => (
                <div key={m.id} className="mt-1 flex justify-between text-[15px] font-semibold">
                  <span>{m.title}</span>
                  <span className="text-[#EC7000]">+{m.points}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 flex items-start gap-3 rounded-[18px] bg-white/10 p-4">
            <Brain size={20} color="#FFB27A" className="mt-[2px] shrink-0" />
            <div className="text-[14px] leading-snug text-white/90">
              <b className="text-white">Quer pontos?</b> Leia o aprofundamento e faça o quiz. 3 de 4 ou mais = 25 pts por acerto no Minhas Vantagens.
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-2 pt-6">
            <PillButton label="Aprofundar e fazer o quiz" tone="orange" onClick={() => navigate(`/academia/licao/${lesson.id}/aprofundar`, { replace: true })} />
            <Squish onClick={() => navigate(-1)} className="py-3 text-center text-[15px] font-semibold text-white/85" scale={0.97}>
              Voltar pra trilha
            </Squish>
          </div>
        </div>
      </Screen>
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
  const shell = { total: queue.length, pos, onClose: () => navigate(-1), tag: `Lição ${lesson.id.slice(1)} · ${lesson.title}` };

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
        <motion.div key={pos} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="px-5 pt-4">
          <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_8px_24px_rgba(20,33,90,0.08)]">
            <div className="bg-[#14215A] px-5 pb-5 pt-4 text-white">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#FFB27A]">Vocabulário</div>
              <div className="mt-1 text-[26px] font-bold leading-tight">{step.term}</div>
            </div>
            <p className="px-5 pt-4 text-[18px] leading-snug text-[#2A2F4A]">{step.text}</p>
            {step.example ? (
              <div className="m-5 flex gap-3 rounded-[16px] bg-[#FFE9D6] p-4">
                <MessageSquareQuote size={20} color="#EC7000" className="mt-[2px] shrink-0" />
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wide text-[#EC7000]">No dia a dia</div>
                  <div className="text-[15px] leading-snug text-[#5A3A1E]">{step.example}</div>
                </div>
              </div>
            ) : (
              <div className="h-5" />
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 px-1 text-[13px] text-[#8A7B6C]">
            <IaiAvatar size={20} /> Guarde essa palavra: ela aparece na próxima pergunta.
          </div>
        </motion.div>
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
            if (!ok) {
              setMisses((m) => m + 1);
              setQueue((qq) => [...qq, qq[pos]]);
            }
          }}
          onNext={advance}
        />
      }
    >
      <motion.div key={pos} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <QuestionBody {...q} review={review} picked={a.picked} checked={a.checked} onPick={a.setPicked} label={step.kind === "tf" ? "Verdadeiro ou falso" : "Escolha uma"} />
      </motion.div>
    </PlayerShell>
  );
}
