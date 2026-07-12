// Controller: só orquestra a requisição -- recebe req, chama o Service, devolve res.

import { Request, Response } from "express";
import { pontosService } from "./pontos.service";
import { logger } from "../../config/logger";

export const pontosController = {
  registrar: async (req: Request, res: Response) => {
    try {
      const { funcionarioId, tipo, fotoUrl } = req.body;
      const ponto = await pontosService.registrar(funcionarioId, tipo, fotoUrl);
      return res.status(201).json(ponto);
    } catch (erro) {
      logger.error({ erro }, "Erro ao registrar ponto");
      return res.status(400).json({ error: (erro as Error).message });
    }
  },

  listarTodos: async (_req: Request, res: Response) => {
    try {
      const pontos = await pontosService.listarTodos();
      return res.json(pontos);
    } catch (erro) {
      logger.error({ erro }, "Erro ao listar pontos");
      return res.status(500).json({ error: "Erro ao buscar pontos." });
    }
  },

  buscarPorFuncionario: async (req: Request, res: Response) => {
    try {
      const pontos = await pontosService.listarPorFuncionario(
        req.params.id as string,
      );
      return res.json(pontos);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  calcularHoras: async (req: Request, res: Response) => {
    try {
      const resultado = await pontosService.calcularHoras(
        req.params.id as string,
      );
      return res.json(resultado);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  calcularBancoDeHoras: async (req: Request, res: Response) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const resultado = await pontosService.calcularBancoDeHoras(
        req.params.id as string,
        new Date(dataInicio as string),
        new Date(dataFim as string),
      );
      return res.json(resultado);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },
};