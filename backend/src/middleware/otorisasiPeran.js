// Membatasi akses endpoint berdasarkan peran. Contoh: otorisasiPeran('admin')
import { GalatAplikasi } from '../utilitas/responsStandar.js';

export const otorisasiPeran = (...peranDiizinkan) => (req, _res, lanjut) => {
  if (!req.pengguna || !peranDiizinkan.includes(req.pengguna.peran)) {
    return lanjut(new GalatAplikasi('Anda tidak berhak mengakses fitur ini', 403));
  }
  return lanjut();
};
