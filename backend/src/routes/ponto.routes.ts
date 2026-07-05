import { Router } from 'express';
import { pontoController } from '../controllers/ponto.controller';

const pontoRouter = Router();

// 1. Registrar ponto
pontoRouter.post('/', pontoController.registrar);

// 2. Histórico geral
pontoRouter.get('/', pontoController.listarTodos);

// 3. CALCULAR HORAS (Precisa vir ANTES da rota de ID genérico)
pontoRouter.get('/:id/horas', pontoController.calcularHoras);

// 4. Histórico por funcionário (ID genérico fica por último)
pontoRouter.get('/:id', pontoController.buscarPorFuncionario);

export { pontoRouter };