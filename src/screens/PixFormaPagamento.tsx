import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ItauLogo, OpenFinanceIcon } from "../components/Icons";
import { ListRow } from "../components/ListRow";
import { Screen } from "../components/Screen";
import { HeaderIcon, ScreenHeader } from "../components/ScreenHeader";
import { formatBRL, usePix } from "../state/PixContext";
import { useTrilha } from "../state/TrilhaContext";

export function PixFormaPagamento() {
  const navigate = useNavigate();
  const { amountCents, balanceHidden, setBalanceHidden } = usePix();
  const { balanceCents } = useTrilha();

  return (
    <Screen
      header={
        <ScreenHeader
          right={
            <HeaderIcon label="Mostrar ou ocultar saldo" onClick={() => setBalanceHidden(!balanceHidden)}>
              {balanceHidden ? <EyeOff size={24} strokeWidth={1.6} color="#1A1A1A" /> : <Eye size={24} strokeWidth={1.6} color="#1A1A1A" />}
            </HeaderIcon>
          }
        />
      }
      scrollClassName="flex flex-col"
    >
      <div className="flex flex-1 flex-col px-5">
        <h1 className="mt-[16px] text-[26px] font-bold leading-[1.25] tracking-tight text-black">
          Escolha como quer transferir o valor de {formatBRL(amountCents)}
        </h1>
        <div className="min-h-[120px] flex-1" />
        <div style={{ paddingBottom: "max(56px, env(safe-area-inset-bottom))" }}>
          <ListRow
            icon={
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F0F1F3]">
                <ItauLogo size={20} />
              </div>
            }
            title="Conta Itaú"
            subtitle={`Saldo ${balanceHidden ? "••••" : formatBRL(balanceCents)}`}
            bold
            divider
            onClick={() => navigate("/pix/dados")}
          />
          <ListRow
            icon={
              <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F0F1F3]">
                <OpenFinanceIcon size={18} color="#333" />
              </div>
            }
            title="Pagar com outro banco"
            subtitle="Via Open Finance"
          />
        </div>
      </div>
    </Screen>
  );
}
