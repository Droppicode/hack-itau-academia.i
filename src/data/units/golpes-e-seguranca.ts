import { defineUnit, info, pick, qz, tf } from "./types";

export default defineUnit({
  id: "golpes-e-seguranca",
  name: "Golpes e segurança",
  tagline: "Pix, falso atendente, links e o MED",
  accent: "#B3261E",
  level: 1,
  tags: ["segurança", "golpes", "pix", "hábitos", "básico", "dados"],
  deep: [
    { title: "Pressa é o sinal", text: "Quase todo golpe cria urgência: \"sua conta vai ser bloqueada\", \"só hoje\". Parar 1 minuto quebra o golpe." },
    { title: "Banco não pede", text: "O banco não pede senha, código do token nem transferência pra \"conta segura\". Na dúvida, desligue e ligue você no número oficial." },
  ],
  lessons: [
    {
      title: "Golpe do Pix",
      learn: "Falso parente e falsa venda.",
      steps: [
        info("Falso parente", "Alguém diz que trocou de número e pede um Pix urgente. Confirme por ligação antes de pagar."),
        info("Confira o nome", "Antes de confirmar um Pix, veja o nome e a instituição de quem vai receber."),
        pick("\"Mãe, troquei de número, me faz um Pix?\" O que fazer?", ["Ligar pro número antigo e confirmar", "Pagar rápido", "Mandar a senha"], "Confirme por outro canal."),
        tf("Conferir o nome do recebedor evita muitos golpes.", true, "O app mostra antes de confirmar."),
      ],
      deep: [{ title: "Limite noturno", text: "Pix tem limite menor à noite por padrão. Manter limites baixos reduz o prejuízo de um golpe." }],
      quiz: [qz("Antes de confirmar um Pix, confira…", ["Nome e banco do recebedor", "A cor da tela", "Nada"], "Evita pagar a pessoa errada."), qz("Pedido urgente de Pix por número novo:", ["Confirmar por ligação", "Pagar na hora", "Ignorar sempre sem ler"], "Verifique.")],
    },
    {
      title: "Falso atendente",
      learn: "Quando o \"banco\" liga pra você.",
      steps: [
        info("Central falsa", "Golpistas ligam dizendo ser do banco e pedem código, senha ou que você transfira pra proteger o dinheiro."),
        info("O que fazer", "Desligue e ligue você mesmo pro número atrás do cartão ou no app oficial."),
        pick("O \"banco\" pede o código que chegou por SMS. Você…", ["Não passa e desliga", "Passa o código", "Passa só metade"], "Código é a chave da sua conta."),
        tf("O banco pode pedir para você transferir tudo para uma conta segura.", false, "Isso não existe."),
      ],
      deep: [{ title: "Número mascarado", text: "O identificador de chamadas pode ser falsificado. Mesmo aparecendo o número do banco, desconfie." }],
      quiz: [qz("Ligação pedindo senha é…", ["Golpe", "Procedimento normal", "Atualização"], "Banco não pede senha."), qz("Número seguro pra ligar:", ["O do verso do cartão ou app", "O que veio no SMS", "O do link"], "Canal oficial.")],
    },
    {
      title: "Links e phishing",
      learn: "Mensagens que imitam empresas.",
      steps: [
        info("Phishing", "Mensagem falsa com link que imita site de banco ou loja pra roubar dados."),
        info("Sinais", "Erros de português, endereço estranho, prêmio que você não pediu, urgência."),
        pick("SMS: \"Seu Pix foi bloqueado, clique aqui\". Você…", ["Abre o app oficial pra conferir", "Clica no link", "Responde com CPF"], "Nunca pelo link."),
        tf("Um site com cadeado é sempre confiável.", false, "Golpistas também usam cadeado."),
      ],
      deep: [{ title: "Instale do lugar certo", text: "Baixe apps só da loja oficial e desconfie de pedidos pra instalar \"módulo de segurança\"." }],
      quiz: [qz("Phishing é…", ["Mensagem falsa pra roubar dados", "Um investimento", "Um tipo de Pix"], "Imitação."), qz("Recebeu link suspeito do banco:", ["Abra o app oficial", "Clique", "Encaminhe"], "Canal oficial.")],
    },
    {
      title: "Caiu no golpe: MED",
      learn: "Mecanismo Especial de Devolução.",
      steps: [
        info("MED", "Mecanismo do Pix pra pedir devolução em caso de golpe. Avise o banco o quanto antes pelo app ou central."),
        info("Boletim de ocorrência", "Registre o B.O. e guarde prints e comprovantes."),
        pick("Caiu num golpe de Pix. Primeiro passo:", ["Avisar o banco pelos canais oficiais", "Esperar uma semana", "Apagar as mensagens"], "Rapidez aumenta a chance de bloqueio."),
        tf("O MED garante devolução total sempre.", false, "Depende de haver saldo na conta do golpista."),
      ],
      deep: [{ title: "Prazo", text: "O pedido pode ser feito em até 80 dias, mas quanto antes melhor." }],
      quiz: [qz("MED serve pra…", ["Pedir devolução de Pix em golpe", "Aumentar limite", "Investir"], "Mecanismo do BC."), qz("Além de avisar o banco:", ["Registrar B.O. e guardar provas", "Pagar o golpista", "Nada"], "Documente.")],
    },
    {
      title: "Proteger seus dados",
      learn: "Senha, token e celular.",
      steps: [
        info("Senha forte", "Nada de data de nascimento. Use senhas diferentes em cada serviço e verificação em duas etapas."),
        info("Celular", "Bloqueio de tela e biometria. Se roubarem o celular, avise o banco e a operadora na hora."),
        pick("Qual é uma boa prática?", ["Senhas diferentes por serviço", "A mesma senha em tudo", "Senha 123456"], "Evita efeito dominó."),
        tf("Compartilhar o código do token com amigos é seguro.", false, "É pessoal."),
      ],
      deep: [{ title: "Dados pessoais", text: "CPF, foto do documento e selfie vazados podem abrir contas em seu nome. Compartilhe só quando necessário." }],
      quiz: [qz("Roubaram o celular. Primeiro…", ["Avisar banco e operadora", "Esperar", "Postar"], "Bloqueie o acesso."), qz("Verificação em duas etapas…", ["Aumenta a segurança", "Deixa inseguro", "Não serve"], "Camada extra.")],
    },
  ],
});
