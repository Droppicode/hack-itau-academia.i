import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IaiAvatar } from "../../components/Iai";
import { Footer, PrimaryButton } from "../../components/PrimaryButton";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Squish } from "../../components/Squish";
import { GOALS } from "../../data/trilha";
import { useTrilha, type Persisted } from "../../state/TrilhaContext";

type Diag = Persisted["diag"];

function Question<K extends "goal" | "renda" | "casa">({
  n,
  q,
  field,
  options,
}: {
  n: number;
  q: string;
  field: K;
  options: { id: NonNullable<Diag[K]>; label: string }[];
}) {
  const t = useTrilha();
  const current = t.diag[field];
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.08 }} className="mt-6">
      <div className="text-[13px] font-semibold uppercase tracking-wide text-itau-orange">Pergunta {n} de 3 · 1 toque</div>
      <div className="mt-1 text-[19px] font-bold leading-snug text-black">{q}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <Squish
            key={String(o.id)}
            onClick={() => t.set((s) => ({ diag: { ...s.diag, [field]: current === o.id ? undefined : o.id } }))}
            className={`rounded-full border-[1.5px] px-4 py-[8px] text-[15px] font-semibold ${
              current === o.id ? "border-itau-orange bg-[#FFF1E5] text-itau-orange" : "border-[#CFCFCF] text-[#444]"
            }`}
            scale={0.93}
          >
            {o.label}
          </Squish>
        ))}
      </div>
    </motion.div>
  );
}

export function Diagnostico() {
  const navigate = useNavigate();
  const t = useTrilha();
  const finish = () => {
    t.set((s) => ({ diag: { ...s.diag, done: true } }));
    navigate("/academia/licao/L1", { replace: true });
  };

  return (
    <Screen
      header={<ScreenHeader right={<Squish onClick={finish} className="px-3 text-[15px] font-semibold text-[#555]">Pular</Squish>} />}
      footer={
        <Footer>
          <PrimaryButton label="Bora pra lição 1 · 60 s" onClick={finish} />
        </Footer>
      }
    >
      <div className="px-5 pb-8">
        <div className="flex items-center gap-3">
          <IaiAvatar size={40} />
          <h1 className="text-[24px] font-bold leading-tight tracking-tight text-black">Três toques e a trilha fica com a sua cara</h1>
        </div>
        <p className="mt-2 text-[15px] text-[#555]">Tudo opcional. Sem resposta, a Ia.i usa só o seu extrato.</p>

        <Question
          n={1}
          field="goal"
          q="Se sobrasse uma grana, ela ia pra quê?"
          options={GOALS.map((g) => ({ id: g.id, label: g.label }))}
        />
        <Question
          n={2}
          field="renda"
          q="Seu dinheiro do mês é sempre parecido ou muda muito?"
          options={[
            { id: "parecido", label: "Parecido" },
            { id: "muda", label: "Muda bastante" },
          ]}
        />
        <Question
          n={3}
          field="casa"
          q="Você ajuda nas contas de casa?"
          options={[
            { id: "fixo", label: "Sim, valor fixo" },
            { id: "quando", label: "Sim, quando dá" },
            { id: "nao", label: "Não" },
          ]}
        />

        <div className="mt-8 flex gap-3 rounded-[14px] bg-itau-chip p-4">
          <Eye size={20} className="mt-[2px] shrink-0" color="#1F2A63" />
          <p className="text-[14px] leading-snug text-[#444]">
            A trilha usa comportamento — nunca renda, CEP ou idade — pra decidir a ordem das lições.
          </p>
        </div>
      </div>
    </Screen>
  );
}
