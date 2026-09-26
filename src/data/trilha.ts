export type LessonId = "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7" | "L8" | "L9" | "L10" | "L11" | "L12";
export type ModuleN = 1 | 2 | 3 | 4;

export type Lesson = {
  id: LessonId;
  module: ModuleN;
  title: string;
  hook: string;
  practice: string;
  points: number;
};

export const MODULES: { n: ModuleN; name: string; tagline: string }[] = [
  { n: 1, name: "O básico", tagline: "Entender pra onde o dinheiro vai antes de qualquer coisa." },
  { n: 2, name: "Guardar", tagline: "Reserva, objetivo e o tempo trabalhando a seu favor." },
  { n: 3, name: "Crédito sem susto", tagline: "Pix, débito, cartão e como não cair no rotativo." },
  { n: 4, name: "Proteger e crescer", tagline: "Golpes, inflação e o primeiro investimento." },
];

export const LESSONS: Lesson[] = [
  { id: "L1", module: 1, title: "Salário bruto x líquido", hook: "Por que cai menos do que o combinado?", practice: "Simular seu holerite", points: 50 },
  { id: "L2", module: 1, title: "A regra 50-30-20", hook: "Um jeito simples de dividir o mês.", practice: "Dividir a sua renda", points: 50 },
  { id: "L3", module: 1, title: "Fixo x variável", hook: "Tem gasto que já tem dono.", practice: "Separar 6 gastos", points: 100 },
  { id: "L4", module: 2, title: "Reserva de emergência", hook: "O celular vai quebrar no pior dia.", practice: "Calcular a sua reserva", points: 100 },
  { id: "L5", module: 2, title: "Objetivo com prazo", hook: "Sonho sem data é só vontade.", practice: "Montar um objetivo", points: 100 },
  { id: "L6", module: 2, title: "Juros compostos", hook: "Pouco + tempo = muito.", practice: "Ver o tempo trabalhar", points: 150 },
  { id: "L7", module: 3, title: "Pix, débito ou crédito?", hook: "Cada um tem sua hora.", practice: "Escolher em 3 situações", points: 50 },
  { id: "L8", module: 3, title: "O rotativo do cartão", hook: "Como R$ 300 viram R$ 600.", practice: "Simular uma fatura", points: 100 },
  { id: "L9", module: 3, title: "Score sem mistério", hook: "O que sobe e o que derruba.", practice: "Mito ou verdade", points: 100 },
  { id: "L10", module: 4, title: "Golpes no Pix", hook: "Urgência é o truque número 1.", practice: "Achar o golpe", points: 100 },
  { id: "L11", module: 4, title: "Inflação", hook: "Seu dinheiro parado encolhe.", practice: "Ver o poder de compra cair", points: 100 },
  { id: "L12", module: 4, title: "Primeiro investimento", hook: "Poupança, CDB ou Tesouro?", practice: "Comparar em 12 meses", points: 200 },
];

export const GOALS = [
  { id: "celular", label: "Celular novo", cents: 180000 },
  { id: "casa", label: "Sair de casa", cents: 300000 },
  { id: "viagem", label: "Viagem", cents: 150000 },
  { id: "curso", label: "Curso / faculdade", cents: 240000 },
  { id: "divida", label: "Pagar uma dívida", cents: 60000 },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];

export const FEELINGS = [
  { id: "tranquilo", label: "De boa" },
  { id: "perdido", label: "Meio perdido" },
  { id: "vermelho", label: "No vermelho" },
] as const;
export type FeelingId = (typeof FEELINGS)[number]["id"];

export const LEVELS = [0, 200, 500, 900, 1400];

export type Reward = { id: string; title: string; detail: string; level: number };

export const REWARDS: Reward[] = [
  { id: "r-delivery", title: "R$ 10 off no delivery", detail: "Cupom de uso único em app parceiro", level: 2 },
  { id: "r-musica", title: "1 mês de streaming de música", detail: "Plano individual, parceiro", level: 2 },
  { id: "r-cinema", title: "Meia-entrada no cinema", detail: "2 por mês em rede parceira", level: 3 },
  { id: "r-transporte", title: "5% de volta em corridas", detail: "Em pontos, todo mês", level: 3 },
  { id: "r-shows", title: "20% off em ingressos de shows", detail: "Em eventos parceiros", level: 4 },
  { id: "r-frete", title: "Frete grátis em delivery", detail: "4 por mês", level: 4 },
  { id: "r-festival", title: "Pré-venda de festivais", detail: "Acesso antecipado em eventos parceiros", level: 5 },
];

export const NEXT_TRAILS = [
  { id: "investir", title: "Investir além do básico", text: "Tesouro, fundos e o que é risco de verdade" },
  { id: "morar", title: "Morar sozinho", text: "Aluguel, contas e divisão com amigos" },
  { id: "renda", title: "Renda extra e MEI", text: "Freela, imposto e nota fiscal" },
] as const;

export const CATCHPHRASES = [
  "60 segundos por dia. Zero juridiquês.",
  "Não é aula chata. É dinheiro explicado do jeito que você fala.",
  "Aprende no seu ritmo e ganha pontos no Minhas Vantagens.",
  "Salário cai, some e você nem viu? Bora entender.",
  "Juros compostos: o crush que o seu dinheiro precisa.",
  "Golpe do Pix? Aprende a farejar em 1 minuto.",
];
