// Rute /api/tes — konten umum (publik), soal & pengiriman jawaban (siswa), detail jurusan (semua yang login).
import { Router } from 'express';
import * as kontroler from '../kontroler/tesKontroler.js';
import { autentikasi } from '../middleware/autentikasi.js';
import { otorisasiPeran } from '../middleware/otorisasiPeran.js';

const rute = Router();

rute.get('/konten', kontroler.ambilKonten);
rute.get('/soal', autentikasi, otorisasiPeran('siswa'), kontroler.ambilSoal);
rute.post('/hasil', autentikasi, otorisasiPeran('siswa'), kontroler.kirimJawaban);
rute.get('/jurusan/:kode', autentikasi, kontroler.ambilDetailJurusan);

export default rute;
