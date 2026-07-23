'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, AppError } from '@/services/api';
import Link from 'next/link';

interface RegistroPonto {
  id: string;
  data: string;
  hora: string;
  tipo?: string;
  status?: string;
}

export default function HistoricoPontoPage() {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchHistorico() {
      try {
        // Faz a chamada para a rota de histórico do backend (ajuste o endpoint se necessário)
        const data = await api.get<RegistroPonto[]>('/ponto/historico');
        setRegistros(data);
      } catch (err) {
        if (err instanceof AppError) {
          setErro(err.message);
        } else {
          setErro('Não foi possível carregar o histórico de registros.');
        }
      } finally {
        setCarregando(false);
      }
    }

    fetchHistorico();
  }, []);

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando histórico...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Espelho de Ponto</h1>
            <p className="text-sm text-gray-400 mt-1">Visualize seus registros anteriores e auditorias</p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-sm font-medium transition"
          >
            Voltar ao Painel
          </Link>
        </div>

        {erro && (
          <div className="p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg">
            {erro}
          </div>
        )}

        {/* Listagem em Tabela */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          {registros.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Nenhum registro de ponto encontrado.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-sm">
                    <th className="p-4 font-medium">Data</th>
                    <th className="p-4 font-medium">Horário</th>
                    <th className="p-4 font-medium">Tipo</th>
                    <th className="p-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                  {registros.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-800/30 transition">
                      <td className="p-4 text-gray-200">{reg.data}</td>
                      <td className="p-4 text-gray-200">{reg.hora}</td>
                      <td className="p-4 text-gray-300">{reg.tipo || 'Ponto'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">
                          {reg.status || 'Registrado'}
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
    </div>
  );
}