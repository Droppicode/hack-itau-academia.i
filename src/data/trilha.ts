export type LessonId = "L1" | "L2" | "L2b" | "L3" | "L4" | "L5" | "L6" | "L7" | "L8" | "L9" | "L10" | "L11" | "L12";

export type Lesson = {
  id: LessonId;
  module: 1 | 2 | 3 | 4;
  title: string;
  hook: string;
  action: string;
  points: number;
  reward?: string;
  conditional?: boolean;
  needsAporte?: boolean;
};

export const MODULES = [
  { n: 1, name: "Entender", days: "dias 1–21", tagline: "Nada é oferecido aqui. Só você entendendo seu dinheiro." },
  { n: 2, name: "Guardar", days: "dias 22–45", tagline: "Seu dinheiro trabalhando, sem prender nada." },
  { n: 3, name: "Usar", days: "dias 46–70", tagline: "Pagar do jeito certo e fugir de pegadinha." },
  { n: 4, name: "Centralizar", days: "dias 71–90", tagline: "Tudo num lugar só — se fizer sentido pra você." },
] as const;

export const LESSONS: Lesson[] = [
  { id: "L1", module: 1, title: "O caminho do seu dinheiro", hook: "Pra onde foi o seu salário?", action: "Ver o extrato categorizado", points: 50 },
  { id: "L2", module: 1, title: "Gasto que você escolhe x gasto já escolhido", hook: "Quanto do mês já tá comprometido?", action: "Marcar seus gastos fixos", points: 50 },
  { id: "L2b", module: 1, title: "Mês bom, mês ruim", hook: "Sua renda muda. Seu fixo, não.", action: "Criar o pote “colchão do mês ruim”", points: 50, conditional: true },
  { id: "L3", module: 1, title: "Quanto sobra de verdade", hook: "Sua sobra vira objetivo.", action: "Criar seu objetivo", points: 100, reward: "1º benefício no Minhas Vantagens" },
  { id: "L4", module: 2, title: "Dinheiro parado encolhe", hook: "Parado, seu dinheiro perde valor.", action: "Primeira aplicação a partir de R$ 20", points: 100 },
  { id: "L5", module: 2, title: "Preso x disponível", hook: "Dá pra tirar quando quiser?", action: "Simular um resgate", points: 50 },
  { id: "L6", module: 2, title: "O que acontece sozinho, acontece", hook: "Automatizar > lembrar.", action: "Ligar o aporte recorrente", points: 150, reward: "Benefício recorrente" },
  { id: "L7", module: 3, title: "Pix, débito e crédito não são a mesma coisa", hook: "Cada um tem seu momento.", action: "Cartão Itaú na carteira do celular", points: 50 },
  { id: "L8", module: 3, title: "Como uma dívida pequena vira grande", hook: "O rotativo não perdoa.", action: "Ativar alerta de fatura e limite de gasto", points: 100 },
  { id: "L9", module: 3, title: "Benefício de verdade x pegadinha", hook: "Cashback, ponto, desconto: qual vale?", action: "Ativar um benefício que combina com você", points: 100, reward: "Sobe de nível" },
  { id: "L10", module: 4, title: "O mês ruim vai chegar", hook: "Reserva é paz no dia 24.", action: "Criar o pote reserva", points: 100 },
  { id: "L11", module: 4, title: "Sua vida financeira tá espalhada", hook: "Quer ver tudo junto?", action: "Conectar o Open Finance (se quiser)", points: 150, needsAporte: true },
  { id: "L12", module: 4, title: "Onde o seu salário deveria cair", hook: "Seu dinheiro já ficou aqui.", action: "Deixar o Itaú como conta do salário", points: 200, reward: "Nível máximo", needsAporte: true },
];

export const GOALS = [
  { id: "celular", label: "Celular novo", cents: 180000 },
  { id: "casa", label: "Sair de casa", cents: 300000 },
  { id: "viagem", label: "Viagem", cents: 150000 },
  { id: "divida", label: "Pagar uma dívida", cents: 60000 },
  { id: "naosei", label: "Ainda não sei", cents: 100000 },
] as const;

export type GoalId = (typeof GOALS)[number]["id"];

export type Reward = {
  id: string;
  title: string;
  detail: string;
  tier: 1 | 2 | 3 | 4;
  unlock: LessonId;
  recurring?: boolean;
};

export const REWARDS: Reward[] = [
  { id: "r-delivery", title: "R$ 10 off no delivery", detail: "Cupom de uso único em app parceiro", tier: 1, unlock: "L3" },
  { id: "r-musica", title: "1 mês de streaming de música", detail: "Plano individual, parceiro", tier: 1, unlock: "L3" },
  { id: "r-transporte", title: "5% de volta em corridas", detail: "Renova todo mês enquanto o aporte estiver ligado", tier: 2, unlock: "L6", recurring: true },
  { id: "r-cinema", title: "Meia-entrada no cinema", detail: "2 por mês em rede parceira · renova com o aporte", tier: 2, unlock: "L6", recurring: true },
  { id: "r-lazer", title: "20% off em ingressos de shows", detail: "Escolhido pelos seus gastos com lazer", tier: 3, unlock: "L9", recurring: true },
  { id: "r-frete", title: "Frete grátis em delivery", detail: "4 por mês · renova com o aporte", tier: 3, unlock: "L9", recurring: true },
  { id: "r-festival", title: "Pré-venda de festivais", detail: "Acesso antecipado em eventos parceiros", tier: 4, unlock: "L12", recurring: true },
];

export const NEXT_TRAILS = [
  { id: "reserva", title: "Reserva maior", text: "Chegar em 3 meses de fixo guardados" },
  { id: "cartao", title: "Primeiro cartão de crédito com teto", text: "Limite que você escolhe, alerta em tudo" },
  { id: "investir", title: "Investir além do CDB", text: "Tesouro, fundos e o que é risco de verdade" },
] as const;

export const CATCHPHRASES = [
  "Seu salário caiu ontem. Ele vai sumir ou vai trabalhar pra você?",
  "60 segundos. Zero juridiquês. Com o seu extrato, não com exemplo de livro.",
  "Seu dinheiro tem um caminho. Bora ver?",
  "Aprende no seu ritmo e ganha pontos no Minhas Vantagens.",
  "Não é aula. É o seu extrato te explicando.",
];
