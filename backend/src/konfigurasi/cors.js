// Aturan CORS: hanya asal (origin) yang terdaftar di .env yang boleh memanggil API dari browser.
import { env } from './env.js';

export const opsiCors = {
  origin(asal, panggilBalik) {
    // Permintaan tanpa header Origin (curl, server-ke-server, satu domain) selalu diizinkan.
    if (!asal || env.asalDiizinkan.includes(asal)) return panggilBalik(null, true);
    return panggilBalik(new Error('Asal tidak diizinkan oleh CORS'));
  },
};
