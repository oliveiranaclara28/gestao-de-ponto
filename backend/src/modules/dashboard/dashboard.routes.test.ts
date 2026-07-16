import request from 'supertest';
import { app } from '../../app';

// Aqui NÃO fazemos mock do banco -- este é um teste de integração,
// testando a rota de ponta a ponta, incluindo os middlewares de
// autenticação/autorização. Por isso ele precisa de um token válido
// de verdade, gerado contra o banco real de desenvolvimento.

describe('GET /dashboard', () => {
  it('deve retornar 401 quando nenhum token é enviado', async () => {
    const resposta = await request(app).get('/dashboard');

    expect(resposta.status).toBe(401);
  });

  it('deve retornar 200 e os indicadores quando autenticado como admin', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'admin@pontocerto.com', senha: 'admin123' });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();

    const resposta = await request(app)
      .get('/dashboard')
      .set('Authorization', `Bearer ${login.body.token}`);

    expect(resposta.status).toBe(200);
    expect(resposta.body.funcionariosAtivos).toBeDefined();
  });
});