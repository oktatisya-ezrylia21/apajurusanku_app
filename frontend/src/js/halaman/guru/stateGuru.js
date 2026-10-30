// State halaman guru (di memori).
export const stateGuru = {
  cari: '',            // kata kunci pencarian siswa di dashboard
  idSiswa: null,       // siswa yang sedang dilihat detailnya (null = ringkasan semua)
  detail: null,        // data detail siswa terpilih
  ringkasan: null,     // data dashboard terakhir
  isian: { nama: '', email: '', sekolah: '' },
};
