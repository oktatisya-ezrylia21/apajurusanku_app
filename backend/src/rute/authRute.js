// Rute /api/auth — login tiga peran. Dibatasi lajunya untuk mencegah tebak-tebakan.
import { Router } from 'express';
import * as kontroler from '../kontroler/authKontroler.js';
import { pembatasLogin } from '../middleware/pembatasLaju.js';
import { validasiRequest } from '../middleware/validasiRequest.js';
import { SKEMA_MASUK_ADMIN, SKEMA_MASUK_GURU, SKEMA_MASUK_SISWA } from '../validasi/skemaAuth.js';

const rute = Router();
rute.use(pembatasLogin);

rute.post('/siswa', validasiRequest(SKEMA_MASUK_SISWA), kontroler.masukSiswa);
rute.post('/guru', validasiRequest(SKEMA_MASUK_GURU), kontroler.masukGuru);
rute.post('/admin', validasiRequest(SKEMA_MASUK_ADMIN), kontroler.masukAdmin);

export default rute;
