import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const routes = Router();

routes.post('/auth/login', authController.login);

export { routes };