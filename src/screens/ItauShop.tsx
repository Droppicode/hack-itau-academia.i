import { ChevronLeft, Headphones, Laptop, Search, ShoppingBag, Smartphone, Ticket, Watch } from "lucide-react";
import { goBack } from "../state/goBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { brl } from "../data/money";
import { POINT_BRL } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";

const CATS = ["Todos", "Celulares", "Eletrônicos", "Casa", "Experiências"];
const PRODUCTS = [
  { n: "Fone de ouvido bluetooth", c: "Eletrônicos", cents: 19990, I: Headphones },
  { n: "Smartphone 128 GB", c: "Celulares", cents: 149900, I: Smartphone },
  { n: "Notebook 15,6\"", c: "Eletrônicos", cents: 329900, I: Laptop },
  { n: "Smartwatch esportivo", c: "Eletrônicos", cents: 39990, I: Watch },
  { n: "Mochila pra notebook", c: "Casa", cents: 12990, I: ShoppingBag },
  { n: "Vale-ingresso de cinema", c: "Experiências", cents: 3000, I: Ticket },
];

export function ItauShop() {
  const navigate = useNavigate();
  const t = useTrilha();
  const [cat, setCat] = useState("Todos");
  const list = PRODUCTS.filter((p) => cat === "Todos" || p.c === cat);

  return (
    <Screen
      bg="bg-itau-bg"
      header={
        <div className="shrink-0 bg-[#14215A] px-3 pb-3 text-white">
          <div className="flex h-[52px] items-center gap-1">
            <Squish aria-label="Voltar" onClick={() => goBack(navigate)} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
              <ChevronLeft size={26} />
            </Squish>
            <div className="flex-1 text-[17px] font-semibold">Itaú Shop</div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-[13px] font-semibold">{t.points} pts</span>
          </div>
          <div className="mx-2 flex items-center gap-2 rounded-[12px] bg-white px-3 py-2 text-[14px] text-[#888]">
            <Search size={16} /> Buscar produtos
          </div>
        </div>
      }
    >
      <div className="pb-10 pt-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-5">
          {CATS.map((c) => (
            <Squish key={c} onClick={() => setCat(c)} className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold ${cat === c ? "bg-itau-orange text-white" : "bg-white text-[#333]"}`} scale={0.94}>
              {c}
            </Squish>
          ))}
        </div>
        <div className="mx-5 mt-4 rounded-[16px] bg-gradient-to-r from-[#EC7000] to-[#FF9A3D] p-4 text-white">
          <div className="text-[15px] font-bold">Pague com cartão, Pix, pontos ou tudo junto</div>
          <div className="text-[13px] text-white/90">E ganhe cashback em Pontos Itaú em compras selecionadas.</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 px-5">
          {list.map(({ n, cents, I }) => {
            const pts = Math.ceil(cents / 100 / POINT_BRL);
            return (
              <Squish key={n} off className="rounded-[16px] bg-white p-3 text-left" scale={0.96}>
                <div className="flex h-[90px] items-center justify-center rounded-[12px] bg-[#F4F4F4]">
                  <I size={40} color="#14215A" strokeWidth={1.4} />
                </div>
                <div className="mt-2 text-[13px] leading-tight text-[#333]">{n}</div>
                <div className="mt-1 text-[16px] font-bold text-[#222]">{brl(cents)}</div>
                <div className="text-[12px] text-itau-orange">ou {pts.toLocaleString("pt-BR")} pts</div>
              </Squish>
            );
          })}
        </div>
        <p className="mx-5 mt-5 text-[12px] leading-snug text-[#888]">
          Protótipo. Produtos e preços ilustrativos; conversão estimada em R$ 0,02 por ponto (referência pública de desconto na fatura). No Itaú Shop real, a conversão pode variar.
        </p>
      </div>
    </Screen>
  );
}
