// Service: contém a regra de negócio do módulo. Este módulo não tem
// Repository próprio -- ele só combina dados que já existem nos
// módulos funcionarios e pontos, por isso fala com os Services deles.

import { funcionariosService } from '../funcionarios/funcionarios.service';
import { pontosService } from '../pontos/pontos.service';
import { JORNADA_PADRAO } from '../../shared/jornadaTrabalho';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

// Regra temporária: dia útil = segunda a sexta. Quando a feature de
// "Escala de trabalho" (já registrada no backlog) for implementada,
// essa função é a única coisa que precisa ser trocada -- ela vira
// uma consulta na escala real do funcionário, em vez desse cálculo fixo.
function ehDiaUtil(data: Date): boolean {
  const diaDaSemana = data.getUTCDay(); // 0 = domingo, 6 = sábado
  return diaDaSemana >= 1 && diaDaSemana <= 5;
}

function diferencaEmMinutos(inicio: Date, fim: Date): number {
  return Math.round((fim.getTime() - inicio.getTime()) / 60000);
}

function estaAtrasado(dataHoraEntrada: Date): boolean {
  const limiteEntrada = new Date(dataHoraEntrada);
  limiteEntrada.setHours(JORNADA_PADRAO.horaEntradaEsperada, JORNADA_PADRAO.toleranciaMinutos, 0, 0);
  return dataHoraEntrada > limiteEntrada;
}

export const relatoriosService = {
  gerarRelatorioFuncionario: async (funcionarioId: string, dataInicio: Date, dataFim: Date) => {
    const funcionario = await funcionariosService.buscarPorId(funcionarioId);
    const pontos = await pontosService.listarNoPeriodo(funcionarioId, dataInicio, dataFim);

    // Agrupa os pontos existentes por dia, igual já fizemos no
    // cálculo de banco de horas.
    const pontosPorDia = new Map<string, typeof pontos>();
    for (const ponto of pontos) {
      const chave = ponto.dataHora.toISOString().slice(0, 10);
      const doDia = pontosPorDia.get(chave) ?? [];
      doDia.push(ponto);
      pontosPorDia.set(chave, doDia);
    }

    const dias: Array<{
      dia: string;
      diaUtil: boolean;
      status: 'TRABALHADO' | 'INCOMPLETO' | 'FALTA' | 'FOLGA';
      atrasado: boolean;
      minutosTrabalhados: number | null;
      saldoMinutos: number | null;
    }> = [];

    let totalFaltas = 0;
    let totalAtrasos = 0;
    let bancoDeHorasMinutos = 0;

    // Percorre CADA dia do período (não só os dias com ponto registrado)
    // -- é assim que conseguimos detectar falta: um dia útil sem
    // nenhum ponto registrado.
    const cursor = new Date(dataInicio);
    cursor.setUTCHours(0, 0, 0, 0);
    const fim = new Date(dataFim);
    fim.setUTCHours(0, 0, 0, 0);

    while (cursor <= fim) {
      const chave = cursor.toISOString().slice(0, 10);
      const diaUtil = ehDiaUtil(cursor);
      const pontosDoDia = pontosPorDia.get(chave);

      if (!diaUtil) {
        dias.push({ dia: chave, diaUtil, status: 'FOLGA', atrasado: false, minutosTrabalhados: null, saldoMinutos: null });
      } else if (!pontosDoDia) {
        totalFaltas++;
        dias.push({ dia: chave, diaUtil, status: 'FALTA', atrasado: false, minutosTrabalhados: null, saldoMinutos: null });
      } else {
        const entrada = pontosDoDia.find((p) => p.tipo === 'ENTRADA');
        const saidaAlmoco = pontosDoDia.find((p) => p.tipo === 'SAIDA_ALMOCO');
        const retorno = pontosDoDia.find((p) => p.tipo === 'RETORNO');
        const saida = pontosDoDia.find((p) => p.tipo === 'SAIDA');
        const atrasado = !!(entrada && estaAtrasado(entrada.dataHora));

        if (atrasado) totalAtrasos++;

        if (entrada && saidaAlmoco && retorno && saida) {
          const minutosTrabalhados =
            diferencaEmMinutos(entrada.dataHora, saidaAlmoco.dataHora) +
            diferencaEmMinutos(retorno.dataHora, saida.dataHora);
          const saldoMinutos = minutosTrabalhados - JORNADA_PADRAO.cargaHorariaDiariaMinutos;
          bancoDeHorasMinutos += saldoMinutos;

          dias.push({ dia: chave, diaUtil, status: 'TRABALHADO', atrasado, minutosTrabalhados, saldoMinutos });
        } else {
          dias.push({ dia: chave, diaUtil, status: 'INCOMPLETO', atrasado, minutosTrabalhados: null, saldoMinutos: null });
        }
      }

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return {
      funcionario: { id: funcionario.id, nome: funcionario.nome, matricula: funcionario.matricula },
      periodo: { dataInicio, dataFim },
      totalFaltas,
      totalAtrasos,
      bancoDeHorasMinutos,
      dias,
    };
  },

  // Gera o PDF em memória e devolve como Buffer -- o Controller decide
  // o que fazer com esses bytes (nesse caso, enviar como download).
  gerarRelatorioFuncionarioPdf: async (funcionarioId: string, dataInicio: Date, dataFim: Date) => {
    const relatorio = await relatoriosService.gerarRelatorioFuncionario(funcionarioId, dataInicio, dataFim);

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(16).text(`Relatório de Ponto — ${relatorio.funcionario.nome}`, { align: 'center' });
      doc.fontSize(10).text(`Matrícula: ${relatorio.funcionario.matricula}`, { align: 'center' });
      doc.moveDown();

      doc.fontSize(11);
      doc.text(`Total de faltas: ${relatorio.totalFaltas}`);
      doc.text(`Total de atrasos: ${relatorio.totalAtrasos}`);
      doc.text(`Banco de horas: ${relatorio.bancoDeHorasMinutos} minutos`);
      doc.moveDown();

      doc.fontSize(12).text('Detalhamento por dia', { underline: true });
      doc.moveDown(0.5);

      for (const dia of relatorio.dias) {
        const linha = `${dia.dia}  |  ${dia.status}${dia.atrasado ? ' (atrasado)' : ''}${
          dia.minutosTrabalhados !== null ? `  |  ${dia.minutosTrabalhados} min trabalhados` : ''
        }`;
        doc.fontSize(9).text(linha);
      }

      doc.end();
    });
  },

  gerarRelatorioFuncionarioExcel: async (funcionarioId: string, dataInicio: Date, dataFim: Date) => {
    const relatorio = await relatoriosService.gerarRelatorioFuncionario(funcionarioId, dataInicio, dataFim);

    const workbook = new ExcelJS.Workbook();
    const planilha = workbook.addWorksheet('Relatório de Ponto');

    planilha.columns = [
      { header: 'Dia', key: 'dia', width: 14 },
      { header: 'Dia útil', key: 'diaUtil', width: 10 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Atrasado', key: 'atrasado', width: 10 },
      { header: 'Minutos trabalhados', key: 'minutosTrabalhados', width: 18 },
      { header: 'Saldo (min)', key: 'saldoMinutos', width: 12 },
    ];

    // Deixa o cabeçalho em negrito -- só um toque de formatação
    // pra não entregar uma planilha totalmente crua.
    planilha.getRow(1).font = { bold: true };

    for (const dia of relatorio.dias) {
      planilha.addRow({
        dia: dia.dia,
        diaUtil: dia.diaUtil ? 'Sim' : 'Não',
        status: dia.status,
        atrasado: dia.atrasado ? 'Sim' : 'Não',
        minutosTrabalhados: dia.minutosTrabalhados ?? '-',
        saldoMinutos: dia.saldoMinutos ?? '-',
      });
    }

    planilha.addRow({});
    planilha.addRow({ dia: 'Total de faltas', diaUtil: relatorio.totalFaltas });
    planilha.addRow({ dia: 'Total de atrasos', diaUtil: relatorio.totalAtrasos });
    planilha.addRow({ dia: 'Banco de horas (min)', diaUtil: relatorio.bancoDeHorasMinutos });

    // writeBuffer devolve um ArrayBuffer -- convertemos pra Buffer do
    // Node, que é o formato que o Express espera pra enviar como arquivo.
    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  },

};