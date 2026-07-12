// Middleware compartilhado: permite acesso se a pessoa está pedindo
// os PRÓPRIOS dados (o :id da URL bate com o id de quem está logado),
// OU se o papel dela está entre os que podem ver dados de qualquer um
// (ex: um Gestor vendo o ponto de um subordinado).

import { Request, Response, NextFunction } from "express";
import { Papel } from "../generated/prisma/enums";

export function proprioOuPapel(papeisElevados: Papel[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.user;
    if (!usuario) {
      return res.status(401).json({ error: "Não autenticado." });
    }

    const ehProprio = req.params.id === usuario.id;
    const temPapelElevado = papeisElevados.includes(usuario.papel);

    if (!ehProprio && !temPapelElevado) {
      return res
        .status(403)
        .json({ error: "Você só pode acessar seus próprios dados." });
    }

    next();
  };
}

// Variante para rotas onde o ID vem no CORPO da requisição, não na URL
// (ex: registrar um ponto -- ninguém bate o ponto de outra pessoa).
export function soParaSiNoBody(campo: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const usuario = req.user;
    if (!usuario) {
      return res.status(401).json({ error: "Não autenticado." });
    }

    if (req.body[campo] !== usuario.id) {
      return res
        .status(403)
        .json({ error: "Você só pode registrar o próprio ponto." });
    }

    next();
  };
}
