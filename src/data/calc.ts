import { EXTRATO, LAST_SALARY, LUCAS, PREV_SALARY, SIMULATED, type Category, type Entry } from "./lucas";

export type Calc = { value: string; how: string };

const DAY = 86400000;
const t = (d: string) => new Date(`${d}T12:00:00`).getTime();
const addDays = (d: string, days: number) => new Date(t(d) + days * DAY).toISOString().slice(0, 10);

export const brl = (cents: number, withCents = true) =>
  `R$ ${(cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  })}`;

export const brlShort = (cents: number) => (cents % 100 === 0 ? brl(cents, false) : brl(cents));

const inCycle = (en: Entry, from: string, to: string) => en.date >= from && en.date < to;

/** Ciclo completo anterior: do salário de agosto até a véspera do salário de setembro. */
export const prevCycle = (entries: Entry[] = EXTRATO) => entries.filter((en) => inCycle(en, PREV_SALARY, LAST_SALARY));

export function l1Numbers(entries: Entry[] = EXTRATO) {
  const limit = addDays(PREV_SALARY, 3);
  const itau = entries.filter((en) => en.source === "itau" && inCycle(en, PREV_SALARY, limit));
  const inCents = itau.filter((en) => en.cents > 0).reduce((s, en) => s + en.cents, 0);
  const outCents = -itau.filter((en) => en.cents < 0).reduce((s, en) => s + en.cents, 0);
  return { inCents, outCents, days: 3 };
}

export function fixedEntries(entries: Entry[] = EXTRATO) {
  return prevCycle(entries).filter((en) => en.fixed);
}

export function monthSummary(entries: Entry[] = EXTRATO) {
  const cycle = prevCycle(entries).filter((en) => !en.internal);
  const income = cycle.filter((en) => en.cents > 0).reduce((s, en) => s + en.cents, 0);
  const fixed = -cycle.filter((en) => en.fixed).reduce((s, en) => s + en.cents, 0);
  const variable = -cycle.filter((en) => en.cents < 0 && !en.fixed).reduce((s, en) => s + en.cents, 0);
  return { income, fixed, variable, sobra: income - fixed - variable };
}

export function idleBeforeSalary(entries: Entry[] = EXTRATO) {
  return entries.filter((en) => en.source === "itau" && en.date < LAST_SALARY).reduce((s, en) => s + en.cents, 0);
}

export function debitShare(entries: Entry[] = EXTRATO) {
  const debits = prevCycle(entries).filter((en) => en.debit);
  const other = debits.filter((en) => en.source !== "itau").length;
  return { pct: Math.round((other / debits.length) * 100), other, total: debits.length };
}

export function byCategory(entries: Entry[]) {
  const map = new Map<Category, number>();
  entries
    .filter((en) => en.cents < 0 && !en.internal)
    .forEach((en) => map.set(en.category, (map.get(en.category) ?? 0) - en.cents));
  return [...map.entries()].map(([category, cents]) => ({ category, cents })).sort((a, b) => b.cents - a.cents);
}

export function topVariableCategory(entries: Entry[] = EXTRATO) {
  const variable = prevCycle(entries).filter((en) => !en.fixed && en.source === "carteira");
  return byCategory(variable)[0];
}

/** Dia em que a carteira fora do Itaú chegou a zero no ciclo anterior. */
export function zeroDay(entries: Entry[] = EXTRATO) {
  const wallet = prevCycle(entries)
    .filter((en) => en.source === "carteira")
    .sort((a, b) => a.date.localeCompare(b.date));
  let bal = 0;
  let day: string | undefined;
  for (const en of wallet) {
    bal += en.cents;
    if (bal <= 100 && en.cents < 0) {
      day = en.date;
      break;
    }
  }
  return day ? Number(day.slice(8, 10)) : undefined;
}

export function institutions(entries: Entry[] = EXTRATO) {
  const set = new Set<string>(["Itaú"]);
  entries.forEach((en) => en.to && set.add(en.to));
  return [...set];
}

export const monthsTo = (target: number, monthly: number) => (monthly > 0 ? Math.ceil(target / monthly) : Infinity);

export function inflationLoss(cents: number) {
  const real = Math.round(cents / (1 + SIMULATED.inflationYear));
  const rendendo = Math.round(cents * (1 + SIMULATED.cdiYear));
  return { real, rendendo };
}

export function rotativo(cents: number, months: number) {
  return Math.round(cents * Math.pow(1 + SIMULATED.rotativoMonth, months));
}

export const pctOfSalary = (cents: number) => Math.round((cents / LUCAS.salaryCents) * 100);

export const itauBalance = (entries: Entry[] = EXTRATO) =>
  entries.filter((en) => en.source === "itau").reduce((s, en) => s + en.cents, 0);
