import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "grandes-objetivos",
  name: "Grandes objetivos",
  tagline: "Moto, carro, casa própria e sair de casa",
  accent: "#00607A",
  level: 2,
  tags: ["objetivos", "moto", "carro", "casa", "consórcio", "financiamento", "planejamento", "longo prazo"],
  deep: [
    { title: "Tempo é seu aliado", text: "Quanto mais cedo começa, menor o valor mensal e maior a parte que vem do rendimento." },
    { title: "Custo de ter", text: "Moto, carro e casa têm custos depois da compra: seguro, IPVA, manutenção, condomínio. Inclua no plano." },
  ],
  lessons: [
    {
      title: "Planejar a moto ou carro",
      learn: "Preço de compra e custo de ter.",
      steps: [
        info("Custo total", "Além do preço: seguro, IPVA, licenciamento, combustível e manutenção.", "Moto de R$ 15 mil pode custar uns R$ 300–500/mês pra manter."),
        info("Entrada", "Juntar uma boa entrada reduz juros se for financiar."),
        pick("IPVA é custo de…", ["Ter o veículo", "Comprar o celular", "Pix"], "Imposto anual."),
        tf("O preço da moto é o único custo.", false, "Manter também custa."),
      ],
      deep: [{ title: "Teste o custo", text: "Guarde o valor mensal de manutenção por alguns meses antes de comprar. Se couber, você está pronto." }],
      quiz: [qz("Custo mensal inclui…", ["Seguro, combustível e manutenção", "Só a parcela", "Nada"], "Custo de ter."), qz("Entrada maior…", ["Reduz juros no financiamento", "Aumenta juros", "Não muda"], "Financia menos.")],
    },
    {
      title: "Consórcio x financiamento",
      learn: "Duas formas de comprar a prazo.",
      steps: [
        info("Financiamento", "Recebe o bem na hora e paga com juros. CET define o custo."),
        info("Consórcio", "Grupo que junta dinheiro; sem juros, mas com taxa de administração e sem data certa pra receber, exceto por lance."),
        pick("Quem precisa do bem agora tende a…", ["Financiar", "Entrar no consórcio", "Esperar a poupança do vizinho"], "Consórcio não garante data."),
        tf("Consórcio tem taxa de administração.", true, "É o custo dele."),
      ],
      deep: [{ title: "Terceira via", text: "Guardar e comprar à vista, às vezes com desconto, costuma ser o mais barato — só leva mais tempo." }],
      quiz: [qz("Financiamento cobra…", ["Juros", "Nada", "Só taxa de administração"], "Crédito."), qz("Mais barato em geral:", ["Guardar e comprar à vista", "Rotativo", "Cheque especial"], "Sem juros.")],
    },
    {
      title: "Sair de casa",
      learn: "Os custos de morar sozinho.",
      steps: [
        info("Custos iniciais", "Caução ou fiador, mudança, móveis e eletrodomésticos básicos."),
        info("Custos mensais", "Aluguel, condomínio, luz, água, internet, gás e mercado."),
        pick("Um custo inicial de alugar:", ["Caução", "IPVA", "Anuidade"], "Garantia do contrato."),
        tf("Dividir apartamento reduz o custo por pessoa.", true, "Contas divididas."),
      ],
      deep: [{ title: "Regra prática", text: "Muitos planejam que moradia não passe de ~30% da renda líquida." }],
      quiz: [qz("Custo mensal de morar sozinho:", ["Aluguel e contas", "Só aluguel", "Nada"], "Soma tudo."), qz("Moradia saudável costuma ficar até…", ["~30% da renda", "90%", "5%"], "Referência.")],
    },
    {
      title: "Casa própria",
      learn: "Entrada, FGTS e prazo longo.",
      steps: [
        info("FGTS", "Pode ajudar na entrada ou amortização da casa própria, seguindo as regras."),
        info("Financiamento imobiliário", "Prazo longo (até 30+ anos). Pequenas diferenças de taxa mudam muito o total."),
        pick("O FGTS pode ser usado pra…", ["Entrada da casa própria", "Viagem", "Streaming"], "Uso previsto em lei."),
        tf("Em prazos longos, a taxa de juros faz grande diferença.", true, "Compostos por décadas."),
      ],
      deep: [{ title: "Simule", text: "Simule em mais de um banco e compare o CET, não só a parcela." }],
      quiz: [qz("Financiamento imobiliário tem prazo…", ["Longo", "De 1 mês", "Sem prazo"], "Décadas."), qz("Ajuda na entrada:", ["FGTS", "Rotativo", "Cheque especial"], "Pode ser usado.")],
    },
    {
      title: "Viagem sem dívida",
      learn: "Planejar lazer grande.",
      steps: [
        info("Orçamento da viagem", "Transporte, hospedagem, comida, passeios e uma margem pra imprevisto."),
        info("Guardar antes", "Dividir o total pelos meses até a viagem e guardar num cofrinho do objetivo."),
        pick("Viagem de R$ 1.800 em 6 meses pede…", ["R$ 300/mês", "R$ 1.800/mês", "R$ 30/mês"], "1.800 ÷ 6."),
        tf("Uma margem pra imprevistos faz parte do plano.", true, "Sempre aparece algo."),
      ],
      deep: [{ title: "Parcelas pós-viagem", text: "Voltar com 10 parcelas tira a graça da viagem nos meses seguintes." }],
      quiz: [qz("Plano de viagem inclui…", ["Transporte, hospedagem e margem", "Só a passagem", "Nada"], "Custo total."), qz("Guardar antes evita…", ["Parcelas e juros depois", "A viagem", "Fotos"], "Sem dívida.")],
    },
  ],
});
