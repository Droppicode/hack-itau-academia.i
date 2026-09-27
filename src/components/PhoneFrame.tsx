import { FlaskConical, Smartphone, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const TIPS = [
  { icon: Smartphone, title: "Melhor no celular", text: "Abra este link no seu celular para a experiência completa." },
  { icon: FlaskConical, title: "Botão Teste", text: "Na borda esquerda do app: avance semanas e meses, simule Pix e compras." },
  { icon: Sparkles, title: "Tudo simulado", text: "Protótipo com dados fictícios do Lucas. Nenhum dinheiro de verdade." },
];

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-[100dvh] w-full items-center justify-center md:py-6">
      <div className="relative h-full w-full overflow-hidden bg-white md:h-[844px] md:max-h-[calc(100dvh-48px)] md:w-[390px] md:shrink-0 md:rounded-[48px] md:shadow-[0_0_0_10px_#111,0_20px_60px_rgba(0,0,0,.35)]">
        {children}
      </div>
      <aside className="absolute left-[calc(50%+243px)] top-1/2 hidden w-[240px] -translate-y-1/2 flex-col gap-3 lg:flex" aria-label="Dicas do protótipo">
        <div className="text-[15px] font-bold text-[#14215A]">Protótipo Academ<span className="text-[#EC7000]">IA.I</span></div>
        {TIPS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-3 rounded-[16px] bg-white/70 p-3 shadow-[0_2px_10px_rgba(20,33,90,0.06)]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF1E5]">
              <Icon size={18} color="#EC7000" />
            </span>
            <div>
              <div className="text-[14px] font-semibold text-[#14215A]">{title}</div>
              <div className="text-[13px] leading-snug text-[#5A5A6A]">{text}</div>
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}
