import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ponto_certo_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    // Faz a chamada para a rota de admin do backend do seu sócio
    // (Se a rota exata no backend for diferente, ex: /admin/registros, basta ajustar aqui)
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/pontos`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao buscar registros administrativos';
    const status = error.response?.status || 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}