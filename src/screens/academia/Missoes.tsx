import { motion } from "framer-motion";
import { CalendarDays, Check, ChevronLeft, Gift, Lock, Settings2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../../components/BottomSheet";
import { AcademiaTabs, GoalEditor, ProgressBar } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { useToast } from "../../components/Toast";
import { brl } from "../../data/money";
import { LESSONS } from "../../data/trilha";
import { deltaToHome } from "../../state/homeHistory";
import { useTrilha, type MissionStatus, type MissionView } from "../../state/TrilhaContext";

const BADGE: Record<MissionStatus, string> = {
  bloqueada: "bg-[#EEE] text-[#888]",
  disponível: "bg-[#EEF1FB] text-[#1F2A63]",
  "em andamento": "bg-[#FFF1E5] text-[#B54700]",
  concluída: "bg-[#E3F4EA] text-[#1B7F3B]",
  resgatada: "bg-[#00857A] text-white",
};

export function Missoes() {
  const navigate = useNavigate();
  const t = useTrilha();
  const toast = useToast();
  const [goalOpen, setGoalOpen] = useState(false);
  const [demo, setDemo] = useState(false);

  const back = () => {
    const d = deltaToHome();
    if (d !== undefined) navigate(d);
    else navigate("/home", { replace: true, state: { tab: true } });
  };

  const actionFor = (m: MissionView) => {
    if (m.id === "w-licoes" || m.id === "w-quiz") return { label: "Ir pra trilha", run: () => navigate("/academia/trilha", { replace: true, state: { tab: true } }) };
    if (m.id === "l-objetivo") return { label: "Criar objetivo", run: () => setGoalOpen(true) };
    if (m.id === "l-alerta") return { label: "Ativar alerta", run: () => (t.doAction(m.id), toast("Alerta de fatura ativado (simulado)")) };
    if (m.id === "l-pixnoturno") return { label: "Reduzir limite", run: () => (t.doAction(m.id), toast("Limite noturno: R$ 200 (simulado)")) };
    return undefined;
  };

  const Card = ({ m }: { m: MissionView }) => {
    const lesson = LESSONS.find((l) => l.id === m.unlock);
    const action = actionFor(m);
    return (
      <motion.div layout className={`rounded-[16px] p-4 ${m.status === "bloqueada" ? "bg-white/60" : "bg-white"}`}>
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${m.status === "bloqueada" ? "bg-[#E6E6E6]" : m.status === "resgatada" ? "bg-[#00857A]" : "bg-[#FFF1E5]"}`}>
            {m.status === "bloqueada" ? <Lock size={16} color="#888" /> : m.status === "resgatada" ? <Check size={18} color="white" /> : <Sparkles size={16} color="#FF6200" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`text-[15px] font-semibold ${m.status === "bloqueada" ? "text-[#888]" : "text-[#222]"}`}>{m.title}</span>
            </div>
            <div className="text-[13px] leading-snug text-[#666]">{m.status === "bloqueada" ? `Libera ao concluir a lição ${m.unlock.slice(1)}: ${lesson?.title}` : m.text}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className={`rounded-full px-2 py-[2px] text-[11px] font-semibold ${BADGE[m.status]}`}>{m.status}</span>
              <span className="text-[12px] font-semibold text-[#1F2A63]">+{m.points} pts</span>
            </div>
            {m.reward && <div className="mt-1 text-[12px] font-semibold text-[#1B7F3B]">+ {m.reward} (simulado)</div>}
          </div>
        </div>
        {m.status !== "bloqueada" && m.goal > 1 && <ProgressBar pct={(m.progress / m.goal) * 100} tone="green" className="mt-3" />}
        {m.status === "concluída" && (
          <Squish
            onClick={() => {
              t.claim(m);
              toast(`+${m.points} pts no Minhas Vantagens`);
            }}
            className="mt-3 w-full rounded-[12px] bg-[#00857A] py-[10px] text-center text-[15px] font-bold text-white"
            scale={0.97}
          >
            Resgatar +{m.points} pts
          </Squish>
        )}
        {(m.status === "disponível" || m.status === "em andamento") && action && (
          <Squish onClick={action.run} className="mt-3 w-full rounded-[12px] border border-itau-orange py-[9px] text-center text-[14px] font-semibold text-itau-orange" scale={0.97}>
            {action.label}
          </Squish>
        )}
      </motion.div>
    );
  };

  const month = t.missions.find((m) => m.id === "m-mes");
  const weekly = t.missions.filter((m) => m.kind === "semanal");
  const lessonM = t.missions.filter((m) => m.kind === "lição");

  return (
    <Screen
      bg="bg-[#FBF6F0]"
      header={
        <div className="flex h-[56px] shrink-0 items-center gap-1 border-b border-[#E6E6E6] bg-white px-3">
          <Squish aria-label="Voltar" onClick={back} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <ChevronLeft size={28} strokeWidth={1.6} />
          </Squish>
          <div className="flex-1 text-[18px] font-bold text-[#1F2A63]">Missões</div>
          <Squish aria-label="Controles do protótipo" onClick={() => setDemo(true)} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <Settings2 size={21} color="#555" />
          </Squish>
        </div>
      }
      footer={<AcademiaTabs />}
    >
      <div className="px-4 pb-10 pt-4">
        <div className="flex items-center gap-2 text-[13px] text-[#666]">
          <CalendarDays size={15} /> Semana {t.week} · Mês {t.month} · {t.points} pts
        </div>

        {month && (
          <section className="mt-4">
            <h2 className="mb-2 text-[16px] font-bold text-black">Missão do mês</h2>
            <Card m={month} />
            {month.status !== "bloqueada" && month.status !== "resgatada" && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Squish
                  onClick={() => {
                    t.save(2000);
                    toast("R$ 20 na caixinha (simulado)");
                  }}
                  className={`rounded-[14px] p-3 text-left ${t.monthSavedCents >= 2000 ? "bg-[#E3F4EA]" : "bg-white"}`}
                  scale={0.97}
                >
                  <div className="text-[12px] text-[#666]">Guardado no mês</div>
                  <div className="text-[16px] font-bold text-[#222]">{brl(t.monthSavedCents)}</div>
                  <div className="mt-1 text-[13px] font-semibold text-itau-orange">{t.monthSavedCents >= 2000 ? "✓ meta de R$ 20" : "+ Guardar R$ 20"}</div>
                </Squish>
                <Squish
                  onClick={() => {
                    t.set({ billsPaid: true });
                    toast("Contas do mês pagas (simulado)");
                  }}
                  className={`rounded-[14px] p-3 text-left ${t.billsPaid ? "bg-[#E3F4EA]" : "bg-white"}`}
                  scale={0.97}
                >
                  <div className="text-[12px] text-[#666]">Contas do mês</div>
                  <div className="text-[16px] font-bold text-[#222]">{t.billsPaid ? "Em dia" : "Luz vence dia 10"}</div>
                  <div className="mt-1 text-[13px] font-semibold text-itau-orange">{t.billsPaid ? "✓ pagas" : "Pagar agora"}</div>
                </Squish>
              </div>
            )}
            <div className={`mt-2 rounded-[14px] p-3 text-[13px] ${t.cdi105 ? "bg-[#00857A] text-white" : "bg-white text-[#555]"}`}>
              Caixinha agora: <b>{t.cdi105 ? "105%" : "100%"} do CDI</b> (simulado · condição a confirmar com o produto).
              {!t.cdi105 && " Cumpra a missão e vire o mês pra ativar."}
            </div>
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-2 text-[16px] font-bold text-black">Missões da semana</h2>
          <div className="flex flex-col gap-2">
            {weekly.map((m) => (
              <Card key={m.id} m={m} />
            ))}
          </div>
          <p className="mt-2 text-[12px] text-[#777]">Bônus, não obrigação: a trilha anda com 1 lição por semana. Missão perdida não tira pontos.</p>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 text-[16px] font-bold text-black">Liberadas pelas lições</h2>
          <div className="flex flex-col gap-2">
            {lessonM.map((m) => (
              <Card key={m.id} m={m} />
            ))}
          </div>
        </section>

        <Squish onClick={() => navigate("/pra-voce", { replace: true, state: { tab: true } })} className="mt-6 flex w-full items-center gap-3 rounded-[16px] bg-itau-navy p-4 text-white" scale={0.98}>
          <Gift size={20} color="#FF8A3D" />
          <span className="flex-1 text-[15px] font-semibold">Ver recompensas no Minhas Vantagens</span>
        </Squish>
      </div>

      <GoalEditor open={goalOpen} onClose={() => setGoalOpen(false)} />
      <BottomSheet open={demo} onClose={() => setDemo(false)} title="Controles do protótipo">
        <div className="flex flex-col gap-2">
          {[
            { l: "Avançar 1 semana", run: () => t.advanceWeek() },
            { l: "Avançar 1 mês", run: () => t.advanceMonth() },
            { l: "Resetar Academia Ia.i", run: () => t.reset() },
          ].map((b) => (
            <Squish
              key={b.l}
              onClick={() => {
                b.run();
                toast(b.l);
                setDemo(false);
              }}
              className="w-full rounded-[12px] bg-[#F4F4F4] px-4 py-3 text-[15px] font-semibold text-[#222]"
              scale={0.97}
            >
              {b.l}
            </Squish>
          ))}
        </div>
      </BottomSheet>
    </Screen>
  );
}
