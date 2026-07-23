'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface HistoricoCargo {
  cargo: string;
  estabelecimento: string;
  dataInicio: string;
}

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  estabelecimento: string;
  status: 'Ativo' | 'Inativo';
  historico: HistoricoCargo[];
  fotosReferencia: string[]; // Até 3 fotos
}

const funcionariosIniciais: Funcionario[] = [
  {
    id: '1',
    nome: 'Ana Souza',
    email: 'ana.souza@pontocerto.com',
    cargo: 'Assistente Administrativo',
    estabelecimento: 'Matriz - SP',
    status: 'Ativo',
    historico: [
      { cargo: 'Assistente Administrativo', estabelecimento: 'Matriz - SP', dataInicio: '10/01/2025' }
    ],
    fotosReferencia: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'],
  },
  {
    id: '2',
    nome: 'Carlos Silva',
    email: 'carlos.silva@pontocerto.com',
    cargo: 'Analista de Suporte',
    estabelecimento: 'Filial - RJ',
    status: 'Ativo',
    historico: [
      { cargo: 'Auxiliar de TI', estabelecimento: 'Filial - RJ', dataInicio: '15/03/2024' },
      { cargo: 'Analista de Suporte', estabelecimento: 'Filial - RJ', dataInicio: '01/01/2026' }
    ],
    fotosReferencia: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'],
  },
];

export default function ModuloFuncionarios() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(funcionariosIniciais);
  const [busca, setBusca] = useState('');
  
  // Modais
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);

  // Campos de Formulário (Criar / Editar)
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('');
  const [estabelecimento, setEstabelecimento] = useState('');
  const [fotos, setFotos] = useState<string[]>([]);

  // Filtragem em tempo real
  const funcionariosFiltrados = funcionarios.filter(
    (f) => f.nome.toLowerCase().includes(busca.toLowerCase()) || f.email.toLowerCase().includes(busca.toLowerCase())
  );

  // Criar Funcionário (CriarFuncionarioInput)
  const handleCriar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !cargo || !estabelecimento) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const novoFuncionario: Funcionario = {
      id: String(Date.now()),
      nome,
      email,
      cargo,
      estabelecimento,
      status: 'Ativo',
      historico: [{ cargo, estabelecimento, dataInicio: new Date().toLocaleDateString('pt-BR') }],
      fotosReferencia: fotos.length > 0 ? fotos : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'],
    };

    setFuncionarios([novoFuncionario, ...funcionarios]);
    toast.success('Funcionário cadastrado com sucesso!');
    limparFormulario();
    setModalCriarAberto(false);
  };

  // Atualizar Parcial (AtualizarFuncionarioInput)
  const handleAtualizar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!funcionarioSelecionado) return;

    setFuncionarios(
      funcionarios.map((f) => {
        if (f.id === funcionarioSelecionado.id) {
          const mudouCargoOuLocal = f.cargo !== cargo || f.estabelecimento !== estabelecimento;
          const novoHistorico = mudouCargoOuLocal
            ? [...f.historico, { cargo, estabelecimento, dataInicio: new Date().toLocaleDateString('pt-BR') }]
            : f.historico;

          return {
            ...f,
            nome: nome || f.nome,
            email: email || f.email,
            cargo: cargo || f.cargo,
            estabelecimento: estabelecimento || f.estabelecimento,
            historico: novoHistorico,
            fotosReferencia: fotos.length > 0 ? fotos : f.fotosReferencia,
          };
        }
        return f;
      })
    );

    toast.success('Cadastro atualizado com sucesso!');
    setModalEditarAberto(false);
    limparFormulario();
  };

  // Soft Delete (Inativar/Ativar)
  const handleAlternarStatus = (id: string) => {
    setFuncionarios(
      funcionarios.map((f) => (f.id === id ? { ...f, status: f.status === 'Ativo' ? 'Inativo' : 'Ativo' } : f))
    );
    toast.success('Status do funcionário alterado!');
  };

  const abrirEdicao = (f: Funcionario) => {
    setFuncionarioSelecionado(f);
    setNome(f.nome);
    setEmail(f.email);
    setCargo(f.cargo);
    setEstabelecimento(f.estabelecimento);
    setFotos(f.fotosReferencia);
    setModalEditarAberto(true);
  };

  const abrirDetalhes = (f: Funcionario) => {
    setFuncionarioSelecionado(f);
    setModalDetalhesAberto(true);
  };

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setCargo('');
    setEstabelecimento('');
    setFotos([]);
    setFuncionarioSelecionado(null);
  };

  // Simulação de upload de até 3 fotos
  const handleSimularUploadFoto = () => {
    if (fotos.length >= 3) {
      toast.error('Limite máximo de 3 fotos de referência atingido.');
      return;
    }
    const fotosExemplo = [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    ];
    const novaFoto = fotosExemplo[fotos.length % fotosExemplo.length];
    setFotos([...fotos, novaFoto]);
    toast.success('Foto de referência adicionada!');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white shadow-md hidden md:flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-indigo-400">Ponto Certo</h2>
            <p className="text-xs text-slate-400 mt-1">Gestão de Funcionários</p>
          </div>
          <nav className="mt-4 px-4 space-y-2">
            <a href="/admin" className="block px-4 py-2.5 rounded-md text-sm font-medium bg-indigo-600 text-white">
              👥 Colaboradores
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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Módulo de Funcionários</h1>
            <p className="text-gray-600 text-sm mt-1">Busque, cadastre, edite perfis e gerencie fotos faciais.</p>
          </div>
          <button
            onClick={() => { limparFormulario(); setModalCriarAberto(true); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow transition"
          >
            + Novo Funcionário
          </button>
        </header>

        {/* Barra de Busca / Filtro */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <input
            type="text"
            placeholder="Filtrar por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tabela de Listagem */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-6">Nome</th>
                <th className="py-3 px-6">Cargo / Local</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {funcionariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">Nenhum funcionário encontrado.</td>
                </tr>
              ) : (
                funcionariosFiltrados.map((func) => (
                  <tr key={func.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{func.nome}</div>
                      <div className="text-xs text-gray-500">{func.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div>{func.cargo}</div>
                      <div className="text-xs text-gray-500">{func.estabelecimento}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold ${func.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {func.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button onClick={() => abrirDetalhes(func)} className="text-xs font-medium text-indigo-600 hover:underline">Detalhes</button>
                      <button onClick={() => abrirEdicao(func)} className="text-xs font-medium text-blue-600 hover:underline">Editar</button>
                      <button onClick={() => handleAlternarStatus(func.id)} className={`text-xs font-medium px-2 py-1 rounded ${func.status === 'Ativo' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-green-600 bg-green-50 hover:bg-green-100'}`}>
                        {func.status === 'Ativo' ? 'Inativar' : 'Ativar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de Criação (CriarFuncionarioInput) */}
      {modalCriarAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Novo Funcionário</h2>
            <form onSubmit={handleCriar} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" placeholder="Ex: Maria Clara" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" placeholder="maria@pontocerto.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" required value={cargo} onChange={(e) => setCargo(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" placeholder="Ex: Assistente Administrativo" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estabelecimento</label>
                <input type="text" required value={estabelecimento} onChange={(e) => setEstabelecimento(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" placeholder="Ex: Matriz - SP" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fotos de Referência Facial (Até 3)</label>
                <div className="flex items-center space-x-3 mt-2">
                  <button type="button" onClick={handleSimularUploadFoto} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium rounded border">📷 Adicionar Foto</button>
                  <span className="text-xs text-gray-500">{fotos.length}/3 fotos adicionadas</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {fotos.map((f, idx) => (
                    <img key={idx} src={f} alt="Ref" className="w-12 h-12 object-cover rounded border" />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setModalCriarAberto(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Edição (AtualizarFuncionarioInput) */}
      {modalEditarAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Editar Funcionário</h2>
            <form onSubmit={handleAtualizar} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome Completo</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Cargo</label>
                <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Estabelecimento</label>
                <input type="text" value={estabelecimento} onChange={(e) => setEstabelecimento(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm text-gray-900" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Fotos de Referência Facial ({fotos.length}/3)</label>
                <button type="button" onClick={handleSimularUploadFoto} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-medium rounded border">📷 Adicionar/Atualizar Foto</button>
                <div className="flex gap-2 mt-3">
                  {fotos.map((f, idx) => (
                    <img key={idx} src={f} alt="Ref" className="w-12 h-12 object-cover rounded border" />
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setModalEditarAberto(false)} className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Detalhes e Histórico */}
      {modalDetalhesAberto && funcionarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Detalhes de {funcionarioSelecionado.nome}</h2>
            <p className="text-xs text-gray-500 mb-4">{funcionarioSelecionado.email}</p>

            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Fotos de Referência Cadastradas</p>
                <div className="flex gap-3">
                  {funcionarioSelecionado.fotosReferencia.map((foto, idx) => (
                    <img key={idx} src={foto} alt="Referência Facial" className="w-16 h-16 object-cover rounded-md border shadow-sm" />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase mb-2">Histórico de Cargo e Estabelecimento</p>
                <div className="border rounded-md divide-y text-sm">
                  {funcionarioSelecionado.historico.map((h, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{h.cargo}</p>
                        <p className="text-xs text-gray-500">{h.estabelecimento}</p>
                      </div>
                      <span className="text-xs text-gray-400">Desde {h.dataInicio}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
              <button onClick={() => setModalDetalhesAberto(false)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-md">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}