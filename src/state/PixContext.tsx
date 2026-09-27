import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Recipient = {
  name: string;
  key: string;
  keyFull: string;
  cpf: string;
  bank: string;
  agencyAccount: string;
  own: boolean;
};

export const LUCAS: Recipient = {
  name: "Lucas Andrade Rocha",
  key: "(11) 9 0000-0000",
  keyFull: "+55 (11) 9 0000-0000",
  cpf: "***.000.000-**",
  bank: "Banco Exemplo S.A.",
  agencyAccount: "0001 / 00000-0",
  own: true,
};


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
  const [amountCents, setAmountCents] = useState(1);
  const [recipient, setRecipient] = useState<Recipient>(LUCAS);
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
        setAmountCents(1);
        setRecipient(LUCAS);
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
