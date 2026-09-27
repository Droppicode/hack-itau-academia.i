import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "organizar-mes",
  name: "Organizar o mês",
  tagline: "Orçamento, contas em dia e metas",
  accent: "#1F2A63",
  level: 1,
  tags: ["hábitos", "orçamento", "contas", "assinaturas", "metas", "planejamento"],
  deep: [
    { title: "Plano simples vence plano perfeito", text: "Um orçamento que você revisa 5 minutos por semana funciona melhor que uma planilha enorme abandonada. Comece com 3 caixas: essencial, escolhas e objetivo." },
    { title: "Automatize o que é chato", text: "Débito automático, lembretes e pagar o objetivo primeiro tiram a decisão do caminho. O que acontece sozinho acontece mais." },
  ],
  lessons: [
    {
      title: "Regra 50-30-20",
      learn: "Um ponto de partida pra dividir o que entra.",
      steps: [
        info("50-30-20", "Uma divisão de referência: 50% pro essencial, 30% pras escolhas e 20% pra objetivos e reserva.", "Com R$ 1.320 líquidos: R$ 660 essencial, R$ 396 escolhas, R$ 264 objetivo."),
        info("Ajustar à realidade", "Se o essencial passa de 50%, tudo bem: o importante é ter uma fatia fixa pro futuro, nem que comece em 5%."),
        pick("Na regra 50-30-20, os 20% vão pra…", ["Objetivos e reserva", "Delivery", "Aluguel"], "É a fatia do futuro."),
        tf("A regra precisa ser seguida exatamente, senão não vale.", false, "É referência. Ajuste à sua renda."),
      ],
      deep: [{ title: "Comece pelo que dá", text: "Se hoje só sobram R$ 30, guarde R$ 30. O hábito vem antes do valor." }],
      quiz: [qz("Com R$ 1.000 líquidos, 20% é…", ["R$ 200", "R$ 20", "R$ 500"], "20% de 1.000 = 200."), qz("O que entra nos 50%?", ["Essenciais como moradia e transporte", "Presentes", "Viagem"], "Essencial é o que não dá pra cortar no mês.")],
    },
    {
      title: "Contas em dia",
      learn: "Vencimento, multa e juros de atraso.",
      steps: [
        info("Vencimento", "Data limite pra pagar sem multa. Depois dele entram multa (geralmente 2%) e juros por dia."),
        info("Débito automático", "A conta é paga sozinha na data, direto do saldo. Precisa ter dinheiro na conta no dia."),
        pick("Pagar a conta de luz 10 dias atrasada gera…", ["Multa e juros", "Desconto", "Nada"], "Atraso tem custo."),
        tf("Débito automático funciona mesmo sem saldo na conta.", false, "Sem saldo, a conta não é paga."),
      ],
      deep: [{ title: "Calendário do mês", text: "Anote as datas de vencimento perto do dia do salário. Menos contas depois do dinheiro acabar." }],
      quiz: [qz("Multa comum por atraso de conta:", ["2%", "50%", "0%"], "Muitas contas cobram 2% + juros."), qz("Pra débito automático dar certo, você precisa…", ["Ter saldo no dia", "Ter cartão de crédito", "Ir à agência"], "O valor sai do saldo.")],
    },
    {
      title: "Assinaturas",
      learn: "Os pequenos gastos que se repetem.",
      steps: [
        info("Gasto recorrente", "Cobrança que volta todo mês: streaming, app, academia. Sozinha é pouco; somada pesa.", "4 assinaturas de R$ 30 = R$ 120/mês = R$ 1.440/ano."),
        info("Teste grátis", "Muitos testes viram cobrança automática. Marque a data pra cancelar se não quiser continuar."),
        pick("3 assinaturas de R$ 25 por mês somam no ano…", ["R$ 900", "R$ 75", "R$ 300"], "75 × 12 = 900."),
        tf("Teste grátis nunca vira cobrança.", false, "Se não cancelar, geralmente cobra."),
      ],
      deep: [{ title: "Faxina trimestral", text: "A cada 3 meses, liste as cobranças do extrato e da fatura. Cancele o que você não usou no último mês." }],
      quiz: [qz("Onde você encontra as assinaturas?", ["No extrato e na fatura", "No holerite", "No FGTS"], "Elas aparecem como cobranças repetidas."), qz("Assinatura é gasto…", ["Recorrente", "Único", "Extra"], "Volta todo mês.")],
    },
    {
      title: "Meta do mês",
      learn: "Transformar objetivo grande em passos.",
      steps: [
        info("Meta SMART", "Específica, mensurável, alcançável, relevante e com prazo. \"Guardar R$ 150 até dia 30\" é melhor que \"guardar dinheiro\"."),
        info("Pague-se primeiro", "Guarde a meta logo que o dinheiro cai, antes dos gastos. O que sobra no fim do mês costuma ser zero."),
        pick("Qual é uma meta mensurável?", ["Guardar R$ 100 até dia 30", "Economizar mais", "Ser rico"], "Tem valor e prazo."),
        tf("Guardar o que sobrar no fim do mês é o jeito mais fácil.", false, "Guardar primeiro funciona melhor."),
      ],
      deep: [{ title: "Divida o objetivo", text: "Celular de R$ 2.400 em 12 meses = R$ 200/mês. Em 24 meses = R$ 100/mês. O prazo muda o esforço." }],
      quiz: [qz("Objetivo de R$ 1.200 em 6 meses pede por mês…", ["R$ 200", "R$ 120", "R$ 600"], "1.200 ÷ 6."), qz("\"Pague-se primeiro\" significa…", ["Guardar assim que o dinheiro entra", "Pagar dívidas dos amigos", "Gastar antes"], "Objetivo primeiro.")],
    },
    {
      title: "Dividir contas",
      learn: "Rolês, república e Pix entre amigos.",
      steps: [
        info("Racha", "Dividir uma conta combinada. Combine antes quem paga o quê e acerte no mesmo dia pelo Pix."),
        info("Pix agendado", "Dá pra agendar um Pix pra data certa, útil pra dividir aluguel ou internet com quem mora junto."),
        pick("Melhor momento pra acertar um racha:", ["No mesmo dia", "Daqui a 3 meses", "Nunca"], "Evita esquecer e constranger."),
        tf("Anotar quem deve o quê ajuda a não perder dinheiro.", true, "Pequenas dívidas somam."),
      ],
      deep: [{ title: "Conta da casa", text: "Em república, some aluguel, luz, internet e mercado, divida e agende os Pix pro dia seguinte ao salário." }],
      quiz: [qz("Pix agendado serve pra…", ["Pagar numa data futura", "Pegar empréstimo", "Aumentar limite"], "Programa a transferência."), qz("Internet de R$ 120 entre 3 pessoas:", ["R$ 40 cada", "R$ 120 cada", "R$ 60 cada"], "120 ÷ 3.")],
    },
  ],
});
