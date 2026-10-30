// Pemeriksaan gambar maskot soal:  npm run cek:gambar
//   1) 48 file ada di folder pict-maskot-jawaban (huruf besar/kecil persis, penting di server Linux);
//   2) tiap soal di database menunjuk ke jalur yang benar;
//   3) bila server menyala (BASE_URL, bawaan http://localhost:PORT), tiap URL gambar mengembalikan 200 + image/jpeg.
import fs from 'node:fs';
import path from 'node:path';
import { db } from '../src/konfigurasi/database.js';
import { env } from '../src/konfigurasi/env.js';
import { jalankanMigrasi } from '../src/basisdata/migrasi/jalankanMigrasi.js';
import { DAFTAR_SOAL, FOLDER_GAMBAR_SOAL, jalurGambarSoal, namaFileGambarSoal } from '../src/basisdata/benih/dataSoal.js';

jalankanMigrasi();
const masalah = [];
const folder = path.join(env.folderFrontend, 'public', FOLDER_GAMBAR_SOAL);
const adaDiFolder = fs.existsSync(folder) ? new Set(fs.readdirSync(folder)) : new Set();

DAFTAR_SOAL.forEach((_, i) => ['A', 'B'].forEach((sisi) => {
  const nama = namaFileGambarSoal(i + 1, sisi);
  if (!adaDiFolder.has(nama)) masalah.push(`File tidak ada (cek huruf besar/kecil & ejaan): ${nama}`);
}));

const baris = db.prepare('SELECT urutan, gambar_a, gambar_b FROM soal ORDER BY urutan').all();
if (baris.length !== DAFTAR_SOAL.length) masalah.push(`Jumlah soal di database ${baris.length}, seharusnya ${DAFTAR_SOAL.length}.`);
baris.forEach((s) => [['A', s.gambar_a], ['B', s.gambar_b]].forEach(([sisi, jalur]) => {
  if (!jalur) masalah.push(`Soal ${s.urutan} kartu ${sisi}: gambar kosong`);
  else if (jalur.startsWith('/aset/') && jalur !== jalurGambarSoal(s.urutan, sisi)) masalah.push(`Soal ${s.urutan} kartu ${sisi}: jalur salah (${jalur})`);
}));

const dasar = process.env.BASE_URL ?? `http://localhost:${env.port}`;
let diperiksaHttp = 0;
try {
  for (const s of baris) {
    for (const jalur of [s.gambar_a, s.gambar_b].filter(Boolean)) {
      const r = await fetch(dasar + jalur);
      diperiksaHttp += 1;
      if (r.status !== 200 || !String(r.headers.get('content-type')).startsWith('image/')) masalah.push(`URL ${jalur} -> ${r.status} ${r.headers.get('content-type')}`);
    }
  }
} catch {
  console.log(`(Server di ${dasar} tidak menyala, pemeriksaan URL dilewati. Jalankan "npm run dev" di terminal lain untuk ikut memeriksa URL.)`);
}

if (masalah.length > 0) {
  console.error(`GAGAL, ${masalah.length} masalah:\n- ${masalah.join('\n- ')}`);
  process.exit(1);
}
console.log(`OK: ${adaDiFolder.size} file, ${baris.length} soal di database${diperiksaHttp ? `, ${diperiksaHttp} URL gambar terbuka` : ''}.`);
