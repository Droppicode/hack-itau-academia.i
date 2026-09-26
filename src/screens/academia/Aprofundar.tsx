import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, RotateCcw, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { LESSONS, POINTS_PER_RIGHT, QUIZ_PASS } from "../../data/trilha";
import { quizPoints, useTrilha } from "../../state/TrilhaContext";
import { CheckFooter, FooterWrap, PillButton, PlayerShell, QuestionBody, useAnswer } from "./Exercise";
import { Medal } from "./Licao";

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
      <Screen bg="bg-[#FBF6F0]">
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <div className="text-[17px] text-[#14215A]">Conclua a lição na trilha pra liberar o aprofundamento.</div>
          <div className="w-full">
            <PillButton label="Ir pra trilha" onClick={() => navigate("/academia/trilha", { replace: true })} />
          </div>
        </div>
      </Screen>
    );
  }

  const best = t.quizBest[lesson.id];

  if (mode === "read") {
    return (
      <Screen
        bg="bg-[#FBF6F0]"
        header={
          <div className="flex h-[52px] shrink-0 items-center px-3">
            <Squish aria-label="Voltar" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
              <ChevronLeft size={28} strokeWidth={1.6} color="#14215A" />
            </Squish>
          </div>
        }
        footer={
          <FooterWrap>
            <PillButton
              label="Fazer o quiz"
              tone="orange"
              onClick={() => {
                setMode("quiz");
                setN(0);
                setRight(0);
                a.reset();
              }}
            />
            <div className="mt-2 text-center text-[12px] text-[#8A7B6C]">
              4 perguntas · {QUIZ_PASS}+ acertos = {POINTS_PER_RIGHT} pts por acerto{best !== undefined ? ` · seu melhor: ${best}/4` : ""}
            </div>
          </FooterWrap>
        }
      >
        <div className="px-5 pb-8">
          <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#EC7000]">
            <BookOpen size={15} /> Aprofundamento · opcional
          </div>
          <h1 className="mt-2 text-[26px] font-bold leading-tight text-[#14215A]">{lesson.title}</h1>
          <p className="mt-1 text-[15px] text-[#6C6257]">{lesson.learn}</p>
          <div className="mt-4 flex flex-col gap-3">
            {lesson.deep.map((d, i) => (
              <motion.section key={d.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,33,90,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#FFE9D6] text-[13px] font-bold text-[#EC7000]">{i + 1}</span>
                  <h2 className="text-[17px] font-bold text-[#14215A]">{d.title}</h2>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-[#3C3C4C]">{d.text}</p>
              </motion.section>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-[#8A7B6C]">Conteúdo educacional simplificado. Não é recomendação financeira.</p>
        </div>
      </Screen>
    );
  }

  if (mode === "result") {
    const pass = right >= QUIZ_PASS;
    return (
      <Screen bg="bg-[#14215A]" statusTone="light">
        <div className="flex min-h-full flex-col items-center px-6 pb-8 pt-10 text-center text-white">
          <Medal tone={pass ? "#EC7000" : "#5A6390"}>{pass ? <Star size={50} color="white" fill="white" /> : <RotateCcw size={44} color="white" />}</Medal>
          <div className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#FFB27A]">{pass ? "Quiz aprovado" : "Quase lá"}</div>
          <h1 className="mt-1 text-[26px] font-bold">
            {right} de 4 acertos
          </h1>
          <div className="mt-6 w-full rounded-[18px] bg-white p-4 text-[#14215A]">
            {pass ? (
              gained > 0 ? (
                <div className="text-[22px] font-bold">
                  +{gained} pts <span className="text-[15px] font-semibold text-[#6C6257]">no Minhas Vantagens</span>
                </div>
              ) : (
                <div className="text-[15px] font-semibold">Você já tinha {quizPoints(best)} pts garantidos aqui. Vale sempre o seu melhor resultado.</div>
              )
            ) : (
              <div className="text-[15px]">Com {QUIZ_PASS} acertos você ganha {QUIZ_PASS * POINTS_PER_RIGHT} pts. Relê o aprofundamento e tenta de novo: você não perde nada.</div>
            )}
          </div>
          <div className="mt-auto flex w-full flex-col gap-2 pt-6">
            {!pass && <PillButton label="Tentar de novo" tone="orange" onClick={() => setMode("read")} />}
            {pass ? <PillButton label="Voltar pra trilha" tone="orange" onClick={() => navigate(-1)} /> : (
              <Squish onClick={() => navigate(-1)} className="py-3 text-center text-[15px] font-semibold text-white/85" scale={0.97}>
                Voltar pra trilha
              </Squish>
            )}
            {pass && (
              <Squish onClick={() => navigate("/academia/missoes", { replace: true, state: { tab: true } })} className="py-3 text-center text-[15px] font-semibold text-white/85" scale={0.97}>
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
      total={lesson.quiz.length}
      pos={n}
      tag={`Quiz · ${lesson.title}`}
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
          nextLabel={n + 1 >= lesson.quiz.length ? "Ver resultado" : "Seguir"}
        />
      }
    >
      <motion.div key={n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <QuestionBody {...q} picked={a.picked} checked={a.checked} onPick={a.setPicked} label={`Pergunta ${n + 1}`} />
      </motion.div>
    </PlayerShell>
  );
}
