import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, CalendarClock, ChevronLeft, CircleHelp, Info, Lock, PiggyBank, Plus, ShieldCheck, Sparkles, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/BottomSheet";
import { GOAL_ICON, goalDef } from "../components/Iai";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { useToast } from "../components/Toast";
import { brl, monthsTo } from "../data/money";
import { useTrilha } from "../state/TrilhaContext";

const AMOUNTS = [1000, 2000, 5000, 10000];

export function Cofrinho() {
  const navigate = useNavigate();
  const toast = useToast();
  const t = useTrilha();
  const location = useLocation();
  const fromAcademia = (location.state as { fromAcademia?: boolean } | null)?.fromAcademia === true;
  const [sheet, setSheet] = useState<"guardar" | "resgatar" | null>(null);
  const [amount, setAmount] = useState(2000);
  const g = t.goal;
  const def = goalDef(g?.id);
  const Icon = GOAL_ICON[def.id] ?? Target;
  const warn = fromAcademia && !t.cofrinhoWarned && !!g;
  const pct = t.goalPct;
  const rateLabel = t.cdi105 ? "105% do CDI" : "100% do CDI";
  const left = g ? Math.max(g.targetCents - g.savedCents, 0) : 0;
  const months = g ? monthsTo(left, g.monthlyCents) : 0;

  const confirm = () => {
    if (!sheet) return;
    if (sheet === "guardar") {
      t.save(amount);
      toast(`${brl(amount)} guardados no cofrinho (simulado)`);
    } else {
      t.withdraw(amount);
      toast(`${brl(Math.min(amount, g?.savedCents ?? 0))} de volta na conta (simulado)`);
    }
    setSheet(null);
  };

  return (
    <Screen
      bg="bg-itau-bg"
      header={
        <div className="flex h-[56px] shrink-0 items-center gap-1 bg-white px-3">
          <Squish aria-label="Voltar" onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
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
                <span className={`rounded-full px-2 py-[3px] text-[12px] font-semibold ${t.cdi105 ? "bg-white text-[#00857A]" : "bg-white/20"}`}>{rateLabel}</span>
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
              <Squish onClick={() => setSheet("guardar")} className="flex items-center justify-center gap-2 rounded-[12px] bg-itau-orange py-3 text-[15px] font-semibold text-white" scale={0.96}>
                <ArrowDownToLine size={18} /> Guardar
              </Squish>
              <Squish onClick={() => setSheet("resgatar")} className="flex items-center justify-center gap-2 rounded-[12px] border border-itau-orange py-3 text-[15px] font-semibold text-itau-orange" scale={0.96}>
                <ArrowUpFromLine size={18} /> Resgatar
              </Squish>
            </div>
            <div className="border-t border-[#EEE] px-4 py-3 text-[14px] text-[#555]">
              <div className="flex items-center gap-2">
                <CalendarClock size={16} color="#FF6200" /> Guardando {brl(g.monthlyCents, false)}/mês, faltam ~{months} {months === 1 ? "mês" : "meses"}
              </div>
              <Squish onClick={() => navigate("/academia/intro")} className="mt-2 text-[14px] font-semibold text-itau-orange" scale={0.97}>
                Editar objetivo
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

        <Squish onClick={() => toast("Protótipo: só o cofrinho do objetivo está ativo")} className="mt-3 flex w-full items-center gap-3 rounded-[18px] bg-white p-4 text-left" scale={0.98}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0F1F3]">
            <PiggyBank size={22} color="#444" />
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-[#222]">Criar outro cofrinho</div>
            <div className="text-[13px] text-[#666]">Reserva, presente, viagem…</div>
          </div>
        </Squish>

        <div className={`mt-6 rounded-[18px] p-4 ${t.cdi105 ? "bg-[#00857A] text-white" : "bg-white"}`}>
          <div className="flex items-center gap-2 text-[15px] font-semibold">
            <Sparkles size={17} color={t.cdi105 ? "white" : "#FF6200"} /> {t.cdi105 ? "105% do CDI ativo este mês" : "Quer render 105% do CDI?"}
          </div>
          <p className={`mt-1 text-[13px] leading-snug ${t.cdi105 ? "text-white/90" : "text-[#555]"}`}>
            {t.cdi105 ? "Prêmio da missão do mês da academIA.I." : "Cumpra a missão do mês da academIA.I (guardar R$ 20 + contas em dia) e o cofrinho do objetivo rende 105% do CDI no mês seguinte."} Condição simulada, a confirmar com o produto.
          </p>
          {!t.cdi105 && (
            <Squish onClick={() => navigate("/academia/missoes", { state: { tab: true } })} className="mt-2 text-[14px] font-semibold text-itau-orange" scale={0.97}>
              Ver missão do mês
            </Squish>
          )}
        </div>

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

        <Squish onClick={() => (t.advanceMonth(), toast("+1 mês: aporte do mês e rendimento aplicados (simulado)"))} className="mt-4 w-full rounded-[14px] border border-dashed border-[#BBB] py-3 text-center text-[14px] font-semibold text-[#555]" scale={0.97}>
          Simular +1 mês
        </Squish>
      </div>

      <BottomSheet open={!!sheet} onClose={() => setSheet(null)} title={sheet === "guardar" ? "Quanto quer guardar?" : "Quanto quer resgatar?"}>
        <div className="grid grid-cols-4 gap-2">
          {AMOUNTS.map((a) => (
            <Squish key={a} onClick={() => setAmount(a)} className={`rounded-[12px] py-3 text-center text-[15px] font-semibold ${amount === a ? "bg-itau-orange text-white" : "bg-[#F4F4F4] text-[#222]"}`} scale={0.94}>
              {brl(a, false)}
            </Squish>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-[#666]">
          {sheet === "guardar" ? "O valor sai da sua conta Itaú. Se seu salário cai em outro banco, dá pra mandar um Pix pra cá antes." : "O valor volta na hora pra sua conta corrente."} (simulado)
        </p>
        <Squish onClick={confirm} className="mt-4 w-full rounded-[12px] bg-itau-orange py-[14px] text-center text-[16px] font-bold text-white" scale={0.97}>
          {sheet === "guardar" ? `Guardar ${brl(amount)}` : `Resgatar ${brl(amount)}`}
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
    </Screen>
  );
}
