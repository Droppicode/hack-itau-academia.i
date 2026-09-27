import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CDI_YEAR,
  LESSONS,
  MONTH_DAYS,
  monthlyPoints,
  SALARY_CENTS,
  SALARY_DAY,
  SALARY_FROM,
  MISSIONS,
  MV_LEVELS,
  PASSO_CATS,
  UNIT_QUIZ_PASS,
  unitQuizPoints,
  type GoalId,
  type Lesson,
  type LessonId,
  type MissionDef,
  type PassoCat,
  PLAYABLE,
  type UnitN,
} from "../data/trilha";

export type Goal = { id: GoalId; name: string; targetCents: number; monthlyCents: number; savedCents: number; yieldCents: number; history: number[] };

export type TxnKind = "salario" | "cofrinho" | "resgate" | "pix" | "compra";
export type Txn = { id: number; day: number; kind: TxnKind; title: string; sub: string; cents: number };
export type MonthAward = { month: number; heldCents: number; pts: number };

export type Persisted = {
  introSeen: boolean;
  completed: LessonId[];
  deepSeen: LessonId[];
  unitBest: Partial<Record<UnitN, number>>;
  unitDeepSeen: UnitN[];
  claimed: string[];
  week: number;
  month: number;
  weekLessons: number;
  weekDeep: number;
  day: number;
  txns: Txn[];
  salaryMonth: number;
  monthMinCents: number;
  awards: MonthAward[];
  streak: number;
  lastActiveWeek: number;
  goal?: Goal;
  cofrinhoWarned: boolean;
  pixDone: boolean;
  hook: { pending: boolean; pushSeen: boolean; off: boolean };
};

const INITIAL: Persisted = {
  introSeen: false,
  completed: [],
  deepSeen: [],
  unitBest: {},
  unitDeepSeen: [],
  claimed: [],
  week: 1,
  month: 1,
  weekLessons: 0,
  weekDeep: 0,
  day: SALARY_DAY,
  txns: [{ id: 1, day: SALARY_DAY, kind: "salario", title: "Salário", sub: SALARY_FROM, cents: SALARY_CENTS }],
  salaryMonth: 1,
  monthMinCents: 0,
  awards: [],
  streak: 0,
  lastActiveWeek: 0,
  cofrinhoWarned: false,
  pixDone: false,
  hook: { pending: false, pushSeen: false, off: false },
};

const KEY = "academiai-v6";

export type MissionStatus = "bloqueada" | "disponível" | "em andamento" | "concluída" | "resgatada";
export type MissionView = MissionDef & { status: MissionStatus; progress: number; goal: number; key: string };
export type Passo = { id: string; cat: PassoCat; title: string; done: boolean; academia?: boolean };

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...INITIAL, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    /* ignore */
  }
  return INITIAL;
}

const BASE_PASSOS: Omit<Passo, "done">[] = [
  { id: "p-chave", cat: "pagar", title: "Cadastrar uma chave Pix" },
  { id: "p-pix", cat: "pagar", title: "Fazer um Pix pelo app" },
  { id: "p-receber", cat: "pagar", title: "Receber um Pix no mês" },
  { id: "p-conta", cat: "pagar", title: "Pagar uma conta pelo app" },
  { id: "c-debito", cat: "cartao", title: "Pagar uma compra no débito" },
  { id: "c-virtual", cat: "cartao", title: "Gerar cartão virtual" },
  { id: "g-cofrinho", cat: "guardar", title: "Guardar dinheiro no Cofrinho" },
  { id: "g-100", cat: "guardar", title: "Manter R$ 100 guardados" },
  { id: "g-invest", cat: "guardar", title: "Fazer um investimento" },
  { id: "s-itoken", cat: "proteger", title: "Ativar o iToken no app" },
  { id: "s-seguro", cat: "proteger", title: "Proteger o celular" },
  { id: "e-shop", cat: "economizar", title: "Comprar no Itaú Shop" },
  { id: "a-u1", cat: "aprender", title: "Concluir a Unidade 1 da academIA.I", academia: true },
  { id: "a-desafio", cat: "aprender", title: "Passar no desafio da Unidade 1", academia: true },
  { id: "a-missao", cat: "aprender", title: "Cumprir a missão do mês", academia: true },
];

type Ctx = Persisted & {
  set: (p: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) => void;
  done: (id: LessonId) => boolean;
  unlocked: (id: LessonId) => boolean;
  unitDone: (u: UnitN) => boolean;
  unitPassed: (u: UnitN) => boolean;
  next?: Lesson;
  points: number;
  missionPoints: number;
  quizPoints: number;
  passos: Passo[];
  passosDone: number;
  mvLevel: number;
  mvNextAt?: number;
  goalPct: number;
  rate: number;
  balanceCents: number;
  monthPtsPreview: number;
  awardPoints: number;
  missions: MissionView[];
  completeLesson: (id: LessonId) => void;
  markDeep: (id: LessonId) => void;
  recordUnitQuiz: (u: UnitN, correct: number) => number;
  claim: (m: MissionView) => void;
  setGoal: (g: Pick<Goal, "id" | "name" | "targetCents" | "monthlyCents">) => void;
  save: (cents: number) => void;
  spend: (cents: number, where: string) => void;
  withdraw: (cents: number) => void;
  advanceWeek: () => void;
  advanceMonth: () => void;
  registerPix: (own: boolean, cents: number, to: string) => void;
  reset: () => void;
};

const TrilhaContext = createContext<Ctx | null>(null);

export function TrilhaProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(load);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
  }, [s]);

  const set = useCallback<Ctx["set"]>((p) => setS((prev) => ({ ...prev, ...(typeof p === "function" ? p(prev) : p) })), []);

  const value = useMemo<Ctx>(() => {
    const done = (id: LessonId) => s.completed.includes(id);
    const idx = (id: LessonId) => PLAYABLE.findIndex((l) => l.id === id);
    const unlocked = (id: LessonId) => idx(id) === 0 || (idx(id) > 0 && done(PLAYABLE[idx(id) - 1].id));
    const next = PLAYABLE.find((l) => !done(l.id));
    const unitDone = (u: UnitN) => {
      const ls = LESSONS.filter((l) => l.unit === u);
      return ls.length > 0 && ls.every((l) => !l.soon && done(l.id));
    };
    const unitPassed = (u: UnitN) => (s.unitBest[u] ?? 0) >= UNIT_QUIZ_PASS;

    const awardPoints = s.awards.reduce((a, w) => a + w.pts, 0);
    const missionPoints = s.claimed.reduce((a, k) => a + (MISSIONS.find((m) => m.id === k.split("@")[0])?.points ?? 0), 0) + awardPoints;
    const balanceCents = s.txns.reduce((a, x) => a + x.cents, 0);
    const monthPtsPreview = s.goal ? monthlyPoints(s.monthMinCents) : 0;
    const quizPoints = ([1, 2, 3, 4] as UnitN[]).reduce((a, u) => a + unitQuizPoints(u, s.unitBest[u]), 0);
    const points = missionPoints + quizPoints;

    const saved = s.goal?.savedCents ?? 0;
    const flags: Record<string, boolean> = {
      "p-chave": true,
      "p-pix": s.pixDone,
      "g-cofrinho": saved > 0,
      "g-100": saved >= 10000,
      "a-u1": unitDone(1),
      "a-desafio": unitPassed(1),
      "a-missao": s.awards.some((w) => w.pts > 0),
    };
    const passos: Passo[] = BASE_PASSOS.map((p) => ({ ...p, done: !!flags[p.id] }));
    const passosDone = passos.filter((p) => p.done).length;
    const mvLevel = MV_LEVELS.filter((v) => passosDone >= v).length;
    const mvNextAt = MV_LEVELS[mvLevel];
    const goalPct = s.goal ? Math.min((s.goal.savedCents / s.goal.targetCents) * 100, 100) : 0;
    const rate = CDI_YEAR;

    const missions: MissionView[] = MISSIONS.map((m) => {
      const key = m.kind === "semanal" ? `${m.id}@w${s.week}` : `${m.id}@m${s.month}`;
      let progress = 0;
      let goal = 1;
      if (m.id === "w-licoes") [progress, goal] = [Math.min(s.weekLessons, 2), 2];
      else if (m.id === "w-aprofundar") progress = s.weekDeep > 0 ? 1 : 0;
      else if (m.id === "m-mes") [progress, goal] = [monthPtsPreview, m.points];
      const status: MissionStatus = !done(m.unlock)
        ? "bloqueada"
        : s.claimed.includes(key)
          ? "resgatada"
          : progress >= goal && m.kind === "semanal"
            ? "concluída"
            : progress > 0
              ? "em andamento"
              : "disponível";
      return { ...m, key, progress, goal, status };
    });

    const addTxn = (p: Persisted, kind: TxnKind, title: string, sub: string, cents: number): Txn[] => [
      ...p.txns,
      { id: (p.txns[p.txns.length - 1]?.id ?? 0) + 1, day: p.day, kind, title, sub, cents },
    ];
    const setSaved = (p: Persisted, savedCents: number): Goal | undefined =>
      p.goal ? { ...p.goal, savedCents, history: [...p.goal.history, savedCents] } : p.goal;

    const advance = (p: Persisted, days: number): Persisted => {
      const end = p.day + days;
      let q = { ...p };
      const paySalary = () => {
        const d = (q.month - 1) * MONTH_DAYS + SALARY_DAY;
        if (q.salaryMonth < q.month && end >= d)
          q = { ...q, salaryMonth: q.month, txns: [...q.txns, { id: (q.txns[q.txns.length - 1]?.id ?? 0) + 1, day: d, kind: "salario", title: "Salário", sub: SALARY_FROM, cents: SALARY_CENTS }] };
      };
      while (end > q.month * MONTH_DAYS) {
        const unlockedMonthly = q.completed.includes("L8");
        const held = q.goal ? q.monthMinCents : 0;
        const awards = unlockedMonthly && q.goal ? [...q.awards, { month: q.month, heldCents: held, pts: monthlyPoints(held) }] : q.awards;
        const g = q.goal
          ? (() => {
              const y = Math.round(q.goal.savedCents * (Math.pow(1 + CDI_YEAR, 1 / 12) - 1));
              return { ...q.goal, savedCents: q.goal.savedCents + y, yieldCents: q.goal.yieldCents + y, history: [...q.goal.history, q.goal.savedCents + y] };
            })()
          : q.goal;
        q = { ...q, month: q.month + 1, awards, goal: g, monthMinCents: g?.savedCents ?? 0 };
        paySalary();
      }
      paySalary();
      const week = Math.floor((end - 1) / 7) + 1;
      return { ...q, day: end, week, ...(week !== p.week ? { weekLessons: 0, weekDeep: 0 } : {}) };
    };

    return {
      ...s,
      set,
      balanceCents,
      monthPtsPreview,
      awardPoints,
      done,
      unlocked,
      unitDone,
      unitPassed,
      next,
      points,
      missionPoints,
      quizPoints,
      passos,
      passosDone,
      mvLevel,
      mvNextAt,
      goalPct,
      rate,
      missions,
      completeLesson: (id) =>
        set((p) => {
          const streak = p.lastActiveWeek === p.week ? p.streak : p.lastActiveWeek === p.week - 1 ? p.streak + 1 : 1;
          return {
            completed: p.completed.includes(id) ? p.completed : [...p.completed, id],
            weekLessons: p.weekLessons + 1,
            streak,
            lastActiveWeek: p.week,
          };
        }),
      markDeep: (id) => set((p) => ({ deepSeen: p.deepSeen.includes(id) ? p.deepSeen : [...p.deepSeen, id], weekDeep: p.weekDeep + 1 })),
      recordUnitQuiz: (u, correct) => {
        const before = unitQuizPoints(u, s.unitBest[u]);
        const best = Math.max(correct, s.unitBest[u] ?? 0);
        set((p) => ({
          unitBest: { ...p.unitBest, [u]: Math.max(correct, p.unitBest[u] ?? 0) },
          unitDeepSeen: p.unitDeepSeen.includes(u) ? p.unitDeepSeen : [...p.unitDeepSeen, u],
        }));
        return unitQuizPoints(u, best) - before;
      },
      claim: (m) => set((p) => ({ claimed: [...p.claimed, m.key] })),
      setGoal: (g) =>
        set((p) => ({
          goal: p.goal ? { ...p.goal, ...g } : { ...g, savedCents: 0, yieldCents: 0, history: [0] },
        })),
      save: (cents) =>
        set((p) => {
          const bal = p.txns.reduce((a, x) => a + x.cents, 0);
          if (!p.goal || cents <= 0 || cents > bal) return {};
          return { goal: setSaved(p, p.goal.savedCents + cents), txns: addTxn(p, "cofrinho", "Aplicação Cofrinho", p.goal.name, -cents) };
        }),
      withdraw: (cents) =>
        set((p) => {
          const amt = Math.min(cents, p.goal?.savedCents ?? 0);
          if (!p.goal || amt <= 0) return {};
          const left = p.goal.savedCents - amt;
          return { goal: setSaved(p, left), monthMinCents: Math.min(p.monthMinCents, left), txns: addTxn(p, "resgate", "Resgate Cofrinho", p.goal.name, amt) };
        }),
      spend: (cents, where) =>
        set((p) => (cents > p.txns.reduce((a, x) => a + x.cents, 0) ? {} : { txns: addTxn(p, "compra", "Compra no débito", where, -cents) })),
      advanceWeek: () => set((p) => advance(p, 7)),
      advanceMonth: () => set((p) => advance(p, MONTH_DAYS)),
      registerPix: (own, cents, to) =>
        set((p) => ({
          pixDone: true,
          txns: addTxn(p, "pix", "Pix enviado", to, -cents),
          hook: own && !p.hook.off ? { ...p.hook, pending: true, pushSeen: false } : p.hook,
        })),
      reset: () => setS(INITIAL),
    };
  }, [s, set]);

  return <TrilhaContext.Provider value={value}>{children}</TrilhaContext.Provider>;
}

export function useTrilha() {
  const ctx = useContext(TrilhaContext);
  if (!ctx) throw new Error("useTrilha must be used inside TrilhaProvider");
  return ctx;
}

export const PASSO_TITLES = PASSO_CATS;
