// Validator: roda como middleware, ANTES do Controller. Se os dados
// estiverem no formato errado, a requisição nem chega a entrar na
// lógica de negócio -- devolve erro 400 direto aqui.

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// z.coerce.date() converte a string que chega no JSON (ex: "2026-01-15")
// para um objeto Date de verdade -- assim como fizemos com z.coerce.number()
// no env.ts, porque tudo que vem de fora chega como string/JSON puro.
const criarFuncionarioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  email: z.string().email('E-mail inválido'),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  estabelecimento: z.string().min(1, 'Estabelecimento é obrigatório'),
  dataAdmissao: z.coerce.date(),
  salario: z.number().positive('Salário deve ser maior que zero'),
  papel: z.enum(['ADMINISTRADOR', 'GESTOR', 'RH', 'FUNCIONARIO']).optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  gestorId: z.string().uuid().optional(),
});

// .partial() torna todos os campos acima opcionais -- na atualização,
// a pessoa pode mandar só o campo que quer mudar (ex: só o cargo).
const atualizarFuncionarioSchema = criarFuncionarioSchema.partial();

const idParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export const funcionariosValidator = {
  validarCriar: (req: Request, res: Response, next: NextFunction) => {
    const resultado = criarFuncionarioSchema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: resultado.error.flatten() });
    }
    req.body = resultado.data;
    next();
  },

  validarAtualizar: (req: Request, res: Response, next: NextFunction) => {
    const resultado = atualizarFuncionarioSchema.safeParse(req.body);
    if (!resultado.success) {
      return res.status(400).json({ error: 'Dados inválidos', detalhes: resultado.error.flatten() });
    }
    req.body = resultado.data;
    next();
  },

  // Valida o :id da URL -- resolve de vez o problema do
  // "req.params.id as string" que vimos no Controller.
  validarIdParam: (req: Request, res: Response, next: NextFunction) => {
    const resultado = idParamSchema.safeParse(req.params);
    if (!resultado.success) {
      return res.status(400).json({ error: 'ID inválido na URL' });
    }
    next();
  },
};