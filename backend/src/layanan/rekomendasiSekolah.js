// Logika bisnis rekomendasi sekolah: menghitung jarak (rumus Haversine) lalu memilah
// menjadi "Sekolah terdekat" dan "Sekolah favorit" sesuai radius yang dipilih siswa.
import { LOKASI_BAWAAN } from '../konfigurasi/kontenAplikasi.js';
import { modelSekolah } from '../model/sekolah.js';

const RADIUS_BUMI_KM = 6371;
const keRadian = (derajat) => (derajat * Math.PI) / 180;

/** Jarak garis lurus (km) antara dua titik koordinat di permukaan bumi. */
export function hitungJarakKm(titikAsal, titikTujuan) {
  const selisihLat = keRadian(titikTujuan.latitude - titikAsal.latitude);
  const selisihLng = keRadian(titikTujuan.longitude - titikAsal.longitude);
  const a = Math.sin(selisihLat / 2) ** 2
    + Math.cos(keRadian(titikAsal.latitude)) * Math.cos(keRadian(titikTujuan.latitude)) * Math.sin(selisihLng / 2) ** 2;
  return 2 * RADIUS_BUMI_KM * Math.asin(Math.sqrt(a));
}

/**
 * Mencari sekolah yang membuka jurusan tertentu di sekitar lokasi siswa.
 * @param {object} param
 * @param {string} param.kodeJurusan  contoh 'RPL'
 * @param {number} [param.latitude]   lokasi siswa (bila kosong dipakai LOKASI_BAWAAN)
 * @param {number} [param.longitude]
 * @param {number|null} [param.radiusKm] batas jarak; null = tanpa batas (satu provinsi)
 * @returns {{lokasi: object, terdekat: object[], favorit: object[]}}
 */
export function cariSekolahRekomendasi({ kodeJurusan, latitude, longitude, radiusKm = null }) {
  const lokasiDiketahui = Number.isFinite(latitude) && Number.isFinite(longitude);
  const lokasi = lokasiDiketahui
    ? { latitude, longitude, keterangan: 'Lokasimu saat ini', dariPerangkat: true }
    : { ...LOKASI_BAWAAN, dariPerangkat: false };

  const sekolahBerjarak = modelSekolah
    .cariByJurusan(kodeJurusan)
    .map((sekolah) => ({ ...sekolah, favorit: Boolean(sekolah.favorit), jarak_km: Math.round(hitungJarakKm(lokasi, sekolah) * 10) / 10 }))
    .filter((sekolah) => radiusKm === null || sekolah.jarak_km <= radiusKm)
    .sort((a, b) => a.jarak_km - b.jarak_km);

  return {
    lokasi,
    terdekat: sekolahBerjarak.filter((s) => !s.favorit),
    favorit: sekolahBerjarak.filter((s) => s.favorit),
  };
}
