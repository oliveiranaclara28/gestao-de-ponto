// Routes: define os endpoints HTTP.

import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Papel } from '../../generated/prisma/enums';

const dashboardRoutes = Router();

// GET /dashboard -- resumo com todos os indicadores (Admin, RH, Gestor)
dashboardRoutes.get(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  dashboardController.obterResumo
);

export { dashboardRoutes };