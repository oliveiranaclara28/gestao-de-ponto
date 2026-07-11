import { Router } from 'express';
import { pontoController } from '../controllers/ponto.controller';

const pontoRouter = Router();

pontoRouter.post('/', pontoController.registrar);
pontoRouter.get('/', pontoController.listarTodos);
pontoRouter.get('/:id/horas', pontoController.calcularHoras);
pontoRouter.get('/:id', pontoController.buscarPorFuncionario);

export { pontoRouter };