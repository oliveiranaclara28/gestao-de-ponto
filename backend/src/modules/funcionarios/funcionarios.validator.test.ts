import { Request, Response, NextFunction } from 'express';
import { funcionariosValidator } from './funcionarios.validator';

describe('FuncionariosValidator', () => {
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
  });

  describe('validarCriar', () => {
    it('deve passar quando todos os dados obrigatórios são válidos', () => {
      mockRequest.body = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@teste.com',
        cargo: 'Desenvolvedor',
        estabelecimento: 'Matriz',
        dataAdmissao: '2026-01-01',
        salario: 5000,
      };

      funcionariosValidator.validarCriar(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve retornar 400 se o email for inválido', () => {
      mockRequest.body = { email: 'email-invalido' };
      
      funcionariosValidator.validarCriar(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validarAtualizar', () => {
    it('deve permitir a atualização de apenas um campo (parcial)', () => {
      mockRequest.body = { cargo: 'Senior Developer' };

      funcionariosValidator.validarAtualizar(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve retornar 400 se o salario enviado for negativo', () => {
      mockRequest.body = { salario: -100 };

      funcionariosValidator.validarAtualizar(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validarIdParam', () => {
    it('deve passar com um UUID válido', () => {
      mockRequest.params = { id: '550e8400-e29b-41d4-a716-446655440000' };
      
      funcionariosValidator.validarIdParam(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve retornar 400 se o id não for um UUID', () => {
      mockRequest.params = { id: 'abc-123' };
      
      funcionariosValidator.validarIdParam(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});