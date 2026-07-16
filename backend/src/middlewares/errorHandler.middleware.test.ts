import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errorHandler.middleware';
import { AppError } from '../shared/errors/AppError';

describe('ErrorHandler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    // Silencia o console.error durante os testes para não poluir o terminal
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve retornar o status e mensagem definidos no AppError', () => {
    const error = new AppError('Usuário não encontrado', 404);
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
  });

  it('deve retornar 500 e mensagem genérica para erros desconhecidos', () => {
    const error = new Error('Falha crítica no banco');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro interno no servidor.' });
    expect(console.error).toHaveBeenCalled(); // Verifica se logou o erro
  });
});