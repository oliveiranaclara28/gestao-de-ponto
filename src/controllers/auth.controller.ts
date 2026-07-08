import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // 1. Verificar se o funcionário existe
      const funcionario = await prisma.funcionario.findUnique({ where: { email } });
      if (!funcionario) return res.status(401).json({ error: 'Email ou senha inválidos' });

      // 2. Verificar a senha (usando bcrypt para comparar o hash)
      const isPasswordValid = await bcrypt.compare(password, funcionario.senhaHash);
      if (!isPasswordValid) return res.status(401).json({ error: 'Email ou senha inválidos' });

      // 3. Gerar o token JWT (substitua 'sua_chave_secreta' por algo forte depois)
      const token = jwt.sign({ id: funcionario.id }, 'secret_key_123', { expiresIn: '1d' });

      return res.json({ funcionario: { id: funcionario.id, nome: funcionario.nome }, token });
    } catch (error) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }
  }
};