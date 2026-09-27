# Showcase Academia Ia.i — textos + guia de design

Formato: 1920×1080, 30 fps, 2min25s. Celular em frame à esquerda (44% da largura), textos animados à direita, fundo que muda de cor **3 vezes** em todo o vídeo (um "capítulo" por cor).

`showcase.html` já implementa tudo isso: coloque `academia_iai_apresentacao.mp4` na mesma pasta, abra no Chrome em tela cheia (F11), aperte **H** para esconder os controles, **Espaço** para dar play e grave a tela (OBS / gravador do Windows / QuickTime). Para editar textos e tempos, mude só o array `CUES` no topo do `<script>`. `?offset=1.5` na URL desloca todos os textos se o corte do vídeo mudar.

### Exportar como MP4

```bash
npm install                     # instala o playwright (devDependency)
npx playwright install ffmpeg   # 1x: gravador de tela do playwright
npm run showcase:export -- showcase/academia_iai_apresentacao.mp4 showcase/showcase.mp4 --offset=0
```

Abre o player em um Chrome headless 1920×1080, toca o vídeo inteiro em tempo real, grava a tela e converte para H.264 (`ffmpeg` precisa estar no PATH). Usa o Chrome instalado na máquina (necessário para decodificar H.264); se não for encontrado, aponte com `CHROME_PATH=/caminho/do/chrome`. Leva ~duração do vídeo + 1 min.

---

## 1. Capítulos e cor de fundo

| Capítulo | Tempo | Fundo | Por quê |
|---|---|---|---|
| **1 · O problema** (Pix) | 0:00–0:28 | Grafite quente `#0F0F0F → #2A1B12`, brilho laranja discreto | É o "app Itaú de sempre": sóbrio, sem promessa. |
| **2 · Aprender** (onboarding, trilha, lição) | 0:28–1:38 | Azul-marinho da AcademIA `#0F1E4A → #1B2F6B` | Mesma cor da UI da Academia — o espectador "entra" no produto. |
| **3 · Agir** (cofrinho, rendimento, missões, pontos, chat) | 1:38–2:22 | Laranja Itaú `#EC7000 → #C24E00` | Dinheiro guardado = momento de energia. Único trecho quente. |
| **4 · Fecho** | 2:22–2:25 | Volta ao grafite | Fecha o ciclo; logo + link. |

Transição de fundo: cross-fade de 1,4 s, nunca corte seco. Um "glow" desfocado (blur 120 px) se move lentamente entre capítulos para o fundo não parecer estático sem competir com o celular.

## 2. Textos na tela (não é a locução — é o que aparece escrito)

Regra: **headline ≤ 7 palavras**, subline ≤ 16 palavras, 1 palavra em destaque laranja por headline. O texto reforça a locução, não a repete.

| Tempo | Kicker | Headline (destaque em *itálico*) | Subline |
|---|---|---|---|
| 0:00 | Este é o Lucas | O salário *caiu.* | Mas ele ainda não tem um plano claro para esse dinheiro. |
| 0:05 | Como todo mês | **R$ 1.300** · Quase tudo *sai.* | Pix para a própria conta em outro banco. |
| 0:14 | Como todo mês | Para o cliente, é só mais um Pix. | Para o Itaú, é a chance de entender o **objetivo** por trás dessa saída. |
| 0:20 | Comprovante | Pix enviado. *Nada muda.* | A transferência termina normalmente, sem interromper a jornada. |
| 0:24 | Depois do comprovante | Um convite *contextual.* | Cinco minutos para começar um objetivo. Dá para ignorar ou desligar. |
| 0:28 | Academia Ia.i | Finanças *sem juridiquês.* | Uma trilha por vez · missões ligadas ao objetivo · sequência que multiplica a recompensa. |
| 0:37 | Objetivo | Lucas escolhe: *sair de casa.* | Diz o que já sabe e conta, com as próprias palavras, o que quer. |
| 0:46 | Meta calculada | R$ 6.000 · *R$ 300/mês* · ~20 meses | Os números vêm do sistema, não da IA. |
| 0:49 | Onde entra a IA | A IA.I *redige.* O sistema *calcula.* | O contexto do Lucas escolhe a linguagem e monta uma trilha personalizada. |
| 0:53 | Trilha | Quatro unidades, *um passo por vez.* | Vocabulário do dinheiro → organizar o mês → reserva → grandes objetivos. |
| 1:02 | Lição | Cabe em *poucos minutos.* | Um conceito, um exemplo do dia a dia e uma pergunta. |
| 1:15 | Quiz | Corrige *na hora.* | Explica a resposta e faz o erro voltar na revisão. |
| 1:28 | Lição concluída | Precisão, tempo e *missões desbloqueadas.* | Cada lição termina numa ação real no app. |
| 1:31 | Painel de teste | Avançar o *tempo.* | Simula meses e eventos financeiros para ver a experiência evoluir. |
| 1:36 | +1 mês | O salário *cai de novo.* | O app atualiza toda a jornada. |
| 1:38 | Cofrinho "Sair de casa" | R$ 300 *guardados.* | Objetivo, progresso e prazo ficam visíveis. Criado junto com a trilha. |
| 1:47 | Simular +1 mês | **R$ 300 → R$ 310,16** (contador animado) · O tempo *trabalha a favor.* | Sem novos depósitos, após 4 meses simulados. |
| 1:59 | Missões | O hábito vira *missão.* | Guardar, cumprir lições, completar desafios. Tudo opcional, ligado à vida real. |
| 2:06 | Minhas Vantagens | Pontos Itaú, *onde já existem.* | Desconto na fatura, Itaú Shop e outros benefícios simulados. |
| 2:11 | Assistente IA.I | "Quanto posso guardar *esse mês?*" | Lê meta, saldo e histórico. Orienta — **não movimenta dinheiro.** |
| 2:22 | De volta à home | Educação que *vira ação.* | Objetivo, progresso, sequência e saldo atualizados — dentro do próprio Itaú. |

Fixos na tela o tempo todo: logo `AcademIA.I` (topo-esq.), 4 pontinhos de capítulo (topo-dir.), barra de progresso laranja (topo), rodapé "Protótipo · dados, rendimentos, pontos e integrações simulados" e o link do protótipo. O aviso de "simulado" fixo evita repetir isso em cada card e protege na banca.

## 3. Tipografia e cor

- Headline: **Manrope 800**, ~69 px (3,6 vw), tracking −2 %, branco. Destaque em `#EC7000` (no capítulo laranja, destaque em `#FFE2C2` para manter contraste).
- Subline: **Inter 400**, ~26 px, branco 72 %.
- Kicker: Inter 600, 18 px, caixa alta, tracking 18 %, laranja, com traço de 2 px à esquerda.
- Número grande (R$ 1.300 / R$ 310,16): Manrope 800, ~100 px, algarismos tabulares (não "pulam" durante o contador).
- Nunca mais de 4 linhas de texto visíveis ao mesmo tempo. Se a locução é longa, o texto fica curto — o narrador completa.

## 4. Animação

- Entrada: fade + slide de 18 px para cima + desblur (6 px → 0), 450 ms, `cubic-bezier(.2,.8,.2,1)`. Kicker → headline → subline em cascata de 80 ms.
- Saída: fade rápido de 260 ms antes do próximo texto (evita "piscar").
- Contador R$ 300 → 310,16: 1,8 s, ease-out cúbico; começa exatamente quando o botão "Simular +1 mês" é tocado no vídeo.
- Celular: fixo (sem zoom/parallax); só o vídeo dentro dele se move. Movimento demais no frame + texto animado = cansativo.
- Nada anima entre cues; o único movimento contínuo é o glow do fundo (2 s de transição a cada capítulo).

## 5. Áudio (o vídeo é mudo)

- Locução gravada em cima do roteiro (voz real > TTS na banca). Deixe 0,5 s de silêncio antes de cada troca de capítulo.
- Trilha instrumental baixa (−22 dB), sem batida forte; só um leve "swell" nas 3 trocas de fundo.
- Som curto de "tick" (opcional) no contador de R$ 310,16 e no "Pix enviado".

## 6. Atenção

- **O vídeo anexado (1:54, 384×848) não é o `academia_iai_apresentacao.mp4` do roteiro (2:25, 720×1558).** Ele para em "trocar trilha" e não tem cofrinho, simulação de meses, missões, pontos nem chat. Os tempos acima seguem o roteiro de 2:25; se o corte final for outro, ajuste o `t` de cada cue (o campo "cue" no canto inferior mostra o tempo atual para sincronizar).
- Grave o vídeo do celular em 720×1558 direto do simulador/navegador, sem a barra do Safari (a barra de URL e os botões de navegação aparecem no vídeo atual e distraem; se não der para regravar, use `object-fit: cover` com leve zoom para escondê-los).
- Remova do protótipo a frase "Cofrinho rende 100% do CDI" antes de gravar (decisão já registrada na v10).
