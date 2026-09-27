import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "cdb-na-pratica",
  name: "CDB na prática",
  tagline: "% do CDI, prazo, liquidez e imposto",
  accent: "#3A2E8C",
  level: 2,
  tags: ["investimentos", "cdb", "cdi", "imposto", "liquidez", "renda fixa"],
  deep: [
    { title: "Três perguntas", text: "Antes de um CDB: quanto rende (% do CDI), quando posso tirar (liquidez) e quem garante (FGC e solidez do banco)." },
    { title: "O cofrinho é um exemplo", text: "Um cofrinho que rende 100% do CDI com liquidez diária funciona como um CDB simples: bom pra objetivo e reserva." },
  ],
  lessons: [
    {
      title: "O que é CDB",
      learn: "Emprestar pro banco.",
      steps: [
        info("CDB", "Certificado de Depósito Bancário: você empresta ao banco, que usa o dinheiro e te paga juros."),
        info("Como rende", "A maioria é pós-fixada: 100% do CDI, 110% do CDI, etc."),
        pick("No CDB, quem paga os juros?", ["O banco", "O governo", "Uma empresa da bolsa"], "Você emprestou ao banco."),
        tf("CDB tem proteção do FGC.", true, "Até R$ 250 mil por CPF por instituição."),
      ],
      deep: [{ title: "Por que bancos emitem", text: "O banco capta com CDB e empresta pra outros clientes. A diferença é parte da receita dele." }],
      quiz: [qz("CDB é um empréstimo…", ["Ao banco", "Ao governo", "A um amigo"], "Certificado bancário."), qz("CDB 100% do CDI é…", ["Pós-fixado", "Prefixado", "Renda variável"], "Acompanha o CDI.")],
    },
    {
      title: "% do CDI",
      learn: "Ler e comparar ofertas.",
      steps: [
        info("CDI", "Taxa dos empréstimos entre bancos, bem próxima da Selic. É a referência da renda fixa."),
        info("Porcentagem", "110% do CDI rende 10% a mais que 100% do CDI. Com CDI de 10,5% a.a., 110% dá ~11,55% a.a."),
        pick("Com CDI a 10%, um CDB de 120% do CDI rende por ano…", ["~12%", "~120%", "~10%"], "10% × 1,2."),
        tf("Um CDB a 90% do CDI rende mais que um a 100%.", false, "Rende menos, com a mesma base."),
      ],
      deep: [{ title: "Oferta alta demais", text: "Taxas muito acima do mercado podem vir de bancos menores e mais arriscados. O FGC ajuda, mas tem limite." }],
      quiz: [qz("CDI é a taxa…", ["Entre bancos", "Da poupança", "Do dólar"], "Depósito interbancário."), qz("Maior % do CDI significa…", ["Mais rendimento", "Menos rendimento", "Nada"], "Mesma base, fatia maior.")],
    },
    {
      title: "Liquidez e prazo",
      learn: "Quando dá pra tirar.",
      steps: [
        info("Liquidez diária", "Resgata qualquer dia útil, recebendo o que já rendeu."),
        info("No vencimento", "Só resgata na data final. Costuma pagar mais pelo dinheiro ficar preso."),
        pick("Pra reserva de emergência, escolha CDB…", ["Com liquidez diária", "Que vence em 5 anos", "Sem FGC"], "Precisa de acesso."),
        tf("CDB com vencimento longo costuma pagar mais.", true, "Pagamento pelo prazo."),
      ],
      deep: [{ title: "Casar prazo e objetivo", text: "Objetivo em 2 anos? Um CDB com vencimento perto dessa data pode render mais." }],
      quiz: [qz("Liquidez diária permite…", ["Resgatar a qualquer dia útil", "Só no fim", "Nunca"], "Acesso rápido."), qz("Objetivo em 3 anos combina com…", ["CDB com prazo parecido", "Dinheiro na carteira", "Rotativo"], "Prazo alinhado.")],
    },
    {
      title: "Imposto e IOF",
      learn: "A tabela regressiva.",
      steps: [
        info("Tabela regressiva", "IR sobre o rendimento: 22,5% até 180 dias, 20% até 360, 17,5% até 720 e 15% acima disso."),
        info("IOF", "Resgates em menos de 30 dias pagam IOF sobre o rendimento, decrescente até zerar no 30º dia."),
        pick("CDB resgatado depois de 2 anos paga de IR…", ["15%", "22,5%", "0%"], "Acima de 720 dias."),
        tf("O IR incide sobre todo o valor aplicado.", false, "Só sobre o rendimento."),
      ],
      deep: [{ title: "Retido na fonte", text: "O banco já desconta o IR no resgate. Você não precisa pagar à parte." }],
      quiz: [qz("Menor alíquota de IR no CDB:", ["15%", "22,5%", "27,5%"], "Acima de 2 anos."), qz("IOF some depois de…", ["30 dias", "1 ano", "Nunca"], "Zera no 30º dia.")],
    },
    {
      title: "Comparar CDBs",
      learn: "Montar sua escolha.",
      steps: [
        info("Checklist", "Taxa (% CDI), liquidez, prazo, FGC e se o banco é sólido."),
        info("Rentabilidade líquida", "Compare o que sobra depois do IR, especialmente contra LCI/LCA."),
        pick("CDB A: 100% CDI diário. CDB B: 115% CDI em 3 anos. Pra reserva…", ["A", "B", "Nenhum"], "Reserva precisa de liquidez."),
        tf("Sempre escolha a maior taxa, sem olhar o resto.", false, "Liquidez e risco importam."),
      ],
      deep: [{ title: "Diversificar", text: "Dá pra ter um CDB diário pra reserva e outro de prazo maior pro objetivo." }],
      quiz: [qz("Além da taxa, olhe…", ["Liquidez, prazo e garantia", "A cor do banco", "Nada"], "Checklist completo."), qz("Pra comparar com LCI, use…", ["Rendimento líquido de IR", "Rendimento bruto", "O nome"], "LCI é isenta.")],
    },
  ],
});
