import { Request, Response } from 'express';
import { funcionariosController } from './funcionarios.controller';
import { funcionariosService } from './funcionarios.service';

// Mock do Service para isolar o Controller
jest.mock('./funcionarios.service');

describe('FuncionariosController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('deve retornar 201 quando a criação for bem sucedida', async () => {
      mockRequest.body = { nome: 'João' };
      (funcionariosService.criar as jest.Mock).mockResolvedValue({ id: '1' });

      await funcionariosController.criar(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: '1' });
    });

    it('deve retornar 400 se ocorrer um erro no service', async () => {
      mockRequest.body = { nome: 'João' };
      (funcionariosService.criar as jest.Mock).mockRejectedValue(new Error('Erro de validação'));

      await funcionariosController.criar(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro de validação' });
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar 200 e os dados do funcionário', async () => {
      mockRequest.params = { id: 'uuid-valido' };
      (funcionariosService.buscarPorId as jest.Mock).mockResolvedValue({ nome: 'João' });

      await funcionariosController.buscarPorId(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({ nome: 'João' });
    });
  });
});