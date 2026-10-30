// Utilitas keamanan: hash kata sandi (bcrypt) dan token login (JWT).
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../konfigurasi/env.js';

/** Mengubah kata sandi asli menjadi hash satu arah yang aman disimpan di database. */
export function hashKataSandi(kataSandi) {
  return bcrypt.hashSync(kataSandi, 10);
}

/** Mencocokkan kata sandi yang diketik dengan hash di database. */
export function cocokkanKataSandi(kataSandi, hash) {
  return bcrypt.compareSync(kataSandi, hash);
}

/** Membuat token login berisi id, peran (siswa/guru/admin), dan nama pengguna. */
export function buatToken({ id, peran, nama }) {
  return jwt.sign({ id, peran, nama }, env.rahasiaJwt, { expiresIn: env.masaBerlakuToken });
}

/** Memeriksa token. Melempar galat bila token palsu atau kedaluwarsa. */
export function verifikasiToken(token) {
  return jwt.verify(token, env.rahasiaJwt);
}
