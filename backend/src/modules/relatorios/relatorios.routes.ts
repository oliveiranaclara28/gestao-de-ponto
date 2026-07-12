// Routes: define os endpoints HTTP.

import { Router } from 'express';
import { relatoriosController } from './relatorios.controller';
import { relatoriosValidator } from './relatorios.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Papel } from '../../generated/prisma/enums';

const relatoriosRoutes = Router();

const somenteGestao = roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]);

// GET /relatorios/funcionario/:id?dataInicio=...&dataFim=...
relatoriosRoutes.get(
  '/funcionario/:id',
  authMiddleware,
  somenteGestao,
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionario
);

// GET /relatorios/funcionario/:id/pdf?dataInicio=...&dataFim=...
relatoriosRoutes.get(
  '/funcionario/:id/pdf',
  authMiddleware,
  somenteGestao,
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionarioPdf
);

// GET /relatorios/funcionario/:id/excel?dataInicio=...&dataFim=...
relatoriosRoutes.get(
  '/funcionario/:id/excel',
  authMiddleware,
  somenteGestao,
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionarioExcel
);

export { relatoriosRoutes };