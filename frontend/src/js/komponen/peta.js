// Peta memakai OpenStreetMap + Leaflet (tanpa API key, gratis).
// Leaflet dimuat otomatis dari CDN saat peta pertama kali dibuka, jadi tidak perlu mengubah file HTML.
// Bila CDN gagal dimuat (internet lemah), peta otomatis diganti tampilan OpenStreetMap biasa + tautan.
import { esc } from '../inti/util.js';

const LEAFLET_VERSI = '1.9.4';
const SUMBER_LEAFLET = [
  {
    css: `https://cdn.jsdelivr.net/npm/leaflet@${LEAFLET_VERSI}/dist/leaflet.css`,
    js: `https://cdn.jsdelivr.net/npm/leaflet@${LEAFLET_VERSI}/dist/leaflet.js`,
  },
  {
    css: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSI}/leaflet.css`,
    js: `https://cdnjs.cloudflare.com/ajax/libs/leaflet/${LEAFLET_VERSI}/leaflet.js`,
  },
];

/** Meminta lokasi perangkat. Gagal/ditolak/lebih dari 6 detik → mengembalikan null (server memakai lokasi bawaan). */
export function ambilLokasiPengguna() {
  return new Promise((selesai) => {
    if (!('geolocation' in navigator)) return selesai(null);
    navigator.geolocation.getCurrentPosition(
      (posisi) => selesai({ latitude: posisi.coords.latitude, longitude: posisi.coords.longitude }),
      () => selesai(null),
      { timeout: 6000, maximumAge: 300000 },
    );
  });
}

/** Koordinat valid? (angka, dalam rentang bumi, bukan 0,0) */
export function koordinatValid(latitude, longitude) {
  const la = Number(latitude);
  const lo = Number(longitude);
  return latitude !== null && longitude !== null && latitude !== '' && longitude !== ''
    && Number.isFinite(la) && Number.isFinite(lo)
    && Math.abs(la) <= 90 && Math.abs(lo) <= 180 && !(la === 0 && lo === 0);
}

// ---- Tautan luar ----
export const urlPetunjukArah = (latitude, longitude) => `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
export const urlBukaDiMaps = (latitude, longitude) => `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
export const urlBukaDiOsm = (latitude, longitude) => `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
export const urlPetaEmbedOsm = (latitude, longitude) => {
  const la = Number(latitude); const lo = Number(longitude);
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lo - 0.01},${la - 0.006},${lo + 0.01},${la + 0.006}&layer=mapnik&marker=${la},${lo}`;
};

// ---- Gaya kecil untuk peta (disisipkan sekali lewat JavaScript, tidak perlu mengubah CSS) ----
function pasangGaya() {
  if (document.getElementById('gaya-peta')) return;
  const gaya = document.createElement('style');
  gaya.id = 'gaya-peta';
  gaya.textContent = `
    div.peta { position: relative; z-index: 0; isolation: isolate; width: 100%; height: 320px; border-radius: 20px;
      margin-bottom: 12px; overflow: hidden; background: var(--lembut, #e8f1f5); }
    div.peta .leaflet-container { font-family: 'Fredoka', sans-serif; }
    .pin-bungkus { background: none; border: 0; }
    .pin-bungkus span { display: block; font-size: 28px; line-height: 1; filter: drop-shadow(0 2px 2px rgba(0,0,0,.35)); }
    .pin-bungkus.favorit span { font-size: 32px; }
    .pin-bungkus.pengguna span { font-size: 24px; }
    .popup-sekolah b { display: block; margin-bottom: 2px; }
    .popup-sekolah small { color: #555; }
    .popup-sekolah button { margin-top: 8px; border: 0; border-radius: 99px; padding: 6px 12px; cursor: pointer;
      background: #ffcf44; font: 600 13px 'Fredoka', sans-serif; }
    .peta-cadangan { display: grid; place-items: center; text-align: center; padding: 16px; height: 100%; }
    .peta-cadangan iframe { width: 100%; height: 100%; border: 0; }
  `;
  document.head.appendChild(gaya);
}

// ---- Memuat Leaflet sekali saja ----
let janjiLeaflet = null;

function muatSkrip(src) {
  return new Promise((selesai, gagal) => {
    const el = document.createElement('script');
    const batas = setTimeout(() => { el.remove(); gagal(new Error('batas waktu')); }, 9000);
    el.src = src;
    el.async = true;
    el.onload = () => { clearTimeout(batas); selesai(); };
    el.onerror = () => { clearTimeout(batas); el.remove(); gagal(new Error('gagal memuat')); };
    document.head.appendChild(el);
  });
}

function muatCss(href) {
  return new Promise((selesai, gagal) => {
    const ada = document.querySelector(`link[href="${href}"]`);
    if (ada?.dataset.siap) return selesai();
    const el = ada ?? document.createElement('link');
    const batas = setTimeout(() => gagal(new Error('batas waktu css')), 9000);
    el.onload = () => { clearTimeout(batas); el.dataset.siap = '1'; selesai(); };
    el.onerror = () => { clearTimeout(batas); el.remove(); gagal(new Error('gagal memuat css')); };
    if (!ada) { el.rel = 'stylesheet'; el.href = href; document.head.appendChild(el); }
  });
}

/** @returns {Promise<object|null>} objek Leaflet (L) atau null bila tidak bisa dimuat. */
export function muatLeaflet() {
  if (window.L?.map) return Promise.resolve(window.L);
  if (janjiLeaflet) return janjiLeaflet;
  janjiLeaflet = (async () => {
    for (const sumber of SUMBER_LEAFLET) {
      try {
        await Promise.all([muatCss(sumber.css), muatSkrip(sumber.js)]);
        if (window.L?.map) return window.L;
      } catch { /* coba sumber berikutnya */ }
    }
    janjiLeaflet = null; // izinkan mencoba lagi nanti
    return null;
  })();
  return janjiLeaflet;
}

// ---- Menggambar peta ----
let petaAktif = null;

function bersihkanPeta() {
  if (petaAktif) { try { petaAktif.remove(); } catch { /* abaikan */ } petaAktif = null; }
}

function tampilkanCadangan(wadah, titik) {
  const t = titik[0];
  wadah.innerHTML = t && titik.length === 1
    ? `<div class="peta-cadangan" style="padding:0"><iframe title="Peta ${esc(t.judul)}" loading="lazy" src="${esc(urlPetaEmbedOsm(t.latitude, t.longitude))}"></iframe></div>`
    : `<div class="peta-cadangan"><div><b>Peta tidak dapat dimuat</b><br><small>Periksa koneksi internetmu, lalu muat ulang halaman.</small></div></div>`;
}

/**
 * Menggambar peta di elemen dengan id `idWadah`.
 * @param {string} idWadah
 * @param {{titik: Array<{id?:any, latitude:number, longitude:number, judul:string, keterangan?:string, favorit?:boolean, tombol?:boolean}>,
 *          pengguna?: {latitude:number, longitude:number}|null, zoomTunggal?: number}} opsi
 */
export async function gambarPeta(idWadah, { titik, pengguna = null, zoomTunggal = 15 }) {
  pasangGaya();
  bersihkanPeta();
  const wadah = document.getElementById(idWadah);
  if (!wadah) return;

  const titikValid = titik.filter((t) => koordinatValid(t.latitude, t.longitude));
  if (titikValid.length === 0) {
    wadah.innerHTML = '<div class="peta-cadangan"><div><b>Lokasi belum tersedia</b><br><small>Koordinat sekolah ini belum diisi.</small></div></div>';
    return;
  }

  const L = await muatLeaflet();
  // Pengguna mungkin sudah pindah halaman saat Leaflet dimuat.
  if (!document.body.contains(wadah)) return;
  if (!L) { tampilkanCadangan(wadah, titikValid); return; }

  wadah.innerHTML = '';
  const peta = L.map(wadah, { scrollWheelZoom: false, zoomControl: true });
  petaAktif = peta;
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
  }).addTo(peta);

  const semua = [];
  titikValid.forEach((t) => {
    const posisi = [Number(t.latitude), Number(t.longitude)];
    semua.push(posisi);
    const ikon = L.divIcon({
      className: `pin-bungkus${t.favorit ? ' favorit' : ''}`,
      html: `<span>${t.favorit ? '⭐' : '🏫'}</span>`,
      iconSize: [32, 32],
      iconAnchor: [16, 30],
      popupAnchor: [0, -28],
    });
    const isi = `<div class="popup-sekolah"><b>${esc(t.judul)}</b>${t.keterangan ? `<small>${esc(t.keterangan)}</small>` : ''}`
      + `${t.tombol && t.id !== undefined ? `<br><button type="button" data-aksi="lihatPeta" data-id="${esc(t.id)}">Lihat detail</button>` : ''}</div>`;
    const penanda = L.marker(posisi, { icon: ikon, title: t.judul, keyboard: true }).addTo(peta).bindPopup(isi);
    if (titikValid.length === 1) penanda.openPopup();
  });

  if (pengguna && koordinatValid(pengguna.latitude, pengguna.longitude)) {
    const posisi = [Number(pengguna.latitude), Number(pengguna.longitude)];
    semua.push(posisi);
    L.marker(posisi, {
      icon: L.divIcon({ className: 'pin-bungkus pengguna', html: '<span>📍</span>', iconSize: [24, 24], iconAnchor: [12, 22] }),
      title: 'Lokasimu',
    }).addTo(peta).bindTooltip('Lokasimu');
  }

  if (semua.length === 1) peta.setView(semua[0], zoomTunggal);
  else peta.fitBounds(L.latLngBounds(semua), { padding: [32, 32], maxZoom: 16 });

  // Ukuran wadah baru final setelah halaman selesai digambar.
  setTimeout(() => { if (petaAktif === peta) peta.invalidateSize(); }, 150);
}

/** Dipanggil saat berpindah halaman agar peta lama dibuang dari memori. */
export const buangPeta = bersihkanPeta;
