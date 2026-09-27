import { Camera, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountAgencyIcon } from "../components/Icons";
import { ListRow } from "../components/ListRow";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Squish } from "../components/Squish";
import { LUCAS, usePix } from "../state/PixContext";

export function PixDestinatario() {
  const navigate = useNavigate();
  const { setRecipient } = usePix();
  const [q, setQ] = useState("");

  const go = () => {
    setRecipient(LUCAS);
    navigate("/pix/valor");
  };

  return (
    <Screen header={<ScreenHeader />}>
      <div className="px-5">
        <h1 className="mt-[16px] text-[26px] font-bold tracking-tight text-black">Para quem você vai transferir?</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) go();
          }}
        >
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Digite a chave Pix ou nome"
            enterKeyHint="go"
            className="mt-[22px] h-[44px] w-full rounded-[12px] border border-[#BDBDBD] bg-[#F0F1F3] px-4 text-[17px] text-black outline-none placeholder:text-[#555] focus:border-itau-orange"
          />
        </form>

        {q.trim() ? (
          <div className="mt-4">
            <div className="mb-1 text-[14px] text-[#777]">Resultados</div>
            <Squish onClick={go} className="flex w-full items-center gap-3 border-b border-[#D6D6D6] py-[14px]" scale={0.98}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F1F3] text-[14px] font-semibold text-[#444]">LR</div>
              <div className="flex-1">
                <div className="text-[16px] font-semibold text-[#3A3A3A]">{LUCAS.name}</div>
                <div className="text-[14px] text-[#666]">
                  {LUCAS.key} · Banco Exemplo
                </div>
              </div>
              <ChevronRight size={20} strokeWidth={1.6} color="#4A4A4A" />
            </Squish>
          </div>
        ) : (
          <div className="mt-[30px]">
            <ListRow icon={<Camera size={24} strokeWidth={1.6} color="#444" />} title="Ler QR Code" divider />
            <ListRow icon={<AccountAgencyIcon size={24} color="#444" />} title="Informar agência e conta" />
          </div>
        )}
      </div>
    </Screen>
  );
}
