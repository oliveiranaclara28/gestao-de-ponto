import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      email,
      senha,
    });

    const { token } = response.data;

    const cookieStore = await cookies();
    cookieStore.set({
      name: 'ponto_certo_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 horas de duração
    });

    return NextResponse.json({ message: 'Login realizado com sucesso!' });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao realizar login';
    return NextResponse.json({ message: errorMessage }, { status: 401 });
  }
}