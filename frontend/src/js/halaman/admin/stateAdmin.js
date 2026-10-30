// State panel admin (di memori).
export const stateAdmin = {
  sumber: 'jurusan', // tab yang sedang dibuka
  cari: '',          // kata kunci pencarian
  halaman: 1,        // halaman tabel saat ini
  data: null,        // hasil terakhir dari server { baris, total, halaman, totalHalaman }
  formAktif: false,  // true = sedang menampilkan form tambah/ubah
  kunciDiedit: null, // null = tambah baru; selain itu = kunci baris yang diubah
  isian: {},         // nilai isian form saat ini
};
