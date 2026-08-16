// Repository: único lugar deste módulo que conversa com o Prisma.
// Cada função faz UMA operação simples no banco -- sem decisão de
// negócio nenhuma (isso é responsabilidade do Service).

import { prisma } from '../../config/database';
import { Papel } from '../../generated/prisma/client';

// Formato que o Repository espera para criar um funcionário --
// já chega com matrícula e senha (em hash) prontas, porque quem
// decide COMO gerar esses valores é o Service, não o Repository.
export interface CriarFuncionarioInput {
  nome: string;
  cpf: string;
  email: string;
  senhaHash: string;
  matricula: string;
  cargo: string;
  estabelecimento: string;
  dataAdmissao: Date;
  salario: number;
  papel: Papel;
  telefone?: string;
  endereco?: string;
  gestorId?: string;
}

export const funcionariosRepository = {
  criar: (dados: CriarFuncionarioInput) => {
    return prisma.funcionario.create({ data: dados });
  },

  listarTodos: () => {
    return prisma.funcionario.findMany({
      orderBy: { criadoEm: 'desc' },
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        telefone: true,
        endereco: true,
        matricula: true,
        cargo: true,
        estabelecimento: true,
        dataAdmissao: true,
        salario: true,
        papel: true,
        status: true,
        gestorId: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });
  },

  buscarPorId: (id: string) => {
    return prisma.funcionario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        telefone: true,
        endereco: true,
        matricula: true,
        cargo: true,
        estabelecimento: true,
        dataAdmissao: true,
        salario: true,
        papel: true,
        status: true,
        gestorId: true,
        criadoEm: true,
        atualizadoEm: true,
      },
    });
  },

  buscarPorEmail: (email: string) => {
    return prisma.funcionario.findUnique({ where: { email } });
  },

  contarTotal: () => {
    return prisma.funcionario.count();
  },

  atualizar: (id: string, dados: Partial<CriarFuncionarioInput>) => {
    return prisma.funcionario.update({ where: { id }, data: dados });
  },

  inativar: (id: string) => {
    return prisma.funcionario.update({
      where: { id },
      data: { status: 'INATIVO' },
    });
  },

  listarFotos: (funcionarioId: string) => {
    return prisma.fotoReferenciaFacial.findMany({
      where: { funcionarioId },
      orderBy: { ordem: 'asc' },
    });
  },

  contarFotos: (funcionarioId: string) => {
    return prisma.fotoReferenciaFacial.count({ where: { funcionarioId } });
  },

  criarFoto: (funcionarioId: string, fotoUrl: string, ordem: number) => {
    return prisma.fotoReferenciaFacial.create({
      data: { funcionarioId, fotoUrl, ordem },
    });
  },

  buscarFotoPorId: (id: string) => {
    return prisma.fotoReferenciaFacial.findUnique({ where: { id } });
  },

  deletarFoto: (id: string) => {
    return prisma.fotoReferenciaFacial.delete({ where: { id } });
  },
};