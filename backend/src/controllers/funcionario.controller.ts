import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { Papel } from '@prisma/client';

console.log("--- TESTE: ESTE ARQUIVO ESTÁ SENDO LIDO! ---");

export const funcionarioController = {
  criar: async (req: Request, res: Response) => {
    try {
      // Se isso imprimir undefined no terminal, seu express.json() no server.ts não está funcionando
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Corpo da requisição vazio. Verifique o JSON no Thunder Client." });
      }

      const { nome, cpf, email, senha, matricula, cargo, estabelecimento, dataAdmissao, salario, papel, telefone, endereco } = req.body;

      if (!senha) {
        return res.status(400).json({ error: "Senha é obrigatória." });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoFuncionario = await prisma.funcionario.create({
        data: {
          nome, cpf, email, senhaHash, matricula, cargo, estabelecimento,
          dataAdmissao: new Date(dataAdmissao),
          salario: Number(salario),
          papel: papel as Papel,
          telefone,
          endereco
        }
      });

      const { senhaHash: _, ...funcionarioSemSenha } = novoFuncionario;
      return res.status(201).json(funcionarioSemSenha);

    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      return res.status(500).json({ error: "Erro interno.", detalhes: error.message });
    }
  }
};