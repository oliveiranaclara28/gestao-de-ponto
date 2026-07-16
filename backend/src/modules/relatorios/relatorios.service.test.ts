import { relatoriosService } from './relatorios.service';
import { funcionariosService } from '../funcionarios/funcionarios.service';
import { pontosService } from '../pontos/pontos.service';

jest.mock('../funcionarios/funcionarios.service');
jest.mock('../pontos/pontos.service');

describe('relatoriosService.gerarRelatorioFuncionario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (funcionariosService.buscarPorId as jest.Mock).mockResolvedValue({
      id: 'func-1',
      nome: 'Teste',
      matricula: 'F0001',
    });
  });

  it('deve marcar um dia útil sem nenhum ponto como FALTA', async () => {
    (pontosService.listarNoPeriodo as jest.Mock).mockResolvedValue([]);

    // 2026-07-13 é uma segunda-feira -- dia útil.
    const resultado = await relatoriosService.gerarRelatorioFuncionario(
      'func-1',
      new Date('2026-07-13'),
      new Date('2026-07-13')
    );

    expect(resultado.totalFaltas).toBe(1);
    expect(resultado.dias[0].status).toBe('FALTA');
  });

  it('deve marcar sábado/domingo como FOLGA, sem contar falta', async () => {
    (pontosService.listarNoPeriodo as jest.Mock).mockResolvedValue([]);

    // 2026-07-11 é sábado, 2026-07-12 é domingo.
    const resultado = await relatoriosService.gerarRelatorioFuncionario(
      'func-1',
      new Date('2026-07-11'),
      new Date('2026-07-12')
    );

    expect(resultado.totalFaltas).toBe(0);
    expect(resultado.dias.every((d) => d.status === 'FOLGA')).toBe(true);
  });

  it('deve calcular corretamente um dia trabalhado com atraso', async () => {
    (pontosService.listarNoPeriodo as jest.Mock).mockResolvedValue([
        { tipo: 'ENTRADA', dataHora: new Date('2026-07-13T08:30:00') },
        { tipo: 'SAIDA_ALMOCO', dataHora: new Date('2026-07-13T12:00:00') },
        { tipo: 'RETORNO', dataHora: new Date('2026-07-13T13:00:00') },
        { tipo: 'SAIDA', dataHora: new Date('2026-07-13T17:30:00') },
    ]);

    const resultado = await relatoriosService.gerarRelatorioFuncionario(
      'func-1',
      new Date('2026-07-13'),
      new Date('2026-07-13')
    );

    // Manhã: 08:30 -> 12:00 = 210 min. Tarde: 13:00 -> 17:30 = 270 min.
    // Total: 480 min = exatamente a carga horária esperada.
    expect(resultado.dias[0].status).toBe('TRABALHADO');
    expect(resultado.dias[0].atrasado).toBe(true);
    expect(resultado.dias[0].minutosTrabalhados).toBe(480);
    expect(resultado.bancoDeHorasMinutos).toBe(0);
  });
});