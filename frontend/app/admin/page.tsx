'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface RegistroAdmin {
  id: string;
  funcionario: string;
  email: string;
  dataHora: string;
  tipo?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [registros, setRegistros] = useState<RegistroAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Função para buscar todos os registros do sistema
  const buscarTodosRegistros = async () => {
    try {
      const response = await fetch('/api/admin/pontos');
      if (response.ok) {
        const data = await response.json();
        setRegistros(Array.isArray(data) ? data : data.registros || []);
      } else {
        toast.error('Acesso negado ou erro ao carregar dados.');
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarTodosRegistros();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      toast.info('Sessão encerrada.');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao sair da conta.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar do Administrador */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-indigo-600">Ponto Certo</h2>
            <p className="text-xs text-gray-500 mt-1">Painel do Administrador</p>
          </div>
          <nav className="mt-2 px-4 space-y-2">
            <a href="#" className="block px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md">
              Todos os Registros
            </a>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
          >
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel Gerencial</h1>
            <p className="text-gray-600 text-sm">Acompanhe os registros de ponto de todos os colaboradores.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-indigo-600">
            Modo: <span className="font-bold">Administrador</span>
          </div>
        </header>

        {/* Tabela de Registros Gerais */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Registro Geral de Horários</h2>
            <button
              onClick={buscarTodosRegistros}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md transition"
            >
              Atualizar Lista
            </button>
          </div>

          {carregando ? (
            <p className="text-gray-500 text-sm">Carregando registros...</p>
          ) : registros.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum registro encontrado no sistema.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4">Funcionário</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">Data e Hora</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registros.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{item.funcionario || 'Colaborador'}</td>
                      <td className="py-3 px-4 text-gray-500">{item.email || '-'}</td>
                      <td className="py-3 px-4">{new Date(item.dataHora).toLocaleString('pt-BR')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                          Registrado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}