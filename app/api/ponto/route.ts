import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient, TipoPonto } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ponto_certo_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = token.replace('user_', '');

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: userId },
    });

    if (!funcionario) {
      return NextResponse.json({ message: 'Funcionário não encontrado' }, { status: 404 });
    }

    // Cria o ponto incluindo todos os campos obrigatórios exigidos pelo Prisma
    const novoPonto = await prisma.ponto.create({
      data: {
        dataHora: new Date(),
        tipo: TipoPonto.ENTRADA,
        fotoUrl: 'sem-foto', // Satisfeita a exigência do schema do banco
        funcionario: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json({
      message: 'Ponto registrado com sucesso!',
      ponto: novoPonto,
    });
  } catch (error) {
    console.error('Erro ao registrar ponto:', error);
    return NextResponse.json(
      { message: 'Erro interno no servidor ao registrar ponto.' },
      { status: 500 }
    );
  }
}