import { Bell, ChevronRight, Eye, EyeOff, Landmark, MessageSquare, PiggyBank, Search, Smartphone, TrendingUp, UserPlus } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { BottomTabBar } from "../components/BottomTabBar";
import {
  BarcodeIcon,
  CofrinhoIcon,
  CompleteAccountIcon,
  ItauLogo,
  MastercardLogo,
  PixIcon,
  VirtualCardIcon,
} from "../components/Icons";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { HomeCarousel, PixInvite } from "../components/Iai";
import { BALANCE_CENTS, formatBRL, usePix } from "../state/PixContext";
import { useTrilha } from "../state/TrilhaContext";
import { markHome } from "../state/homeHistory";

const K = "#1A1A1A";

export function OrangeHeader() {
  const navigate = useNavigate();
  const { level } = useTrilha();
  return (
    <div className="flex h-[66px] shrink-0 items-center justify-between bg-itau-orange px-5 pb-2">
      <div className="flex items-center gap-2">
        <Squish className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white text-[14px] text-[#333]" scale={0.9}>
          MC
        </Squish>
        <Squish onClick={() => navigate("/pra-voce", { replace: true, state: { tab: true } })} className="flex items-center gap-[6px] rounded-full bg-white/20 px-[10px] py-[5px] text-[15px] font-semibold text-white" scale={0.94}>
          <span className="relative flex h-[14px] w-[14px] items-center justify-center">
            <svg viewBox="0 0 24 24" className="absolute inset-0" fill="white">
              <path d="M12 1.5 21.5 7v10L12 22.5 2.5 17V7z" />
            </svg>
            <span className="relative text-[9px] font-bold text-itau-orange">{level}</span>
          </span>
          Nível {level}
        </Squish>
      </div>
      <div className="flex items-center gap-2">
        {[
          { key: "search", node: <Search size={23} color="white" strokeWidth={1.8} /> },
          {
            key: "bell",
            node: (
              <span className="relative">
                <Bell size={23} color="white" fill="white" strokeWidth={1.8} />
                <span className="absolute -right-[2px] -top-[3px] h-[9px] w-[9px] rounded-full border border-white bg-[#E4002B]" />
              </span>
            ),
          },
          { key: "chat", node: <MessageSquare size={22} color="white" strokeWidth={1.8} /> },
        ].map((i) => (
          <Squish key={i.key} className="flex h-10 w-10 items-center justify-center rounded-full" scale={0.88}>
            {i.node}
          </Squish>
        ))}
      </div>
    </div>
  );
}

function Shortcut({ icon, label, badge, onClick }: { icon: ReactNode; label: string; badge?: string; onClick?: () => void }) {
  return (
    <Squish onClick={onClick} className="relative flex w-[66px] shrink-0 snap-start flex-col items-center" scale={0.92}>
      <div className="relative flex h-[57px] w-[57px] items-center justify-center rounded-[14px] bg-white">
        {badge && (
          <span className="absolute -top-[9px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-[#1A3EBF] px-[7px] py-[1px] text-[12px] font-medium text-white">
            {badge}
          </span>
        )}
        {icon}
      </div>
      <span className="mt-[9px] text-center text-[13px] leading-[1.25] text-[#444]">{label}</span>
    </Squish>
  );
}

function Card({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <Squish onClick={onClick} className="block w-full rounded-[18px] bg-white px-[22px] py-[22px]" scale={0.98}>
      {children}
    </Squish>
  );
}

function CardHead({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-[10px]">
      {icon}
      <span className="flex-1 text-[15px] text-[#444]">{title}</span>
      <ChevronRight size={18} strokeWidth={1.6} color="#444" />
    </div>
  );
}

export function Home() {
  const navigate = useNavigate();
  const { balanceHidden, setBalanceHidden } = usePix();
  useEffect(markHome, []);
  const money = (cents: number) => (balanceHidden ? "R$ ••••" : `R$ ${formatBRL(cents)}`);

  return (
    <Screen bg="bg-itau-bg" statusTone="light" statusBg="bg-itau-orange" header={<OrangeHeader />} footer={<BottomTabBar />}>
      <div className="pb-8">
        <div className="mt-[34px] flex items-center justify-between px-5">
          <h1 className="text-[18px] font-bold tracking-tight text-black">Meu Itaú</h1>
          <Squish
            aria-label="Mostrar ou ocultar saldo"
            onClick={() => setBalanceHidden(!balanceHidden)}
            className="flex h-10 w-10 items-center justify-center rounded-full"
            scale={0.88}
          >
            {balanceHidden ? <EyeOff size={22} color={K} strokeWidth={1.8} /> : <Eye size={22} color={K} strokeWidth={1.8} />}
          </Squish>
        </div>

        <div className="no-scrollbar mt-[18px] flex snap-x snap-mandatory scroll-px-5 gap-[9px] overflow-x-auto px-5 pt-[10px]">
          <Shortcut icon={<PixIcon size={24} color={K} />} label="Pix e transferir" onClick={() => navigate("/pix")} />
          <Shortcut icon={<BarcodeIcon size={24} color={K} />} label="Pagar" />
          <Shortcut icon={<CompleteAccountIcon size={24} color={K} />} label="Complete sua conta" badge="Pendente" />
          <Shortcut icon={<VirtualCardIcon size={24} color={K} />} label="Cartão virtual" />
          <Shortcut icon={<CofrinhoIcon size={24} color={K} />} label="Cofrinhos" />
          <Shortcut icon={<Smartphone size={24} color={K} strokeWidth={1.8} />} label="Recarga" />
          <Shortcut icon={<PiggyBank size={24} color={K} strokeWidth={1.8} />} label="Empréstimos" />
          <Shortcut icon={<TrendingUp size={24} color={K} strokeWidth={1.8} />} label="Investimentos" />
          <div className="w-2 shrink-0" />
        </div>

        <div className="mt-[30px] flex flex-col gap-[29px] px-5">
          <PixInvite />
          <HomeCarousel />
          <div className="-mt-[12px] rounded-[18px] bg-white px-[22px] pb-[12px] pt-[22px]">
            <Squish className="block w-full" scale={0.98}>
              <CardHead icon={<ItauLogo size={16} />} title="Conta corrente" />
              <div className="mt-[30px] text-[15px] text-[#444]">Saldo</div>
              <div className="text-[22px] font-semibold text-[#3A3A3A]">{money(BALANCE_CENTS)}</div>
            </Squish>
            <div className="mt-[14px] border-t border-[#CFCFCF]" />
            <Squish className="flex w-full items-center justify-between py-[14px]" scale={0.98}>
              <span className="text-[17px] text-[#444]">Limite da Conta</span>
              <ChevronRight size={18} strokeWidth={1.6} color="#444" />
            </Squish>
          </div>

          <Card>
            <CardHead icon={<MastercardLogo />} title="Itaú Click Múltiplo Plat final 7899" />
            <div className="mt-[30px] text-[15px] text-[#444]">Fatura aberta</div>
            <div className="text-[22px] font-semibold text-[#3A3A3A]">{money(0)}</div>
            <div className="mt-[4px] text-[15px] font-semibold text-[#444]">Melhor data de compras: 03 out</div>
            <div className="mt-[18px] flex items-center justify-between border-t border-[#CFCFCF] pt-[14px]">
              <span className="text-[15px] text-[#444]">Limite disponível</span>
              <span className="text-[15px] font-semibold text-[#3A3A3A]">{money(50000)}</span>
            </div>
          </Card>

          <Card>
            <CardHead icon={<TrendingUp size={18} color={K} strokeWidth={1.8} />} title="Investimentos" />
            <div className="mt-[22px] text-[15px] text-[#444]">Total investido</div>
            <div className="text-[22px] font-semibold text-[#3A3A3A]">{money(0)}</div>
            <div className="mt-[4px] text-[14px] text-[#666]">Comece com a partir de R$ 1,00</div>
          </Card>

          <Card>
            <CardHead icon={<Landmark size={18} color={K} strokeWidth={1.8} />} title="Empréstimos" />
            <div className="mt-[22px] text-[17px] font-semibold text-[#3A3A3A]">Crédito pré-aprovado</div>
            <div className="mt-[2px] text-[14px] text-[#666]">Veja as condições disponíveis para você</div>
          </Card>

          <div>
            <h2 className="mb-3 text-[18px] font-bold text-black">Pra você</h2>
            <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5">
              {[
                { title: "Cofrinhos", text: "Comece a guardar dinheiro para seus objetivos", bg: "bg-itau-orange", Icon: PiggyBank },
                { title: "Indique o Itaú", text: "Convide amigos e ganhe benefícios", bg: "bg-itau-navy", Icon: UserPlus },
                { title: "Complete sua conta", text: "Libere mais funções no app", bg: "bg-[#1A3EBF]", Icon: Smartphone },
              ].map(({ title, text, bg, Icon }) => (
                <Squish key={title} className={`flex h-[128px] w-[260px] shrink-0 snap-start flex-col justify-between rounded-[18px] p-[18px] text-white ${bg}`}>
                  <Icon size={26} color="white" strokeWidth={1.8} />
                  <div>
                    <div className="text-[17px] font-bold">{title}</div>
                    <div className="text-[14px] leading-tight opacity-90">{text}</div>
                  </div>
                </Squish>
              ))}
            </div>
          </div>

          <div className="rounded-[18px] bg-white px-[22px] py-[20px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-black">Minhas últimas transações</h2>
              <Squish className="text-[14px] font-semibold text-itau-navy">Ver extrato</Squish>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3 border-b border-[#EEE] py-[14px] last:border-0">
                <div className="h-9 w-9 rounded-full bg-[#F0F1F3]" />
                <div className="flex-1">
                  <div className="h-[10px] w-2/3 rounded bg-[#F0F1F3]" />
                  <div className="mt-2 h-[8px] w-1/3 rounded bg-[#F4F4F4]" />
                </div>
              </div>
            ))}
            <div className="pt-1 text-center text-[14px] text-[#777]">Nenhuma transação recente</div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
