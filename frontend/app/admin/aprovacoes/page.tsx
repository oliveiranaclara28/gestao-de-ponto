'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PontoAprovacao {
  id: string;
  funcionario: string;
  dataHora: string;
  tipo: string;
  foto: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  motivoRejeicao?: string;
  decididoEm?: string;
}

const dadosIniciais: PontoAprovacao[] = [
  {
    id: '201',
    funcionario: 'Ana Souza',
    dataHora: '22/07/2026 08:30',
    tipo: 'Entrada (Fora do Horário)',
    foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    status: 'Pendente',
  },
  {
    id: '202',
    funcionario: 'Carlos Silva',
    dataHora: '21/07/2026 18:05',
    tipo: 'Saída (Hora Extra)',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    status: 'Pendente',
  },
  {
    id: '203',
    funcionario: 'Mariana Lima',
    dataHora: '20/07/2026 08:00',
    tipo: 'Entrada',
    foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    status: 'Aprovado',
    decididoEm: '20/07/2026 09:15',
  },
];

export default function ModuloAprovacoes() {
  const router = useRouter();
  const [pontos, setPontos] = useState<PontoAprovacao[]>(dadosIniciais);
  const [aba, setAba] = useState<'pendentes' | 'historico'>('pendentes');

  // Estados para o Modal de Rejeição
  const [modalRejeicaoAberto, setModalRejeicaoAberto] = useState(false);
  const [pontoSelecionado, setPontoSelecionado] = useState<PontoAprovacao | null>(null);
  const [motivo, setMotivo] = useState('');

  // Ação de Aprovar Ponto
  const handleAprovar = (id: string) => {
    setPontos(
      pontos.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'Aprovado',
              decididoEm: new Date().toLocaleString('pt-BR'),
            }
          : p
      )
    );
    toast.success('Ponto aprovado com sucesso!');
  };

  // Abrir Modal de Rejeição
  const iniciarRejeicao = (ponto: PontoAprovacao) => {
    setPontoSelecionado(ponto);
    setMotivo('');
    setModalRejeicaoAberto(true);
  };

  // Confirmar Rejeição com Motivo
  const handleConfirmarRejeicao = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pontoSelecionado) return;
    if (!motivo.trim()) {
      toast.error('Informe o motivo da rejeição.');
      return;
    }

    setPontos(
      pontos.map((p) =>
        p.id === pontoSelecionado.id
          ? {
              ...p,
              status: 'Rejeitado',
              motivoRejeicao: motivo,
              decididoEm: new Date().toLocaleString('pt-BR'),
            }
          : p
      )
    );

    toast.success('Ponto rejeitado com justificativa.');
    setModalRejeicaoAberto(false);
    setPontoSelecionado(null);
  };

  const pontosPendentes = pontos.filter((p) => p.status === 'Pendente');
  const historicoDecisoes = pontos.filter((p) => p.status !== 'Pendente');

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar do Gestor */}
      <aside className="w-64 bg-slate-900 text-white shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-indigo-400">Ponto Certo</h2>
            <p className="text-xs text-slate-400 mt-1">Painel do Gestor</p>
          </div>
          <nav className="mt-4 px-4 space-y-2">
            <a href="/admin/aprovacoes" className="block px-4 py-2.5 rounded-md text-sm font-medium bg-indigo-600 text-white">
              📝 Aprovação de Pontos
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
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Aprovações</h1>
          <p className="text-gray-600 text-sm mt-1">Gerencie a fila de registros pendentes de validação e consulte o histórico de decisões.</p>
        </header>

        {/* Abas de Navegação */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-2">
          <button
            onClick={() => setAba('pendentes')}
            className={`pb-2 text-sm font-semibold transition ${
              aba === 'pendentes' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Fila Pendente ({pontosPendentes.length})
          </button>
          <button
            onClick={() => setAba('historico')}
            className={`pb-2 text-sm font-semibold transition ${
              aba === 'historico' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Histórico de Decisões ({historicoDecisoes.length})
          </button>
        </div>

        {/* Aba: Fila de Pendentes */}
        {aba === 'pendentes' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-6">Evidência</th>
                  <th className="py-3 px-6">Funcionário</th>
                  <th className="py-3 px-6">Data e Hora</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pontosPendentes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">Nenhum ponto pendente no momento.</td>
                  </tr>
                ) : (
                  pontosPendentes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <img src={p.foto} alt="Evidência" className="w-12 h-12 object-cover rounded-md border shadow-sm" />
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-900">{p.funcionario}</td>
                      <td className="py-4 px-6">{p.dataHora}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded text-xs font-semibold">
                          {p.tipo}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleAprovar(p.id)}
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded shadow transition"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => iniciarRejeicao(p)}
                          className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition"
                        >
                          Rejeitar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Aba: Histórico de Decisões */}
        {aba === 'historico' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="py-3 px-6">Funcionário</th>
                  <th className="py-3 px-6">Data/Hora Ponto</th>
                  <th className="py-3 px-6">Tipo</th>
                  <th className="py-3 px-6">Decisão</th>
                  <th className="py-3 px-6">Detalhes / Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historicoDecisoes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400">Nenhum registro no histórico.</td>
                  </tr>
                ) : (
                  historicoDecisoes.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">{p.funcionario}</td>
                      <td className="py-4 px-6">{p.dataHora}</td>
                      <td className="py-4 px-6">{p.tipo}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${p.status === 'Aprovado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {p.status === 'Rejeitado' ? (
                          <span className="text-red-600 text-xs italic">Motivo: {p.motivoRejeicao}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Aprovado em {p.decididoEm}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal de Rejeição com Campo de Motivo */}
      {modalRejeicaoAberto && pontoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Rejeitar Ponto de {pontoSelecionado.funcionario}</h2>
            <p className="text-xs text-gray-500 mb-4">Informe o motivo da rejeição para que o colaborador seja notificado.</p>

            <form onSubmit={handleConfirmarRejeicao} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Motivo da Rejeição *</label>
                <textarea
                  required
                  rows={3}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ex: Foto de evidência inválida ou fora da tolerância..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalRejeicaoAberto(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-md transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md shadow transition"
                >
                  Confirmar Rejeição
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}