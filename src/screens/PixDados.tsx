import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Footer, PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Toggle } from "../components/Toggle";
import { usePix } from "../state/PixContext";

export function PixDados() {
  const navigate = useNavigate();
  const { recipient, saveContact, setSaveContact } = usePix();
  const rows = [
    { label: "Chave Pix", value: recipient.key },
    { label: "CPF", value: recipient.cpf },
    { label: "Instituição", value: recipient.bank },
  ];

  return (
    <Screen
      header={<ScreenHeader />}
      footer={
        <Footer>
          <PrimaryButton label="Continuar" icon={<ChevronRight size={24} strokeWidth={1.6} />} onClick={() => navigate("/pix/revisao")} />
        </Footer>
      }
    >
      <div className="px-5 pb-6">
        <div className="mt-[12px] text-[15px] text-[#555]">Transferência para</div>
        <h1 className="text-[24px] font-bold leading-tight tracking-tight text-black">{recipient.name}</h1>
        <div className="-mx-2 mt-[28px]">
          {rows.map((r) => (
            <div key={r.label} className="border-b border-[#C8C8C8] px-2 py-[14px]">
              <div className="text-[16px] font-semibold text-[#4A4A4A]">{r.label}</div>
              <div className="text-[16px] text-[#555]">{r.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between py-[26px]">
          <span className="text-[16px] font-semibold text-[#4A4A4A]">Salvar contato</span>
          <Toggle on={saveContact} onChange={setSaveContact} label="Salvar contato" />
        </div>
      </div>
    </Screen>
  );
}
