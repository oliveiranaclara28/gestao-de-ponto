'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import Link from 'next/link';

interface UserProfile {
  nome?: string;
  email?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await api.get<UserProfile>('/me');
        setUser(data);
      } catch (err) {
        router.push('/login');
      } finally {
        setCarregando(false);
      }
    }

    fetchUserData();
  }, [router]);

  async function handleLogout() {
    try {
      await api.post('/logout');
    } catch {
      // Ignora erro e apenas redireciona
    } finally {
      router.push('/login');
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Painel do Colaborador</h1>
            <p className="text-sm text-gray-400 mt-1">
              Olá, <span className="text-white font-medium">{user?.nome || user?.email || 'Usuário'}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Registro de Ponto</h2>
              <p className="text-sm text-gray-400 mt-1">
                Bata o seu ponto diário utilizando a captura de webcam para auditoria.
              </p>
            </div>
            <Link
              href="/dashboard/ponto"
              className="inline-block text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-md"
            >
              Bater Ponto Agora
            </Link>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-200">Histórico de Registros</h2>
              <p className="text-sm text-gray-400 mt-1">
                Visualize o espelho de ponto e os registros anteriores salvos no sistema.
              </p>
            </div>
            <Link
              href="/dashboard/historico"
              className="inline-block text-center py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition shadow-md"
            >
              Ver Histórico
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}