// Kontroler autentikasi: menerima request yang sudah tervalidasi, memanggil layanan, mengirim respons.
import * as authLayanan from '../layanan/authLayanan.js';
import { kirimSukses } from '../utilitas/responsStandar.js';

export const masukSiswa = (req, res) => kirimSukses(res, authLayanan.masukSebagaiSiswa(req.dataValid), 'Berhasil masuk');

export const masukGuru = (req, res) => kirimSukses(res, authLayanan.masukSebagaiGuru(req.dataValid), 'Berhasil masuk');

export const masukAdmin = (req, res) => kirimSukses(res, authLayanan.masukSebagaiAdmin(req.dataValid), 'Berhasil masuk');