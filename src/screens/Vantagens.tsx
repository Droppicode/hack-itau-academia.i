import { ArrowLeftRight, BadgePercent, ChevronRight, CircleHelp, CreditCard, Gift, HandHeart, Plane, ShoppingBag, Smartphone, Sparkles, Store, Tag, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/BottomSheet";
import { BottomTabBar } from "../components/BottomTabBar";
import { IaiAvatar, Wordmark, useAcademiaEntry } from "../components/Iai";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { brl } from "../data/money";
import { ExpiryNote, StreakChip } from "../components/Streak";
import { motion } from "framer-motion";
import { Odometer } from "../components/fx";
import { fmtDay, fmtMult, POINT_BRL, UNIT_POINTS_PER_RIGHT } from "../data/trilha";
import { markHome } from "../state/homeHistory";
import { useTrilha } from "../state/TrilhaContext";
import { OrangeHeader } from "./Home";
import { Hex } from "./MinhasVantagens";

function Tile({ Icon, label, onClick }: { Icon: typeof Gift; label: string; onClick?: () => void }) {
  return (
    <Squish onClick={onClick} off={!onClick} className="flex h-[84px] flex-col justify-between rounded-[14px] bg-white p-3 text-left" scale={0.95}>
      <Icon size={20} color="#EC7000" />
      <span className="text-[13px] leading-tight text-[#333]">{label}</span>
    </Squish>
  );
}

export function Vantagens() {
  useEffect(markHome, []);
  const navigate = useNavigate();
  const t = useTrilha();
  const enter = useAcademiaEntry();
  const [extrato, setExtrato] = useState(false);
  const [how, setHow] = useState(false);
  const quizMax = 10 * UNIT_POINTS_PER_RIGHT;

  const history = [...t.pointsLog].reverse();

  return (
    <Screen bg="bg-itau-bg" statusTone="light" statusBg="bg-itau-orange" header={<OrangeHeader />} footer={<BottomTabBar />}>
      <div className="px-5 pb-8 pt-[24px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-bold text-black">Pontos e Benefícios Itaú</h1>
          <Squish aria-label="Ajuda" onClick={() => setHow(true)} scale={0.9}>
            <CircleHelp size={22} color="#444" />
          </Squish>
        </div>
        <p className="mt-1 text-[14px] text-[#555]">Tudo em um só lugar: encontre aqui todos os benefícios disponíveis pra você aproveitar.</p>

        <h2 className="mt-6 text-[16px] font-bold text-black">Para você acompanhar</h2>
        <div className="mt-3 rounded-[16px] bg-white p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[16px] font-semibold text-[#222]">Pontos Itaú</span>
            <span className="text-[20px] font-bold text-[#222]">
              <Odometer value={t.points} /> pts
            </span>
          </div>
          <div className="mt-1 flex justify-between text-[13px] text-[#666]">
            <span>Valem na fatura</span>
            <span>{brl(Math.round(t.points * POINT_BRL * 100))}</span>
          </div>
          <div className="mt-3">
            <div className="h-[8px] overflow-hidden rounded-full bg-[#F1ECE5]">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#EC7000] to-[#FFB23D]" initial={{ width: 0 }} animate={{ width: `${((t.points % 1000) / 1000) * 100}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
            </div>
            <div className="mt-1 flex justify-between text-[12px] text-[#777]">
              <span>{(t.points % 1000).toLocaleString("pt-BR")} / 1.000 pts</span>
              <span className="font-semibold text-[#B54700]">faltam {(1000 - (t.points % 1000)).toLocaleString("pt-BR")} pra +R$ 20</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <StreakChip tone="light" />
            <span className="text-[12px] text-[#666]">multiplica pontos da AcademIA.I</span>
          </div>
          <ExpiryNote className="mt-2" always />
          <Squish onClick={() => setExtrato(true)} className="mt-3 flex w-full items-center justify-between border-t border-[#EEE] pt-3 text-[14px] font-semibold text-itau-orange" scale={0.98}>
            Acessar extrato <ChevronRight size={16} />
          </Squish>
        </div>

        <Squish onClick={() => navigate("/minhas-vantagens")} className="mt-3 flex w-full items-center gap-3 rounded-[16px] bg-white p-4 text-left" scale={0.98}>
          <Hex n={t.mvLevel} size={40} />
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-[#222]">Minhas Vantagens · nível {t.mvLevel}</div>
            <div className="text-[13px] text-[#666]">{t.passosDone} passos · {t.mvNextAt ? `faltam ${t.mvNextAt - t.passosDone} pro nível ${t.mvLevel + 1}` : "nível máximo"}</div>
          </div>
          <ChevronRight size={18} color="#888" />
        </Squish>

        <h2 className="mt-6 text-[16px] font-bold text-black">Usar pontos Itaú</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Tile Icon={CreditCard} label="Desconto na fatura" />
          <Tile Icon={Plane} label="Passagens aéreas" />
          <Tile Icon={Store} label="Stix nas lojas" />
          <Tile Icon={ShoppingBag} label="Itaú Shop" onClick={() => navigate("/itau-shop")} />
          <Tile Icon={ArrowLeftRight} label="Transferir para aéreas" />
          <Tile Icon={Smartphone} label="iPhone pra sempre" />
          <Tile Icon={HandHeart} label="Doações" />
        </div>

        <h2 className="mt-6 text-[16px] font-bold text-black">Ganhar pontos Itaú</h2>
        <Squish onClick={enter} className="mt-3 flex w-full items-center gap-3 rounded-[16px] bg-gradient-to-br from-[#1F2A63] to-[#003087] p-4 text-left text-white" scale={0.98}>
          <IaiAvatar size={36} />
          <div className="flex-1">
            <Wordmark className="text-[16px]" />
            <div className="text-[13px] text-white/80">Missões da semana (30 pts cada) e desafio de fim de unidade (até {quizMax} pts)</div>
          </div>
          <ChevronRight size={18} color="#FF8A3D" />
        </Squish>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <Tile Icon={BadgePercent} label="Cashback em lojas" onClick={() => navigate("/itau-shop")} />
          <Tile Icon={ShoppingBag} label="Itaú Shop" onClick={() => navigate("/itau-shop")} />
          <Tile Icon={Zap} label="Acelerador de pontos" />
        </div>
        <Squish onClick={() => setHow(true)} className="mt-3 text-[14px] font-semibold text-itau-orange" scale={0.97}>
          Saiba como ganhar
        </Squish>

        <h2 className="mt-6 text-[16px] font-bold text-black">Ofertas especiais</h2>
        <div className="no-scrollbar -mx-5 mt-3 flex gap-3 overflow-x-auto px-5">
          {[
            { t: "Fone bluetooth com cashback em pontos", c: "from-[#1F2A63] to-[#3A4FB8]" },
            { t: "Mochila pra notebook com frete grátis", c: "from-[#7A2E0E] to-[#EC7000]" },
            { t: "Ingressos de shows: pague com pontos", c: "from-[#6B3FA0] to-[#C2459B]" },
          ].map((o) => (
            <Squish key={o.t} onClick={() => navigate("/itau-shop")} className={`flex h-[120px] w-[220px] shrink-0 flex-col justify-between rounded-[16px] bg-gradient-to-br ${o.c} p-4 text-left text-white`} scale={0.97}>
              <Tag size={18} />
              <span className="text-[15px] font-semibold leading-snug">{o.t}</span>
            </Squish>
          ))}
        </div>

        <p className="mt-6 text-[12px] leading-snug text-[#888]">
          Protótipo. Pontos, níveis e ofertas simulados. Referência pública do Itaú: 1.000 pontos = R$ 20 de desconto na fatura; valores variam por modalidade e cartão. Pontos não são dinheiro sacável.
        </p>
      </div>

      <BottomSheet open={extrato} onClose={() => setExtrato(false)} title="Extrato de Pontos Itaú">
        {history.length === 0 ? (
          <p className="text-[14px] text-[#666]">Nenhum ponto ainda. Faça as missões da semana ou o desafio de fim de unidade na AcademIA.I.</p>
        ) : (
          <div className="flex max-h-[50vh] flex-col divide-y divide-[#EEE] overflow-y-auto">
            {history.map((h) => (
              <div key={h.id} className={`flex justify-between gap-3 py-3 text-[14px] ${h.expiresDay <= t.day ? "opacity-50" : ""}`}>
                <div>
                  <div className="text-[#333]">{h.label}</div>
                  <div className="text-[12px] text-[#888]">
                    {fmtDay(h.day)}
                    {h.mult > 1 ? ` · ${h.base} × ${fmtMult(h.mult)}` : ""} · {h.expiresDay <= t.day ? `venceu em ${fmtDay(h.expiresDay)}` : `vence em ${fmtDay(h.expiresDay)}`}
                  </div>
                </div>
                <span className={`shrink-0 font-semibold ${h.expiresDay <= t.day ? "text-[#888] line-through" : "text-[#00857A]"}`}>+{h.pts} pts</span>
              </div>
            ))}
          </div>
        )}
      </BottomSheet>

      <BottomSheet open={how} onClose={() => setHow(false)} title="Como a AcademIA.I dá pontos">
        <div className="flex flex-col gap-3 text-[14px] leading-snug text-[#444]">
          <div className="flex gap-3"><Sparkles size={18} color="#EC7000" className="shrink-0" /> Missões da semana: 30 Pontos Itaú cada, até 60 por semana.</div>
          <div className="flex gap-3"><Gift size={18} color="#EC7000" className="shrink-0" /> Desafio de fim de unidade (opcional): 70%+ de acertos = 20 pts por acerto. Vale só o melhor resultado.</div>
          <div className="flex gap-3"><Sparkles size={18} color="#EC7000" className="shrink-0" /> Sequência: cada semana com compra no débito ou no crédito soma +0,05x nos pontos da AcademIA.I, até 1,2x em 4 semanas. Semana sem compra volta pra 1x.</div>
          <div className="flex gap-3"><Gift size={18} color="#8A4B00" className="shrink-0" /> Pontos de missões e da AcademIA.I valem 6 meses e vencem sempre no dia 25 do mês.</div>
          <div className="flex gap-3"><Sparkles size={18} color="#00857A" className="shrink-0" /> Missão do mês: 1 pt a cada R$ 20 que ficam no cofrinho o mês inteiro (a partir de R$ 50, até 50 pts). Vale o menor saldo do mês, então depositar e tirar não rende pontos. O cofrinho rende 100% do CDI.</div>
          <div className="rounded-[12px] bg-[#F4F4F4] p-3 text-[13px]">
            Teto por pessoa: ~290 pts/mês nas missões (240 semanais + 50 do mês) ≈ R$ 5,80 de desconto na fatura. Desafio: até 200 pts por unidade, uma vez. Custo baixo e previsível pro banco. Níveis do Minhas Vantagens sobem por passos (uso de produtos); as atividades da AcademIA.I aparecem como passos só no protótipo.
          </div>
        </div>
      </BottomSheet>
    </Screen>
  );
}
