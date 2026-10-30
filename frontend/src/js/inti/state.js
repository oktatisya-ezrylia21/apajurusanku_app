// Penyimpanan sesi di browser (sessionStorage): token login & progres tes.
// Data hilang otomatis saat tab ditutup. Semua akses dibungkus try/catch karena
// sessionStorage bisa tidak tersedia (mode privat tertentu).
const AWALAN = 'apajurusanku:';

export function simpanSesi(kunci, nilai) {
  try { sessionStorage.setItem(AWALAN + kunci, JSON.stringify(nilai)); } catch { /* abaikan */ }
}

export function ambilSesi(kunci, bawaan = null) {
  try {
    const mentah = sessionStorage.getItem(AWALAN + kunci);
    return mentah === null ? bawaan : JSON.parse(mentah);
  } catch { return bawaan; }
}

export function hapusSesi(kunci) {
  try { sessionStorage.removeItem(AWALAN + kunci); } catch { /* abaikan */ }
}
