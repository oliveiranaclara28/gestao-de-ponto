'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LayoutResponsivoProps {
  children: React.ReactNode;
  titulo: string;
  tipoPainel?: 'admin' | 'colaborador';
}

export default function LayoutResponsivo({ children, titulo, tipoPainel = 'admin' }: LayoutResponsivoProps) {
  const router = useRouter();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const linksAdmin = [
    { href: '/admin/dashboard', label: '📊 Visão Geral' },
    { href: '/admin/funcionarios', label: '👥 Funcionários' },
    { href: '/admin/aprovacoes', label: '📝 Aprovações' },
    { href: '/admin/relatorios', label: '📈 Relatórios' },
  ];

  const linksColaborador = [
    { href: '/dashboard', label: '🕒 Meu Ponto & Horas' },
  ];

  const linksNavegacao = tipoPainel === 'admin' ? linksAdmin : linksColaborador;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Barra Superior Mobile */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h2 className="text-lg font-bold text-indigo-400">Ponto Certo</h2>
          <p className="text-xs text-slate-400">{titulo}</p>
        </div>
        <button 
          onClick={() => setSidebarAberta(!sidebarAberta)}
          className="p-2 text-slate-300 hover:text-white focus:outline-none text-xl"
          aria-label="Abrir Menu"
        >
          {sidebarAberta ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar (Responsiva) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:flex md:flex-col md:justify-between
        ${sidebarAberta ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-indigo-400">Ponto Certo</h2>
              <p className="text-xs text-slate-400 mt-1">{titulo}</p>
            </div>
            <button 
              className="md:hidden text-slate-400 hover:text-white text-lg" 
              onClick={() => setSidebarAberta(false)}
              aria-label="Fechar Menu"
            >
              ✕
            </button>
          </div>
          <nav className="mt-4 px-4 space-y-2">
            {linksNavegacao.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 transition"
                onClick={() => setSidebarAberta(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => router.push('/login')} 
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-md transition"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Overlay escuro para mobile quando a sidebar estiver aberta */}
      {sidebarAberta && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}