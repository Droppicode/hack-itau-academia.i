import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { CDI_YEAR, LESSONS, LEVELS, MISSIONS, POINTS_PER_RIGHT, QUIZ_PASS, REWARDS, type GoalId, type Lesson, type LessonId, type MissionDef } from "../data/trilha";

export type Goal = { id: GoalId; name: string; targetCents: number; monthlyCents: number; savedCents: number; history: number[] };

export type Persisted = {
  introSeen: boolean;
  completed: LessonId[];
  quizBest: Partial<Record<LessonId, number>>;
  deepSeen: LessonId[];
  claimed: string[];
  actions: string[];
  week: number;
  month: number;
  weekLessons: number;
  weekQuizzes: number;
  streak: number;
  bestStreak: number;
  lastActiveWeek: number;
  bonusPts: number;
  goal?: Goal;
  monthSavedCents: number;
  billsPaid: boolean;
  cdi105: boolean;
  hook: { pending: boolean; pushSeen: boolean; off: boolean };
  activeRewards: string[];
};

const INITIAL: Persisted = {
  introSeen: false,
  completed: [],
  quizBest: {},
  deepSeen: [],
  claimed: [],
  actions: [],
  week: 1,
  month: 1,
  weekLessons: 0,
  weekQuizzes: 0,
  streak: 0,
  bestStreak: 0,
  lastActiveWeek: 0,
  bonusPts: 0,
  monthSavedCents: 0,
  billsPaid: false,
  cdi105: false,
  hook: { pending: false, pushSeen: false, off: false },
  activeRewards: [],
};

const KEY = "academiai-v3";
export const STREAK_BONUS = 20;

export type MissionStatus = "bloqueada" | "disponível" | "em andamento" | "concluída" | "resgatada";
export type MissionView = MissionDef & { status: MissionStatus; progress: number; goal: number; key: string };

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...INITIAL, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    /* ignore */
  }
  return INITIAL;
}

export const quizPoints = (correct: number | undefined) => (correct !== undefined && correct >= QUIZ_PASS ? correct * POINTS_PER_RIGHT : 0);

type Ctx = Persisted & {
  set: (p: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) => void;
  done: (id: LessonId) => boolean;
  unlocked: (id: LessonId) => boolean;
  next?: Lesson;
  points: number;
  level: number;
  levelPct: number;
  nextLevelAt?: number;
  missions: MissionView[];
  completeLesson: (id: LessonId) => void;
  recordQuiz: (id: LessonId, correct: number) => number;
  claim: (m: MissionView) => void;
  doAction: (id: string) => void;
  save: (cents: number) => void;
  advanceWeek: () => void;
  advanceMonth: () => void;
  registerPix: (own: boolean) => void;
  rewardUnlocked: (id: string) => boolean;
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
    const idx = (id: LessonId) => LESSONS.findIndex((l) => l.id === id);
    const unlocked = (id: LessonId) => idx(id) === 0 || done(LESSONS[idx(id) - 1].id);
    const next = LESSONS.find((l) => !done(l.id));

    const missionPts = s.claimed.reduce((a, k) => a + (MISSIONS.find((m) => m.id === k.split("@")[0])?.points ?? 0), 0);
    const quizPts = LESSONS.reduce((a, l) => a + quizPoints(s.quizBest[l.id]), 0);
    const points = quizPts + missionPts + s.bonusPts;
    const level = LEVELS.filter((v) => points >= v).length;
    const nextLevelAt = LEVELS[level];
    const levelPct = nextLevelAt ? ((points - LEVELS[level - 1]) / (nextLevelAt - LEVELS[level - 1])) * 100 : 100;

    const missions: MissionView[] = MISSIONS.map((m) => {
      const key = m.kind === "semanal" ? `${m.id}@w${s.week}` : m.kind === "mensal" ? `${m.id}@m${s.month}` : m.id;
      let progress = 0;
      let goal = 1;
      if (m.id === "w-licoes") [progress, goal] = [Math.min(s.weekLessons, 2), 2];
      else if (m.id === "w-quiz") [progress, goal] = [Math.min(s.weekQuizzes, 2), 2];
      else if (m.id === "m-mes") [progress, goal] = [(s.monthSavedCents >= 2000 ? 1 : 0) + (s.billsPaid ? 1 : 0), 2];
      else if (m.id === "l-objetivo") progress = s.goal ? 1 : 0;
      else progress = s.actions.includes(m.id) ? 1 : 0;
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

    return {
      ...s,
      set,
      done,
      unlocked,
      next,
      points,
      level,
      levelPct,
      nextLevelAt,
      missions,
      completeLesson: (id) =>
        set((p) => {
          const streak = p.lastActiveWeek === p.week ? p.streak : p.lastActiveWeek === p.week - 1 ? p.streak + 1 : 1;
          const kept = p.lastActiveWeek === p.week - 1 && streak >= 2;
          return {
            completed: p.completed.includes(id) ? p.completed : [...p.completed, id],
            weekLessons: p.weekLessons + 1,
            streak,
            bestStreak: Math.max(p.bestStreak, streak),
            lastActiveWeek: p.week,
            bonusPts: p.bonusPts + (kept ? STREAK_BONUS : 0),
          };
        }),
      recordQuiz: (id, correct) => {
        const before = quizPoints(s.quizBest[id]);
        const best = Math.max(correct, s.quizBest[id] ?? 0);
        set((p) => ({
          quizBest: { ...p.quizBest, [id]: Math.max(correct, p.quizBest[id] ?? 0) },
          deepSeen: p.deepSeen.includes(id) ? p.deepSeen : [...p.deepSeen, id],
          weekQuizzes: p.weekQuizzes + (correct >= QUIZ_PASS ? 1 : 0),
        }));
        return quizPoints(best) - before;
      },
      claim: (m) => set((p) => ({ claimed: [...p.claimed, m.key] })),
      doAction: (id) => set((p) => ({ actions: p.actions.includes(id) ? p.actions : [...p.actions, id] })),
      save: (cents) =>
        set((p) => ({
          monthSavedCents: p.monthSavedCents + cents,
          goal: p.goal ? { ...p.goal, savedCents: p.goal.savedCents + cents } : p.goal,
        })),
      advanceWeek: () => set((p) => ({ week: p.week + 1, weekLessons: 0, weekQuizzes: 0 })),
      advanceMonth: () =>
        set((p) => {
          const monthDone = p.claimed.includes(`m-mes@m${p.month}`) || (p.monthSavedCents >= 2000 && p.billsPaid);
          const rate = (p.cdi105 ? 1.05 : 1) * CDI_YEAR;
          const goal = p.goal
            ? (() => {
                const deposit = Math.max(p.goal.monthlyCents - p.monthSavedCents, 0);
                const withDeposit = p.goal.savedCents + deposit;
                const saved = Math.min(Math.round(withDeposit * (1 + rate / 12)), Math.max(p.goal.targetCents, withDeposit));
                return { ...p.goal, savedCents: saved, history: [...p.goal.history, saved] };
              })()
            : p.goal;
          return { month: p.month + 1, week: p.week + 4, weekLessons: 0, weekQuizzes: 0, monthSavedCents: 0, billsPaid: false, cdi105: monthDone, goal };
        }),
      registerPix: (own) => {
        if (own && !s.hook.off) set((p) => ({ hook: { ...p.hook, pending: true, pushSeen: false } }));
      },
      rewardUnlocked: (id) => {
        const r = REWARDS.find((x) => x.id === id);
        return !!r && points >= LEVELS[r.level - 1];
      },
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
