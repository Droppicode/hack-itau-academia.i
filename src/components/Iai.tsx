import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronRight, Flame, Map as MapIcon, Mail, MessageCircle, Sparkles, Target, Trophy, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CATCHPHRASES, CDI_YEAR, GOALS, type GoalId } from "../data/trilha";
import { brl, monthsTo } from "../data/money";
import { useTrilha } from "../state/TrilhaContext";
import { BottomSheet } from "./BottomSheet";
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
      Academia <span className="text-[#FF8A3D]">Ia.i</span>
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
    <div className="relative min-h-[44px]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className={className}>
          {items[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export function ProgressBar({ pct, className = "", tone = "orange" }: { pct: number; className?: string; tone?: "orange" | "white" | "green" }) {
  const fill = tone === "white" ? "bg-[#FF8A3D]" : tone === "green" ? "bg-[#1F9D55]" : "bg-itau-orange";
  return (
    <div className={`h-[6px] overflow-hidden rounded-full ${tone === "white" ? "bg-white/20" : "bg-[#E6E6E6]"} ${className}`}>
      <motion.div className={`h-full rounded-full ${fill}`} initial={{ width: 0 }} animate={{ width: `${Math.min(Math.max(pct, 2), 100)}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
    </div>
  );
}

export function useAcademiaEntry() {
  const navigate = useNavigate();
  const { introSeen } = useTrilha();
  return () => navigate(introSeen ? "/academia/trilha" : "/academia/intro");
}

export function Ring({ pct, size = 86, stroke = 9, color = "#FF6200", track = "rgba(255,255,255,0.18)", children }: { pct: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.min(pct, 100) / 100) }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

export function GoalEditor({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTrilha();
  const toast = useToast();
  const [id, setId] = useState<GoalId>(t.goal?.id ?? "celular");
  const [target, setTarget] = useState(t.goal?.targetCents ?? 180000);
  const [monthly, setMonthly] = useState(t.goal?.monthlyCents ?? 15000);
  useEffect(() => {
    if (!open) return;
    setId(t.goal?.id ?? "celular");
    setTarget(t.goal?.targetCents ?? 180000);
    setMonthly(t.goal?.monthlyCents ?? 15000);
  }, [open, t.goal]);
  const months = monthsTo(target, monthly);

  return (
    <BottomSheet open={open} onClose={onClose} title={t.goal ? "Ajustar objetivo" : "Criar objetivo"}>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {GOALS.map((g) => (
          <Squish
            key={g.id}
            onClick={() => {
              setId(g.id);
              setTarget(g.cents);
            }}
            className={`shrink-0 rounded-full border px-[14px] py-[7px] text-[14px] font-semibold ${id === g.id ? "border-itau-orange bg-[#FFF1E5] text-itau-orange" : "border-[#CCC] text-[#444]"}`}
            scale={0.92}
          >
            {g.label}
          </Squish>
        ))}
      </div>
      <label className="mt-4 block text-[14px] text-[#555]">
        Quanto custa: <b className="text-[#222]">{brl(target, false)}</b>
        <input type="range" min={30000} max={1000000} step={10000} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="mt-1 w-full accent-[#FF6200]" />
      </label>
      <label className="mt-2 block text-[14px] text-[#555]">
        Quanto guardar por mês: <b className="text-[#222]">{brl(monthly, false)}</b>
        <input type="range" min={2000} max={100000} step={1000} value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="mt-1 w-full accent-[#FF6200]" />
      </label>
      <div className="mt-3 rounded-[12px] bg-[#F4F4F4] p-3 text-[15px] text-[#333]">
        Chega lá em <b>{months} {months === 1 ? "mês" : "meses"}</b>, sem contar o rendimento da caixinha.
      </div>
      <Squish
        onClick={() => {
          const label = GOALS.find((g) => g.id === id)?.label ?? "Objetivo";
          t.set((s) => ({
            goal: { id, name: label, targetCents: target, monthlyCents: monthly, savedCents: s.goal?.savedCents ?? 0, history: s.goal?.history ?? [s.goal?.savedCents ?? 0] },
          }));
          toast("Objetivo salvo");
          onClose();
        }}
        className="mt-4 w-full rounded-[12px] bg-itau-orange py-3 text-center text-[16px] font-semibold text-white"
        scale={0.97}
      >
        Salvar objetivo
      </Squish>
    </BottomSheet>
  );
}

function Slide({ children, className }: { children: ReactNode; className: string }) {
  return <div className={`relative w-full shrink-0 snap-center overflow-hidden rounded-[18px] px-5 pb-5 pt-4 text-white ${className}`}>{children}</div>;
}

export function HomeCarousel() {
  const t = useTrilha();
  const navigate = useNavigate();
  const enter = useAcademiaEntry();
  const [i, setI] = useState(0);
  const [edit, setEdit] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const monthMission = t.missions.find((m) => m.id === "m-mes");
  const g = t.goal;
  const pct = g ? (g.savedCents / g.targetCents) * 100 : 0;
  const left = g ? monthsTo(Math.max(g.targetCents - g.savedCents, 0), g.monthlyCents) : 0;

  const go = (n: number) => ref.current?.scrollTo({ left: n * ref.current.clientWidth, behavior: "smooth" });

  return (
    <div>
      <div
        ref={ref}
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="no-scrollbar flex snap-x snap-mandatory gap-0 overflow-x-auto rounded-[18px]"
      >
        <Slide className="bg-gradient-to-br from-[#1F2A63] via-[#22307A] to-[#003087]">
          <motion.div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#FF6200]/30 blur-2xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity }} />
          <div className="relative flex items-center gap-[10px]">
            <IaiAvatar />
            <div className="flex-1 leading-tight">
              <div className="text-[13px] text-white/70">Educação financeira em 5 min</div>
              <Wordmark className="text-[18px]" />
            </div>
            {t.streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[13px] font-semibold">
                <Flame size={14} color="#FF8A3D" /> {t.streak} sem
              </span>
            )}
          </div>
          <div className="relative mt-3">
            <Rotator items={CATCHPHRASES} className="text-[17px] font-semibold leading-snug" />
          </div>
          <Squish onClick={enter} className="relative mt-3 flex w-full items-center gap-3 rounded-[14px] bg-white px-4 py-3 text-[#1A1A1A]" scale={0.97}>
            <MapIcon size={20} color="#FF6200" />
            <div className="flex-1">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-itau-orange">
                {t.introSeen ? `Nível ${t.level} · ${t.points} pts · ${t.completed.length}/12` : "Novo"}
              </div>
              <div className="text-[16px] font-semibold leading-tight">{!t.introSeen ? "Conhecer a Academia Ia.i" : t.next ? `Continuar: ${t.next.title}` : "Trilha concluída"}</div>
            </div>
            <ChevronRight size={20} color="#FF6200" />
          </Squish>
        </Slide>

        <Slide className="bg-gradient-to-br from-[#0F5F35] to-[#1F9D55]">
          <div className="flex items-center gap-2 text-[13px] text-white/80">
            <Target size={16} /> Meu objetivo
            <span className="ml-auto rounded-full bg-white/15 px-2 py-[2px] text-[11px]">simulado</span>
          </div>
          {g ? (
            <>
              <div className="mt-3 flex items-center gap-4">
                <Ring pct={pct} color="#FFFFFF">
                  <span className="text-[18px] font-bold">{Math.floor(Math.min(pct, 100))}%</span>
                </Ring>
                <div className="min-w-0 flex-1">
                  <div className="text-[18px] font-bold leading-tight">{g.name}</div>
                  <div className="text-[14px] text-white/85">
                    {brl(g.savedCents)} de {brl(g.targetCents, false)}
                  </div>
                  <div className="mt-1 text-[13px] text-white/75">{pct >= 100 ? "Objetivo completo!" : `Faltam ~${left} ${left === 1 ? "mês" : "meses"} · ${brl(g.monthlyCents, false)}/mês`}</div>
                </div>
              </div>
              <div className="mt-3 flex h-[34px] items-end gap-[4px]">
                {g.history.slice(-12).map((v, k) => (
                  <motion.div key={k} className="flex-1 rounded-t-[3px] bg-white/60" initial={{ height: 0 }} animate={{ height: `${Math.max((v / g.targetCents) * 100, 4)}%` }} />
                ))}
              </div>
              <div className="mt-3 flex gap-2">
                <Squish onClick={() => t.advanceMonth()} className="flex-1 rounded-[12px] bg-white py-[9px] text-center text-[14px] font-semibold text-[#0F5F35]" scale={0.96}>
                  Simular +1 mês
                </Squish>
                <Squish onClick={() => setEdit(true)} className="rounded-[12px] border border-white/40 px-4 py-[9px] text-[14px] font-semibold" scale={0.96}>
                  Ajustar
                </Squish>
              </div>
              <div className="mt-2 text-[11px] text-white/70">Rendendo {t.cdi105 ? "105%" : "100%"} do CDI simulado ({(CDI_YEAR * 100).toFixed(1)}% a.a.). Não é movimentação real.</div>
            </>
          ) : (
            <>
              <div className="mt-3 text-[18px] font-bold leading-snug">Qual é o seu próximo sonho?</div>
              <div className="mt-1 text-[14px] text-white/85">Coloque valor e quanto guardar por mês. A gente mostra ele sendo completado.</div>
              <Squish onClick={() => setEdit(true)} className="mt-4 w-full rounded-[12px] bg-white py-[10px] text-center text-[15px] font-semibold text-[#0F5F35]" scale={0.96}>
                Criar objetivo
              </Squish>
            </>
          )}
        </Slide>

        <Slide className="bg-gradient-to-br from-[#C44900] to-[#FF6200]">
          <div className="flex items-center gap-2 text-[13px] text-white/85">
            <Trophy size={16} /> Missão do mês
          </div>
          <div className="mt-3 text-[18px] font-bold leading-snug">Guardar e deixar as contas em dia</div>
          <div className="mt-1 text-[14px] text-white/90">Cumpriu? Sua caixinha rende 105% do CDI no mês seguinte.</div>
          {monthMission && (
            <>
              <ProgressBar pct={(monthMission.progress / monthMission.goal) * 100} tone="white" className="mt-3" />
              <div className="mt-1 text-[13px] text-white/85">{monthMission.status === "bloqueada" ? "Libera na lição 4 (Reserva de emergência)" : `${monthMission.progress}/${monthMission.goal} · ${monthMission.status}`}</div>
            </>
          )}
          <Squish onClick={() => (t.introSeen ? navigate("/academia/missoes") : enter())} className="mt-3 w-full rounded-[12px] bg-white py-[10px] text-center text-[15px] font-semibold text-itau-orange" scale={0.96}>
            Ver missões
          </Squish>
        </Slide>
      </div>
      <div className="mt-2 flex justify-center gap-[6px]">
        {[0, 1, 2].map((n) => (
          <Squish key={n} aria-label={`Slide ${n + 1}`} onClick={() => go(n)} className={`h-[7px] rounded-full ${i === n ? "w-5 bg-itau-orange" : "w-[7px] bg-[#C9C9C9]"}`} scale={0.8} />
        ))}
      </div>
      <GoalEditor open={edit} onClose={() => setEdit(false)} />
    </div>
  );
}

const CHANNELS = [
  { Icon: Bell, name: "Push", tag: "EXISTE", body: "Pix feito ✓ Que tal 5 min pra fazer seu dinheiro render mais? Conheça a Academia Ia.i." },
  { Icon: MessageCircle, name: "WhatsApp", tag: "VERIFICAR opt-in", body: "Oi, Matheus! Aqui é o Itaú. Vimos que você mandou um Pix pra sua outra conta. Criamos a Academia Ia.i: lições de 5 min, quiz que vale pontos e missões que deixam sua caixinha rendendo 105% do CDI. Bora?" },
  { Icon: Mail, name: "E-mail", tag: "VERIFICAR opt-in", body: "Assunto: Seu dinheiro pode render mais — e você aprende no caminho.\n\nA Academia Ia.i é uma trilha de educação financeira dentro do app: 12 lições curtas, aprofundamento opcional e quizzes que liberam pontos no Minhas Vantagens. Complete a missão do mês e sua caixinha rende 105% do CDI (condição simulada no protótipo)." },
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
            <div className="text-[16px] font-semibold leading-snug text-[#222]">Seu Pix pra sua outra conta foi feito. Bora fazer seu dinheiro render mais?</div>
            <div className="mt-1 text-[14px] text-[#555]">5 min na Academia Ia.i: lições rápidas, quiz que vale pontos e caixinha a 105% do CDI com a missão do mês.</div>
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
    { path: "/pra-voce", label: "Vantagens", Icon: Sparkles },
  ];
  return (
    <nav className="flex shrink-0 justify-around border-t border-[#E3E3E3] bg-white pt-2" style={{ paddingBottom: "max(22px, env(safe-area-inset-bottom))" }}>
      {items.map(({ path, label, Icon }) => {
        const active = pathname === path;
        return (
          <Squish key={path} onClick={() => !active && navigate(path, { replace: true, state: { tab: true } })} className="flex w-[90px] flex-col items-center" scale={0.9}>
            <div className={`flex h-[34px] w-[52px] items-center justify-center rounded-full ${active ? "bg-[#FFF1E5]" : ""}`}>
              <Icon size={22} color={active ? "#FF6200" : "#555"} strokeWidth={1.9} />
            </div>
            <span className={`mt-[2px] text-[12px] ${active ? "font-semibold text-itau-orange" : "text-[#555]"}`}>{label}</span>
          </Squish>
        );
      })}
    </nav>
  );
}
