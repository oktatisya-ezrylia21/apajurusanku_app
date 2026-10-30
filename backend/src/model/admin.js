// Model akun admin. Tidak ada CRUD lewat API; akun dibuat oleh seeder dari file .env.
import { db } from '../konfigurasi/database.js';

export const modelAdmin = {
  cariByUsername: (username) => db.prepare('SELECT * FROM admin WHERE username = ?').get(username) ?? null,
};
