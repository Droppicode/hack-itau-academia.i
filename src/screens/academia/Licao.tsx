import { motion } from "framer-motion";
import { Brain, Clock, Flame, Lock, Target, Trophy } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IaiAvatar } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { LESSONS, MISSIONS, type Step } from "../../data/trilha";
import { STREAK_BONUS, useTrilha } from "../../state/TrilhaContext";
import { CheckFooter, PlayerShell, QuestionBody, useAnswer } from "./Exercise";

const asQuestion = (s: Exclude<Step, { kind: "info" }>) =>
  s.kind === "tf" ? { q: s.q, options: ["Verdadeiro", "Falso"], right: s.right ? 0 : 1, why: s.why } : { q: s.q, options: s.options, right: s.right, why: s.why };

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

  if (!lesson || !t.unlocked(lesson.id)) {
    return (
      <Screen>
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <Lock size={40} color="#999" />
          <div className="text-[18px] font-semibold">Essa lição ainda está bloqueada</div>
          <Squish onClick={() => navigate("/academia/trilha", { replace: true })} className="rounded-[12px] bg-itau-orange px-6 py-3 font-semibold text-white">
            Ir pra trilha
          </Squish>
        </div>
      </Screen>
    );
  }

  if (finished) {
    const secs = Math.max(Math.round((Date.now() - start.current) / 1000), 1);
    const acc = Math.round((lesson.steps.filter((s) => s.kind !== "info").length / (lesson.steps.filter((s) => s.kind !== "info").length + misses)) * 100);
    const kept = t.streak > streakBefore && t.streak >= 2;
    return (
      <Screen>
        <div className="flex min-h-full flex-col items-center px-6 pb-8 pt-10 text-center">
          <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 12 }} className="flex h-[110px] w-[110px] items-center justify-center rounded-full bg-[#FFC400]">
            <Trophy size={56} color="white" />
          </motion.div>
          <h1 className="mt-6 text-[26px] font-bold text-[#1F9D55]">Lição concluída!</h1>
          <p className="mt-1 text-[16px] text-[#555]">{lesson.title}</p>
          <div className="mt-6 grid w-full grid-cols-3 gap-2">
            {[
              { Icon: Target, l: "Precisão", v: `${acc}%`, c: "#1F9D55" },
              { Icon: Clock, l: "Tempo", v: `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`, c: "#1F2A63" },
              { Icon: Flame, l: "Sequência", v: `${t.streak} sem`, c: "#FF6200" },
            ].map(({ Icon, l, v, c }) => (
              <div key={l} className="rounded-[14px] border-2 p-2" style={{ borderColor: c }}>
                <div className="text-[12px] font-bold uppercase" style={{ color: c }}>
                  {l}
                </div>
                <div className="mt-1 flex items-center justify-center gap-1 text-[18px] font-bold text-[#333]">
                  <Icon size={16} color={c} /> {v}
                </div>
              </div>
            ))}
          </div>
          {kept && <div className="mt-3 text-[14px] font-semibold text-itau-orange">Sequência mantida: +{STREAK_BONUS} pts de bônus</div>}

          {unlocks.length > 0 && (
            <div className="mt-5 w-full rounded-[16px] bg-[#FFF6EF] p-4 text-left">
              <div className="text-[13px] font-bold uppercase text-itau-orange">Missão liberada</div>
              {unlocks.map((m) => (
                <div key={m.id} className="mt-1 text-[15px] font-semibold text-[#333]">
                  {m.title} · +{m.points} pts
                </div>
              ))}
            </div>
          )}

          <div className="mt-5 w-full rounded-[16px] bg-[#EEF1FB] p-4 text-left">
            <div className="flex items-center gap-2 text-[15px] font-bold text-[#1F2A63]">
              <Brain size={18} /> Quer ganhar pontos?
            </div>
            <div className="mt-1 text-[14px] text-[#444]">Leia o aprofundamento e faça o quiz. Acertou 3 de 4 ou mais: 25 pts por acerto no Minhas Vantagens.</div>
          </div>
          <div className="mt-auto w-full pt-6">
            <Squish onClick={() => navigate(`/academia/licao/${lesson.id}/aprofundar`, { replace: true })} className="w-full rounded-[14px] border-b-[4px] border-[#137540] bg-[#1F9D55] py-[13px] text-center text-[16px] font-bold uppercase text-white" scale={0.97}>
              Aprofundar + quiz
            </Squish>
            <Squish onClick={() => navigate(-1)} className="mt-3 w-full py-2 text-center text-[15px] font-semibold text-[#1F2A63]" scale={0.97}>
              Voltar pra trilha
            </Squish>
          </div>
        </div>
      </Screen>
    );
  }

  const step = lesson.steps[queue[pos]];
  const pct = (pos / queue.length) * 100;
  const advance = () => {
    a.reset();
    if (pos + 1 >= queue.length) {
      t.completeLesson(lesson.id);
      setFinished(true);
    } else setPos(pos + 1);
  };

  if (step.kind === "info") {
    return (
      <PlayerShell
        pct={pct}
        onClose={() => navigate(-1)}
        footer={
          <div className="shrink-0 px-5 pt-4" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
            <Squish onClick={advance} className="w-full rounded-[14px] border-b-[4px] border-[#137540] bg-[#1F9D55] py-[13px] text-center text-[16px] font-bold uppercase text-white" scale={0.97}>
              Entendi
            </Squish>
          </div>
        }
      >
        <motion.div key={pos} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="px-5 pt-6">
          <div className="text-[13px] font-bold uppercase tracking-wide text-itau-orange">Novo conceito</div>
          <div className="mt-4 flex items-center gap-3">
            <IaiAvatar size={48} />
            <h1 className="text-[24px] font-bold leading-tight text-[#222]">{step.title}</h1>
          </div>
          <p className="mt-5 rounded-[16px] bg-[#F4F4F4] p-4 text-[18px] leading-snug text-[#333]">{step.text}</p>
        </motion.div>
      </PlayerShell>
    );
  }

  const q = asQuestion(step);
  const ok = a.picked === q.right;

  return (
    <PlayerShell
      pct={pct}
      onClose={() => navigate(-1)}
      footer={
        <CheckFooter
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
      <motion.div key={pos} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
        <QuestionBody {...q} picked={a.picked} checked={a.checked} onPick={a.setPicked} label={step.kind === "tf" ? "Verdadeiro ou falso?" : "Escolha a resposta"} />
      </motion.div>
    </PlayerShell>
  );
}
