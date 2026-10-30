// Unggah gambar maskot soal memakai multer. File disimpan di backend/unggahan/ dengan nama acak.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { env } from '../konfigurasi/env.js';
import { GalatAplikasi } from '../utilitas/responsStandar.js';

fs.mkdirSync(env.folderUnggahan, { recursive: true });

const EKSTENSI_BERDASAR_MIME = {
  'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/svg+xml': '.svg',
};

const penyimpanan = multer.diskStorage({
  destination: (_req, _berkas, panggilBalik) => panggilBalik(null, env.folderUnggahan),
  // Nama acak mencegah tabrakan nama dan manipulasi nama file dari pengguna.
  filename: (_req, berkas, panggilBalik) => {
    panggilBalik(null, `${crypto.randomBytes(12).toString('hex')}${EKSTENSI_BERDASAR_MIME[berkas.mimetype]}`);
  },
});

export const unggahGambar = multer({
  storage: penyimpanan,
  limits: { fileSize: 1024 * 1024 }, // maksimal 1 MB
  fileFilter: (_req, berkas, panggilBalik) => {
    if (EKSTENSI_BERDASAR_MIME[berkas.mimetype]) return panggilBalik(null, true);
    return panggilBalik(new GalatAplikasi('Format gambar harus PNG, JPG, WEBP, atau SVG', 415));
  },
}).single('gambar');
