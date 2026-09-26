import { OTHER_WALLET } from "../data/lucas";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Recipient = {
  name: string;
  key: string;
  keyFull: string;
  cpf: string;
  bank: string;
  agencyAccount: string;
  own?: boolean;
};

export const MATHEUS: Recipient = {
  name: "Matheus Felipe Cavalcante Cunha",
  key: "(18) 9 9775-6012",
  keyFull: "+55 (18) 9 9775-6012",
  cpf: "***.062.708-**",
  bank: "Banco Santander (Brasil) S.A.",
  agencyAccount: "0001 / 12345-6",
};

export const LUCAS_CARTEIRA: Recipient = {
  name: "Lucas Oliveira Santos",
  key: "CPF •••.482.918-••",
  keyFull: "CPF •••.482.918-••",
  cpf: "•••.482.918-••",
  bank: OTHER_WALLET,
  agencyAccount: "0001 / 88231-4",
  own: true,
};

export const RECIPIENTS = [LUCAS_CARTEIRA, MATHEUS];

export const DEFAULT_PIX_CENTS = 120000;

type PixState = {
  amountCents: number;
  setAmountCents: (v: number) => void;
  recipient: Recipient;
  setRecipient: (r: Recipient) => void;
  date: "Hoje" | "Agendar";
  setDate: (d: "Hoje" | "Agendar") => void;
  repeat: boolean;
  setRepeat: (v: boolean) => void;
  message: string;
  setMessage: (m: string) => void;
  saveContact: boolean;
  setSaveContact: (v: boolean) => void;
  balanceHidden: boolean;
  setBalanceHidden: (v: boolean) => void;
  reset: () => void;
};

const PixContext = createContext<PixState | null>(null);

export function PixProvider({ children }: { children: ReactNode }) {
  const [amountCents, setAmountCents] = useState(DEFAULT_PIX_CENTS);
  const [recipient, setRecipient] = useState<Recipient>(LUCAS_CARTEIRA);
  const [date, setDate] = useState<"Hoje" | "Agendar">("Hoje");
  const [repeat, setRepeat] = useState(false);
  const [message, setMessage] = useState("");
  const [saveContact, setSaveContact] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);

  const value = useMemo<PixState>(
    () => ({
      amountCents,
      setAmountCents,
      recipient,
      setRecipient,
      date,
      setDate,
      repeat,
      setRepeat,
      message,
      setMessage,
      saveContact,
      setSaveContact,
      balanceHidden,
      setBalanceHidden,
      reset: () => {
        setAmountCents(DEFAULT_PIX_CENTS);
        setRecipient(LUCAS_CARTEIRA);
        setDate("Hoje");
        setRepeat(false);
        setMessage("");
        setSaveContact(false);
      },
    }),
    [amountCents, recipient, date, repeat, message, saveContact, balanceHidden],
  );

  return <PixContext.Provider value={value}>{children}</PixContext.Provider>;
}

export function usePix() {
  const ctx = useContext(PixContext);
  if (!ctx) throw new Error("usePix must be used inside PixProvider");
  return ctx;
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
