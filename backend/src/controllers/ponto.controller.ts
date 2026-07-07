import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const pontoController = {
  // 1. Registrar Ponto
  registrar: async (req: Request, res: Response) => {
    try {
      const { funcionarioId, tipo } = req.body;

      if (!prisma || !prisma.ponto) {
        return res.status(500).json({ error: "Banco de dados não inicializado." });
      }

      const ultimoPonto = await prisma.ponto.findFirst({
        where: { funcionarioId },
        orderBy: { dataHora: 'desc' },
      });

      if (ultimoPonto && ultimoPonto.tipo === tipo) {
        const msg = tipo === 'entrada' 
          ? 'Você já registrou uma ENTRADA. Registre uma SAÍDA antes.' 
          : 'Você já registrou uma SAÍDA. Registre uma ENTRADA.';
        return res.status(400).json({ error: msg });
      }

      const novoPonto = await prisma.ponto.create({
        data: { funcionarioId, tipo }
      });

      return res.status(201).json(novoPonto);
    } catch (error) {
      console.error("Erro ao registrar ponto:", error);
      return res.status(500).json({ error: 'Erro interno ao registrar ponto.' });
    }
  },

  // 2. Listar todos
  listarTodos: async (req: Request, res: Response) => {
    try {
      if (!prisma || !prisma.ponto) throw new Error("Prisma não inicializado");
      
      const pontos = await prisma.ponto.findMany({
        include: { funcionario: true }
      });
      return res.json(pontos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pontos.' });
    }
  },

  // 3. Buscar por funcionário
  buscarPorFuncionario: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!prisma || !prisma.ponto) throw new Error("Prisma não inicializado");

      const pontos = await prisma.ponto.findMany({ 
        where: { funcionarioId: id } 
      });
      return res.json(pontos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar pontos do funcionário.' });
    }
  },

  // 4. Calcular Horas (Estrutura base para sua lógica)
  calcularHoras: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!prisma || !prisma.ponto || !prisma.funcionario) throw new Error("Prisma não inicializado");

      const pontos = await prisma.ponto.findMany({
        where: { funcionarioId: id },
        orderBy: { dataHora: 'asc' }
      });

      const funcionario = await prisma.funcionario.findUnique({ where: { id } });
      
      return res.json({ funcionario, pontos, message: "Lógica de cálculo pendente." });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao calcular horas.' });
    }
  }
};