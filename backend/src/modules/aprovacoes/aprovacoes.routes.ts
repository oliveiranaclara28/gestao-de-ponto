// Routes: define os endpoints HTTP e a ordem do pipeline Validator -> Controller.

import { Router } from 'express';
import { aprovacoesController } from './aprovacoes.controller';
import { aprovacoesValidator } from './aprovacoes.validator';

const aprovacoesRoutes = Router();

// GET /aprovacoes/pendentes -- listagem de pontos aguardando decisão
aprovacoesRoutes.get('/pendentes', aprovacoesController.listarPendentes);

// PUT /aprovacoes/:id/aprovar -- :id aqui é o ID do Ponto
aprovacoesRoutes.put(
  '/:id/aprovar',
  aprovacoesValidator.validarIdParam,
  aprovacoesValidator.validarDecisao,
  aprovacoesController.aprovar
);

// PUT /aprovacoes/:id/rejeitar
aprovacoesRoutes.put(
  '/:id/rejeitar',
  aprovacoesValidator.validarIdParam,
  aprovacoesValidator.validarDecisao,
  aprovacoesController.rejeitar
);

// GET /aprovacoes/:id/historico -- histórico de decisões sobre um ponto específico
aprovacoesRoutes.get(
  '/:id/historico',
  aprovacoesValidator.validarIdParam,
  aprovacoesController.listarHistoricoPorPonto
);

export { aprovacoesRoutes };