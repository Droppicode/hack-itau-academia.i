import { Camera, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountAgencyIcon } from "../components/Icons";
import { ListRow } from "../components/ListRow";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Squish } from "../components/Squish";
import { RECIPIENTS, usePix, type Recipient } from "../state/PixContext";

const initials = (name: string) =>
  name
    .split(" ")
    .filter((_, i, a) => i === 0 || i === a.length - 1)
    .map((w) => w[0])
    .join("");

function RecipientRow({ r, onClick }: { r: Recipient; onClick: () => void }) {
  return (
    <Squish onClick={onClick} className="flex w-full items-center gap-3 border-b border-[#D6D6D6] py-[14px]" scale={0.98}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F1F3] text-[14px] font-semibold text-[#444]">{initials(r.name)}</div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[16px] font-semibold text-[#3A3A3A]">
          {r.name}
          {r.own && <span className="ml-2 rounded-full bg-[#F0F1F3] px-2 py-[1px] text-[12px] font-medium text-[#555]">você</span>}
        </div>
        <div className="truncate text-[14px] text-[#666]">
          {r.key} · {r.bank}
        </div>
      </div>
      <ChevronRight size={20} strokeWidth={1.6} color="#4A4A4A" />
    </Squish>
  );
}

export function PixDestinatario() {
  const navigate = useNavigate();
  const { setRecipient } = usePix();
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const results = RECIPIENTS.filter((r) => `${r.name} ${r.key} ${r.bank}`.toLowerCase().includes(query));

  const go = (r: Recipient) => {
    setRecipient(r);
    navigate("/pix/valor");
  };

  return (
    <Screen header={<ScreenHeader />}>
      <div className="px-5">
        <h1 className="mt-[16px] text-[26px] font-bold tracking-tight text-black">Para quem você vai transferir?</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query) go(results[0] ?? RECIPIENTS[0]);
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

        {query ? (
          <div className="mt-4">
            <div className="mb-1 text-[14px] text-[#777]">Resultados</div>
            {(results.length ? results : RECIPIENTS).map((r) => (
              <RecipientRow key={r.name} r={r} onClick={() => go(r)} />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-[30px]">
              <ListRow icon={<Camera size={24} strokeWidth={1.6} color="#444" />} title="Ler QR Code" divider />
              <ListRow icon={<AccountAgencyIcon size={24} color="#444" />} title="Informar agência e conta" />
            </div>
            <div className="mt-4 text-[15px] font-semibold text-[#555]">Recentes</div>
            {RECIPIENTS.map((r) => (
              <RecipientRow key={r.name} r={r} onClick={() => go(r)} />
            ))}
          </>
        )}
      </div>
    </Screen>
  );
}
