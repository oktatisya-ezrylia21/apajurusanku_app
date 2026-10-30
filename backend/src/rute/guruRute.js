// Rute /api/guru — hanya untuk peran guru.
import { Router } from 'express';
import * as kontroler from '../kontroler/guruKontroler.js';
import { autentikasi } from '../middleware/autentikasi.js';
import { otorisasiPeran } from '../middleware/otorisasiPeran.js';

const rute = Router();
rute.use(autentikasi, otorisasiPeran('guru'));

rute.get('/dashboard', kontroler.ambilDashboard);
rute.get('/siswa/:id', kontroler.ambilDetailSiswa);

export default rute;
