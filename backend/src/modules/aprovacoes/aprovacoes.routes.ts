// Routes: define os endpoints HTTP e a ordem do pipeline Auth -> Validator -> Controller.

import { Router } from 'express';
import { aprovacoesController } from './aprovacoes.controller';
import { aprovacoesValidator } from './aprovacoes.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Papel } from '../../generated/prisma/enums';

const aprovacoesRoutes = Router();

const somenteGestaoDeAprovacao = roleMiddleware([Papel.ADMINISTRADOR, Papel.GESTOR]);

// GET /aprovacoes/pendentes -- listagem de pontos aguardando decisão
aprovacoesRoutes.get(
  '/pendentes',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesController.listarPendentes
);

// PUT /aprovacoes/:id/aprovar -- :id aqui é o ID do Ponto
aprovacoesRoutes.put(
  '/:id/aprovar',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesValidator.validarIdParam,
  aprovacoesValidator.validarDecisao,
  aprovacoesController.aprovar
);

// PUT /aprovacoes/:id/rejeitar
aprovacoesRoutes.put(
  '/:id/rejeitar',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesValidator.validarIdParam,
  aprovacoesValidator.validarDecisao,
  aprovacoesController.rejeitar
);

// GET /aprovacoes/:id/historico -- histórico de decisões sobre um ponto específico
aprovacoesRoutes.get(
  '/:id/historico',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesValidator.validarIdParam,
  aprovacoesController.listarHistoricoPorPonto
);

export { aprovacoesRoutes };