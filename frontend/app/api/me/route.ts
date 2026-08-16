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

    // Faz a chamada para o backend do seu sócio buscar o perfil do usuário logado
    // (Se a rota do seu sócio for diferente, ex: /auth/me ou /user, basta ajustar aqui)
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao buscar dados do usuário';
    const status = error.response?.status || 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}