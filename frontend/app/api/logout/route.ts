import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Apaga o cookie definindo o tempo de vida para 0
    cookieStore.set({
      name: 'ponto_certo_token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({ message: 'Logout realizado com sucesso!' });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao realizar logout' }, { status: 500 });
  }
}