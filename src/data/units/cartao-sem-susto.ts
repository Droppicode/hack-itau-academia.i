import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "cartao-sem-susto",
  name: "Cartão sem susto",
  tagline: "Fatura, limite, parcelas e rotativo",
  accent: "#0B6E99",
  level: 1,
  tags: ["hábitos", "cartão", "crédito", "fatura", "parcelamento", "dívidas"],
  deep: [
    { title: "Cartão é meio de pagamento", text: "Usado com o dinheiro que você já tem, o cartão dá prazo e organização. Usado com dinheiro que você não tem, vira dívida cara." },
    { title: "Uma regra só", text: "Pague a fatura inteira, sempre. Se não der, fale com o banco antes do vencimento pra achar a opção mais barata." },
  ],
  lessons: [
    {
      title: "Limite não é renda",
      learn: "O limite é do banco, a renda é sua.",
      steps: [
        info("Limite", "O valor máximo que o banco deixa você gastar no cartão antes de pagar. Não é dinheiro extra: vai chegar na fatura."),
        info("Teto pessoal", "Uma boa prática é gastar no cartão no máximo o que você pagaria à vista naquele mês."),
        pick("Limite de R$ 2.000 com salário de R$ 1.320 significa…", ["Que dá pra gastar até 2.000, mas vai precisar pagar", "Que você ganha 2.000", "Que é grátis"], "Limite vira fatura."),
        tf("Usar o limite todo todo mês é saudável.", false, "Pode comprometer a próxima renda."),
      ],
      deep: [{ title: "Limite alto não é prêmio", text: "O banco oferece limite pelo seu perfil. Ter um limite alto não muda quanto você ganha." }],
      quiz: [qz("O limite do cartão é…", ["Um teto de gasto que vira fatura", "Parte do salário", "Um investimento"], "Precisa ser pago."), qz("Teto pessoal saudável:", ["O que você pagaria à vista no mês", "O limite total", "O dobro do salário"], "Assim a fatura cabe.")],
    },
    {
      title: "Fechamento e vencimento",
      learn: "O calendário do cartão.",
      steps: [
        info("Fechamento", "Dia em que a fatura \"fecha\". Compras depois dele vão pra fatura do mês seguinte."),
        info("Melhor dia de compra", "É logo depois do fechamento: você ganha o prazo mais longo até pagar."),
        pick("Comprar logo após o fechamento dá…", ["Mais tempo até pagar", "Desconto", "Juros"], "Cai só na próxima fatura."),
        tf("Vencimento e fechamento são o mesmo dia.", false, "Normalmente há uns 7 a 10 dias entre eles."),
      ],
      deep: [{ title: "Vencimento perto do salário", text: "Escolha o vencimento alguns dias depois do salário cair. Assim o dinheiro já está na conta." }],
      quiz: [qz("Compra depois do fechamento vai pra…", ["Fatura do mês seguinte", "Fatura atual", "Lugar nenhum"], "A fatura atual já fechou."), qz("Bom vencimento é…", ["Logo depois do salário", "Um dia antes do salário", "Aleatório"], "O dinheiro já entrou.")],
    },
    {
      title: "Parcelar com cuidado",
      learn: "Parcelas somam no mês seguinte.",
      steps: [
        info("Parcelado sem juros", "O total é o mesmo do à vista, só dividido. Mas cada parcela ocupa espaço nas próximas faturas."),
        info("Efeito bola de neve", "Várias parcelas pequenas juntas podem comprometer boa parte da renda por meses.", "5 compras de R$ 60/mês = R$ 300 presos por meses."),
        pick("Parcelas de várias compras…", ["Somam na mesma fatura", "Somem com o tempo", "Não contam"], "Tudo aparece junto."),
        tf("Se à vista tem desconto, pode valer mais que parcelar sem juros.", true, "Compare o total."),
      ],
      deep: [{ title: "Pergunta antes de parcelar", text: "Some todas as parcelas que já existem. Com a nova, a fatura ainda cabe no seu mês?" }],
      quiz: [qz("Parcelado sem juros custa…", ["O mesmo total do preço cheio", "Menos", "O dobro"], "Só divide."), qz("Risco de muitos parcelamentos:", ["Comprometer a renda futura", "Ganhar pontos", "Nenhum"], "As parcelas se acumulam.")],
    },
    {
      title: "Rotativo e mínimo",
      learn: "Por que pagar só o mínimo é caro.",
      steps: [
        info("Pagamento mínimo", "O menor valor aceito da fatura. O resto vira crédito rotativo, com juros altíssimos."),
        info("Rotativo", "É um dos créditos mais caros do país. Por regra, só pode durar até a fatura seguinte, depois vira parcelamento."),
        pick("Pagar só o mínimo faz o restante…", ["Virar dívida com juros altos", "Sumir", "Virar pontos"], "O resto entra no rotativo."),
        tf("Rotativo é uma forma barata de crédito.", false, "É das mais caras."),
      ],
      deep: [{ title: "Se não der pra pagar tudo", text: "Procure o banco antes do vencimento e compare o custo total (CET) das opções de parcelamento da fatura." }],
      quiz: [qz("O que é o rotativo?", ["O saldo não pago da fatura, com juros", "Um tipo de Pix", "Cashback"], "É crédito caro."), qz("Melhor atitude com a fatura:", ["Pagar o total", "Pagar o mínimo", "Ignorar"], "Sem juros.")],
    },
    {
      title: "Anuidade e benefícios",
      learn: "Quando um cartão vale o que cobra.",
      steps: [
        info("Anuidade", "Tarifa pelo uso do cartão. Muitos cartões têm anuidade zero ou isenção por gasto."),
        info("Pontos e cashback", "Benefícios devolvem parte do que você gasta. Só valem se você não gastar mais por causa deles."),
        pick("Vale a pena gastar mais pra ganhar pontos?", ["Não, o benefício é menor que o gasto", "Sim, sempre", "Só no fim de semana"], "Ponto é bônus, não motivo."),
        tf("Cartão com anuidade zero existe.", true, "Compare antes de escolher."),
      ],
      deep: [{ title: "Conta rápida", text: "Se o cartão cobra R$ 300/ano e devolve 1%, você precisaria gastar R$ 30 mil/ano só pra empatar." }],
      quiz: [qz("Anuidade é…", ["Tarifa pelo cartão", "Juros do Pix", "Um investimento"], "Custo anual."), qz("Pontos compensam quando…", ["Você já gastaria de qualquer jeito", "Você gasta mais pra ganhar", "Nunca"], "Não mude o gasto pelo ponto.")],
    },
  ],
});
