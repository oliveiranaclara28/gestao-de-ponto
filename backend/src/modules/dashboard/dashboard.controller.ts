// Controller: só orquestra a requisição -- recebe req, chama o Service, devolve res.

import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
  obterResumo: async (_req: Request, res: Response) => {
    try {
      const resumo = await dashboardService.obterResumo();
      return res.json(resumo);
    } catch (erro) {
      console.error('Erro ao gerar dashboard:', erro);
      return res.status(500).json({ error: 'Erro ao gerar dashboard.' });
    }
  },
};