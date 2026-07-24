import { Request, Response, NextFunction } from 'express';
import { pontosValidator } from './pontos.validator';
import { TipoPonto } from '../../generated/prisma/enums';

describe('PontosValidator', () => {
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

  describe('validarRegistrar', () => {
    it('deve passar quando os dados são válidos', () => {
      mockRequest.body = {
        funcionarioId: '550e8400-e29b-41d4-a716-446655440000',
        tipo: TipoPonto.ENTRADA,
        fotoUrl: 'http://foto.com/1.jpg',
      };

      pontosValidator.validarRegistrar(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve retornar 400 quando os dados são inválidos', () => {
      mockRequest.body = { funcionarioId: 'invalido' }; // faltam campos e ID inválido

      pontosValidator.validarRegistrar(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe('validarIdParam', () => {
    it('deve passar quando o id é um UUID válido', () => {
      mockRequest.params = { id: '550e8400-e29b-41d4-a716-446655440000' };

      pontosValidator.validarIdParam(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve retornar 400 quando o id não é um UUID', () => {
      mockRequest.params = { id: '123' };

      pontosValidator.validarIdParam(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validarPeriodo', () => {
    it('deve passar quando as datas de query são válidas', () => {
      mockRequest.query = { dataInicio: '2026-01-01', dataFim: '2026-01-02' };

      pontosValidator.validarPeriodo(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('deve retornar 400 quando as datas são inválidas', () => {
      mockRequest.query = { dataInicio: 'invalida' };

      pontosValidator.validarPeriodo(mockRequest as Request, mockResponse as Response, nextFunction);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});