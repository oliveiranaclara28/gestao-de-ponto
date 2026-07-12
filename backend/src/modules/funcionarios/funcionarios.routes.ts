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

// POST /funcionarios -- criar (Admin, RH)
funcionariosRoutes.post(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarCriar,
  funcionariosController.criar
);

// GET /funcionarios -- listar todos (Admin, RH, Gestor)
funcionariosRoutes.get(
  '/',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosController.listar
);

// GET /funcionarios/:id -- buscar um (Admin, RH, Gestor)
funcionariosRoutes.get(
  '/:id',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosValidator.validarIdParam,
  funcionariosController.buscarPorId
);

// GET /funcionarios/:id/historico (Admin, RH, Gestor)
funcionariosRoutes.get(
  '/:id/historico',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosValidator.validarIdParam,
  funcionariosController.listarHistorico
);

// PUT /funcionarios/:id -- atualizar (Admin, RH)
funcionariosRoutes.put(
  '/:id',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarIdParam,
  funcionariosValidator.validarAtualizar,
  funcionariosController.atualizar
);

// DELETE /funcionarios/:id -- inativar (Admin, RH)
funcionariosRoutes.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarIdParam,
  funcionariosController.inativar
);

// POST /funcionarios/:id/fotos -- upload de foto (Admin, RH)
funcionariosRoutes.post(
  '/:id/fotos',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosValidator.validarIdParam,
  uploadFoto.single('foto'),
  funcionariosController.uploadFoto
);

// GET /funcionarios/:id/fotos -- listar fotos (Admin, RH, Gestor)
funcionariosRoutes.get(
  '/:id/fotos',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH, Papel.GESTOR]),
  funcionariosValidator.validarIdParam,
  funcionariosController.listarFotos
);

// DELETE /funcionarios/fotos/:fotoId -- remover foto (Admin, RH)
funcionariosRoutes.delete(
  '/fotos/:fotoId',
  authMiddleware,
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]),
  funcionariosController.removerFoto
);

export { funcionariosRoutes };