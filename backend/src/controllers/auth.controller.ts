import { Request, Response } from 'express';
import { prisma } from '../config/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authController = {
  login: async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    const funcionario = await prisma.funcionario.findUnique({ where: { email } });

    if (!funcionario || !(await bcrypt.compare(senha, funcionario.senhaHash))) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }

    const token = jwt.sign({ id: funcionario.id, papel: funcionario.papel }, process.env.JWT_SECRET || 'secreta', { expiresIn: '8h' });
    return res.json({ token });
  },

  logout: (req: Request, res: Response) => {
    // Como JWT é stateless, o "Logout" é apenas o cliente descartar o token.
    return res.json({ message: "Logout realizado com sucesso. Limpe o token no seu front-end." });
  }
};