export type LessonId = string;
export type UnitN = 1 | 2 | 3 | 4;

export type Step =
  | { kind: "info"; term: string; text: string; example?: string }
  | { kind: "choice"; q: string; options: string[]; right: number; why: string }
  | { kind: "tf"; q: string; right: boolean; why: string };

export type QuizQ = { q: string; options: string[]; right: number; why: string };

export type Lesson = {
  id: LessonId;
  unit: UnitN;
  title: string;
  learn: string;
  soon?: boolean;
  steps: Step[];
  deep: { title: string; text: string }[];
  quiz: QuizQ[];
};

export const UNITS: { n: UnitN; name: string; tagline: string; accent: string; soon?: boolean }[] = [
  { n: 1, name: "Primeiros passos", tagline: "O vocabulário do dinheiro no dia a dia", accent: "#EC7000" },
  { n: 2, name: "Organizar o mês", tagline: "Orçamento, contas e metas", accent: "#1F2A63", soon: true },
  { n: 3, name: "Crédito sem susto", tagline: "Cartão, parcelas, juros e score", accent: "#0B6E99", soon: true },
  { n: 4, name: "Guardar e investir", tagline: "Reserva, renda fixa e golpes", accent: "#6B3FA0", soon: true },
];

const U1: Omit<Lesson, "unit">[] = [
  {
    id: "L1",
    title: "Conta, saldo e extrato",
    learn: "As palavras que aparecem toda vez que você abre o app do banco.",
    steps: [
      { kind: "info", term: "Conta corrente", text: "É onde o dinheiro entra e sai no dia a dia: salário, Pix, compras no débito.", example: "“Caiu na conta” = entrou na conta corrente." },
      { kind: "info", term: "Saldo e extrato", text: "Saldo é quanto tem agora. Extrato é a lista de tudo que entrou e saiu.", example: "Sumiu dinheiro? Olhe o extrato, não só o saldo." },
      { kind: "choice", q: "Você quer ver onde gastou na semana. Onde olha?", options: ["No extrato", "No saldo", "No limite"], right: 0, why: "O extrato mostra cada entrada e saída com data." },
      { kind: "tf", q: "Limite da conta é dinheiro seu.", right: false, why: "É um empréstimo do banco (cheque especial) e cobra juros." },
      { kind: "choice", q: "No extrato, um valor com sinal de menos (−) é…", options: ["Uma saída", "Uma entrada", "Um rendimento"], right: 0, why: "Sinal de menos = dinheiro que saiu." },
    ],
    deep: [
      { title: "Saldo disponível x saldo total", text: "Alguns apps mostram o saldo junto com o limite. O número que é realmente seu é o saldo sem limite. Tudo acima disso é crédito." },
      { title: "Cheque especial", text: "Quando o saldo fica negativo, o banco cobre com o limite da conta e cobra juros por dia. É um dos créditos mais caros: melhor evitar ou usar só por pouquíssimo tempo." },
      { title: "Por que olhar o extrato", text: "Assinaturas esquecidas, tarifas e cobranças duplicadas aparecem no extrato. Uma olhada por semana já evita surpresa." },
    ],
    quiz: [
      { q: "Saldo é…", options: ["Quanto tem na conta agora", "O total que você ganhou no ano", "O limite do cartão"], right: 0, why: "Saldo é a foto do momento." },
      { q: "Cheque especial é…", options: ["Um empréstimo com juros", "Um bônus do banco", "Um tipo de Pix"], right: 0, why: "É o limite da conta, cobrado com juros." },
      { q: "O que mostra cada compra com data?", options: ["Extrato", "Saldo"], right: 0, why: "Extrato = histórico." },
      { q: "Achou uma cobrança que não reconhece no extrato. O que fazer?", options: ["Contestar com o banco", "Deixar pra lá"], right: 0, why: "Cobrança indevida pode ser contestada." },
    ],
  },
  {
    id: "L2",
    title: "Pix, TED e boleto",
    learn: "Os jeitos de mandar e pagar dinheiro, e quando usar cada um.",
    steps: [
      { kind: "info", term: "Pix", text: "Transferência instantânea, 24h, com chave: CPF, celular, e-mail ou chave aleatória.", example: "“Me passa sua chave” = me diz seu CPF/celular do Pix." },
      { kind: "info", term: "Boleto", text: "Um código de barras pra pagar uma conta até o vencimento. Depois disso pode ter multa e juros.", example: "Conta de luz, faculdade, compra online." },
      { kind: "choice", q: "Precisa mandar R$ 30 pro amigo agora, domingo à noite:", options: ["Pix", "Boleto", "Cheque"], right: 0, why: "Pix funciona 24h e cai na hora." },
      { kind: "tf", q: "Antes de confirmar um Pix, vale conferir o nome de quem vai receber.", right: true, why: "É a última chance de pegar erro ou golpe." },
      { kind: "choice", q: "Boleto pago depois do vencimento pode ter…", options: ["Multa e juros", "Desconto", "Cashback"], right: 0, why: "Atraso custa mais." },
    ],
    deep: [
      { title: "Chave Pix", text: "Você pode ter várias chaves ligadas à sua conta. Chave aleatória é útil pra não expor seu celular ou CPF para desconhecidos." },
      { title: "TED ainda existe?", text: "Sim, TED é a transferência entre bancos mais antiga. Hoje o Pix substitui quase sempre, mas TED ainda aparece em alguns pagamentos de empresas." },
      { title: "Pix Agendado e Pix Cobrança", text: "Dá pra agendar um Pix para o dia do aluguel, por exemplo. Algumas empresas mandam um QR Code com vencimento, parecido com um boleto." },
    ],
    quiz: [
      { q: "Qual dessas NÃO é chave Pix?", options: ["Senha do cartão", "Celular", "CPF"], right: 0, why: "Senha nunca é chave e nunca deve ser passada." },
      { q: "Pix funciona…", options: ["24h, todo dia", "Só em dia útil"], right: 0, why: "Inclusive fim de semana." },
      { q: "Pagar boleto atrasado geralmente…", options: ["Custa mais", "Custa menos"], right: 0, why: "Multa + juros." },
      { q: "Pra não expor seu celular, use…", options: ["Chave aleatória", "Senha"], right: 0, why: "É um código gerado pelo banco." },
    ],
  },
  {
    id: "L3",
    title: "Débito, crédito e fatura",
    learn: "A diferença entre pagar agora e pagar depois.",
    steps: [
      { kind: "info", term: "Débito", text: "Sai da conta na hora. Só gasta o que tem.", example: "Passou no débito, o saldo já diminuiu." },
      { kind: "info", term: "Crédito e fatura", text: "No crédito você paga depois. Todas as compras do mês somam na fatura, que vence numa data fixa.", example: "“Fechou a fatura” = acabou o período de compras daquele mês." },
      { kind: "tf", q: "Limite do cartão é dinheiro extra que você ganhou.", right: false, why: "É quanto o banco empresta até você pagar a fatura." },
      { kind: "choice", q: "Se pagar só o mínimo da fatura, o resto vai pro…", options: ["Rotativo, com juros altos", "Cofrinho", "Saldo"], right: 0, why: "O rotativo é um dos juros mais caros do país." },
      { kind: "choice", q: "“Melhor data de compra” significa…", options: ["Dia que dá mais prazo até pagar", "Dia com desconto nas lojas"], right: 0, why: "Comprar nesse dia joga pra fatura seguinte." },
    ],
    deep: [
      { title: "Fechamento x vencimento", text: "O fechamento é quando a fatura para de receber compras. O vencimento é o dia de pagar, alguns dias depois. Compras após o fechamento vão pro mês seguinte." },
      { title: "Parcelado soma", text: "Cada parcela entra em uma fatura futura. Várias compras parceladas ao mesmo tempo podem apertar os próximos meses." },
      { title: "Regra de ouro", text: "Pague a fatura inteira. Se não der, fale com o banco e compare o parcelamento da fatura antes de cair no rotativo." },
    ],
    quiz: [
      { q: "Débito tira o dinheiro…", options: ["Na hora", "No mês que vem"], right: 0, why: "Direto da conta." },
      { q: "A fatura reúne…", options: ["As compras no crédito", "Os Pix recebidos"], right: 0, why: "É a conta do cartão." },
      { q: "Pagar o valor mínimo leva ao…", options: ["Rotativo", "Cashback"], right: 0, why: "E aos juros." },
      { q: "Compra depois do fechamento entra…", options: ["Na próxima fatura", "Na fatura já fechada"], right: 0, why: "Por isso ganha mais prazo." },
    ],
  },
  {
    id: "L4",
    title: "Holerite: bruto e líquido",
    learn: "Como ler o contracheque e entender por que cai menos do que o combinado.",
    steps: [
      { kind: "info", term: "Holerite (contracheque)", text: "O documento que mostra quanto você ganhou e o que foi descontado no mês.", example: "O RH manda todo mês, em PDF ou num app." },
      { kind: "info", term: "Bruto x líquido", text: "Bruto é o salário do contrato. Líquido é o que cai na conta depois dos descontos.", example: "Contrato de R$ 1.800 → cai uns R$ 1.650." },
      { kind: "choice", q: "Qual desconto aparece em quase todo holerite CLT?", options: ["INSS", "IPVA", "IPTU"], right: 0, why: "Vai pra aposentadoria e benefícios do INSS." },
      { kind: "tf", q: "Vale-transporte pode descontar até 6% do salário.", right: true, why: "Se você usa VT, a empresa pode descontar até 6% do bruto." },
      { kind: "choice", q: "Numa proposta de emprego, a pergunta mais útil é…", options: ["Esse valor é bruto ou líquido?", "Tem café?"], right: 0, why: "Assim você planeja com o valor real." },
    ],
    deep: [
      { title: "Proventos e descontos", text: "O holerite tem duas colunas: proventos (o que você recebe: salário, hora extra, adicional) e descontos (INSS, IR, VT, plano de saúde). Líquido = proventos − descontos." },
      { title: "INSS e IR em faixas", text: "Os dois são calculados em faixas progressivas. No começo da carreira é comum ter só INSS e nenhum IR." },
      { title: "Confira todo mês", text: "Erro de folha acontece. Se um desconto parecer estranho, fale com o RH: dá pra corrigir." },
    ],
    quiz: [
      { q: "Salário líquido é…", options: ["O que cai na conta", "O valor do contrato"], right: 0, why: "Bruto menos descontos." },
      { q: "Onde aparecem os descontos do mês?", options: ["No holerite", "No extrato do cartão"], right: 0, why: "Contracheque." },
      { q: "“Proventos” no holerite são…", options: ["O que você recebe", "O que é descontado"], right: 0, why: "Salário, hora extra etc." },
      { q: "Desconto estranho no holerite:", options: ["Falar com o RH", "Ignorar"], right: 0, why: "Pode ser erro." },
    ],
  },
  {
    id: "L5",
    title: "CLT, estágio e PJ",
    learn: "Os tipos de contrato mais comuns no primeiro emprego e o que muda no bolso.",
    steps: [
      { kind: "info", term: "CLT (carteira assinada)", text: "Contrato com direitos garantidos: 13º, férias, FGTS, INSS.", example: "“Vaga efetiva” quase sempre é CLT." },
      { kind: "info", term: "Estágio e PJ", text: "Estágio tem bolsa e não é CLT. PJ é quando você presta serviço como empresa e emite nota.", example: "PJ recebe “cheio”, mas paga os próprios impostos." },
      { kind: "choice", q: "Quem tem direito a FGTS?", options: ["CLT", "Estagiário", "PJ"], right: 0, why: "FGTS é um direito do contrato CLT." },
      { kind: "tf", q: "PJ precisa guardar dinheiro pra impostos e férias por conta própria.", right: true, why: "Não tem 13º nem férias pagas." },
      { kind: "choice", q: "Estagiário recebe…", options: ["Bolsa-auxílio", "Salário CLT com FGTS"], right: 0, why: "E tem direito a recesso remunerado." },
    ],
    deep: [
      { title: "Comparando propostas", text: "R$ 3.000 como PJ não é igual a R$ 3.000 CLT. No CLT, 13º, férias e FGTS somam quase 40% a mais no ano. Compare o total anual, não só o mensal." },
      { title: "MEI", text: "Muitos PJ começam como MEI: imposto fixo mensal (DAS), limite de faturamento anual e algumas atividades permitidas." },
      { title: "Estágio", text: "Tem limite de jornada, recesso de 30 dias por ano e, em geral, auxílio-transporte. Não tem FGTS nem 13º obrigatório." },
    ],
    quiz: [
      { q: "13º salário é direito de…", options: ["CLT", "PJ"], right: 0, why: "PJ não tem 13º." },
      { q: "PJ geralmente emite…", options: ["Nota fiscal", "Holerite"], right: 0, why: "Presta serviço como empresa." },
      { q: "Pra comparar CLT x PJ, olhe…", options: ["O total do ano com benefícios", "Só o valor do mês"], right: 0, why: "Benefícios mudam a conta." },
      { q: "Estagiário tem…", options: ["Recesso remunerado", "FGTS"], right: 0, why: "30 dias por ano." },
    ],
  },
  {
    id: "L6",
    title: "VR, VA e VT",
    learn: "Os benefícios que vêm em cartão e as regras de cada um.",
    steps: [
      { kind: "info", term: "VR (vale-refeição)", text: "Pra comer fora: restaurante, lanchonete.", example: "Aquele cartão que você usa no almoço." },
      { kind: "info", term: "VA e VT", text: "VA (vale-alimentação) é pra mercado. VT (vale-transporte) é pra ônibus, metrô e trem até o trabalho." },
      { kind: "choice", q: "Compra do mês no mercado. Qual cartão?", options: ["VA", "VR", "VT"], right: 0, why: "VA é pra alimentação em mercado." },
      { kind: "tf", q: "Benefício é o mesmo que salário.", right: false, why: "Benefícios têm uso específico e, em geral, não entram no cálculo do 13º." },
      { kind: "choice", q: "Vender o VR por dinheiro…", options: ["É proibido e pode dar problema", "É normal"], right: 0, why: "É desvio de finalidade." },
    ],
    deep: [
      { title: "Por que benefício ajuda o orçamento", text: "Se o almoço sai do VR e o mercado sai do VA, o salário fica livre pra contas e objetivos. Some os benefícios no seu orçamento." },
      { title: "VT tem desconto", text: "A empresa pode descontar até 6% do salário bruto pelo VT. Se você gasta menos que isso com transporte, pode valer abrir mão." },
      { title: "Outros benefícios", text: "Plano de saúde, auxílio home office, Gympass e PLR (participação nos lucros) também aparecem. Pergunte quais são na contratação." },
    ],
    quiz: [
      { q: "VR é pra…", options: ["Restaurante", "Mercado"], right: 0, why: "Refeição." },
      { q: "VT é pra…", options: ["Transporte até o trabalho", "Viagem de férias"], right: 0, why: "Deslocamento casa–trabalho." },
      { q: "A empresa pode descontar pelo VT até…", options: ["6% do bruto", "50% do bruto"], right: 0, why: "Limite legal." },
      { q: "PLR é…", options: ["Participação nos lucros", "Um tipo de Pix"], right: 0, why: "Pago quando a empresa bate metas." },
    ],
  },
  {
    id: "L7",
    title: "13º, férias e FGTS",
    learn: "O dinheiro que chega fora do salário normal e como não torrar tudo.",
    steps: [
      { kind: "info", term: "13º salário", text: "Um salário a mais por ano, pago em duas parcelas: até novembro e até dezembro.", example: "Trabalhou 6 meses? Recebe metade." },
      { kind: "info", term: "Férias e FGTS", text: "Férias vêm com 1/3 a mais. FGTS é um depósito de 8% do salário numa conta na Caixa, que você usa em casos específicos." },
      { kind: "tf", q: "Nas férias você recebe o salário + 1/3.", right: true, why: "É o terço constitucional." },
      { kind: "choice", q: "Quem deposita o FGTS?", options: ["A empresa", "Você", "O banco"], right: 0, why: "8% do salário, todo mês, sem descontar de você." },
      { kind: "choice", q: "Um bom destino pra parte do 13º:", options: ["Cofrinho ou quitar dívidas", "Gastar tudo no primeiro dia"], right: 0, why: "Dinheiro extra acelera objetivos." },
    ],
    deep: [
      { title: "Quando dá pra sacar o FGTS", text: "Demissão sem justa causa, compra da casa própria, aposentadoria e o saque-aniversário (se você optar). Vale entender as regras antes de escolher." },
      { title: "Férias adiantam o salário", text: "O pagamento de férias sai antes delas começarem. No mês seguinte, pode parecer que o dinheiro não veio: planeje." },
      { title: "Regra dos três terços", text: "Uma ideia simples para dinheiro extra: um terço pro presente, um terço pra dívida ou reserva, um terço pro objetivo." },
    ],
    quiz: [
      { q: "O 13º é pago…", options: ["Em até duas parcelas no fim do ano", "Todo mês"], right: 0, why: "Novembro e dezembro." },
      { q: "Férias pagam…", options: ["Salário + 1/3", "Meio salário"], right: 0, why: "Terço de férias." },
      { q: "FGTS é depositado…", options: ["Pela empresa", "Pelo trabalhador"], right: 0, why: "8% do salário." },
      { q: "Depois das férias, o salário do mês seguinte…", options: ["Pode parecer menor", "Dobra"], right: 0, why: "Porque foi adiantado." },
    ],
  },
  {
    id: "L8",
    title: "Cofrinho: guardar pra um objetivo",
    learn: "Separar dinheiro com nome e data pra ele não sumir no mês.",
    steps: [
      { kind: "info", term: "Cofrinho", text: "Um espaço dentro da conta pra separar dinheiro com nome: “Viagem”, “Celular novo”.", example: "O saldo do dia a dia fica separado do que é pro sonho." },
      { kind: "info", term: "Pague-se primeiro", text: "Guarde no dia em que o dinheiro cai, não no fim do mês. O que “sobra” no fim do mês costuma ser nada." },
      { kind: "choice", q: "Celular de R$ 1.800 guardando R$ 150/mês leva…", options: ["12 meses", "3 meses", "5 anos"], right: 0, why: "1.800 ÷ 150 = 12." },
      { kind: "tf", q: "Dar nome ao cofrinho ajuda a não mexer nele.", right: true, why: "Dinheiro com destino é mais difícil de gastar." },
      { kind: "choice", q: "Quer chegar mais rápido. O que muda?", options: ["Guardar mais por mês", "Torcer", "Nada"], right: 0, why: "Valor mensal maior encurta o prazo." },
    ],
    deep: [
      { title: "Objetivo com número", text: "Um bom objetivo tem valor, prazo e quanto guardar por mês. “Guardar pra viagem” vira “R$ 1.500 até julho, R$ 250 por mês”." },
      { title: "Automático ganha", text: "Programe um valor pra ir pro cofrinho todo dia de pagamento. Lembrar falha; automático não." },
      { title: "Comece pequeno", text: "R$ 20 por mês já cria o hábito. Depois aumenta quando o orçamento deixar." },
    ],
    quiz: [
      { q: "Cofrinho serve pra…", options: ["Separar dinheiro com objetivo", "Aumentar o limite"], right: 0, why: "Organiza o que é pro sonho." },
      { q: "R$ 1.200 em 6 meses exige por mês…", options: ["R$ 200", "R$ 100", "R$ 600"], right: 0, why: "1.200 ÷ 6." },
      { q: "Melhor momento pra guardar:", options: ["Quando o dinheiro cai", "No fim do mês"], right: 0, why: "Pague-se primeiro." },
      { q: "Pra não esquecer, o ideal é…", options: ["Deixar automático", "Contar com a memória"], right: 0, why: "Programado no dia do salário." },
    ],
  },
  {
    id: "L9",
    title: "Rendimento, CDI e liquidez",
    learn: "O que significa “rende 100% do CDI” e por que dinheiro parado perde valor.",
    steps: [
      { kind: "info", term: "Rendimento", text: "O quanto o dinheiro guardado cresce sozinho com o tempo.", example: "Cofrinho que rende = dinheiro trabalhando por você." },
      { kind: "info", term: "CDI e liquidez", text: "CDI é a taxa de referência dos bancos, próxima da Selic. Liquidez é o quão rápido você consegue resgatar.", example: "“Liquidez diária” = tira quando quiser." },
      { kind: "choice", q: "“Rende 100% do CDI” significa…", options: ["Acompanha a taxa CDI", "Dobra o dinheiro"], right: 0, why: "Pegadinha clássica: não é 100% ao ano." },
      { kind: "tf", q: "Dinheiro parado na conta corrente mantém o poder de compra.", right: false, why: "A inflação faz ele comprar menos com o tempo." },
      { kind: "choice", q: "Pra reserva de emergência, o mais importante é…", options: ["Liquidez diária", "Prazo de 5 anos"], right: 0, why: "Emergência não espera." },
    ],
    deep: [
      { title: "105% do CDI é melhor que 100%?", text: "Sim: rende 5% a mais do que a taxa de referência. Aqui na Academia, cumprir a missão do mês deixa o cofrinho em 105% do CDI (condição simulada no protótipo)." },
      { title: "Inflação", text: "É o aumento geral dos preços, medido pelo IPCA. Se o rendimento for menor que a inflação, o dinheiro perde valor mesmo crescendo." },
      { title: "Imposto e proteção", text: "Produtos como CDB pagam IR sobre o rendimento, menor quanto mais tempo. Muitos têm garantia do FGC até o limite por CPF e instituição." },
    ],
    quiz: [
      { q: "Liquidez é…", options: ["Facilidade de resgatar", "O rendimento"], right: 0, why: "Quão rápido vira dinheiro." },
      { q: "105% do CDI rende…", options: ["Mais que 100% do CDI", "Menos que 100% do CDI"], right: 0, why: "5% acima da referência." },
      { q: "Inflação alta e dinheiro parado:", options: ["Perde poder de compra", "Ganha valor"], right: 0, why: "Compra menos." },
      { q: "O índice oficial de inflação é o…", options: ["IPCA", "CPF"], right: 0, why: "Medido pelo IBGE." },
    ],
  },
  {
    id: "L10",
    title: "Orçamento: fixo x variável",
    learn: "Montar o mês sabendo o que já tem dono e onde dá pra ajustar.",
    steps: [
      { kind: "info", term: "Gasto fixo", text: "Vem todo mês quase igual: aluguel, celular, faculdade, assinaturas." },
      { kind: "info", term: "Gasto variável", text: "Muda a cada mês: delivery, rolê, uber, roupa. É onde dá pra ajustar mais rápido.", example: "Teto semanal de delivery funciona melhor que mensal." },
      { kind: "choice", q: "Plano de celular é gasto…", options: ["Fixo", "Variável"], right: 0, why: "Mesmo valor todo mês." },
      { kind: "choice", q: "Delivery é gasto…", options: ["Variável", "Fixo"], right: 0, why: "Depende de cada pedido." },
      { kind: "tf", q: "Contas em dia evitam multa e ajudam seu score.", right: true, why: "Pagamento em dia é o que mais pesa." },
    ],
    deep: [
      { title: "A conta do mês", text: "Líquido − fixos = o que você tem pra escolher. Desse valor, separe primeiro o cofrinho; o resto é o variável." },
      { title: "50-30-20 como ponto de partida", text: "50% essencial, 30% pra você, 20% pro futuro. Adapte: quem mora com a família pode guardar mais." },
      { title: "Débito automático", text: "Contas fixas no débito automático evitam esquecimento e multa. Só confira se o saldo cobre no dia." },
    ],
    quiz: [
      { q: "Aluguel é gasto…", options: ["Fixo", "Variável"], right: 0, why: "Vem todo mês." },
      { q: "Onde dá pra economizar mais rápido?", options: ["Nos variáveis", "Nos fixos"], right: 0, why: "Muda na próxima escolha." },
      { q: "Líquido − fixos =", options: ["O que dá pra escolher", "O limite do cartão"], right: 0, why: "Seu espaço de decisão." },
      { q: "Débito automático ajuda a…", options: ["Não atrasar contas", "Aumentar o salário"], right: 0, why: "Evita esquecimento." },
    ],
  },
];

const SOON: Record<Exclude<UnitN, 1>, string[]> = {
  2: ["Regra 50-30-20", "Contas em dia", "Assinaturas", "Meta do mês", "Dividir contas"],
  3: ["Rotativo e parcelado", "Juros compostos", "Score", "Empréstimo x cheque especial", "Renegociar dívidas"],
  4: ["Reserva de emergência", "Tesouro e CDB", "Golpes no Pix", "Inflação no bolso", "Primeiro investimento"],
};

export const LESSONS: Lesson[] = [
  ...U1.map((l) => ({ ...l, unit: 1 as UnitN })),
  ...([2, 3, 4] as const).flatMap((u) =>
    SOON[u].map((title, i) => ({ id: `U${u}L${i + 1}`, unit: u, title, learn: "Em breve na academIA.I.", soon: true, steps: [], deep: [], quiz: [] })),
  ),
];

export const PLAYABLE = LESSONS.filter((l) => !l.soon);

export type UnitDeep = { title: string; text: string };

export const UNIT_DEEP: Partial<Record<UnitN, UnitDeep[]>> = {
  1: [
    { title: "O mapa do seu dinheiro", text: "Dinheiro entra (salário, bolsa, Pix), passa pela conta e sai (contas fixas, gastos do dia a dia). Saber o nome de cada pedaço — saldo, extrato, fatura, holerite — é o que deixa você decidir em vez de só reagir." },
    { title: "Bruto não é o que cai", text: "O salário bruto vira líquido depois de INSS, IR e benefícios. Planeje sempre com o líquido. 13º, férias e FGTS são entradas extras ou protegidas: ótimas pra adiantar um objetivo." },
    { title: "Guardar é separar, não perder", text: "Um cofrinho é dinheiro seu, separado do dia a dia e rendendo. Se ele rende 100% do CDI, acompanha a taxa básica de juros. Liquidez diária significa que dá pra resgatar quando precisar." },
    { title: "Fixo primeiro, objetivo junto", text: "Some os gastos fixos, veja quanto sobra e defina um valor pro objetivo logo que o dinheiro entra. Pouco e todo mês vence muito e de vez em quando." },
  ],
};

export const UNIT_QUIZ_PASS = 7;
export const UNIT_POINTS_PER_RIGHT = 20;

export function unitQuiz(unit: UnitN): QuizQ[] {
  return LESSONS.filter((l) => l.unit === unit && !l.soon).map((l) => l.quiz[1] ?? l.quiz[0]);
}

export const unitQuizPoints = (unit: UnitN, correct: number | undefined) =>
  correct !== undefined && correct >= UNIT_QUIZ_PASS ? Math.min(correct, unitQuiz(unit).length) * UNIT_POINTS_PER_RIGHT : 0;

export type MissionKind = "semanal" | "mensal";
export type MissionDef = { id: string; kind: MissionKind; title: string; text: string; points: number; unlock: LessonId; reward?: string };

export const MISSIONS: MissionDef[] = [
  { id: "w-licoes", kind: "semanal", title: "2 lições na semana", text: "Faça 2 lições da trilha até domingo", points: 30, unlock: "L1" },
  { id: "w-guardar", kind: "semanal", title: "Guardar no cofrinho", text: "Guarde qualquer valor no cofrinho do seu objetivo nesta semana", points: 30, unlock: "L1" },
  {
    id: "m-mes",
    kind: "mensal",
    title: "Guardar e deixar as contas em dia",
    text: "Guarde pelo menos R$ 20 no cofrinho do objetivo e pague as contas do mês até o vencimento",
    points: 0,
    unlock: "L8",
    reward: "Cofrinho do objetivo rendendo 105% do CDI no mês seguinte",
  },
];

export type GoalDef = { id: string; label: string; cents: number; from: string; to: string; line: string };

export const GOALS: GoalDef[] = [
  { id: "celular", label: "Celular novo", cents: 180000, from: "#1F2A63", to: "#3A4FB8", line: "Trocar de celular sem parcelar no cartão." },
  { id: "viagem", label: "Viagem com a galera", cents: 150000, from: "#0B6E99", to: "#19A7B8", line: "Passagem, hospedagem e role garantidos." },
  { id: "festival", label: "Show ou festival", cents: 80000, from: "#6B3FA0", to: "#C2459B", line: "Ingresso comprado no 1º lote, sem aperto." },
  { id: "notebook", label: "Notebook pra estudar", cents: 350000, from: "#243447", to: "#4B6584", line: "Ferramenta de trabalho e estudo." },
  { id: "curso", label: "Curso ou faculdade", cents: 240000, from: "#00574F", to: "#00857A", line: "Investir em você mesmo." },
  { id: "moto", label: "Moto ou carro", cents: 900000, from: "#7A2E0E", to: "#C4501B", line: "Entrada de um veículo sem juros altos." },
  { id: "casa", label: "Sair de casa", cents: 500000, from: "#8A4B00", to: "#EC7000", line: "Caução, mudança e primeiros móveis." },
  { id: "reserva", label: "Reserva de emergência", cents: 300000, from: "#1B5E20", to: "#43A047", line: "Um colchão pra imprevistos." },
];
export type GoalId = string;

export const CATCHPHRASES = [
  "5 minutos por lição. Zero juridiquês.",
  "Aprende o vocabulário do dinheiro e vê seu objetivo enchendo.",
  "Missão do mês cumprida = cofrinho rendendo 105% do CDI.",
  "Desafio no fim da unidade vale Pontos Itaú.",
  "Holerite, FGTS, CDI: agora faz sentido.",
];

export const CDI_YEAR = 0.105;

export const POINT_BRL = 0.02;

export const MV_LEVELS = [0, 4, 12, 24, 44];

export type PassoCat = "aprender" | "pagar" | "cartao" | "guardar" | "proteger" | "economizar";
export const PASSO_CATS: { id: PassoCat; title: string; max: number }[] = [
  { id: "aprender", title: "Aprender com a academIA.I", max: 3 },
  { id: "pagar", title: "Pagar e receber", max: 9 },
  { id: "cartao", title: "Usar cartão", max: 13 },
  { id: "guardar", title: "Guardar dinheiro e ter rendimento", max: 6 },
  { id: "proteger", title: "Proteger seu dinheiro e seus bens", max: 4 },
  { id: "economizar", title: "Economizar", max: 1 },
];

export const MV_BENEFITS: { level: number; items: { title: string; detail: string }[] }[] = [
  { level: 1, items: [
    { title: "Até 70% de desconto em farmácias e exames", detail: "Rede parceira" },
    { title: "Cashback em mais de 150 lojas parceiras", detail: "Em Pontos Itaú, pelo Itaú Shop" },
  ] },
  { level: 2, items: [
    { title: "R$ 10 de desconto + frete grátis no Appgas", detail: "Parceiro" },
    { title: "Desconto em instituições de ensino", detail: "Parceiros de educação" },
    { title: "1 viagem grátis com Bike Itaú", detail: "Por mês" },
  ] },
  { level: 3, items: [
    { title: "R$ 10 de desconto no Itaú Shop", detail: "Cupom mensal" },
    { title: "25% de desconto em viagens de ônibus", detail: "Parceiro" },
    { title: "Até 60% de desconto em cinema", detail: "Rede parceira" },
  ] },
  { level: 4, items: [
    { title: "R$ 10 de desconto na Uber", detail: "Cupom mensal" },
    { title: "R$ 25 de desconto no Itaú Shop", detail: "Cupom mensal" },
  ] },
  { level: 5, items: [
    { title: "R$ 20 de desconto na Uber", detail: "Cupom mensal" },
    { title: "R$ 20 de desconto no Assaí", detail: "Cupom mensal" },
    { title: "R$ 40 de desconto no Itaú Shop", detail: "Cupom mensal" },
  ] },
];
