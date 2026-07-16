import pinoHttp from 'pino-http';
import { logger } from './config/logger';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { routes } from './routes';
import { funcionariosRoutes } from './modules/funcionarios/funcionarios.routes';
import { pontosRoutes } from './modules/pontos/pontos.routes';
import { aprovacoesRoutes } from './modules/aprovacoes/aprovacoes.routes';
import { dashboardRoutes } from './modules/dashboard/dashboard.routes';
import { relatoriosRoutes } from './modules/relatorios/relatorios.routes';
import { errorHandler } from './middlewares/errorHandler.middleware';

// Monta a aplicação Express, mas NÃO sobe servidor nenhum aqui --
// isso permite testar as rotas (via Supertest) sem precisar de uma
// porta de rede real, e mantém server.ts responsável só por "ligar".
const app = express();

app.use(cors());
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use(routes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/funcionarios', funcionariosRoutes);
app.use('/pontos', pontosRoutes);
app.use('/aprovacoes', aprovacoesRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/relatorios', relatoriosRoutes);

// Precisa ser o ÚLTIMO app.use, antes de exportar.
app.use(errorHandler);

export { app };