// Model soal tes. Urutan soal dipakai untuk menentukan nomor tampil (Soal 1 dari 24, dst).
import { db } from '../konfigurasi/database.js';
import { buatModel } from './modelDasar.js';

const KOLOM = ['urutan', 'pertanyaan', 'teks_a', 'tipe_a', 'gambar_a', 'teks_b', 'tipe_b', 'gambar_b'];

const dasar = buatModel({
  tabel: 'soal',
  kolom: KOLOM,
  kolomCari: ['pertanyaan', 'teks_a', 'teks_b'],
  urutan: 'urutan ASC, id ASC',
});

const urutanBerikutnya = () => (db.prepare('SELECT MAX(urutan) AS maks FROM soal').get().maks ?? 0) + 1;

export const modelSoal = {
  ...dasar,
  /** Bila admin tidak mengisi urutan, soal baru diletakkan di paling akhir. */
  tambah: (data) => dasar.tambah({ ...data, urutan: data.urutan ?? urutanBerikutnya() }),
  /** Saat ubah, urutan lama dipertahankan bila tidak diisi. */
  ubah: (id, data) => dasar.ubah(id, { ...data, urutan: data.urutan ?? dasar.cariByKunci(id)?.urutan ?? urutanBerikutnya() }),
  jumlah: () => db.prepare('SELECT COUNT(*) AS total FROM soal').get().total,
};
