// Instância central do logger -- todo o resto do projeto importa
// daqui, em vez de usar console.log/console.error diretamente.

import pino from 'pino';
import { env } from './env';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV === 'production'
      ? undefined // produção: JSON puro, sem formatação (mais rápido)
      : {
          target: 'pino-pretty', // desenvolvimento: legível no terminal
          options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
        },
});