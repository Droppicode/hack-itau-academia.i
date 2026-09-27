import { useEffect, useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { GOAL_ICON, goalDef } from "./Iai";
import { Squish } from "./Squish";
import { Forecast } from "./GoalFx";
import { useToast } from "./Toast";
import { brl, parseCents } from "../data/money";
import { GOALS } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";

export const reais = (cents: number) => (cents / 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 });

export function MoneyField({ label, value, onChange, className = "bg-white" }: { label: string; value: string; onChange: (v: string) => void; className?: string }) {
  return (
    <label className={`block rounded-[14px] px-3 py-2 text-[#1A1A1A] ${className}`}>
      <span className="block text-[12px] text-[#6C6257]">{label}</span>
      <span className="flex items-baseline gap-1">
        <span className="text-[15px] font-semibold text-[#6C6257]">R$</span>
        <input
          aria-label={label}
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d,.]/g, "").slice(0, 12))}
          className="w-full min-w-0 bg-transparent text-[18px] font-bold outline-none"
        />
      </span>
    </label>
  );
}

export function GoalSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTrilha();
  const toast = useToast();
  const [goalId, setGoalId] = useState(t.goal?.id ?? GOALS[0].id);
  const [targetRaw, setTargetRaw] = useState("");
  const [monthlyRaw, setMonthlyRaw] = useState("");

  useEffect(() => {
    if (!open) return;
    const g = goalDef(t.goal?.id);
    setGoalId(g.id);
    setTargetRaw(reais(t.goal?.targetCents ?? g.cents));
    setMonthlyRaw(reais(t.goal?.monthlyCents ?? 10000));
  }, [open, t.goal?.id, t.goal?.targetCents, t.goal?.monthlyCents]);

  const target = parseCents(targetRaw);
  const monthly = parseCents(monthlyRaw);
  const ok = target > 0 && monthly > 0;

  const confirm = () => {
    if (!ok) return;
    const g = goalDef(goalId);
    t.setGoal({ id: g.id, name: g.label, targetCents: target, monthlyCents: monthly });
    toast(`Objetivo: ${g.label}`);
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Trocar objetivo">
      <div className="grid grid-cols-2 gap-2">
        {GOALS.map((g) => {
          const Icon = GOAL_ICON[g.id];
          const on = g.id === goalId;
          return (
            <Squish
              key={g.id}
              aria-pressed={on}
              onClick={() => {
                setGoalId(g.id);
                if (g.id !== goalId) setTargetRaw(reais(g.cents));
              }}
              className={`flex items-center gap-2 rounded-[14px] border-2 p-2 text-[14px] font-semibold ${on ? "border-itau-orange bg-[#FFF1E5] text-[#222]" : "border-[#EEE] text-[#444]"}`}
              scale={0.97}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]" style={{ background: `linear-gradient(135deg, ${g.from}, ${g.to})` }}>
                {Icon && <Icon size={16} color="white" />}
              </span>
              <span className="truncate">{g.label}</span>
            </Squish>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <MoneyField label="Quanto custa" value={targetRaw} onChange={setTargetRaw} className="border-2 border-[#EEE] focus-within:border-itau-orange" />
        <MoneyField label="Guardar por mês" value={monthlyRaw} onChange={setMonthlyRaw} className="border-2 border-[#EEE] focus-within:border-itau-orange" />
      </div>
      <div className="mt-3">
        <Forecast savedCents={t.goal?.savedCents ?? 0} targetCents={target} monthlyCents={monthly} month={t.month} />
      </div>
      <p className="mt-2 text-[13px] text-[#666]">
        {ok ? "" : "Digite valores maiores que zero. "}
        {t.goal ? `Os ${brl(t.goal.savedCents)} já guardados continuam no cofrinho.` : ""}
      </p>
      <Squish onClick={confirm} disabled={!ok} className="mt-4 w-full rounded-[12px] bg-itau-orange py-[14px] text-center text-[16px] font-bold text-white disabled:opacity-40" scale={0.97}>
        Salvar objetivo
      </Squish>
    </BottomSheet>
  );
}
