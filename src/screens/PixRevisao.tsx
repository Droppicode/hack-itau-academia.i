import { CalendarDays, ChevronRight, CircleDollarSign, MessageSquare } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../components/BottomSheet";
import { Footer, PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { ScreenHeader } from "../components/ScreenHeader";
import { Squish } from "../components/Squish";
import { formatBRL, usePix } from "../state/PixContext";

const O = "#FF6200";

function OptionCard({ icon, label, value, onClick }: { icon: ReactNode; label: string; value?: string; onClick: () => void }) {
  return (
    <Squish onClick={onClick} className="flex h-[89px] w-[89px] shrink-0 flex-col justify-between rounded-[14px] bg-itau-chip p-[12px]" scale={0.93}>
      {icon}
      <div className="leading-tight">
        {value !== undefined ? (
          <>
            <div className="text-[13px] font-semibold text-[#333]">{label}</div>
            <div className="truncate text-[14px] font-bold text-[#333]">{value}</div>
          </>
        ) : (
          <div className="text-[13px] font-semibold text-[#333]">{label}</div>
        )}
      </div>
    </Squish>
  );
}

function DetailRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-[#C8C8C8] py-[16px] last:border-0">
      <div>
        <div className="text-[15px] text-[#333]">{label}</div>
        <div className="text-[16px] font-semibold text-black">{value}</div>
      </div>
      {onEdit && (
        <Squish onClick={onEdit} className="flex items-center gap-1 text-[16px] font-semibold text-[#4A4A4A]" scale={0.92}>
          Editar <ChevronRight size={18} strokeWidth={1.6} />
        </Squish>
      )}
    </div>
  );
}

type Sheet = "data" | "repetir" | "mensagem" | null;

export function PixRevisao() {
  const navigate = useNavigate();
  const { amountCents, recipient, date, setDate, repeat, setRepeat, message, setMessage } = usePix();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [draft, setDraft] = useState(message);

  return (
    <Screen
      header={<ScreenHeader />}
      footer={
        <Footer>
          <PrimaryButton
            label="Confirmar transferência"
            icon={<ChevronRight size={24} strokeWidth={1.6} />}
            onClick={() => navigate("/pix/sucesso")}
          />
        </Footer>
      }
    >
      <div className="px-5 pb-6">
        <h1 className="mt-[16px] text-[26px] font-bold leading-[1.25] tracking-tight text-black">
          Transferir R$ {formatBRL(amountCents)} para {recipient.name}?
        </h1>

        <div className="mt-[28px] flex gap-[8px]">
          <OptionCard icon={<CalendarDays size={20} color={O} strokeWidth={1.8} />} label="Data" value={date} onClick={() => setSheet("data")} />
          <OptionCard
            icon={<CircleDollarSign size={20} color={O} strokeWidth={1.8} />}
            label="Repetir"
            value={repeat ? "Mensal" : "Não"}
            onClick={() => setSheet("repetir")}
          />
          <OptionCard
            icon={<MessageSquare size={20} color={O} strokeWidth={1.8} />}
            label="Mensagem"
            value={message ? message : undefined}
            onClick={() => {
              setDraft(message);
              setSheet("mensagem");
            }}
          />
        </div>

        <div className="mt-[20px]">
          <DetailRow label="Valor" value={`R$ ${formatBRL(amountCents)}`} onEdit={() => navigate("/pix/valor")} />
          <DetailRow label="Tipo de transferência" value="Pix" />
          <DetailRow label="Forma de pagamento" value="Saldo em conta" onEdit={() => navigate("/pix/forma-pagamento")} />
          <DetailRow label="CPF" value={recipient.cpf} />
          <DetailRow label="Chave Pix" value={recipient.keyFull} />
          <DetailRow label="Instituição" value={recipient.bank} />
          <DetailRow label="Agência / Conta" value={recipient.agencyAccount} />
          <DetailRow label="Identificador" value="Pix enviado pelo app" />
        </div>
        <p className="mt-3 text-[13px] leading-snug text-[#777]">
          Transferências Pix são concluídas em segundos e não podem ser canceladas.
        </p>
      </div>

      <BottomSheet open={sheet === "data"} onClose={() => setSheet(null)} title="Quando você quer transferir?">
        {(["Hoje", "Agendar"] as const).map((d) => (
          <Squish
            key={d}
            onClick={() => {
              setDate(d);
              setSheet(null);
            }}
            className={`mb-2 flex w-full items-center justify-between rounded-[12px] border px-4 py-[14px] text-[16px] font-semibold ${
              date === d ? "border-itau-orange text-itau-orange" : "border-[#D6D6D6] text-[#333]"
            }`}
            scale={0.97}
          >
            {d === "Hoje" ? "Hoje" : "Agendar para outra data"}
            <span className={`h-4 w-4 rounded-full border-2 ${date === d ? "border-itau-orange bg-itau-orange" : "border-[#999]"}`} />
          </Squish>
        ))}
      </BottomSheet>

      <BottomSheet open={sheet === "repetir"} onClose={() => setSheet(null)} title="Repetir transferência?">
        {[
          { v: false, l: "Não repetir" },
          { v: true, l: "Repetir mensalmente" },
        ].map((o) => (
          <Squish
            key={o.l}
            onClick={() => {
              setRepeat(o.v);
              setSheet(null);
            }}
            className={`mb-2 flex w-full items-center justify-between rounded-[12px] border px-4 py-[14px] text-[16px] font-semibold ${
              repeat === o.v ? "border-itau-orange text-itau-orange" : "border-[#D6D6D6] text-[#333]"
            }`}
            scale={0.97}
          >
            {o.l}
            <span className={`h-4 w-4 rounded-full border-2 ${repeat === o.v ? "border-itau-orange bg-itau-orange" : "border-[#999]"}`} />
          </Squish>
        ))}
      </BottomSheet>

      <BottomSheet open={sheet === "mensagem"} onClose={() => setSheet(null)} title="Mensagem para o destinatário">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 140))}
          placeholder="Escreva uma mensagem (opcional)"
          rows={3}
          className="w-full resize-none rounded-[12px] border border-[#BDBDBD] bg-[#F0F1F3] p-3 text-[16px] outline-none focus:border-itau-orange"
        />
        <div className="mb-4 mt-1 text-right text-[12px] text-[#777]">{draft.length}/140</div>
        <PrimaryButton
          label="Salvar mensagem"
          onClick={() => {
            setMessage(draft.trim());
            setSheet(null);
          }}
        />
      </BottomSheet>
    </Screen>
  );
}
