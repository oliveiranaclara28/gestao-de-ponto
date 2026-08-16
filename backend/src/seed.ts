// Script de seed: popula o banco com dados iniciais necessários
// para o sistema funcionar pela primeira vez. Roda uma única vez
// (ou sempre que quiser resetar os dados de teste).

import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // bcrypt.hashSync faz o "salt + hash" da senha em um passo só.
  // O número 10 é o "custo" do hash (quantas rodadas de processamento) --
  // 10 é o padrão recomendado: seguro o suficiente, sem deixar o login lento.
  const senhaHash = bcrypt.hashSync('admin123', 10);

  // upsert = "update ou insert". Usamos isso em vez de create() puro
  // porque, se você rodar o seed de novo por engano, ele NÃO vai
  // tentar criar um segundo administrador com o mesmo e-mail (o que
  // quebraria por causa do @unique) -- ele só atualiza o que já existe.
  const admin = await prisma.funcionario.upsert({
    where: { email: 'admin@pontocerto.com' },
    update: {},
    create: {
      nome: 'Administrador do Sistema',
      cpf: '00000000000',
      email: 'admin@pontocerto.com',
      senhaHash,
      matricula: 'ADM001',
      cargo: 'Administrador',
      estabelecimento: 'Matriz',
      dataAdmissao: new Date(),
      salario: 0,
      papel: 'ADMINISTRADOR',
      status: 'ATIVO',
    },
  });

  console.log('Seed concluído. Administrador criado/atualizado:', admin.email);
}

main()
  .catch((erro) => {
    console.error('Erro ao rodar o seed:', erro);
    process.exit(1);
  })
  .finally(async () => {
    // Sempre desconectar do banco no final, senão o script
    // fica "pendurado" (o processo Node não encerra sozinho).
    await prisma.$disconnect();
  });