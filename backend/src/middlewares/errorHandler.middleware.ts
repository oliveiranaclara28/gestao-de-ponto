// Middleware de tratamento global de erros. Precisa ser o ÚLTIMO
// middleware registrado no server.ts -- o Express reconhece um
// "error handler" pela assinatura de 4 parâmetros (com o `err` na
// frente), e só chama isso quando algum next(erro) ou throw acontece
// dentro de uma rota async.

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    const appError = err as AppError;
    return res.status(appError.status).json({ error: appError.message });
  }

  console.error('Erro não tratado:', err);
  return res.status(500).json({ error: 'Erro interno no servidor.' });
}