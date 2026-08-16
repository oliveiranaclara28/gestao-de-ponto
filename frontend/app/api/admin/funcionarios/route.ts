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

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/funcionarios`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao buscar funcionários';
    const status = error.response?.status || 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('ponto_certo_token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/funcionarios`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao cadastrar funcionário';
    const status = error.response?.status || 500;
    return NextResponse.json({ message: errorMessage }, { status });
  }
}