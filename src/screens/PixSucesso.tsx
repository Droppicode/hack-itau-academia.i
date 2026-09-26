import { motion } from "framer-motion";
import { Share2, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, PrimaryButton } from "../components/PrimaryButton";
import { Screen } from "../components/Screen";
import { PixHookCard } from "../components/Iai";
import { Squish } from "../components/Squish";
import { useTrilha } from "../state/TrilhaContext";
import { formatBRL, usePix } from "../state/PixContext";
import { deltaToHome } from "../state/homeHistory";

export function PixSucesso() {
  const navigate = useNavigate();
  const { amountCents, recipient, message, reset } = usePix();
  const { shouldHook } = useTrilha();
  const [hook] = useState(() => shouldHook({ cents: amountCents, own: !!recipient.own }));
  const now = useMemo(() => new Date(), []);
  const txId = useMemo(() => `E60701190${now.getTime().toString(36).toUpperCase()}PIX`, [now]);
  const when = now.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <Screen
      footer={
        <Footer>
          <PrimaryButton
            label="Voltar para a home"
            onClick={() => {
              reset();
              const delta = deltaToHome();
              if (delta !== undefined) navigate(delta);
              else navigate("/home", { replace: true, state: { tab: true } });
            }}
          />
        </Footer>
      }
    >
      <div className="flex flex-col items-center px-5 pt-[48px] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex h-[84px] w-[84px] items-center justify-center rounded-full bg-itau-orange"
        >
          <motion.svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <motion.path d="M5 12.5 10 17.5 19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.35 }} />
          </motion.svg>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <h1 className="mt-6 text-[28px] font-bold tracking-tight text-black">Pix enviado!</h1>
          <p className="mt-1 text-[17px] text-[#444]">
            <span className="font-semibold">R$ {formatBRL(amountCents)}</span> para {recipient.name}
          </p>
        </motion.div>

        <div className="mt-8 w-full rounded-[16px] bg-itau-chip px-4 py-2 text-left">
          {[
            { l: "Data e hora", v: when },
            { l: "Instituição", v: recipient.bank },
            { l: "Chave Pix", v: recipient.keyFull },
            ...(message ? [{ l: "Mensagem", v: message }] : []),
            { l: "ID da transação", v: txId },
          ].map((r) => (
            <div key={r.l} className="border-b border-[#DDD] py-3 last:border-0">
              <div className="text-[13px] text-[#666]">{r.l}</div>
              <div className="break-all text-[15px] font-semibold text-[#333]">{r.v}</div>
            </div>
          ))}
        </div>

        {hook && (
          <PixHookCard
            cents={amountCents}
            onGo={() => {
              reset();
              navigate("/academia/licao/L1", { replace: true, state: { fromPix: true } });
            }}
          />
        )}

        <div className="mb-6 mt-5 flex w-full flex-col gap-3">
          <Squish className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-itau-orange py-[11px] text-[15px] font-semibold text-itau-orange">
            <Share2 size={18} strokeWidth={1.8} /> Compartilhar comprovante
          </Squish>
          <Squish className="flex w-full items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-itau-orange py-[11px] text-[15px] font-semibold text-itau-orange">
            <UserPlus size={18} strokeWidth={1.8} /> Salvar contato
          </Squish>
        </div>
      </div>
    </Screen>
  );
}
