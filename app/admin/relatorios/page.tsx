'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface RegistroRelatorio {
  id: string;
  data: string;
  funcionario: string;
  entrada: string;
  saidaAlmoco: string;
  retornoAlmoco: string;
  saida: string;
  totalHoras: string;
  status: 'Normal' | 'Hora Extra' | 'Falta' | 'Atraso';
}

const dadosMockRelatorio: RegistroRelatorio[] = [
  { id: '1', data: '20/07/2026', funcionario: 'Ana Souza', entrada: '08:00', saidaAlmoco: '12:00', retornoAlmoco: '13:00', saida: '17:00', totalHoras: '08:00', status: 'Normal' },
  { id: '2', data: '21/07/2026', funcionario: 'Ana Souza', entrada: '08:05', saidaAlmoco: '12:00', retornoAlmoco: '13:00', saida: '17:30', totalHoras: '08:25', status: 'Hora Extra' },
  { id: '3', data: '20/07/2026', funcionario: 'Carlos Silva', entrada: '08:30', saidaAlmoco: '12:00', retornoAlmoco: '13:00', saida: '17:00', totalHoras: '07:30', status: 'Atraso' },
  { id: '4', data: '21/07/2026', funcionario: 'Carlos Silva', entrada: '-', saidaAlmoco: '-', retornoAlmoco: '-', saida: '-', totalHoras: '00:00', status: 'Falta' },
];

export default function ModuloRelatorios() {
  const router = useRouter();

  // Estados dos Filtros
  const [funcionarioFiltro, setFuncionarioFiltro] = useState('');
  const [dataInicio, setDataInicio] = useState('2026-07-01');
  const [dataFim, setDataFim] = useState('2026-07-31');

  // Dados exibidos
  const [relatorio, setRelatorio] = useState<RegistroRelatorio[]>(dadosMockRelatorio);

  // Aplicar Filtros
  const handleFiltrar = (e: React.FormEvent) => {
    e.preventDefault();
    let resultado = dadosMockRelatorio;

    if (funcionarioFiltro) {
      resultado = resultado.filter((r) =>
        r.funcionario.toLowerCase().includes(funcionarioFiltro.toLowerCase())
      );
    }

    setRelatorio(resultado);
    toast.success('Relatório filtrado com sucesso!');
  };

  // Simulação de Download em PDF
  const handleDownloadPDF = () => {
    toast.success('Gerando arquivo PDF... O download começará em instantes.');
    setTimeout(() => {
      const blob = new Blob(['Relatório de Ponto - PDF Simulado'], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-ponto-${dataInicio}-a-${dataFim}.pdf`;
      a.click();
    }, 1000);
  };

  // Simulação de Download em Excel
  const handleDownloadExcel = () => {
    toast.success('Gerando planilha Excel... O download começará em instantes.');
    setTimeout(() => {
      const csvContent = 'data:text/csv;charset=utf-8,' 
        + 'Data,Funcionario,Entrada,Saida Almoco,Retorno Almoco,Saida,Total Horas,Status\n'
        + relatorio.map(r => `${r.data},${r.funcionario},${r.entrada},${r.saidaAlmoco},${r.retornoAlmoco},${r.saida},${r.totalHoras},${r.status}`).join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const a = document.createElement('a');
      a.href = encodedUri;
      a.download = `relatorio-ponto-${dataInicio}-a-${dataFim}.csv`;
      a.click();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar do Administrador */}
      <aside className="w-64 bg-slate-900 text-white shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-indigo-400">Ponto Certo</h2>
            <p className="text-xs text-slate-400 mt-1">Painel Administrativo</p>
          </div>
          <nav className="mt-4 px-4 space-y-2">
            <a href="/admin/dashboard" className="block px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
              📊 Visão Geral
            </a>
            <a href="/admin/funcionarios" className="block px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
              👥 Funcionários
            </a>
            <a href="/admin/aprovacoes" className="block px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
              📝 Aprovações
            </a>
            <a href="/admin/relatorios" className="block px-4 py-2.5 rounded-md text-sm font-medium bg-indigo-600 text-white">
              📈 Relatórios
            </a>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => router.push('/login')} className="w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 rounded-md transition">
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios e Espelho de Ponto</h1>
            <p className="text-gray-600 text-sm mt-1">Filtre jornadas por período e colaborador, visualize em tela ou exporte.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-2"
            >
              📥 Baixar PDF
            </button>
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow transition flex items-center gap-2"
            >
              📊 Baixar Excel
            </button>
          </div>
        </header>

        {/* Filtros de Pesquisa */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <form onSubmit={handleFiltrar} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Funcionário</label>
              <input
                type="text"
                placeholder="Nome do colaborador..."
                value={funcionarioFiltro}
                onChange={(e) => setFuncionarioFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow transition"
              >
                🔍 Filtrar Relatório
              </button>
            </div>
          </form>
        </div>

        {/* Tabela de Visualização do Relatório */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Funcionário</th>
                <th className="py-3 px-4">Entrada</th>
                <th className="py-3 px-4">Saída Almoço</th>
                <th className="py-3 px-4">Retorno Almoço</th>
                <th className="py-3 px-4">Saída</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {relatorio.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">Nenhum registro encontrado para o filtro selecionado.</td>
                </tr>
              ) : (
                relatorio.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{reg.data}</td>
                    <td className="py-3 px-4 text-gray-800">{reg.funcionario}</td>
                    <td className="py-3 px-4">{reg.entrada}</td>
                    <td className="py-3 px-4">{reg.saidaAlmoco}</td>
                    <td className="py-3 px-4">{reg.retornoAlmoco}</td>
                    <td className="py-3 px-4">{reg.saida}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{reg.totalHoras}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        reg.status === 'Normal' ? 'bg-green-100 text-green-700' :
                        reg.status === 'Hora Extra' ? 'bg-indigo-100 text-indigo-700' :
                        reg.status === 'Atraso' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}