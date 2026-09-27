import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "juros-e-dividas",
  name: "Juros e dívidas",
  tagline: "Juros compostos, CET, score e renegociação",
  accent: "#8A3B12",
  level: 2,
  tags: ["hábitos", "juros", "dívidas", "score", "crédito", "cet"],
  deep: [
    { title: "Juros trabalham dos dois lados", text: "Quando você guarda, os juros compostos crescem seu dinheiro. Quando você deve, eles crescem sua dívida. A mesma matemática, lados opostos." },
    { title: "Dívida tem ordem", text: "Priorize as mais caras (rotativo, cheque especial) e as que envolvem bens essenciais. Renegociar cedo sai mais barato." },
  ],
  lessons: [
    {
      title: "Juros compostos",
      learn: "Juros sobre juros, no tempo.",
      steps: [
        info("Juros compostos", "Os juros de um mês entram na base do mês seguinte. Por isso o valor cresce cada vez mais rápido.", "R$ 1.000 a 10% ao mês viram ~R$ 2.594 em 10 meses."),
        info("Taxa ao mês x ao ano", "3% ao mês não é 36% ao ano: com juros compostos dá ~42,6% ao ano."),
        pick("Juros compostos cobram juros sobre…", ["O valor já com juros anteriores", "Só o valor inicial", "Nada"], "Juros sobre juros."),
        tf("3% ao mês equivalem exatamente a 36% ao ano.", false, "Compostos dão mais: ~42,6%."),
      ],
      deep: [{ title: "Tempo é o fator", text: "Quanto mais tempo, maior o efeito. Por isso começar a guardar cedo e sair da dívida rápido fazem tanta diferença." }],
      quiz: [qz("Com juros compostos, a dívida cresce…", ["Cada vez mais rápido", "Sempre igual", "Diminui"], "A base aumenta."), qz("O que mais amplia os juros compostos?", ["O tempo", "A cor do cartão", "O dia da semana"], "Mais meses, mais efeito.")],
    },
    {
      title: "CET: o custo real",
      learn: "Juros não são o único custo.",
      steps: [
        info("CET", "Custo Efetivo Total: juros + tarifas + seguros + impostos. É o número pra comparar ofertas de crédito."),
        info("Comparar", "Duas ofertas com a mesma taxa de juros podem ter CET diferentes por causa das tarifas."),
        pick("Pra comparar dois empréstimos, olhe…", ["O CET", "A cor do app", "Só a parcela"], "CET inclui tudo."),
        tf("Parcela menor sempre significa crédito mais barato.", false, "Pode ter prazo maior e custar mais."),
      ],
      deep: [{ title: "Parcela engana", text: "Esticar o prazo reduz a parcela e aumenta o total pago. Sempre veja o valor total." }],
      quiz: [qz("CET inclui…", ["Juros, tarifas, seguros e impostos", "Só juros", "Só IOF"], "É o custo completo."), qz("Prazo mais longo geralmente…", ["Aumenta o total pago", "Zera os juros", "Não muda nada"], "Mais tempo de juros.")],
    },
    {
      title: "Cheque especial",
      learn: "O limite escondido da conta.",
      steps: [
        info("Cheque especial", "Limite que deixa o saldo ficar negativo. É crédito caro e começa a cobrar juros por dia."),
        info("Saldo x saldo com limite", "Alguns apps mostram saldo + limite. Olhe sempre o saldo sem limite pra saber o que é seu."),
        pick("Saldo negativo na conta significa…", ["Que você está usando crédito caro", "Que ganhou bônus", "Nada"], "É o cheque especial."),
        tf("O cheque especial é uma boa reserva de emergência.", false, "Reserva é dinheiro seu guardado."),
      ],
      deep: [{ title: "Sair rápido", text: "Se entrou no cheque especial, cubra o negativo assim que o salário cair e revise os gastos do mês." }],
      quiz: [qz("Cheque especial é…", ["Crédito caro ligado à conta", "Um investimento", "Um Pix"], "Juros altos."), qz("Qual saldo mostra o que é seu?", ["O saldo sem limite", "O saldo com limite", "O limite"], "Limite não é seu.")],
    },
    {
      title: "Score de crédito",
      learn: "Como o mercado vê seus pagamentos.",
      steps: [
        info("Score", "Nota de 0 a 1.000 que estima a chance de você pagar contas em dia. Bancos consultam antes de oferecer crédito."),
        info("O que ajuda", "Pagar em dia, manter o Cadastro Positivo ativo e não pedir crédito em vários lugares ao mesmo tempo."),
        pick("O que mais melhora o score?", ["Pagar contas em dia", "Pedir crédito em 10 bancos", "Nunca usar a conta"], "Histórico de pagamento pesa."),
        tf("Consultar o próprio score diminui a nota.", false, "Consultar o seu não prejudica."),
      ],
      deep: [{ title: "Leva tempo", text: "Score reflete histórico. Mudanças de comportamento aparecem em meses, não em dias." }],
      quiz: [qz("Score estima…", ["Chance de pagar em dia", "Seu salário", "Seus investimentos"], "É probabilidade de pagamento."), qz("Cadastro Positivo registra…", ["Pagamentos em dia", "Só dívidas", "Sua senha"], "Mostra o lado bom.")],
    },
    {
      title: "Renegociar dívidas",
      learn: "Sair do vermelho com plano.",
      steps: [
        info("Renegociação", "Trocar uma dívida cara por um acordo com parcelas que cabem no mês, às vezes com desconto."),
        info("Desenrola e mutirões", "Programas e feirões oferecem descontos. Confirme sempre nos canais oficiais do credor."),
        pick("Antes de fechar um acordo, confira…", ["Se a parcela cabe no seu mês", "Se o boleto é bonito", "Nada"], "Acordo quebrado piora."),
        tf("Trocar dívida cara por uma mais barata pode ajudar.", true, "Reduz o custo total."),
      ],
      deep: [{ title: "Cuidado com golpes", text: "Ninguém legítimo pede pagamento antecipado pra \"limpar seu nome\". Negocie só em canais oficiais." }],
      quiz: [qz("Bom acordo é aquele…", ["Com parcela que cabe no orçamento", "Com mais parcelas possível", "Sem ler"], "Tem que ser cumprido."), qz("Onde negociar?", ["Canais oficiais do credor", "Link aleatório no WhatsApp", "Qualquer site"], "Evita golpe.")],
    },
  ],
});
