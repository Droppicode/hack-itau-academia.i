import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CDI_YEAR,
  LESSONS,
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
  weekSavedCents: number;
  streak: number;
  lastActiveWeek: number;
  goal?: Goal;
  monthSavedCents: number;
  billsPaid: boolean;
  cdi105: boolean;
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
  weekSavedCents: 0,
  streak: 0,
  lastActiveWeek: 0,
  monthSavedCents: 0,
  billsPaid: false,
  cdi105: false,
  cofrinhoWarned: false,
  pixDone: false,
  hook: { pending: false, pushSeen: false, off: false },
};

const KEY = "academiai-v5";

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
  missions: MissionView[];
  completeLesson: (id: LessonId) => void;
  markDeep: (id: LessonId) => void;
  recordUnitQuiz: (u: UnitN, correct: number) => number;
  claim: (m: MissionView) => void;
  setGoal: (g: Pick<Goal, "id" | "name" | "targetCents" | "monthlyCents">) => void;
  save: (cents: number) => void;
  withdraw: (cents: number) => void;
  advanceWeek: () => void;
  advanceMonth: () => void;
  registerPix: (own: boolean) => void;
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

    const missionPoints = s.claimed.reduce((a, k) => a + (MISSIONS.find((m) => m.id === k.split("@")[0])?.points ?? 0), 0);
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
      "a-missao": s.claimed.some((k) => k.startsWith("m-mes@")) || s.cdi105,
    };
    const passos: Passo[] = BASE_PASSOS.map((p) => ({ ...p, done: !!flags[p.id] }));
    const passosDone = passos.filter((p) => p.done).length;
    const mvLevel = MV_LEVELS.filter((v) => passosDone >= v).length;
    const mvNextAt = MV_LEVELS[mvLevel];
    const goalPct = s.goal ? Math.min((s.goal.savedCents / s.goal.targetCents) * 100, 100) : 0;
    const rate = (s.cdi105 ? 1.05 : 1) * CDI_YEAR;

    const missions: MissionView[] = MISSIONS.map((m) => {
      const key = m.kind === "semanal" ? `${m.id}@w${s.week}` : `${m.id}@m${s.month}`;
      let progress = 0;
      let goal = 1;
      if (m.id === "w-licoes") [progress, goal] = [Math.min(s.weekLessons, 2), 2];
      else if (m.id === "w-guardar") progress = s.weekSavedCents > 0 ? 1 : 0;
      else if (m.id === "m-mes") [progress, goal] = [(s.monthSavedCents >= 2000 ? 1 : 0) + (s.billsPaid ? 1 : 0), 2];
      const status: MissionStatus = !done(m.unlock)
        ? "bloqueada"
        : s.claimed.includes(key)
          ? "resgatada"
          : progress >= goal
            ? "concluída"
            : progress > 0
              ? "em andamento"
              : "disponível";
      return { ...m, key, progress, goal, status };
    });

    const addSaved = (p: Persisted, cents: number): Partial<Persisted> => ({
      monthSavedCents: Math.max(p.monthSavedCents + cents, 0),
      weekSavedCents: Math.max(p.weekSavedCents + cents, 0),
      goal: p.goal ? { ...p.goal, savedCents: Math.max(p.goal.savedCents + cents, 0), history: [...p.goal.history, Math.max(p.goal.savedCents + cents, 0)] } : p.goal,
    });

    return {
      ...s,
      set,
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
      markDeep: (id) => set((p) => ({ deepSeen: p.deepSeen.includes(id) ? p.deepSeen : [...p.deepSeen, id] })),
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
      save: (cents) => set((p) => addSaved(p, cents)),
      withdraw: (cents) => set((p) => addSaved(p, -Math.min(cents, p.goal?.savedCents ?? 0))),
      advanceWeek: () => set((p) => ({ week: p.week + 1, weekLessons: 0, weekSavedCents: 0 })),
      advanceMonth: () =>
        set((p) => {
          const monthDone = p.claimed.includes(`m-mes@m${p.month}`) || (p.monthSavedCents >= 2000 && p.billsPaid);
          const r = (p.cdi105 ? 1.05 : 1) * CDI_YEAR;
          const goal = p.goal
            ? (() => {
                const deposit = Math.max(p.goal.monthlyCents - p.monthSavedCents, 0);
                const base = p.goal.savedCents + deposit;
                const y = Math.round(base * (Math.pow(1 + r, 1 / 12) - 1));
                return { ...p.goal, savedCents: base + y, yieldCents: p.goal.yieldCents + y, history: [...p.goal.history, base + y] };
              })()
            : p.goal;
          return { month: p.month + 1, week: p.week + 4, weekLessons: 0, weekSavedCents: 0, monthSavedCents: 0, billsPaid: false, cdi105: monthDone, goal };
        }),
      registerPix: (own) =>
        set((p) => ({ pixDone: true, hook: own && !p.hook.off ? { ...p.hook, pending: true, pushSeen: false } : p.hook })),
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
