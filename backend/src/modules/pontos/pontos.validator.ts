// Validator: roda como middleware, ANTES do Controller.

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { TipoPonto } from '../../generated/prisma/enums';

const registrarPontoSchema = z.object({
  funcionarioId: z.string().uuid('funcionarioId inválido'),
  tipo: z.nativeEnum(TipoPonto, { message: 'Tipo de ponto inválido.' }),
  fotoUrl: z.string().min(1, 'fotoUrl é obrigatória'),
});

const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const pontosValidator = {
  validarRegistrar: (req: Request, res: Response, next: NextFunction) => {
    const resultado = registrarPontoSchema.safeParse(req.body);
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