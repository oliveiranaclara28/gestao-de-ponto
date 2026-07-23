import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('ponto_certo_token')?.value;
  const currentPath = request.nextUrl.pathname;

  // 1. Rotas públicas (como login) passam direto
  if (currentPath.startsWith('/login') || currentPath.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Se a rota for protegida e o usuário não tiver o token, redireciona para o login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Exemplo de Guard por Papel (Role Guard) para rotas administrativas
  if (currentPath.startsWith('/admin')) {
    // Se o seu backend salvar o papel (role) em outro cookie ou se você decodificar o JWT, 
    // pode fazer a validação aqui. Exemplo simulado:
    const userRole = request.cookies.get('ponto_certo_role')?.value;
    
    // Se houver restrição rígida de papel, descomente a linha abaixo:
    // if (userRole !== 'ADMINISTRADOR') { return NextResponse.redirect(new URL('/dashboard', request.url)); }
  }

  return NextResponse.next();
}

// Configura em quais caminhos o middleware deve ser executado
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}