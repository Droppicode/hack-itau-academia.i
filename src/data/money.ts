export const brl = (cents: number, withCents = true) =>
  (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: withCents ? 2 : 0,
    maximumFractionDigits: withCents ? 2 : 0,
  });

export const monthsTo = (target: number, monthly: number) => (monthly > 0 ? Math.ceil(target / monthly) : Infinity);

export function compound(monthlyCents: number, months: number, rateYear: number) {
  const r = Math.pow(1 + rateYear, 1 / 12) - 1;
  let total = 0;
  for (let i = 0; i < months; i++) total = (total + monthlyCents) * (1 + r);
  return Math.round(total);
}

export function inss(grossCents: number) {
  const brackets = [
    { upTo: 151800, rate: 0.075 },
    { upTo: 279388, rate: 0.09 },
    { upTo: 419083, rate: 0.12 },
    { upTo: 815741, rate: 0.14 },
  ];
  let prev = 0;
  let tax = 0;
  for (const b of brackets) {
    if (grossCents <= prev) break;
    tax += (Math.min(grossCents, b.upTo) - prev) * b.rate;
    prev = b.upTo;
  }
  return Math.round(tax);
}

export const SIM = { cdiYear: 0.105, poupancaYear: 0.07, inflationYear: 0.045, rotativoMonth: 0.14 };

export const parseCents = (raw: string) => {
  const n = Number(raw.replace(/[^\d,.]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
};
