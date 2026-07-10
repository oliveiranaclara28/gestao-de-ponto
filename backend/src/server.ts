import express from 'express';
import { routes } from './routes'; 

const app = express();

app.use(express.json()); // ISSO PRECISA ESTAR AQUI ANTES DAS ROTAS
app.use(routes);

app.listen(3333, () => {
  console.log('🚀 Servidor rodando na porta 3333');
});