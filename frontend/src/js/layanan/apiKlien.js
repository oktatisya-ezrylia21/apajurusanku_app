// Pemanggil API tunggal. Semua layanan lain memakai panggilApi() agar penanganan token,
// format respons, dan galat seragam. Alamat dasar API bisa diganti lewat window.APAJURUSANKU_API.
import { ambilSesi, hapusSesi } from '../inti/state.js';

const BASIS_API = window.APAJURUSANKU_API ?? '/api';

/** Galat dari server, membawa status HTTP agar router bisa menangani 401 (sesi habis). */
export class GalatApi extends Error {
  constructor(pesan, status, rincian = null) {
    super(pesan);
    this.status = status;
    this.rincian = rincian;
  }
}

/**
 * @param {string} jalur contoh '/tes/soal'
 * @param {object} [opsi]
 * @param {string} [opsi.metode]    GET (bawaan) | POST | PUT | DELETE
 * @param {object} [opsi.body]      dikirim sebagai JSON
 * @param {FormData} [opsi.formData] dikirim sebagai multipart (unggah file)
 * @param {object} [opsi.parameter] query string, nilai kosong diabaikan
 * @returns {Promise<any>} isi field `data` dari respons sukses
 */
export async function panggilApi(jalur, { metode = 'GET', body, formData, parameter = {} } = {}) {
  const url = new URL(BASIS_API + jalur, location.origin);
  Object.entries(parameter).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
  });

  const token = ambilSesi('token');
  const header = {};
  if (token) header.Authorization = `Bearer ${token}`;
  if (body) header['Content-Type'] = 'application/json';

  let respons;
  try {
    respons = await fetch(url, { method: metode, headers: header, body: formData ?? (body ? JSON.stringify(body) : undefined) });
  } catch {
    throw new GalatApi('Tidak dapat terhubung ke server. Periksa koneksi internetmu.', 0);
  }

  const json = await respons.json().catch(() => null);
  if (!respons.ok || !json?.sukses) {
    // Token ditolak → hapus agar pengguna diminta masuk ulang.
    if (respons.status === 401 && token) { hapusSesi('token'); hapusSesi('pengguna'); }
    throw new GalatApi(json?.pesan ?? 'Terjadi kesalahan', respons.status, json?.rincian);
  }
  return json.data;
}
