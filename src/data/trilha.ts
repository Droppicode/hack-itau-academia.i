import { UNIT_BANK } from "./units";
import type { DeepCard, QuizQ, Step, UnitDef } from "./units/types";

export type { DeepCard, QuizQ, Step, UnitDef };
export type LessonId = string;
export type UnitId = string;
export type UnitDeep = DeepCard;

export type Lesson = {
  id: LessonId;
  unit: UnitId;
  title: string;
  learn: string;
  steps: Step[];
  deep: DeepCard[];
  quiz: QuizQ[];
};

export const UNITS: UnitDef[] = UNIT_BANK;
export const unitDef = (id: UnitId) => UNITS.find((u) => u.id === id);

export const LESSONS: Lesson[] = UNITS.flatMap((u) =>
  u.lessons.map((l, i) => ({ id: l.id ?? `${u.id}-${i + 1}`, unit: u.id, title: l.title, learn: l.learn, steps: l.steps, deep: l.deep, quiz: l.quiz })),
);
export const lessonsOf = (unit: UnitId) => LESSONS.filter((l) => l.unit === unit);
export const findLesson = (id: string) => LESSONS.find((l) => l.id.toLowerCase() === id.toLowerCase());

export const UNIT_POINTS_PER_RIGHT = 20;
export const unitQuiz = (unit: UnitId): QuizQ[] => lessonsOf(unit).map((l) => l.quiz[1] ?? l.quiz[0]);
export const unitPass = (unit: UnitId) => Math.ceil(unitQuiz(unit).length * 0.7);
export const unitQuizPoints = (unit: UnitId, correct: number | undefined) =>
  correct !== undefined && correct >= unitPass(unit) ? Math.min(correct, unitQuiz(unit).length) * UNIT_POINTS_PER_RIGHT : 0;

export const STREAK_STEP = 0.05;
export const STREAK_MAX_WEEKS = 4;
export const multiplierFor = (streak: number) => Math.round((1 + STREAK_STEP * Math.min(streak, STREAK_MAX_WEEKS)) * 100) / 100;
export const fmtMult = (m: number) => `${m.toFixed(2).replace(/0$/, "").replace(".", ",")}x`;
export function streakOf(weeks: number[], week: number) {
  let w = weeks.includes(week) ? week : week - 1;
  let n = 0;
  while (weeks.includes(w)) [n, w] = [n + 1, w - 1];
  return n;
}

export const POINTS_EXPIRY_MONTHS = 6;
export const POINTS_EXPIRY_DAY = 25;

export type MissionKind = "semanal" | "mensal";
export type MissionDef = { id: string; kind: MissionKind; title: string; text: string; points: number; unlockAfter: number };

export const MISSIONS: MissionDef[] = [
  { id: "w-licoes", kind: "semanal", title: "2 lições na semana", text: "Faça 2 lições da trilha até domingo", points: 30, unlockAfter: 1 },
  { id: "w-aprofundar", kind: "semanal", title: "Ir além em 1 lição", text: "Leia o aprofundamento de qualquer lição nesta semana", points: 30, unlockAfter: 1 },
  {
    id: "m-mes",
    kind: "mensal",
    title: "Guardar e deixar lá o mês todo",
    text: "No fechamento do mês, você ganha 1 Ponto Itaú a cada R$ 20 que ficaram no cofrinho o mês inteiro (a partir de R$ 50, até 50 pontos). Tirou no meio do mês, conta o menor saldo.",
    points: 50,
    unlockAfter: 3,
  },
];

export const MONTHLY_PTS = { perCents: 2000, minCents: 5000, cap: 50 };
export const monthlyPoints = (heldCents: number) =>
  heldCents < MONTHLY_PTS.minCents ? 0 : Math.min(MONTHLY_PTS.cap, Math.floor(heldCents / MONTHLY_PTS.perCents));

export const SALARY_CENTS = 132000;
export const SALARY_FROM = "Empresa Exemplo Ltda";
export const SALARY_DAY = 5;
export const MONTH_DAYS = 30;
export const monthOfDay = (day: number) => Math.floor((day - 1) / MONTH_DAYS) + 1;
export const expiryDayFor = (earnedDay: number) => (monthOfDay(earnedDay) + POINTS_EXPIRY_MONTHS - 1) * MONTH_DAYS + POINTS_EXPIRY_DAY;
export const simDate = (day: number) => new Date(2026, 9 + Math.floor((day - 1) / MONTH_DAYS), ((day - 1) % MONTH_DAYS) + 1);
export const fmtDay = (day: number) => simDate(day).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
export const fmtMonth = (month: number) => {
  const s = simDate((month - 1) * MONTH_DAYS + 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export type GoalDef = { id: string; label: string; cents: number; from: string; to: string; line: string };

export const GOALS: GoalDef[] = [
  { id: "celular", label: "Celular novo", cents: 180000, from: "#1F2A63", to: "#3A4FB8", line: "Trocar de celular sem parcelar no cartão." },
  { id: "viagem", label: "Viagem com a galera", cents: 150000, from: "#0B6E99", to: "#19A7B8", line: "Passagem, hospedagem e role garantidos." },
  { id: "festival", label: "Show ou festival", cents: 80000, from: "#6B3FA0", to: "#C2459B", line: "Ingresso comprado no 1º lote, sem aperto." },
  { id: "notebook", label: "Notebook pra estudar", cents: 350000, from: "#243447", to: "#4B6584", line: "Ferramenta de trabalho e estudo." },
  { id: "curso", label: "Curso ou faculdade", cents: 240000, from: "#00574F", to: "#00857A", line: "Investir em você mesmo." },
  { id: "moto", label: "Moto ou carro", cents: 900000, from: "#7A2E0E", to: "#C4501B", line: "Entrada de um veículo sem juros altos." },
  { id: "casa", label: "Sair de casa", cents: 500000, from: "#8A4B00", to: "#EC7000", line: "Caução, mudança e primeiros móveis." },
  { id: "reserva", label: "Reserva de emergência", cents: 300000, from: "#1B5E20", to: "#43A047", line: "Um colchão pra imprevistos." },
];
export type GoalId = string;

export const CATCHPHRASES = [
  "5 minutos por lição. Zero juridiquês.",
  "Aprende o vocabulário do dinheiro e vê seu objetivo enchendo.",
  "Guardou e deixou lá o mês todo? Vira Pontos Itaú.",
  "Desafio no fim da unidade vale Pontos Itaú.",
  "Holerite, FGTS, CDI: agora faz sentido.",
  "Use a conta toda semana e seus pontos valem até 1,2x.",
];

export const CATCHPHRASES_NEW = [
  "Primeiro salário? Descubra pra onde ele vai antes que ele suma.",
  "Holerite, FGTS, CDI… ninguém te explicou? A gente explica em 5 min.",
  "Aquele celular novo sem 12x no cartão: bora montar o plano?",
  "Escolha um objetivo e veja o cofrinho enchendo até 100%.",
  "Aprenda, cumpra missões e ganhe Pontos Itaú.",
  "Conta o que você já sabe e a IA.I monta uma trilha só sua.",
  "Sem sermão e sem juridiquês. Só o que você usa no dia a dia.",
];

export const CDI_YEAR = 0.105;

export const POINT_BRL = 0.02;

export const MV_LEVELS = [0, 4, 12, 24, 44];

export type PassoCat = "aprender" | "pagar" | "cartao" | "guardar" | "proteger" | "economizar";
export const PASSO_CATS: { id: PassoCat; title: string; max: number }[] = [
  { id: "aprender", title: "Aprender com a AcademIA.I", max: 3 },
  { id: "pagar", title: "Pagar e receber", max: 9 },
  { id: "cartao", title: "Usar cartão", max: 13 },
  { id: "guardar", title: "Guardar dinheiro e ter rendimento", max: 6 },
  { id: "proteger", title: "Proteger seu dinheiro e seus bens", max: 4 },
  { id: "economizar", title: "Economizar", max: 1 },
];

export const MV_BENEFITS: { level: number; items: { title: string; detail: string }[] }[] = [
  { level: 1, items: [
    { title: "Até 70% de desconto em farmácias e exames", detail: "Rede parceira" },
    { title: "Cashback em mais de 150 lojas parceiras", detail: "Em Pontos Itaú, pelo Itaú Shop" },
  ] },
  { level: 2, items: [
    { title: "R$ 10 de desconto + frete grátis no Appgas", detail: "Parceiro" },
    { title: "Desconto em instituições de ensino", detail: "Parceiros de educação" },
    { title: "1 viagem grátis com Bike Itaú", detail: "Por mês" },
  ] },
  { level: 3, items: [
    { title: "R$ 10 de desconto no Itaú Shop", detail: "Cupom mensal" },
    { title: "25% de desconto em viagens de ônibus", detail: "Parceiro" },
    { title: "Até 60% de desconto em cinema", detail: "Rede parceira" },
  ] },
  { level: 4, items: [
    { title: "R$ 10 de desconto na Uber", detail: "Cupom mensal" },
    { title: "R$ 25 de desconto no Itaú Shop", detail: "Cupom mensal" },
  ] },
  { level: 5, items: [
    { title: "R$ 20 de desconto na Uber", detail: "Cupom mensal" },
    { title: "R$ 20 de desconto no Assaí", detail: "Cupom mensal" },
    { title: "R$ 40 de desconto no Itaú Shop", detail: "Cupom mensal" },
  ] },
];
