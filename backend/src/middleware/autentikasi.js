// Memeriksa token login di header "Authorization: Bearer <token>".
// Bila valid, data pengguna ({id, peran, nama}) disimpan di req.pengguna.
import { verifikasiToken } from '../utilitas/enkripsi.js';
import { GalatAplikasi } from '../utilitas/responsStandar.js';

export function autentikasi(req, _res, lanjut) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return lanjut(new GalatAplikasi('Silakan masuk terlebih dahulu', 401));

  try {
    req.pengguna = verifikasiToken(token);
    return lanjut();
  } catch {
    return lanjut(new GalatAplikasi('Sesi berakhir, silakan masuk kembali', 401));
  }
}
