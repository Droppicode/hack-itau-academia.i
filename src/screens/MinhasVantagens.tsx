import { Check, ChevronLeft, ChevronRight, CircleHelp, Clock, Gift, Hexagon, Sparkles, Waypoints } from "lucide-react";
import { goBack } from "../state/goBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/BottomSheet";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { MV_BENEFITS, MV_LEVELS, PASSO_CATS, type PassoCat } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";

export function Hex({ n, size = 96, dim }: { n: number; size?: number; dim?: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0">
        <path d="M50 4 90 27v46L50 96 10 73V27z" fill={dim ? "#D9D9D9" : "#EC7000"} />
        <path d="M50 4 90 27v46L50 96z" fill={dim ? "#C9C9C9" : "#D45F00"} opacity={0.5} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-bold text-white" style={{ fontSize: size * 0.45 }}>
        {n}
      </span>
    </div>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex h-[56px] shrink-0 items-center gap-1 bg-itau-bg px-3">
      <Squish aria-label="Voltar" onClick={onBack} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
        <ChevronLeft size={26} strokeWidth={1.6} />
      </Squish>
      <div className="flex-1 text-[16px] text-[#222]">{title}</div>
      <CircleHelp size={22} color="#444" className="mr-2" />
    </div>
  );
}

export function MinhasVantagens() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [sheet, setSheet] = useState<"beneficios" | "passos" | "niveis" | null>(null);
  const [cat, setCat] = useState<PassoCat | null>(null);
  const [lvl, setLvl] = useState(t.mvLevel);
  const nextAt = t.mvNextAt;
  const rec = t.passos.find((p) => p.academia && !p.done) ?? t.passos.find((p) => !p.done);

  return (
    <Screen bg="bg-itau-bg" header={<Header title="Minhas Vantagens" onBack={() => goBack(navigate)} />}>
      <div className="px-5 pb-10">
        <div className="flex flex-col items-center pt-4">
          <Hex n={t.mvLevel} />
          <div className="mt-3 text-[18px] font-bold text-[#222]">Você está no nível {t.mvLevel}</div>
          <Squish onClick={() => setSheet("niveis")} className="mt-1 flex items-center gap-1 text-[13px] text-[#333]" scale={0.96}>
            Confira todos os níveis <ChevronRight size={14} />
          </Squish>
        </div>

        <div className="mt-5 grid grid-cols-2 divide-x divide-[#DDD] rounded-[16px] bg-[#EFEFEF] py-4 text-center">
          <div>
            <Hexagon size={18} color="#EC7000" fill="#EC7000" className="mx-auto" />
            <div className="mt-1 text-[12px] text-[#666]">Você já conquistou</div>
            <div className="text-[14px] font-semibold text-[#222]">{t.passosDone} passos</div>
          </div>
          <div>
            <Hexagon size={18} color="#555" className="mx-auto" />
            <div className="mt-1 text-[12px] text-[#666]">{nextAt ? `Faltam ${nextAt - t.passosDone} passos para o` : "Você chegou ao"}</div>
            <div className="text-[14px] font-semibold text-[#222]">{nextAt ? `nível ${t.mvLevel + 1}` : "nível máximo"}</div>
          </div>
        </div>

        <h2 className="mt-7 text-[15px] font-semibold text-[#222]">Lucas, aproveite o programa</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { k: "beneficios" as const, I: Gift, l: "Benefícios" },
            { k: "passos" as const, I: Waypoints, l: "Passos" },
            { k: "niveis" as const, I: Hexagon, l: "Níveis do programa" },
          ].map(({ k, I, l }) => (
            <Squish key={k} onClick={() => (setLvl(t.mvLevel), setSheet(k))} className="flex h-[88px] flex-col justify-between rounded-[14px] bg-white p-3 text-left" scale={0.95}>
              <I size={20} color="#EC7000" />
              <span className="text-[13px] font-semibold leading-tight text-[#222]">{l}</span>
            </Squish>
          ))}
        </div>

        {rec && (
          <Squish
            onClick={() => (rec.academia ? navigate(rec.id === "a-missao" ? "/academia/missoes" : "/academia/trilha") : setSheet("passos"))}
            className="mt-4 block w-full overflow-hidden rounded-[16px] bg-white text-left"
            scale={0.98}
          >
            <div className="p-4">
              <div className="text-[12px] text-[#666]">Atividade recomendada</div>
              <div className="mt-3 text-[18px] text-[#222]">{rec.title}</div>
              <div className="text-[13px] text-[#666]">+1 passo{rec.academia ? " · academIA.I (simulado)" : ""}</div>
              <div className="mt-3 flex justify-end">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFC400]">
                  <Sparkles size={30} color="#7A4B00" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#14215A] px-4 py-2 text-[12px] text-white">
              <Clock size={13} /> Você tem 4 dias pra fazer essa atividade
            </div>
          </Squish>
        )}

        <p className="mt-6 text-[12px] leading-snug text-[#888]">
          Protótipo. No programa real, os níveis vão de 1 a 5 e sobem com passos (uso de produtos e serviços). Passos da academIA.I são uma proposta simulada.
        </p>
      </div>

      <BottomSheet open={sheet === "passos"} onClose={() => (setSheet(null), setCat(null))} title="Passos">
        <p className="-mt-2 text-[13px] text-[#666]">Confira seu progresso e realize as atividades disponíveis pra avançar mais passos.</p>
        <div className="no-scrollbar mt-3 max-h-[55vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {PASSO_CATS.map((c) => {
              const items = t.passos.filter((p) => p.cat === c.id);
              const d = items.filter((p) => p.done).length;
              return (
                <Squish key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className={`rounded-[14px] p-3 text-left ${c.id === "aprender" ? "col-span-2 bg-[#FFF1E5]" : "bg-[#F4F4F4]"}`} scale={0.96}>
                  <div className="text-[13px] leading-tight text-[#333]">{c.title}</div>
                  <div className="mt-1 text-[14px] font-bold text-[#222]">
                    {d}/{c.max} passos
                  </div>
                  {cat === c.id && (
                    <div className="mt-2 flex flex-col gap-1">
                      {items.length === 0 && <span className="text-[12px] text-[#777]">Atividades no app real</span>}
                      {items.map((p) => (
                        <span key={p.id} className={`flex items-center gap-1 text-[12px] ${p.done ? "text-[#00857A]" : "text-[#555]"}`}>
                          {p.done ? <Check size={12} /> : "•"} {p.title}
                        </span>
                      ))}
                    </div>
                  )}
                </Squish>
              );
            })}
          </div>
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "beneficios" || sheet === "niveis"} onClose={() => setSheet(null)} title={sheet === "niveis" ? "Níveis do programa" : "Benefícios"}>
        <div className="flex gap-2">
          {MV_LEVELS.map((at, i) => (
            <Squish key={i} onClick={() => setLvl(i + 1)} className={`flex flex-1 flex-col items-center rounded-[12px] py-2 ${lvl === i + 1 ? "bg-[#FFF1E5]" : ""}`} scale={0.94}>
              <Hex n={i + 1} size={34} dim={i + 1 > t.mvLevel} />
              <span className="mt-1 text-[11px] text-[#666]">{at} passos</span>
            </Squish>
          ))}
        </div>
        <div className="no-scrollbar mt-3 flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
          {MV_BENEFITS.filter((b) => b.level <= lvl).flatMap((b) =>
            b.items.map((it) => (
              <div key={it.title} className="flex items-center gap-3 rounded-[12px] bg-[#F4F4F4] p-3">
                <Gift size={18} color={b.level <= t.mvLevel ? "#EC7000" : "#AAA"} />
                <div className="flex-1">
                  <div className="text-[14px] font-semibold text-[#222]">{it.title}</div>
                  <div className="text-[12px] text-[#666]">
                    Nível {b.level} · {it.detail}
                  </div>
                </div>
                {b.level <= t.mvLevel && <Check size={16} color="#00857A" />}
              </div>
            )),
          )}
        </div>
        <p className="mt-3 text-[11px] text-[#888]">Benefícios ilustrativos com base na página pública do programa. Sujeitos a alteração.</p>
      </BottomSheet>
    </Screen>
  );
}
