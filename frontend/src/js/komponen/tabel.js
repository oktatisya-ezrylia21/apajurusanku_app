// Pembuat HTML tabel data + kontrol halaman (dipakai panel admin).
import { esc } from '../inti/util.js';

/**
 * @param {object} p
 * @param {[string,string][]} p.kolom  pasangan [namaKolom, judulKolom]
 * @param {object[]} p.baris           data baris
 * @param {string} p.kolomKunci        kolom kunci utama (id / kode) untuk tombol Edit & Hapus
 * @param {number} p.nomorAwal         nomor urut baris pertama pada halaman ini
 */
export function htmlTabel({ kolom, baris, kolomKunci, nomorAwal }) {
  if (baris.length === 0) return '<p class="petunjuk">Belum ada data. Klik “+ Tambah” untuk menambahkan.</p>';

  const kepala = kolom.map(([, judul]) => `<th>${esc(judul)}</th>`).join('');
  const isi = baris.map((b, i) => `
    <tr>
      <td>${nomorAwal + i}</td>
      ${kolom.map(([nama]) => `<td>${esc(b[nama])}</td>`).join('')}
      <td>
        <button class="tombol-mini kuning" data-aksi="edit" data-kunci="${esc(b[kolomKunci])}">Edit</button>
        <button class="tombol-mini teal" data-aksi="konfirmasiHapus" data-kunci="${esc(b[kolomKunci])}">Hapus</button>
      </td>
    </tr>`).join('');

  return `<div class="tabel-gulir"><table><tr><th>#</th>${kepala}<th>Aksi</th></tr>${isi}</table></div>`;
}

/** Kontrol "‹ Sebelumnya / Berikutnya ›" beserta keterangan halaman. */
export function htmlPaging({ halaman, totalHalaman }) {
  return `<div class="baris-atas" style="margin-top:10px">
    <span class="petunjuk">Halaman ${halaman} dari ${totalHalaman}</span>
    <span>
      <button class="tombol-mini kuning" data-aksi="halamanSebelumnya" ${halaman <= 1 ? 'disabled' : ''}>‹ Sebelumnya</button>
      <button class="tombol-mini kuning" data-aksi="halamanBerikutnya" ${halaman >= totalHalaman ? 'disabled' : ''}>Berikutnya ›</button>
    </span></div>`;
}
