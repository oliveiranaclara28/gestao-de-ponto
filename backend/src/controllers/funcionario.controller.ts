import { Request, Response } from 'express';

// Nosso banco de dados falso em memória
export const funcionariosSalvos: any[] = [];

export const funcionarioController = {
  // Lógica para cadastrar um funcionário
  criar: (req: Request, res: Response) => {
    const { nome, cargo, email } = req.body;

    if (!nome || !cargo || !email) {
      return res.status(400).json({ error: 'Nome, cargo e email são obrigatórios.' });
    }

    const novoFuncionario = {
      id: Date.now().toString(),
      nome,
      cargo,
      email,
      dataCriacao: new Date()
    };

    funcionariosSalvos.push(novoFuncionario);

    return res.status(201).json({
      mensagem: '🎉 Funcionário cadastrado com sucesso (em memória)!',
      funcionario: novoFuncionario
    });
  },

  // Lógica para listar todos os funcionários
  listar: (req: Request, res: Response) => {
    return res.json(funcionariosSalvos);
  },

  // NOVA FUNÇÃO: Atualizar dados do funcionário
  atualizar: (req: Request, res: Response) => {
    const { id } = req.params;
    const { nome, cargo, email } = req.body;

    // Encontra o funcionário pelo ID
    const funcionario = funcionariosSalvos.find(f => f.id === id);

    if (!funcionario) {
      return res.status(404).json({ error: 'Funcionário não encontrado.' });
    }

    // Atualiza apenas os campos que forem enviados no corpo da requisição
    if (nome) funcionario.nome = nome;
    if (cargo) funcionario.cargo = cargo;
    if (email) funcionario.email = email;

    return res.json({
      mensagem: '🔄 Funcionário atualizado com sucesso!',
      funcionario
    });
  },

  // NOVA FUNÇÃO: Remover/Inativar funcionário do sistema
  deletar: (req: Request, res: Response) => {
    const { id } = req.params;

    // Encontra o índice do funcionário na lista
    const indice = funcionariosSalvos.findIndex(f => f.id === id);

    if (indice === -1) {
      return res.status(404).json({ error: 'Funcionário não encontrado.' });
    }

    // Remove o funcionário da nossa lista em memória
    const funcionarioRemovido = funcionariosSalvos.splice(indice, 1);

    return res.json({
      mensagem: `❌ Funcionário ${funcionarioRemovido[0].nome} foi removido com sucesso.`
    });
  }
};