'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface RegistroPonto {
  id?: string;
  data?: string;
  horario?: string;
}

export default function HistoricoPage() {
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function fetchHistorico() {
      try {
        const response = await fetch('/api/historico');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Erro ao carregar histórico');
        }

        setRegistros(data.registros || []);
      } catch (err: any) {
        setErro(err.message || 'Erro ao carregar histórico.');
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Histórico de Registros</h1>
            <p className="text-sm text-gray-400 mt-1">
              Visualize seus pontos batidos recentemente.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-lg text-sm font-medium transition cursor-pointer"
          >
            Voltar
          </Link>
        </div>

        {erro && (
          <div className="p-4 bg-red-600/20 text-red-400 border border-red-800 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          {registros.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Nenhum registro de ponto encontrado.
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {registros.map((reg, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <span className="text-gray-200">Registro #{index + 1}</span>
                  <span className="text-gray-400 text-sm">{reg.data || 'Data recente'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}