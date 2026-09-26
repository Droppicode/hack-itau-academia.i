import { Check, ChevronRight, Gift, Lock, Settings2, Target } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomSheet } from "../../components/BottomSheet";
import { IaiAvatar, ProgressBar, Wordmark } from "../../components/Iai";
import { Screen } from "../../components/Screen";
import { HeaderIcon, ScreenHeader } from "../../components/ScreenHeader";
import { Squish } from "../../components/Squish";
import { useToast } from "../../components/Toast";
import { brl } from "../../data/money";
import { LESSONS, MODULES, NEXT_TRAILS } from "../../data/trilha";
import { useTrilha, type Mission } from "../../state/TrilhaContext";

export function MissionRow({ m, onClaim }: { m: Mission; onClaim: () => void }) {
  return (
    <div className="border-b border-[#EEE] py-[14px] last:border-0">
      <div className="flex items-start gap-3">
        <div className={`mt-[2px] flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${m.claimed ? "bg-[#1B7F3B]" : "bg-[#FFF1E5]"}`}>
          {m.claimed ? <Check size={16} color="white" /> : <Target size={16} color="#FF6200" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[15px] font-semibold text-[#333]">{m.title}</span>
            <span className="shrink-0 text-[13px] font-semibold text-itau-orange">+{m.points} pts</span>
          </div>
          <div className="text-[13px] leading-snug text-[#666]">{m.text}</div>
          {!m.claimed && (
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar pct={(m.progress / m.goal) * 100} className="flex-1" />
              <span className="text-[12px] text-[#666]">
                {m.progress}/{m.goal} {m.unit}
              </span>
            </div>
          )}
          {m.met && !m.claimed && (
            <Squish onClick={onClaim} className="mt-2 rounded-full bg-itau-orange px-4 py-[6px] text-[14px] font-semibold text-white" scale={0.94}>
              Pegar pontos
            </Squish>
          )}
        </div>
      </div>
    </div>
  );
}

function DemoSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTrilha();
  const toast = useToast();
  const actions = [
    { label: "Avançar 1 dia (sequência)", run: () => (t.set((s) => ({ streak: s.streak + 1 })), toast("+1 dia de sequência")) },
    {
      label: "Resetar protótipo",
      run: () => {
        t.reset();
        toast("Protótipo zerado");
        onClose();
      },
    },
  ];
  return (
    <BottomSheet open={open} onClose={onClose} title="Controles do protótipo">
      <p className="-mt-2 mb-3 text-[14px] text-[#666]">Só pra demo: simula o tempo passando. Minhas Vantagens e produtos são simulados.</p>
      <div className="flex flex-col gap-2">
        {actions.map((a) => (
          <Squish key={a.label} onClick={a.run} className="w-full rounded-[12px] bg-itau-chip px-4 py-[13px] text-[16px] font-semibold text-[#333]" scale={0.97}>
            {a.label}
          </Squish>
        ))}
      </div>
    </BottomSheet>
  );
}

export function Hub() {
  const navigate = useNavigate();
  const t = useTrilha();
  const toast = useToast();
  const [demo, setDemo] = useState(false);
  const done = !t.next;
  return (
    <Screen
      bg="bg-itau-bg"
      statusBg="bg-itau-navy"
      statusTone="light"
      header={
        <div className="bg-itau-navy [&_svg]:!stroke-white">
          <ScreenHeader
            right={
              <HeaderIcon label="Controles do protótipo" onClick={() => setDemo(true)}>
                <Settings2 size={22} color="white" />
              </HeaderIcon>
            }
          />
        </div>
      }
    >
      <div className="bg-itau-navy px-5 pb-6 text-white">
        <div className="flex items-center gap-3">
          <IaiAvatar size={44} />
          <div>
            <Wordmark className="text-[26px]" />
            <div className="text-[14px] text-white/75">12 lições de 60 s · educação financeira sem juridiquês</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            { v: `Nível ${t.level}`, l: "Minhas Vantagens" },
            { v: `${t.points}`, l: "pontos" },
            { v: `${t.completed.length}/${LESSONS.length}`, l: "lições" },
          ].map((x) => (
            <div key={x.l} className="rounded-[12px] bg-white/10 py-2">
              <div className="text-[18px] font-bold">{x.v}</div>
              <div className="text-[12px] text-white/70">{x.l}</div>
            </div>
          ))}
        </div>
        <ProgressBar pct={t.levelPct} tone="white" className="mt-4" />
        <div className="mt-1 text-right text-[12px] text-white/70">{t.nextLevelAt ? `${t.nextLevelAt - t.points} pts pro Nível ${t.level + 1}` : "Nível máximo"}</div>
        {!done && t.next && (
          <Squish
            onClick={() => navigate(`/academia/licao/${t.next!.id}`)}
            className="mt-4 flex w-full items-center gap-3 rounded-[14px] bg-itau-orange px-4 py-3"
            scale={0.97}
          >
            <div className="flex-1">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-white/85">
                Próxima · {t.next.id} · +{t.next.points} pts
              </div>
              <div className="text-[17px] font-semibold leading-tight">{t.next.title}</div>
            </div>
            <ChevronRight />
          </Squish>
        )}
        {!t.diag.done && (
          <Squish onClick={() => navigate("/academia/diagnostico")} className="mt-3 text-[14px] font-semibold text-[#FF8A3D]" scale={0.95}>
            Responder 3 perguntas rápidas pra personalizar →
          </Squish>
        )}
      </div>

      <div className="flex flex-col gap-4 px-5 py-5">
        {done && (
          <div className="rounded-[18px] bg-white p-5">
            <h2 className="text-[18px] font-bold text-black">E agora? Você escolhe.</h2>
            <p className="mt-1 text-[14px] text-[#666]">
              {t.goal ? `Seu objetivo "${t.goal.name}" (${brl(t.goal.targetCents, false)}) continua de pé.` : "Trilha concluída."} Qual é a próxima trilha?
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {NEXT_TRAILS.map((n) => (
                <Squish
                  key={n.id}
                  onClick={() => (t.set({ nextTrail: n.id }), toast("Próxima trilha escolhida"))}
                  className={`w-full rounded-[12px] border-[1.5px] px-4 py-3 ${t.nextTrail === n.id ? "border-itau-orange bg-[#FFF1E5]" : "border-[#DDD]"}`}
                  scale={0.97}
                >
                  <div className="text-[16px] font-semibold text-[#333]">{n.title}</div>
                  <div className="text-[13px] text-[#666]">{n.text}</div>
                </Squish>
              ))}
            </div>
          </div>
        )}

        {MODULES.map((mod) => {
          const lessons = LESSONS.filter((l) => l.module === mod.n);
          const doneCount = lessons.filter((l) => t.completed.includes(l.id)).length;
          return (
            <div key={mod.n} className="rounded-[18px] bg-white px-5 pb-2 pt-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[17px] font-bold text-black">
                  Módulo {mod.n} · {mod.name}
                </h2>
                <span className="text-[13px] text-[#777]">
                  {doneCount}/{lessons.length}
                </span>
              </div>
              <div className="text-[13px] text-[#777]">
                {mod.tagline}
              </div>
              <div className="mt-2">
                {lessons.map((l) => {
                  const isDone = t.completed.includes(l.id);
                  const open = t.isUnlocked(l.id);
                  return (
                    <Squish
                      key={l.id}
                      onClick={() =>
                        open
                          ? navigate(`/academia/licao/${l.id}`)
                          : toast("Libera depois da lição anterior do módulo")
                      }
                      className="flex w-full items-center gap-3 border-t border-[#EEE] py-[12px]"
                      scale={0.98}
                    >
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                          isDone ? "bg-[#1B7F3B] text-white" : open ? "bg-itau-orange text-white" : "bg-[#F0F1F3] text-[#999]"
                        }`}
                      >
                        {isDone ? <Check size={16} /> : open ? l.id : <Lock size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-[15px] font-semibold leading-tight ${open || isDone ? "text-[#333]" : "text-[#999]"}`}>{l.title}</div>
                        <div className="text-[13px] text-[#777]">
                          {l.hook}
                        </div>
                      </div>
                      <div className="shrink-0 text-right text-[12px]">
                        <div className={`font-semibold ${isDone ? "text-[#1B7F3B]" : "text-itau-orange"}`}>+{l.points}</div>
                      </div>
                    </Squish>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="rounded-[18px] bg-white px-5 pb-2 pt-4">
          <h2 className="text-[17px] font-bold text-black">Missões</h2>
          <div className="text-[13px] text-[#777]">Hábito conta mais que lição.</div>
          {t.missions.map((m) => (
            <MissionRow key={m.id} m={m} onClaim={() => (t.claim(m.id), toast(`+${m.points} pts`))} />
          ))}
        </div>

        <Squish onClick={() => navigate("/pra-voce", { replace: true, state: { tab: true } })} className="flex w-full items-center gap-3 rounded-[18px] bg-white p-5" scale={0.98}>
          <Gift color="#FF6200" />
          <div className="flex-1">
            <div className="text-[16px] font-semibold text-[#333]">Ver recompensas no Minhas Vantagens</div>
            <div className="text-[13px] text-[#777]">Pontos não expiram e não viram dinheiro.</div>
          </div>
          <ChevronRight color="#444" />
        </Squish>

        <p className="px-2 pb-4 text-center text-[12px] leading-snug text-[#888]">
          Protótipo: textos da Ia.i por template, valores de exemplo e Minhas Vantagens simulado. Conteúdo educacional, não é recomendação.
        </p>
      </div>
      <DemoSheet open={demo} onClose={() => setDemo(false)} />
    </Screen>
  );
}
