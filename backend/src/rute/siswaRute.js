// Rute /api/siswa — hanya untuk peran siswa.
import { Router } from 'express';
import * as kontroler from '../kontroler/siswaKontroler.js';
import { autentikasi } from '../middleware/autentikasi.js';
import { otorisasiPeran } from '../middleware/otorisasiPeran.js';

const rute = Router();
rute.use(autentikasi, otorisasiPeran('siswa'));

rute.get('/hasil-terakhir', kontroler.ambilHasilTerakhir);
rute.get('/sekolah', kontroler.ambilSekolahRekomendasi);

export default rute;
