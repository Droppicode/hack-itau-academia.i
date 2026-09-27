import { motion } from "framer-motion";
import { goBack } from "../../state/goBack";
import { Check, ChevronLeft, Loader2, MessageCircle, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IaiAvatar } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { Squish } from "../../components/Squish";
import { KNOWLEDGE, requestTrail, suggestIdeas, type KnowledgeId, type Trail } from "../../data/personalizar";
import { unitDef, UNITS } from "../../data/trilha";
import { useIaContext } from "../../state/iaContext";
import { useTrilha } from "../../state/TrilhaContext";
import { PillButton } from "./Exercise";

export function NovaTrilha() {
  const navigate = useNavigate();
  const t = useTrilha();
  const context = useIaContext();
  const [wish, setWish] = useState("");
  const [knowledge, setKnowledge] = useState<KnowledgeId | undefined>(t.profile.knowledge);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Trail | null>(null);
  const cur = t.trailNow;
  const ideas = cur.ideas.length ? cur.ideas : suggestIdeas(cur.units.map((u) => u.id), t.doneUnits);
  const doneInTrail = t.trailLessons.filter((l) => t.done(l.id)).length;

  const build = async () => {
    if (busy) return;
    setBusy(true);
    const profile = { ...t.profile, knowledge };
    const next = await requestTrail({
      profile,
      goalId: t.goal?.id,
      doneUnits: t.doneUnits,
      currentUnits: cur.units.map((u) => u.id),
      context,
      n: cur.n + 1,
      wish: wish.trim().slice(0, 400) || undefined,
    });
    setBusy(false);
    setDraft(next);
  };

  const accept = () => {
    if (!draft) return;
    t.set({ profile: { ...t.profile, knowledge } });
    t.setTrail(draft);
    navigate("/academia/trilha", { replace: true });
  };

  return (
    <Screen
      bg="bg-[#FBF6F0]"
      header={
        <div className="flex h-[56px] shrink-0 items-center gap-1 bg-[#FBF6F0] px-3">
          <Squish aria-label="Voltar" onClick={() => goBack(navigate)} className="flex h-10 w-10 items-center justify-center" scale={0.88}>
            <ChevronLeft size={28} strokeWidth={1.6} color="#14215A" />
          </Squish>
          <div className="flex-1 text-[18px] font-bold text-[#14215A]">Próxima trilha</div>
        </div>
      }
    >
      <div className="px-5 pb-10">
        <div className="rounded-[22px] bg-[#14215A] p-4 text-white">
          <div className="flex items-center gap-3">
            <IaiAvatar size={36} />
            <div className="text-[15px] leading-snug">
              {t.trailDone
                ? `Você fechou "${cur.title}"! O que quer aprender agora? Eu monto a próxima trilha pra você.`
                : `Você está em "${cur.title}" (${doneInTrail}/${t.trailLessons.length} lições). Quer mudar o rumo? Me conta o que quer aprender.`}
            </div>
          </div>
          {t.goal && <div className="mt-3 text-[13px] text-white/70">Vou levar em conta seu objetivo: {t.goal.name}.</div>}
        </div>

        {!draft ? (
          <>
            <div className="mt-5 text-[13px] font-semibold uppercase tracking-wider text-[#8A7B6C]">Próximas oportunidades</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {ideas.map((i) => (
                <Squish key={i} onClick={() => setWish(wish ? `${wish}, ${i}` : i)} className="rounded-full border border-[#EADFD3] bg-white px-3 py-2 text-[13px] font-semibold text-[#14215A]" scale={0.95}>
                  + {i}
                </Squish>
              ))}
            </div>
            <textarea
              aria-label="O que você quer aprender"
              value={wish}
              maxLength={400}
              onChange={(e) => setWish(e.target.value)}
              placeholder="Ex.: quero entender CDB e como os bancos definem os juros"
              className="mt-4 h-[110px] w-full resize-none rounded-[16px] border border-[#EADFD3] bg-white p-3 text-[15px] leading-snug text-[#222] outline-none focus:border-[#EC7000]"
            />
            <div className="mt-4 text-[13px] font-semibold uppercase tracking-wider text-[#8A7B6C]">Seu momento (opcional)</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {KNOWLEDGE.filter((k) => k.id !== "ia").map((k) => (
                <Squish
                  key={k.id}
                  aria-pressed={knowledge === k.id}
                  onClick={() => setKnowledge(knowledge === k.id ? undefined : k.id)}
                  className={`rounded-full px-3 py-2 text-[13px] font-semibold ${knowledge === k.id ? "bg-[#14215A] text-white" : "bg-white text-[#14215A]"}`}
                  scale={0.95}
                >
                  {k.label}
                </Squish>
              ))}
            </div>
            <Squish onClick={() => void build()} disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#EC7000] py-[14px] text-[16px] font-bold text-white" scale={0.97}>
              {busy ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />} {busy ? "IA.I montando sua trilha…" : "Montar minha próxima trilha"}
            </Squish>
            <Squish onClick={() => navigate("/ia")} className="mx-auto mt-3 flex items-center gap-1 text-[14px] font-semibold text-[#14215A]" scale={0.97}>
              <MessageCircle size={15} /> Prefiro conversar com a IA.I antes
            </Squish>
            <p className="mt-4 text-[12px] leading-snug text-[#8A7B6C]">
              A IA.I escolhe entre {UNITS.length} unidades revisadas da AcademIA.I. Educação financeira, não é recomendação de investimento.
            </p>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <div className="rounded-[22px] bg-white p-4">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#EC7000]">
                <Sparkles size={13} /> Trilha {draft.n} · {draft.source === "ia" ? "montada pela IA.I" : "montada pelas suas respostas (IA.I offline)"}
              </div>
              <div className="mt-1 text-[20px] font-bold text-[#14215A]">{draft.title}</div>
              {draft.intro && <p className="mt-1 text-[14px] leading-snug text-[#6C6257]">{draft.intro}</p>}
              <ol className="mt-3 flex flex-col gap-2">
                {draft.units.map((u, i) => {
                  const d = unitDef(u.id);
                  return (
                    <li key={u.id} className="flex gap-3 rounded-[14px] bg-[#FBF6F0] p-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] text-[14px] font-bold text-white" style={{ background: d?.accent }}>
                        {i + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1 text-[15px] font-semibold text-[#14215A]">
                          {d?.name}
                          {t.unitDone(u.id) && <Check size={14} color="#00857A" />}
                        </div>
                        <div className="text-[13px] leading-snug text-[#6C6257]">{u.why || d?.tagline}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <PillButton label="Começar essa trilha" tone="orange" onClick={accept} />
              <PillButton label="Ajustar pedido" tone="navy" onClick={() => setDraft(null)} />
            </div>
            <p className="mt-3 text-center text-[12px] text-[#8A7B6C]">Seu progresso nas lições já feitas continua salvo.</p>
          </motion.div>
        )}
      </div>
    </Screen>
  );
}
