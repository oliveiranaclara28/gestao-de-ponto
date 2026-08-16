// Classe customizada para tratar erros padronizados vindos da API
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

// URL base da API do backend (pode vir de uma variável de ambiente ou usar localhost como fallback)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

interface FetchOptions extends RequestInit {
  body?: any;
}

// Função base de requisição
async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, ...customOptions } = options;

  const isFormData = body instanceof FormData;

  const defaultHeaders: HeadersInit = isFormData 
    ? { ...headers } // O navegador define o Content-Type correto com o boundary para FormData
    : {
        'Content-Type': 'application/json',
        ...headers,
      };

  const config: RequestInit = {
    ...customOptions,
    headers: defaultHeaders,
    // ESSENCIAL: Garante que os cookies httpOnly sejam enviados e salvos nas requisições
    credentials: 'include', 
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  // Se a resposta não for bem-sucedida (status 200-299)
  if (!response.ok) {
    let errorMessage = 'Ocorreu um erro inesperado na requisição.';
    
    try {
      const errorData = await response.json();
      // Tenta extrair a mensagem padrão enviada pelo backend (ex: AppError do backend)
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText}`;
    }

    throw new AppError(errorMessage, response.status);
  }

  // Se a resposta for 204 (No Content), retorna um objeto vazio
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Objeto helpers facilitadores para os métodos HTTP mais comuns
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: any, options?: FetchOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  delete: <T>(endpoint: string, options?: FetchOptions) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};