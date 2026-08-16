import { funcionarioHistoricoRepository } from "./funcionarioHistorico.repository";

// Service: contém a regra de negócio do histórico. Decide QUANDO
// criar um novo registro, o Repository só sabe COMO salvar.
export const funcionarioHistoricoService = {
  // Chamado uma vez, logo após o cadastro do funcionário.
  criarHistoricoInicial: async (
    funcionarioId: string,
    cargo: string,
    estabelecimento: string
  ) => {
    await funcionarioHistoricoRepository.criarHistorico(
      funcionarioId,
      cargo,
      estabelecimento,
      new Date()
    );
  },

  // Só cria um histórico novo se cargo OU estabelecimento mudaram.
  // Se nada mudou, não faz nada -- evita registros duplicados
  // toda vez que o funcionário é editado (ex: só trocar telefone).
  atualizarHistorico: async (
    funcionarioId: string,
    cargoAnterior: string,
    estabelecimentoAnterior: string,
    novoCargo: string,
    novoEstabelecimento: string
  ) => {
    const houveMudanca =
      cargoAnterior !== novoCargo || estabelecimentoAnterior !== novoEstabelecimento;

    if (!houveMudanca) return;

    const historicoAtual = await funcionarioHistoricoRepository.buscarHistoricoAtual(funcionarioId);
    if (historicoAtual) {
      await funcionarioHistoricoRepository.finalizarHistorico(historicoAtual.id, new Date());
    }

    await funcionarioHistoricoRepository.criarHistorico(
      funcionarioId,
      novoCargo,
      novoEstabelecimento,
      new Date()
    );
  },

  listarHistorico: (funcionarioId: string) => {
    return funcionarioHistoricoRepository.listarHistorico(funcionarioId);
  },
};