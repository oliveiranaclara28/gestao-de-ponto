import { prisma } from "../../config/database";
import { TipoPonto } from "../../generated/prisma/enums";

export const pontosRepository = {
  buscarUltimoPonto: (funcionarioId: string) => {
    return prisma.ponto.findFirst({
      where: { funcionarioId },
      orderBy: { dataHora: "desc" },
    });
  },

  criar: (funcionarioId: string, tipo: TipoPonto, fotoUrl: string) => {
    return prisma.ponto.create({
      data: {
        funcionarioId,
        tipo,
        dataHora: new Date(),
        fotoUrl,
      },
    });
  },

  listarTodos: () => {
    return prisma.ponto.findMany({
      include: { funcionario: true },
      orderBy: { dataHora: "desc" },
    });
  },

  listarPorFuncionario: (funcionarioId: string) => {
    return prisma.ponto.findMany({
      where: { funcionarioId },
      orderBy: { dataHora: "asc" },
    });
  },

  listarPorFuncionarioNoPeriodo: (
    funcionarioId: string,
    dataInicio: Date,
    dataFim: Date,
  ) => {
    return prisma.ponto.findMany({
      where: {
        funcionarioId,
        dataHora: { gte: dataInicio, lte: dataFim },
      },
      orderBy: { dataHora: "asc" },
    });
  },
};
