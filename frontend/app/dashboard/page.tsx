'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // Importa a função toast

interface RegistroPonto {
  id: string;
  dataHora: string;
  tipo?: string;
}

interface Usuario {
  nome: string;
  email: string;
  cargo?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [historico, setHistorico] = useState<RegistroPonto[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Função para buscar os dados do usuário logado
  const buscarUsuario = async () => {
    try {
      const response = await fetch('/api/me');
      if (response.ok) {
        const data = await response.json();
        setUsuario(data.usuario || data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  // Função para buscar o histórico de ponto
  const buscarHistorico = async () => {
    try {
      const response = await fetch('/api/ponto/historico');
      if (response.ok) {
        const data = await response.json();
        setHistorico(Array.isArray(data) ? data : data.historico || []);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setCarregandoHistorico(false);
    }
  };

  useEffect(() => {
    buscarUsuario();
    buscarHistorico();
  }, []);

  const handleBaterPonto = async () => {
    setCarregando(true);

    try {
      const response = await fetch('/api/ponto', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao registrar ponto');
      }

      const dataHoraAtual = new Date().toLocaleString('pt-BR');
      
      // Dispara o toast flutuante de sucesso
      toast.success(`Ponto registrado com sucesso às ${dataHoraAtual}!`);
      
      // Atualiza a tabela recarregando o histórico
      buscarHistorico();
    } catch (err: any) {
      // Dispara o toast flutuante de erro
      toast.error(`Erro: ${err.message}`);
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      toast.info('Sessão encerrada.');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao sair da conta.');
      console.error('Erro ao sair da conta:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar / Menu Lateral */}
      <aside className="w-64 bg-white shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-blue-600">Ponto Certo</h2>
            <p className="text-xs text-gray-500 mt-1">Painel do Funcionário</p>
          </div>
          <nav className="mt-2 px-4 space-y-2">
            <a href="#" className="block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md">
              Registrar Ponto
            </a>
          </nav>
        </div>

        {/* Informações do Usuário no Rodapé da Sidebar */}
        <div className="p-4 border-t border-gray-100">
          <p className="text-sm font-semibold text-gray-800 truncate">{usuario?.nome || 'Carregando...'}</p>
          <p className="text-xs text-gray-500 truncate">{usuario?.email || ''}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md mt-4 transition"
          >
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bem-vindo(a){usuario?.nome ? `, ${usuario.nome.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-gray-600 text-sm">Gerencie seus horários de forma simples e segura.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-gray-700">
            Status: <span className="text-green-600 font-bold">Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card de Bater Ponto */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Registro de Ponto</h2>
            <p className="text-gray-600 text-sm mb-6">
              Clique no botão abaixo para registrar o seu horário de entrada ou saída atual.
            </p>

            <button
              onClick={handleBaterPonto}
              disabled={carregando}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg shadow transition duration-200"
            >
              {carregando ? 'Registrando...' : 'Bater Ponto Agora'}
            </button>
          </div>

          {/* Card de Histórico */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Histórico Recente</h2>
            
            {carregandoHistorico ? (
              <p className="text-gray-500 text-sm">Carregando histórico...</p>
            ) : historico.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum registro encontrado.</p>
            ) : (
              <div className="overflow-x-auto max-h-64">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="py-2 px-3">Data e Hora</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historico.map((item, index) => (
                      <tr key={item.id || index} className="hover:bg-gray-50">
                        <td className="py-3 px-3">
                          {new Date(item.dataHora).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
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
        </div>
      </main>
    </div>
  );
}