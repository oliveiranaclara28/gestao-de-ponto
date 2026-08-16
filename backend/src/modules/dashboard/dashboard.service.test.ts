import { dashboardService } from './dashboard.service';
import { dashboardRepository } from './dashboard.repository';

jest.mock('./dashboard.repository');

describe('dashboardService.obterResumo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // "Congela" o relógio do sistema num horário fixo, para os
    // cálculos de atraso serem sempre previsíveis no teste.
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-13T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve contar como atrasado um funcionário que bateu ENTRADA depois das 08:10', async () => {
    (dashboardRepository.contarFuncionariosAtivos as jest.Mock).mockResolvedValue(2);
    (dashboardRepository.listarAtivosComPontosDeHoje as jest.Mock).mockResolvedValue([
      {
        id: 'func-atrasado',
        pontos: [{ tipo: 'ENTRADA', dataHora: new Date('2026-07-13T08:30:00') }],
      },
      {
        id: 'func-no-horario',
        pontos: [{ tipo: 'ENTRADA', dataHora: new Date('2026-07-13T08:05:00') }],
      },
    ]);
    (dashboardRepository.contarPendencias as jest.Mock).mockResolvedValue(0);
    (dashboardRepository.contarRegistrosDeHojePorTipo as jest.Mock).mockResolvedValue([]);

    const resumo = await dashboardService.obterResumo();

    expect(resumo.presentesHoje).toBe(2);
    expect(resumo.atrasadosHoje).toBe(1);
    expect(resumo.ausentesHoje).toBe(0);
  });

  it('deve contar como ausente um funcionário ativo sem nenhum ponto hoje', async () => {
    (dashboardRepository.contarFuncionariosAtivos as jest.Mock).mockResolvedValue(1);
    (dashboardRepository.listarAtivosComPontosDeHoje as jest.Mock).mockResolvedValue([
      { id: 'func-ausente', pontos: [] },
    ]);
    (dashboardRepository.contarPendencias as jest.Mock).mockResolvedValue(0);
    (dashboardRepository.contarRegistrosDeHojePorTipo as jest.Mock).mockResolvedValue([]);

    const resumo = await dashboardService.obterResumo();

    expect(resumo.presentesHoje).toBe(0);
    expect(resumo.ausentesHoje).toBe(1);
  });
});