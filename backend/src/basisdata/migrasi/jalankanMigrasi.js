// Menjalankan skema tabel. Dipanggil otomatis saat server menyala,
// atau manual lewat: npm run migrasi
import { pathToFileURL } from 'node:url';
import { db } from '../../konfigurasi/database.js';
import { logger } from '../../utilitas/logger.js';
import { SKEMA_SQL } from './001_skema.js';

/** Membuat semua tabel bila belum ada. */
export function jalankanMigrasi() {
  db.exec(SKEMA_SQL);
  logger.info('Migrasi selesai: semua tabel siap.');
}

// Bila file ini dijalankan langsung (bukan di-import), langsung eksekusi.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  jalankanMigrasi();
}
