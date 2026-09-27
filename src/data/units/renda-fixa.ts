import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "renda-fixa",
  name: "Renda fixa do zero",
  tagline: "Poupança, CDB, Tesouro, LCI/LCA e FGC",
  accent: "#6B3FA0",
  level: 2,
  tags: ["investimentos", "renda fixa", "cdb", "tesouro", "poupança", "lci", "fgc", "cdi"],
  deep: [
    { title: "Renda fixa não é \"fixa\" sempre", text: "O nome indica que a regra do rendimento é conhecida na hora de aplicar (ex.: 100% do CDI). O valor final pode variar se a taxa de referência mudar." },
    { title: "Compare no líquido", text: "Para comparar, desconte impostos: LCI/LCA são isentas de IR para pessoa física, CDB e Tesouro não." },
  ],
  lessons: [
    {
      title: "O que é renda fixa",
      learn: "Emprestar dinheiro com regra definida.",
      steps: [
        info("Renda fixa", "Você empresta dinheiro a um banco, empresa ou ao governo, e recebe juros com regra conhecida desde o início."),
        info("Tipos de rendimento", "Pós-fixado (acompanha CDI ou Selic), prefixado (taxa fixa) e híbrido (inflação + taxa)."),
        pick("Um CDB que rende 100% do CDI é…", ["Pós-fixado", "Prefixado", "Ação"], "Acompanha o CDI."),
        tf("Na renda fixa você é sócio da empresa.", false, "Sócio é na ação. Aqui você empresta."),
      ],
      deep: [{ title: "Quem paga", text: "Quem pegou o dinheiro emprestado paga os juros: o banco (CDB), o governo (Tesouro) ou a empresa (debênture)." }],
      quiz: [qz("Na renda fixa você…", ["Empresta dinheiro e recebe juros", "Compra parte de empresa", "Aposta"], "É empréstimo."), qz("Prefixado significa…", ["Taxa conhecida desde o início", "Acompanha o CDI", "Sem juros"], "Taxa fixa.")],
    },
    {
      title: "Poupança x CDI",
      learn: "Por que comparar rendimentos.",
      steps: [
        info("Poupança", "Rende uma regra ligada à Selic (70% dela quando a Selic está até 8,5%, ou 0,5% ao mês + TR acima disso). Isenta de IR."),
        info("100% do CDI", "Com Selic alta, investimentos a 100% do CDI costumam render mais que a poupança, mesmo com IR."),
        pick("A poupança é isenta de…", ["Imposto de Renda", "Juros", "Tudo"], "Pessoa física não paga IR na poupança."),
        tf("Poupança sempre rende mais que CDB.", false, "Depende da Selic e do % do CDI."),
      ],
      deep: [{ title: "Aniversário", text: "A poupança rende no \"aniversário\" mensal do depósito. Resgatar antes perde o rendimento do mês." }],
      quiz: [qz("Rendimento da poupança depende…", ["Da Selic", "Do dólar", "Da bolsa"], "Regra ligada à Selic."), qz("Pra comparar com a poupança, desconte do CDB…", ["O Imposto de Renda", "A anuidade", "O FGTS"], "CDB paga IR.")],
    },
    {
      title: "Tesouro Direto",
      learn: "Emprestar pro governo.",
      steps: [
        info("Tesouro Selic", "Título público que acompanha a Selic. Tem liquidez diária e é bom pra reserva."),
        info("Tesouro IPCA+", "Paga inflação + uma taxa. Protege o poder de compra no longo prazo, mas o preço varia antes do vencimento."),
        pick("Tesouro bom pra reserva de emergência:", ["Tesouro Selic", "Tesouro IPCA+ 2045", "Nenhum"], "Oscila pouco e tem liquidez."),
        tf("O Tesouro IPCA+ pode ter perda se vendido antes do vencimento.", true, "É a marcação a mercado."),
      ],
      deep: [{ title: "Marcação a mercado", text: "O preço dos títulos muda com as taxas de juros do mercado. Levar até o vencimento garante a taxa contratada." }],
      quiz: [qz("Tesouro Selic acompanha…", ["A taxa Selic", "O dólar", "O Ibovespa"], "Pós-fixado na Selic."), qz("IPCA+ protege contra…", ["Inflação", "Golpe", "Imposto"], "Paga inflação + taxa.")],
    },
    {
      title: "LCI e LCA",
      learn: "Isentas de IR, com carência.",
      steps: [
        info("LCI/LCA", "Títulos de bancos ligados a imóveis (LCI) e agronegócio (LCA). Isentos de IR pra pessoa física."),
        info("Carência", "Costumam ter um prazo mínimo antes de poder resgatar. Não servem pra reserva de emergência."),
        pick("Vantagem da LCI:", ["Isenção de IR", "Liquidez imediata sempre", "Risco zero absoluto"], "Pessoa física não paga IR."),
        tf("LCA é boa pra dinheiro que você pode precisar amanhã.", false, "Tem carência."),
      ],
      deep: [{ title: "Comparar com CDB", text: "LCI a 90% do CDI isenta pode render mais que CDB a 100% com IR, dependendo do prazo." }],
      quiz: [qz("LCI e LCA são…", ["Isentas de IR", "Ações", "Poupança"], "Sem IR pra PF."), qz("Carência é…", ["Prazo mínimo sem resgate", "Uma taxa", "Um bônus"], "Dinheiro preso até a data.")],
    },
    {
      title: "FGC: a proteção",
      learn: "O que acontece se o banco quebrar.",
      steps: [
        info("FGC", "O Fundo Garantidor de Créditos protege até R$ 250 mil por CPF por instituição, em produtos como CDB, LCI, LCA e poupança."),
        info("O que não cobre", "Tesouro Direto (é do governo), ações e fundos de investimento não têm FGC."),
        pick("O FGC cobre CDB até…", ["R$ 250 mil por CPF por instituição", "R$ 1 mil", "Sem limite"], "Limite oficial."),
        tf("Ações são cobertas pelo FGC.", false, "Renda variável não tem FGC."),
      ],
      deep: [{ title: "Teto global", text: "Há também um teto de R$ 1 milhão por CPF a cada 4 anos, somando todas as instituições." }],
      quiz: [qz("FGC protege…", ["CDB, LCI, LCA e poupança", "Ações", "Criptomoedas"], "Produtos bancários."), qz("Tesouro Direto tem garantia…", ["Do governo federal", "Do FGC", "Nenhuma"], "Título público.")],
    },
  ],
});
