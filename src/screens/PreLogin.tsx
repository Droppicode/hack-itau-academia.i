import { CircleHelp, Landmark, Lock, MapPin, PiggyBank, ShieldCheck, Smartphone, TrendingUp } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { BarcodeIcon, ExtratoIcon, ITokenIcon, PixIcon, TransferIcon, VirtualCardIcon } from "../components/Icons";
import { Screen } from "../components/Screen";
import { Squish } from "../components/Squish";
import { clearHome } from "../state/homeHistory";

const O = "#FF6200";

function Tile({ icon, label, onClick, className = "" }: { icon: ReactNode; label: string; onClick?: () => void; className?: string }) {
  return (
    <Squish onClick={onClick} className={`flex flex-col justify-between rounded-[18px] bg-white p-[15px] ${className}`}>
      <div>{icon}</div>
      <span className="text-[17px] font-semibold text-[#3F3F3F]">{label}</span>
    </Squish>
  );
}

export function PreLogin() {
  const navigate = useNavigate();
  useEffect(clearHome, []);
  return (
    <Screen bg="bg-itau-bg">
      <div className="px-5 pb-10">
        <div className="mt-[30px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#3A3A3A] text-[14px] text-white">LR</div>
            <div className="leading-tight">
              <div className="text-[18px] font-semibold text-[#3F3F3F]">Olá, Lucas</div>
              <div className="text-[12px] text-[#555]">CPF •••.000.000-••</div>
            </div>
          </div>
          <Squish className="rounded-[10px] border-[1.5px] border-itau-navy px-[14px] py-[8px] text-[15px] font-semibold text-itau-navy">
            Trocar conta
          </Squish>
        </div>

        <div className="mt-[32px] grid grid-cols-2 gap-[11px]">
          <Tile
            className="col-span-2 h-[172px]"
            icon={<Lock size={26} color={O} strokeWidth={1.8} />}
            label="Acessar"
            onClick={() => navigate("/home")}
          />
          <Tile className="h-[164px]" icon={<TransferIcon size={26} color={O} />} label="Pix e transferir" onClick={() => navigate("/pix")} />
          <Tile className="h-[164px]" icon={<BarcodeIcon size={26} color={O} />} label="Pagar" />
          <Tile className="h-[164px]" icon={<ExtratoIcon size={26} color={O} />} label="Extrato" onClick={() => navigate("/extrato")} />
          <Tile className="h-[164px]" icon={<VirtualCardIcon size={26} color={O} />} label="Cartão virtual" />
        </div>
        <div className="mt-[11px] grid grid-cols-3 gap-[7px]">
          <Tile className="h-[112px] !p-[10px]" icon={<PixIcon size={20} color={O} />} label="Área Pix" onClick={() => navigate("/pix")} />
          <Tile className="h-[112px] !p-[10px]" icon={<ITokenIcon size={20} color={O} />} label="iToken" />
          <Tile className="h-[112px] !p-[10px]" icon={<CircleHelp size={20} color={O} strokeWidth={1.8} />} label="Ajuda" />
        </div>

        <h2 className="mb-3 mt-8 text-[18px] font-bold text-itau-text">Outros serviços</h2>
        <div className="grid grid-cols-2 gap-[11px]">
          <Tile className="h-[104px]" icon={<Smartphone size={22} color={O} strokeWidth={1.8} />} label="Recarga de celular" />
          <Tile className="h-[104px]" icon={<ShieldCheck size={22} color={O} strokeWidth={1.8} />} label="Seguros" />
          <Tile className="h-[104px]" icon={<TrendingUp size={22} color={O} strokeWidth={1.8} />} label="Investimentos" onClick={() => navigate("/cofrinhos")} />
          <Tile className="h-[104px]" icon={<PiggyBank size={22} color={O} strokeWidth={1.8} />} label="Empréstimos" />
        </div>

        <Squish className="mt-[11px] flex w-full items-center gap-4 rounded-[18px] bg-white p-[15px]">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1E5]">
            <MapPin size={22} color={O} strokeWidth={1.8} />
          </div>
          <div className="flex-1">
            <div className="text-[16px] font-semibold text-[#3F3F3F]">Encontre uma agência ou caixa eletrônico</div>
            <div className="text-[14px] text-[#666]">Veja os mais próximos de você</div>
          </div>
        </Squish>

        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-[#777]">
            <Landmark size={16} strokeWidth={1.8} />
            <span className="text-[12px]">Itaú Unibanco S.A. — CNPJ 60.701.190/0001-04</span>
          </div>
          <div className="flex gap-5 text-[13px] font-semibold text-itau-navy">
            <Squish>Segurança</Squish>
            <Squish>Privacidade</Squish>
            <Squish>Fale conosco</Squish>
          </div>
          <span className="text-[11px] text-[#999]">versão 8.24.0</span>
        </div>
      </div>
    </Screen>
  );
}
