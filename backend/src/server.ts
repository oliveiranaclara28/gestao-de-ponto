import { env } from './config/env';
import express from 'express';
import cors from 'cors'; // Mantenha do Incoming
import path from 'path'; // Mantenha do Incoming
import { routes } from './routes'; // Mantenha do seu

// Importações dos novos módulos que vieram do servidor
import { funcionariosRoutes } from './modules/funcionarios/funcionarios.routes';
import { pontosRoutes } from './modules/pontos/pontos.routes';
import { aprovacoesRoutes } from './modules/aprovacoes/aprovacoes.routes';

const app = express();

app.use(cors()); // Mantenha do Incoming
app.use(express.json()); // ESSENCIAL: Mantenha o seu
app.use(routes); // Mantenha o seu

// Se houver outras rotas aqui, mantenha-as também
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.listen(3333, () => {
  console.log('🚀 Servidor rodando na porta 3333');
});