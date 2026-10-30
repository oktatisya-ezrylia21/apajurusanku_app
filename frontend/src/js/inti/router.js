// Router mini berbasis hash (#langkah) untuk alur beberapa langkah dalam satu halaman.
//   langkah : { namaLangkah: () => htmlString | Promise<htmlString> }
//   aksi    : { namaAksi: (dataset, elemen, kejadian) => void }   ← dipanggil dari atribut data-aksi="..."
// Pola pemakaian di HTML:
//   <button data-aksi="simpan" data-id="5">   klik     → aksi.simpan({id:'5'})
//   <input  data-input="cari">                mengetik → aksi.cari(nilai, elemen)
//   <input  data-ubah="unggah" type="file">   berubah  → aksi.unggah(elemen, dataset)
import { bukaModal, tutupModal } from '../komponen/modal.js';
import { tampilkanToast } from '../komponen/toast.js';
import { $ } from './util.js';

/** Pindah ke langkah lain (mengubah hash → memicu render). */
export function pindah(namaLangkah) {
  if (location.hash === `#${namaLangkah}`) renderUlang();
  else location.hash = namaLangkah;
}

/** Menggambar ulang langkah yang sedang tampil tanpa mengubah hash. */
export function renderUlang() {
  window.dispatchEvent(new Event('hashchange'));
}

/**
 * Menjalankan halaman.
 * @param {object} opsi
 * @param {Record<string, Function>} opsi.langkah        fungsi penghasil HTML per langkah
 * @param {string}   opsi.langkahAwal                    langkah bawaan (biasanya 'login' / 'form')
 * @param {Record<string, Function>} [opsi.aksi]         penangan data-aksi / data-input / data-ubah
 * @param {Record<string, Function>} [opsi.setelahRender] dipanggil setelah HTML langkah masuk ke DOM
 * @param {string[]} [opsi.terlindungi]                  langkah yang butuh login
 * @param {Function} [opsi.sudahMasuk]                   fungsi pemeriksa status login
 */
export function jalankanHalaman({ langkah, langkahAwal, aksi = {}, setelahRender = {}, terlindungi = [], sudahMasuk = () => true }) {
  const wadah = $('app');
  let nomorRender = 0; // penanda agar hasil render lama (lambat) tidak menimpa render yang lebih baru

  const aksiLengkap = { simpanPdf: () => html2pdf().set({
  margin: 10, filename: 'hasil-tes-minat.pdf',
  html2canvas: { scale: 2, ignoreElements: (el) => el.classList.contains('tanpa-cetak') },
  jsPDF: { format: 'a4' },
}).from(document.querySelector('.panel')).save(), tutupModal, ...aksi };

  async function render() {
    const nama = langkah[location.hash.slice(1)] ? location.hash.slice(1) : langkahAwal;

    // Langkah terlindungi: bila belum masuk, arahkan ke langkah awal.
    if (terlindungi.includes(nama) && !sudahMasuk()) {
      if (location.hash !== `#${langkahAwal}`) location.hash = langkahAwal;
      else await gambar(langkahAwal);
      return;
    }
    await gambar(nama);
  }

  async function gambar(nama) {
    const nomor = ++nomorRender;
    tutupModal();
    try {
      const hasil = langkah[nama]();
      if (hasil instanceof Promise) wadah.innerHTML = '<div class="panel panel-sempit">Memuat…</div>';
      const html = await hasil;
      if (nomor !== nomorRender) return;
      wadah.innerHTML = html;
      setelahRender[nama]?.();
      window.scrollTo(0, 0);
    } catch (galat) {
      if (nomor !== nomorRender) return;
      tampilkanToast(galat.message || 'Terjadi kesalahan');
      // Sesi habis / token ditolak → kembali ke halaman masuk.
      if (galat.status === 401 && nama !== langkahAwal) pindah(langkahAwal);
      else if (nama !== langkahAwal) wadah.innerHTML = `<div class="panel panel-sempit"><p>${galat.message ?? 'Gagal memuat data'}</p><button class="tombol tombol-teal" data-aksi="muatUlang">Coba lagi</button></div>`;
    }
  }
  aksiLengkap.muatUlang = renderUlang;

  // ---- Delegasi kejadian: satu pendengar di document untuk seluruh halaman (termasuk modal) ----
  document.addEventListener('click', (k) => {
    const elemen = k.target.closest('[data-aksi]');
    if (elemen && aksiLengkap[elemen.dataset.aksi]) aksiLengkap[elemen.dataset.aksi](elemen.dataset, elemen, k);
  });
  document.addEventListener('input', (k) => {
    const elemen = k.target.closest('[data-input]');
    if (!elemen || !aksiLengkap[elemen.dataset.input]) return;
    aksiLengkap[elemen.dataset.input](elemen.type === 'checkbox' ? elemen.checked : elemen.value, elemen);
  });
  document.addEventListener('change', (k) => {
    const elemen = k.target.closest('[data-ubah]');
    if (elemen && aksiLengkap[elemen.dataset.ubah]) aksiLengkap[elemen.dataset.ubah](elemen, elemen.dataset);
  });
  window.addEventListener('hashchange', render);

  render();
}
