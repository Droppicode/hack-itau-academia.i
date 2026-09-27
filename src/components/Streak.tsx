import { AlertTriangle, Check, Flame } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fmtDay, fmtMult, multiplierFor, STREAK_MAX_WEEKS } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";
import { BottomSheet } from "./BottomSheet";
import { Squish } from "./Squish";

export function StreakSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTrilha();
  const navigate = useNavigate();
  const weeks = Array.from({ length: STREAK_MAX_WEEKS }, (_, i) => t.week - (STREAK_MAX_WEEKS - 1) + i).filter((w) => w >= 1);
  return (
    <BottomSheet open={open} onClose={onClose} title="Sua sequência">
      <div className="-mt-1 flex items-center gap-3">
        <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-[#FF9A3D] to-[#EC7000]">
          <Flame size={30} color="white" fill="white" />
        </span>
        <div>
          <div className="text-[22px] font-bold text-[#14215A]">
            {t.streak} {t.streak === 1 ? "semana seguida" : "semanas seguidas"}
          </div>
          <div className="text-[14px] text-[#6C6257]">
            Seus pontos de missões e desafios valem <b className="text-[#EC7000]">{fmtMult(t.multiplier)}</b>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {weeks.map((w) => {
          const ok = t.txWeeks.includes(w);
          const now = w === t.week;
          return (
            <div key={w} className={`flex flex-1 flex-col items-center rounded-[14px] py-2 ${ok ? "bg-[#FFF1E5]" : "bg-[#F4F1EC]"} ${now ? "ring-2 ring-[#EC7000]" : ""}`}>
              {ok ? <Flame size={18} color="#EC7000" fill="#EC7000" /> : <span className="h-[18px] w-[18px] rounded-full border-2 border-dashed border-[#C9BBAA]" />}
              <span className="mt-1 text-[11px] font-semibold text-[#6C6257]">{now ? "Esta" : `Sem. ${w}`}</span>
            </div>
          );
        })}
      </div>
      <div className={`mt-4 flex items-start gap-2 rounded-[14px] p-3 text-[14px] ${t.weekActive ? "bg-[#E6F4F1] text-[#00574F]" : "bg-[#FFF1E5] text-[#8A4B00]"}`}>
        {t.weekActive ? <Check size={18} className="mt-[1px] shrink-0" /> : <AlertTriangle size={18} className="mt-[1px] shrink-0" />}
        {t.weekActive
          ? `Semana garantida! Na próxima, uma transação leva seus pontos a ${fmtMult(t.nextMultiplier)}.`
          : `Faça um Pix pra outra pessoa ou uma compra no débito até ${fmtDay(t.week * 7)} pra ${t.streak ? "manter a sequência" : "começar a sequência"} (${fmtMult(multiplierFor(t.streak + 1))}).`}
      </div>
      <ul className="mt-4 space-y-1 text-[13px] leading-snug text-[#6C6257]">
        <li>• Cada semana com pelo menos uma transação no Itaú soma 1: +0,05x, até {fmtMult(multiplierFor(STREAK_MAX_WEEKS))} com {STREAK_MAX_WEEKS} semanas.</li>
        <li>• Contam Pix pra outras pessoas e compras no débito. Transferência entre contas suas e cofrinho não contam.</li>
        <li>• Uma semana inteira sem transação e o multiplicador volta pra 1x.</li>
      </ul>
      {!t.weekActive && (
        <Squish onClick={() => (onClose(), navigate("/pix"))} className="mt-4 w-full rounded-full bg-[#EC7000] py-3 text-center text-[16px] font-semibold text-white">
          Fazer um Pix
        </Squish>
      )}
    </BottomSheet>
  );
}

export function StreakChip({ tone = "dark", className = "", label }: { tone?: "dark" | "light"; className?: string; label?: boolean }) {
  const t = useTrilha();
  const [open, setOpen] = useState(false);
  const cls = tone === "dark" ? "bg-white/10 text-white" : "bg-[#FFF1E5] text-[#8A4B00]";
  if (label)
    return (
      <span className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-[5px] text-[13px] font-semibold ${cls} ${className}`}>
        <Flame size={14} fill={t.streak ? "#FF9A3D" : "none"} color={t.streak ? "#FF9A3D" : "currentColor"} />
        {t.streak} sem · {fmtMult(t.multiplier)}
      </span>
    );
  return (
    <>
      <Squish aria-label="Sequência" onClick={() => setOpen(true)} className={`flex items-center gap-1 rounded-full px-3 py-[5px] text-[13px] font-semibold ${cls} ${className}`} scale={0.94}>
        <Flame size={14} fill={t.streak ? "#FF9A3D" : "none"} color={t.streak ? "#FF9A3D" : "currentColor"} />
        {t.streak} sem · {fmtMult(t.multiplier)}
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
    <div className={`flex items-center gap-2 rounded-[12px] px-3 py-2 text-[13px] ${e.soon ? "bg-[#FFF1E5] text-[#8A4B00]" : "bg-[#F4F1EC] text-[#6C6257]"} ${className}`}>
      <AlertTriangle size={15} className="shrink-0" />
      <span>
        {e.soon ? <b>{e.pts} Pontos Itaú vencem em {fmtDay(e.day)}.</b> : <>Próximo vencimento: {e.pts} pts em {fmtDay(e.day)}.</>} Pontos da academIA.I valem 6 meses e vencem todo dia 25.
      </span>
    </div>
  );
}
