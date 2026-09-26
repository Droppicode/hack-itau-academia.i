import { Check, ChevronRight, Gift, Lock } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomTabBar } from "../components/BottomTabBar";
import { IaiAvatar, ProgressBar, Wordmark } from "../components/Iai";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { useToast } from "../components/Toast";
import { LEVELS, REWARDS } from "../data/trilha";
import { markHome } from "../state/homeHistory";
import { useTrilha } from "../state/TrilhaContext";
import { OrangeHeader } from "./Home";

export function Vantagens() {
  useEffect(markHome, []);
  const navigate = useNavigate();
  const toast = useToast();
  const t = useTrilha();

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
          <ProgressBar pct={t.levelPct} tone="white" className="mt-3" />
          <div className="mt-2 text-[13px] text-white/75">
            {t.nextLevelAt ? `Faltam ${t.nextLevelAt - t.points} pts pro Nível ${t.level + 1}. ` : "Nível máximo. "}Pontos não expiram e não viram dinheiro.
          </div>
          <Squish onClick={() => navigate(t.introSeen ? "/academia/trilha" : "/academia/intro")} className="mt-4 flex w-full items-center gap-3 rounded-[14px] bg-white/10 px-3 py-3" scale={0.97}>
            <IaiAvatar size={30} />
            <span className="flex-1 text-[15px]">
              Ganhar pontos na <Wordmark />
            </span>
            <ChevronRight size={18} />
          </Squish>
        </div>

        {[2, 3, 4, 5].map((lvl) => (
          <div key={lvl} className="mt-6">
            <h2 className="mb-2 flex items-baseline justify-between text-[16px] font-bold text-black">
              <span>Nível {lvl}</span>
              <span className="text-[13px] font-normal text-[#777]">a partir de {LEVELS[lvl - 1]} pts</span>
            </h2>
            <div className="flex flex-col gap-2">
              {REWARDS.filter((r) => r.level === lvl).map((r) => {
                const unlocked = t.rewardUnlocked(r.id);
                const active = t.activeRewards.includes(r.id);
                const missing = LEVELS[lvl - 1] - t.points;
                return (
                  <Squish
                    key={r.id}
                    onClick={() => {
                      if (!unlocked) {
                        navigate(t.introSeen ? "/academia/trilha" : "/academia/intro");
                        return;
                      }
                      t.set((s) => ({ activeRewards: active ? s.activeRewards.filter((x) => x !== r.id) : [...s.activeRewards, r.id] }));
                      toast(active ? "Benefício desativado" : "Benefício ativado");
                    }}
                    className={`flex w-full items-center gap-3 rounded-[16px] p-4 ${unlocked ? "bg-white" : "bg-white/60"}`}
                    scale={0.98}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${active ? "bg-[#1B7F3B]" : unlocked ? "bg-[#FFF1E5]" : "bg-[#E6E6E6]"}`}>
                      {active ? <Check size={18} color="white" /> : unlocked ? <Gift size={16} color="#FF6200" /> : <Lock size={16} color="#888" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[15px] font-semibold ${unlocked ? "text-[#333]" : "text-[#888]"}`}>{r.title}</div>
                      <div className="text-[13px] leading-snug text-[#666]">
                        {unlocked ? (active ? `Ativo · ${r.detail}` : `${r.detail} · toque pra ativar`) : `Faltam ${missing} pts · ganhe no quiz das lições e nas missões`}
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
          Recompensa nunca é crédito, limite ou empréstimo. Catálogo simulado no protótipo.
        </p>
      </div>
    </Screen>
  );
}
