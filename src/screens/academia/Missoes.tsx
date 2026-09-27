import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, Gift, Lock, PiggyBank, Settings2, Sparkles, Star, Trophy } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../../components/BottomSheet";
import { AcademiaTabs } from "../../components/Iai";
import { haptic, Odometer, Ring } from "../../components/fx";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { useToast } from "../../components/Toast";
import { brl } from "../../data/money";
import { ExpiryNote, StreakChip } from "../../components/Streak";
import { fmtDay, fmtMonth, fmtMult, MONTH_DAYS, MONTHLY_PTS, monthlyPoints, POINT_BRL, QUARTER_CAP_PTS, UNIT_POINTS_PER_RIGHT, unitDef, unitQuiz, unitQuizPoints, UNITS } from "../../data/trilha";
import { deltaToHome, deltaToIa } from "../../state/homeHistory";
import { useTrilha, type MissionView } from "../../state/TrilhaContext";

type Action = { label: string; run: () => void };

function MissionCard({ m, mult, action, onClaim, claiming }: { m: MissionView; mult: number; action?: Action; onClaim: (el: HTMLElement) => void; claiming: boolean }) {
  const pts = Math.round(m.points * mult);
  if (m.status === "concluída")
    return (
      <motion.div
        key="back"
        initial={{ rotateY: 90, opacity: 0.4 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        style={{ transformPerspective: 800 }}
        className="relative overflow-hidden rounded-[16px] bg-gradient-to-br from-[#EC7000] to-[#FF9A3D] p-4 text-white shadow-[0_8px_22px_rgba(236,112,0,0.35)]"
      >
        <span aria-hidden className="fx-glint pointer-events-none absolute inset-0" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
            <Check size={22} strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-semibold text-white/85">{m.title} · concluída</div>
            <div className="text-[26px] font-extrabold leading-none">+{pts} pts</div>
          </div>
        </div>
        <Squish
          onClick={(e) => onClaim(e.currentTarget)}
          disabled={claiming}
          className="relative mt-3 w-full rounded-[12px] bg-white py-[10px] text-center text-[15px] font-bold text-[#B54700]"
          scale={0.96}
        >
          {claiming ? "Resgatando…" : "Resgatar"}
        </Squish>
      </motion.div>
    );
  const locked = m.status === "bloqueada";
  const done = m.status === "resgatada";
  const pct = done ? 100 : (m.progress / Math.max(m.goal, 1)) * 100;
  return (
    <motion.div key="front" layout className={`rounded-[16px] p-4 ${locked ? "bg-white/60" : "bg-white"}`}>
      <div className="flex items-start gap-3">
        <Ring pct={locked ? 0 : pct} size={46} color={done ? "#00857A" : "#EC7000"} track={locked ? "#EEE" : "#F6E8DA"}>
          {locked ? <Lock size={15} color="#999" /> : done ? <Check size={18} color="#00857A" strokeWidth={3} /> : m.goal > 1 ? <span className="text-[12px] font-bold text-[#B54700]">{m.progress}/{m.goal}</span> : <Sparkles size={16} color="#EC7000" />}
        </Ring>
        <div className="min-w-0 flex-1">
          <div className={`text-[15px] font-semibold ${locked ? "text-[#888]" : "text-[#222]"}`}>{m.title}</div>
          <div className="text-[13px] leading-snug text-[#666]">{locked ? `Libera ao concluir ${m.unlockAfter} ${m.unlockAfter === 1 ? "lição" : "lições"}` : m.text}</div>
          <div className="mt-1 text-[12px] font-semibold text-[#1F2A63]">
            {done ? "Resgatada" : `${m.kind === "mensal" ? "até " : "+"}${pts} pts`}
            {mult > 1 && !done && <span className="ml-1 text-[#EC7000]">({fmtMult(mult)})</span>}
          </div>
        </div>
      </div>
      {!locked && !done && action && (
        <Squish onClick={action.run} className="mt-3 w-full rounded-[12px] border border-itau-orange py-[9px] text-center text-[14px] font-semibold text-itau-orange" scale={0.97}>
          {action.label}
        </Squish>
      )}
    </motion.div>
  );
}

function WeekClock({ daysLeft }: { daysLeft: number }) {
  const hours = 24 - new Date().getHours();
  const frac = Math.min(Math.max((daysLeft * 24 + hours) / (7 * 24), 0), 1);
  const a = frac * 2 * Math.PI;
  const x = 10 + 8 * Math.sin(a);
  const y = 10 - 8 * Math.cos(a);
  const d = frac >= 1 ? "M10 2a8 8 0 1 1 0 16a8 8 0 1 1 0-16z" : `M10 10 L10 2 A8 8 0 ${frac > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-[3px] text-[12px] font-semibold text-[#6C6257]">
      <svg width={14} height={14} viewBox="0 0 20 20">
        <circle cx={10} cy={10} r={9} fill="none" stroke="#D9CBBB" strokeWidth={2} />
        <path d={d} fill="#EC7000" />
      </svg>
      renova em {daysLeft}d {hours}h
    </span>
  );
}

const MARKS = [5000, 50000, 100000];

function Thermometer({ cents }: { cents: number }) {
  const max = MARKS[MARKS.length - 1];
  const pct = Math.min(cents / max, 1) * 100;
  return (
    <div className="pt-1">
      <div className="relative flex items-center">
        <span className={`z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${cents >= MARKS[0] ? "bg-[#00857A]" : "bg-[#D9D2C9]"}`}>
          <PiggyBank size={15} color="white" />
        </span>
        <div className="relative -ml-2 h-[12px] flex-1 overflow-hidden rounded-r-full bg-[#EFE7DE]">
          <motion.div className="h-full rounded-r-full bg-gradient-to-r from-[#00857A] to-[#2BC4A8]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
        </div>
      </div>
      <div className="relative ml-5 mt-1 h-[30px]">
        {MARKS.map((c) => {
          const left = (c / max) * 100;
          const hit = cents >= c;
          return (
            <div key={c} className="absolute top-0 flex -translate-x-1/2 flex-col items-center" style={{ left: `${Math.min(left, 96)}%` }}>
              <span className={`h-[6px] w-[2px] ${hit ? "bg-[#00857A]" : "bg-[#CFC3B5]"}`} />
              <span className={`whitespace-nowrap text-[11px] font-semibold ${hit ? "text-[#00857A]" : "text-[#9A8C7D]"}`}>
                {brl(c, false)} · {monthlyPoints(c)}
                <Star size={9} className="ml-[1px] inline" fill="currentColor" />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Missoes() {
  const navigate = useNavigate();
  const t = useTrilha();
  const toast = useToast();
  const [demo, setDemo] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [flyers, setFlyers] = useState<{ id: number; x: number; y: number; tx: number; ty: number; d: number }[]>([]);
  const layer = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLSpanElement>(null);

  const claim = (m: MissionView, el: HTMLElement) => {
    const root = layer.current?.getBoundingClientRect();
    const a = el.getBoundingClientRect();
    const b = target.current?.getBoundingClientRect();
    setClaiming(m.key);
    haptic([15, 30, 40]);
    if (root && b) {
      const base = Date.now();
      setFlyers(
        Array.from({ length: 8 }, (_, i) => ({
          id: base + i,
          x: a.left - root.left + a.width / 2 + (Math.random() - 0.5) * 60,
          y: a.top - root.top + a.height / 2,
          tx: b.left - root.left + b.width / 2,
          ty: b.top - root.top + b.height / 2,
          d: i * 0.05,
        })),
      );
    }
    window.setTimeout(() => {
      const gained = t.claim(m);
      setClaiming(null);
      toast(gained > 0 ? `+${gained} Pontos Itaú (simulado)` : `Teto de ${QUARTER_CAP_PTS} pts do trimestre atingido (simulado)`);
    }, 750);
    window.setTimeout(() => setFlyers([]), 1300);
  };
  const card = (m: MissionView) => (
    <AnimatePresence mode="wait" initial={false}>
      <MissionCard key={m.status === "concluída" ? "back" : "front"} m={m} mult={t.multiplier} action={actionFor(m)} onClaim={(el) => claim(m, el)} claiming={claiming === m.key} />
    </AnimatePresence>
  );

  const back = () => {
    const d = deltaToIa() ?? deltaToHome();
    if (d !== undefined) navigate(d);
    else navigate("/home", { replace: true, state: { tab: true } });
  };

  const actionFor = (m: MissionView) => {
    if (m.id === "w-licoes") return { label: "Ir pra trilha", run: () => navigate("/academia/trilha", { replace: true, state: { tab: true } }) };
    if (m.id === "w-aprofundar") return { label: "Ir pra trilha", run: () => navigate("/academia/trilha", { replace: true, state: { tab: true } }) };
    if (m.id === "m-mes") return { label: "Abrir cofrinho", run: () => navigate("/cofrinhos", { state: { fromAcademia: true } }) };
    return undefined;
  };

  const month = t.missions.find((m) => m.id === "m-mes");
  const weekly = t.missions.filter((m) => m.kind === "semanal");

  return (
    <Screen
      bg="bg-[#FBF6F0]"
      header={
        <div className="flex h-[56px] shrink-0 items-center gap-1 border-b border-[#E6E6E6] bg-white px-3">
          <Squish aria-label="Voltar" onClick={back} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <ChevronLeft size={28} strokeWidth={1.6} />
          </Squish>
          <div className="flex-1 text-[18px] font-bold text-[#1F2A63]">Missões</div>
          <span ref={target} className="flex items-center gap-1 rounded-full bg-[#FFF1E5] px-3 py-[5px] text-[14px] font-bold text-[#B54700]">
            <Star size={14} fill="#EC7000" color="#EC7000" />
            <Odometer value={t.points} />
          </span>
          <Squish aria-label="Controles do protótipo" onClick={() => setDemo(true)} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <Settings2 size={21} color="#555" />
          </Squish>
        </div>
      }
      footer={<AcademiaTabs />}
      overlay={
        <div ref={layer} className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
          {flyers.map((f) => (
            <motion.span
              key={f.id}
              className="absolute left-0 top-0"
              initial={{ x: f.x, y: f.y, scale: 0.6, opacity: 0 }}
              animate={{ x: [f.x, (f.x + f.tx) / 2 + 40, f.tx], y: [f.y, Math.min(f.y, f.ty) - 60, f.ty], scale: [0.6, 1.2, 0.5], opacity: [0, 1, 1] }}
              transition={{ duration: 0.75, delay: f.d, ease: "easeInOut" }}
            >
              <Star size={18} fill="#EC7000" color="#FFFFFF" strokeWidth={1.5} />
            </motion.span>
          ))}
        </div>
      }
    >
      <div className="px-4 pb-10 pt-4">
        <div className="flex items-center justify-between text-[13px] text-[#666]">
          <span>
            Hoje {fmtDay(t.day)} · Semana {t.week}
          </span>
          <WeekClock daysLeft={t.week * 7 - t.day} />
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-[16px] bg-white p-3">
          <StreakChip tone="light" />
          <span className="flex-1 text-[13px] leading-snug text-[#555]">
            {t.weekActive ? `Semana garantida. Pontos valendo ${fmtMult(t.multiplier)}.` : `Faça uma compra no débito ou crédito até ${fmtDay(t.week * 7)} pra ${t.streak ? "manter" : "começar"} a sequência.`}
          </span>
        </div>
        <ExpiryNote className="mt-2" always />

        {month && (
          <section className="mt-4">
            <h2 className="mb-2 text-[16px] font-bold text-black">Missão do mês</h2>
            {card(month)}
            {month.status !== "bloqueada" && (
              <div className="mt-2 rounded-[14px] bg-white p-3 text-[13px] text-[#555]">
                <div className="flex items-baseline justify-between">
                  <span>Menor saldo do mês no cofrinho</span>
                  <b className="text-[15px] text-[#222]">{brl(t.goal ? t.monthMinCents : 0)}</b>
                </div>
                <Thermometer cents={t.goal ? t.monthMinCents : 0} />
                <div className="flex justify-between border-t border-[#EEE] pt-2">
                  <span>Fechamento em {fmtDay(t.month * MONTH_DAYS)}</span>
                  <b className="text-[#00857A]">+{t.monthPtsPreview} de {MONTHLY_PTS.cap} pts</b>
                </div>
                {t.awards.length > 0 && (
                  <div className="mt-2 border-t border-[#EEE] pt-2">
                    {t.awards.slice(-3).map((w) => (
                      <div key={w.month} className="flex justify-between text-[12px]">
                        <span>{fmtMonth(w.month)} · {brl(w.heldCents)} guardados</span>
                        <span className="font-semibold text-[#00857A]">+{w.pts} pts</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        <section className="mt-6">
          <h2 className="mb-2 text-[16px] font-bold text-black">Missões da semana</h2>
          <div className="flex flex-col gap-2">
            {weekly.map((m) => (
              <div key={m.id}>{card(m)}</div>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-[#777]">Bônus, não obrigação. Missão perdida não tira pontos. Até 60 Pontos Itaú por semana.</p>
        </section>

        <section className="mt-6">
          <h2 className="mb-2 text-[16px] font-bold text-black">Desafios de fim de unidade</h2>
          <div className="flex flex-col gap-2">
            {[...new Set([...t.trailUnits.map((u) => u.id), ...UNITS.filter((u) => t.unitDone(u.id)).map((u) => u.id)])].map((id) => {
              const u = unitDef(id)!;
              const total = unitQuiz(u.id).length;
              const best = t.unitBest[u.id];
              const ready = t.unitDone(u.id);
              return (
                <Squish
                  key={u.id}
                  onClick={() => (ready ? navigate(`/academia/desafio/${u.id}`) : navigate("/academia/trilha", { replace: true, state: { tab: true } }))}
                  className={`flex w-full items-center gap-3 rounded-[16px] p-4 text-left bg-white`}
                  scale={0.98}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${t.unitPassed(u.id) ? "bg-[#00857A]" : ready ? "bg-[#FFF1E5]" : "bg-[#E6E6E6]"}`}>
                    {t.unitPassed(u.id) ? <Check size={18} color="white" /> : ready ? <Trophy size={16} color="#FF6200" /> : <Lock size={16} color="#888" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={`text-[15px] font-semibold ${ready ? "text-[#222]" : "text-[#888]"}`}>{u.name}</div>
                    <div className="text-[13px] text-[#666]">
                      {ready ? (best !== undefined ? `Seu melhor: ${best}/${total} · ${unitQuizPoints(u.id, best)} pts` : "Liberado · opcional") : "Conclua todas as lições da unidade"}
                    </div>
                  </div>
                  {<span className="text-[12px] font-semibold text-[#1F2A63]">até {total * UNIT_POINTS_PER_RIGHT} pts</span>}
                </Squish>
              );
            })}
          </div>
        </section>

        <div className="mt-6 rounded-[16px] bg-white p-4 text-[13px] leading-snug text-[#555]">
          <div className="mb-1 flex items-center gap-2 text-[14px] font-semibold text-[#222]">
            <PiggyBank size={16} color="#FF6200" /> Quanto vale o que você ganhou
          </div>
          {t.points} Pontos Itaú ≈ <b>{brl(Math.round(t.points * POINT_BRL * 100))}</b> em desconto na fatura (referência pública: 1.000 pts = R$ 20; varia por modalidade). Na AcademIA.I, o teto é {QUARTER_CAP_PTS} pts a cada 3 meses por pessoa (~{brl(Math.round(QUARTER_CAP_PTS * POINT_BRL * 100))}), já com o multiplicador. Pontos de missões e da AcademIA.I vencem em 6 meses, sempre no dia 25.
        </div>

        <Squish onClick={() => navigate("/pra-voce", { replace: true, state: { tab: true } })} className="mt-6 flex w-full items-center gap-3 rounded-[16px] bg-itau-navy p-4 text-white" scale={0.98}>
          <Gift size={20} color="#FF8A3D" />
          <span className="flex-1 text-[15px] font-semibold">Usar Pontos Itaú no Itaú Shop</span>
        </Squish>
      </div>

      <BottomSheet open={demo} onClose={() => setDemo(false)} title="Controles do protótipo">
        <div className="flex flex-col gap-2">
          {[
            { l: "Avançar 1 semana", run: () => t.advanceWeek() },
            { l: "Avançar 1 mês", run: () => t.advanceMonth() },
            { l: "Resetar AcademIA.I", run: () => t.reset() },
          ].map((b) => (
            <Squish
              key={b.l}
              onClick={() => {
                b.run();
                toast(b.l);
                setDemo(false);
              }}
              className="w-full rounded-[12px] bg-[#F4F4F4] px-4 py-3 text-[15px] font-semibold text-[#222]"
              scale={0.97}
            >
              {b.l}
            </Squish>
          ))}
        </div>
      </BottomSheet>
    </Screen>
  );
}
