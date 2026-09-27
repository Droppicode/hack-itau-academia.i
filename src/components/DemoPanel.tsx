import { FlaskConical } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PLAYABLE, type LessonId } from "../data/trilha";
import { useTrilha } from "../state/TrilhaContext";
import { BottomSheet } from "./BottomSheet";
import { goalDef } from "./Iai";
import { Squish } from "./Squish";
import { useToast } from "./Toast";

type Action = { l: string; run: () => void; off?: boolean };

export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const t = useTrilha();
  const toast = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const lessonMatch = pathname.match(/^\/academia\/licao\/([^/]+)/);
  const currentLesson = lessonMatch?.[1] as LessonId | undefined;

  const ensureGoal = () => {
    if (t.goal) return;
    const g = goalDef("celular");
    t.setGoal({ id: g.id, name: g.label, targetCents: g.cents, monthlyCents: 15000 });
    t.set({ introSeen: true });
  };

  const groups: { title: string; items: Action[] }[] = [
    {
      title: "Tempo",
      items: [
        { l: "Passar 1 semana", run: () => (t.advanceWeek(), toast("+1 semana: missões semanais reiniciadas")) },
        { l: "Passar 1 mês", run: () => (t.advanceMonth(), toast("+1 mês: aporte e rendimento aplicados")) },
      ],
    },
    {
      title: "Trilha",
      items: [
        { l: "Pular intro (objetivo: celular)", run: () => (ensureGoal(), navigate("/academia/trilha")), off: !!t.goal },
        ...(currentLesson ? [{ l: "Pular esta aula", run: () => (ensureGoal(), t.completeLesson(currentLesson), navigate("/academia/trilha", { replace: true })) }] : []),
        { l: t.next ? `Pular aula: ${t.next.title}` : "Pular próxima aula", run: () => t.next && (ensureGoal(), t.completeLesson(t.next.id), toast(`Aula "${t.next.title}" concluída`)), off: !t.next },
        { l: "Concluir Unidade 1", run: () => (ensureGoal(), PLAYABLE.forEach((l) => t.completeLesson(l.id)), toast("Unidade 1 concluída")), off: !t.next },
        { l: "Gabaritar desafio da Unidade 1", run: () => (ensureGoal(), PLAYABLE.forEach((l) => t.completeLesson(l.id)), t.recordUnitQuiz(1, 10), toast("Desafio 10/10: +200 Pontos Itaú")), off: t.unitBest[1] === 10 },
      ],
    },
    {
      title: "Dinheiro (simulado)",
      items: [
        { l: "Guardar R$ 50 no cofrinho", run: () => (ensureGoal(), t.save(5000), toast("R$ 50 guardados")) },
        { l: "Pagar contas do mês", run: () => (t.set({ billsPaid: true }), toast("Contas do mês em dia")), off: t.billsPaid },
        { l: "Pix pra própria conta (convite na Home)", run: () => (t.registerPix(true), navigate("/home")) },
      ],
    },
    {
      title: "Ir para",
      items: [
        { l: "Início", run: () => navigate("/home") },
        { l: "Trilha", run: () => navigate("/academia/trilha") },
        { l: "Missões", run: () => navigate("/academia/missoes") },
        { l: "Cofrinho", run: () => navigate("/cofrinhos", { state: { fromAcademia: true } }) },
        { l: "Pontos e Benefícios", run: () => navigate("/pra-voce") },
        { l: "Chat IA.I", run: () => navigate("/ia") },
      ],
    },
    {
      title: "Reset",
      items: [{ l: "Resetar academIA.I (começar do zero)", run: () => (t.reset(), navigate("/home"), toast("academIA.I resetada")) }],
    },
  ];

  if (pathname === "/") return null;

  return (
    <>
      <Squish
        aria-label="Controles de teste"
        onClick={() => setOpen(true)}
        className="absolute left-0 top-[46%] z-30 flex flex-col items-center gap-1 rounded-r-[10px] bg-[#14215A]/80 px-[5px] py-2 text-white"
        scale={0.94}
      >
        <FlaskConical size={14} />
        <span className="text-[10px] font-semibold [writing-mode:vertical-rl]">Teste</span>
      </Squish>
      <BottomSheet open={open} onClose={() => setOpen(false)} title="Controles de teste">
        <div className="no-scrollbar -mt-2 max-h-[62vh] overflow-y-auto pb-2">
          {groups.map((g) => (
            <div key={g.title} className="mt-3">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#888]">{g.title}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.items.map((a) => (
                  <Squish
                    key={a.l}
                    disabled={a.off}
                    onClick={() => {
                      a.run();
                      setOpen(false);
                    }}
                    className="rounded-full bg-[#F1F2F6] px-3 py-2 text-[13px] font-semibold text-[#14215A] disabled:opacity-35"
                    scale={0.95}
                  >
                    {a.l}
                  </Squish>
                ))}
              </div>
            </div>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
