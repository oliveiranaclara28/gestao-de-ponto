// Erro customizado que já carrega o status HTTP correto.
// Serviços lançam isso quando sabem exatamente o que deu errado
// (ex: "não encontrado" = 404, "sem permissão" = 403), em vez de
// um Error genérico que sempre vira 500 ou precisa de tradução manual
// no Controller.

export class AppError extends Error {
    public readonly status: number;
  
    constructor(message: string, status: number = 400) {
      super(message);
      this.status = status;
      this.name = 'AppError';
    }
  }