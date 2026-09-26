import { useEffect, useState } from "react";
import { BottomTabBar } from "../components/BottomTabBar";
import { Squish } from "../components/Squish";
import { Screen } from "../components/Screen";
import { brl, byCategory } from "../data/calc";
import { OTHER_WALLET, type Entry } from "../data/lucas";
import { markHome } from "../state/homeHistory";
import { usePix } from "../state/PixContext";
import { useTrilha } from "../state/TrilhaContext";
import { OrangeHeader } from "./Home";

const fmtDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

export function Extrato() {
  useEffect(markHome, []);
  const t = useTrilha();
  const { balanceHidden } = usePix();
  const [tab, setTab] = useState<"itau" | "tudo" | "cat">("itau");
  const list = t.entries
    .filter((e) => tab !== "itau" || e.source === "itau")
    .sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  const groups = list.reduce<Record<string, Entry[]>>((acc, e) => ((acc[e.date] ??= []).push(e), acc), {});
  const cats = byCategory(t.entries.filter((e) => e.date < "2026-09-25"));
  const hide = (s: string) => (balanceHidden ? "••••" : s);

  return (
    <Screen bg="bg-itau-bg" statusTone="light" statusBg="bg-itau-orange" header={<OrangeHeader />} footer={<BottomTabBar />}>
      <div className="px-5 pb-8 pt-[28px]">
        <h1 className="text-[18px] font-bold text-black">Extrato</h1>
        <div className="mt-2 text-[14px] text-[#555]">
          Saldo em conta <b>{hide(brl(t.balanceCents))}</b>
        </div>
        <div className="mt-4 flex rounded-[12px] bg-white p-1">
          {(
            [
              ["itau", "Conta Itaú"],
              ["tudo", "Tudo junto"],
              ["cat", "Categorias"],
            ] as const
          ).map(([k, l]) => (
            <Squish
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 rounded-[10px] py-2 text-center text-[14px] font-semibold ${tab === k ? "bg-itau-navy text-white" : "text-[#555]"}`}
              scale={0.96}
            >
              {l}
            </Squish>
          ))}
        </div>
        {tab === "tudo" && (
          <div className="mt-3 rounded-[12px] bg-[#FFF1E5] px-3 py-2 text-[13px] text-[#7A3A00]">
            Inclui a {OTHER_WALLET} {t.ofConnected ? "via Open Finance" : "(Open Finance simulado no protótipo)"}.
          </div>
        )}

        {tab === "cat" ? (
          <div className="mt-4 rounded-[18px] bg-white p-5">
            <div className="text-[14px] text-[#666]">Ciclo 25/08–24/09 · todas as contas</div>
            {cats.map((c) => (
              <div key={c.category} className="mt-3">
                <div className="flex justify-between text-[15px]">
                  <span className="text-[#333]">{c.category}</span>
                  <span className="font-semibold text-[#333]">{hide(brl(c.cents))}</span>
                </div>
                <div className="mt-1 h-[8px] rounded-full bg-[#EEE]">
                  <div className="h-full rounded-full bg-itau-orange" style={{ width: `${(c.cents / cats[0].cents) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          Object.entries(groups).map(([date, items]) => (
            <div key={date} className="mt-4">
              <div className="mb-1 text-[13px] font-semibold uppercase text-[#777]">{fmtDate(date)}</div>
              <div className="rounded-[16px] bg-white px-4">
                {items.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 border-b border-[#EEE] py-[12px] last:border-0">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[15px] text-[#333]">{e.label}</div>
                      <div className="text-[12px] text-[#777]">
                        {e.category}
                        {e.source === "carteira" ? ` · ${OTHER_WALLET}` : ""}
                        {(e.fixed || t.fixedMarked.includes(e.id)) && <span className="ml-1 text-itau-orange">· fixo</span>}
                      </div>
                    </div>
                    <div className={`text-[15px] font-semibold ${e.cents > 0 ? "text-[#1B7F3B]" : "text-[#333]"}`}>
                      {hide(`${e.cents > 0 ? "+" : "-"} ${brl(Math.abs(e.cents))}`)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Screen>
  );
}
