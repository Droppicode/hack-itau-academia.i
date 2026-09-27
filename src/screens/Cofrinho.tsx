import { AnimatePresence, motion } from "framer-motion";
import { goBack } from "../state/goBack";
import { ArrowDownToLine, ArrowUpFromLine, CalendarClock, ChevronLeft, CircleHelp, Info, Lock, PiggyBank, Plus, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/BottomSheet";
import { GoalSheet } from "../components/GoalSheet";
import { GOAL_ICON, goalDef } from "../components/Iai";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { useToast } from "../components/Toast";
import { brl, monthsTo, parseCents } from "../data/money";
import { MONTHLY_PTS } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";


export function Cofrinho() {
  const navigate = useNavigate();
  const toast = useToast();
  const t = useTrilha();
  const location = useLocation();
  const fromAcademia = (location.state as { fromAcademia?: boolean } | null)?.fromAcademia === true;
  const [sheet, setSheet] = useState<"guardar" | "resgatar" | null>(null);
  const g = t.goal;
  const [raw, setRaw] = useState("");
  const [goalOpen, setGoalOpen] = useState(false);
  const amount = parseCents(raw);
  const limit = sheet === "resgatar" ? (g?.savedCents ?? 0) : t.balanceCents;
  const error = !raw.trim()
    ? undefined
    : !(amount > 0)
      ? "Digite um valor maior que zero."
      : amount > limit
        ? sheet === "resgatar"
          ? `Você tem ${brl(limit)} no cofrinho. Digite até esse valor ou use "Resgatar tudo".`
          : `Seu saldo em conta é ${brl(limit)}. Digite até esse valor.`
        : undefined;
  const valid = !!raw.trim() && !error;
  const def = goalDef(g?.id);
  const Icon = GOAL_ICON[def.id] ?? Target;
  const warn = fromAcademia && !t.cofrinhoWarned && !!g;
  const pct = t.goalPct;
  const left = g ? Math.max(g.targetCents - g.savedCents, 0) : 0;
  const months = g ? monthsTo(left, g.monthlyCents) : 0;

  const open = (k: "guardar" | "resgatar") => {
    setRaw("");
    setSheet(k);
  };
  const confirm = () => {
    if (!sheet || !valid) return;
    if (sheet === "guardar") {
      t.save(amount);
      toast(`${brl(amount)} guardados no cofrinho (simulado)`);
    } else {
      t.withdraw(amount);
      toast(`${brl(amount)} de volta na conta (simulado)`);
    }
    setSheet(null);
  };

  return (
    <Screen
      bg="bg-itau-bg"
      header={
        <div className="flex h-[56px] shrink-0 items-center gap-1 bg-white px-3">
          <Squish aria-label="Voltar" onClick={() => goBack(navigate)} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <ChevronLeft size={28} strokeWidth={1.6} />
          </Squish>
          <div className="flex-1 text-[17px] font-semibold text-[#222]">Cofrinhos</div>
          <Squish aria-label="Ajuda" onClick={() => toast("Cofrinhos: guarde a partir de R$ 1 e resgate quando quiser")} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <CircleHelp size={22} color="#444" />
          </Squish>
        </div>
      }
    >
      <div className="px-5 pb-10 pt-5">
        <div className="rounded-[18px] bg-white p-5">
          <div className="text-[14px] text-[#555]">Total guardado nos cofrinhos</div>
          <div className="mt-1 text-[28px] font-bold text-[#222]">{brl(g?.savedCents ?? 0)}</div>
          <div className="mt-1 flex items-center gap-1 text-[14px] text-[#00857A]">
            <TrendingUp size={15} /> rendeu {brl(g?.yieldCents ?? 0)} até agora (simulado)
          </div>
        </div>

        <h2 className="mt-6 text-[17px] font-bold text-black">Meus objetivos</h2>
        {g ? (
          <div className="mt-3 overflow-hidden rounded-[18px] bg-white">
            <div className="relative px-5 pb-5 pt-4 text-white" style={{ background: `linear-gradient(135deg, ${def.from}, ${def.to})` }}>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/20">
                  <Icon size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[18px] font-bold">{g.name}</div>
                  <div className="text-[13px] text-white/80">Objetivo da academIA.I</div>
                </div>
                <span className="rounded-full bg-white/20 px-2 py-[3px] text-[12px] font-semibold">100% do CDI</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="text-[13px] text-white/80">Guardado</div>
                  <div className="text-[24px] font-bold">{brl(g.savedCents)}</div>
                </div>
                <div className="text-right text-[13px] text-white/85">
                  de {brl(g.targetCents, false)}
                  <div className="text-[20px] font-bold text-white">{Math.floor(pct)}%</div>
                </div>
              </div>
              <div className="mt-2 h-[8px] overflow-hidden rounded-full bg-white/25">
                <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.7 }} />
              </div>
              {pct >= 100 && <div className="mt-2 text-[14px] font-semibold">Objetivo alcançado!</div>}
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              <Squish onClick={() => open("guardar")} className="flex items-center justify-center gap-2 rounded-[12px] bg-itau-orange py-3 text-[15px] font-semibold text-white" scale={0.96}>
                <ArrowDownToLine size={18} /> Guardar
              </Squish>
              <Squish onClick={() => open("resgatar")} className="flex items-center justify-center gap-2 rounded-[12px] border border-itau-orange py-3 text-[15px] font-semibold text-itau-orange" scale={0.96}>
                <ArrowUpFromLine size={18} /> Resgatar
              </Squish>
            </div>
            <div className="border-t border-[#EEE] px-4 py-3 text-[14px] text-[#555]">
              <div className="flex items-center gap-2">
                <CalendarClock size={16} color="#FF6200" /> Guardando {brl(g.monthlyCents, false)}/mês, faltam ~{months} {months === 1 ? "mês" : "meses"}
              </div>
              <Squish onClick={() => setGoalOpen(true)} className="mt-2 text-[14px] font-semibold text-itau-orange" scale={0.97}>
                Trocar objetivo
              </Squish>
            </div>
          </div>
        ) : (
          <Squish onClick={() => navigate("/academia/intro")} className="mt-3 flex w-full items-center gap-3 rounded-[18px] bg-white p-4 text-left" scale={0.98}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1E5]">
              <Plus size={22} color="#FF6200" />
            </span>
            <span className="flex-1 text-[15px] font-semibold text-[#222]">Criar objetivo com a academIA.I</span>
          </Squish>
        )}

        <Squish off className="mt-3 flex w-full items-center gap-3 rounded-[18px] bg-white p-4 text-left" scale={0.98}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0F1F3]">
            <PiggyBank size={22} color="#444" />
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-[#222]">Criar outro cofrinho</div>
            <div className="text-[13px] text-[#666]">Reserva, presente, viagem…</div>
          </div>
        </Squish>

        {g && (
          <div className="mt-6 rounded-[18px] bg-white p-4">
            <div className="flex items-center gap-2 text-[15px] font-semibold text-[#222]">
              <Sparkles size={17} color="#FF6200" /> Missão do mês: guardar e deixar lá
            </div>
            <p className="mt-1 text-[13px] leading-snug text-[#555]">
              1 Ponto Itaú a cada R$ 20 que ficam aqui o mês inteiro (a partir de R$ 50, até {MONTHLY_PTS.cap} pts). Vale o menor saldo do mês. Hoje: {brl(t.monthMinCents)} mantidos, <b className="text-[#00857A]">+{t.monthPtsPreview} pts</b> no fechamento.
            </p>
            <Squish onClick={() => navigate("/academia/missoes", { state: { tab: true } })} className="mt-2 text-[14px] font-semibold text-itau-orange" scale={0.97}>
              Ver missão do mês
            </Squish>
          </div>
        )}

        <div className="mt-6 rounded-[18px] bg-white p-4">
          <h3 className="text-[15px] font-semibold text-[#222]">Como funciona</h3>
          {[
            { I: PiggyBank, t: "Guarde a partir de R$ 1, quando quiser" },
            { I: TrendingUp, t: "Rende todo dia útil, com base no CDI" },
            { I: Lock, t: "O dinheiro continua seu e separado do dia a dia" },
            { I: ArrowUpFromLine, t: "Resgate a qualquer momento (liquidez diária)" },
          ].map(({ I, t: txt }) => (
            <div key={txt} className="mt-3 flex items-center gap-3 text-[14px] text-[#444]">
              <I size={18} color="#FF6200" /> {txt}
            </div>
          ))}
          <p className="mt-3 flex gap-2 text-[12px] text-[#888]">
            <Info size={14} className="mt-[1px] shrink-0" /> Protótipo: valores e rendimentos simulados, CDI de 10,5% a.a.
          </p>
        </div>

        <Squish onClick={() => (t.advanceMonth(), toast("+1 mês: salário na conta e rendimento aplicados (simulado)"))} className="mt-4 w-full rounded-[14px] border border-dashed border-[#BBB] py-3 text-center text-[14px] font-semibold text-[#555]" scale={0.97}>
          Simular +1 mês
        </Squish>
      </div>

      <BottomSheet open={!!sheet} onClose={() => setSheet(null)} title={sheet === "guardar" ? "Quanto quer guardar?" : "Quanto quer resgatar?"}>
        <label className={`flex items-center gap-2 rounded-[14px] border-2 px-4 py-3 ${error ? "border-[#D0342C]" : "border-[#EEE] focus-within:border-itau-orange"}`}>
          <span className="text-[22px] font-semibold text-[#888]">R$</span>
          <input
            aria-label={sheet === "guardar" ? "Valor para guardar" : "Valor para resgatar"}
            inputMode="decimal"
            autoFocus
            placeholder="0,00"
            value={raw}
            onChange={(e) => setRaw(e.target.value.replace(/[^\d,.]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && confirm()}
            className="w-full bg-transparent text-[26px] font-bold text-[#222] outline-none placeholder:text-[#CCC]"
          />
        </label>
        {error && <p role="alert" className="mt-2 text-[13px] font-semibold text-[#D0342C]">{error}</p>}
        <p className="mt-3 text-[13px] text-[#666]">
          {sheet === "guardar" ? `Sai da sua conta corrente. Saldo em conta: ${brl(t.balanceCents)}.` : "O valor volta na hora pra sua conta corrente."} (simulado)
        </p>
        {sheet === "resgatar" && (
          <Squish onClick={() => setRaw(((g?.savedCents ?? 0) / 100).toFixed(2).replace(".", ","))} className="mt-2 text-[14px] font-semibold text-itau-orange" scale={0.97}>
            Resgatar tudo ({brl(g?.savedCents ?? 0)})
          </Squish>
        )}
        <Squish onClick={confirm} disabled={!valid} className="mt-4 disabled:opacity-40 w-full rounded-[12px] bg-itau-orange py-[14px] text-center text-[16px] font-bold text-white" scale={0.97}>
          {sheet === "guardar" ? (valid ? `Guardar ${brl(amount)}` : "Guardar") : valid ? `Resgatar ${brl(amount)}` : "Resgatar"}
        </Squish>
      </BottomSheet>

      <AnimatePresence>
        {warn && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-end bg-black/45">
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }} transition={{ type: "spring", damping: 28, stiffness: 300 }} className="w-full rounded-t-[24px] bg-white px-6 pb-8 pt-6" role="dialog" aria-label="Seu dinheiro continua seu">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E3F4EA]">
                <ShieldCheck size={30} color="#00857A" />
              </div>
              <h2 className="mt-4 text-[22px] font-bold leading-tight text-[#222]">Guardar não é gastar: o dinheiro continua seu</h2>
              <ul className="mt-3 flex flex-col gap-2 text-[15px] leading-snug text-[#444]">
                <li>• Você não perde nada: o valor só muda de lugar e fica separado pro seu objetivo.</li>
                <li>• Enquanto está guardado, ele rende todo dia útil.</li>
                <li>• Precisou? Resgata na hora, quando quiser.</li>
              </ul>
              <Squish onClick={() => t.set({ cofrinhoWarned: true })} className="mt-6 w-full rounded-[12px] bg-itau-orange py-[14px] text-center text-[16px] font-bold text-white" scale={0.97}>
                Entendi
              </Squish>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <GoalSheet open={goalOpen} onClose={() => setGoalOpen(false)} />
    </Screen>
  );
}
