// Routes: define os endpoints HTTP e a ordem do pipeline Validator -> Controller.

import { Router } from 'express';
import { pontosController } from './pontos.controller';
import { pontosValidator } from './pontos.validator';

const pontosRoutes = Router();

// POST /pontos -- registrar um novo ponto
pontosRoutes.post(
  '/',
  pontosValidator.validarRegistrar,
  pontosController.registrar
);

// GET /pontos -- histórico geral (todos os funcionários)
pontosRoutes.get('/', pontosController.listarTodos);

// GET /pontos/:id/horas -- precisa vir ANTES da rota de :id genérico,
// senão o Express interpretaria "horas" como se fosse um funcionarioId.
pontosRoutes.get(
  '/:id/horas',
  pontosValidator.validarIdParam,
  pontosController.calcularHoras
);

// GET /pontos/:id -- histórico de um funcionário específico
pontosRoutes.get(
  '/:id',
  pontosValidator.validarIdParam,
  pontosController.buscarPorFuncionario
);

export { pontosRoutes };