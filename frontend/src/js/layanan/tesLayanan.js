// Layanan untuk tes, jurusan, dan hasil (peran siswa).
import { panggilApi } from './apiKlien.js';

let kontenTersimpan = null;

/** Konten umum (tipe RIASEC, langkah, daftar sekolah asal). Di-cache agar hemat permintaan. */
export async function ambilKonten() {
  if (!kontenTersimpan) kontenTersimpan = await panggilApi('/tes/konten');
  return kontenTersimpan;
}

export const ambilSoal = () => panggilApi('/tes/soal');
export const kirimJawaban = (jawaban) => panggilApi('/tes/hasil', { metode: 'POST', body: { jawaban } });
export const ambilHasilTerakhir = () => panggilApi('/siswa/hasil-terakhir');
export const ambilDetailJurusan = (kode) => panggilApi(`/tes/jurusan/${encodeURIComponent(kode)}`);
