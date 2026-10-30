// Panel admin: tabel data + form tambah/ubah + hapus untuk semua sumber data.
import { renderUlang } from '../../inti/router.js';
import { $, esc, tundaKetik } from '../../inti/util.js';
import { bukaModal, tutupModal } from '../../komponen/modal.js';
import { htmlPaging, htmlTabel } from '../../komponen/tabel.js';
import { tampilkanToast } from '../../komponen/toast.js';
import * as adminLayanan from '../../layanan/adminLayanan.js';
import { ambilKonten } from '../../layanan/tesLayanan.js';
import { validasiKolomWajib } from '../../validasi/form.js';
import { DEFINISI_SUMBER } from './definisiSumber.js';
import { stateAdmin } from './stateAdmin.js';

const definisi = () => DEFINISI_SUMBER[stateAdmin.sumber];

/** Tabel + kontrol halaman (bagian yang diperbarui saat mencari / pindah halaman). */
function htmlIsiTabel() {
  const { data } = stateAdmin;
  return htmlTabel({
    kolom: definisi().kolomTabel, baris: data.baris, kolomKunci: definisi().kunci,
    nomorAwal: (data.halaman - 1) * data.batas + 1,
  }) + htmlPaging({ halaman: data.halaman, totalHalaman: data.totalHalaman });
}

/** Mengambil data dari server sesuai tab, kata kunci, dan halaman saat ini. */
async function muatData() {
  stateAdmin.data = await adminLayanan.daftarData(stateAdmin.sumber, { cari: stateAdmin.cari, halaman: stateAdmin.halaman });
  // Bila halaman saat ini kosong setelah penghapusan, mundur satu halaman.
  if (stateAdmin.data.baris.length === 0 && stateAdmin.halaman > 1) {
    stateAdmin.halaman -= 1;
    stateAdmin.data = await adminLayanan.daftarData(stateAdmin.sumber, { cari: stateAdmin.cari, halaman: stateAdmin.halaman });
  }
}

/** Menu samping + konten (tabel atau form). */
export async function langkahDashboard() {
  const menu = Object.entries(DEFINISI_SUMBER).map(([kunci, d]) =>
    `<button class="${kunci === stateAdmin.sumber ? 'aktif' : ''}" data-aksi="gantiTab" data-sumber="${kunci}">${esc(d.judul)}</button>`).join('');

  const isi = stateAdmin.formAktif ? await htmlForm() : await htmlTabelLengkap();
  return `<div class="tata-admin">
    <div class="menu-samping">${menu}<button data-aksi="keluar">⏻ Keluar</button></div>
    <div class="panel">${isi}</div></div>`;
}

async function htmlTabelLengkap() {
  await muatData();
  return `<div class="baris-atas"><h3 style="margin:0">Data ${esc(definisi().judul)}</h3>
      <button class="tombol tombol-kuning" style="padding:9px 18px" data-aksi="tambahBaru">+ Tambah</button></div>
    <label for="cari">Cari</label>
    <input id="cari" placeholder="Cari data" value="${esc(stateAdmin.cari)}" data-input="cariData">
    <div id="wadah-tabel" style="margin-top:12px">${htmlIsiTabel()}</div>`;
}

/** Satu kolom form sesuai jenis inputnya. */
function htmlKolomForm([kolom, label, jenis], konten) {
  const nilai = stateAdmin.isian[kolom] ?? '';
  const id = `isi-${kolom}`;
  if (jenis === 'gambar') {
    return `<label>${esc(label)}</label><div class="unggah-gambar">
      ${nilai ? `<img src="${esc(nilai)}" alt="">` : '<img alt="">'}
      <div><small>PNG, JPG, WEBP, atau SVG · maks 1 MB</small><br>
        <label class="lencana" style="margin:4px 0 0;cursor:pointer">${nilai ? 'Ganti gambar' : 'Unggah gambar'}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" hidden data-ubah="unggahGambar" data-kolom="${kolom}"></label>
        ${nilai ? `<button class="lencana garis" data-aksi="hapusGambar" data-kolom="${kolom}">Hapus</button>` : ''}</div></div>`;
  }
  if (jenis === 'tipe') {
    const opsi = Object.entries(konten.tipe_riasec).map(([k, t]) => `<option value="${k}" ${k === nilai ? 'selected' : ''}>${k} — ${esc(t.nama)}</option>`).join('');
    return `<label for="${id}">${esc(label)}</label><select id="${id}" data-input="isi" data-kolom="${kolom}"><option value="">Pilih tipe…</option>${opsi}</select>`;
  }
  if (jenis === 'centang') {
    return `<label><input type="checkbox" style="width:auto;margin-right:8px" data-input="isi" data-kolom="${kolom}" ${Number(nilai) ? 'checked' : ''}>${esc(label)}</label>`;
  }
  return `<label for="${id}">${esc(label)}</label><input id="${id}" ${jenis === 'angka' ? 'type="number" step="any"' : ''} value="${esc(nilai)}" data-input="isi" data-kolom="${kolom}">`;
}

async function htmlForm() {
  const konten = await ambilKonten();
  const baru = stateAdmin.kunciDiedit === null;
  return `<button class="tombol-kembali" data-aksi="batalForm">← Kembali</button>
    <h3>${baru ? 'Tambah' : 'Edit'} ${esc(definisi().judul)}</h3>
    ${definisi().kolomForm.map((k) => htmlKolomForm(k, konten)).join('')}
    <div class="baris-tombol kiri" style="margin-top:16px">
      <button class="tombol tombol-kuning" data-aksi="simpan">Simpan</button>
      <button class="tombol tombol-teal" data-aksi="batalForm">Batal</button></div>`;
}

/** Memuat ulang hanya tabel (tanpa menggambar ulang kolom cari). */
async function segarkanTabel() {
  await muatData();
  $('wadah-tabel').innerHTML = htmlIsiTabel();
}

const cariSambilMengetik = tundaKetik(async (kataKunci) => {
  try { stateAdmin.cari = kataKunci; stateAdmin.halaman = 1; await segarkanTabel(); } catch (g) { tampilkanToast(g.message); }
});

export const aksiCrud = {
  gantiTab({ sumber }) {
    Object.assign(stateAdmin, { sumber, cari: '', halaman: 1, formAktif: false, kunciDiedit: null, isian: {} });
    renderUlang();
  },
  cariData: (teks) => cariSambilMengetik(teks),
  halamanSebelumnya: async () => { stateAdmin.halaman -= 1; await segarkanTabel().catch((g) => tampilkanToast(g.message)); },
  halamanBerikutnya: async () => { stateAdmin.halaman += 1; await segarkanTabel().catch((g) => tampilkanToast(g.message)); },

  tambahBaru() { Object.assign(stateAdmin, { formAktif: true, kunciDiedit: null, isian: {} }); renderUlang(); },
  edit({ kunci }) {
    const baris = stateAdmin.data.baris.find((b) => String(b[definisi().kunci]) === kunci);
    Object.assign(stateAdmin, { formAktif: true, kunciDiedit: kunci, isian: { ...baris } });
    renderUlang();
  },
  batalForm() { Object.assign(stateAdmin, { formAktif: false, kunciDiedit: null, isian: {} }); renderUlang(); },

  /** Mengikat setiap isian form ke state (nama kolom dari atribut data-kolom). */
  isi(nilai, elemen) { stateAdmin.isian[elemen.dataset.kolom] = typeof nilai === 'boolean' ? Number(nilai) : nilai; },

  /** Unggah gambar maskot → simpan jalurnya di isian form. */
  async unggahGambar(elemen, { kolom }) {
    const berkas = elemen.files[0];
    if (!berkas) return;
    if (berkas.size > 1024 * 1024) return tampilkanToast('Ukuran maksimal 1 MB');
    try {
      stateAdmin.isian[kolom] = (await adminLayanan.unggahGambar(berkas)).jalur;
      return renderUlang();
    } catch (g) { return tampilkanToast(g.message); }
  },
  hapusGambar({ kolom }) { stateAdmin.isian[kolom] = ''; renderUlang(); },

  async simpan() {
    const galat = validasiKolomWajib(stateAdmin.isian, definisi().kolomWajib);
    if (galat) return tampilkanToast(galat);
    try {
      await adminLayanan.simpanData(stateAdmin.sumber, stateAdmin.isian, stateAdmin.kunciDiedit);
      Object.assign(stateAdmin, { formAktif: false, kunciDiedit: null, isian: {} });
      tampilkanToast('Data tersimpan');
      return renderUlang();
    } catch (g) { return tampilkanToast(g.message); }
  },

  /** Konfirmasi dulu sebelum menghapus (tindakan permanen). */
  konfirmasiHapus({ kunci }) {
    bukaModal(`<h3>Hapus data?</h3><p>Data akan dihapus permanen.</p>
      <div class="baris-tombol kiri"><button class="tombol tombol-teal" data-aksi="hapusPasti" data-kunci="${esc(kunci)}">Hapus</button>
      <button class="tombol tombol-garis" data-aksi="tutupModal">Batal</button></div>`);
  },
  async hapusPasti({ kunci }) {
    try {
      await adminLayanan.hapusData(stateAdmin.sumber, kunci);
      tutupModal();
      tampilkanToast('Data dihapus');
      await segarkanTabel();
    } catch (g) { tutupModal(); tampilkanToast(g.message); }
  },
};

