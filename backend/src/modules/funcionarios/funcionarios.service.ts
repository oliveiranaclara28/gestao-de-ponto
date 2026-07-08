// Service: contém a regra de negócio do módulo. Não conhece Express
// (sem req/res) -- só recebe dados, decide o que fazer, devolve dados.
// Isso permite testar essa lógica sem precisar simular uma requisição HTTP.

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { funcionariosRepository } from './funcionarios.repository';
import { Papel } from '../../generated/prisma/client';

interface CriarFuncionarioDTO {
  nome: string;
  cpf: string;
  email: string;
  cargo: string;
  estabelecimento: string;
  dataAdmissao: Date;
  salario: number;
  papel?: Papel;
  telefone?: string;
  endereco?: string;
  gestorId?: string;
}

// Gera uma senha provisória legível (ex: "K3F9-QX2M"), mais fácil
// de digitar/repassar do que uma string aleatória crua.
function gerarSenhaProvisoria(): string {
  const bloco = () => crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${bloco()}-${bloco()}`;
}

async function gerarMatricula(): Promise<string> {
  const totalAtual = await funcionariosRepository.contarTotal();
  const proximoNumero = totalAtual + 1;
  // padStart garante zeros à esquerda: 1 -> "0001", 23 -> "0023"
  return `F${String(proximoNumero).padStart(4, '0')}`;
}

export const funcionariosService = {
  criar: async (dados: CriarFuncionarioDTO) => {
    // Regra de negócio: e-mail precisa ser único. Isso também é
    // garantido pelo banco (@unique no schema), mas checar aqui
    // primeiro permite devolver uma mensagem de erro clara, em vez
    // de deixar o Prisma estourar um erro de constraint genérico.
    const jaExiste = await funcionariosRepository.buscarPorEmail(dados.email);
    if (jaExiste) {
      throw new Error('Já existe um funcionário cadastrado com esse e-mail.');
    }

    const matricula = await gerarMatricula();
    const senhaProvisoria = gerarSenhaProvisoria();
    const senhaHash = bcrypt.hashSync(senhaProvisoria, 10);

    const funcionario = await funcionariosRepository.criar({
      ...dados,
      matricula,
      senhaHash,
      papel: dados.papel ?? 'FUNCIONARIO',
    });

    // Devolvemos a senha em texto puro APENAS aqui, nesta resposta
    // única -- depois disso, só existe o hash salvo. Ninguém, nem
    // o próprio sistema, consegue recuperar essa senha de novo.
    return { funcionario, senhaProvisoria };
  },

  listarTodos: () => {
    return funcionariosRepository.listarTodos();
  },

  buscarPorId: async (id: string) => {
    const funcionario = await funcionariosRepository.buscarPorId(id);
    if (!funcionario) {
      throw new Error('Funcionário não encontrado.');
    }
    return funcionario;
  },

  atualizar: async (id: string, dados: Partial<CriarFuncionarioDTO>) => {
    await funcionariosService.buscarPorId(id); // garante que existe, senão lança erro
    return funcionariosRepository.atualizar(id, dados);
  },

  inativar: async (id: string) => {
    await funcionariosService.buscarPorId(id);
    return funcionariosRepository.inativar(id);
  },

  // Regra de negócio: no máximo 3 fotos de referência por
  // funcionário. Essa contagem não existe no banco (o Prisma não
  // tem como validar "quantidade máxima de registros relacionados"),
  // por isso mora aqui.
  adicionarFoto: async (funcionarioId: string, fotoUrl: string) => {
    await funcionariosService.buscarPorId(funcionarioId);

    const totalFotos = await funcionariosRepository.contarFotos(funcionarioId);
    if (totalFotos >= 3) {
      throw new Error('Limite de 3 fotos de referência já foi atingido.');
    }

    return funcionariosRepository.criarFoto(funcionarioId, fotoUrl, totalFotos + 1);
  },

  listarFotos: (funcionarioId: string) => {
    return funcionariosRepository.listarFotos(funcionarioId);
  },

  removerFoto: async (fotoId: string) => {
    const foto = await funcionariosRepository.buscarFotoPorId(fotoId);
    if (!foto) {
      throw new Error('Foto não encontrada.');
    }
    return funcionariosRepository.deletarFoto(fotoId);
  },
};