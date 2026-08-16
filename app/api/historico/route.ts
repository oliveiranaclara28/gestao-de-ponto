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

    // Busca os pontos do funcionário ordenados do mais recente para o mais antigo
    const registrosPonto = await prisma.ponto.findMany({
      where: { funcionarioId: userId },
      orderBy: { dataHora: 'desc' },
    });

    // Formata os dados para o front-end exibir a data/hora legível
    const registrosFormatados = registrosPonto.map((ponto, index) => {
      const dataObj = new Date(ponto.dataHora);
      return {
        id: ponto.id,
        data: dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR'),
      };
    });

    return NextResponse.json({
      registros: registrosFormatados,
      message: 'Histórico carregado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return NextResponse.json(
      { message: 'Erro interno ao buscar histórico' },
      { status: 500 }
    );
  }
}