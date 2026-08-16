import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('-> Tentando fazer login para:', body.email);
    console.log('-> URL do backend:', `${process.env.NEXT_PUBLIC_API_URL}/login`);

    // Faz a requisição para o backend
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, body);
    console.log('-> Resposta bruta do backend de login:', response.data);

    // Tenta capturar o token independentemente de qual nome o backend use
    const token = 
      response.data.token || 
      response.data.access_token || 
      response.data.accessToken || 
      response.data.jwt;

    if (!token) {
      console.error('-> ERRO: O backend respondeu, mas não retornou nenhuma chave de token válida!');
      return NextResponse.json({ message: 'Token não encontrado na resposta do servidor.' }, { status: 500 });
    }

    // Grava o cookie com o token
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'ponto_certo_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    console.log('-> Sucesso! Cookie ponto_certo_token gravado com sucesso.');
    return NextResponse.json({ success: true, user: response.data.user || response.data.usuario });
  } catch (error: any) {
    console.error('-> ERRO NA ROTA DE LOGIN DO NEXT.JS:', error.response?.data || error.message);
    const message = error.response?.data?.message || error.message || 'Credenciais inválidas';
    const status = error.response?.status || 401;
    return NextResponse.json({ message }, { status });
  }
}