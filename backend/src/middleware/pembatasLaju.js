// Pembatas laju (rate limit) untuk mencegah tebak-tebakan NISN/kata sandi dan penyalahgunaan API.
import rateLimit from 'express-rate-limit';
import { env } from '../konfigurasi/env.js';

// Di mode test, batas dilonggarkan agar tes otomatis tidak terblokir.
const pengali = env.jalurBasisData === ':memory:' ? 1000 : 1;

/** Batas umum untuk seluruh /api: 300 permintaan per 15 menit per IP. */
export const pembatasUmum = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 300 * pengali, standardHeaders: true, legacyHeaders: false,
  message: { sukses: false, pesan: 'Terlalu banyak permintaan, coba lagi nanti', rincian: null },
});

/** Batas ketat untuk endpoint masuk/cek NISN: 30 percobaan per 15 menit per IP. */
export const pembatasLogin = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 30 * pengali, standardHeaders: true, legacyHeaders: false,
  message: { sukses: false, pesan: 'Terlalu banyak percobaan masuk, coba lagi 15 menit lagi', rincian: null },
});
