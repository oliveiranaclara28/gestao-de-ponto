import { Request, Response } from 'express';
import { TipoPonto } from '../generated/prisma/enums';
import { prisma } from '../config/database';

function obterParamId(id: string | string[]): string | undefined {
  return Array.isArray(id) ? id[0] : id;
}

export const pontoController = {
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
    } catch {
      return res.status(500).json({ error: 'Erro ao registrar ponto no banco.' });
    }
  },

  listarTodos: async (_req: Request, res: Response) => {
    const pontos = await prisma.ponto.findMany({
      include: { funcionario: true },
    });
    return res.json(pontos);
  },

  calcularHoras: async (req: Request, res: Response) => {
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

    return res.json({
      funcionario,
      pontos,
      minutosTotais: 0,
    });
  },

  buscarPorFuncionario: async (req: Request, res: Response) => {
    const id = obterParamId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: 'ID do funcionário é obrigatório.' });
    }

    const pontos = await prisma.ponto.findMany({ where: { funcionarioId: id } });
    return res.json(pontos);
  },
};