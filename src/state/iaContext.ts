import { brl } from "../data/money";
import { knowledgeLabel } from "../data/personalizar";
import { fmtDay, fmtMult, MONTH_DAYS, POINT_BRL, SALARY_CENTS, SALARY_DAY, SALARY_FROM, UNITS } from "../data/trilha";
import { useTrilha } from "./TrilhaContext";

export function useIaContext() {
  const t = useTrilha();
  const trail = t.trailNow;
  return [
    `Hoje (simulado): ${fmtDay(t.day)}. Nome: Lucas Andrade Rocha (persona fictícia). Salário de ${brl(SALARY_CENTS)} cai todo dia ${SALARY_DAY} na conta Itaú (${SALARY_FROM}).`,
    `Saldo em conta corrente: ${brl(t.balanceCents)}.`,
    `Últimos lançamentos: ${t.txns.slice(-8).reverse().map((x) => `${fmtDay(x.day)} ${x.title} (${x.sub}) ${x.faturaCents !== undefined ? `${brl(x.faturaCents)} no cartão de crédito (fatura, não sai do saldo)` : `${x.cents > 0 ? "+" : "-"}${brl(Math.abs(x.cents))}`}${x.streak ? " [conta pra sequência]" : ""}`).join("; ")}.`,
    t.goal
      ? `Objetivo: ${t.goal.name}. Cofrinho: ${brl(t.goal.savedCents)} de ${brl(t.goal.targetCents)} (${Math.floor(t.goalPct)}%), rendeu ${brl(t.goal.yieldCents)}, rende 100% do CDI. Plano: ${brl(t.goal.monthlyCents)}/mês.`
      : "Ainda não escolheu objetivo nem criou cofrinho na academIA.I.",
    `Perfil: ${knowledgeLabel(t.profile.knowledge) ?? "não informado"}.${t.profile.text ? ` Situação contada pelo cliente: "${t.profile.text.slice(0, 400)}".` : ""}`,
    `Trilha ${trail.n} "${trail.title}" (${trail.source === "ia" ? "montada pela IA.I" : "montada localmente"}): ${t.trailUnits.map((u) => `${u.id} "${u.name}" ${t.unitDone(u.id) ? "(concluída)" : ""}`).join("; ")}.`,
    t.next ? `Próxima lição liberada: ${t.next.id} "${t.next.title}".` : "Trilha atual concluída: sugira montar a próxima.",
    `Lições liberadas ou feitas: ${t.trailLessons.filter((l) => t.unlocked(l.id)).map((l) => `${l.id} ${l.title}${t.done(l.id) ? " (feita)" : ""}`).join("; ")}.`,
    `Desafios: ${t.trailUnits.map((u) => `${u.id} ${t.unitDone(u.id) ? (t.unitBest[u.id] !== undefined ? `melhor ${t.unitBest[u.id]}` : "liberado") : "bloqueado"}`).join("; ")}.`,
    `Sequência: ${t.streak} semanas, multiplicador ${fmtMult(t.multiplier)}, ${t.weekActive ? "semana atual garantida" : `sem transação nesta semana (termina ${fmtDay(t.week * 7)})`}.`,
    `Missões: ${t.missions.map((m) => `${m.title} [${m.status}${m.kind === "mensal" ? `, ${brl(t.monthMinCents)} mantidos no mês, previsão +${t.monthPtsPreview} pts no fechamento ${fmtDay(t.month * MONTH_DAYS)}` : `, ${m.progress}/${m.goal}`}]`).join("; ")}.`,
    `Pontos Itaú: ${t.points} (≈ ${brl(Math.round(t.points * POINT_BRL * 100))}).${t.nextExpiry ? ` Próximo vencimento: ${t.nextExpiry.pts} pts em ${fmtDay(t.nextExpiry.day)}.` : ""}${t.expiredPoints ? ` Já venceram ${t.expiredPoints} pts.` : ""} Minhas Vantagens nível ${t.mvLevel}, ${t.passosDone} passos.`,
    `Outras unidades disponíveis pra próximas trilhas: ${UNITS.filter((u) => !t.trailUnits.some((x) => x.id === u.id)).map((u) => u.name).join(", ")}.`,
  ].join("\n");
}
