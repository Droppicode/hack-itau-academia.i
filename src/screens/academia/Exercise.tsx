import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { IaiAvatar } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";

export const A = {
  bg: "#FBF6F0",
  navy: "#14215A",
  orange: "#EC7000",
  peach: "#FFE9D6",
  ok: "#00857A",
  okBg: "#E1F4F1",
  bad: "#D6001C",
  badBg: "#FCE6E9",
};

export function PlayerShell({ total, pos, onClose, children, footer, tag }: { total: number; pos: number; onClose: () => void; children: ReactNode; footer: ReactNode; tag?: string }) {
  return (
    <Screen
      bg="bg-[#FBF6F0]"
      header={
        <div className="shrink-0 px-5 pb-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IaiAvatar size={26} />
              <span className="text-[13px] font-semibold text-[#14215A]">{tag}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold tabular-nums text-[#8A7B6C]">
                {Math.min(pos + 1, total)}/{total}
              </span>
              <Squish aria-label="Sair" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm" scale={0.88}>
                <X size={18} color="#14215A" />
              </Squish>
            </div>
          </div>
          <div className="mt-3 flex gap-[4px]">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#EADFD3]">
                <motion.div className="h-full bg-[#EC7000]" initial={false} animate={{ width: i < pos ? "100%" : i === pos ? "35%" : "0%" }} transition={{ duration: 0.35 }} />
              </div>
            ))}
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

const LETTERS = ["A", "B", "C", "D"];

export function QuestionBody({ q, options, picked, checked, right, onPick, label, review }: { q: string; options: string[]; picked: number | null; checked: boolean; right: number; onPick: (i: number) => void; label: string; review?: boolean }) {
  return (
    <div className="px-5 pb-6 pt-3">
      <div className="rounded-[24px] bg-white p-5 shadow-[0_8px_24px_rgba(20,33,90,0.08)]">
        <div className="flex items-center gap-2">
          <span className="rounded-full px-[10px] py-[3px] text-[12px] font-bold" style={{ background: review ? A.peach : "#EEF0F8", color: review ? A.orange : A.navy }}>
            {review ? (
              <span className="flex items-center gap-1">
                <RotateCcw size={12} /> Revisão
              </span>
            ) : (
              label
            )}
          </span>
        </div>
        <div className="mt-3 text-[20px] font-semibold leading-snug text-[#14215A]">{q}</div>
      </div>
      <div className="mt-4 flex flex-col gap-[10px]">
        {options.map((o, i) => {
          const state = checked ? (i === right ? "right" : i === picked ? "wrong" : "idle") : i === picked ? "picked" : "idle";
          const bg = state === "right" ? A.okBg : state === "wrong" ? A.badBg : state === "picked" ? A.navy : "#FFFFFF";
          const fg = state === "right" ? A.ok : state === "wrong" ? A.bad : state === "picked" ? "#FFFFFF" : A.navy;
          const badgeBg = state === "picked" ? A.orange : state === "right" ? A.ok : state === "wrong" ? A.bad : A.bg;
          const badgeFg = state === "idle" ? A.navy : "#FFFFFF";
          return (
            <Squish
              key={o}
              disabled={checked}
              onClick={() => onPick(i)}
              className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-[16px] font-semibold shadow-[0_2px_8px_rgba(20,33,90,0.06)] transition-colors"
              style={{ background: bg, color: fg, opacity: checked && state === "idle" ? 0.55 : 1 }}
              scale={0.98}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[14px] font-bold" style={{ background: badgeBg, color: badgeFg }}>
                {LETTERS[i]}
              </span>
              <span className="flex-1">{o}</span>
            </Squish>
          );
        })}
      </div>
    </div>
  );
}

export function PillButton({ label, onClick, disabled, tone = "navy" }: { label: string; onClick: () => void; disabled?: boolean; tone?: "navy" | "orange" | "ghost" }) {
  const cls = disabled ? "bg-[#E6DDD3] text-[#A89A8B]" : tone === "orange" ? "bg-[#EC7000] text-white" : tone === "ghost" ? "bg-transparent text-[#14215A]" : "bg-[#14215A] text-white";
  return (
    <Squish disabled={disabled} onClick={onClick} className={`flex h-[52px] w-full items-center justify-between rounded-full pl-6 pr-2 text-[16px] font-semibold ${cls}`} scale={0.97}>
      <span>{label}</span>
      {tone !== "ghost" && (
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${disabled ? "bg-white/40" : "bg-white/15"}`}>
          <ArrowRight size={18} />
        </span>
      )}
    </Squish>
  );
}

export function FooterWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative shrink-0 px-5 pt-2" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
      {children}
    </div>
  );
}

export function CheckFooter({ picked, checked, ok, why, onCheck, onNext, nextLabel = "Seguir", requeue }: { picked: number | null; checked: boolean; ok: boolean; why: string; onCheck: () => void; onNext: () => void; nextLabel?: string; requeue?: boolean }) {
  return (
    <FooterWrap>
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-3 flex items-start gap-3 overflow-hidden rounded-[18px] bg-white p-4 shadow-[0_8px_24px_rgba(20,33,90,0.12)]"
            style={{ borderLeft: `5px solid ${ok ? A.ok : A.bad}` }}
          >
            <IaiAvatar size={32} />
            <div>
              <div className="text-[16px] font-bold" style={{ color: ok ? A.ok : A.bad }}>
                {ok ? "Isso aí!" : "Não foi dessa vez"}
              </div>
              <div className="text-[14px] leading-snug text-[#3C3C4C]">{why}</div>
              {!ok && requeue && <div className="mt-1 text-[12px] font-semibold text-[#EC7000]">Essa volta no fim da lição pra você revisar.</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <PillButton label={checked ? nextLabel : "Confirmar resposta"} disabled={!checked && picked === null} onClick={checked ? onNext : onCheck} tone={checked ? "orange" : "navy"} />
    </FooterWrap>
  );
}
