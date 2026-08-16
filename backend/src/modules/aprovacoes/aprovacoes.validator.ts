// Validator: roda como middleware, ANTES do Controller.

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const decidirPontoSchema = z.object({
  gestorId: z.string().uuid('gestorId inválido'),
  motivoRejeicao: z.string().optional(),
});

const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const aprovacoesValidator = {
  validarDecisao: (req: Request, res: Response, next: NextFunction) => {
    const resultado = decidirPontoSchema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: resultado.error.flatten() });
    }
    req.body = resultado.data;
    next();
  },

  validarIdParam: (req: Request, res: Response, next: NextFunction) => {
    const resultado = idParamSchema.safeParse(req.params);
    if (!resultado.success) {
      return res.status(400).json({ error: 'ID inválido na URL' });
    }
    next();
  },
};