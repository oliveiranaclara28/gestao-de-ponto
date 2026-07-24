import { funcionariosService } from './funcionarios.service';
import { funcionariosRepository } from './funcionarios.repository';
import { funcionarioHistoricoService } from './funcionarioHistorico.service';

jest.mock('./funcionarios.repository');
jest.mock('./funcionarioHistorico.service');

describe('funcionariosService.criar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro se já existir funcionário com o mesmo e-mail', async () => {
    (funcionariosRepository.buscarPorEmail as jest.Mock).mockResolvedValue({
      id: 'algum-id',
      email: 'existente@teste.com',
    });

    const dadosNovoFuncionario = {
      nome: 'Teste',
      cpf: '12345678900',
      email: 'existente@teste.com',
      cargo: 'Analista',
      estabelecimento: 'Matriz',
      dataAdmissao: new Date(),
      salario: 3000,
    };

    await expect(funcionariosService.criar(dadosNovoFuncionario)).rejects.toThrow(
      'Já existe um funcionário cadastrado com esse e-mail.'
    );

    expect(funcionariosRepository.criar).not.toHaveBeenCalled();
  });

  it('deve criar o funcionário com matrícula gerada quando não há duplicata', async () => {
    (funcionariosRepository.buscarPorEmail as jest.Mock).mockResolvedValue(null);
    (funcionariosRepository.contarTotal as jest.Mock).mockResolvedValue(3);
    (funcionariosRepository.criar as jest.Mock).mockImplementation((dados) =>
      Promise.resolve({ id: 'novo-id', ...dados })
    );
    (funcionarioHistoricoService.criarHistoricoInicial as jest.Mock).mockResolvedValue(undefined);

    const dadosNovoFuncionario = {
      nome: 'Maria Nova',
      cpf: '98765432100',
      email: 'maria.nova@teste.com',
      cargo: 'Analista',
      estabelecimento: 'Matriz',
      dataAdmissao: new Date(),
      salario: 3500,
    };

    const resultado = await funcionariosService.criar(dadosNovoFuncionario);

    expect(resultado.funcionario.matricula).toBe('F0004');
    expect(resultado.senhaProvisoria).toBeDefined();
    expect(resultado.funcionario.senhaHash).not.toBe(resultado.senhaProvisoria);
  });
});