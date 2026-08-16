import { prisma } from "../../config/database";

// Repository: único lugar que conversa com o Prisma pra essa tabela.
// Sem regra de negócio aqui -- isso mora no Service.
export const funcionarioHistoricoRepository = {
  buscarHistoricoAtual: (funcionarioId: string) => {
    return prisma.historicoCargoSetor.findFirst({
      where: { funcionarioId, dataFim: null },
    });
  },

  finalizarHistorico: (id: string, dataFim: Date) => {
    return prisma.historicoCargoSetor.update({
      where: { id },
      data: { dataFim },
    });
  },

  criarHistorico: (
    funcionarioId: string,
    cargo: string,
    estabelecimento: string,
    dataInicio: Date
  ) => {
    return prisma.historicoCargoSetor.create({
      data: { funcionarioId, cargo, estabelecimento, dataInicio },
    });
  },

  listarHistorico: (funcionarioId: string) => {
    return prisma.historicoCargoSetor.findMany({
      where: { funcionarioId },
      orderBy: { dataInicio: 'desc' },
    });
  },
};