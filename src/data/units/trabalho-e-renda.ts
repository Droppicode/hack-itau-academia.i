import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "trabalho-e-renda",
  name: "Trabalho e renda",
  tagline: "Imposto de Renda, MEI e renda extra",
  accent: "#A15C00",
  level: 2,
  tags: ["renda", "trabalho", "imposto de renda", "mei", "freela", "carreira", "estudos"],
  deep: [
    { title: "Renda é o motor", text: "Organizar gastos tem limite; aumentar a renda com estudo, experiência ou renda extra muda o jogo." },
    { title: "Formalize", text: "Renda formal (CLT ou MEI) dá acesso a benefícios, crédito melhor e aposentadoria." },
  ],
  lessons: [
    {
      title: "Imposto de Renda",
      learn: "Declaração e restituição.",
      steps: [
        info("Declaração", "Todo ano, quem passou do limite de renda informa à Receita o que ganhou. O prazo costuma ir até o fim de maio."),
        info("Restituição", "Se o imposto descontado no ano foi maior que o devido, você recebe a diferença de volta."),
        pick("Restituição é…", ["Imposto pago a mais devolvido", "Uma multa", "Um empréstimo"], "Devolução."),
        tf("Quem não passa do limite de renda precisa declarar sempre.", false, "Há critérios de obrigatoriedade."),
      ],
      deep: [{ title: "Informe de rendimentos", text: "A empresa envia até fevereiro o informe com o que você ganhou e o IR retido. Guarde." }],
      quiz: [qz("Documento base da declaração:", ["Informe de rendimentos", "Fatura do cartão", "Extrato do Pix"], "Enviado pela empresa."), qz("Restituição pode…", ["Adiantar um objetivo", "Aumentar dívidas", "Nada"], "É entrada extra.")],
    },
    {
      title: "MEI",
      learn: "Formalizar um trabalho por conta.",
      steps: [
        info("MEI", "Microempreendedor Individual: CNPJ simples, com imposto fixo mensal (DAS) e faturamento até um limite anual."),
        info("Benefícios", "Emite nota, contribui pro INSS e tem acesso a conta PJ."),
        pick("O imposto do MEI é pago via…", ["DAS mensal", "Fatura do cartão", "Pix pra amigo"], "Guia fixa."),
        tf("MEI contribui para o INSS.", true, "Está incluso no DAS."),
      ],
      deep: [{ title: "Separe contas", text: "Mantenha dinheiro do MEI numa conta separada da pessoal. Fica mais fácil saber o lucro." }],
      quiz: [qz("MEI tem faturamento…", ["Limitado por ano", "Ilimitado", "Proibido"], "Há teto anual."), qz("Boa prática pro MEI:", ["Separar conta PJ e pessoal", "Misturar tudo", "Não emitir nota"], "Organização.")],
    },
    {
      title: "Renda extra",
      learn: "Freela, bicos e vendas.",
      steps: [
        info("Renda extra", "Dinheiro além do salário: freelas, aulas, vendas. Planeje antes de gastar."),
        info("Destino", "Definir antes pra onde vai a renda extra (objetivo, reserva) evita que ela suma."),
        pick("Ganhou R$ 300 num freela. Boa ideia:", ["Dividir entre objetivo e lazer", "Gastar tudo no mesmo dia", "Emprestar sem saber pra quem"], "Planejar."),
        tf("Renda extra deve ser declarada se passar dos limites.", true, "Entra no IR."),
      ],
      deep: [{ title: "Hora vale quanto?", text: "Divida o valor pelo tempo gasto. Às vezes o freela paga menos por hora do que parece." }],
      quiz: [qz("Renda extra sem destino tende a…", ["Sumir", "Dobrar", "Virar reserva sozinha"], "Defina antes."), qz("Calcular valor por hora ajuda a…", ["Ver se vale a pena", "Pagar menos IR", "Nada"], "Comparar esforço.")],
    },
    {
      title: "Investir em você",
      learn: "Cursos e carreira.",
      steps: [
        info("Capital humano", "Suas habilidades são o que gera renda. Cursos e certificações podem aumentar salário."),
        info("Avaliar curso", "Custo, tempo, empregabilidade e opções gratuitas antes de parcelar."),
        pick("Antes de pagar um curso caro…", ["Compare custo, retorno e opções gratuitas", "Parcele em 24x sem pensar", "Nada"], "Decisão consciente."),
        tf("Existem cursos gratuitos de qualidade.", true, "Muitas opções públicas."),
      ],
      deep: [{ title: "Objetivo curso", text: "Se o objetivo é um curso, guardar antes evita juros de parcelamento." }],
      quiz: [qz("Capital humano é…", ["Suas habilidades e conhecimento", "Seu cartão", "Seu FGTS"], "Gera renda."), qz("Pagar curso à vista com dinheiro guardado evita…", ["Juros", "Aulas", "Certificado"], "Sem parcelas.")],
    },
    {
      title: "Negociar salário",
      learn: "Conhecer seu valor.",
      steps: [
        info("Pesquisa", "Veja quanto o mercado paga pro seu cargo e região antes de conversar."),
        info("Pacote total", "Considere salário, VR, VA, plano de saúde e outros benefícios."),
        pick("Na proposta de emprego, compare…", ["O pacote total", "Só o salário bruto", "Só o nome da empresa"], "Benefícios contam."),
        tf("Perguntar sobre benefícios numa entrevista é errado.", false, "É normal e importante."),
      ],
      deep: [{ title: "Bruto x líquido", text: "Calcule o líquido de cada proposta: descontos mudam muito o que cai na conta." }],
      quiz: [qz("Antes de negociar:", ["Pesquisar o mercado", "Aceitar qualquer valor", "Nada"], "Informação é poder."), qz("Pacote total inclui…", ["Salário e benefícios", "Só salário", "Só VT"], "Tudo que você recebe.")],
    },
  ],
});
