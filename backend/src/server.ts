import express from 'express';
import cors from 'cors';
// Importamos o que você tem certeza que existe nos arquivos
import { funcionarioRouter } from './routes/funcionario.routes'; 
import { pontoRouter } from './routes/ponto.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Usamos as rotas diretamente
app.use(funcionarioRouter);
app.use(pontoRouter);

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
});