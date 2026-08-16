// Controller: só orquestra a requisição -- recebe req, chama o Service, devolve res.

import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';
import { logger } from '../../config/logger';

export const dashboardController = {
  obterResumo: async (_req: Request, res: Response) => {
    try {
      const resumo = await dashboardService.obterResumo();
      return res.json(resumo);
    } catch (erro) {
      logger.error({ erro }, 'Erro ao gerar dashboard');
      return res.status(500).json({ error: 'Erro ao gerar dashboard.' });
    }
  },
};