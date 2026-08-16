import { pontosService } from './pontos.service';
import { pontosRepository } from './pontos.repository';
import { funcionariosService } from '../funcionarios/funcionarios.service';

jest.mock('./pontos.repository');
jest.mock('../funcionarios/funcionarios.service');

describe('pontosService.registrar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro ao tentar registrar o mesmo tipo de ponto duas vezes seguidas', async () => {
    (funcionariosService.buscarPorId as jest.Mock).mockResolvedValue({ id: 'func-1' });
    (pontosRepository.buscarUltimoPonto as jest.Mock).mockResolvedValue({
      tipo: 'ENTRADA',
    });

    await expect(
      pontosService.registrar('func-1', 'ENTRADA' as any, '/uploads/foto.jpg')
    ).rejects.toThrow('Você já registrou ENTRADA. Registre o próximo tipo de ponto antes.');

    expect(pontosRepository.criar).not.toHaveBeenCalled();
  });

  it('deve registrar normalmente quando o tipo é diferente do último ponto', async () => {
    (funcionariosService.buscarPorId as jest.Mock).mockResolvedValue({ id: 'func-1' });
    (pontosRepository.buscarUltimoPonto as jest.Mock).mockResolvedValue({
      tipo: 'ENTRADA',
    });
    (pontosRepository.criar as jest.Mock).mockResolvedValue({
      id: 'ponto-novo',
      tipo: 'SAIDA_ALMOCO',
    });

    const resultado = await pontosService.registrar('func-1', 'SAIDA_ALMOCO' as any, '/uploads/foto.jpg');

    expect(resultado.id).toBe('ponto-novo');
    expect(pontosRepository.criar).toHaveBeenCalledWith('func-1', 'SAIDA_ALMOCO', '/uploads/foto.jpg');
  });

  it('deve registrar normalmente quando não existe ponto anterior', async () => {
    (funcionariosService.buscarPorId as jest.Mock).mockResolvedValue({ id: 'func-1' });
    (pontosRepository.buscarUltimoPonto as jest.Mock).mockResolvedValue(null);
    (pontosRepository.criar as jest.Mock).mockResolvedValue({ id: 'ponto-1', tipo: 'ENTRADA' });

    const resultado = await pontosService.registrar('func-1', 'ENTRADA' as any, '/uploads/foto.jpg');

    expect(resultado.id).toBe('ponto-1');
  });
});