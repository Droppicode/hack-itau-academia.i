import { AnimatePresence, motion } from "framer-motion";
import { Award } from "lucide-react";
import { useMemo } from "react";
import { brl, monthsTo } from "../data/money";
import { fmtMonth } from "../data/trilha";
import { GOAL_ICON, goalDef } from "./Iai";

export function GoalArt({ goalId, pct, size = 76 }: { goalId?: string; pct: number; size?: number }) {
  const Icon = GOAL_ICON[goalDef(goalId).id];
  if (!Icon) return null;
  const p = Math.min(Math.max(pct, 0), 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`${Math.floor(p)}% do objetivo`}>
      <Icon size={size} strokeWidth={1.4} color="rgba(255,255,255,0.28)" className="absolute inset-0" />
      <motion.div className="absolute inset-0" initial={{ clipPath: "inset(100% 0 0 0)" }} animate={{ clipPath: `inset(${100 - p}% 0 0 0)` }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
        <Icon size={size} strokeWidth={2.2} color="#FFFFFF" className="drop-shadow-[0_0_8px_rgba(255,255,255,0.55)]" />
      </motion.div>
    </div>
  );
}

const STEPS = [
  { at: 25, line: "Um quarto do caminho. O hábito já começou." },
  { at: 50, line: "Metade! Daqui pra frente é ladeira abaixo." },
  { at: 75, line: "Três quartos. Já dá pra sentir o objetivo." },
];

export function Milestones({ pct }: { pct: number }) {
  const hit = STEPS.filter((s) => pct >= s.at);
  const last = hit[hit.length - 1];
  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => {
          const on = pct >= s.at;
          return (
            <motion.span
              key={s.at}
              initial={false}
              animate={on ? { scale: [0.6, 1.25, 1], rotate: [0, -12, 0] } : { scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
              className={`flex items-center gap-1 rounded-full px-2 py-[2px] text-[11px] font-bold ${on ? "bg-white text-[#14215A]" : "bg-white/15 text-white/60"}`}
            >
              <Award size={12} /> {s.at}%
            </motion.span>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {last && (
          <motion.div key={last.at} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.9 }} className="mt-2 text-[13px] font-semibold text-white/90">
            {last.line}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const shortMonth = (m: number) => {
  const [name = "", , year = ""] = fmtMonth(m).split(" ");
  return `${name.slice(0, 3).toLowerCase()}/${year.slice(2)}`;
};

export function Forecast({ savedCents, targetCents, monthlyCents, month }: { savedCents: number; targetCents: number; monthlyCents: number; month: number }) {
  const left = Math.max(targetCents - savedCents, 0);
  const months = monthsTo(left, monthlyCents);
  const ok = Number.isFinite(months) && monthlyCents > 0;
  const W = 300;
  const H = 70;
  const startY = H - 8 - (Math.min(savedCents / Math.max(targetCents, 1), 1) * (H - 16));
  const path = useMemo(() => `M8 ${startY.toFixed(1)} L${W - 12} 8`, [startY]);
  return (
    <div className="rounded-[14px] bg-[#F6F7FB] p-3">
      <div className="text-[13px] text-[#444]">
        {left === 0 ? (
          <b className="text-[#00857A]">Objetivo alcançado!</b>
        ) : ok ? (
          <>
            No ritmo de <b>{brl(monthlyCents, false)}/mês</b> você chega em{" "}
            <motion.b key={months} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block text-[#EC7000]">
              {shortMonth(month + months)}
            </motion.b>
          </>
        ) : (
          "Digite quanto quer guardar por mês."
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-[60px] w-full">
        <line x1={8} y1={8} x2={W - 12} y2={8} stroke="#E1E4EE" strokeWidth={1} />
        <motion.path d={path} initial={false} animate={{ d: path }} fill="none" stroke="#EC7000" strokeWidth={2.5} strokeDasharray="6 6" strokeLinecap="round" transition={{ type: "spring", stiffness: 120, damping: 18 }} />
        <circle cx={8} cy={startY} r={4.5} fill="#14215A" />
        <circle cx={W - 12} cy={8} r={5} fill={ok || left === 0 ? "#EC7000" : "#C9CEDB"} />
        <text x={8} y={H - 2} fontSize={10} fill="#8A8FA3">
          hoje
        </text>
        <text x={W - 12} y={H - 2} fontSize={10} fill="#8A8FA3" textAnchor="end">
          {ok ? `${months} ${months === 1 ? "mês" : "meses"}` : "?"}
        </text>
      </svg>
    </div>
  );
}

export function Coins({ dir, k }: { dir: "in" | "out"; k: number }) {
  const coins = useMemo(() => Array.from({ length: dir === "in" ? 9 : 5 }, (_, i) => ({ i, x: (Math.random() - 0.5) * 180, d: i * 0.06, r: (Math.random() - 0.5) * 200 })), [dir, k]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {coins.map((c) => (
        <motion.span
          key={`${k}-${c.i}`}
          className="absolute left-1/2 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#F2B400] bg-[#FFD54A] text-[11px] font-extrabold text-[#9A6B00] shadow"
          initial={dir === "in" ? { x: c.x, y: -30, opacity: 0, rotate: 0 } : { x: c.x * 0.4, y: 90, opacity: 1, rotate: 0 }}
          animate={dir === "in" ? { y: [-30, 95, 80, 95], opacity: [0, 1, 1, 0], rotate: c.r } : { y: -40, x: c.x, opacity: 0, rotate: c.r }}
          transition={{ duration: dir === "in" ? 1 : 0.8, delay: c.d, ease: "easeIn" }}
        >
          R$
        </motion.span>
      ))}
    </div>
  );
}
