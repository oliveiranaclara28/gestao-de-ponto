import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  // Verifica se o token foi enviado no cabeçalho
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O formato comum é "Bearer <TOKEN>", então dividimos o texto
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Erro no formato do token.' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatado.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'chave-secreta-do-ponto-certo-2026';
    
    // Valida o token. Se estiver expirado ou adulterado, vai direto para o catch
    const decoded = jwt.verify(token, secret);
    
    // Salva os dados do usuário na resposta para uso dos próximos controllers
    res.locals.user = decoded;

    return next(); // Autorizado! Vai para a rota solicitada
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}