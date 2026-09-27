import { GOALS, UNITS, unitDef, type UnitId } from "./trilha";

export type KnowledgeId = "zero" | "investimentos" | "habitos" | "ia";

export const KNOWLEDGE: { id: KnowledgeId; label: string; sub: string }[] = [
  { id: "zero", label: "Começar do zero", sub: "Quero entender o básico do dinheiro" },
  { id: "investimentos", label: "Não entendo de investimentos", sub: "O dia a dia eu sei, falta fazer o dinheiro render" },
  { id: "habitos", label: "Quero criar melhores hábitos", sub: "Organizar o mês e fugir do vermelho" },
  { id: "ia", label: "Contar minha situação pra IA.I", sub: "Escreva do seu jeito e a IA.I monta a trilha" },
];

export type Profile = { knowledge?: KnowledgeId; text?: string };
export type TrailUnit = { id: UnitId; why: string };
export type Trail = { n: number; title: string; intro: string; units: TrailUnit[]; ideas: string[]; source: "ia" | "local"; wish?: string };

const BASE: Record<Exclude<KnowledgeId, "ia"> | "default", UnitId[]> = {
  zero: ["primeiros-passos", "organizar-mes", "golpes-e-seguranca", "reserva-emergencia"],
  investimentos: ["reserva-emergencia", "renda-fixa", "cdb-na-pratica", "primeiros-investimentos"],
  habitos: ["organizar-mes", "cartao-sem-susto", "juros-e-dividas", "reserva-emergencia"],
  default: ["primeiros-passos", "organizar-mes", "reserva-emergencia", "renda-fixa"],
};

const TITLES: Record<Exclude<KnowledgeId, "ia"> | "default", string> = {
  zero: "Do zero ao primeiro cofrinho",
  investimentos: "Investir sem medo",
  habitos: "Hábitos que ficam",
  default: "Sua primeira trilha",
};

const GOAL_UNIT: Record<string, UnitId> = {
  moto: "grandes-objetivos",
  casa: "grandes-objetivos",
  viagem: "organizar-mes",
  festival: "organizar-mes",
  curso: "trabalho-e-renda",
  notebook: "trabalho-e-renda",
  reserva: "reserva-emergencia",
  celular: "cartao-sem-susto",
};

const KEYWORDS: [RegExp, UnitId][] = [
  [/\bcdb\b/i, "cdb-na-pratica"],
  [/tesouro|renda fixa|poupan|lci|lca/i, "renda-fixa"],
  [/invest|a[çc][õo]es|bolsa|fundo/i, "primeiros-investimentos"],
  [/d[íi]vida|devendo|nome sujo|serasa|score|juros|negativ/i, "juros-e-dividas"],
  [/cart[ãa]o|fatura|parcel/i, "cartao-sem-susto"],
  [/golpe|fraude|seguran/i, "golpes-e-seguranca"],
  [/selic|banco central|open finance|portabilidade|\bcdi\b|entre bancos|infla/i, "bancos-e-sistema"],
  [/freela|\bmei\b|imposto|renda extra|sal[áa]rio maior|carreira/i, "trabalho-e-renda"],
  [/carro|moto|casa|apartamento|morar|financiamento|cons[óo]rcio/i, "grandes-objetivos"],
  [/reserva|emerg[êe]ncia|imprevisto/i, "reserva-emergencia"],
  [/or[çc]amento|organizar|gasto|controlar|sobra/i, "organizar-mes"],
  [/holerite|fgts|b[áa]sico|nada|zero|primeiro sal/i, "primeiros-passos"],
];

export const knowledgeLabel = (k?: KnowledgeId) => KNOWLEDGE.find((x) => x.id === k)?.label;

export function localTrail(profile: Profile, goalId: string | undefined, doneUnits: UnitId[], n = 1, wish?: string): Trail {
  const goal = GOALS.find((g) => g.id === goalId);
  const text = `${profile.text ?? ""} ${wish ?? ""}`;
  const picked: TrailUnit[] = [];
  const add = (id: UnitId | undefined, why: string) => {
    if (id && unitDef(id) && !picked.some((p) => p.id === id)) picked.push({ id, why });
  };
  for (const [re, id] of KEYWORDS) if (re.test(text)) add(id, wish ? "Você pediu pra aprender sobre isso" : "Pelo que você contou da sua situação");
  const k = profile.knowledge && profile.knowledge !== "ia" ? profile.knowledge : "default";
  const base = BASE[k].map((id) => ({ id, why: k === "default" ? "Base pra qualquer objetivo" : `Pra quem escolheu "${knowledgeLabel(profile.knowledge)}"` }));
  const goalUnit = goal && GOAL_UNIT[goal.id];
  base.slice(0, 1).forEach((u) => add(u.id, u.why));
  add(goalUnit, `Ajuda direto no objetivo: ${goal?.label.toLowerCase()}`);
  base.slice(1).forEach((u) => add(u.id, u.why));
  let units = picked.filter((u) => !doneUnits.includes(u.id));
  if (units.length < 3) units = [...units, ...UNITS.filter((u) => !doneUnits.includes(u.id) && !units.some((x) => x.id === u.id)).map((u) => ({ id: u.id, why: "Próximo passo natural" }))];
  units = units.slice(0, 4);
  if (!units.length) units = picked.slice(0, 3);
  const title = wish ? "Sua próxima trilha" : profile.text ? "Trilha sob medida" : TITLES[k];
  return {
    n,
    title,
    intro: goal ? `Montada pra você chegar em "${goal.label}" entendendo o que importa no caminho.` : "Montada a partir do que você contou.",
    units,
    ideas: suggestIdeas(units.map((u) => u.id), doneUnits),
    source: "local",
    wish,
  };
}

export function suggestIdeas(current: UnitId[], done: UnitId[]) {
  return UNITS.filter((u) => !current.includes(u.id) && !done.includes(u.id))
    .slice(0, 3)
    .map((u) => u.name);
}

export function parseTrail(raw: string, doneUnits: UnitId[], n: number, wish?: string): Trail | undefined {
  try {
    const j = JSON.parse(raw.replace(/^```(?:json)?|```$/g, "").trim()) as { title?: unknown; intro?: unknown; units?: unknown; ideas?: unknown };
    const units: TrailUnit[] = [];
    if (Array.isArray(j.units))
      for (const u of j.units as { id?: unknown; why?: unknown }[]) {
        const id = String(u?.id ?? "");
        if (unitDef(id) && !units.some((x) => x.id === id)) units.push({ id, why: String(u?.why ?? "").slice(0, 110) });
      }
    if (units.length < 2) return;
    const ideas = Array.isArray(j.ideas) ? (j.ideas as unknown[]).map((x) => String(x).slice(0, 48)).filter(Boolean).slice(0, 3) : [];
    return {
      n,
      title: String(j.title ?? "Sua trilha").slice(0, 40),
      intro: String(j.intro ?? "").slice(0, 260),
      units: units.slice(0, 5),
      ideas: ideas.length ? ideas : suggestIdeas(units.map((u) => u.id), doneUnits),
      source: "ia",
      wish,
    };
  } catch {
    return;
  }
}

export const catalogForAi = () =>
  UNITS.map((u) => ({ id: u.id, name: u.name, tagline: u.tagline, level: u.level, tags: u.tags, lessons: u.lessons.map((l) => l.title) }));

export async function requestTrail(args: {
  profile: Profile;
  goalId?: string;
  doneUnits: UnitId[];
  currentUnits: UnitId[];
  context: string;
  n: number;
  wish?: string;
}): Promise<Trail> {
  const { profile, goalId, doneUnits, currentUnits, context, n, wish } = args;
  const fallback = () => localTrail(profile, goalId, doneUnits, n, wish);
  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "trilha",
        context,
        trilha: {
          goal: GOALS.find((g) => g.id === goalId)?.label,
          knowledge: knowledgeLabel(profile.knowledge),
          situation: profile.text,
          wish,
          doneUnits,
          currentUnits,
          catalog: catalogForAi(),
        },
      }),
      signal: AbortSignal.timeout(25_000),
    });
    const data = (await r.json()) as { text?: string };
    return (r.ok && data.text && parseTrail(data.text, doneUnits, n, wish)) || fallback();
  } catch {
    return fallback();
  }
}
