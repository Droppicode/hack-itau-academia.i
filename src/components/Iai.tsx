import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATCHPHRASES, GOALS } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";
import { Squish } from "./Squish";
import { useToast } from "./Toast";

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

function Rotator({ items, className }: { items: string[]; className: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((x) => (x + 1) % items.length), 4000);
    return () => window.clearInterval(id);
  }, [items.length]);
  return (
    <div className="relative min-h-[44px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={className}
        >
          {items[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function ProgressBar({ pct, className = "", tone = "orange" }: { pct: number; className?: string; tone?: "orange" | "white" }) {
  return (
    <div className={`h-[6px] overflow-hidden rounded-full ${tone === "white" ? "bg-white/20" : "bg-[#E6E6E6]"} ${className}`}>
      <motion.div
        className={`h-full rounded-full ${tone === "white" ? "bg-[#FF8A3D]" : "bg-itau-orange"}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(pct, 2)}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

export function IaiHomeCard() {
  const navigate = useNavigate();
  const t = useTrilha();

  if (t.homeCardMin) {
    return (
      <Squish
        onClick={() => t.set({ homeCardMin: false })}
        className="flex w-full items-center gap-3 rounded-[18px] bg-itau-navy px-4 py-3 text-white"
        scale={0.98}
      >
        <IaiAvatar size={28} />
        <span className="flex-1 text-[15px]">
          <Wordmark /> · {t.next ? `próxima: ${t.next.title}` : "trilha concluída"}
        </span>
        <ChevronRight size={18} />
      </Squish>
    );
  }

  const started = t.diag.done || t.completed.length > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#1F2A63] via-[#22307A] to-[#003087] px-[20px] pb-[18px] pt-[16px] text-white"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#FF6200]/30 blur-2xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <div className="relative flex items-center gap-[10px]">
        <IaiAvatar />
        <div className="flex-1 leading-tight">
          <div className="text-[13px] text-white/70">Ia.i apresenta</div>
          <Wordmark className="text-[18px]" />
        </div>
        <Squish aria-label="Minimizar" onClick={() => t.set({ homeCardMin: true })} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10" scale={0.88}>
          <X size={16} />
        </Squish>
      </div>

      <div className="relative mt-3">
        <Rotator items={CATCHPHRASES} className="text-[17px] font-semibold leading-snug" />
      </div>

      {!started ? (
        <div className="relative mt-3">
          <div className="text-[14px] text-white/80">Pra começar, 1 toque: qual é o seu próximo sonho?</div>
          <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1">
            {GOALS.map((g) => (
              <Squish
                key={g.id}
                onClick={() => {
                  t.set((s) => ({ diag: { ...s.diag, goal: g.id } }));
                  navigate("/academia/diagnostico");
                }}
                className="shrink-0 rounded-full border border-white/30 bg-white/10 px-[14px] py-[7px] text-[14px] font-semibold"
                scale={0.92}
              >
                {g.label}
              </Squish>
            ))}
          </div>
          <Squish onClick={() => navigate("/academia")} className="mt-3 flex items-center gap-1 text-[14px] font-semibold text-[#FF8A3D]" scale={0.95}>
            Conhecer a trilha <ChevronRight size={16} />
          </Squish>
        </div>
      ) : (
        <div className="relative mt-3">
          <div className="flex items-center justify-between text-[13px] text-white/80">
            <span>
              Nível {t.level} · {t.points} pts
            </span>
            <span>{t.completed.length}/12 lições</span>
          </div>
          <ProgressBar pct={t.levelPct} tone="white" className="mt-[6px]" />
          <Squish
            onClick={() => navigate(t.next ? `/academia/licao/${t.next.id}` : "/academia")}
            className="mt-3 flex w-full items-center gap-3 rounded-[14px] bg-white px-4 py-3 text-[#1A1A1A]"
            scale={0.97}
          >
            <div className="flex-1">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-itau-orange">
                {t.next ? `${t.next.id} · 60 s · +${t.next.points} pts` : "Trilha concluída"}
              </div>
              <div className="text-[16px] font-semibold leading-tight">{t.next ? t.next.title : "Escolha sua próxima trilha"}</div>
            </div>
            <ChevronRight size={20} color="#FF6200" />
          </Squish>
        </div>
      )}
    </motion.div>
  );
}

export function PixHookCard({ onGo }: { onGo: () => void }) {
  const t = useTrilha();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 1100);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="mt-5 w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-[#1F2A63] to-[#003087] p-[18px] text-left text-white"
        >
          <div className="flex items-center gap-2">
            <IaiAvatar size={28} />
            <span className="text-[13px] text-white/75">Ia.i · leva 60 s</span>
          </div>
          <p className="mt-3 text-[17px] font-semibold leading-snug">
            Pix feito. Mas você sabe quando vale mais usar Pix, débito ou crédito?
          </p>
          <p className="mt-1 text-[14px] text-white/75">3 situações do dia a dia, sem juridiquês. Vale +50 pts no Minhas Vantagens.</p>
          <div className="mt-4 flex gap-2">
            <Squish onClick={onGo} className="flex-1 rounded-[12px] bg-itau-orange py-[11px] text-center text-[15px] font-semibold" scale={0.96}>
              Bora ver
            </Squish>
            <Squish
              onClick={() => {
                const n = t.hookNo + 1;
                t.set({ hookNo: n });
                setOpen(false);
                toast(n >= 2 ? "Beleza. A gente fica quieto por 30 dias." : "Tranquilo, fica pra depois.");
              }}
              className="rounded-[12px] border border-white/30 px-4 py-[11px] text-[15px] font-semibold"
              scale={0.96}
            >
              Agora não
            </Squish>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
