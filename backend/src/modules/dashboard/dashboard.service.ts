// Service: contém a regra de negócio do módulo. Não conhece Express.

import { dashboardRepository } from './dashboard.repository';
import { JORNADA_PADRAO } from '../../shared/jornadaTrabalho';

// Retorna o início (00:00:00) e fim (23:59:59) do dia de hoje --
// usado para filtrar "o que aconteceu hoje" nas consultas.
function obterIntervaloDeHoje() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);

  const fim = new Date();
  fim.setHours(23, 59, 59, 999);

  return { inicio, fim };
}

// Um funcionário está atrasado se a ENTRADA dele hoje aconteceu
// depois do horário esperado + tolerância.
function estaAtrasado(dataHoraEntrada: Date): boolean {
  const limiteEntrada = new Date(dataHoraEntrada);
  limiteEntrada.setHours(JORNADA_PADRAO.horaEntradaEsperada, JORNADA_PADRAO.toleranciaMinutos, 0, 0);

  return dataHoraEntrada > limiteEntrada;
}

export const dashboardService = {
  obterResumo: async () => {
    const { inicio, fim } = obterIntervaloDeHoje();

    const [funcionariosAtivos, funcionariosComPontos, pendencias, registrosPorTipo] =
      await Promise.all([
        dashboardRepository.contarFuncionariosAtivos(),
        dashboardRepository.listarAtivosComPontosDeHoje(inicio, fim),
        dashboardRepository.contarPendencias(),
        dashboardRepository.contarRegistrosDeHojePorTipo(inicio, fim),
      ]);

    let presentes = 0;
    let atrasados = 0;

    for (const funcionario of funcionariosComPontos) {
      const entradaHoje = funcionario.pontos.find((p) => p.tipo === 'ENTRADA');
      if (entradaHoje) {
        presentes++;
        if (estaAtrasado(entradaHoje.dataHora)) {
          atrasados++;
        }
      }
    }

    const ausentes = funcionariosAtivos - presentes;

    return {
      funcionariosAtivos,
      presentesHoje: presentes,
      ausentesHoje: ausentes,
      atrasadosHoje: atrasados,
      pendenciasAprovacao: pendencias,
      graficoRegistrosPorTipo: registrosPorTipo.map((item) => ({
        tipo: item.tipo,
        quantidade: item._count,
      })),
    };
  },
};