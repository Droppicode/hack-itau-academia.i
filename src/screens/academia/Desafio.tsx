import { motion } from "framer-motion";
import { ChevronLeft, RotateCcw, Star, Trophy } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { POINT_BRL, UNIT_DEEP, UNIT_POINTS_PER_RIGHT, UNIT_QUIZ_PASS, UNITS, unitQuiz, unitQuizPoints, type UnitN } from "../../data/trilha";
import { brl } from "../../data/money";
import { useTrilha } from "../../state/TrilhaContext";
import { DeepCards } from "./Aprofundar";
import { CheckFooter, FooterWrap, PillButton, PlayerShell, QuestionBody, useAnswer } from "./Exercise";
import { Medal } from "./Licao";

export function Desafio() {
  const { unit } = useParams();
  const u = Number(unit) as UnitN;
  const navigate = useNavigate();
  const t = useTrilha();
  const info = UNITS.find((x) => x.n === u);
  const qs = unitQuiz(u);
  const [mode, setMode] = useState<"read" | "quiz" | "result">("read");
  const [n, setN] = useState(0);
  const [right, setRight] = useState(0);
  const [gained, setGained] = useState(0);
  const a = useAnswer();

  if (!info || info.soon || !t.unitDone(u) || qs.length === 0) {
    return (
      <Screen bg="bg-[#FBF6F0]">
        <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
          <Trophy size={40} color="#A89A8B" />
          <div className="text-[17px] text-[#14215A]">Conclua todas as lições da unidade pra liberar o desafio final.</div>
          <div className="w-full">
            <PillButton label="Ir pra trilha" onClick={() => navigate("/academia/trilha", { replace: true })} />
          </div>
        </div>
      </Screen>
    );
  }

  const best = t.unitBest[u];
  const max = qs.length * UNIT_POINTS_PER_RIGHT;

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
              label="Fazer o quiz da unidade"
              tone="orange"
              onClick={() => {
                setMode("quiz");
                setN(0);
                setRight(0);
                a.reset();
              }}
            />
            <div className="mt-2 text-center text-[12px] text-[#8A7B6C]">
              {qs.length} perguntas · {UNIT_QUIZ_PASS}+ acertos = {UNIT_POINTS_PER_RIGHT} Pontos Itaú por acerto (até {max}){best !== undefined ? ` · seu melhor: ${best}/${qs.length}` : ""}
            </div>
          </FooterWrap>
        }
      >
        <div className="px-5 pb-8">
          <div className="overflow-hidden rounded-[24px] bg-[#14215A] p-5 text-white">
            <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#FFB27A]">
              <Trophy size={15} /> Desafio final · opcional
            </div>
            <h1 className="mt-2 text-[24px] font-bold leading-tight">
              Unidade {u}: {info.name}
            </h1>
            <p className="mt-1 text-[14px] text-white/80">Revise os pontos-chave e, se quiser, faça o quiz. Vale sempre o seu melhor resultado — refazer nunca tira pontos.</p>
          </div>
          <DeepCards items={UNIT_DEEP[u] ?? []} />
          <p className="mt-6 text-[12px] text-[#8A7B6C]">Pontos Itaú simulados no protótipo. Referência pública: 1.000 pontos = R$ 20 de desconto na fatura.</p>
        </div>
      </Screen>
    );
  }

  if (mode === "result") {
    const pass = right >= UNIT_QUIZ_PASS;
    return (
      <Screen bg="bg-[#14215A]" statusTone="light">
        <div className="flex min-h-full flex-col items-center px-6 pb-8 pt-10 text-center text-white">
          <Medal tone={pass ? "#EC7000" : "#5A6390"}>{pass ? <Star size={50} color="white" fill="white" /> : <RotateCcw size={44} color="white" />}</Medal>
          <div className="mt-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#FFB27A]">{pass ? "Desafio aprovado" : "Quase lá"}</div>
          <h1 className="mt-1 text-[26px] font-bold">
            {right} de {qs.length} acertos
          </h1>
          <div className="mt-6 w-full rounded-[18px] bg-white p-4 text-[#14215A]">
            {pass ? (
              gained > 0 ? (
                <>
                  <div className="text-[22px] font-bold">+{gained} Pontos Itaú</div>
                  <div className="text-[13px] text-[#6C6257]">≈ {brl(Math.round(gained * POINT_BRL * 100))} em desconto na fatura (referência) · simulado</div>
                </>
              ) : (
                <div className="text-[15px] font-semibold">Você já tinha {unitQuizPoints(u, best)} pts garantidos aqui. Vale sempre o seu melhor resultado.</div>
              )
            ) : (
              <div className="text-[15px]">
                Com {UNIT_QUIZ_PASS} acertos você ganha {UNIT_QUIZ_PASS * UNIT_POINTS_PER_RIGHT} Pontos Itaú. Relê o resumo e tenta de novo: você não perde nada.
              </div>
            )}
          </div>
          <div className="mt-auto flex w-full flex-col gap-2 pt-6">
            {!pass && <PillButton label="Tentar de novo" tone="orange" onClick={() => setMode("read")} />}
            {pass && <PillButton label="Ver meus Pontos Itaú" tone="orange" onClick={() => navigate("/pra-voce", { replace: true, state: { tab: true } })} />}
            <Squish onClick={() => navigate("/academia/trilha", { replace: true })} className="py-3 text-center text-[15px] font-semibold text-white/85" scale={0.97}>
              Voltar pra trilha
            </Squish>
          </div>
        </div>
      </Screen>
    );
  }

  const q = qs[n];
  const ok = a.picked === q.right;
  return (
    <PlayerShell
      total={qs.length}
      pos={n}
      tag={`Desafio · Unidade ${u}`}
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
            if (n + 1 >= qs.length) {
              setGained(t.recordUnitQuiz(u, right));
              setMode("result");
            } else setN(n + 1);
          }}
          nextLabel={n + 1 >= qs.length ? "Ver resultado" : "Seguir"}
        />
      }
    >
      <motion.div key={n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <QuestionBody {...q} picked={a.picked} checked={a.checked} onPick={a.setPicked} label={`Pergunta ${n + 1} de ${qs.length}`} />
      </motion.div>
    </PlayerShell>
  );
}
