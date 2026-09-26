export type LessonId = "L1" | "L2" | "L3" | "L4" | "L5" | "L6" | "L7" | "L8" | "L9" | "L10" | "L11" | "L12";
export type UnitN = 1 | 2 | 3 | 4;

export type Step =
  | { kind: "info"; title: string; text: string }
  | { kind: "choice"; q: string; options: string[]; right: number; why: string }
  | { kind: "tf"; q: string; right: boolean; why: string };

export type QuizQ = { q: string; options: string[]; right: number; why: string };

export type Lesson = {
  id: LessonId;
  unit: UnitN;
  title: string;
  steps: Step[];
  deep: { title: string; text: string }[];
  quiz: QuizQ[];
};

export const UNITS: { n: UnitN; name: string; tagline: string; color: string; ring: string }[] = [
  { n: 1, name: "O básico", tagline: "Pra onde o dinheiro vai", color: "bg-[#FF6200]", ring: "#FF6200" },
  { n: 2, name: "Guardar", tagline: "Reserva, objetivo e tempo", color: "bg-[#1F9D55]", ring: "#1F9D55" },
  { n: 3, name: "Crédito sem susto", tagline: "Pix, débito, cartão e score", color: "bg-[#1F2A63]", ring: "#1F2A63" },
  { n: 4, name: "Proteger e crescer", tagline: "Golpes, inflação e investir", color: "bg-[#7B3FE4]", ring: "#7B3FE4" },
];

export const LESSONS: Lesson[] = [
  {
    id: "L1",
    unit: 1,
    title: "Salário bruto x líquido",
    steps: [
      { kind: "info", title: "O combinado não é o que cai", text: "Bruto é o valor do contrato. Líquido é o que cai na conta depois dos descontos." },
      { kind: "choice", q: "Qual desconto aparece em quase todo holerite CLT?", options: ["INSS", "IPVA", "IPTU"], right: 0, why: "O INSS vai pra sua aposentadoria e outros benefícios." },
      { kind: "tf", q: "Vale-transporte pode descontar até 6% do salário.", right: true, why: "A empresa pode descontar até 6% do bruto se você usa VT." },
      { kind: "choice", q: "Numa entrevista, qual pergunta é mais útil?", options: ["É bruto ou líquido?", "Tem pizza na sexta?", "Quantas férias?"], right: 0, why: "Sabendo o líquido você planeja com o dinheiro real." },
    ],
    deep: [
      { title: "Como o INSS é calculado", text: "A contribuição é progressiva: cada faixa do salário paga uma alíquota (7,5%, 9%, 12% e 14%). Por isso quem ganha mais não paga 14% sobre tudo — só sobre a parte que passa da última faixa." },
      { title: "E o Imposto de Renda?", text: "Até um certo valor, o salário é isento. Acima disso, o IR é retido na fonte, também em faixas. No começo da carreira é comum não ter desconto de IR." },
      { title: "Outros descontos", text: "Vale-refeição, plano de saúde e contribuição sindical podem aparecer. Leia o holerite todo mês: erro de desconto acontece e dá pra corrigir com o RH." },
    ],
    quiz: [
      { q: "Salário líquido é…", options: ["O valor do contrato", "O que cai na conta", "O salário mínimo"], right: 1, why: "Líquido = bruto − descontos." },
      { q: "O INSS é calculado…", options: ["Em faixas progressivas", "Sempre 14% do total", "Só em dezembro"], right: 0, why: "Cada faixa tem uma alíquota." },
      { q: "Quem pode descontar até 6% pelo VT?", options: ["O banco", "A empresa", "O governo"], right: 1, why: "O desconto é feito pelo empregador." },
      { q: "Achou um desconto estranho no holerite. O que fazer?", options: ["Ignorar", "Falar com o RH", "Pedir demissão"], right: 1, why: "Erro de folha se corrige com o RH." },
    ],
  },
  {
    id: "L2",
    unit: 1,
    title: "A regra 50-30-20",
    steps: [
      { kind: "info", title: "Três caixinhas", text: "50% pro essencial, 30% pro que é seu (rolê, roupa, streaming) e 20% pro futuro." },
      { kind: "choice", q: "Aluguel entra em qual caixinha?", options: ["Essencial", "Seu", "Futuro"], right: 0, why: "Moradia é essencial." },
      { kind: "choice", q: "Show do seu artista favorito entra em…", options: ["Essencial", "Seu", "Futuro"], right: 1, why: "É lazer — vale, mas é escolha." },
      { kind: "tf", q: "Se hoje não dá 20%, é melhor não guardar nada.", right: false, why: "Começa com 5% e sobe aos poucos. Hábito > valor." },
    ],
    deep: [
      { title: "De onde vem a regra", text: "A 50-30-20 foi popularizada pela senadora americana Elizabeth Warren como um jeito simples de equilibrar o orçamento. É um ponto de partida, não uma lei." },
      { title: "Adaptando pra sua vida", text: "Quem mora com a família pode ter menos essencial e guardar mais. Quem mora sozinho pode precisar de 60% no essencial. O importante é o futuro nunca ficar em zero." },
      { title: "Pague-se primeiro", text: "Separe a parte do futuro no dia em que o dinheiro cai, não no fim do mês. O que sobra no fim do mês costuma ser nada." },
    ],
    quiz: [
      { q: "Na 50-30-20, os 20% vão pra…", options: ["Futuro", "Delivery", "Aluguel"], right: 0, why: "Reserva, objetivos e investimentos." },
      { q: "Streaming entra em…", options: ["Essencial", "Seu", "Futuro"], right: 1, why: "É desejo, não necessidade." },
      { q: "Melhor momento pra guardar:", options: ["Quando o dinheiro cai", "No fim do mês", "Nas férias"], right: 0, why: "Pague-se primeiro." },
      { q: "A regra 50-30-20 é…", options: ["Obrigatória", "Um ponto de partida", "Só pra quem é rico"], right: 1, why: "Adapte à sua realidade." },
    ],
  },
  {
    id: "L3",
    unit: 1,
    title: "Fixo x variável",
    steps: [
      { kind: "info", title: "Tem gasto que já tem dono", text: "Fixo vem todo mês quase igual. Variável muda — e é onde dá pra mexer rápido." },
      { kind: "choice", q: "Plano de celular é…", options: ["Fixo", "Variável"], right: 0, why: "Mesmo valor todo mês." },
      { kind: "choice", q: "Delivery é…", options: ["Fixo", "Variável"], right: 1, why: "Depende de você a cada pedido." },
      { kind: "tf", q: "Assinatura esquecida também é gasto fixo.", right: true, why: "E é a mais fácil de cortar." },
    ],
    deep: [
      { title: "Por que separar", text: "Somando os fixos, você descobre quanto do mês já está comprometido antes de você decidir qualquer coisa. O resto é o seu espaço de escolha." },
      { title: "Fixo também se negocia", text: "Plano de celular, internet e academia têm planos mais baratos. Revisar os fixos uma vez por semestre costuma liberar dinheiro sem mudar a rotina." },
      { title: "Variável com teto", text: "Defina um teto semanal pra delivery e rolê. Semana é mais fácil de controlar que mês." },
    ],
    quiz: [
      { q: "Aluguel é gasto…", options: ["Fixo", "Variável"], right: 0, why: "Vem todo mês, igual." },
      { q: "Onde dá pra economizar mais rápido?", options: ["Fixos", "Variáveis"], right: 1, why: "Variável muda na próxima escolha." },
      { q: "Revisar assinaturas a cada…", options: ["10 anos", "3 a 6 meses", "Nunca"], right: 1, why: "Sempre aparece uma que você não usa." },
      { q: "Teto de gasto funciona melhor por…", options: ["Semana", "Década"], right: 0, why: "Período curto, controle fácil." },
    ],
  },
  {
    id: "L4",
    unit: 2,
    title: "Reserva de emergência",
    steps: [
      { kind: "info", title: "Reserva não é pra comprar nada", text: "É pra quando o celular quebra, o salário atrasa ou você perde o trampo." },
      { kind: "choice", q: "Meta clássica de reserva:", options: ["3 a 6 meses de gastos", "1 semana", "10 anos"], right: 0, why: "Cobre um imprevisto grande." },
      { kind: "tf", q: "Reserva deve ficar em algo que você tira no mesmo dia.", right: true, why: "Liquidez diária: emergência não espera." },
      { kind: "choice", q: "Primeiro passo:", options: ["Reserva", "Criptomoeda", "Ações"], right: 0, why: "Reserva primeiro, risco depois." },
    ],
    deep: [
      { title: "Quanto é o seu número", text: "Some seus gastos de um mês e multiplique por 3 (se tem renda estável) ou 6 (se sua renda varia). Esse é o alvo. Chegar nele pode levar anos — tudo bem." },
      { title: "Onde guardar", text: "Em produtos com liquidez diária e baixo risco, como CDB de liquidez diária, caixinhas e Tesouro Selic. Evite deixar parado sem render." },
      { title: "Usou? Repõe", text: "Usar a reserva numa emergência é exatamente pra isso. Depois, volta a completar aos poucos." },
    ],
    quiz: [
      { q: "Reserva de emergência serve pra…", options: ["Imprevistos", "Viagem", "Presente"], right: 0, why: "É seguro, não desejo." },
      { q: "Renda que varia pede reserva de…", options: ["3 meses", "6 meses"], right: 1, why: "Mais variação, mais colchão." },
      { q: "Onde guardar a reserva?", options: ["Liquidez diária", "Imóvel", "Carro"], right: 0, why: "Precisa tirar rápido." },
      { q: "Usou a reserva. E agora?", options: ["Repor aos poucos", "Esquecer", "Pegar empréstimo"], right: 0, why: "Volta a completar." },
    ],
  },
  {
    id: "L5",
    unit: 2,
    title: "Objetivo com prazo",
    steps: [
      { kind: "info", title: "Sonho com data vira plano", text: "Objetivo bom tem três coisas: quanto custa, quando você quer e quanto guarda por mês." },
      { kind: "choice", q: "Celular de R$ 1.800 guardando R$ 150/mês leva…", options: ["12 meses", "3 meses", "5 anos"], right: 0, why: "1.800 ÷ 150 = 12." },
      { kind: "tf", q: "Dar nome ao objetivo ajuda a não gastar.", right: true, why: "Pote com nome é mais difícil de mexer." },
      { kind: "choice", q: "Quer chegar mais rápido. O que muda?", options: ["Guardar mais por mês", "Torcer", "Nada"], right: 0, why: "Valor mensal maior encurta o prazo." },
    ],
    deep: [
      { title: "Objetivo SMART", text: "Específico, mensurável, alcançável, relevante e com prazo. “Guardar pra viagem” vira “R$ 1.500 pra viajar em julho, R$ 250 por mês”." },
      { title: "Um objetivo de cada vez", text: "Muitos objetivos ao mesmo tempo dividem o dinheiro e ninguém chega. Priorize um e comece." },
      { title: "Automático ajuda", text: "Programe a transferência pra caixinha no dia do salário. Lembrar falha; automático não." },
    ],
    quiz: [
      { q: "Objetivo precisa de…", options: ["Valor, prazo e quanto por mês", "Só vontade"], right: 0, why: "Sem número vira sonho." },
      { q: "R$ 1.200 em 6 meses exige por mês…", options: ["R$ 200", "R$ 100", "R$ 600"], right: 0, why: "1.200 ÷ 6." },
      { q: "Melhor jeito de não esquecer de guardar:", options: ["Automático", "Post-it"], right: 0, why: "Programado no dia do salário." },
      { q: "Muitos objetivos ao mesmo tempo…", options: ["Dividem o dinheiro", "Aceleram tudo"], right: 0, why: "Priorize um." },
    ],
  },
  {
    id: "L6",
    unit: 2,
    title: "Juros compostos",
    steps: [
      { kind: "info", title: "Juros sobre juros", text: "Seu dinheiro rende, e o rendimento também passa a render. Com tempo, vira bola de neve." },
      { kind: "choice", q: "O ingrediente mais poderoso:", options: ["Tempo", "Sorte", "Dica do grupo"], right: 0, why: "Quanto antes, mais a bola cresce." },
      { kind: "tf", q: "Juros compostos também funcionam contra você nas dívidas.", right: true, why: "No cartão, a bola de neve é de dívida." },
      { kind: "choice", q: "Quem termina com mais?", options: ["Começa aos 18 com pouco", "Começa aos 35 com o mesmo valor"], right: 0, why: "17 anos a mais de rendimento." },
    ],
    deep: [
      { title: "Simples x composto", text: "No juro simples, o rendimento é sempre sobre o valor inicial. No composto, é sobre o valor acumulado. Em prazos longos a diferença é enorme." },
      { title: "A regra do 72", text: "Divida 72 pela taxa anual pra saber em quantos anos o dinheiro dobra. A 10% ao ano, dobra em cerca de 7 anos." },
      { title: "O lado ruim", text: "Rotativo do cartão e cheque especial usam a mesma lógica — com taxas muito maiores. Por isso dívida cara é prioridade." },
    ],
    quiz: [
      { q: "Juros compostos rendem sobre…", options: ["O valor acumulado", "Só o inicial"], right: 0, why: "Juros sobre juros." },
      { q: "A 12% ao ano, o dinheiro dobra em uns…", options: ["6 anos", "30 anos", "1 ano"], right: 0, why: "72 ÷ 12 = 6." },
      { q: "O que mais ajuda nos juros compostos?", options: ["Tempo", "Sacar todo mês"], right: 0, why: "Deixa a bola crescer." },
      { q: "Dívida no rotativo…", options: ["Cresce com juros compostos", "Não tem juros"], right: 0, why: "E muito rápido." },
    ],
  },
  {
    id: "L7",
    unit: 3,
    title: "Pix, débito ou crédito?",
    steps: [
      { kind: "info", title: "Cada um tem sua hora", text: "Pix e débito usam dinheiro que já é seu. Crédito usa dinheiro que vai ser seu — na fatura." },
      { kind: "choice", q: "Dividir a pizza com os amigos:", options: ["Pix", "Débito", "Crédito"], right: 0, why: "Instantâneo e sem taxa entre pessoas." },
      { kind: "choice", q: "Notebook em 10x sem juros:", options: ["Pix", "Débito", "Crédito"], right: 2, why: "Ok no crédito — se as parcelas cabem no mês." },
      { kind: "tf", q: "Limite do cartão é renda extra.", right: false, why: "É dinheiro emprestado até a fatura." },
    ],
    deep: [
      { title: "Vantagens do crédito", text: "Parcelar sem juros, proteção em compras online e prazo até a fatura. Tudo isso só vale se você paga a fatura inteira." },
      { title: "Parcelas se acumulam", text: "Várias compras parceladas somam na mesma fatura. Antes de parcelar, some as parcelas que já existem." },
      { title: "Débito e Pix pro dia a dia", text: "Pra gastos pequenos e recorrentes, débito e Pix ajudam a gastar só o que você tem." },
    ],
    quiz: [
      { q: "Pix usa dinheiro…", options: ["Que já está na conta", "Emprestado"], right: 0, why: "Sai na hora." },
      { q: "Crédito só vale a pena se…", options: ["Pagar a fatura inteira", "Pagar o mínimo"], right: 0, why: "Mínimo leva ao rotativo." },
      { q: "Antes de parcelar, confira…", options: ["Parcelas que já existem", "O horóscopo"], right: 0, why: "Elas somam na fatura." },
      { q: "Gasto pequeno do dia a dia:", options: ["Débito/Pix", "Parcelar em 12x"], right: 0, why: "Mais controle." },
    ],
  },
  {
    id: "L8",
    unit: 3,
    title: "O rotativo do cartão",
    steps: [
      { kind: "info", title: "O botão perigoso da fatura", text: "Pagar só o mínimo joga o resto pro rotativo — um dos juros mais caros do país." },
      { kind: "choice", q: "R$ 300 no rotativo por 6 meses viram cerca de…", options: ["R$ 660", "R$ 310", "R$ 300"], right: 0, why: "Juros compostos altos dobram rápido." },
      { kind: "tf", q: "Parcelar a fatura costuma ser mais barato que o rotativo.", right: true, why: "Taxa menor e prazo definido." },
      { kind: "choice", q: "Melhor proteção:", options: ["Alerta antes do vencimento", "Esconder a fatura"], right: 0, why: "Juros por esquecimento é o pior." },
    ],
    deep: [
      { title: "Como funciona", text: "Se você paga menos que o total, o saldo restante entra no rotativo e é cobrado com juros no mês seguinte. Por regra, o rotativo só pode durar até a próxima fatura; depois vira parcelamento." },
      { title: "Apertou? Negocia", text: "Fale com o banco, compare o parcelamento da fatura e pare de usar o cartão até sair. Evite pegar dívida nova pra pagar a antiga sem comparar o custo." },
      { title: "Cartão como ferramenta", text: "Com teto de gastos e fatura paga inteira, o cartão ajuda a construir histórico de bom pagador." },
    ],
    quiz: [
      { q: "Pagar só o mínimo leva ao…", options: ["Rotativo", "Cashback"], right: 0, why: "E aos juros altos." },
      { q: "Alternativa geralmente mais barata:", options: ["Parcelar a fatura", "Ficar no rotativo"], right: 0, why: "Taxa menor." },
      { q: "Pra não esquecer o vencimento:", options: ["Alerta no app", "Torcer"], right: 0, why: "Aviso alguns dias antes." },
      { q: "Endividado no cartão, o ideal é…", options: ["Parar de usar e negociar", "Gastar mais"], right: 0, why: "Estanca a bola de neve." },
    ],
  },
  {
    id: "L9",
    unit: 3,
    title: "Score sem mistério",
    steps: [
      { kind: "info", title: "Score é reputação", text: "De 0 a 1000, mostra se você costuma pagar em dia. Influencia aluguel, cartão e financiamento." },
      { kind: "tf", q: "Consultar o próprio score derruba ele.", right: false, why: "Consultar é de graça e não afeta nada." },
      { kind: "tf", q: "Pagar contas em dia ajuda o score.", right: true, why: "É o que mais pesa." },
      { kind: "choice", q: "Alguém cobra pra aumentar seu score:", options: ["Golpe", "Serviço oficial"], right: 0, why: "Não existe atalho pago." },
    ],
    deep: [
      { title: "O que entra na conta", text: "Pagamentos em dia, dívidas negativadas, tempo de relacionamento com o mercado e dados atualizados. O Cadastro Positivo registra quem paga certinho." },
      { title: "Como melhorar", text: "Pague em dia, mantenha cadastro atualizado, evite pedir crédito em vários lugares ao mesmo tempo e negocie dívidas antigas." },
      { title: "Onde consultar", text: "Birôs de crédito oferecem consulta gratuita do score. Desconfie de sites que pedem pagamento." },
    ],
    quiz: [
      { q: "Score vai de…", options: ["0 a 1000", "0 a 10"], right: 0, why: "Escala mais comum." },
      { q: "O que mais ajuda?", options: ["Pagar em dia", "Consultar todo dia"], right: 0, why: "Histórico de bom pagador." },
      { q: "Pedir crédito em vários lugares ao mesmo tempo…", options: ["Pode baixar o score", "Sempre sobe"], right: 0, why: "Sinaliza risco." },
      { q: "Cobrança pra 'limpar nome' sem negociar a dívida:", options: ["Golpe", "Normal"], right: 0, why: "Só pagar/negociar resolve." },
    ],
  },
  {
    id: "L10",
    unit: 4,
    title: "Golpes no Pix",
    steps: [
      { kind: "info", title: "Golpe tem roteiro", text: "Urgência, emoção e segredo: “troquei de número, manda R$ 500 agora”." },
      { kind: "choice", q: "“Central do banco” pede o código do SMS:", options: ["Golpe", "Normal"], right: 0, why: "Banco nunca pede código ou senha." },
      { kind: "tf", q: "Conferir o nome do recebedor antes de confirmar o Pix protege você.", right: true, why: "É o seu último filtro." },
      { kind: "choice", q: "Amigo com número novo pede dinheiro:", options: ["Ligar pro número antigo", "Mandar logo"], right: 0, why: "Confirma por outro canal." },
    ],
    deep: [
      { title: "Os golpes mais comuns", text: "Falso parente, falsa central, falso boleto, QR Code adulterado e anúncios bons demais pra ser verdade." },
      { title: "Ferramentas que ajudam", text: "Limite de Pix noturno menor, cadastro de contatos confiáveis e confirmação por biometria reduzem o estrago." },
      { title: "Caiu? Aja rápido", text: "Avise o banco imediatamente e registre boletim de ocorrência. O MED (Mecanismo Especial de Devolução) pode ajudar a recuperar valores." },
    ],
    quiz: [
      { q: "Banco pede sua senha por WhatsApp:", options: ["Golpe", "Normal"], right: 0, why: "Nunca acontece." },
      { q: "Limite de Pix noturno menor…", options: ["Reduz o prejuízo em golpes", "Não serve pra nada"], right: 0, why: "Limita o estrago." },
      { q: "Caiu em golpe. Primeiro passo:", options: ["Avisar o banco na hora", "Esperar uma semana"], right: 0, why: "Rapidez ajuda no MED." },
      { q: "Principal truque dos golpistas:", options: ["Urgência", "Paciência"], right: 0, why: "Pressa impede de pensar." },
    ],
  },
  {
    id: "L11",
    unit: 4,
    title: "Inflação",
    steps: [
      { kind: "info", title: "Tudo fica mais caro", text: "Inflação é o aumento geral dos preços. O lanche de R$ 30 hoje custa mais ano que vem." },
      { kind: "tf", q: "Dinheiro parado mantém o poder de compra.", right: false, why: "Continua o mesmo número, mas compra menos." },
      { kind: "choice", q: "Pra não perder pra inflação, o dinheiro precisa…", options: ["Render pelo menos a inflação", "Ficar na gaveta"], right: 0, why: "Senão encolhe." },
      { kind: "choice", q: "Índice oficial de inflação no Brasil:", options: ["IPCA", "IPVA", "CPF"], right: 0, why: "Medido pelo IBGE." },
    ],
    deep: [
      { title: "Como é medida", text: "O IBGE acompanha preços de uma cesta de produtos e serviços todo mês. A variação é o IPCA, usado como meta de inflação pelo Banco Central." },
      { title: "Juros e inflação", text: "Quando a inflação sobe, o Banco Central costuma subir a Selic pra frear o consumo. Isso encarece crédito e melhora o rendimento de renda fixa." },
      { title: "Ganho real", text: "Ganho real = rendimento acima da inflação. Rendeu 10% com inflação de 4%? Ganho real de cerca de 6%." },
    ],
    quiz: [
      { q: "Inflação é…", options: ["Aumento geral de preços", "Desconto em loja"], right: 0, why: "Preços sobem na média." },
      { q: "Quem mede o IPCA?", options: ["IBGE", "Receita Federal"], right: 0, why: "Instituto oficial de estatística." },
      { q: "Rendeu 8%, inflação 5%. Ganho real ~", options: ["3%", "13%"], right: 0, why: "8 − 5 ≈ 3." },
      { q: "Pra frear a inflação, o BC costuma…", options: ["Subir a Selic", "Imprimir dinheiro"], right: 0, why: "Juros mais altos esfriam o consumo." },
    ],
  },
  {
    id: "L12",
    unit: 4,
    title: "Primeiro investimento",
    steps: [
      { kind: "info", title: "Três portas de entrada", text: "Poupança, CDB de liquidez diária e Tesouro Selic. Todos simples e de baixo risco." },
      { kind: "choice", q: "O que perguntar antes de investir?", options: ["Rendimento, risco e liquidez", "Só o rendimento"], right: 0, why: "Os três importam." },
      { kind: "tf", q: "Promessa de muito rendimento sem risco é sinal de golpe.", right: true, why: "Rendimento alto anda com risco." },
      { kind: "choice", q: "CDB tem proteção do…", options: ["FGC", "Detran"], right: 0, why: "Fundo Garantidor de Créditos, até o limite." },
    ],
    deep: [
      { title: "O que é CDI", text: "CDI é a taxa que os bancos usam entre si, muito próxima da Selic. “100% do CDI” quer dizer que o investimento acompanha essa taxa." },
      { title: "Imposto na renda fixa", text: "CDB e Tesouro pagam IR sobre o rendimento, com alíquota menor quanto mais tempo você deixa. Poupança é isenta, mas costuma render menos." },
      { title: "Comece pequeno", text: "Dá pra começar com R$ 20. O mais importante agora é o hábito e entender o que você está comprando. Conteúdo educacional, não é recomendação." },
    ],
    quiz: [
      { q: "Liquidez é…", options: ["Facilidade de resgatar", "O rendimento"], right: 0, why: "Quão rápido vira dinheiro." },
      { q: "“100% do CDI” significa…", options: ["Acompanha a taxa CDI", "Rende 100% ao ano"], right: 0, why: "Pegadinha clássica." },
      { q: "Quanto mais tempo no CDB, o IR…", options: ["Diminui", "Aumenta"], right: 0, why: "Tabela regressiva." },
      { q: "Rendimento garantido altíssimo:", options: ["Desconfiar", "Colocar tudo"], right: 0, why: "Provável golpe." },
    ],
  },
];

export const QUIZ_PASS = 3;
export const POINTS_PER_RIGHT = 25;

export type MissionKind = "semanal" | "mensal" | "lição";
export type MissionDef = { id: string; kind: MissionKind; title: string; text: string; points: number; unlock: LessonId; reward?: string };

export const MISSIONS: MissionDef[] = [
  { id: "w-licoes", kind: "semanal", title: "2 lições na semana", text: "Faça 2 lições da trilha até domingo", points: 50, unlock: "L1" },
  { id: "w-quiz", kind: "semanal", title: "Mandar bem em 2 quizzes", text: "Acerte 3 de 4 em 2 quizzes de aprofundamento", points: 50, unlock: "L2" },
  {
    id: "m-mes",
    kind: "mensal",
    title: "Guardar e deixar as contas em dia",
    text: "Guarde pelo menos R$ 20 na caixinha e pague as contas do mês até o vencimento",
    points: 150,
    unlock: "L4",
    reward: "Caixinha rendendo 105% do CDI no mês seguinte",
  },
  { id: "l-objetivo", kind: "lição", title: "Criar seu objetivo", text: "Dê nome, valor e quanto guardar por mês", points: 50, unlock: "L5" },
  { id: "l-alerta", kind: "lição", title: "Ativar alerta de fatura", text: "Aviso 3 dias antes do vencimento", points: 30, unlock: "L8" },
  { id: "l-pixnoturno", kind: "lição", title: "Limite de Pix noturno", text: "Reduzir o limite das 20h às 6h", points: 30, unlock: "L10" },
];

export const GOALS = [
  { id: "celular", label: "Celular novo", cents: 180000 },
  { id: "viagem", label: "Viagem", cents: 150000 },
  { id: "casa", label: "Sair de casa", cents: 300000 },
  { id: "curso", label: "Curso", cents: 240000 },
] as const;
export type GoalId = (typeof GOALS)[number]["id"];

export const LEVELS = [0, 150, 400, 800, 1200];

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

export const CATCHPHRASES = [
  "5 minutos por dia. Zero juridiquês.",
  "Aprende, acerta o quiz, ganha pontos no Minhas Vantagens.",
  "Missão do mês cumprida = caixinha rendendo 105% do CDI.",
  "Golpe do Pix? Aprende a farejar em 1 minuto.",
  "Juros compostos: o crush que o seu dinheiro precisa.",
];

export const CDI_YEAR = 0.105;
