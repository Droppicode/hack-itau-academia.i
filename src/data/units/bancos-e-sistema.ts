import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "bancos-e-sistema",
  name: "Como os bancos funcionam",
  tagline: "Banco Central, Selic, CDI e Open Finance",
  accent: "#26336B",
  level: 2,
  tags: ["bancos", "selic", "cdi", "banco central", "open finance", "portabilidade", "tarifas", "política monetária"],
  deep: [
    { title: "O ciclo do dinheiro", text: "Bancos captam de quem guarda e emprestam a quem precisa. O Banco Central regula e usa a Selic pra controlar a inflação." },
    { title: "Você tem direitos", text: "Portabilidade de salário e de crédito, pacote de serviços essenciais gratuito e Open Finance dão poder de escolha ao cliente." },
  ],
  lessons: [
    {
      title: "Banco Central",
      learn: "Quem cuida do sistema.",
      steps: [
        info("Banco Central", "Autarquia que regula os bancos, cuida da moeda e busca manter a inflação na meta."),
        info("Regras", "O Pix, o MED e o Open Finance são criações e regras do Banco Central."),
        pick("Quem criou o Pix?", ["Banco Central", "Uma loja", "A Receita"], "Sistema do BC."),
        tf("O Banco Central abre conta pra pessoas físicas.", false, "Ele regula; quem abre conta são os bancos."),
      ],
      deep: [{ title: "Meta de inflação", text: "O Conselho Monetário Nacional define a meta; o BC ajusta a Selic pra alcançá-la." }],
      quiz: [qz("Função do Banco Central:", ["Regular bancos e controlar a inflação", "Vender cartões", "Pagar salários"], "Autoridade monetária."), qz("O Pix é regido pelo…", ["Banco Central", "Ministério da Saúde", "Prefeitura"], "BC.")],
    },
    {
      title: "Selic e inflação",
      learn: "Por que os juros sobem e descem.",
      steps: [
        info("Selic", "Taxa básica de juros, definida pelo Copom a cada ~45 dias."),
        info("Efeito", "Selic alta encarece o crédito e aumenta o rendimento da renda fixa; ajuda a segurar a inflação."),
        pick("Selic sobe. O cofrinho a 100% do CDI tende a…", ["Render mais", "Render menos", "Parar"], "CDI acompanha a Selic."),
        tf("Selic alta deixa empréstimos mais baratos.", false, "Fica mais caro."),
      ],
      deep: [{ title: "Inflação no bolso", text: "Se a inflação é 4% e seu dinheiro rende 10%, o ganho real é ~6%." }],
      quiz: [qz("Quem define a Selic?", ["Copom", "Bancos privados", "Lojas"], "Comitê do BC."), qz("Selic alta ajuda a…", ["Conter a inflação", "Aumentar a inflação", "Nada"], "Esfria o consumo.")],
    },
    {
      title: "CDI entre bancos",
      learn: "A taxa que os bancos cobram entre si.",
      steps: [
        info("CDI", "Bancos emprestam entre si por um dia para fechar o caixa. A taxa média disso é o CDI, colado na Selic."),
        info("Referência", "Por isso a renda fixa é comparada em % do CDI: é o custo do dinheiro entre bancos."),
        pick("CDI vem de empréstimos…", ["Entre bancos", "Entre pessoas", "Do governo pra você"], "Interbancário."),
        tf("CDI e Selic ficam normalmente muito próximos.", true, "Andam juntos."),
      ],
      deep: [{ title: "Spread", text: "A diferença entre o que o banco paga ao captar e cobra ao emprestar é o spread." }],
      quiz: [qz("CDI significa…", ["Certificado de Depósito Interbancário", "Crédito Direto Imediato", "Conta de Depósito Individual"], "Interbancário."), qz("Spread bancário é…", ["Diferença entre captar e emprestar", "Uma tarifa de Pix", "Um investimento"], "Margem.")],
    },
    {
      title: "Open Finance",
      learn: "Seus dados, sua escolha.",
      steps: [
        info("Open Finance", "Com seu consentimento, bancos compartilham seus dados pra oferecer produtos melhores."),
        info("Controle", "Você escolhe quais dados, com quem e por quanto tempo. Pode cancelar quando quiser."),
        pick("Pra compartilhar dados no Open Finance precisa…", ["Do seu consentimento", "De nada", "De ir ao cartório"], "Sempre autorizado."),
        tf("Dá pra cancelar um compartilhamento.", true, "Pelo app, a qualquer momento."),
      ],
      deep: [{ title: "Pix por aproximação e transferências", text: "O Open Finance também permite iniciar pagamentos de outra conta sem sair do app." }],
      quiz: [qz("Open Finance depende…", ["Do consentimento do cliente", "Do gerente", "Do governo"], "Você autoriza."), qz("Compartilhamento pode ser…", ["Cancelado a qualquer momento", "Nunca cancelado", "Vendido"], "Controle seu.")],
    },
    {
      title: "Portabilidade e tarifas",
      learn: "Escolher onde ficar.",
      steps: [
        info("Portabilidade de salário", "Você pode pedir que o salário depositado num banco vá automaticamente pra outro de sua escolha, sem custo."),
        info("Serviços essenciais", "Todo banco deve oferecer um pacote gratuito com saques, transferências e extratos básicos."),
        pick("Portabilidade de salário tem custo?", ["Não", "Sim, alto", "Só no fim de semana"], "É direito gratuito."),
        tf("Você é obrigado a pagar pacote de tarifas.", false, "Existe o pacote essencial gratuito."),
      ],
      deep: [{ title: "Escolha consciente", text: "Compare atendimento, segurança, app e benefícios. O banco principal é onde sua vida financeira fica mais simples." }],
      quiz: [qz("Portabilidade de salário leva o salário…", ["Pro banco que você escolher", "Pro governo", "Pra poupança obrigatória"], "Direito do trabalhador."), qz("Pacote essencial é…", ["Gratuito", "Pago", "Só pra empresas"], "Regra do BC.")],
    },
  ],
});
