import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Importe o prisma que criamos

export const pontoController = {
  // 1. Registrar Ponto com Prisma
  registrar: async (req: Request, res: Response) => {
    try {
      const { funcionarioId, tipo } = req.body;

      // Busca o último ponto do funcionário no banco
      const ultimoPonto = await prisma.ponto.findFirst({
        where: { funcionarioId },
        orderBy: { dataHora: 'desc' },
      });

      // Validação de negócio (bloqueio de duplicidade)
      if (ultimoPonto && ultimoPonto.tipo === tipo) {
        const msg = tipo === 'entrada' 
          ? 'Você já registrou uma ENTRADA. Registre uma SAÍDA antes.' 
          : 'Você já registrou uma SAÍDA. Registre uma ENTRADA.';
        return res.status(400).json({ error: msg });
      }

      // Cria o registro no PostgreSQL
      const novoPonto = await prisma.ponto.create({
        data: { funcionarioId, tipo }
      });

      return res.status(201).json(novoPonto);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao registrar ponto no banco.' });
    }
  },

  // 2. Listar todos com JOIN (o Prisma faz o include!)
  listarTodos: async (req: Request, res: Response) => {
    const pontos = await prisma.ponto.findMany({
      include: { funcionario: true } // Traz os dados do funcionário junto!
    });
    return res.json(pontos);
  },

  // 3. Calcular Horas (Query poderosa direto no banco)
  calcularHoras: async (req: Request, res: Response) => {
    const { id } = req.params;
    
    const pontos = await prisma.ponto.findMany({
      where: { funcionarioId: id },
      orderBy: { dataHora: 'asc' }
    });

    const funcionario = await prisma.funcionario.findUnique({ where: { id } });

    // ... (Aqui você mantém a sua lógica de cálculo de minutosTotais que já funcionava)
    // O Prisma já entregou os dados ordenados, o resto é a sua regra de cálculo!
    
    return res.json({ /* ... seu objeto de resposta ... */ });
  },

  buscarPorFuncionario: async (req: Request, res: Response) => {
    const { id } = req.params;
    const pontos = await prisma.ponto.findMany({ where: { funcionarioId: id } });
    return res.json(pontos);
  }
};