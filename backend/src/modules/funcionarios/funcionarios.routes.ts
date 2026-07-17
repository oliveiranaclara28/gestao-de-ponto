// Routes: define os endpoints HTTP e a ordem do pipeline
// Auth -> Role -> Validator -> Controller para cada um.

import { Router } from 'express';
import { funcionariosController } from './funcionarios.controller';
import { funcionariosValidator } from './funcionarios.validator';
import { uploadFoto } from '../../shared/middlewares/upload.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Papel } from '../../generated/prisma/enums';

const funcionariosRoutes = Router();

/**
 * @swagger
 * tags:
 *   name: Funcionarios
 *   description: Cadastro, consulta e gestão de funcionários
 */

/**
 * @swagger
 * /funcionarios:
 *   post:
 *     summary: Cria um novo funcionário
 *     tags: [Funcionarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarFuncionarioInput'
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR ou RH)
 */
funcionariosRoutes.post(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarCriar,
  funcionariosController.criar
);

/**
 * @swagger
 * /funcionarios:
 *   get:
 *     summary: Lista todos os funcionários
 *     tags: [Funcionarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Funcionario'
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR, RH ou GESTOR)
 */
funcionariosRoutes.get(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosController.listar
);

/**
 * @swagger
 * /funcionarios/{id}:
 *   get:
 *     summary: Busca um funcionário pelo ID
 *     tags: [Funcionarios]
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
 *         description: Funcionário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       400:
 *         description: ID inválido na URL
 *       404:
 *         description: Funcionário não encontrado
 */
funcionariosRoutes.get(
  '/:id',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosValidator.validarIdParam,
  funcionariosController.buscarPorId
);

/**
 * @swagger
 * /funcionarios/{id}/historico:
 *   get:
 *     summary: Lista o histórico de cargo/estabelecimento de um funcionário
 *     tags: [Funcionarios]
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
 *         description: Histórico de cargo/estabelecimento (ordem cronológica)
 *       400:
 *         description: ID inválido na URL
 *       404:
 *         description: Funcionário não encontrado
 */
funcionariosRoutes.get(
  '/:id/historico',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosValidator.validarIdParam,
  funcionariosController.listarHistorico
);

/**
 * @swagger
 * /funcionarios/{id}:
 *   put:
 *     summary: Atualiza um funcionário (parcial -- envie só os campos a alterar)
 *     tags: [Funcionarios]
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
 *             $ref: '#/components/schemas/AtualizarFuncionarioInput'
 *     responses:
 *       200:
 *         description: Funcionário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Funcionario'
 *       400:
 *         description: Dados ou ID inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErroValidacao'
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR ou RH)
 *       404:
 *         description: Funcionário não encontrado
 */
funcionariosRoutes.put(
  '/:id',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarIdParam,
  funcionariosValidator.validarAtualizar,
  funcionariosController.atualizar
);

/**
 * @swagger
 * /funcionarios/{id}:
 *   delete:
 *     summary: Inativa um funcionário (soft delete -- não remove o registro)
 *     tags: [Funcionarios]
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
 *         description: Funcionário inativado
 *       400:
 *         description: ID inválido na URL
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR ou RH)
 *       404:
 *         description: Funcionário não encontrado
 */
funcionariosRoutes.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarIdParam,
  funcionariosController.inativar
);

/**
 * @swagger
 * /funcionarios/{id}/fotos:
 *   post:
 *     summary: Envia uma foto de referência facial para o funcionário (máximo 3)
 *     tags: [Funcionarios]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Foto enviada com sucesso
 *       400:
 *         description: ID inválido, arquivo ausente ou limite de 3 fotos excedido
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR ou RH)
 *       404:
 *         description: Funcionário não encontrado
 */
funcionariosRoutes.post(
  '/:id/fotos',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarIdParam,
  uploadFoto.single('foto'),
  funcionariosController.uploadFoto
);

/**
 * @swagger
 * /funcionarios/{id}/fotos:
 *   get:
 *     summary: Lista as fotos de referência facial de um funcionário
 *     tags: [Funcionarios]
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
 *         description: Lista de fotos
 *       400:
 *         description: ID inválido na URL
 *       404:
 *         description: Funcionário não encontrado
 */
funcionariosRoutes.get(
  '/:id/fotos',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosValidator.validarIdParam,
  funcionariosController.listarFotos
);

/**
 * @swagger
 * /funcionarios/fotos/{fotoId}:
 *   delete:
 *     summary: Remove uma foto de referência facial
 *     tags: [Funcionarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fotoId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Foto removida
 *       403:
 *         description: Papel do usuário não tem permissão (requer ADMINISTRADOR ou RH)
 *       404:
 *         description: Foto não encontrada
 */
funcionariosRoutes.delete(
  '/fotos/:fotoId',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosController.removerFoto
);

export { funcionariosRoutes };