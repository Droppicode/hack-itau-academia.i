import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer, PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Squish } from "../components/Squish";
import { formatBRL, usePix } from "../state/PixContext";
import { useTrilha } from "../state/TrilhaContext";

const CHIPS = [2000, 5000, 20000, 120000];

export function PixValor() {
  const navigate = useNavigate();
  const { amountCents, setAmountCents, recipient } = usePix();
  const { balanceCents } = useTrilha();
  const over = amountCents > balanceCents;

  return (
    <Screen
      header={<ScreenHeader />}
      footer={
        <Footer>
          <PrimaryButton
            label="Continuar"
            icon={<ChevronRight size={24} strokeWidth={1.6} />}
            disabled={amountCents === 0 || over}
            onClick={() => navigate("/pix/forma-pagamento")}
          />
        </Footer>
      }
    >
      <div className="px-5">
        <div className="mt-[16px] text-[16px] text-[#555]">Transferência para {recipient.name.split(" ")[0]}</div>
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-black">Qual valor você quer transferir?</h1>

        <label className="mt-[40px] flex items-baseline gap-2 border-b-2 border-itau-orange pb-2">
          <span className="text-[24px] font-semibold text-[#555]">R$</span>
          <input
            inputMode="numeric"
            autoFocus
            aria-label="Valor"
            value={formatBRL(amountCents)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
              setAmountCents(Number(digits || "0"));
            }}
            className="w-full bg-transparent text-[40px] font-bold tracking-tight text-black outline-none"
          />
        </label>
        <div className={`mt-3 text-[15px] ${over ? "text-[#C8102E]" : "text-[#555]"}`}>
          {over ? "Saldo insuficiente · " : "Saldo disponível "}
          <span className="font-semibold">R$ {formatBRL(balanceCents)}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {CHIPS.map((c) => (
            <Squish
              key={c}
              onClick={() => setAmountCents(c)}
              className={`rounded-full border px-4 py-2 text-[15px] font-semibold ${
                amountCents === c ? "border-itau-orange bg-[#FFF1E5] text-itau-orange" : "border-[#CFCFCF] text-[#444]"
              }`}
              scale={0.92}
            >
              R$ {formatBRL(c)}
            </Squish>
          ))}
        </div>
      </div>
    </Screen>
  );
}
