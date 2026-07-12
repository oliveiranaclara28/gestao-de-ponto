// Routes: define os endpoints HTTP.

import { Router } from "express";
import { relatoriosController } from "./relatorios.controller";
import { relatoriosValidator } from "./relatorios.validator";

const relatoriosRoutes = Router();

// GET /relatorios/funcionario/:id?dataInicio=...&dataFim=...
relatoriosRoutes.get(
  "/funcionario/:id",
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionario,
);

// GET /relatorios/funcionario/:id/pdf?dataInicio=...&dataFim=...
relatoriosRoutes.get(
  "/funcionario/:id/pdf",
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionarioPdf,
);

// GET /relatorios/funcionario/:id/excel?dataInicio=...&dataFim=...
relatoriosRoutes.get(
  "/funcionario/:id/excel",
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionarioExcel,
);

export { relatoriosRoutes };