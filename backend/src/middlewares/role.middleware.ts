import { Request, Response, NextFunction } from 'express';
import { Papel } from '../generated/prisma/enums';

export const roleMiddleware = (papeisPermitidos: Papel[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user.papel vem do token JWT
    if (!req.user || !papeisPermitidos.includes(req.user.papel)) {
      return res.status(403).json({ error: 'Acesso negado: cargo sem permissão.' });
    }
    next();
  };
};