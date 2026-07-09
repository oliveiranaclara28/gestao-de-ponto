import { Request, Response } from 'express';
import { TipoPonto } from '../generated/prisma/enums';
import { prisma } from '../config/database';

// Express 5 pode entregar req.params.id como string ou string[]
// (quando a rota tem parâmetros repetidos) -- esse helper garante
// que sempre trabalhamos com uma string só.
function obterParamId(id: string | string[]): string | undefined {
  return Array.isArray(id) ? id[0] : id;
}

export const pontoController = {
  // 1. Registrar ponto
  registrar: async (req: Request, res: Response) => {
    try {
      const { funcionarioId, tipo, fotoUrl } = req.body;

      if (!funcionarioId || !tipo || !fotoUrl) {
        return res.status(400).json({
          error: 'funcionarioId, tipo e fotoUrl são obrigatórios.',
        });
      }

      if (!Object.values(TipoPonto).includes(tipo)) {
        return res.status(400).json({ error: 'Tipo de ponto inválido.' });
      }

      const ultimoPonto = await prisma.ponto.findFirst({
        where: { funcionarioId },
        orderBy: { dataHora: 'desc' },
      });

      if (ultimoPonto && ultimoPonto.tipo === tipo) {
        return res.status(400).json({
          error: `Você já registrou ${tipo}. Registre o próximo tipo de ponto antes.`,
        });
      }

      const novoPonto = await prisma.ponto.create({
        data: {
          funcionarioId,
          tipo,
          dataHora: new Date(),
          fotoUrl,
        },
      });

      return res.status(201).json(novoPonto);
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      return res.status(500).json({ error: 'Erro interno ao registrar ponto.' });
    }
  },

  // 2. Listar todos
  listarTodos: async (_req: Request, res: Response) => {
    try {
      const pontos = await prisma.ponto.findMany({
        include: { funcionario: true },
      });
      return res.json(pontos);
    } catch (error) {
      console.error('Erro ao listar pontos:', error);
      return res.status(500).json({ error: 'Erro ao buscar pontos.' });
    }
  },

  // 3. Buscar por funcionário
  buscarPorFuncionario: async (req: Request, res: Response) => {
    try {
      const id = obterParamId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
      }

      const pontos = await prisma.ponto.findMany({ where: { funcionarioId: id } });
      return res.json(pontos);
    } catch (error) {
      console.error('Erro ao buscar pontos do funcionário:', error);
      return res.status(500).json({ error: 'Erro ao buscar pontos do funcionário.' });
    }
  },

  // 4. Calcular horas (estrutura base -- lógica de cálculo ainda pendente)
  calcularHoras: async (req: Request, res: Response) => {
    try {
      const id = obterParamId(req.params.id);
      if (!id) {
        return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
      }

      const pontos = await prisma.ponto.findMany({
        where: { funcionarioId: id },
        orderBy: { dataHora: 'asc' },
      });

      const funcionario = await prisma.funcionario.findUnique({ where: { id } });
      if (!funcionario) {
        return res.status(404).json({ error: 'Funcionário não encontrado.' });
      }

      return res.json({ funcionario, pontos, minutosTotais: 0 });
    } catch (error) {
      console.error('Erro ao calcular horas:', error);
      return res.status(500).json({ error: 'Erro ao calcular horas.' });
    }
  },
};