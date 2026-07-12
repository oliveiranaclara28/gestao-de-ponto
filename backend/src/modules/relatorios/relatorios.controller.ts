// Controller: só orquestra a requisição -- recebe req, chama o Service, devolve res.

import { Request, Response } from 'express';
import { relatoriosService } from './relatorios.service';

export const relatoriosController = {
  gerarRelatorioFuncionario: async (req: Request, res: Response) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const relatorio = await relatoriosService.gerarRelatorioFuncionario(
        req.params.id as string,
        new Date(dataInicio as string),
        new Date(dataFim as string)
      );
      return res.json(relatorio);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  gerarRelatorioFuncionarioPdf: async (req: Request, res: Response) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const pdfBuffer = await relatoriosService.gerarRelatorioFuncionarioPdf(
        req.params.id as string,
        new Date(dataInicio as string),
        new Date(dataFim as string)
      );

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio.pdf"');
      return res.send(pdfBuffer);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

  gerarRelatorioFuncionarioExcel: async (req: Request, res: Response) => {
    try {
      const { dataInicio, dataFim } = req.query;
      const excelBuffer = await relatoriosService.gerarRelatorioFuncionarioExcel(
        req.params.id as string,
        new Date(dataInicio as string),
        new Date(dataFim as string)
      );

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio.xlsx"');
      return res.send(excelBuffer);
    } catch (erro) {
      return res.status(404).json({ error: (erro as Error).message });
    }
  },

};