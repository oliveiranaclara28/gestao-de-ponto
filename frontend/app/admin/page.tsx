'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { api, AppError } from '@/services/api';
import Link from 'next/link';

interface RegistroAdmin {
  id: string;
  colaboradorNome: string;
  email: string;
  data: string;
  hora: string;
  tipo?: string;
  status?: string;
  fotoUrl?: string;
}

export default function AdminPainelPage() {
  const [registros, setRegistros] = useState<RegistroAdmin[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);

  // Estados dos filtros
  const [buscaNome, setBuscaNome] = useState('');
  const [filtroData, setFiltroData] = useState('');

  const router = useRouter();

  useEffect(() => {
    async function fetchAdminRegistros() {
      try {
        const data = await api.get<RegistroAdmin[]>('/admin/pontos');
        setRegistros(data);
      } catch (err) {
        if (err instanceof AppError) {
          setErro(err.message);
        } else {
          setErro('Não foi possível carregar os registros administrativos.');
        }
      } finally {
        setCarregando(false);
      }
    }

    fetchAdminRegistros();
  }, []);

  // Lógica de filtragem em tempo real
  const registrosFiltrados = useMemo(() => {
    return registros.filter((reg) => {
      const matchNome = 
        reg.colaboradorNome?.toLowerCase().includes(buscaNome.toLowerCase()) ||
        reg.email?.toLowerCase().includes(buscaNome.toLowerCase());
      
      const matchData = filtroData ? reg.data.includes(filtroData) : true;

      return matchNome && matchData;
    });
  }, [registros, buscaNome, filtroData]);

  // Função para exportar os dados filtrados para CSV
  function exportarCSV() {
    if (registrosFiltrados.length === 0) {
      alert('Não há registros para exportar com os filtros atuais.');
      return;
    }

    const cabecalho = ['Colaborador', 'E-mail', 'Data', 'Hora', 'Tipo', 'Status'];
    const linhas = registrosFiltrados.map((reg) => [
      `"${reg.colaboradorNome || 'Funcionário'}"`,
      `"${reg.email}"`,
      `"${reg.data}"`,
      `"${reg.hora}"`,
      `"${reg.tipo || 'Ponto'}"`,
      `"${reg.status || 'Validado'}"`,
    ]);

    const conteudoCSV = [
      cabecalho.join(';'),
      ...linhas.map((linha) => linha.join(';'))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-pontos-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Carregando painel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex justify-between items-center bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
          <div>
            <h1 className="text-2xl font-bold">Painel Administrativo — Auditoria de Pontos</h1>
            <p className="text-sm text-gray-400 mt-1">Visualize os registros e fotos de auditoria de todos os colaboradores</p>
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

        {/* Barra de Filtros e Exportação */}
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Filtrar por Colaborador (Nome ou E-mail)</label>
              <input
                type="text"
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
                placeholder="Digite o nome do funcionário..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Filtrar por Data</label>
              <input
                type="text"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                placeholder="Ex: 2026-06-06 ou DD/MM"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-gray-800">
            <button
              onClick={exportarCSV}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              📥 Exportar Filtrados (CSV)
            </button>
          </div>
        </div>

        {/* Tabela de Auditoria Global */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-lg overflow-hidden">
          {registrosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              Nenhum registro encontrado com os filtros aplicados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-800 text-gray-400 text-sm">
                    <th className="p-4 font-medium">Colaborador</th>
                    <th className="p-4 font-medium">Data</th>
                    <th className="p-4 font-medium">Horário</th>
                    <th className="p-4 font-medium">Tipo</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-center">Auditoria (Foto)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-sm">
                  {registrosFiltrados.map((reg) => (
                    <tr key={reg.id} className="hover:bg-gray-800/30 transition">
                      <td className="p-4">
                        <div className="font-medium text-gray-200">{reg.colaboradorNome || 'Funcionário'}</div>
                        <div className="text-xs text-gray-400">{reg.email}</div>
                      </td>
                      <td className="p-4 text-gray-200">{reg.data}</td>
                      <td className="p-4 text-gray-200">{reg.hora}</td>
                      <td className="p-4 text-gray-300">{reg.tipo || 'Ponto'}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full">
                          {reg.status || 'Validado'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {reg.fotoUrl ? (
                          <button
                            onClick={() => setFotoSelecionada(reg.fotoUrl || null)}
                            className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-800 rounded-lg text-xs font-medium transition cursor-pointer"
                          >
                            Ver Foto
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500">Sem foto</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Visualizar a Foto de Auditoria em Destaque */}
      {fotoSelecionada && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Evidência de Auditoria</h3>
              <button
                onClick={() => setFotoSelecionada(null)}
                className="text-gray-400 hover:text-white text-sm font-bold px-2 py-1 bg-gray-800 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center">
              <img src={fotoSelecionada} alt="Foto de auditoria do ponto" className="w-full h-full object-cover" />
            </div>
            <button
              onClick={() => setFotoSelecionada(null)}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}