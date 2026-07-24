import request from 'supertest';
import { app } from '../../app';

const CARLOS_ID = '5ab1c384-4cfe-43f1-9f49-1bb8ade14627';
const GESTOR_ID = '5af9c081-80d9-4eba-b964-ddaa8eb23908';

async function logar(email: string, senha: string) {
  const resposta = await request(app).post('/auth/login').send({ email, senha });
  return resposta.body.token as string;
}

describe('GET /pontos/:id -- regra de acesso', () => {
  it('deve permitir que o Carlos veja os próprios pontos', async () => {
    const token = await logar('carlos.historico@pontocerto.com', 'teste123');

    const resposta = await request(app)
      .get(`/pontos/${CARLOS_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(200);
  });

  it('não deve permitir que o Carlos veja pontos de outro funcionário', async () => {
    const token = await logar('carlos.historico@pontocerto.com', 'teste123');

    const resposta = await request(app)
      .get(`/pontos/${GESTOR_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(403);
  });

  it('deve permitir que o Admin veja pontos de qualquer funcionário', async () => {
    const token = await logar('admin@pontocerto.com', 'admin123');

    const resposta = await request(app)
      .get(`/pontos/${CARLOS_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(resposta.status).toBe(200);
  });
});