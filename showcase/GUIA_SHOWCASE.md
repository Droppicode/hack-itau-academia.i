# Showcase Academia Ia.i — textos + guia de design

Formato: 1920×1080, 30 fps, 2min00s (base: `academia_iai_video_final_2min_v2.mp4`). Celular em frame à esquerda (44% da largura), textos animados à direita, fundo que muda de cor **3 vezes** em todo o vídeo.

Duas camadas de texto, com ritmos diferentes:

1. **Etapa** (rótulo de contexto, em cima): diz *o que está acontecendo* na tela — "Transferência", "Objetivo", "Trilha de Aprendizado"… Muda só **11 vezes** em 2 min (média 11 s cada) e fica fixo enquanto a ação dura. Vem com número (01–11) e pontinhos no topo-direito, para o espectador saber onde está na jornada.
2. **Headline + subline** (embaixo): explica *por que importa*. Muda quando a ação muda de verdade (19 trocas, mín. 4 s, média ~6 s) — nunca a cada micro-passo do roteiro.

O player vive em `public/showcase/index.html` (com o mp4 ao lado) e é publicado junto com o protótipo em `https://hack-itau-academia-i.vercel.app/showcase/`. Localmente, abra no Chrome em tela cheia (F11), aperte **H** para esconder os controles, **Espaço** para dar play e grave a tela. Para editar, mude só os arrays `STAGES` (etapas) e `CUES` (textos) no topo do `<script>`. `?offset=1.5` na URL desloca tudo se o corte do vídeo mudar.

### Exportar como MP4

```bash
npm install                     # instala o playwright (devDependency)
npx playwright install ffmpeg   # 1x: gravador de tela do playwright
npm run showcase:export -- public/showcase/academia_iai_video_final_2min_v2.mp4 showcase/showcase.mp4 --offset=0
```

Abre o player em um Chrome headless 1920×1080, toca o vídeo inteiro em tempo real, grava a tela e converte para H.264 (`ffmpeg` precisa estar no PATH). Usa o Chrome ou Chromium do sistema (procura em `/usr/bin/chromium`, `/usr/bin/google-chrome` etc.; no Arch, `pacman -S chromium ffmpeg` basta); se não achar, aponte com `CHROME_PATH=/caminho/do/chromium`. Leva ~duração do vídeo + 1 min.

---

## 1. Capítulos e cor de fundo

| Capítulo | Tempo | Fundo | Por quê |
|---|---|---|---|
| **1 · O problema** (Pix + convite) | 0:00–0:16 | Grafite quente `#0F0F0F → #2A1B12`, brilho laranja discreto | É o "app Itaú de sempre": sóbrio, sem promessa. |
| **2 · Aprender** (onboarding, objetivo, trilha, lição) | 0:16–1:04 | Azul-marinho da AcademIA `#0F1E4A → #1B2F6B` | Mesma cor da UI da Academia — o espectador "entra" no produto. |
| **3 · Agir** (cofrinho, rendimento, missões, pontos, chat) | 1:04–1:54 | Laranja Itaú `#EC7000 → #C24E00` | Dinheiro guardado = momento de energia. Único trecho quente. |
| **4 · Fecho** | 1:54–2:00 | Volta ao grafite | Fecha o ciclo; logo + link. |

Transição de fundo: cross-fade de 1,4 s, nunca corte seco. Um "glow" desfocado (blur 120 px) se move lentamente entre capítulos para o fundo não parecer estático sem competir com o celular.

## 2. Etapas (contexto da ação — muda devagar)

| # | Tempo (v2) | Etapa | O que aparece no celular |
|---|---|---|---|
| 01 | 0:00–0:12 | Transferência | Home, Pix R$ 1.300, revisão, comprovante |
| 02 | 0:12–0:16 | Convite Academia Ia.i | Card pós-Pix na home |
| 03 | 0:16–0:28 | Boas-vindas | Onboarding: objetivo, linguagem simples, trilha, missões, sequência |
| 04 | 0:28–0:40 | Objetivo | "Sair de casa", nível, texto livre, meta R$ 6.000/300, IA.I montando |
| 05 | 0:40–0:48 | Trilha de Aprendizado | 4 unidades, progressão bloqueada |
| 06 | 0:48–1:04 | Lição e Quiz | Lição 01, quiz, feedback, "Lição concluída" |
| 07 | 1:04–1:28 | Cofrinho | +1 mês, guardar R$ 300, Simular +1 mês → R$ 310,16 |
| 08 | 1:28–1:36 | Missões | Mês, semana, desafios de unidade, quanto vale |
| 09 | 1:36–1:44 | Pontos Itaú | Pontos e Benefícios / Minhas Vantagens (+ painel de teste) |
| 10 | 1:44–1:54 | Assistente IA.I | Chat "Quanto posso guardar esse mês?" |
| 11 | 1:54–2:00 | Resultado | Home atualizada |

## 3. Textos na tela (não é a locução — é o que aparece escrito)

Regra: **headline ≤ 7 palavras**, subline ≤ 16 palavras, 1 palavra em destaque laranja por headline. O texto reforça a locução, não a repete. Troca só quando a ação muda (mín. 4 s em tela).

| Tempo (v2) | Headline (destaque em *itálico*) | Subline |
|---|---|---|
| 0:00 | O salário *caiu.* | Lucas ainda não tem um plano claro para esse dinheiro. |
| 0:04 | **R$ 1.300** · Quase tudo *sai.* | Pix para a própria conta em outro banco. Para o Itaú, é a chance de entender o **objetivo** dessa saída. |
| 0:10 | Pix enviado. *Nada muda.* | A transferência termina normalmente, sem interromper a jornada. |
| 0:12 | Um convite *contextual.* | Depois do comprovante: cinco minutos para começar um objetivo. Dá para ignorar. |
| 0:16 | Finanças *sem juridiquês.* | Um objetivo · uma trilha por vez · missões ligadas ao objetivo · sequência que multiplica a recompensa. |
| 0:28 | Lucas escolhe: *sair de casa.* | Diz o que já sabe e conta, com as próprias palavras, o que quer. |
| 0:34 | R$ 6.000 · *R$ 300/mês* · ~20 meses | O sistema calcula os números. A IA.I escolhe a linguagem e monta a trilha. |
| 0:40 | Quatro unidades, *um passo por vez.* | Vocabulário do dinheiro → organizar o mês → reserva → grandes objetivos. |
| 0:48 | Cabe em *poucos minutos.* | Um conceito, um exemplo do dia a dia e uma pergunta. |
| 0:54 | Corrige *na hora.* | Explica a resposta e faz o erro voltar na revisão. |
| 1:00 | Lição *concluída.* | Precisão, tempo e missões desbloqueadas — cada lição termina numa ação real. |
| 1:04 | Um mês depois, o salário *cai de novo.* | O painel de teste avança o tempo e o app atualiza toda a jornada. |
| 1:08 | R$ 300 *guardados.* | No cofrinho criado junto com a trilha. Objetivo, progresso e prazo visíveis. |
| 1:16 | Simular *+1 mês.* | Mostra o rendimento ao longo do tempo, sem novos depósitos. |
| 1:24 | **R$ 300 → R$ 310,16** (contador) · O tempo *trabalha a favor.* | Após 4 meses simulados. |
| 1:28 | O hábito vira *missão.* | Guardar, cumprir lições, completar desafios. Tudo opcional, ligado à vida real. |
| 1:36 | Pontos Itaú, *onde já existem.* | Minhas Vantagens: desconto na fatura, Itaú Shop e outros benefícios simulados. |
| 1:44 | "Quanto posso guardar *esse mês?*" | Lê meta, saldo e histórico. Orienta — **não movimenta dinheiro.** |
| 1:54 | Educação que *vira ação.* | Objetivo, progresso, sequência e saldo atualizados — dentro do próprio Itaú. |

Fixos na tela o tempo todo: logo `AcademIA.I` (topo-esq.), 11 pontinhos de etapa (topo-dir.), barra de progresso laranja (topo), rodapé "Protótipo · dados, rendimentos, pontos e integrações simulados" e o link do protótipo. O aviso de "simulado" fixo evita repetir isso em cada card e protege na banca.

## 4. Tipografia e cor

- Headline: **Manrope 800**, ~69 px (3,6 vw), tracking −2 %, branco. Destaque em `#EC7000` (no capítulo laranja, destaque em `#FFE2C2` para manter contraste).
- Subline: **Inter 400**, ~26 px, branco 72 %.
- Etapa: Manrope 700, 24 px, caixa alta, tracking 2 %, branco; número (01–11) em laranja dentro de caixa com borda sutil; "n/11" em branco 72 %.
- Número grande (R$ 1.300 / R$ 310,16): Manrope 800, ~100 px, algarismos tabulares (não "pulam" durante o contador).
- Nunca mais de 4 linhas de texto visíveis ao mesmo tempo. Se a locução é longa, o texto fica curto — o narrador completa.

## 5. Animação

- Etapa: entra com slide lateral de 14 px + fade, 600 ms. Só anima quando a etapa muda — fica parada durante as trocas de headline.
- Headline/subline: fade + slide de 18 px para cima + desblur (6 px → 0), 450 ms, `cubic-bezier(.2,.8,.2,1)`, em cascata de 80 ms.
- Saída: fade rápido de 260 ms antes do próximo texto (evita "piscar").
- Contador R$ 300 → 310,16: 1,8 s, ease-out cúbico; entra em 1:24, dois segundos antes do saldo de R$ 310,16 aparecer no vídeo (1:26).
- Celular: fixo (sem zoom/parallax); só o vídeo dentro dele se move. Movimento demais no frame + texto animado = cansativo.
- Nada anima entre cues; o único movimento contínuo é o glow do fundo (2 s de transição a cada capítulo).

## 6. Áudio (o vídeo é mudo)

- Locução gravada em cima do roteiro (voz real > TTS na banca). Deixe 0,5 s de silêncio antes de cada troca de capítulo.
- Trilha instrumental baixa (−22 dB), sem batida forte; só um leve "swell" nas 3 trocas de fundo.
- Som curto de "tick" (opcional) no contador de R$ 310,16 e no "Pix enviado".

## 7. Atenção

- Os tempos acima foram sincronizados frame a frame com o `academia_iai_video_final_2min_v2.mp4` (2:00). Se regravar, ajuste o `t` de `STAGES`/`CUES` — o campo "cue" no canto inferior mostra o tempo atual e a etapa para conferir.
- Remova do protótipo a frase "Cofrinho rende 100% do CDI" antes de gravar (decisão já registrada na v10).
