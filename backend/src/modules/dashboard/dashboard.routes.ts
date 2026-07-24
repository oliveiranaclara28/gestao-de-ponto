// Routes: define os endpoints HTTP.

import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Papel } from '../../generated/prisma/enums';

const dashboardRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Indicadores gerais de presença e pendências
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retorna o resumo com os indicadores do dashboard
 *     description: >
 *       Inclui contagem de funcionários ativos, presentes/ausentes/atrasados
 *       hoje e pendências de aprovação. Estrutura exata de resposta não
 *       documentada em detalhe -- consulte dashboard.service.ts.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Indicadores do dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR, RH ou GESTOR)
 */
dashboardRoutes.get(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  dashboardController.obterResumo
);

export { dashboardRoutes };