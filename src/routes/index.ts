import { Router } from 'express'; // 1. Importação necessária
import { funcionarioRouter } from './funcionario.routes';
import { pontoRouter } from './ponto.routes';

export const routes = Router(); // 2. Agora o Router é reconhecido

// 3. Use os nomes exatos que você exportou nos outros arquivos
routes.use(funcionarioRouter);
routes.use(pontoRouter);