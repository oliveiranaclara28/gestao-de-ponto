import { Router } from 'express';
import { funcionarioController } from '../controllers/funcionario.controller';

const funcionarioRouter = Router();

funcionarioRouter.post('/', funcionarioController.criar);
funcionarioRouter.get('/', funcionarioController.listarTodos); // A linha 10 deve estar aqui

export { funcionarioRouter };