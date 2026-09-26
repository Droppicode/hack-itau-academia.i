export type Source = "itau" | "carteira";

export type Category =
  | "Salário"
  | "Transferência própria"
  | "Casa"
  | "Assinaturas"
  | "Celular"
  | "Academia"
  | "Educação"
  | "Delivery"
  | "Transporte"
  | "Compras"
  | "Lazer"
  | "Mercado"
  | "Saúde"
  | "Alimentação"
  | "Guardou";

export type Entry = {
  id: string;
  date: string;
  label: string;
  cents: number;
  category: Category;
  source: Source;
  fixed?: boolean;
  internal?: boolean;
  debit?: boolean;
  to?: string;
};

export const LUCAS = {
  name: "Lucas Oliveira Santos",
  first: "Lucas",
  initials: "LS",
  age: 19,
  job: "Jovem aprendiz · Guarulhos",
  cpfMasked: "•••.482.918-••",
  salaryCents: 132000,
  salaryDay: 25,
};

export const TODAY = "2026-09-26";
export const LAST_SALARY = "2026-09-25";
export const PREV_SALARY = "2026-08-25";

export const OTHER_WALLET = "Carteira Digital S.A.";
export const OTHER_BANK = "Banco Y";

let n = 0;
const e = (date: string, label: string, reais: number, category: Category, source: Source, extra: Partial<Entry> = {}): Entry => ({
  id: `e${++n}`,
  date,
  label,
  cents: Math.round(reais * 100),
  category,
  source,
  ...extra,
});

export const EXTRATO: Entry[] = [
  e("2026-08-25", "Salário · Empresa Aprendiz Ltda", 1320, "Salário", "itau"),
  e("2026-08-25", "Padaria Pão Quente", -12.5, "Alimentação", "itau", { debit: true }),
  e("2026-08-26", `Pix enviado · Lucas (${OTHER_WALLET})`, -1200, "Transferência própria", "itau", { internal: true, to: OTHER_WALLET }),
  e("2026-08-27", "Recarga de celular pré", -27.5, "Celular", "itau", { debit: true }),
  e("2026-09-03", `Pix enviado · Lucas (${OTHER_BANK})`, -20, "Transferência própria", "itau", { internal: true, to: OTHER_BANK }),

  e("2026-08-26", "Pix recebido · Lucas (Itaú)", 1200, "Transferência própria", "carteira", { internal: true }),
  e("2026-08-26", "Pix · Mãe (ajuda em casa)", -200, "Casa", "carteira", { fixed: true }),
  e("2026-08-27", "Academia", -89.9, "Academia", "carteira", { fixed: true, debit: true }),
  e("2026-08-27", "Plano de celular", -49.9, "Celular", "carteira", { fixed: true, debit: true }),
  e("2026-08-28", "Streaming de vídeo", -34.9, "Assinaturas", "carteira", { fixed: true, debit: true }),
  e("2026-08-28", "Streaming de música", -21.9, "Assinaturas", "carteira", { fixed: true, debit: true }),
  e("2026-08-29", "App de inglês", -33.4, "Educação", "carteira", { fixed: true, debit: true }),
  e("2026-08-27", "iFood", -38.9, "Delivery", "carteira", { debit: true }),
  e("2026-08-29", "Uber", -14.2, "Transporte", "carteira", { debit: true }),
  e("2026-08-30", "Bar do Zé", -64, "Lazer", "carteira", { debit: true }),
  e("2026-08-31", "Shopee", -89.9, "Compras", "carteira", { debit: true }),
  e("2026-09-02", "Uber", -18.7, "Transporte", "carteira", { debit: true }),
  e("2026-09-04", "Cinema", -32, "Lazer", "carteira", { debit: true }),
  e("2026-09-06", "iFood", -45.5, "Delivery", "carteira", { debit: true }),
  e("2026-09-08", "Mercado", -52.3, "Mercado", "carteira", { debit: true }),
  e("2026-09-10", "Loja de roupas", -119.9, "Compras", "carteira", { debit: true }),
  e("2026-09-12", "Ingresso show", -120, "Lazer", "carteira", { debit: true }),
  e("2026-09-13", "Uber", -22.4, "Transporte", "carteira", { debit: true }),
  e("2026-09-15", "Lanchonete", -18.5, "Alimentação", "carteira", { debit: true }),
  e("2026-09-17", "Farmácia", -23.8, "Saúde", "carteira", { debit: true }),
  e("2026-09-19", "Açaí", -18.3, "Delivery", "carteira", { debit: true }),
  e("2026-09-20", "Jogo online", -49.9, "Lazer", "carteira", { debit: true }),
  e("2026-09-22", "iFood", -29.9, "Delivery", "carteira", { debit: true }),
  e("2026-09-24", "Uber", -11.8, "Transporte", "carteira", { debit: true }),

  e("2026-09-25", "Salário · Empresa Aprendiz Ltda", 1320, "Salário", "itau"),
  e("2026-09-25", "Padaria Pão Quente", -9.9, "Alimentação", "itau", { debit: true }),
];

/** Três meses de renda para o arquétipo "renda variável" (L2b). Simulado. */
export const RENDA_VARIAVEL = [
  { month: "jul", cents: 90000 },
  { month: "ago", cents: 140000 },
  { month: "set", cents: 110000 },
];

/** Vezes que o Lucas guardou manualmente nos últimos 3 meses (carteira). */
export const GUARDOU_MANUAL = [
  { date: "2026-06-28", cents: 5000 },
  { date: "2026-07-27", cents: 5000 },
];

export const SIMULATED = {
  cdiYear: 0.105,
  inflationYear: 0.045,
  rotativoMonth: 0.13,
};
