// Routes: define os endpoints HTTP e a ordem do pipeline
// Validator -> Controller para cada um.

import { Router } from 'express';
import { funcionariosController } from './funcionarios.controller';
import { funcionariosValidator } from './funcionarios.validator';
import { uploadFoto } from '../../shared/middlewares/upload.middleware';

const funcionariosRoutes = Router();

// POST /funcionarios -- criar
funcionariosRoutes.post(
  '/',
  funcionariosValidator.validarCriar,
  funcionariosController.criar
);

// GET /funcionarios -- listar todos
funcionariosRoutes.get('/', funcionariosController.listar);

// GET /funcionarios/:id -- buscar um
funcionariosRoutes.get(
  '/:id',
  funcionariosValidator.validarIdParam,
  funcionariosController.buscarPorId
);

// PUT /funcionarios/:id -- atualizar
funcionariosRoutes.put(
  '/:id',
  funcionariosValidator.validarIdParam,
  funcionariosValidator.validarAtualizar,
  funcionariosController.atualizar
);

// DELETE /funcionarios/:id -- na prática, inativa (soft delete)
funcionariosRoutes.delete(
  '/:id',
  funcionariosValidator.validarIdParam,
  funcionariosController.inativar
);

// POST /funcionarios/:id/fotos -- upload de uma foto de referência
funcionariosRoutes.post(
  '/:id/fotos',
  funcionariosValidator.validarIdParam,
  uploadFoto.single('foto'),
  funcionariosController.uploadFoto
);

// GET /funcionarios/:id/fotos -- listar fotos de um funcionário
funcionariosRoutes.get(
  '/:id/fotos',
  funcionariosValidator.validarIdParam,
  funcionariosController.listarFotos
);

// DELETE /funcionarios/fotos/:fotoId -- remover uma foto específica
funcionariosRoutes.delete('/fotos/:fotoId', funcionariosController.removerFoto);

export { funcionariosRoutes };