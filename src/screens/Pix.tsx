import { Camera, CircleHelp, Copy, KeyRound, Plus, QrCode, Users } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PixIcon } from "../components/Icons";
import { ListRow } from "../components/ListRow";
import { Footer, PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { HeaderIcon, ScreenHeader } from "../components/ScreenHeader";
import { Squish } from "../components/Squish";

const K = "#333";

function Action({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Squish className="flex flex-col items-center" scale={0.92}>
      <div className="flex h-[57px] w-[57px] items-center justify-center rounded-[14px] bg-itau-chip">{icon}</div>
      <span className="mt-[12px] whitespace-pre-line text-center text-[14px] leading-[1.2] text-[#555]">{label}</span>
    </Squish>
  );
}

export function Pix() {
  const navigate = useNavigate();
  return (
    <Screen
      header={
        <ScreenHeader
          right={
            <HeaderIcon label="Ajuda">
              <CircleHelp size={24} strokeWidth={1.6} color="#1A1A1A" />
            </HeaderIcon>
          }
        />
      }
      footer={
        <Footer>
          <PrimaryButton label="Nova transferência" icon={<Plus size={24} strokeWidth={1.6} />} onClick={() => navigate("/pix/destinatario")} />
        </Footer>
      }
    >
      <div className="px-5">
        <h1 className="mt-[16px] text-[26px] font-bold tracking-tight text-black">Pix e transferir</h1>
        <div className="mt-[42px] flex justify-between">
          <Action icon={<Camera size={22} strokeWidth={1.8} color={K} />} label={"Ler\nQR Code"} />
          <Action icon={<Copy size={22} strokeWidth={1.8} color={K} />} label={"Pix\nCopia e Cola"} />
          <Action icon={<KeyRound size={22} strokeWidth={1.8} color={K} />} label={"Minhas\nChaves"} />
          <Action icon={<QrCode size={22} strokeWidth={1.8} color={K} />} label={"Gerar\nQR Code"} />
        </div>
        <h2 className="mb-[6px] mt-[46px] text-[17px] font-bold text-black">Mais opções</h2>
        <ListRow icon={<Users size={22} strokeWidth={1.6} color="#444" />} title="Contatos e favoritos" divider />
        <ListRow icon={<PixIcon size={22} color="#444" />} title="Área Pix" subtitle="Limites, repetições e mais" />
      </div>
    </Screen>
  );
}
