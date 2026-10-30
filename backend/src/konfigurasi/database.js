// Membuka koneksi SQLite (better-sqlite3). Koneksi dibuat sekali lalu dipakai bersama (singleton).
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { env } from './env.js';

// Pastikan folder penyimpanan file database ada (kecuali database di memori untuk tes).
if (env.jalurBasisData !== ':memory:') {
  fs.mkdirSync(path.dirname(env.jalurBasisData), { recursive: true });
}

export const db = new Database(env.jalurBasisData);

// WAL membuat baca/tulis lebih lancar; foreign_keys memastikan relasi antar tabel dijaga SQLite.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
