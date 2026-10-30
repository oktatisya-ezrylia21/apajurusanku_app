// State halaman siswa (di memori). Hanya `jawaban` yang juga disimpan ke sessionStorage
// supaya progres tes tidak hilang saat halaman dimuat ulang.
import { ambilSesi } from '../../inti/state.js';

export const stateSiswa = {
  soal: [],                          // daftar soal dari server
  indeksSoal: 0,                     // soal yang sedang tampil (mulai dari 0)
  jawaban: ambilSesi('jawaban', []), // jawaban[i] = tipe RIASEC yang dipilih pada soal ke-i
  hasil: null,                       // hasil tes terbaru { ranking_jurusan, ulasan, ... }
  kodeJurusan: '',                   // jurusan yang sedang dilihat
  detailJurusan: {},                 // cache detail jurusan per kode
  ceklis: {},                        // status "Langkah selanjutnya" yang sudah dicentang
  hasilCekNisn: null,                // hasil fitur "Cek NISN"
  isianLogin: { nama: '', nisn: '', sekolah: '' },
};
