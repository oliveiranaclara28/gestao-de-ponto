import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    const funcionario = await prisma.funcionario.findUnique({
      where: { email },
    });

    // 🔍 DIAGNÓSTICO NO TERMINAL
    console.log("--- TENTATIVA DE LOGIN ---");
    console.log("E-mail buscado:", email);
    console.log("Funcionário encontrado?", funcionario ? "Sim" : "Não");
    console.log("Senha no Banco (senhaHash):", JSON.stringify(funcionario?.senhaHash));
    console.log("Senha Digitada:", JSON.stringify(senha));

    // Comparação direta para testar o conteúdo salvo no Supabase
    if (!funcionario || funcionario.senhaHash !== senha) {
      console.log("Resultado: Senha incorreta");
      return NextResponse.json(
        { message: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    console.log("Resultado: Login aprovado com sucesso!");

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'ponto_certo_token',
      value: `user_${funcionario.id}`,
      httpOnly: true,
      path: '/',
    });

    return NextResponse.json({
      message: 'Login realizado com sucesso!',
      user: { id: funcionario.id, email: funcionario.email },
    });
  } catch (error) {
    console.error('Erro detalhado no banco:', error);
    return NextResponse.json(
      { message: 'Erro interno no servidor ao conectar no banco.' },
      { status: 500 }
    );
  }
}