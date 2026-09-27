import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "primeiros-investimentos",
  name: "Primeiros investimentos",
  tagline: "Perfil, risco, diversificação e renda variável",
  accent: "#5A2D82",
  level: 3,
  tags: ["investimentos", "risco", "perfil", "ações", "fundos", "diversificação", "longo prazo"],
  deep: [
    { title: "Ordem saudável", text: "Reserva primeiro, depois objetivos de médio prazo em renda fixa, e só então renda variável pro longo prazo." },
    { title: "Educação, não recomendação", text: "Esta unidade explica conceitos. Antes de investir, faça o teste de perfil (suitability) no banco." },
  ],
  lessons: [
    {
      title: "Perfil de investidor",
      learn: "Conservador, moderado, arrojado.",
      steps: [
        info("Suitability", "Questionário obrigatório que identifica seu perfil. O banco só deve oferecer o que combina com ele."),
        info("Perfis", "Conservador prioriza segurança; moderado aceita alguma oscilação; arrojado aceita mais risco pelo longo prazo."),
        pick("Quem não aceita ver o valor cair é…", ["Conservador", "Arrojado", "Especulador"], "Prioriza segurança."),
        tf("O perfil pode mudar com o tempo.", true, "Muda com idade, renda e objetivos."),
      ],
      deep: [{ title: "Seja honesto", text: "Responder o que você acha \"certo\" em vez do que sente leva a produtos que te assustam na primeira queda." }],
      quiz: [qz("Suitability serve pra…", ["Indicar produtos adequados ao perfil", "Dar crédito", "Cobrar tarifa"], "Adequação."), qz("Perfil que aceita mais risco:", ["Arrojado", "Conservador", "Nenhum"], "Busca retorno maior.")],
    },
    {
      title: "Risco x retorno",
      learn: "Não existe almoço grátis.",
      steps: [
        info("Relação", "Quanto maior o retorno esperado, maior o risco. Promessa de muito retorno sem risco é sinal de golpe."),
        info("Tipos de risco", "Mercado (preço oscila), crédito (quem pegou não paga) e liquidez (difícil vender)."),
        pick("\"Garantimos 5% ao mês sem risco\" é…", ["Sinal de golpe", "Ótimo negócio", "Renda fixa"], "Muito acima do CDI."),
        tf("Todo investimento tem algum risco.", true, "Até os mais seguros."),
      ],
      deep: [{ title: "Pirâmide", text: "Esquemas que pagam antigos com dinheiro de novos entram em colapso. Desconfie de indicação premiada." }],
      quiz: [qz("Retorno maior geralmente vem com…", ["Risco maior", "Risco zero", "Garantia do FGC"], "Relação clássica."), qz("Risco de crédito é…", ["Quem pegou o dinheiro não pagar", "O preço subir", "Esquecer a senha"], "Calote.")],
    },
    {
      title: "Diversificar",
      learn: "Não pôr tudo num lugar só.",
      steps: [
        info("Diversificação", "Dividir o dinheiro entre tipos de investimento reduz o impacto de um deles ir mal."),
        info("Por objetivo", "Separe por prazo: curto (reserva), médio (objetivo) e longo (aposentadoria)."),
        pick("Diversificar reduz…", ["O impacto de um investimento ruim", "Todo o risco", "O imposto"], "Não zera o risco."),
        tf("Colocar tudo em uma ação é diversificar.", false, "É concentrar."),
      ],
      deep: [{ title: "Simples funciona", text: "Pra começar, dois ou três produtos bem entendidos bastam." }],
      quiz: [qz("Separar por prazo ajuda a…", ["Escolher o produto certo pra cada objetivo", "Pagar menos IR sempre", "Nada"], "Prazo guia a escolha."), qz("Diversificar é…", ["Dividir entre investimentos", "Concentrar", "Sacar tudo"], "Espalhar o risco.")],
    },
    {
      title: "Ações e bolsa",
      learn: "Ser sócio de empresas.",
      steps: [
        info("Ação", "Pedaço de uma empresa. Você ganha se ela valoriza ou paga dividendos, e pode perder se cai."),
        info("Longo prazo", "Ações oscilam muito no curto prazo. Faz sentido pra dinheiro que pode ficar anos investido."),
        pick("Dinheiro pra usar em 3 meses deve ir pra…", ["Renda fixa com liquidez", "Ações", "Cripto"], "Curto prazo não combina com oscilação."),
        tf("Dividendos são parte do lucro distribuída aos acionistas.", true, "Uma forma de ganho."),
      ],
      deep: [{ title: "ETFs", text: "Fundos de índice compram várias ações de uma vez, diversificando com pouco dinheiro." }],
      quiz: [qz("Ação é…", ["Parte de uma empresa", "Empréstimo ao banco", "Título do governo"], "Você vira sócio."), qz("Ações combinam com…", ["Longo prazo", "Reserva de emergência", "Conta de luz do mês"], "Oscilam no curto.")],
    },
    {
      title: "Fundos e taxas",
      learn: "Investir com gestor.",
      steps: [
        info("Fundo de investimento", "Vários investidores juntam dinheiro e um gestor aplica segundo uma política."),
        info("Taxa de administração", "Cobrada por ano sobre o valor total. Em fundo DI, taxa alta pode comer o rendimento."),
        pick("Fundo DI com taxa de 2% a.a. e CDI de 10,5%…", ["Rende bem menos que um CDB 100% do CDI", "Rende o mesmo", "Rende mais"], "A taxa sai do rendimento."),
        tf("Taxa de administração é cobrada só quando o fundo ganha.", false, "É cobrada sempre."),
      ],
      deep: [{ title: "Come-cotas", text: "Em muitos fundos, parte do IR é antecipada em maio e novembro." }],
      quiz: [qz("Quem decide onde o fundo investe?", ["O gestor", "Você, sozinho", "O Banco Central"], "Gestão profissional."), qz("Taxa alta em fundo simples…", ["Reduz o rendimento", "Aumenta o rendimento", "Não importa"], "Sai do seu ganho.")],
    },
  ],
});
