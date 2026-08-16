// Service: contém a regra de negócio do módulo. Não conhece Express.

import { pontosRepository } from "./pontos.repository";
import { funcionariosService } from "../funcionarios/funcionarios.service";
import { TipoPonto } from "../../generated/prisma/enums";
import { JORNADA_PADRAO } from "../../shared/jornadaTrabalho";

export const pontosService = {
  registrar: async (
    funcionarioId: string,
    tipo: TipoPonto,
    fotoUrl: string,
  ) => {
    // Reaproveita a checagem que já existe no módulo funcionarios --
    // lança erro automaticamente se o funcionário não existir.
    await funcionariosService.buscarPorId(funcionarioId);

    const ultimoPonto = await pontosRepository.buscarUltimoPonto(funcionarioId);
    if (ultimoPonto && ultimoPonto.tipo === tipo) {
      throw new Error(
        `Você já registrou ${tipo}. Registre o próximo tipo de ponto antes.`,
      );
    }

    return pontosRepository.criar(funcionarioId, tipo, fotoUrl);
  },

  listarTodos: () => {
    return pontosRepository.listarTodos();
  },

  listarPorFuncionario: async (funcionarioId: string) => {
    await funcionariosService.buscarPorId(funcionarioId);
    return pontosRepository.listarPorFuncionario(funcionarioId);
  },

  calcularHoras: async (funcionarioId: string) => {
    const funcionario = await funcionariosService.buscarPorId(funcionarioId);
    const pontos = await pontosRepository.listarPorFuncionario(funcionarioId);
    // minutosTotais: 0 é um placeholder -- a lógica de cálculo de
    // horas trabalhadas/banco de horas ainda não foi implementada,
    // fica pra uma etapa própria depois.
    return { funcionario, pontos, minutosTotais: 0 };
  },

  calcularBancoDeHoras: async (
    funcionarioId: string,
    dataInicio: Date,
    dataFim: Date,
  ) => {
    await funcionariosService.buscarPorId(funcionarioId);

    // Garante que dataFim cubra o dia inteiro (23:59:59), não só o
    // instante exato da meia-noite -- senão, registros feitos mais
    // tarde no último dia do período ficariam de fora.
    const fimAjustado = new Date(dataFim);
    fimAjustado.setHours(23, 59, 59, 999);

    const pontos = await pontosRepository.listarPorFuncionarioNoPeriodo(
      funcionarioId,
      dataInicio,
      fimAjustado,
    );

    // Agrupa os pontos por dia (chave: "2026-07-10", por exemplo).
    const pontosPorDia = new Map<string, typeof pontos>();
    for (const ponto of pontos) {
      const chaveDoDia = ponto.dataHora.toISOString().slice(0, 10);
      const doDia = pontosPorDia.get(chaveDoDia) ?? [];
      doDia.push(ponto);
      pontosPorDia.set(chaveDoDia, doDia);
    }

    const diasDetalhados: Array<{
      dia: string;
      minutosTrabalhados: number | null;
      saldoMinutos: number | null;
      completo: boolean;
    }> = [];

    let bancoDeHorasMinutos = 0;

    for (const [dia, pontosDoDia] of pontosPorDia) {
      const entrada = pontosDoDia.find((p) => p.tipo === "ENTRADA");
      const saidaAlmoco = pontosDoDia.find((p) => p.tipo === "SAIDA_ALMOCO");
      const retorno = pontosDoDia.find((p) => p.tipo === "RETORNO");
      const saida = pontosDoDia.find((p) => p.tipo === "SAIDA");

      const diaCompleto = !!(entrada && saidaAlmoco && retorno && saida);

      if (!diaCompleto) {
        diasDetalhados.push({
          dia,
          minutosTrabalhados: null,
          saldoMinutos: null,
          completo: false,
        });
        continue;
      }

      const minutosManha = diferencaEmMinutos(
        entrada!.dataHora,
        saidaAlmoco!.dataHora,
      );
      const minutosTarde = diferencaEmMinutos(
        retorno!.dataHora,
        saida!.dataHora,
      );
      const minutosTrabalhados = minutosManha + minutosTarde;
      const saldoMinutos =
        minutosTrabalhados - JORNADA_PADRAO.cargaHorariaDiariaMinutos;

      bancoDeHorasMinutos += saldoMinutos;
      diasDetalhados.push({
        dia,
        minutosTrabalhados,
        saldoMinutos,
        completo: true,
      });
    }

    return {
      bancoDeHorasMinutos,
      diasDetalhados: diasDetalhados.sort((a, b) => a.dia.localeCompare(b.dia)),
    };
  },

  // Usado pelo módulo de relatórios -- lembra da regra: um módulo só
  // pode chamar o SERVICE de outro módulo, nunca o Repository direto.
  // Essa função existe justamente para servir de "porta de entrada".
  listarNoPeriodo: (funcionarioId: string, dataInicio: Date, dataFim: Date) => {
    const fimAjustado = new Date(dataFim);
    fimAjustado.setHours(23, 59, 59, 999);
    return pontosRepository.listarPorFuncionarioNoPeriodo(
      funcionarioId,
      dataInicio,
      fimAjustado,
    );
  },
};

// Calcula quantos minutos se passaram entre dois horários --
// usado para medir o período da manhã e da tarde trabalhados.
function diferencaEmMinutos(inicio: Date, fim: Date): number {
  return Math.round((fim.getTime() - inicio.getTime()) / 60000);
}
