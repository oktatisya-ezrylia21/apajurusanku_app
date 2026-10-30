// Konfigurasi aplikasi Express (middleware + rute). Dipisah dari server.js agar mudah diuji
// tanpa membuka port jaringan.
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import { opsiCors } from './konfigurasi/cors.js';
import { env } from './konfigurasi/env.js';
import { penangananError, rutaTidakDitemukan } from './middleware/penangananError.js';
import { pembatasUmum } from './middleware/pembatasLaju.js';
import adminRute from './rute/adminRute.js';
import authRute from './rute/authRute.js';
import guruRute from './rute/guruRute.js';
import siswaRute from './rute/siswaRute.js';
import tesRute from './rute/tesRute.js';

export const aplikasi = express();

// Di belakang Nginx, IP asli pengunjung dibaca dari header X-Forwarded-For (perlu untuk rate limit).
aplikasi.set('trust proxy', 1);
aplikasi.disable('x-powered-by');

aplikasi.use(cors(opsiCors));
aplikasi.use(express.json({ limit: '200kb' }));

// ---- API ----
aplikasi.get('/api/kesehatan', (_req, res) => res.json({ sukses: true, pesan: 'apajurusanku aktif' }));
aplikasi.use('/api', pembatasUmum);
aplikasi.use('/api/auth', authRute);
aplikasi.use('/api/tes', tesRute);
aplikasi.use('/api/siswa', siswaRute);
aplikasi.use('/api/guru', guruRute);
aplikasi.use('/api/admin', adminRute);

// ---- File statis ----
// Gambar maskot hasil unggahan admin.
aplikasi.use('/unggahan', express.static(env.folderUnggahan));

// Frontend ikut disajikan agar cukup menjalankan satu server saat pengembangan.
// Di produksi, Nginx boleh menyajikannya langsung (SAJIKAN_FRONTEND=false).
if (env.sajikanFrontend) {
  aplikasi.use('/src', express.static(path.join(env.folderFrontend, 'src')));
  aplikasi.use(express.static(path.join(env.folderFrontend, 'public')));
}

aplikasi.use(rutaTidakDitemukan);
aplikasi.use(penangananError);
