import swaggerJSDoc from 'swagger-jsdoc';

// Configuração base do Swagger. As descrições de cada endpoint
// não ficam aqui -- ficam como comentários JSDoc em cada arquivo
// de rotas (ver "apis" abaixo), perto do código que documentam.
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ponto Certo API',
      version: '1.0.0',
      description: 'API do sistema de ponto eletrônico Ponto Certo.',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Ambiente de desenvolvimento local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // Schemas reutilizáveis -- cada rota referencia estes objetos
      // via $ref em vez de repetir a mesma estrutura em todo endpoint.
      schemas: {
        Funcionario: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nome: { type: 'string', example: 'João Silva' },
            cpf: { type: 'string', example: '12345678901' },
            email: { type: 'string', format: 'email', example: 'joao@empresa.com' },
            telefone: { type: 'string', nullable: true },
            endereco: { type: 'string', nullable: true },
            matricula: { type: 'string', example: '2026001' },
            cargo: { type: 'string', example: 'Desenvolvedor' },
            estabelecimento: { type: 'string', example: 'Matriz' },
            dataAdmissao: { type: 'string', format: 'date-time' },
            salario: { type: 'number', example: 5000 },
            papel: {
              type: 'string',
              enum: ['ADMINISTRADOR', 'GESTOR', 'RH', 'FUNCIONARIO'],
            },
            status: { type: 'string', example: 'ATIVO' },
            gestorId: { type: 'string', format: 'uuid', nullable: true },
            criadoEm: { type: 'string', format: 'date-time' },
            atualizadoEm: { type: 'string', format: 'date-time' },
          },
        },
        CriarFuncionarioInput: {
          type: 'object',
          required: ['nome', 'cpf', 'email', 'cargo', 'estabelecimento', 'dataAdmissao', 'salario'],
          properties: {
            nome: { type: 'string' },
            cpf: { type: 'string', description: '11 dígitos, sem formatação' },
            email: { type: 'string', format: 'email' },
            cargo: { type: 'string' },
            estabelecimento: { type: 'string' },
            dataAdmissao: { type: 'string', format: 'date' },
            salario: { type: 'number', description: 'Deve ser maior que zero' },
            papel: {
              type: 'string',
              enum: ['ADMINISTRADOR', 'GESTOR', 'RH', 'FUNCIONARIO'],
              description: 'Opcional -- padrão definido pelo Service se omitido',
            },
            telefone: { type: 'string' },
            endereco: { type: 'string' },
            gestorId: { type: 'string', format: 'uuid' },
          },
        },
        AtualizarFuncionarioInput: {
          type: 'object',
          description: 'Todos os campos são opcionais -- envie só o que deseja alterar.',
          properties: {
            nome: { type: 'string' },
            cpf: { type: 'string' },
            email: { type: 'string', format: 'email' },
            cargo: { type: 'string' },
            estabelecimento: { type: 'string' },
            dataAdmissao: { type: 'string', format: 'date' },
            salario: { type: 'number' },
            papel: {
              type: 'string',
              enum: ['ADMINISTRADOR', 'GESTOR', 'RH', 'FUNCIONARIO'],
            },
            telefone: { type: 'string' },
            endereco: { type: 'string' },
            gestorId: { type: 'string', format: 'uuid' },
          },
        },
        Ponto: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            funcionarioId: { type: 'string', format: 'uuid' },
            tipo: {
              type: 'string',
              enum: ['ENTRADA', 'SAIDA_ALMOCO', 'RETORNO', 'SAIDA'],
            },
            dataHora: { type: 'string', format: 'date-time' },
            fotoUrl: { type: 'string' },
            status: {
              type: 'string',
              enum: ['PENDENTE', 'APROVADO', 'REJEITADO'],
            },
            criadoEm: { type: 'string', format: 'date-time' },
          },
        },
        RegistrarPontoInput: {
          type: 'object',
          required: ['funcionarioId', 'tipo', 'fotoUrl'],
          properties: {
            funcionarioId: { type: 'string', format: 'uuid' },
            tipo: {
              type: 'string',
              enum: ['ENTRADA', 'SAIDA_ALMOCO', 'RETORNO', 'SAIDA'],
            },
            fotoUrl: { type: 'string', description: 'URL/caminho da foto de auditoria do registro' },
          },
        },
        Aprovacao: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            pontoId: { type: 'string', format: 'uuid' },
            gestorId: { type: 'string', format: 'uuid' },
            status: {
              type: 'string',
              enum: ['APROVADO', 'REJEITADO'],
            },
            motivoRejeicao: { type: 'string', nullable: true },
            dataAprovacao: { type: 'string', format: 'date-time' },
          },
        },
        DecidirPontoInput: {
          type: 'object',
          required: ['gestorId'],
          properties: {
            gestorId: { type: 'string', format: 'uuid' },
            motivoRejeicao: { type: 'string', description: 'Opcional -- normalmente preenchido ao rejeitar' },
          },
        },
        ErroValidacao: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Dados inválidos' },
            detalhes: { type: 'object' },
          },
        },
      },
    },
    // Aplica a exigência de token JWT como padrão em todas as rotas.
    // Rotas públicas (como /auth/login) podem sobrescrever isso
    // com "security: []" no próprio comentário JSDoc da rota.
    security: [{ bearerAuth: [] }],
  },
  // Onde o swagger-jsdoc procura pelos comentários @swagger.
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);