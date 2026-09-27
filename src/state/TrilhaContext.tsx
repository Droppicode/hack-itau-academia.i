import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { localTrail, type Profile, type Trail } from "../data/personalizar";
import {
  CDI_YEAR,
  expiryDayFor,
  lessonsOf,
  MONTH_DAYS,
  monthlyPoints,
  multiplierFor,
  SALARY_CENTS,
  SALARY_DAY,
  SALARY_FROM,
  MISSIONS,
  MV_LEVELS,
  PASSO_CATS,
  streakOf,
  unitDef,
  unitPass,
  unitQuizPoints,
  UNITS,
  type GoalId,
  type Lesson,
  type LessonId,
  type MissionDef,
  type PassoCat,
  quarterOf,
  QUARTER_CAP_PTS,
  type UnitDef,
  type UnitId,
} from "../data/trilha";

export type Goal = { id: GoalId; name: string; targetCents: number; monthlyCents: number; savedCents: number; yieldCents: number; history: number[] };

export type TxnKind = "salario" | "cofrinho" | "resgate" | "pix" | "compra";
export type Txn = { id: number; day: number; kind: TxnKind; title: string; sub: string; cents: number; streak?: boolean; faturaCents?: number };
export type MonthAward = { month: number; heldCents: number; pts: number };
export type PointSource = "missao" | "mes" | "desafio";
export type PointEntry = { id: number; day: number; label: string; source: PointSource; base: number; mult: number; pts: number; expiresDay: number };

export type Persisted = {
  introSeen: boolean;
  completed: LessonId[];
  deepSeen: LessonId[];
  unitBest: Record<UnitId, number>;
  unitDeepSeen: UnitId[];
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
  txWeeks: number[];
  pointsLog: PointEntry[];
  profile: Profile;
  trail?: Trail;
  pastTrails: { n: number; title: string; units: UnitId[] }[];
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
  txWeeks: [],
  pointsLog: [],
  profile: {},
  pastTrails: [],
  cofrinhoWarned: false,
  pixDone: false,
  hook: { pending: false, pushSeen: false, off: false },
};

const KEY = "academiai-v7";

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
  { id: "a-u1", cat: "aprender", title: "Concluir uma unidade da AcademIA.I", academia: true },
  { id: "a-desafio", cat: "aprender", title: "Passar num desafio de fim de unidade", academia: true },
  { id: "a-missao", cat: "aprender", title: "Cumprir a missão do mês", academia: true },
];

type Ctx = Persisted & {
  set: (p: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) => void;
  done: (id: LessonId) => boolean;
  unlocked: (id: LessonId) => boolean;
  unitDone: (u: UnitId) => boolean;
  unitPassed: (u: UnitId) => boolean;
  next?: Lesson;
  trailNow: Trail;
  trailUnits: UnitDef[];
  trailLessons: Lesson[];
  trailDone: boolean;
  doneUnits: UnitId[];
  streak: number;
  weekActive: boolean;
  multiplier: number;
  nextMultiplier: number;
  activePoints: PointEntry[];
  expiredPoints: number;
  nextExpiry?: { day: number; pts: number; soon: boolean };
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
  recordUnitQuiz: (u: UnitId, correct: number) => number;
  setTrail: (t: Trail) => void;
  claim: (m: MissionView) => void;
  setGoal: (g: Pick<Goal, "id" | "name" | "targetCents" | "monthlyCents">) => void;
  save: (cents: number) => void;
  spend: (cents: number, where: string, method?: "debito" | "credito") => void;
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
    const unitDone = (u: UnitId) => {
      const ls = lessonsOf(u);
      return ls.length > 0 && ls.every((l) => done(l.id));
    };
    const unitPassed = (u: UnitId) => s.unitBest[u] !== undefined && s.unitBest[u] >= unitPass(u);
    const doneUnits = UNITS.filter((u) => unitDone(u.id)).map((u) => u.id);
    const trailNow = s.trail ?? localTrail(s.profile, s.goal?.id, [], 1);
    const trailUnits = trailNow.units.map((u) => unitDef(u.id)).filter((u): u is UnitDef => !!u);
    const trailLessons = trailUnits.flatMap((u) => lessonsOf(u.id));
    const next = trailLessons.find((l) => !done(l.id));
    const unlocked = (id: LessonId) => done(id) || next?.id === id;
    const trailDone = !next && trailUnits.length > 0;

    const streak = streakOf(s.txWeeks, s.week);
    const weekActive = s.txWeeks.includes(s.week);
    const multiplier = multiplierFor(streak);
    const nextMultiplier = multiplierFor(streak + 1);
    const activePoints = s.pointsLog.filter((e) => e.expiresDay > s.day);
    const expiredPoints = s.pointsLog.filter((e) => e.expiresDay <= s.day).reduce((a, e) => a + e.pts, 0);
    const firstExp = activePoints.reduce<number | undefined>((m, e) => (m === undefined || e.expiresDay < m ? e.expiresDay : m), undefined);
    const nextExpiry =
      firstExp === undefined
        ? undefined
        : { day: firstExp, pts: activePoints.filter((e) => e.expiresDay === firstExp).reduce((a, e) => a + e.pts, 0), soon: firstExp - s.day <= MONTH_DAYS };

    const sumOf = (src: PointSource[]) => activePoints.filter((e) => src.includes(e.source)).reduce((a, e) => a + e.pts, 0);
    const awardPoints = sumOf(["mes"]);
    const missionPoints = sumOf(["missao", "mes"]);
    const quizPoints = sumOf(["desafio"]);
    const points = missionPoints + quizPoints;
    const balanceCents = s.txns.reduce((a, x) => a + x.cents, 0);
    const monthPtsPreview = s.goal ? monthlyPoints(s.monthMinCents) : 0;

    const saved = s.goal?.savedCents ?? 0;
    const flags: Record<string, boolean> = {
      "p-chave": true,
      "p-pix": s.pixDone,
      "g-cofrinho": saved > 0,
      "g-100": saved >= 10000,
      "a-u1": doneUnits.length > 0,
      "a-desafio": UNITS.some((u) => unitPassed(u.id)),
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
      const status: MissionStatus = s.completed.length < m.unlockAfter
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

    const addTxn = (p: Persisted, kind: TxnKind, title: string, sub: string, cents: number, streak?: boolean): Txn[] => [
      ...p.txns,
      { id: (p.txns[p.txns.length - 1]?.id ?? 0) + 1, day: p.day, kind, title, sub, cents, ...(streak ? { streak } : {}) },
    ];
    const markWeek = (p: Persisted) => (p.txWeeks.includes(p.week) ? p.txWeeks : [...p.txWeeks, p.week]);
    const earn = (p: Persisted, day: number, base: number, label: string, source: PointSource): PointEntry[] => {
      if (base <= 0) return p.pointsLog;
      const mult = multiplierFor(streakOf(p.txWeeks, Math.floor((day - 1) / 7) + 1));
      const used = p.pointsLog.filter((e) => quarterOf(e.day) === quarterOf(day)).reduce((a, e) => a + e.pts, 0);
      const pts = Math.min(Math.round(base * mult), QUARTER_CAP_PTS - used);
      if (pts <= 0) return p.pointsLog;
      const id = (p.pointsLog[p.pointsLog.length - 1]?.id ?? 0) + 1;
      return [...p.pointsLog, { id, day, label, source, base, mult, pts, expiresDay: expiryDayFor(day) }];
    };
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
        const unlockedMonthly = q.completed.length >= (MISSIONS.find((m) => m.id === "m-mes")?.unlockAfter ?? 0);
        const held = q.goal ? q.monthMinCents : 0;
        const give = unlockedMonthly && !!q.goal;
        const awards = give ? [...q.awards, { month: q.month, heldCents: held, pts: monthlyPoints(held) }] : q.awards;
        const pointsLog = give ? earn(q, q.month * MONTH_DAYS, monthlyPoints(held), "Missão do mês: guardar e deixar lá", "mes") : q.pointsLog;
        const g = q.goal
          ? (() => {
              const y = Math.round(q.goal.savedCents * (Math.pow(1 + CDI_YEAR, 1 / 12) - 1));
              return { ...q.goal, savedCents: q.goal.savedCents + y, yieldCents: q.goal.yieldCents + y, history: [...q.goal.history, q.goal.savedCents + y] };
            })()
          : q.goal;
        q = { ...q, month: q.month + 1, awards, pointsLog, goal: g, monthMinCents: g?.savedCents ?? 0 };
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
      trailNow,
      trailUnits,
      trailLessons,
      trailDone,
      doneUnits,
      streak,
      weekActive,
      multiplier,
      nextMultiplier,
      activePoints,
      expiredPoints,
      nextExpiry,
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
        set((p) => ({ completed: p.completed.includes(id) ? p.completed : [...p.completed, id], weekLessons: p.weekLessons + 1 })),
      markDeep: (id) => set((p) => ({ deepSeen: p.deepSeen.includes(id) ? p.deepSeen : [...p.deepSeen, id], weekDeep: p.weekDeep + 1 })),
      recordUnitQuiz: (u, correct) => {
        const base = unitQuizPoints(u, Math.max(correct, s.unitBest[u] ?? 0)) - unitQuizPoints(u, s.unitBest[u]);
        set((p) => ({
          unitBest: { ...p.unitBest, [u]: Math.max(correct, p.unitBest[u] ?? 0) },
          unitDeepSeen: p.unitDeepSeen.includes(u) ? p.unitDeepSeen : [...p.unitDeepSeen, u],
          pointsLog: earn(p, p.day, base, `Desafio: ${unitDef(u)?.name ?? u}`, "desafio"),
        }));
        return Math.round(base * multiplier);
      },
      claim: (m) =>
        set((p) => (p.claimed.includes(m.key) ? {} : { claimed: [...p.claimed, m.key], pointsLog: earn(p, p.day, m.points, `Missão: ${m.title}`, "missao") })),
      setTrail: (t) =>
        set((p) => ({
          trail: t,
          pastTrails: p.trail ? [...p.pastTrails, { n: p.trail.n, title: p.trail.title, units: p.trail.units.map((u) => u.id) }] : p.pastTrails,
        })),
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
      spend: (cents, where, method = "debito") =>
        set((p) => {
          if (cents <= 0) return {};
          if (method === "credito") {
            const txns = addTxn(p, "compra", "Compra no crédito", `${where} · na fatura`, 0, true);
            txns[txns.length - 1].faturaCents = cents;
            return { txns, txWeeks: markWeek(p) };
          }
          if (cents > p.txns.reduce((a, x) => a + x.cents, 0)) return {};
          return { txns: addTxn(p, "compra", "Compra no débito", where, -cents, true), txWeeks: markWeek(p) };
        }),
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
