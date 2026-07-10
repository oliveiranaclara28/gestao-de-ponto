import { Router } from 'express';
import { funcionarioController } from '../controllers/funcionario.controller';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { Papel } from '@prisma/client';

const routes = Router();

routes.post('/auth/login', authController.login);

routes.post(
  '/funcionarios', 
  authMiddleware, 
  roleMiddleware([Papel.ADMINISTRADOR, Papel.RH]), 
  funcionarioController.criar
);

export { routes };