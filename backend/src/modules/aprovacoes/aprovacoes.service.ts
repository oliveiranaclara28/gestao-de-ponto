// Service: contém a regra de negócio do módulo. Não conhece Express.

import { aprovacoesRepository } from './aprovacoes.repository';

export const aprovacoesService = {
  listarPendentes: () => {
    return aprovacoesRepository.listarPendentes();
  },

  aprovar: async (pontoId: string, gestorId: string) => {
    return decidir(pontoId, gestorId, 'APROVADO');
  },

  rejeitar: async (pontoId: string, gestorId: string, motivoRejeicao: string) => {
    if (!motivoRejeicao || motivoRejeicao.trim().length === 0) {
      throw new Error('É obrigatório informar o motivo da rejeição.');
    }
    return decidir(pontoId, gestorId, 'REJEITADO', motivoRejeicao);
  },

  listarHistoricoPorPonto: (pontoId: string) => {
    return aprovacoesRepository.listarHistoricoPorPonto(pontoId);
  },
};

// Função auxiliar (não exportada) -- compartilha a validação entre
// aprovar e rejeitar, já que as duas seguem os mesmos passos, só
// mudando o status final e se exige motivo ou não.
async function decidir(
  pontoId: string,
  gestorId: string,
  status: 'APROVADO' | 'REJEITADO',
  motivoRejeicao?: string
) {
  const ponto = await aprovacoesRepository.buscarPontoComFuncionario(pontoId);
  if (!ponto) {
    throw new Error('Ponto não encontrado.');
  }

  if (ponto.status !== 'PENDENTE') {
    throw new Error(`Este ponto já foi ${ponto.status.toLowerCase()}, não pode ser decidido novamente.`);
  }

  // Regra de negócio: só o gestor DAQUELE funcionário específico
  // pode decidir sobre o ponto dele.
  if (ponto.funcionario.gestorId !== gestorId) {
    const erro = new Error('Você não tem permissão para decidir sobre este ponto.');
    (erro as any).status = 403;
    throw erro;
  }

  return aprovacoesRepository.criarDecisao(pontoId, gestorId, status, motivoRejeicao);
}