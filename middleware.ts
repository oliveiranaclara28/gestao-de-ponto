import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('ponto_certo_token');
  const url = request.nextUrl.clone();

  // Verifica se a rota acessada pertence ao painel administrativo
  if (url.pathname.startsWith('/admin')) {
    if (!tokenCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Converte a chave secreta do .env para o formato aceito pela lib jose
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
      
      // Valida a assinatura do token e extrai o payload
      const { payload } = await jwtVerify(tokenCookie.value, secret);

      // Valida se o usuário possui permissão de administrador 
      // (ajuste 'papel' ou 'role' conforme o nome da propriedade gerada no seu token pelo backend)
      const userRole = payload.papel || payload.role;

      if (userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Se o token estiver expirado ou inválido, redireciona para o login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configuração opcional para definir quais rotas o middleware deve interceptar
export const config = {
  matcher: ['/admin/:path*'],
};