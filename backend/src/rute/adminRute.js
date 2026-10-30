// Rute /api/admin — hanya untuk peran admin. CRUD generik lewat parameter :sumber.
import { Router } from 'express';
import * as kontroler from '../kontroler/adminKontroler.js';
import { autentikasi } from '../middleware/autentikasi.js';
import { otorisasiPeran } from '../middleware/otorisasiPeran.js';
import { unggahGambar } from '../middleware/unggahFile.js';
import { validasiRequest } from '../middleware/validasiRequest.js';
import { SKEMA_ADMIN } from '../validasi/skemaAdmin.js';

const rute = Router();
rute.use(autentikasi, otorisasiPeran('admin'));

// Rute statis harus didaftarkan SEBELUM rute dinamis /:sumber.
rute.post('/unggah', unggahGambar, kontroler.unggah);

const skemaDariSumber = (req) => SKEMA_ADMIN[req.params.sumber];

rute.get('/:sumber', kontroler.pastikanSumberValid, kontroler.daftar);
rute.post('/:sumber', kontroler.pastikanSumberValid, validasiRequest(skemaDariSumber), kontroler.tambah);
rute.put('/:sumber/:kunci', kontroler.pastikanSumberValid, validasiRequest(skemaDariSumber), kontroler.ubah);
rute.delete('/:sumber/:kunci', kontroler.pastikanSumberValid, kontroler.hapus);

export default rute;
