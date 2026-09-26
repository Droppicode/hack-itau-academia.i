import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { useState, type ReactNode } from "react";
import { IaiAvatar } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";

export type Question = { q: string; options: string[]; right: number; why: string };

export function PlayerShell({ pct, onClose, children, footer }: { pct: number; onClose: () => void; children: ReactNode; footer: ReactNode }) {
  return (
    <Screen
      header={
        <div className="flex h-[56px] shrink-0 items-center gap-3 px-4">
          <Squish aria-label="Sair" onClick={onClose} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <X size={26} color="#777" />
          </Squish>
          <div className="h-[14px] flex-1 overflow-hidden rounded-full bg-[#E6E6E6]">
            <motion.div className="h-full rounded-full bg-[#1F9D55]" animate={{ width: `${Math.max(pct, 3)}%` }} transition={{ type: "spring", stiffness: 200, damping: 25 }} />
          </div>
        </div>
      }
      footer={footer}
    >
      {children}
    </Screen>
  );
}

export function useAnswer() {
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  return { picked, setPicked, checked, setChecked, reset: () => (setPicked(null), setChecked(false)) };
}

export function QuestionBody({ q, options, picked, checked, right, onPick, label }: { q: string; options: string[]; picked: number | null; checked: boolean; right: number; onPick: (i: number) => void; label: string }) {
  return (
    <div className="px-5 pt-4">
      <div className="text-[13px] font-bold uppercase tracking-wide text-itau-orange">{label}</div>
      <div className="mt-3 flex items-start gap-3">
        <IaiAvatar size={38} />
        <div className="relative flex-1 rounded-[16px] border-2 border-[#E6E6E6] px-4 py-3 text-[18px] font-semibold leading-snug text-[#222]">{q}</div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {options.map((o, i) => {
          const state = checked ? (i === right ? "right" : i === picked ? "wrong" : "idle") : i === picked ? "picked" : "idle";
          const cls =
            state === "right"
              ? "border-[#1F9D55] bg-[#E3F4EA] text-[#1B7F3B]"
              : state === "wrong"
                ? "border-[#E4002B] bg-[#FDE8EC] text-[#B00020]"
                : state === "picked"
                  ? "border-[#1F2A63] bg-[#EEF1FB] text-[#1F2A63]"
                  : "border-[#E0E0E0] bg-white text-[#333]";
          return (
            <Squish
              key={o}
              disabled={checked}
              onClick={() => onPick(i)}
              className={`w-full rounded-[14px] border-2 border-b-[4px] px-4 py-[13px] text-[16px] font-semibold ${cls}`}
              scale={0.97}
            >
              {o}
            </Squish>
          );
        })}
      </div>
    </div>
  );
}

export function CheckFooter({ picked, checked, ok, why, onCheck, onNext, nextLabel = "Continuar" }: { picked: number | null; checked: boolean; ok: boolean; why: string; onCheck: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="relative shrink-0" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-x-0 bottom-0 top-[-110px] ${ok ? "bg-[#E3F4EA]" : "bg-[#FDE8EC]"}`}
          />
        )}
      </AnimatePresence>
      <div className="relative px-5 pt-4">
        {checked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="-mt-[96px] mb-4 flex min-h-[80px] items-start gap-2">
            {ok ? <CheckCircle2 size={26} color="#1B7F3B" /> : <XCircle size={26} color="#B00020" />}
            <div>
              <div className={`text-[18px] font-bold ${ok ? "text-[#1B7F3B]" : "text-[#B00020]"}`}>{ok ? "Mandou bem!" : "Quase!"}</div>
              <div className={`text-[14px] leading-snug ${ok ? "text-[#1B7F3B]" : "text-[#B00020]"}`}>{why}</div>
            </div>
          </motion.div>
        )}
        <Squish
          disabled={!checked && picked === null}
          onClick={checked ? onNext : onCheck}
          className={`w-full rounded-[14px] border-b-[4px] py-[13px] text-center text-[16px] font-bold uppercase tracking-wide text-white ${
            !checked && picked === null ? "border-[#C9C9C9] bg-[#E0E0E0]" : checked && !ok ? "border-[#8A0019] bg-[#E4002B]" : "border-[#137540] bg-[#1F9D55]"
          }`}
          scale={0.97}
        >
          {checked ? nextLabel : "Verificar"}
        </Squish>
      </div>
    </div>
  );
}
