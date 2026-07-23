import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Imprime todos os cookies no terminal do VS Code para depuração
    console.log('COOKIES DISPONÍVEIS NA SESSÃO:', cookieStore.getAll());

    // Tenta pegar o token por diferentes nomes comuns
    const token = 
      cookieStore.get('ponto_certo_token')?.value || 
      cookieStore.get('token')?.value || 
      cookieStore.get('access_token')?.value ||
      cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Token não encontrado nos cookies.' }, { status: 401 });
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/ponto`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Erro GET /api/ponto:', error.response?.data || error.message);
    const errorMessage = error.response?.data?.message || 'Erro ao buscar histórico de ponto';
    const status = error.response?.status || 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // Tenta pegar o token por diferentes nomes comuns
    const token = 
      cookieStore.get('ponto_certo_token')?.value || 
      cookieStore.get('token')?.value || 
      cookieStore.get('access_token')?.value ||
      cookieStore.get('auth_token')?.value;

    if (!token) {
      console.log('Tentativa de POST /api/ponto sem token válido nos cookies.');
      return NextResponse.json({ message: 'Sessão expirada ou usuário não autenticado.' }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/ponto`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error('ERRO DETALHADO DO BACKEND AO SALVAR PONTO:', error.response?.data || error.message);
    
    const errorMessage = error.response?.data?.message || error.message || 'Erro ao registrar ponto';
    const status = error.response?.status || 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}