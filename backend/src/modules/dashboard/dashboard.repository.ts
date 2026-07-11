// Repository: único lugar deste módulo que conversa com o Prisma.

import { prisma } from '../../config/database';

export const dashboardRepository = {
  contarFuncionariosAtivos: () => {
    return prisma.funcionario.count({ where: { status: 'ATIVO' } });
  },

  // Traz todos os funcionários ativos, junto com os pontos que eles
  // registraram HOJE -- essa é a base pra calcular presentes/ausentes/atrasados.
  listarAtivosComPontosDeHoje: (inicioDoDia: Date, fimDoDia: Date) => {
    return prisma.funcionario.findMany({
      where: { status: 'ATIVO' },
      include: {
        pontos: {
          where: {
            dataHora: { gte: inicioDoDia, lte: fimDoDia },
          },
          orderBy: { dataHora: 'asc' },
        },
      },
    });
  },

  contarPendencias: () => {
    return prisma.ponto.count({ where: { status: 'PENDENTE' } });
  },

  // Base para o gráfico: quantos registros de cada tipo aconteceram hoje.
  contarRegistrosDeHojePorTipo: (inicioDoDia: Date, fimDoDia: Date) => {
    return prisma.ponto.groupBy({
      by: ['tipo'],
      where: { dataHora: { gte: inicioDoDia, lte: fimDoDia } },
      _count: true,
    });
  },
};