// Repository: único lugar deste módulo que conversa com o Prisma.

import { prisma } from '../../config/database';
import { StatusAprovacao } from '../../generated/prisma/enums';

export const aprovacoesRepository = {
  buscarPontoComFuncionario: (pontoId: string) => {
    return prisma.ponto.findUnique({
      where: { id: pontoId },
      include: { funcionario: true },
    });
  },

  listarPendentes: () => {
    return prisma.ponto.findMany({
      where: { status: 'PENDENTE' },
      include: { funcionario: true },
      orderBy: { dataHora: 'asc' },
    });
  },

  // Cria a Aprovacao E atualiza o Ponto na mesma transação --
  // ou os dois acontecem juntos, ou nenhum acontece (evita um
  // ponto ficar "APROVADO" sem registro de quem aprovou, por
  // exemplo, se a segunda operação falhar no meio do caminho).
  criarDecisao: (
    pontoId: string,
    gestorId: string,
    status: StatusAprovacao,
    motivoRejeicao?: string
  ) => {
    return prisma.$transaction([
      prisma.aprovacao.create({
        data: { pontoId, gestorId, status, motivoRejeicao },
      }),
      prisma.ponto.update({
        where: { id: pontoId },
        data: { status: status === 'APROVADO' ? 'APROVADO' : 'REJEITADO' },
      }),
    ]);
  },

  listarHistoricoPorPonto: (pontoId: string) => {
    return prisma.aprovacao.findMany({
      where: { pontoId },
      orderBy: { dataAprovacao: 'desc' },
    });
  },
};