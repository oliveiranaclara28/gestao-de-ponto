// Validator: roda como middleware, ANTES do Controller.

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

const periodoQuerySchema = z.object({
  dataInicio: z.coerce.date(),
  dataFim: z.coerce.date(),
});

export const relatoriosValidator = {
  validarIdParam: (req: Request, res: Response, next: NextFunction) => {
    const resultado = idParamSchema.safeParse(req.params);
    if (!resultado.success) {
      return res.status(400).json({ error: 'ID inválido na URL' });
    }
    next();
  },

  validarPeriodo: (req: Request, res: Response, next: NextFunction) => {
    const resultado = periodoQuerySchema.safeParse(req.query);
    if (!resultado.success) {
      return res.status(400).json({ error: 'dataInicio e dataFim são obrigatórios e devem ser datas válidas.' });
    }
    next();
  },
};