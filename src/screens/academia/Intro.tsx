import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Brain, Gift, HeartHandshake, Map as MapIcon, Trophy, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IaiAvatar, Wordmark } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { useTrilha } from "../../state/TrilhaContext";

const PAGES = [
  { Icon: BookOpen, title: "Educação financeira sem juridiquês", text: "Lições de 5 minutos pra dominar o vocabulário do dinheiro: conta, Pix, fatura, holerite, benefícios, cofrinho e mais." },
  { Icon: MapIcon, title: "Uma trilha, um passo por vez", text: "Cada lição libera a próxima. Toque, responda e veja na hora se acertou — tipo jogo." },
  { Icon: Brain, title: "Aprofunde e faça o quiz", text: "Quer entender mais? Abra o aprofundamento e responda 4 perguntas. Acertou 3 ou mais: ganha pontos." },
  { Icon: Trophy, title: "Missões que valem a pena", text: "2 missões por semana e 1 no mês. Guardou e deixou as contas em dia? Sua caixinha rende 105% do CDI no mês seguinte." },
  { Icon: Gift, title: "Pontos viram vantagens", text: "Seus pontos sobem de nível e liberam benefícios no Minhas Vantagens. Nunca crédito, limite ou empréstimo." },
  { Icon: HeartHandshake, title: "Sem pressão", text: "Parou uma semana? Tudo bem. Sequência só dá bônus e você nunca perde pontos." },
];

export function Intro() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [i, setI] = useState(0);
  const last = i === PAGES.length - 1;
  const { Icon, title, text } = PAGES[i];

  const start = () => {
    t.set({ introSeen: true });
    navigate("/academia/trilha", { replace: true });
  };

  return (
    <Screen bg="bg-gradient-to-b from-[#1F2A63] to-[#003087]" statusTone="light">
      <div className="flex min-h-full flex-col px-6 pb-8 text-white">
        <div className="flex h-[56px] items-center justify-between">
          <Squish aria-label="Fechar" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10" scale={0.88}>
            <X size={20} />
          </Squish>
          <Squish onClick={start} className="text-[15px] font-semibold text-white/80" scale={0.94}>
            Pular
          </Squish>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <IaiAvatar size={40} />
          <Wordmark className="text-[24px]" />
        </div>

        <div className="relative mt-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>
              <motion.div
                className="flex h-[120px] w-[120px] items-center justify-center rounded-[32px] bg-white/10"
                animate={{ rotate: [0, -4, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                <Icon size={58} color="#FF8A3D" strokeWidth={1.6} />
              </motion.div>
              <h1 className="mt-8 text-[28px] font-bold leading-tight">{title}</h1>
              <p className="mt-3 text-[17px] leading-snug text-white/85">{text}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-[6px]">
          {PAGES.map((_, n) => (
            <Squish key={n} aria-label={`Página ${n + 1}`} onClick={() => setI(n)} className={`h-[7px] rounded-full ${n === i ? "w-6 bg-itau-orange" : "w-[7px] bg-white/30"}`} scale={0.8} />
          ))}
        </div>
        <Squish onClick={() => (last ? start() : setI(i + 1))} className="mt-6 w-full rounded-[14px] bg-itau-orange py-[14px] text-center text-[17px] font-bold" scale={0.97}>
          {last ? "Começar a trilha" : "Continuar"}
        </Squish>
        <p className="mt-3 text-center text-[12px] text-white/60">Protótipo: conteúdo educacional, valores e rendimentos simulados.</p>
      </div>
    </Screen>
  );
}
