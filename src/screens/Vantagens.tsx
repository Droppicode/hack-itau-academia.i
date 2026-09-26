import { Check, ChevronRight, Lock, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomTabBar } from "../components/BottomTabBar";
import { IaiAvatar, ProgressBar, Wordmark } from "../components/Iai";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { useToast } from "../components/Toast";
import { Toggle } from "../components/Toggle";
import { LESSONS, REWARDS } from "../data/trilha";
import { markHome } from "../state/homeHistory";
import { useTrilha } from "../state/TrilhaContext";
import { OrangeHeader } from "./Home";

const TIERS = ["", "Tier 1 · Começo", "Tier 2 · Hábito", "Tier 3 · Seu estilo", "Tier 4 · Nível máximo"];

export function Vantagens() {
  useEffect(markHome, []);
  const navigate = useNavigate();
  const toast = useToast();
  const t = useTrilha();
  const nextIdx = t.next ? t.path.findIndex((l) => l.id === t.next!.id) : t.path.length;

  return (
    <Screen bg="bg-itau-bg" statusTone="light" statusBg="bg-itau-orange" header={<OrangeHeader />} footer={<BottomTabBar />}>
      <div className="px-5 pb-8 pt-[28px]">
        <h1 className="text-[18px] font-bold text-black">Minhas Vantagens</h1>

        <div className="mt-4 rounded-[18px] bg-itau-navy p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] text-white/70">Seus pontos</div>
              <div className="text-[30px] font-bold leading-tight">{t.points}</div>
            </div>
            <div className="rounded-full bg-white/15 px-3 py-1 text-[15px] font-semibold">Nível {t.level}</div>
          </div>
          <ProgressBar pct={t.progressPct} tone="white" className="mt-3" />
          <div className="mt-2 text-[13px] text-white/75">Pontos não expiram e não viram dinheiro. Cada módulo da trilha sobe um nível.</div>
          <Squish onClick={() => navigate("/academia")} className="mt-4 flex w-full items-center gap-3 rounded-[14px] bg-white/10 px-3 py-3" scale={0.97}>
            <IaiAvatar size={30} />
            <span className="flex-1 text-[15px]">
              Ganhar pontos na <Wordmark />
            </span>
            <ChevronRight size={18} />
          </Squish>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-white p-4">
          <RefreshCw color="#FF6200" size={22} />
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-[#333]">Aporte automático</div>
            <div className="text-[13px] leading-snug text-[#666]">
              {t.aporte.on ? "Ligado — seus benefícios recorrentes renovam todo mês." : "Seu benefício volta quando o aporte voltar."}
            </div>
          </div>
          <Toggle
            on={t.aporte.on}
            onChange={(v) => {
              if (v && !t.completed.includes("L6")) {
                toast("Liga o aporte pela L6 · 60 s");
                return;
              }
              t.set((s) => ({ aporte: { ...s.aporte, on: v } }));
            }}
            label="Aporte automático"
          />
        </div>

        {[1, 2, 3, 4].map((tier) => (
          <div key={tier} className="mt-6">
            <h2 className="mb-2 text-[16px] font-bold text-black">{TIERS[tier]}</h2>
            <div className="flex flex-col gap-2">
              {REWARDS.filter((r) => r.tier === tier).map((r) => {
                const unlocked = t.rewardUnlocked(r.id);
                const active = t.rewardActive(r.id);
                const paused = unlocked && t.activeRewards.includes(r.id) && !active;
                const unlockIdx = t.path.findIndex((l) => l.id === r.unlock);
                const steps = Math.max(unlockIdx - nextIdx + 1, 1);
                const lesson = LESSONS.find((l) => l.id === r.unlock)!;
                return (
                  <Squish
                    key={r.id}
                    onClick={() => {
                      if (!unlocked) {
                        if (t.next && t.isUnlocked(t.next.id)) navigate(`/academia/licao/${t.next.id}`);
                        else toast("Liga o aporte primeiro");
                        return;
                      }
                      if (paused) return toast("Seu benefício volta quando o aporte voltar");
                      t.set((s) => ({
                        activeRewards: s.activeRewards.includes(r.id) ? s.activeRewards.filter((x) => x !== r.id) : [...s.activeRewards, r.id],
                      }));
                      toast(t.activeRewards.includes(r.id) ? "Benefício desativado" : "Benefício ativado");
                    }}
                    className={`flex w-full items-center gap-3 rounded-[16px] p-4 ${unlocked ? "bg-white" : "bg-white/60"}`}
                    scale={0.98}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        active ? "bg-[#1B7F3B]" : unlocked ? "bg-[#FFF1E5]" : "bg-[#E6E6E6]"
                      }`}
                    >
                      {active ? <Check size={18} color="white" /> : unlocked ? <RefreshCw size={16} color="#FF6200" /> : <Lock size={16} color="#888" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[15px] font-semibold ${unlocked ? "text-[#333]" : "text-[#888]"}`}>{r.title}</div>
                      <div className="text-[13px] leading-snug text-[#666]">
                        {unlocked
                          ? paused
                            ? "Pausado · volta quando o aporte voltar"
                            : active
                              ? `Ativo · ${r.detail}`
                              : `${r.detail} · toque pra ativar`
                          : `Faltam ${steps} ${steps === 1 ? "passo" : "passos"} · ~${steps} min · libera na ${lesson.id}`}
                      </div>
                    </div>
                    {!unlocked && <ChevronRight size={18} color="#888" />}
                  </Squish>
                );
              })}
            </div>
          </div>
        ))}

        <p className="mt-6 text-center text-[12px] leading-snug text-[#888]">
          Recompensa nunca é crédito, limite ou empréstimo — em nenhum nível. Minhas Vantagens simulado no protótipo.
        </p>
      </div>
    </Screen>
  );
}
