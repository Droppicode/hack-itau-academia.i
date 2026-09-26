import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LESSONS, LEVELS, MODULES, REWARDS, type FeelingId, type GoalId, type Lesson, type LessonId, type ModuleN } from "../data/trilha";

export type Persisted = {
  diag: { goal?: GoalId; feeling?: FeelingId; start?: ModuleN; done: boolean };
  completed: LessonId[];
  hookNo: number;
  goal?: { id: GoalId; name: string; targetCents: number; monthlyCents: number };
  guardaItau: boolean;
  activeRewards: string[];
  nextTrail?: string;
  streak: number;
  claimed: string[];
  homeCardMin: boolean;
};

const INITIAL: Persisted = {
  diag: { done: false },
  completed: [],
  hookNo: 0,
  guardaItau: false,
  activeRewards: [],
  streak: 1,
  claimed: [],
  homeCardMin: false,
};

const KEY = "academiai-v2";

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...INITIAL, ...(JSON.parse(raw) as Partial<Persisted>) } : INITIAL;
  } catch {
    return INITIAL;
  }
}

export type Mission = {
  id: string;
  title: string;
  text: string;
  points: number;
  progress: number;
  goal: number;
  unit: string;
  met: boolean;
  claimed: boolean;
};

type Ctx = Persisted & {
  set: (patch: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) => void;
  reset: () => void;
  points: number;
  level: number;
  levelPct: number;
  nextLevelAt?: number;
  next?: Lesson;
  isUnlocked: (id: LessonId) => boolean;
  complete: (id: LessonId) => void;
  missions: Mission[];
  claim: (id: string) => void;
  shouldHook: () => boolean;
  rewardUnlocked: (id: string) => boolean;
  progressPct: number;
};

const TrilhaContext = createContext<Ctx | null>(null);

export function TrilhaProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(s));
  }, [s]);

  const value = useMemo<Ctx>(() => {
    const set: Ctx["set"] = (patch) => setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
    const done = (id: LessonId) => s.completed.includes(id);
    const isUnlocked = (id: LessonId) => {
      const l = LESSONS.find((x) => x.id === id);
      if (!l) return false;
      const inModule = LESSONS.filter((x) => x.module === l.module);
      const i = inModule.indexOf(l);
      return i === 0 || done(inModule[i - 1].id);
    };
    const order = s.diag.start ? [...MODULES.filter((m) => m.n >= s.diag.start!), ...MODULES.filter((m) => m.n < s.diag.start!)] : MODULES;
    const next = order.flatMap((m) => LESSONS.filter((l) => l.module === m.n)).find((l) => !done(l.id) && isUnlocked(l.id));

    const modulesDone = MODULES.filter((m) => LESSONS.filter((l) => l.module === m.n).every((l) => done(l.id))).length;
    const raw: Omit<Mission, "claimed">[] = [
      { id: "m-diag", title: "Primeiro passo", text: "Responder o diagnóstico de 3 toques", points: 50, progress: s.diag.done ? 1 : 0, goal: 1, unit: "", met: s.diag.done },
      { id: "m-streak", title: "Sequência de 3 dias", text: "Abrir a AcademIA.I 3 dias seguidos", points: 100, progress: Math.min(s.streak, 3), goal: 3, unit: "dias", met: s.streak >= 3 },
      { id: "m-modulo", title: "Módulo fechado", text: "Terminar todas as lições de um módulo", points: 150, progress: Math.min(modulesDone, 1), goal: 1, unit: "módulo", met: modulesDone >= 1 },
      {
        id: "m-guarda",
        title: "Um pouco fica aqui",
        text: "Deixar parte do salário guardada no Itaú para o seu objetivo",
        points: 200,
        progress: s.guardaItau ? 1 : 0,
        goal: 1,
        unit: "",
        met: s.guardaItau,
      },
      { id: "m-trilha", title: "Trilha completa", text: "As 12 lições da AcademIA.I", points: 300, progress: s.completed.length, goal: LESSONS.length, unit: "lições", met: s.completed.length >= LESSONS.length },
    ];
    const missions = raw.map((m) => ({ ...m, claimed: s.claimed.includes(m.id) }));
    const lessonPoints = LESSONS.filter((l) => done(l.id)).reduce((a, l) => a + l.points, 0);
    const points = lessonPoints + missions.filter((m) => m.claimed).reduce((a, m) => a + m.points, 0);
    const level = LEVELS.filter((min) => points >= min).length;
    const cur = LEVELS[level - 1];
    const nextLevelAt = LEVELS[level];
    const levelPct = nextLevelAt === undefined ? 100 : Math.round(((points - cur) / (nextLevelAt - cur)) * 100);

    return {
      ...s,
      set,
      reset: () => setS(INITIAL),
      points,
      level,
      levelPct,
      nextLevelAt,
      next,
      isUnlocked,
      complete: (id) => setS((prev) => (prev.completed.includes(id) ? prev : { ...prev, completed: [...prev.completed, id] })),
      missions,
      claim: (id) => setS((prev) => (prev.claimed.includes(id) ? prev : { ...prev, claimed: [...prev.claimed, id] })),
      shouldHook: () => s.hookNo < 2 && !done("L7"),
      rewardUnlocked: (id) => (REWARDS.find((r) => r.id === id)?.level ?? 99) <= level,
      progressPct: Math.round((s.completed.length / LESSONS.length) * 100),
    };
  }, [s]);

  return <TrilhaContext.Provider value={value}>{children}</TrilhaContext.Provider>;
}

export function useTrilha() {
  const ctx = useContext(TrilhaContext);
  if (!ctx) throw new Error("useTrilha must be used inside TrilhaProvider");
  return ctx;
}
