// Controller: só orquestra a requisição -- recebe req, chama o Service, devolve res.

import { Request, Response } from 'express';
import { relatoriosService } from './relatorios.service';
import { logger } from '../../config/logger';

// "Funcionário não encontrado" é o único erro esperado que o Service
// lança de propósito -- qualquer outro erro é inesperado, e merece
// virar 500 com log, em vez de um 404 enganoso.
function tratarErroDeRelatorio(erro: unknown, res: Response) {
  const mensagem = (erro as Error).message;

  if (mensagem === 'Funcionário não encontrado.') {
    return res.status(404).json({ error: mensagem });
  }

  logger.error({ erro }, 'Erro ao gerar relatório');
  return res.status(500).json({ error: 'Erro ao gerar relatório.' });
}

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
      return tratarErroDeRelatorio(erro, res);
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
      return tratarErroDeRelatorio(erro, res);
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
      return tratarErroDeRelatorio(erro, res);
    }
  },
};