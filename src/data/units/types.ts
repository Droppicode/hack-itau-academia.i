export type Step =
  | { kind: "info"; term: string; text: string; example?: string }
  | { kind: "choice"; q: string; options: string[]; right: number; why: string }
  | { kind: "tf"; q: string; right: boolean; why: string };

export type QuizQ = { q: string; options: string[]; right: number; why: string };
export type DeepCard = { title: string; text: string };

export type LessonDef = { id?: string; title: string; learn: string; steps: Step[]; deep: DeepCard[]; quiz: QuizQ[] };

export type UnitLevel = 1 | 2 | 3;

export type UnitDef = {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  level: UnitLevel;
  tags: string[];
  lessons: LessonDef[];
  deep: DeepCard[];
};

export const info = (term: string, text: string, example?: string): Step => ({ kind: "info", term, text, example });
export const pick = (q: string, options: string[], why: string, right = 0): Step => ({ kind: "choice", q, options, right, why });
export const tf = (q: string, right: boolean, why: string): Step => ({ kind: "tf", q, right, why });
export const qz = (q: string, options: string[], why: string, right = 0): QuizQ => ({ q, options, right, why });

export const defineUnit = (u: UnitDef): UnitDef => ({
  ...u,
  lessons: u.lessons.map((l, i) => ({ ...l, id: l.id ?? `${u.id}-${i + 1}` })),
});
