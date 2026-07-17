// Routes: define os endpoints HTTP e a ordem do pipeline Auth -> Validator -> Controller.

import { Router } from 'express';
import { pontosController } from './pontos.controller';
import { pontosValidator } from './pontos.validator';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { proprioOuPapel, soParaSiNoBody } from '../../middlewares/ownership.middleware';
import { Papel } from '../../generated/prisma/enums';

const pontosRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Pontos
 *   description: Registro e consulta de marcações de ponto
 */

/**
 * @swagger
 * /pontos:
 *   post:
 *     summary: Registra uma marcação de ponto (o próprio funcionário, para si mesmo)
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrarPontoInput'
 *     responses:
 *       201:
 *         description: Ponto registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ponto'
 *       400:
 *         description: Dados inválidos, ou tentativa de registrar ponto para outro funcionarioId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 */
pontosRoutes.post(
  '/',
  authMiddleware,
  soParaSiNoBody('funcionarioId'),
  pontosValidator.validarRegistrar,
  pontosController.registrar
);

/**
 * @swagger
 * /pontos:
 *   get:
 *     summary: Lista o histórico de pontos de todos os funcionários
 *     tags: [Pontos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pontos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ponto'
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR, RH ou GESTOR)
 */
pontosRoutes.get(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosController.listarTodos
);

/**
 * @swagger
 * /pontos/{id}/horas:
 *   get:
 *     summary: Calcula as horas trabalhadas de um funcionário
 *     description: '{id} aqui é o ID do funcionário, não do ponto.'
 *     tags: [Pontos]
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
 *         description: Horas calculadas
 *       400:
 *         description: ID inválido na URL
 *       403:
 *         description: Só o próprio funcionário ou ADMINISTRADOR/RH/GESTOR podem consultar
 */
pontosRoutes.get(
  '/:id/horas',
  authMiddleware,
  proprioOuPapel([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosValidator.validarIdParam,
  pontosController.calcularHoras
);

/**
 * @swagger
 * /pontos/{id}:
 *   get:
 *     summary: Lista o histórico de pontos de um funcionário
 *     description: '{id} aqui é o ID do funcionário, não do ponto.'
 *     tags: [Pontos]
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
 *         description: Lista de pontos do funcionário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ponto'
 *       400:
 *         description: ID inválido na URL
 *       403:
 *         description: Só o próprio funcionário ou ADMINISTRADOR/RH/GESTOR podem consultar
 */
pontosRoutes.get(
  '/:id',
  authMiddleware,
  proprioOuPapel([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosValidator.validarIdParam,
  pontosController.buscarPorFuncionario
);

/**
 * @swagger
 * /pontos/{id}/banco-de-horas:
 *   get:
 *     summary: Calcula o banco de horas de um funcionário em um período
 *     description: '{id} aqui é o ID do funcionário, não do ponto.'
 *     tags: [Pontos]
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
 *         description: Banco de horas calculado para o período
 *       400:
 *         description: ID inválido, ou dataInicio/dataFim ausentes ou inválidas
 *       403:
 *         description: Só o próprio funcionário ou ADMINISTRADOR/RH/GESTOR podem consultar
 */
pontosRoutes.get(
  '/:id/banco-de-horas',
  authMiddleware,
  proprioOuPapel([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  pontosValidator.validarIdParam,
  pontosValidator.validarPeriodo,
  pontosController.calcularBancoDeHoras
);

export { pontosRoutes };