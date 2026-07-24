// Routes: define os endpoints HTTP.

import { Router } from 'express';
import { relatoriosController } from './relatorios.controller';
import { relatoriosValidator } from './relatorios.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Papel } from '../../generated/prisma/enums';

const relatoriosRoutes = Router();

const somenteGestao = roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]);

/**
 * @swagger
 * tags:
 *   name: Relatorios
 *   description: Relatórios de faltas, atrasos e banco de horas por funcionário
 */

/**
 * @swagger
 * /relatorios/funcionario/{id}:
 *   get:
 *     summary: Gera o relatório de um funcionário em formato JSON
 *     description: >
 *       Inclui faltas, atrasos e banco de horas no período. Estrutura exata
 *       de resposta não documentada em detalhe -- consulte relatorios.service.ts.
 *     tags: [Relatorios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dataInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Relatório gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: ID inválido, ou dataInicio/dataFim ausentes ou inválidas
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR, RH ou GESTOR)
 *       404:
 *         description: Funcionário não encontrado
 */
relatoriosRoutes.get(
  '/funcionario/:id',
  authMiddleware,
  somenteGestao,
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionario
);

/**
 * @swagger
 * /relatorios/funcionario/{id}/pdf:
 *   get:
 *     summary: Gera o relatório de um funcionário em PDF
 *     tags: [Relatorios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dataInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Arquivo PDF do relatório
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: ID inválido, ou dataInicio/dataFim ausentes ou inválidas
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR, RH ou GESTOR)
 *       404:
 *         description: Funcionário não encontrado
 */
relatoriosRoutes.get(
  '/funcionario/:id/pdf',
  authMiddleware,
  somenteGestao,
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionarioPdf
);

/**
 * @swagger
 * /relatorios/funcionario/{id}/excel:
 *   get:
 *     summary: Gera o relatório de um funcionário em Excel
 *     tags: [Relatorios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dataInicio
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: dataFim
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Arquivo Excel do relatório
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: ID inválido, ou dataInicio/dataFim ausentes ou inválidas
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR, RH ou GESTOR)
 *       404:
 *         description: Funcionário não encontrado
 */
relatoriosRoutes.get(
  '/funcionario/:id/excel',
  authMiddleware,
  somenteGestao,
  relatoriosValidator.validarIdParam,
  relatoriosValidator.validarPeriodo,
  relatoriosController.gerarRelatorioFuncionarioExcel
);

export { relatoriosRoutes };