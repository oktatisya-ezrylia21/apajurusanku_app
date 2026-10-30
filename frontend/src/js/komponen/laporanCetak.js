// Tampilan laporan yang bisa dicetak / disimpan sebagai PDF lewat dialog cetak browser.
import { esc, formatTanggal } from '../inti/util.js';

/**
 * @param {object} p
 * @param {string} p.nama           nama siswa / judul ringkasan
 * @param {{label: string, persen: number}[]} p.baris
 * @param {string} p.aksiKembali    nama data-aksi untuk tombol kembali
 */
export function htmlLaporan({ nama, baris, aksiKembali }) {
  return `<div class="panel panel-sempit panel-lebar">
    <h3>Laporan hasil tes minat</h3>
    <p>Nama: <b>${esc(nama)}</b><br>Tanggal: ${formatTanggal()}</p>
    ${baris.map((b, i) => `<div class="item-daftar"><span>${i + 1}. ${esc(b.label)}</span><span class="lencana">${esc(b.persen)}%</span></div>`).join('')}
    <div class="baris-tombol tanpa-cetak">
      <button class="tombol tombol-kuning tombol-penuh" data-aksi="simpanPdf">Simpan PDF</button>
      <button class="tombol tombol-garis tombol-penuh" data-aksi="${esc(aksiKembali)}">← Kembali</button>
    </div></div>`;
}