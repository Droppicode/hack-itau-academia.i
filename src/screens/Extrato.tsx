import { ArrowDownLeft, ArrowUpRight, PiggyBank, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { BottomTabBar } from "../components/BottomTabBar";
import { Screen } from "../components/Screen";
import { brl } from "../data/money";
import { fmtDay, fmtMonth, MONTH_DAYS } from "../data/trilha";
import { markHome } from "../state/homeHistory";
import { usePix } from "../state/PixContext";
import { useTrilha, type Txn } from "../state/TrilhaContext";
import { OrangeHeader } from "./Home";

const ICON = { salario: ArrowDownLeft, resgate: ArrowDownLeft, cofrinho: PiggyBank, pix: ArrowUpRight, compra: ShoppingCart };

export function TxnRow({ x, hidden = false }: { x: Txn; hidden?: boolean }) {
  const I = ICON[x.kind];
  const inflow = x.cents > 0;
  return (
    <div className="flex items-center gap-3 border-b border-[#EEE] py-[12px] last:border-0">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${inflow ? "bg-[#E3F4EA]" : "bg-[#F0F1F3]"}`}>
        <I size={18} color={inflow ? "#00857A" : "#444"} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] text-[#222]">{x.title}</div>
        <div className="truncate text-[13px] text-[#777]">
          {fmtDay(x.day)} · {x.sub}
        </div>
      </div>
      <span className={`text-[15px] font-semibold tabular-nums ${inflow ? "text-[#00857A]" : "text-[#333]"}`}>
        {hidden ? "R$ ••••" : `${inflow ? "+" : "-"} ${brl(Math.abs(x.cents))}`}
      </span>
    </div>
  );
}

export function Extrato() {
  useEffect(markHome, []);
  const t = useTrilha();
  const { balanceHidden } = usePix();
  const months = [...new Set(t.txns.map((x) => Math.floor((x.day - 1) / MONTH_DAYS) + 1))].sort((a, b) => b - a);
  return (
    <Screen bg="bg-itau-bg" statusTone="light" statusBg="bg-itau-orange" header={<OrangeHeader />} footer={<BottomTabBar />}>
      <div className="px-5 pb-8 pt-[34px]">
        <h1 className="text-[18px] font-bold text-black">Extrato</h1>
        <div className="mt-4 rounded-[18px] bg-white p-5">
          <div className="text-[14px] text-[#555]">Saldo em conta · hoje {fmtDay(t.day)}</div>
          <div className="text-[24px] font-bold text-[#222]">{balanceHidden ? "R$ ••••" : brl(t.balanceCents)}</div>
          {t.goal && <div className="mt-1 text-[13px] text-[#666]">+ {balanceHidden ? "R$ ••••" : brl(t.goal.savedCents)} no cofrinho {t.goal.name}</div>}
        </div>
        {months.map((m) => {
          const list = t.txns.filter((x) => Math.floor((x.day - 1) / MONTH_DAYS) + 1 === m).reverse();
          return (
            <section key={m} className="mt-5">
              <h2 className="mb-2 text-[14px] font-semibold text-[#555]">{fmtMonth(m)}</h2>
              <div className="rounded-[18px] bg-white px-4">
                {list.map((x) => (
                  <TxnRow key={x.id} x={x} hidden={balanceHidden} />
                ))}
              </div>
            </section>
          );
        })}
        <p className="mt-4 text-[12px] text-[#888]">Protótipo: lançamentos fictícios do Lucas, gerados pelas suas ações no app.</p>
      </div>
    </Screen>
  );
}
