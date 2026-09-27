import { motion } from "framer-motion";
import { BookOpen, ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { LESSONS } from "../../data/trilha";
import { useTrilha } from "../../state/TrilhaContext";
import { FooterWrap, PillButton } from "./Exercise";

export function DeepCards({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      {items.map((d, i) => (
        <motion.section key={d.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-[20px] bg-white p-4 shadow-[0_4px_16px_rgba(20,33,90,0.06)]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#FFE9D6] text-[13px] font-bold text-[#EC7000]">{i + 1}</span>
            <h2 className="text-[17px] font-bold text-[#14215A]">{d.title}</h2>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-[#3C3C4C]">{d.text}</p>
        </motion.section>
      ))}
    </div>
  );
}

export function Aprofundar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const t = useTrilha();
  const lesson = LESSONS.find((l) => l.id === id);
  const ok = !!lesson && t.done(lesson.id);
  const { markDeep } = t;

  useEffect(() => {
    if (ok && lesson) markDeep(lesson.id);
  }, [ok, lesson, markDeep]);

  if (!lesson || !ok) {
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
          <PillButton label="Voltar pra trilha" tone="orange" onClick={() => navigate(-1)} />
          <div className="mt-2 text-center text-[12px] text-[#8A7B6C]">Leitura livre, não vale pontos. Os pontos ficam no desafio do fim da unidade.</div>
        </FooterWrap>
      }
    >
      <div className="px-5 pb-8">
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#EC7000]">
          <BookOpen size={15} /> Aprofundamento · só leitura
        </div>
        <h1 className="mt-2 text-[26px] font-bold leading-tight text-[#14215A]">{lesson.title}</h1>
        <p className="mt-1 text-[15px] text-[#6C6257]">{lesson.learn}</p>
        <DeepCards items={lesson.deep} />
        <p className="mt-6 text-[12px] text-[#8A7B6C]">Conteúdo educacional simplificado. Não é recomendação financeira.</p>
      </div>
    </Screen>
  );
}
