import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Inicializando o Prisma direto no controller para contornar problemas de importação
const prismaClient = new PrismaClient();

export const funcionarioController = {
  
  criar: async (req: Request, res: Response) => {
    try {
      const { 
        nome, cpf, email, password, telefone, endereco, 
        matricula, cargo, estabelecimento, dataAdmissao, 
        salario, papel 
      } = req.body;

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(password, salt);

      // Criação no banco
      const novoFuncionario = await prismaClient.funcionario.create({
        data: {
          nome,
          cpf,
          email,
          senhaHash,
          telefone,
          endereco,
          matricula,
          cargo,
          estabelecimento,
          dataAdmissao: new Date(dataAdmissao),
          salario: parseFloat(salario),
          papel
        }
      });

      return res.status(201).json({ 
        message: "Funcionário cadastrado com sucesso!",
        id: novoFuncionario.id 
      });

    } catch (error: any) {
      console.error("Erro detalhado ao criar funcionário:", error);
      return res.status(500).json({ 
        error: "Erro ao processar cadastro de funcionário.",
        detalhes: error.message 
      });
    }
  },

  listarTodos: async (req: Request, res: Response) => {
    try {
      const funcionarios = await prismaClient.funcionario.findMany();
      return res.json(funcionarios);
    } catch (error: any) {
      return res.status(500).json({ 
        error: "Erro ao buscar funcionários.",
        detalhes: error.message 
      });
    }
  }
};