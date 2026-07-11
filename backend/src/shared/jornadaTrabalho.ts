// src/shared/jornadaTrabalho.ts

// Regra de negócio simples e temporária: todo funcionário segue o
// mesmo horário de trabalho (08:00 às 17:00), com tolerância de
// atraso. Quando o projeto evoluir para jornadas diferentes por
// funcionário, isso vira um campo no banco em vez de uma constante fixa.
export const JORNADA_PADRAO = {
    horaEntradaEsperada: 8, // 08:00
    toleranciaMinutos: 10,  // até 08:10 não conta como atraso
};