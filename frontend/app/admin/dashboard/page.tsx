'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminDashboardOverview() {
  const router = useRouter();

  // Dados simulados do dashboard (substituirá a chamada ao dashboard.service.ts)
  const [metricas] = useState({
    funcionariosAtivos: 42,
    presentesHoje: 35,
    ausentesHoje: 5,
    atrasadosHoje: 2,
    pendenciasAprovacao: 3,
  });

  const [atividadesRecentes] = useState([
    { id: '1', funcionario: 'Ana Souza', acao: 'Bateu Ponto (Entrada)', horario: '08:02', status: 'Normal' },
    { id: '2', funcionario: 'Carlos Silva', acao: 'Bateu Ponto (Atraso / Hora Extra)', horario: '09:15', status: 'Pendente' },
    { id: '3', funcionario: 'Mariana Lima', acao: 'Solicitou Ajuste de Ponto', horario: 'Ontem', status: 'Pendente' },
  ]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar do Administrador */}
      <aside className="w-64 bg-slate-900 text-white shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-indigo-400">Ponto Certo</h2>
            <p className="text-xs text-slate-400 mt-1">Dashboard Geral</p>
          </div>
          <nav className="mt-4 px-4 space-y-2">
            <a href="/admin/dashboard" className="block px-4 py-2.5 rounded-md text-sm font-medium bg-indigo-600 text-white">
              📊 Visão Geral
            </a>
            <a href="/admin/funcionarios" className="block px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
              👥 Funcionários
            </a>
            <a href="/admin/aprovacoes" className="block px-4 py-2.5 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800">
              📝 Aprovações
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
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 text-sm mt-1">Indicadores em tempo real da jornada de trabalho e status da equipe.</p>
        </header>

        {/* Cards de Indicadores Visuais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Ativos</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{metricas.funcionariosAtivos}</p>
            <p className="text-xs text-slate-400 mt-1">Colaboradores cadastrados</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Presentes Hoje</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{metricas.presentesHoje}</p>
            <p className="text-xs text-gray-400 mt-1">Registraram entrada</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Ausentes</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{metricas.ausentesHoje}</p>
            <p className="text-xs text-gray-400 mt-1">Sem registro hoje</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase">Atrasados</p>
            <p className="text-3xl font-bold text-amber-600 mt-2">{metricas.atrasadosHoje}</p>
            <p className="text-xs text-gray-400 mt-1">Após tolerância</p>
          </div>

          <div 
            onClick={() => router.push('/admin/aprovacoes')}
            className="bg-white p-5 rounded-lg shadow-sm border border-indigo-200 cursor-pointer hover:bg-indigo-50 transition"
          >
            <p className="text-xs font-semibold text-indigo-600 uppercase">Pendências</p>
            <p className="text-3xl font-bold text-indigo-700 mt-2">{metricas.pendenciasAprovacao}</p>
            <p className="text-xs text-indigo-500 mt-1">Aguardando aprovação ➔</p>
          </div>
        </div>

        {/* Seção de Atividades Recentes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Últimas Atividades da Equipe</h2>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4">Funcionário</th>
                <th className="py-3 px-4">Ação</th>
                <th className="py-3 px-4">Horário</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {atividadesRecentes.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{item.funcionario}</td>
                  <td className="py-3 px-4">{item.acao}</td>
                  <td className="py-3 px-4">{item.horario}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}