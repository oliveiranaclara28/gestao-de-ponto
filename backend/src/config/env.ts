import { z } from 'zod';
import dotenv from 'dotenv';

// Lê o arquivo .env e injeta as variáveis em process.env.
// Precisa rodar antes de qualquer outro código que use process.env.
dotenv.config();

// Define o "formato esperado" das variáveis de ambiente.
// Se uma variável não existir ou tiver o tipo errado, a aplicação
// vai falhar aqui, na inicialização — e não em algum lugar aleatório
// do código, horas depois, de forma confusa.
const envSchema = z.object({
  // z.coerce.number() converte a string do .env (ex: "3333") para number.
  // Variáveis de ambiente sempre chegam como texto, mesmo quando parecem número.
  PORT: z.coerce.number().default(3333),

  // z.enum garante que só aceitamos esses 3 valores exatos.
  // Evita erro de digitação silencioso, tipo "produciton" em vez de "production".
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // JWT_SECRET não tem valor padrão de propósito: se não existir no .env,
  // queremos que a aplicação pare imediatamente, porque sem isso a
  // autenticação toda fica insegura ou quebrada.
  JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
});

// safeParse não lança erro automaticamente (diferente do .parse()).
// Ele retorna um objeto { success: true/false }, permitindo tratar
// o erro do nosso jeito, com uma mensagem clara no console.
const resultadoValidacao = envSchema.safeParse(process.env);

if (!resultadoValidacao.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(resultadoValidacao.error.flatten().fieldErrors);

  // Encerra o processo do Node imediatamente (código 1 = erro).
  // Preferimos a aplicação nem subir, do que subir "quebrada".
  process.exit(1);
}

// Exportamos o objeto já validado e tipado.
// A partir daqui, o resto do código usa env.PORT, env.JWT_SECRET, etc,
// e o TypeScript já sabe que esses valores existem e têm o tipo certo
// (diferente de process.env.JWT_SECRET, que o TS trata como
// "string ou undefined", te obrigando a checar isso toda vez).
export const env = resultadoValidacao.data;