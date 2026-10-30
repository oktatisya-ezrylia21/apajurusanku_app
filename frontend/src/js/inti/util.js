// Fungsi bantu kecil yang dipakai di seluruh frontend.

/** Pintasan document.getElementById. */
export const $ = (id) => document.getElementById(id);

/** Mengambil nilai input berdasarkan id (string kosong bila elemen tidak ada). */
export const nilaiInput = (id) => $(id)?.value ?? '';

/**
 * Mengamankan teks sebelum disisipkan ke HTML (mencegah XSS).
 * WAJIB dipakai untuk semua data dari server/pengguna yang ditampilkan lewat innerHTML.
 */
export function esc(teks) {
  return String(teks ?? '').replace(/[&<>"']/g, (k) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[k]));
}

/** Hanya mengizinkan URL http/https; selain itu dikembalikan kosong (cegah javascript: URL). */
export const urlAman = (url) => (/^https?:\/\//i.test(String(url ?? '')) ? url : '');

/** Menunda pemanggilan fungsi hingga pengguna berhenti mengetik (hemat permintaan ke server). */
export function tundaKetik(fungsi, jeda = 300) {
  let pewaktu;
  return (...argumen) => {
    clearTimeout(pewaktu);
    pewaktu = setTimeout(() => fungsi(...argumen), jeda);
  };
}

/** Format tanggal Indonesia, contoh: 29 Oktober 2026. */
export const formatTanggal = (nilai = new Date()) =>
  new Date(nilai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
