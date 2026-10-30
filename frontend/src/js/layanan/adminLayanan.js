// Layanan CRUD admin. Parameter `sumber` = jurusan | siswa | soal | sekolah | guru | sekolah-asal
import { panggilApi } from './apiKlien.js';

export const daftarData = (sumber, { cari = '', halaman = 1 } = {}) =>
  panggilApi(`/admin/${sumber}`, { parameter: { cari, halaman, batas: 5 } });

/** Bila `kunciLama` ada → ubah (PUT); bila tidak → tambah (POST). */
export const simpanData = (sumber, data, kunciLama = null) =>
  kunciLama === null
    ? panggilApi(`/admin/${sumber}`, { metode: 'POST', body: data })
    : panggilApi(`/admin/${sumber}/${encodeURIComponent(kunciLama)}`, { metode: 'PUT', body: data });

export const hapusData = (sumber, kunci) => panggilApi(`/admin/${sumber}/${encodeURIComponent(kunci)}`, { metode: 'DELETE' });

/** Mengunggah gambar maskot; mengembalikan { jalur: '/unggahan/xxxx.png' }. */
export function unggahGambar(berkas) {
  const formData = new FormData();
  formData.append('gambar', berkas);
  return panggilApi('/admin/unggah', { metode: 'POST', formData });
}
