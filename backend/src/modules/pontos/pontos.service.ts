// Service: contém a regra de negócio do módulo. Não conhece Express.

import { pontosRepository } from './pontos.repository';
import { funcionariosService } from '../funcionarios/funcionarios.service';
import { TipoPonto } from '../../generated/prisma/enums';

export const pontosService = {
  registrar: async (funcionarioId: string, tipo: TipoPonto, fotoUrl: string) => {
    // Reaproveita a checagem que já existe no módulo funcionarios --
    // lança erro automaticamente se o funcionário não existir.
    await funcionariosService.buscarPorId(funcionarioId);

    const ultimoPonto = await pontosRepository.buscarUltimoPonto(funcionarioId);
    if (ultimoPonto && ultimoPonto.tipo === tipo) {
      throw new Error(
        `Você já registrou ${tipo}. Registre o próximo tipo de ponto antes.`
      );
    }

    return pontosRepository.criar(funcionarioId, tipo, fotoUrl);
  },

  listarTodos: () => {
    return pontosRepository.listarTodos();
  },

  listarPorFuncionario: async (funcionarioId: string) => {
    await funcionariosService.buscarPorId(funcionarioId);
    return pontosRepository.listarPorFuncionario(funcionarioId);
  },

  calcularHoras: async (funcionarioId: string) => {
    const funcionario = await funcionariosService.buscarPorId(funcionarioId);
    const pontos = await pontosRepository.listarPorFuncionario(funcionarioId);
    // minutosTotais: 0 é um placeholder -- a lógica de cálculo de
    // horas trabalhadas/banco de horas ainda não foi implementada,
    // fica pra uma etapa própria depois.
    return { funcionario, pontos, minutosTotais: 0 };
  },
};