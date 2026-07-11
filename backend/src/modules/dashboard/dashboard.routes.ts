// Routes: define os endpoints HTTP.

import { Router } from 'express';
import { dashboardController } from './dashboard.controller';

const dashboardRoutes = Router();

// GET /dashboard -- resumo com todos os indicadores
dashboardRoutes.get('/', dashboardController.obterResumo);

export { dashboardRoutes };