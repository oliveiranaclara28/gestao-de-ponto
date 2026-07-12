// Routes: define os endpoints HTTP e a ordem do pipeline Auth -> Validator -> Controller.

import { Router } from 'express';
import { pontosController } from './pontos.controller';
import { pontosValidator } from './pontos.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { proprioOuPapel, soParaSiNoBody } from '../../middlewares/ownership.middleware';
import { Papel } from '../../generated/prisma/enums';

const pontosRoutes = Router();

// POST /pontos -- registrar (qualquer autenticado, só o próprio ponto)
pontosRoutes.post(
  '/',
  authMiddleware,
  soParaSiNoBody('funcionarioId'),
  pontosValidator.validarRegistrar,
  pontosController.registrar
);

// GET /pontos -- histórico geral, todos os funcionários (Admin, RH, Gestor)
pontosRoutes.get(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosController.listarTodos
);

// GET /pontos/:id/horas -- precisa vir ANTES da rota de :id genérico
pontosRoutes.get(
  '/:id/horas',
  authMiddleware,
  proprioOuPapel([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosValidator.validarIdParam,
  pontosController.calcularHoras
);

// GET /pontos/:id -- histórico de um funcionário (o próprio, ou Admin/RH/Gestor)
pontosRoutes.get(
  '/:id',
  authMiddleware,
  proprioOuPapel([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosValidator.validarIdParam,
  pontosController.buscarPorFuncionario
);

// GET /pontos/:id/banco-de-horas (o próprio, ou Admin/RH/Gestor)
pontosRoutes.get(
  '/:id/banco-de-horas',
  authMiddleware,
  proprioOuPapel([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosValidator.validarIdParam,
  pontosValidator.validarPeriodo,
  pontosController.calcularBancoDeHoras
);

export { pontosRoutes };