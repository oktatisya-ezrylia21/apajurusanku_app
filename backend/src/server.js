// Titik masuk: menyiapkan database lalu menyalakan server HTTP.
import { aplikasi } from './aplikasi.js';
import { env } from './konfigurasi/env.js';
import { isiBenih } from './basisdata/benih/jalankanBenih.js';
import { sinkronGambarSoal } from './basisdata/benih/sinkronGambarSoal.js';
import { jalankanMigrasi } from './basisdata/migrasi/jalankanMigrasi.js';
import { logger } from './utilitas/logger.js';

// 1) Pastikan tabel ada. 2) Isi data awal pada tabel yang masih kosong (bila diizinkan di .env).
jalankanMigrasi();
if (env.isiBenihOtomatis) isiBenih(); // (isiBenih sudah memanggil sinkronGambarSoal)
else sinkronGambarSoal(); // memperbaiki jalur gambar soal lama tanpa menghapus data

aplikasi.listen(env.port, () => {
  logger.info(`apajurusanku berjalan di http://localhost:${env.port} (${env.lingkungan})`);
});
