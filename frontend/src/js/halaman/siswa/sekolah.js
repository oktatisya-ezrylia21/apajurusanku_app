// Langkah rekomendasi sekolah (terdekat & favorit) dan halaman peta sekolah (OpenStreetMap + Leaflet).
import { pindah, renderUlang } from '../../inti/router.js';
import { esc, urlAman } from '../../inti/util.js';
import {
  ambilLokasiPengguna, gambarPeta, koordinatValid, urlBukaDiMaps, urlBukaDiOsm, urlPetunjukArah,
} from '../../komponen/peta.js';
import { ambilKonten, ambilSekolah } from '../../layanan/tesLayanan.js';
import { stateSiswa } from './stateSiswa.js';

/** HTML satu kartu sekolah, lengkap dengan tautan peta, Instagram, TikTok, dan SPMB. */
function kartuSekolah(s) {
  const tautan = (url, label) => (urlAman(url)
    ? `<a class="lencana garis" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`
    : `<span class="lencana garis nonaktif">${label}</span>`);
  return `<div class="item-daftar blok">
    <div class="baris-atas"><div><b>${esc(s.nama)}</b><br><small>${esc(s.kota)} · ${esc(s.akreditasi ?? '')}${s.keterangan ? ` · ${esc(s.keterangan)}` : ''}</small></div>
      <span class="lencana kuning">${esc(s.jarak_km)} km</span></div>
    <button class="lencana" data-aksi="lihatPeta" data-id="${esc(s.id)}">⚲ Lihat peta</button>
    ${tautan(s.url_instagram, 'IG')}${tautan(s.url_tiktok, 'TikTok')}${tautan(s.url_spmb, 'SPMB')}
  </div>`;
}

export async function langkahSekolah() {
  const konten = await ambilKonten();
  const kode = stateSiswa.kodeJurusan;
  if (!kode) { pindah('hasil'); return ''; }

  // Lokasi hanya diminta sekali per sesi; bila ditolak, server memakai lokasi bawaan.
  if (stateSiswa.lokasi === undefined) stateSiswa.lokasi = await ambilLokasiPengguna();
  stateSiswa.sekolah = await ambilSekolah({ kode, radius: stateSiswa.radius, ...(stateSiswa.lokasi ?? {}) });

  const { terdekat, favorit, lokasi } = stateSiswa.sekolah;
  const namaJurusan = konten.jurusan.find((j) => j.kode === kode)?.nama ?? kode;
  const tabRadius = konten.pilihan_radius.map((p) =>
    `<button class="${p.nilai === stateSiswa.radius ? 'aktif' : ''}" data-aksi="ubahRadius" data-nilai="${p.nilai ?? ''}">${esc(p.label)}</button>`).join('');
  const adaTitik = [...terdekat, ...favorit].some((s) => koordinatValid(s.latitude, s.longitude));

  return `<div class="panel panel-sempit panel-lebar">
    <a class="tombol-kembali" href="#hasil">← Kembali</a>
    <h3>Sekolah ${esc(namaJurusan)} di sekitarmu</h3>
    <p class="petunjuk">${lokasi.dariPerangkat ? 'Berdasarkan lokasimu saat ini' : `Lokasi perkiraan: ${esc(lokasi.keterangan)} (izinkan akses lokasi agar lebih akurat)`}</p>
    <div class="tab-radius">${tabRadius}</div>
    ${adaTitik ? `<div id="peta-ringkasan" class="peta" role="region" aria-label="Peta sekolah"></div>
    <p class="petunjuk">🏫 sekolah terdekat · ⭐ sekolah favorit${lokasi.dariPerangkat ? ' · 📍 lokasimu' : ''}. Ketuk penanda untuk melihat detail.</p>` : ''}
    <div class="judul-bagian">Sekolah terdekat</div>
    ${terdekat.map(kartuSekolah).join('') || '<p>Tidak ada sekolah di jarak ini.</p>'}
    <div class="judul-bagian">Sekolah favorit</div>
    ${favorit.map(kartuSekolah).join('') || '<p>Tidak ada sekolah favorit di jarak ini.</p>'}
    <a class="tombol tombol-teal tombol-penuh" href="#hasil">⌂ Kembali ke hasil</a>
  </div>`;
}

export function langkahPeta() {
  const s = stateSiswa.sekolahDipilih;
  if (!s) { pindah('sekolah'); return ''; }
  const adaKoordinat = koordinatValid(s.latitude, s.longitude);
  return `<div class="panel panel-sempit panel-lebar">
    <div id="peta-sekolah" class="peta" role="region" aria-label="Peta ${esc(s.nama)}"></div>
    <div class="baris-atas"><b style="font-size:20px">${esc(s.nama)}</b><span class="lencana kuning">${esc(s.jarak_km)} km</span></div>
    <p>${esc(s.alamat ?? '')}<br>${esc(s.akreditasi ?? '')}</p>
    <div class="baris-tombol kiri">
      ${adaKoordinat ? `<a class="tombol tombol-teal" target="_blank" rel="noopener noreferrer" href="${esc(urlPetunjukArah(s.latitude, s.longitude))}">→ Petunjuk arah</a>
      <a class="tombol tombol-garis" target="_blank" rel="noopener noreferrer" href="${esc(urlBukaDiOsm(s.latitude, s.longitude))}">OpenStreetMap</a>
      <a class="tombol tombol-garis" target="_blank" rel="noopener noreferrer" href="${esc(urlBukaDiMaps(s.latitude, s.longitude))}">Google Maps</a>` : ''}
      <a class="tombol tombol-kuning" href="#sekolah">← Kembali</a>
    </div></div>`;
}

/** Posisi siswa untuk penanda 📍 (hanya bila berasal dari perangkat, bukan lokasi bawaan). */
const posisiPengguna = () => {
  const lokasi = stateSiswa.sekolah?.lokasi;
  return lokasi?.dariPerangkat ? { latitude: lokasi.latitude, longitude: lokasi.longitude } : null;
};

/** Dipanggil router setelah HTML langkah "sekolah" masuk ke halaman. */
export function setelahSekolah() {
  if (!stateSiswa.sekolah) return;
  const { terdekat, favorit } = stateSiswa.sekolah;
  const sudah = new Set();
  const titik = [];
  [...terdekat.map((s) => ({ s, favorit: false })), ...favorit.map((s) => ({ s, favorit: true }))].forEach(({ s, favorit: fav }) => {
    if (sudah.has(s.id)) return;
    sudah.add(s.id);
    titik.push({
      id: s.id, latitude: s.latitude, longitude: s.longitude, judul: s.nama,
      keterangan: `${s.kota ?? ''} · ${s.jarak_km} km`, favorit: fav, tombol: true,
    });
  });
  gambarPeta('peta-ringkasan', { titik, pengguna: posisiPengguna() });
}

/** Dipanggil router setelah HTML langkah "peta" masuk ke halaman. */
export function setelahPeta() {
  const s = stateSiswa.sekolahDipilih;
  if (!s) return;
  gambarPeta('peta-sekolah', {
    titik: [{
      id: s.id, latitude: s.latitude, longitude: s.longitude, judul: s.nama,
      keterangan: `${s.kota ?? ''} · ${s.jarak_km} km`, favorit: Boolean(s.favorit),
    }],
    pengguna: posisiPengguna(),
  });
}

export const aksiSekolah = {
  ubahRadius({ nilai }) {
    stateSiswa.radius = nilai === '' ? null : Number(nilai);
    renderUlang();
  },
  /** Membuka halaman peta untuk sekolah yang diklik (diambil dari hasil rekomendasi). */
  lihatPeta({ id }) {
    const { terdekat, favorit } = stateSiswa.sekolah;
    stateSiswa.sekolahDipilih = [...terdekat, ...favorit].find((s) => String(s.id) === id) ?? null;
    pindah('peta');
  },
};
