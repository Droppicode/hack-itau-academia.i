import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { itauBalance, pctOfSalary } from "../data/calc";
import { EXTRATO, LAST_SALARY, LUCAS, TODAY, type Entry } from "../data/lucas";
import { LESSONS, REWARDS, type GoalId, type Lesson, type LessonId } from "../data/trilha";

export type Pote = { name: string; targetCents: number; savedCents: number };

export type Persisted = {
  diag: { goal?: GoalId; renda?: "parecido" | "muda"; casa?: "fixo" | "quando" | "nao"; done: boolean };
  completed: LessonId[];
  lessonPoints: number;
  extra: Entry[];
  hookNo: number;
  goal?: Pote & { id: GoalId; monthlyCents: number };
  colchao?: Pote;
  reserva?: Pote;
  cdbCents: number;
  aporte: { on: boolean; cents: number; mode: "fixo" | "percent"; percent: number };
  walletCard: boolean;
  alerts: { fatura: boolean; limite: boolean; limiteCents: number };
  activeRewards: string[];
  fixedMarked: string[];
  ofConnected: boolean;
  salaryHere: boolean;
  nextTrail?: string;
  simDays: number;
  simTx: number;
  claimed: string[];
  homeCardMin: boolean;
};

const INITIAL: Persisted = {
  diag: { done: false },
  completed: [],
  lessonPoints: 0,
  extra: [],
  hookNo: 0,
  cdbCents: 0,
  aporte: { on: false, cents: 5000, mode: "fixo", percent: 5 },
  walletCard: false,
  alerts: { fatura: false, limite: false, limiteCents: 80000 },
  activeRewards: [],
  fixedMarked: [],
  ofConnected: false,
  salaryHere: false,
  simDays: 0,
  simTx: 0,
  claimed: [],
  homeCardMin: false,
};

const KEY = "academiai-v1";

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
  entries: Entry[];
  balanceCents: number;
  retainedCents: number;
  retainedPct: number;
  points: number;
  level: number;
  path: Lesson[];
  next?: Lesson;
  isUnlocked: (id: LessonId) => boolean;
  complete: (id: LessonId) => void;
  missions: Mission[];
  claim: (id: string) => void;
  registerPix: (p: { cents: number; toName: string; toBank: string; own: boolean }) => void;
  shouldHook: (p: { cents: number; own: boolean }) => boolean;
  rewardUnlocked: (id: string) => boolean;
  rewardActive: (id: string) => boolean;
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
    const entries = [...EXTRATO, ...s.extra];
    const potes = (s.goal?.savedCents ?? 0) + (s.colchao?.savedCents ?? 0) + (s.reserva?.savedCents ?? 0);
    const balanceCents = itauBalance(entries) - s.cdbCents - potes;
    const retainedCents = balanceCents + s.cdbCents + potes;
    const retainedPct = pctOfSalary(retainedCents);

    const variableProfile = s.diag.renda === "muda" || s.diag.casa === "quando";
    const path = LESSONS.filter((l) => !l.conditional || variableProfile || s.completed.includes(l.id));
    const next = path.find((l) => !s.completed.includes(l.id));
    const isUnlocked = (id: LessonId) => {
      if (s.completed.includes(id)) return true;
      const lesson = path.find((l) => l.id === id);
      if (!lesson || next?.id !== id) return false;
      return !lesson.needsAporte || s.aporte.on;
    };

    const txThisCycle =
      entries.filter((en) => en.source === "itau" && en.cents < 0 && en.date >= LAST_SALARY).length + s.simTx;
    const products = [s.goal, s.colchao, s.reserva].filter(Boolean).length + (s.cdbCents > 0 ? 1 : 0) + (s.aporte.on ? 1 : 0);
    const keeps = retainedPct >= 50;
    const raw: Omit<Mission, "claimed">[] = [
      {
        id: "m-fica",
        title: "Salário que fica",
        text: "Manter pelo menos 50% do salário no Itaú por 7 dias",
        points: 200,
        progress: keeps ? Math.min(s.simDays, 7) : 0,
        goal: 7,
        unit: "dias",
        met: keeps && s.simDays >= 7,
      },
      {
        id: "m-5tx",
        title: "5 movimentos no mês",
        text: "Pix, débito ou pagamento saindo da conta Itaú",
        points: 100,
        progress: Math.min(txThisCycle, 5),
        goal: 5,
        unit: "movimentos",
        met: txThisCycle >= 5,
      },
      {
        id: "m-produto",
        title: "Um além da conta",
        text: "Ter um pote, uma aplicação ou o aporte ligado",
        points: 100,
        progress: Math.min(products, 1),
        goal: 1,
        unit: "produto",
        met: products >= 1,
      },
      {
        id: "m-cartao",
        title: "Primeira compra por aproximação",
        text: "Usar o cartão Itaú da carteira do celular",
        points: 50,
        progress: s.walletCard && s.simTx > 0 ? 1 : 0,
        goal: 1,
        unit: "compra",
        met: s.walletCard && s.simTx > 0,
      },
      {
        id: "m-streak",
        title: "4 lições no ritmo",
        text: "Uma lição por salário, sem pular",
        points: 100,
        progress: Math.min(s.completed.length, 4),
        goal: 4,
        unit: "lições",
        met: s.completed.length >= 4,
      },
    ];
    const missions = raw.map((m) => ({ ...m, claimed: s.claimed.includes(m.id) }));
    const missionPoints = missions.filter((m) => m.claimed).reduce((a, m) => a + m.points, 0);
    const points = s.lessonPoints + missionPoints;
    const modulesDone = [1, 2, 3, 4].filter((mod) => path.filter((l) => l.module === mod).every((l) => s.completed.includes(l.id))).length;
    const level = 1 + modulesDone;

    const rewardUnlocked = (id: string) => {
      const r = REWARDS.find((x) => x.id === id);
      return !!r && s.completed.includes(r.unlock);
    };

    return {
      ...s,
      set,
      reset: () => setS(INITIAL),
      entries,
      balanceCents,
      retainedCents,
      retainedPct,
      points,
      level,
      path,
      next,
      isUnlocked,
      complete: (id) =>
        setS((prev) =>
          prev.completed.includes(id)
            ? prev
            : {
                ...prev,
                completed: [...prev.completed, id],
                lessonPoints: prev.lessonPoints + (LESSONS.find((l) => l.id === id)?.points ?? 0),
              },
        ),
      missions,
      claim: (id) => setS((prev) => (prev.claimed.includes(id) ? prev : { ...prev, claimed: [...prev.claimed, id] })),
      registerPix: ({ cents, toName, toBank, own }) =>
        setS((prev) => ({
          ...prev,
          extra: [
            ...prev.extra,
            {
              id: `pix-${Date.now()}`,
              date: TODAY,
              label: `Pix enviado · ${own ? `${LUCAS.first} (${toBank})` : toName}`,
              cents: -cents,
              category: own ? "Transferência própria" : "Casa",
              source: "itau",
              internal: own,
              to: own ? toBank : undefined,
            },
          ],
        })),
      shouldHook: ({ cents, own }) => own && pctOfSalary(cents) >= 50 && s.hookNo < 2 && !s.completed.includes("L1"),
      rewardUnlocked,
      rewardActive: (id) => {
        const r = REWARDS.find((x) => x.id === id);
        if (!r || !s.activeRewards.includes(id) || !rewardUnlocked(id)) return false;
        return !r.recurring || s.aporte.on;
      },
      progressPct: Math.round((s.completed.filter((id) => path.some((l) => l.id === id)).length / path.length) * 100),
    };
  }, [s]);

  return <TrilhaContext.Provider value={value}>{children}</TrilhaContext.Provider>;
}

export function useTrilha() {
  const ctx = useContext(TrilhaContext);
  if (!ctx) throw new Error("useTrilha must be used inside TrilhaProvider");
  return ctx;
}
