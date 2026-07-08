import express from 'express';
import cors from 'cors';
import { funcionarioRouter } from './routes/funcionario.routes'; 
import { pontoRouter } from './routes/ponto.routes';
import { authRouter } from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Agora cada grupo de rotas tem seu próprio "endereço base"
app.use('/auth', authRouter);
app.use('/funcionarios', funcionarioRouter);
app.use('/pontos', pontoRouter);

app.listen(3333, () => {
  console.log('Servidor rodando na porta 3333');
  console.log('Rotas prontas: /auth, /funcionarios, /pontos');
});