import { aprovacoesService } from './aprovacoes.service';
import { aprovacoesRepository } from './aprovacoes.repository';

jest.mock('./aprovacoes.repository');

describe('aprovacoesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('aprovar', () => {
    it('deve lançar erro se o gestor não for o gestor do funcionário dono do ponto', async () => {
      (aprovacoesRepository.buscarPontoComFuncionario as jest.Mock).mockResolvedValue({
        id: 'ponto-1',
        status: 'PENDENTE',
        funcionario: { gestorId: 'gestor-correto' },
      });

      await expect(aprovacoesService.aprovar('ponto-1', 'gestor-errado')).rejects.toThrow(
        'Você não tem permissão para decidir sobre este ponto.'
      );

      expect(aprovacoesRepository.criarDecisao).not.toHaveBeenCalled();
    });

    it('deve lançar erro se o ponto já foi decidido antes', async () => {
      (aprovacoesRepository.buscarPontoComFuncionario as jest.Mock).mockResolvedValue({
        id: 'ponto-1',
        status: 'APROVADO',
        funcionario: { gestorId: 'gestor-correto' },
      });

      await expect(aprovacoesService.aprovar('ponto-1', 'gestor-correto')).rejects.toThrow(
        'Este ponto já foi aprovado, não pode ser decidido novamente.'
      );
    });

    it('deve aprovar normalmente quando o gestor é o correto e o ponto está pendente', async () => {
      (aprovacoesRepository.buscarPontoComFuncionario as jest.Mock).mockResolvedValue({
        id: 'ponto-1',
        status: 'PENDENTE',
        funcionario: { gestorId: 'gestor-correto' },
      });
      (aprovacoesRepository.criarDecisao as jest.Mock).mockResolvedValue([
        { status: 'APROVADO' },
        { status: 'APROVADO' },
      ]);

      const resultado = await aprovacoesService.aprovar('ponto-1', 'gestor-correto');

      expect(aprovacoesRepository.criarDecisao).toHaveBeenCalledWith(
        'ponto-1',
        'gestor-correto',
        'APROVADO',
        undefined
      );
      expect(resultado).toBeDefined();
    });
  });

  describe('rejeitar', () => {
    it('deve lançar erro se não informar o motivo da rejeição', async () => {
      await expect(aprovacoesService.rejeitar('ponto-1', 'gestor-1', '')).rejects.toThrow(
        'É obrigatório informar o motivo da rejeição.'
      );

      expect(aprovacoesRepository.buscarPontoComFuncionario).not.toHaveBeenCalled();
    });
  });
});