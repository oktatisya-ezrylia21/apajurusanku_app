// Membaca variabel lingkungan (.env) dan mengubahnya menjadi objek konfigurasi tunggal.
// Semua file lain cukup mengimpor `env` dari sini, tidak perlu membaca process.env langsung.
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const direktoriIni = path.dirname(fileURLToPath(import.meta.url));
export const akarBackend = path.resolve(direktoriIni, '../..');

const RAHASIA_BAWAAN = 'rahasia-pengembangan-jangan-dipakai-di-produksi';

export const env = {
  lingkungan: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  jalurBasisData: process.env.DB_PATH ?? path.join(akarBackend, 'data', 'apajurusanku.sqlite'),
  rahasiaJwt: process.env.JWT_RAHASIA ?? RAHASIA_BAWAAN,
  masaBerlakuToken: process.env.JWT_MASA_BERLAKU ?? '8h',
  asalDiizinkan: (process.env.CORS_ASAL ?? 'http://localhost:3000').split(',').map((a) => a.trim()),
  sajikanFrontend: process.env.SAJIKAN_FRONTEND !== 'false',
  folderUnggahan: path.join(akarBackend, 'unggahan'),
  folderFrontend: path.resolve(akarBackend, '../frontend'),
  adminAwal: {
    username: process.env.ADMIN_USERNAME ?? 'admin',
    kataSandi: process.env.ADMIN_KATA_SANDI ?? 'admin12345',
  },
  isiBenihOtomatis: process.env.ISI_BENIH_OTOMATIS !== 'false',
};

// Pengaman: di produksi, rahasia JWT bawaan tidak boleh dipakai.
if (env.lingkungan === 'production') {
  const rahasiaLemah = env.rahasiaJwt === RAHASIA_BAWAAN
    || env.rahasiaJwt.startsWith('ganti-dengan')
    || env.rahasiaJwt.length < 32;
  if (rahasiaLemah) throw new Error('JWT_RAHASIA wajib diisi teks acak minimal 32 karakter di lingkungan produksi.');
  if (['adminnez', 'admin12345', 'ganti-kata-sandi-admin'].includes(env.adminAwal.kataSandi)) {
    throw new Error('ADMIN_KATA_SANDI masih nilai bawaan. Ganti dengan kata sandi yang kuat di lingkungan produksi.');
  }
}
