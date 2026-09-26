import { motion } from "framer-motion";
import { BookOpen, Brain, RotateCcw, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Squish } from "../../components/Squish";
import { LESSONS, POINTS_PER_RIGHT, QUIZ_PASS } from "../../data/trilha";
import { quizPoints, useTrilha } from "../../state/TrilhaContext";
import { CheckFooter, PlayerShell, QuestionBody, useAnswer } from "./Exercise";

export function Aprofundar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTrilha();
  const lesson = LESSONS.find((l) => l.id === id);
  const [mode, setMode] = useState<"read" | "quiz" | "result">("read");
  const [n, setN] = useState(0);
  const [right, setRight] = useState(0);
  const [gained, setGained] = useState(0);
  const a = useAnswer();

  if (!lesson || !t.done(lesson.id)) {
    return (
      <Screen header={<ScreenHeader />}>
        <div className="px-6 pt-10 text-center text-[17px]">Conclua a lição na trilha pra liberar o aprofundamento.</div>
      </Screen>
    );
  }

  const best = t.quizBest[lesson.id];

  if (mode === "read") {
    return (
      <Screen
        header={<ScreenHeader />}
        footer={
          <div className="shrink-0 border-t border-[#E6E6E6] px-5 pt-4" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
            <Squish
              onClick={() => {
                setMode("quiz");
                setN(0);
                setRight(0);
                a.reset();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-[14px] border-b-[4px] border-[#137540] bg-[#1F9D55] py-[13px] text-[16px] font-bold uppercase text-white"
              scale={0.97}
            >
              <Brain size={18} /> Fazer o quiz
            </Squish>
            <div className="mt-2 text-center text-[12px] text-[#777]">
              4 perguntas · {QUIZ_PASS}+ acertos = {POINTS_PER_RIGHT} pts por acerto{best !== undefined ? ` · seu melhor: ${best}/4` : ""}
            </div>
          </div>
        }
      >
        <div className="px-5 pb-8">
          <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-itau-orange">
            <BookOpen size={16} /> Aprofundamento · opcional
          </div>
          <h1 className="mt-2 text-[26px] font-bold leading-tight text-[#222]">{lesson.title}</h1>
          {lesson.deep.map((d, i) => (
            <motion.section key={d.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="mt-5">
              <h2 className="text-[18px] font-bold text-[#1F2A63]">{d.title}</h2>
              <p className="mt-1 text-[16px] leading-relaxed text-[#444]">{d.text}</p>
            </motion.section>
          ))}
          <p className="mt-6 text-[12px] text-[#888]">Conteúdo educacional simplificado. Não é recomendação financeira.</p>
        </div>
      </Screen>
    );
  }

  if (mode === "result") {
    const pass = right >= QUIZ_PASS;
    return (
      <Screen>
        <div className="flex min-h-full flex-col items-center px-6 pb-8 pt-12 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 12 }} className={`flex h-[110px] w-[110px] items-center justify-center rounded-full ${pass ? "bg-[#1F9D55]" : "bg-[#FFB27F]"}`}>
            {pass ? <Star size={56} color="white" fill="white" /> : <RotateCcw size={50} color="white" />}
          </motion.div>
          <h1 className="mt-6 text-[26px] font-bold text-[#222]">{pass ? "Quiz aprovado!" : "Faltou pouco"}</h1>
          <p className="mt-1 text-[17px] text-[#555]">
            Você acertou <b>{right} de 4</b> ({right * 25}%)
          </p>
          <div className="mt-6 w-full rounded-[16px] bg-[#EEF1FB] p-4">
            {pass ? (
              gained > 0 ? (
                <div className="text-[20px] font-bold text-[#1F2A63]">+{gained} pts no Minhas Vantagens</div>
              ) : (
                <div className="text-[16px] font-semibold text-[#1F2A63]">Você já tinha {quizPoints(best)} pts garantidos nesse quiz. Os pontos contam pelo seu melhor resultado.</div>
              )
            ) : (
              <div className="text-[15px] text-[#1F2A63]">Com {QUIZ_PASS} acertos você ganha {QUIZ_PASS * POINTS_PER_RIGHT} pts. Relê o aprofundamento e tenta de novo — você não perde nada.</div>
            )}
          </div>
          <div className="mt-auto w-full pt-6">
            {!pass && (
              <Squish onClick={() => setMode("read")} className="mb-3 w-full rounded-[14px] border-b-[4px] border-[#137540] bg-[#1F9D55] py-[13px] text-center text-[16px] font-bold uppercase text-white" scale={0.97}>
                Tentar de novo
              </Squish>
            )}
            <Squish onClick={() => navigate(-1)} className={`w-full rounded-[14px] py-[13px] text-center text-[16px] font-bold ${pass ? "border-b-[4px] border-[#137540] bg-[#1F9D55] uppercase text-white" : "text-[#1F2A63]"}`} scale={0.97}>
              Voltar pra trilha
            </Squish>
            {pass && (
              <Squish onClick={() => navigate("/academia/missoes", { replace: true, state: { tab: true } })} className="mt-3 w-full py-2 text-center text-[15px] font-semibold text-[#1F2A63]" scale={0.97}>
                Ver missões
              </Squish>
            )}
          </div>
        </div>
      </Screen>
    );
  }

  const q = lesson.quiz[n];
  const ok = a.picked === q.right;
  return (
    <PlayerShell
      pct={(n / lesson.quiz.length) * 100}
      onClose={() => setMode("read")}
      footer={
        <CheckFooter
          picked={a.picked}
          checked={a.checked}
          ok={ok}
          why={ok ? q.why : `Resposta: ${q.options[q.right]}. ${q.why}`}
          onCheck={() => {
            a.setChecked(true);
            if (ok) setRight((r) => r + 1);
          }}
          onNext={() => {
            a.reset();
            if (n + 1 >= lesson.quiz.length) {
              setGained(t.recordQuiz(lesson.id, right));
              setMode("result");
            } else setN(n + 1);
          }}
          nextLabel={n + 1 >= lesson.quiz.length ? "Ver resultado" : "Continuar"}
        />
      }
    >
      <motion.div key={n} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
        <QuestionBody {...q} picked={a.picked} checked={a.checked} onPick={a.setPicked} label={`Quiz · pergunta ${n + 1} de ${lesson.quiz.length}`} />
      </motion.div>
    </PlayerShell>
  );
}
