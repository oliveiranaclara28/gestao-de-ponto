'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, AppError } from '@/services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      // Faz a chamada para a rota de login do backend
      await api.post('/sessions', { email, senha });

      // Se der certo, redireciona para o dashboard
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof AppError) {
        setErro(err.message);
      } else {
        setErro('Ocorreu um erro ao tentar fazer login. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-xl shadow-lg border border-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Ponto Certo</h1>
          <p className="text-sm text-gray-400 mt-2">Faça login para acessar o sistema</p>
        </div>

        {erro && (
          <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu.email@empresa.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}