// Controller: só orquestra a requisição -- recebe req, chama o Service,
// devolve res. Nenhuma regra de negócio mora aqui.

import { Request, Response } from "express";
import { funcionariosService } from "./funcionarios.service";

export const funcionariosController = {
  criar: async (req: Request, res: Response) => {
    try {
      const resultado = await funcionariosService.criar(req.body);
      return res.status(201).json(resultado);
    } catch (erro) {
      if (erro instanceof Error) {
        return res.status(400).json({ error: erro.message });
      }
      console.error(erro);
      return res
        .status(500)
        .json({ error: "Erro interno ao criar funcionário." });
    }
  },

  listar: async (req: Request, res: Response) => {
    const funcionarios = await funcionariosService.listarTodos();
    return res.json(funcionarios);
  },

  buscarPorId: async (req: Request, res: Response) => {
    try {
      const funcionario = await funcionariosService.buscarPorId(
        req.params.id as string,
      );
      return res.json(funcionario);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  listarHistorico: async (req: Request, res: Response) => {
    try {
      const historico = await funcionariosService.listarHistorico(
        req.params.id as string,
      );
      return res.json(historico);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  atualizar: async (req: Request, res: Response) => {
    try {
      const funcionario = await funcionariosService.atualizar(
        req.params.id as string,
        req.body,
      );
      return res.json(funcionario);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  inativar: async (req: Request, res: Response) => {
    try {
      await funcionariosService.inativar(req.params.id as string);
      return res.json({ mensagem: "Funcionário inativado com sucesso." });
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  uploadFoto: async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      // Caminho público, servido pelo express.static (configurado no server.ts).
      const fotoUrl = `/uploads/${req.file.filename}`;

      const foto = await funcionariosService.adicionarFoto(
        req.params.id as string,
        fotoUrl,
      );

      return res.status(201).json(foto);
    } catch (erro) {
      return res.status(400).json({ error: (erro as Error).message });
    }
  },

  listarFotos: async (req: Request, res: Response) => {
    const fotos = await funcionariosService.listarFotos(
      req.params.id as string,
    );

    return res.json(fotos);
  },

  removerFoto: async (req: Request, res: Response) => {
    try {
      await funcionariosService.removerFoto(req.params.fotoId as string);
      return res.json({ mensagem: "Foto removida com sucesso." });
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },
};
