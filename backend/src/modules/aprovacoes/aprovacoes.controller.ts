// Controller: só orquestra a requisição -- recebe req, chama o Service, devolve res.

import { Request, Response } from 'express';
import { aprovacoesService } from './aprovacoes.service';

export const aprovacoesController = {
  listarPendentes: async (_req: Request, res: Response) => {
    const pendentes = await aprovacoesService.listarPendentes();
    return res.json(pendentes);
  },

  aprovar: async (req: Request, res: Response) => {
    try {
      const { gestorId } = req.body;
      const resultado = await aprovacoesService.aprovar(req.params.id as string, gestorId);
      return res.status(200).json(resultado);
    } catch (erro) {
      const status = (erro as any).status ?? 400;
      return res.status(status).json({ error: (erro as Error).message });
    }
  },

  rejeitar: async (req: Request, res: Response) => {
    try {
      const { gestorId, motivoRejeicao } = req.body;
      const resultado = await aprovacoesService.rejeitar(
        req.params.id as string,
        gestorId,
        motivoRejeicao
      );
      return res.status(200).json(resultado);
    } catch (erro) {
      const status = (erro as any).status ?? 400;
      return res.status(status).json({ error: (erro as Error).message });
    }
  },

  listarHistoricoPorPonto: async (req: Request, res: Response) => {
    const historico = await aprovacoesService.listarHistoricoPorPonto(req.params.id as string);
    return res.json(historico);
  },
};