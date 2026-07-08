import { Router } from 'express';
import { funcionarioController } from '../controllers/funcionario.controller';

const funcionarioRouter = Router();

// Cadastrar
funcionarioRouter.post('/', funcionarioController.criar);

// Listar todos
funcionarioRouter.get('/', funcionarioController.listar);

// NOVA ROTA - Atualizar: PUT http://localhost:3333/funcionarios/id_do_funcionario
funcionarioRouter.put('/:id', funcionarioController.atualizar);

// NOVA ROTA - Remover: DELETE http://localhost:3333/funcionarios/id_do_funcionario
funcionarioRouter.delete('/:id', funcionarioController.deletar);

export { funcionarioRouter };