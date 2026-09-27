import { animate, AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";

export function haptic(pattern: number | number[] = 18) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

export function CountUp({ to, from = 0, duration = 1.1, delay = 0, format = (n: number) => Math.round(n).toLocaleString("pt-BR"), className }: { to: number; from?: number; duration?: number; delay?: number; format?: (n: number) => string; className?: string }) {
  const mv = useMotionValue(from);
  const text = useTransform(mv, format);
  useEffect(() => {
    const c = animate(mv, to, { duration, delay, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [mv, to, duration, delay]);
  return <motion.span className={`tabular-nums ${className ?? ""}`}>{text}</motion.span>;
}

function Digit({ d }: { d: number }) {
  return (
    <span className="relative block h-[1.2em] w-[0.6em] overflow-hidden">
      <motion.span className="absolute inset-x-0 top-0 flex flex-col items-center" initial={false} animate={{ y: `${-d * 1.2}em` }} transition={{ type: "spring", stiffness: 140, damping: 20 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="block h-[1.2em] leading-[1.2em]">
            {i}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function Odometer({ value, className = "" }: { value: number; className?: string }) {
  const chars = Math.max(0, Math.round(value)).toLocaleString("pt-BR").split("");
  return (
    <span className={`inline-flex align-[-0.3em] tabular-nums ${className}`} aria-label={String(value)}>
      {chars.map((c, i) => (/\d/.test(c) ? <Digit key={chars.length - i} d={Number(c)} /> : <span key={`s${chars.length - i}`} className="block h-[1.2em] leading-[1.2em]">{c}</span>))}
    </span>
  );
}

const CONFETTI_COLORS = ["#EC7000", "#FF9A3D", "#1F4FD8", "#6FA8FF", "#FFFFFF"];

export function Confetti({ count = 46, colors = CONFETTI_COLORS }: { count?: number; colors?: string[] }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        i,
        x: (Math.random() - 0.5) * 360,
        y: 220 + Math.random() * 320,
        r: (Math.random() - 0.5) * 720,
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        c: colors[i % colors.length],
        d: Math.random() * 0.25,
        round: Math.random() > 0.7,
      })),
    [count, colors],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-[18%] z-40 flex justify-center">
      {bits.map((b) => (
        <motion.span
          key={b.i}
          className="absolute"
          style={{ width: b.w, height: b.round ? b.w : b.h, background: b.c, borderRadius: b.round ? 999 : 2 }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: [0, b.x * 0.7, b.x], y: [0, -140 - Math.random() * 60, b.y], rotate: b.r, opacity: [1, 1, 0], scale: 1 }}
          transition={{ duration: 1.8, delay: b.d, ease: "easeOut", times: [0, 0.3, 1] }}
        />
      ))}
    </div>
  );
}

export function DrawCheck({ size = 96, color = "#FFFFFF", ring = "#EC7000", delay = 0 }: { size?: number; color?: string; ring?: string; delay?: number }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 100 100" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay }}>
      <motion.circle cx={50} cy={50} r={44} fill={ring} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay }} style={{ transformOrigin: "50px 50px" }} />
      <motion.circle cx={50} cy={50} r={44} fill="none" stroke={ring} strokeWidth={3} initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 0.9, delay: delay + 0.3 }} style={{ transformOrigin: "50px 50px" }} />
      <motion.path d="M29 51 44 65 72 36" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, delay: delay + 0.3, ease: "easeOut" }} />
    </motion.svg>
  );
}

export function Noise({ opacity = 0.09 }: { opacity?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay" style={{ opacity }}>
      <filter id={`n${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#n${id})`} />
    </svg>
  );
}

export function AiBackdrop({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} overflow-hidden bg-[linear-gradient(160deg,#0E1846_0%,#1B2470_45%,#3A1F7A_100%)] ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.span className="absolute -left-16 top-[-10%] h-56 w-56 rounded-full bg-[#3B5BFF]/35 blur-3xl" animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="absolute -right-20 top-[30%] h-64 w-64 rounded-full bg-[#9B4DFF]/30 blur-3xl" animate={{ x: [0, -30, 0], y: [0, -40, 0] }} transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }} />
        <motion.span className="absolute bottom-[-12%] left-[20%] h-52 w-52 rounded-full bg-[#FF6200]/25 blur-3xl" animate={{ x: [0, 30, -20, 0], y: [0, -20, 0] }} transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }} />
        <Noise />
      </div>
      <div className="relative h-full">{children}</div>
    </div>
  );
}

export function Shimmer({ className = "" }: { className?: string }) {
  return <div className={`fx-shimmer rounded-[10px] ${className}`} />;
}

const FLAME_TONES = [
  { a: "#C9C4BC", b: "#9E978C" },
  { a: "#FFB23D", b: "#EC7000" },
  { a: "#FF9A3D", b: "#E3470F" },
  { a: "#FF7AB6", b: "#B8338F" },
  { a: "#7FC8FF", b: "#3B5BFF" },
];

export function Flame({ weeks, size = 56, risk = false, burst = false }: { weeks: number; size?: number; risk?: boolean; burst?: boolean }) {
  const id = useId().replace(/:/g, "");
  const tone = risk || weeks <= 0 ? FLAME_TONES[0] : FLAME_TONES[Math.min(weeks, 4)];
  const grow = risk ? 0.85 : 0.8 + Math.min(weeks, 4) * 0.08;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <AnimatePresence>
        {burst && (
          <motion.span
            key="burst"
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${tone.a} 0%, transparent 70%)` }}
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <motion.svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className="relative"
        initial={false}
        animate={risk ? { x: [0, -1.5, 1.5, -1, 1, 0], scale: grow } : burst ? { scale: [grow, grow * 1.35, grow] } : { scale: [grow, grow * 1.04, grow] }}
        transition={risk ? { duration: 0.6, repeat: Infinity, repeatDelay: 0.8 } : burst ? { duration: 0.6 } : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 90%" }}
      >
        <defs>
          <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tone.a} />
            <stop offset="100%" stopColor={tone.b} />
          </linearGradient>
        </defs>
        <path d="M32 4c3 10 16 17 16 33a16 16 0 0 1-32 0c0-8 4-13 7-17 1 5 3 8 6 9-2-9 0-18 3-25z" fill={`url(#f${id})`} />
        <path d="M32 30c2 5 8 8 8 16a8 8 0 0 1-16 0c0-4 2-7 4-9 0 3 2 4 3 5-1-4 0-8 1-12z" fill="#FFF6E0" opacity={risk ? 0.5 : 0.85} />
      </motion.svg>
    </div>
  );
}

export function RollNumber({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`relative inline-flex overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={value} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="tabular-nums">
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function usePrevious<T>(v: T) {
  const ref = useRef<T>(v);
  const [prev, setPrev] = useState<T>(v);
  useEffect(() => {
    setPrev(ref.current);
    ref.current = v;
  }, [v]);
  return prev;
}

export function Ring({ pct, size = 44, stroke = 5, color = "#EC7000", track = "#F1E6DA", children }: { pct: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(Math.max(pct, 0), 100) / 100) }} transition={{ duration: 0.8, ease: "easeOut" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
