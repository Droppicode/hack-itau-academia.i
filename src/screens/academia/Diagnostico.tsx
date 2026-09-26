import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IaiAvatar } from "../../components/Iai";
import { Footer, PrimaryButton } from "../../components/PrimaryButton";
import { Screen } from "../../components/Screen";
import { ScreenHeader } from "../../components/ScreenHeader";
import { Squish } from "../../components/Squish";
import { FEELINGS, GOALS, LESSONS, MODULES } from "../../data/trilha";
import { useTrilha, type Persisted } from "../../state/TrilhaContext";

type Diag = Persisted["diag"];

function Question<K extends "goal" | "feeling" | "start">({
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
    const start = t.diag.start ?? (t.diag.feeling === "vermelho" ? 3 : 1);
    const first = LESSONS.find((l) => l.module === start && !t.completed.includes(l.id)) ?? LESSONS[0];
    t.set((s) => ({ diag: { ...s.diag, start, done: true } }));
    navigate(`/academia/licao/${first.id}`, { replace: true });
  };

  return (
    <Screen
      header={<ScreenHeader right={<Squish onClick={finish} className="px-3 text-[15px] font-semibold text-[#555]">Pular</Squish>} />}
      footer={
        <Footer>
          <PrimaryButton label="Bora pra primeira lição · 60 s" onClick={finish} />
        </Footer>
      }
    >
      <div className="px-5 pb-8">
        <div className="flex items-center gap-3">
          <IaiAvatar size={40} />
          <h1 className="text-[24px] font-bold leading-tight tracking-tight text-black">Três toques e a trilha fica com a sua cara</h1>
        </div>
        <p className="mt-2 text-[15px] text-[#555]">Tudo opcional. As respostas só mudam a ordem das lições e os exemplos.</p>

        <Question n={1} field="goal" q="Qual é o seu próximo sonho?" options={GOALS.map((g) => ({ id: g.id, label: g.label }))} />
        <Question n={2} field="feeling" q="Como você tá com dinheiro hoje?" options={FEELINGS.map((f) => ({ id: f.id, label: f.label }))} />
        <Question n={3} field="start" q="Quer começar por onde?" options={MODULES.map((m) => ({ id: m.n, label: m.name }))} />
      </div>
    </Screen>
  );
}
