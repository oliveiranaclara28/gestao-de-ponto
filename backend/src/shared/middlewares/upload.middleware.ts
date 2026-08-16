// Middleware compartilhado de upload -- fica em shared/ porque,
// no futuro, outras partes do sistema também podem precisar subir
// arquivo (ex: fotoUrl do registro de Ponto).

import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../../../uploads'));
  },
  filename: (req, file, callback) => {
    // UUID + extensão original: evita colisão de nome e não expõe
    // o nome do arquivo que a pessoa enviou do computador dela.
    const nomeUnico = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    callback(null, nomeUnico);
  },
});

function filtroDeImagem(req: any, file: Express.Multer.File, callback: multer.FileFilterCallback) {
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
  if (!tiposPermitidos.includes(file.mimetype)) {
    return callback(new Error('Formato inválido. Use JPEG, PNG ou WebP.'));
  }
  callback(null, true);
}

export const uploadFoto = multer({
  storage,
  fileFilter: filtroDeImagem,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB -- suficiente pra uma foto de rosto
});