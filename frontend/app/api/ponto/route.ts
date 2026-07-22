import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ponto_certo_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Sessão expirada ou usuário não autenticado.' }, { status: 401 });
    }

    // Faz a chamada para o backend do seu sócio enviando o token JWT no cabeçalho
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/ponto`,
      {}, // Se o backend precisar de algum dado no corpo (payload), colocamos aqui
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({ 
      message: 'Ponto registrado com sucesso!', 
      data: response.data 
    });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao registrar o ponto no servidor';
    const status = error.response?.status || 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}