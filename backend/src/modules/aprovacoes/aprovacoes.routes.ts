// Routes: define os endpoints HTTP e a ordem do pipeline Auth -> Validator -> Controller.

import { Router } from 'express';
import { aprovacoesController } from './aprovacoes.controller';
import { aprovacoesValidator } from './aprovacoes.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Papel } from '../../generated/prisma/enums';

const aprovacoesRoutes = Router();

const somenteGestaoDeAprovacao = roleMiddleware([Papel.ADMINISTRADOR, Papel.GESTOR]);

/**
 * @swagger
 * tags:
 *   name: Aprovacoes
 *   description: Aprovação ou rejeição de pontos pendentes por um gestor
 */

/**
 * @swagger
 * /aprovacoes/pendentes:
 *   get:
 *     summary: Lista os pontos aguardando decisão
 *     tags: [Aprovacoes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pontos pendentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ponto'
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR ou GESTOR)
 */
aprovacoesRoutes.get(
  '/pendentes',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesController.listarPendentes
);

/**
 * @swagger
 * /aprovacoes/{id}/aprovar:
 *   put:
 *     summary: Aprova um ponto pendente
 *     description: '{id} aqui é o ID do Ponto. Só o gestor do funcionário dono do ponto pode decidir.'
 *     tags: [Aprovacoes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DecidirPontoInput'
 *     responses:
 *       200:
 *         description: Ponto aprovado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aprovacao'
 *       400:
 *         description: Dados ou ID inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       403:
 *         description: Papel do usuário não tem permissão, ou não é o gestor deste funcionário
 *       404:
 *         description: Ponto não encontrado
 */
aprovacoesRoutes.put(
  '/:id/aprovar',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesValidator.validarIdParam,
  aprovacoesValidator.validarDecisao,
  aprovacoesController.aprovar
);

/**
 * @swagger
 * /aprovacoes/{id}/rejeitar:
 *   put:
 *     summary: Rejeita um ponto pendente
 *     description: '{id} aqui é o ID do Ponto. Só o gestor do funcionário dono do ponto pode decidir.'
 *     tags: [Aprovacoes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DecidirPontoInput'
 *     responses:
 *       200:
 *         description: Ponto rejeitado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aprovacao'
 *       400:
 *         description: Dados ou ID inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       403:
 *         description: Papel do usuário não tem permissão, ou não é o gestor deste funcionário
 *       404:
 *         description: Ponto não encontrado
 */
aprovacoesRoutes.put(
  '/:id/rejeitar',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesValidator.validarIdParam,
  aprovacoesValidator.validarDecisao,
  aprovacoesController.rejeitar
);

/**
 * @swagger
 * /aprovacoes/{id}/historico:
 *   get:
 *     summary: Lista o histórico de decisões sobre um ponto específico
 *     description: '{id} aqui é o ID do Ponto.'
 *     tags: [Aprovacoes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Histórico de aprovações/rejeições do ponto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aprovacao'
 *       400:
 *         description: ID inválido na URL
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR ou GESTOR)
 *       404:
 *         description: Ponto não encontrado
 */
aprovacoesRoutes.get(
  '/:id/historico',
  authMiddleware,
  somenteGestaoDeAprovacao,
  aprovacoesValidator.validarIdParam,
  aprovacoesController.listarHistoricoPorPonto
);

export { aprovacoesRoutes };