import { motion } from "framer-motion";
import { AlertTriangle, Check, Flame as FlameIcon, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";
import { fmtDay, fmtMult, multiplierFor, STREAK_MAX_WEEKS } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";
import { BottomSheet } from "./BottomSheet";
import { Squish } from "./Squish";
import { Flame, haptic, RollNumber, usePrevious } from "./fx";

export function useStreakFx() {
  const t = useTrilha();
  const prev = usePrevious(t.streak);
  const [burst, setBurst] = useState(false);
  useEffect(() => {
    if (t.streak <= prev) return;
    setBurst(true);
    haptic([15, 30, 15]);
    const id = window.setTimeout(() => setBurst(false), 900);
    return () => window.clearTimeout(id);
  }, [t.streak, prev]);
  const daysLeft = t.week * 7 - t.day;
  const risk = t.streak > 0 && !t.weekActive && daysLeft <= 2;
  return { burst, risk, daysLeft };
}

function WeekCalendar() {
  const t = useTrilha();
  const weeks = Array.from({ length: STREAK_MAX_WEEKS }, (_, i) => t.week - (STREAK_MAX_WEEKS - 1) + i).filter((w) => w >= 1);
  const buyDays = new Set(t.txns.filter((x) => x.streak).map((x) => x.day));
  let n = 0;
  return (
    <div className="mt-4 flex flex-col gap-[6px]">
      {weeks.map((w) => {
        const ok = t.txWeeks.includes(w);
        const now = w === t.week;
        return (
          <div key={w} className="flex items-center gap-2">
            <span className={`w-[44px] text-[11px] font-semibold ${now ? "text-[#EC7000]" : "text-[#8A7B6C]"}`}>{now ? "Esta" : `Sem. ${w}`}</span>
            <div className="flex flex-1 gap-[5px]">
              {Array.from({ length: 7 }, (_, d) => {
                const day = (w - 1) * 7 + d + 1;
                const lit = buyDays.has(day);
                const future = day > t.day;
                const delay = lit ? 0.15 + n++ * 0.12 : 0;
                return (
                  <div key={d} className={`relative h-[26px] flex-1 rounded-[8px] ${future ? "border border-dashed border-[#E3D8CB]" : ok ? "bg-[#FFE7D1]" : "bg-[#F1ECE5]"} ${day === t.day ? "ring-2 ring-[#EC7000]" : ""}`}>
                    {lit && (
                      <motion.span initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay, type: "spring", stiffness: 420, damping: 14 }} className="absolute inset-0 flex items-center justify-center">
                        <FlameIcon size={15} color="#EC7000" fill="#EC7000" />
                      </motion.span>
                    )}
                  </div>
                );
              })}
            </div>
            <span className="w-[16px]">{ok && <Check size={14} color="#00857A" strokeWidth={3} />}</span>
          </div>
        );
      })}
    </div>
  );
}

export function StreakSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTrilha();
  const { burst, risk, daysLeft } = useStreakFx();
  return (
    <BottomSheet open={open} onClose={onClose} title="Sua sequência">
      <div className="-mt-1 flex items-center gap-3">
        <Flame weeks={t.streak} risk={risk} burst={burst} size={60} />
        <div>
          <div className="flex items-baseline gap-1 text-[22px] font-bold text-[#14215A]">
            <RollNumber value={t.streak} /> {t.streak === 1 ? "semana seguida" : "semanas seguidas"}
          </div>
          <div className="text-[14px] text-[#6C6257]">
            Seus pontos de missões e desafios valem <b className="text-[#EC7000]">{fmtMult(t.multiplier)}</b>
          </div>
        </div>
      </div>
      <WeekCalendar />
      <div className={`mt-4 flex items-start gap-2 rounded-[14px] p-3 text-[14px] ${t.weekActive ? "bg-[#E6F4F1] text-[#00574F]" : risk ? "bg-[#EEEDEB] text-[#4A4A4A]" : "bg-[#FFF1E5] text-[#8A4B00]"}`}>
        {t.weekActive ? <Check size={18} className="mt-[1px] shrink-0" /> : risk ? <Hourglass size={18} className="mt-[1px] shrink-0" /> : <AlertTriangle size={18} className="mt-[1px] shrink-0" />}
        {t.weekActive ? (
          `Semana garantida! Na próxima, uma compra leva seus pontos a ${fmtMult(t.nextMultiplier)}.`
        ) : risk ? (
          <span>
            <b>Sua sequência apaga {daysLeft === 0 ? "hoje" : `em ${daysLeft} ${daysLeft === 1 ? "dia" : "dias"}`}.</b> Uma compra no débito ou no crédito, de qualquer valor, salva.
          </span>
        ) : (
          `Faça uma compra no débito ou no crédito, de qualquer valor, até ${fmtDay(t.week * 7)} pra ${t.streak ? "manter a sequência" : "começar a sequência"} (${fmtMult(multiplierFor(t.streak + 1))}).`
        )}
      </div>
      <ul className="mt-4 space-y-1 text-[13px] leading-snug text-[#6C6257]">
        <li>• Cada semana com pelo menos uma compra no cartão Itaú soma +0,05x, até {fmtMult(multiplierFor(STREAK_MAX_WEEKS))} em {STREAK_MAX_WEEKS} semanas.</li>
        <li>• Pix, transferências e cofrinho não contam. Semana sem compra volta pra 1x.</li>
      </ul>
    </BottomSheet>
  );
}

export function StreakChip({ tone = "dark", className = "", label }: { tone?: "dark" | "light"; className?: string; label?: boolean }) {
  const t = useTrilha();
  const [open, setOpen] = useState(false);
  const { burst, risk } = useStreakFx();
  const cls = risk ? (tone === "dark" ? "bg-white/10 text-white/70" : "bg-[#EEEDEB] text-[#555]") : tone === "dark" ? "bg-white/10 text-white" : "bg-[#FFF1E5] text-[#8A4B00]";
  if (label)
    return (
      <span className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-[5px] text-[13px] font-semibold ${cls} ${className}`}>
        <Flame weeks={t.streak} risk={risk} burst={burst} size={16} />
        <RollNumber value={t.streak} /> sem · {fmtMult(t.multiplier)}
      </span>
    );
  return (
    <>
      <Squish aria-label="Sequência" onClick={() => setOpen(true)} className={`flex items-center gap-1 rounded-full px-3 py-[5px] text-[13px] font-semibold ${cls} ${className}`} scale={0.94}>
        <Flame weeks={t.streak} risk={risk} burst={burst} size={16} />
        <RollNumber value={t.streak} /> sem · {fmtMult(t.multiplier)}
        {!t.weekActive && <span className="ml-[2px] h-[7px] w-[7px] rounded-full bg-[#FF3B30]" />}
      </Squish>
      <StreakSheet open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function ExpiryNote({ className = "", always }: { className?: string; always?: boolean }) {
  const t = useTrilha();
  const e = t.nextExpiry;
  if (!e || (!e.soon && !always)) return null;
  return (
    <div className={`flex items-center gap-2 rounded-[12px] px-3 py-2 text-[13px] ${e.soon ? "bg-[#FFF4D6] text-[#8A5A00]" : "bg-[#F4F1EC] text-[#6C6257]"} ${className}`}>
      <motion.span className="flex shrink-0" animate={e.soon ? { rotate: [0, 0, 180, 180] } : undefined} transition={{ duration: 2.4, repeat: Infinity, times: [0, 0.6, 0.8, 1] }}>
        <Hourglass size={15} />
      </motion.span>
      <span>
        {e.soon ? <b>{e.pts} Pontos Itaú vencem em {fmtDay(e.day)}.</b> : <>Próximo vencimento: {e.pts} pts em {fmtDay(e.day)}.</>} Pontos da AcademIA.I valem 6 meses e vencem todo dia 25.
      </span>
    </div>
  );
}
