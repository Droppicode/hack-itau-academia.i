import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Car,
  ChevronRight,
  GraduationCap,
  Home as HomeIcon,
  Laptop,
  Mail,
  Map as MapIcon,
  MessageCircle,
  Music,
  Plane,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CATCHPHRASES, CATCHPHRASES_NEW, fmtDay, fmtMult, GOALS, type GoalDef } from "../data/trilha";
import { StreakChip } from "./Streak";
import { brl } from "../data/money";
import { useTrilha } from "../state/TrilhaContext";
import { BottomSheet } from "./BottomSheet";
import { Squish } from "./Squish";
import { useToast } from "./Toast";

export const GOAL_ICON: Record<string, LucideIcon> = {
  celular: Smartphone,
  viagem: Plane,
  festival: Music,
  notebook: Laptop,
  curso: GraduationCap,
  moto: Car,
  casa: HomeIcon,
  reserva: ShieldCheck,
};

export const goalDef = (id?: string): GoalDef => GOALS.find((g) => g.id === id) ?? GOALS[0];

export function IaiAvatar({ size = 34 }: { size?: number }) {
  return (
    <div
      className="relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF6200] to-[#FF9A3D] shadow-[0_0_0_3px_rgba(255,255,255,0.15)]"
      style={{ width: size, height: size }}
    >
      <Sparkles size={size * 0.52} color="white" strokeWidth={2} />
    </div>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      Academ<span className="text-[#FF8A3D]">IA.I</span>
    </span>
  );
}

export function Rotator({ items, className }: { items: string[]; className: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % items.length), 4000);
    return () => window.clearInterval(id);
  }, [items.length]);
  return (
    <div className="relative min-h-[22px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className={className}>
          {items[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function ProgressBar({ pct, className = "", tone = "orange" }: { pct: number; className?: string; tone?: "orange" | "white" | "green" }) {
  const fill = tone === "white" ? "bg-[#FF8A3D]" : tone === "green" ? "bg-[#00857A]" : "bg-itau-orange";
  return (
    <div className={`h-[6px] overflow-hidden rounded-full ${tone === "white" ? "bg-white/20" : "bg-[#E6E6E6]"} ${className}`}>
      <motion.div className={`h-full rounded-full ${fill}`} initial={{ width: 0 }} animate={{ width: `${Math.min(Math.max(pct, 2), 100)}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
    </div>
  );
}

export function useAcademiaEntry() {
  const navigate = useNavigate();
  const { introSeen, goal } = useTrilha();
  return () => navigate(introSeen && goal ? "/academia/trilha" : "/academia/intro", { state: { hero: true } });
}

export const HERO_GRADIENT = "linear-gradient(150deg,#0E1846 0%,#1B2470 50%,#3A1F7A 100%)";

export function HeroBg({ radius }: { radius: string }) {
  return <motion.div aria-hidden layoutId="academia-hero" className="pointer-events-none absolute inset-0" style={{ background: HERO_GRADIENT, borderRadius: radius }} transition={{ type: "spring", stiffness: 260, damping: 30 }} />;
}

export function AcademiaCard() {
  const t = useTrilha();
  const enter = useAcademiaEntry();
  const started = t.introSeen && !!t.goal;
  return (
    <Squish
      onClick={enter}
      aria-label="Abrir AcademIA.I"
      className="relative block w-full overflow-hidden rounded-[18px] px-4 py-3 text-white"
      scale={0.98}
    >
      <HeroBg radius="18px" />
      <motion.span aria-hidden className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-[#FF6200]/30 blur-2xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity }} />
      <div className="relative flex items-center gap-[10px]">
        <IaiAvatar size={30} />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="text-[12px] text-white/70">Educação financeira em 5 min</div>
          <Wordmark className="text-[17px]" />
        </div>
        <ChevronRight size={20} color="#FF8A3D" />
      </div>
      <div className="relative mt-2">
        <Rotator key={started ? "on" : "new"} items={started ? CATCHPHRASES : CATCHPHRASES_NEW} className="text-[15px] font-semibold leading-snug" />
      </div>
      {!started && (
        <div className="relative mt-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-itau-orange px-3 py-[5px] text-[13px] font-semibold text-white">
            Começar em 2 min <ChevronRight size={14} />
          </span>
        </div>
      )}
      {started && (
        <div className="relative mt-2 flex items-center gap-2">
          <StreakChip label />
          <span className="truncate text-[12px] text-white/75">
            {t.nextExpiry?.soon ? `${t.nextExpiry.pts} pts vencem ${fmtDay(t.nextExpiry.day)}` : t.weekActive ? `pontos valendo ${fmtMult(t.multiplier)}` : "faça 1 compra no cartão essa semana"}
          </span>
        </div>
      )}
    </Squish>
  );
}

export function GoalSlider() {
  const t = useTrilha();
  const navigate = useNavigate();
  const enter = useAcademiaEntry();
  const g = t.goal;
  const def = goalDef(g?.id);
  const Icon = GOAL_ICON[def.id] ?? Target;
  const pct = Math.min(100, t.goalPct);
  const shown = g ? Math.max(pct, 4) : 0;
  return (
    <Squish
      onClick={() => (g ? navigate("/cofrinhos", { state: { fromAcademia: true } }) : enter())}
      aria-label="Progresso do objetivo"
      className="block w-full rounded-[16px] bg-white px-4 pb-3 pt-[10px] shadow-[0_2px_10px_rgba(20,33,90,0.06)]"
      scale={0.98}
    >
      <div className="flex items-center gap-2 text-[13px]">
        <span className="min-w-0 flex-1 truncate font-semibold text-[#14215A]">{g ? g.name : "Seu objetivo"}</span>
        <span className="tabular-nums text-[#8A8A8A]">{g ? `${brl(g.savedCents, false)} / ${brl(g.targetCents, false)}` : "defina na AcademIA.I"}</span>
        {g && <span className="rounded-full px-[7px] py-[1px] text-[12px] font-bold tabular-nums text-white" style={{ background: `linear-gradient(135deg, ${def.from}, ${def.to})` }}>{Math.floor(pct)}%</span>}
      </div>
      <div className="relative mt-[14px] h-[10px] rounded-full bg-[#F1EEEA]">
        {[25, 50, 75].map((m) => (
          <span key={m} className="absolute top-1/2 h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${m}%`, background: pct >= m ? "rgba(255,255,255,0.8)" : "#DCD5CC", zIndex: 1 }} />
        ))}
        <motion.div
          className="relative h-full overflow-hidden rounded-full"
          style={{ background: `linear-gradient(90deg, ${def.from}, ${def.to})` }}
          initial={{ width: 0 }}
          animate={{ width: `${shown}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <span className="fx-glint absolute inset-0" />
        </motion.div>
        <motion.span
          className="absolute top-1/2 z-[2] flex h-[28px] w-[28px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white shadow-[0_3px_10px_rgba(20,33,90,0.25)]"
          style={{ background: `linear-gradient(135deg, ${def.from}, ${def.to})` }}
          initial={{ left: "0%" }}
          animate={{ left: `${shown}%` }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
        >
          <motion.span animate={{ y: [0, -2, 0], rotate: [0, -8, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }} className="flex">
            <Icon size={14} color="white" />
          </motion.span>
        </motion.span>
      </div>
    </Squish>
  );
}

const CHANNELS = [
  { Icon: Bell, name: "Push", tag: "EXISTE", body: "Pix feito ✓ Que tal 5 min pra ver seu objetivo enchendo? Conheça a AcademIA.I." },
  { Icon: MessageCircle, name: "WhatsApp", tag: "VERIFICAR opt-in", body: "Oi, Lucas! Aqui é o Itaú. Vimos que você mandou um Pix pra sua outra conta. Conheça a AcademIA.I: lições de 5 min, um cofrinho pro seu objetivo e desafios que valem Pontos Itaú. Bora?" },
  { Icon: Mail, name: "E-mail", tag: "VERIFICAR opt-in", body: "Assunto: Seu próximo objetivo começa com 5 minutos.\n\nA AcademIA.I é uma trilha de educação financeira dentro do app: lições curtas sobre o dinheiro do dia a dia, um cofrinho pro seu objetivo e desafios no fim de cada unidade que valem Pontos Itaú. Na missão do mês, o que fica guardado no cofrinho o mês inteiro vira Pontos Itaú (simulado no protótipo)." },
];

export function PixInvite() {
  const t = useTrilha();
  const toast = useToast();
  const enter = useAcademiaEntry();
  const [sheet, setSheet] = useState(false);
  const [push, setPush] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!t.hook.pending || t.hook.pushSeen || pathname !== "/home") return;
    const a = window.setTimeout(() => setPush(true), 700);
    const b = window.setTimeout(() => {
      setPush(false);
      t.set((s) => ({ hook: { ...s.hook, pushSeen: true } }));
    }, 5200);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [t.hook.pending, t.hook.pushSeen, pathname, t]);

  if (!t.hook.pending) return null;

  return (
    <>
      <AnimatePresence>
        {push && (
          <motion.div
            initial={{ y: -120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="absolute inset-x-3 top-[calc(env(safe-area-inset-top)+8px)] z-50"
          >
            <Squish
              onClick={() => {
                setPush(false);
                t.set((s) => ({ hook: { ...s.hook, pushSeen: true } }));
                enter();
              }}
              className="flex w-full items-start gap-3 rounded-[18px] bg-white/95 p-3 shadow-xl backdrop-blur"
              scale={0.98}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-itau-orange text-[11px] font-bold text-white">itaú</div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between text-[13px] font-semibold text-[#222]">
                  Itaú <span className="font-normal text-[#888]">agora · simulado</span>
                </div>
                <div className="text-[14px] leading-snug text-[#333]">{CHANNELS[0].body}</div>
              </div>
            </Squish>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[18px] border border-[#FFD2B3] bg-[#FFF6EF] p-4">
        <div className="flex items-start gap-3">
          <IaiAvatar size={30} />
          <div className="flex-1">
            <div className="text-[16px] font-semibold leading-snug text-[#222]">Seu Pix pra sua outra conta foi feito. Que tal começar um objetivo?</div>
            <div className="mt-1 text-[14px] text-[#555]">5 min na AcademIA.I: lições rápidas, um cofrinho rendendo pro seu objetivo e desafios que valem Pontos Itaú.</div>
          </div>
          <Squish aria-label="Fechar" onClick={() => t.set((s) => ({ hook: { ...s.hook, pending: false } }))} className="flex h-8 w-8 items-center justify-center rounded-full" scale={0.88}>
            <X size={16} color="#555" />
          </Squish>
        </div>
        <div className="mt-3 flex gap-2">
          <Squish
            onClick={() => {
              t.set((s) => ({ hook: { ...s.hook, pending: false } }));
              enter();
            }}
            className="flex-1 rounded-[12px] bg-itau-orange py-[10px] text-center text-[15px] font-semibold text-white"
            scale={0.96}
          >
            Conhecer
          </Squish>
          <Squish onClick={() => setSheet(true)} className="rounded-[12px] border border-[#FFB27F] px-3 py-[10px] text-[14px] font-semibold text-itau-orange" scale={0.96}>
            Canais
          </Squish>
        </div>
        <Squish
          onClick={() => {
            t.set({ hook: { pending: false, pushSeen: true, off: true } });
            toast("Beleza, não mostramos mais esses convites");
          }}
          className="mt-2 text-[13px] text-[#777] underline"
          scale={0.96}
        >
          Não quero mais esses convites
        </Squish>
      </motion.div>

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Como o convite chega (simulado)">
        <div className="no-scrollbar flex max-h-[55vh] flex-col gap-3 overflow-y-auto pb-2">
          {CHANNELS.map(({ Icon, name, tag, body }) => (
            <div key={name} className="rounded-[14px] bg-[#F4F4F4] p-3">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#222]">
                <Icon size={16} color="#FF6200" /> {name}
                <span className={`ml-auto rounded-full px-2 py-[1px] text-[11px] ${tag === "EXISTE" ? "bg-[#E3F4EA] text-[#1B7F3B]" : "bg-[#FFF1E5] text-[#B54700]"}`}>{tag}</span>
              </div>
              <p className="mt-1 whitespace-pre-line text-[14px] leading-snug text-[#444]">{body}</p>
            </div>
          ))}
          <p className="text-[12px] text-[#888]">Nada é enviado de verdade. Só aparece depois de Pix para conta de mesma titularidade (CPF igual).</p>
        </div>
      </BottomSheet>
    </>
  );
}

export function AcademiaTabs() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const items = [
    { path: "/academia/trilha", label: "Trilha", Icon: MapIcon },
    { path: "/academia/missoes", label: "Missões", Icon: Trophy },
    { path: "/cofrinhos", label: "Objetivo", Icon: Target },
    { path: "/pra-voce", label: "Pontos", Icon: Sparkles },
  ];
  return (
    <div className="shrink-0 bg-[#FBF6F0] px-5 pt-2" style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}>
      <nav className="flex items-center justify-between rounded-full bg-[#14215A] p-[6px] shadow-[0_10px_24px_rgba(20,33,90,0.25)]">
        {items.map(({ path, label, Icon }) => {
          const active = pathname === path;
          return (
            <Squish
              key={path}
              onClick={() => !active && navigate(path, { replace: true, state: { tab: true, fromAcademia: true } })}
              className={`flex h-[44px] items-center justify-center gap-2 rounded-full transition-all ${active ? "flex-[1.4] bg-[#EC7000] text-white" : "flex-1 text-white/70"}`}
              scale={0.92}
            >
              <Icon size={20} strokeWidth={2} />
              {active && <span className="text-[14px] font-semibold">{label}</span>}
            </Squish>
          );
        })}
      </nav>
    </div>
  );
}
