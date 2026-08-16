import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ponto_certo_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const userId = token.replace('user_', '');

    const funcionario = await prisma.funcionario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nome: true,
        email: true,
        cargo: true,
        papel: true,
      },
    });

    if (!funcionario) {
      return NextResponse.json({ message: 'Funcionário não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user: funcionario });
  } catch (error) {
    console.error('Erro na rota /api/me:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}