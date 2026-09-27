import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "reserva-emergencia",
  name: "Reserva de emergência",
  tagline: "O dinheiro que te protege do imprevisto",
  accent: "#00857A",
  level: 1,
  tags: ["guardar", "reserva", "liquidez", "segurança", "hábitos", "investimentos"],
  deep: [
    { title: "Primeiro a reserva", text: "Antes de investir com risco, tenha uma reserva. Ela evita que um imprevisto vire dívida cara." },
    { title: "Reserva não é objetivo", text: "Mantenha separada do dinheiro do objetivo. Assim você sabe o que pode usar numa emergência." },
  ],
  lessons: [
    {
      title: "Pra que serve",
      learn: "Imprevisto sem dívida.",
      steps: [
        info("Reserva de emergência", "Dinheiro guardado pra imprevistos: celular quebrado, conta médica, período sem renda."),
        info("Sem reserva", "O imprevisto vai pro cartão ou cheque especial, com juros altos."),
        pick("Qual é um uso de reserva?", ["Conserto urgente do celular", "Show de fim de semana", "Roupa nova"], "Imprevisto real."),
        tf("Reserva serve pra comprar o que está em promoção.", false, "É pra emergência."),
      ],
      deep: [{ title: "Tranquilidade", text: "Além do dinheiro, a reserva dá calma pra decidir melhor em momentos difíceis." }],
      quiz: [qz("A reserva evita…", ["Dívidas caras no imprevisto", "Impostos", "O salário"], "Você usa o seu."), qz("Reserva é pra…", ["Emergências", "Desejos", "Apostas"], "Só imprevistos.")],
    },
    {
      title: "Quanto guardar",
      learn: "Meses de custo de vida.",
      steps: [
        info("Meta clássica", "De 3 a 6 meses do seu custo essencial. CLT costuma mirar 3–6; autônomo, 6–12."),
        info("Começar pequeno", "Primeira meta: um mês de gastos essenciais. Depois vá aumentando."),
        pick("Custo essencial de R$ 900 × 3 meses =", ["R$ 2.700", "R$ 900", "R$ 9.000"], "900 × 3."),
        tf("Quem tem renda variável precisa de reserva maior.", true, "A renda oscila mais."),
      ],
      deep: [{ title: "Custo, não salário", text: "Calcule sobre os gastos essenciais, não sobre o salário inteiro." }],
      quiz: [qz("Meta comum de reserva:", ["3 a 6 meses de gastos", "1 dia", "10 anos"], "Referência clássica."), qz("Primeira etapa:", ["1 mês de gastos essenciais", "R$ 1 milhão", "Nada"], "Meta alcançável.")],
    },
    {
      title: "Onde deixar",
      learn: "Seguro, com liquidez e rendendo.",
      steps: [
        info("Três critérios", "Segurança (baixo risco), liquidez diária (resgata na hora) e rendimento perto do CDI."),
        info("Opções comuns", "Cofrinho/CDB com liquidez diária, Tesouro Selic, fundos DI de baixa taxa."),
        pick("A reserva precisa principalmente de…", ["Liquidez e segurança", "Alto risco", "Prazo de 10 anos"], "Você pode precisar amanhã."),
        tf("Ações são um bom lugar para a reserva.", false, "Oscilam; podem cair quando você precisar."),
      ],
      deep: [{ title: "Rendimento é bônus", text: "Na reserva, poder usar amanhã importa mais que ganhar um pouco mais." }],
      quiz: [qz("Liquidez diária significa…", ["Resgatar qualquer dia", "Render todo dia 10%", "Só resgatar no fim do ano"], "Acesso rápido."), qz("Bom lugar pra reserva:", ["CDB com liquidez diária", "Criptomoeda", "Emprestar pra amigo"], "Seguro e líquido.")],
    },
    {
      title: "Montar aos poucos",
      learn: "Um valor fixo todo mês.",
      steps: [
        info("Valor fixo", "Defina um valor e guarde logo que o salário cai, como uma conta do mês."),
        info("Entradas extras", "13º, férias e restituição do IR aceleram a reserva."),
        pick("Qual acelera a reserva?", ["Guardar parte do 13º", "Parcelar mais compras", "Usar o rotativo"], "Entrada extra."),
        tf("Só vale começar com valor alto.", false, "Pouco e sempre funciona."),
      ],
      deep: [{ title: "Exemplo", text: "R$ 100 por mês + metade do 13º: em 1 ano, ~R$ 1.800 guardados, mais o rendimento." }],
      quiz: [qz("Melhor momento pra guardar:", ["Assim que o salário cai", "No fim do mês", "Nunca"], "Pague-se primeiro."), qz("Extra que ajuda:", ["13º salário", "Rotativo", "Cheque especial"], "É renda extra.")],
    },
    {
      title: "Usei, e agora?",
      learn: "Recompor depois do imprevisto.",
      steps: [
        info("Recompor", "Usar a reserva é o propósito dela. Depois, volte a guardar até a meta."),
        info("Revisar a meta", "Mudou o custo de vida (mudou de casa, novo emprego)? Ajuste o tamanho da reserva."),
        pick("Depois de usar a reserva, você deve…", ["Voltar a guardar até a meta", "Desistir dela", "Pegar empréstimo pra repor"], "Recomponha aos poucos."),
        tf("Usar a reserva numa emergência é errado.", false, "É exatamente pra isso."),
      ],
      deep: [{ title: "Sem culpa", text: "A reserva funcionou: evitou uma dívida. Agora é reconstruir." }],
      quiz: [qz("A meta de reserva deve…", ["Acompanhar seu custo de vida", "Ser fixa pra sempre", "Ser zero"], "Custo muda."), qz("Usar a reserva numa emergência é…", ["O propósito dela", "Um erro", "Proibido"], "Serve pra isso.")],
    },
  ],
});
