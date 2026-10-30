// Skema validasi CRUD admin untuk tiap sumber data. Kunci = nama sumber di URL /api/admin/:sumber
import { TIPE_RIASEC } from '../konfigurasi/kontenAplikasi.js';

const DAFTAR_TIPE = Object.keys(TIPE_RIASEC);

export const SKEMA_ADMIN = {
  jurusan: {
    kode: { label: 'Kode', wajib: true, maks: 10 },
    nama: { label: 'Nama jurusan', wajib: true, maks: 100 },
    kode_riasec: { label: 'RIASEC', wajib: true, maks: 20 },
    deskripsi: { label: 'Deskripsi', maks: 500 },
    pembelajaran: { label: 'Pembelajaran', maks: 500 },
    prospek_kerja: { label: 'Prospek kerja', maks: 500 },
    lanjut_kuliah: { label: 'Lanjut kuliah', maks: 500 },
  },
  siswa: {
    nisn: { label: 'NISN', wajib: true, tipe: 'nisn' },
    nama: { label: 'Nama', wajib: true, maks: 100 },
    sekolah_asal: { label: 'Sekolah asal', maks: 150 },
  },
  soal: {
    urutan: { label: 'Urutan', tipe: 'angka', min: 1 },
    pertanyaan: { label: 'Teks pertanyaan', wajib: true, maks: 200 },
    teks_a: { label: 'Pilihan A', wajib: true, maks: 120 },
    tipe_a: { label: 'Tipe A', wajib: true, tipe: 'pilihan', pilihan: DAFTAR_TIPE },
    gambar_a: { label: 'Gambar A', tipe: 'jalurGambar' },
    teks_b: { label: 'Pilihan B', wajib: true, maks: 120 },
    tipe_b: { label: 'Tipe B', wajib: true, tipe: 'pilihan', pilihan: DAFTAR_TIPE },
    gambar_b: { label: 'Gambar B', tipe: 'jalurGambar' },
  },
  sekolah: {
    npsn: { label: 'NPSN', wajib: true, maks: 20 },
    nama: { label: 'Nama sekolah', wajib: true, maks: 150 },
    kota: { label: 'Kota', wajib: true, maks: 80 },
    alamat: { label: 'Alamat', maks: 250 },
    latitude: { label: 'Latitude', wajib: true, tipe: 'angka', min: -90, maksNilai: 90 },
    longitude: { label: 'Longitude', wajib: true, tipe: 'angka', min: -180, maksNilai: 180 },
    akreditasi: { label: 'Akreditasi', maks: 80 },
    keterangan: { label: 'Keterangan', maks: 150 },
    favorit: { label: 'Favorit', tipe: 'boolean', bawaan: 0 },
    kode_jurusan: { label: 'Kode jurusan', wajib: true, maks: 100 },
    url_instagram: { label: 'URL Instagram', maks: 250 },
    url_tiktok: { label: 'URL TikTok', maks: 250 },
    url_spmb: { label: 'URL SPMB', maks: 250 },
  },
  guru: {
    nama: { label: 'Nama', wajib: true, maks: 100 },
    email: { label: 'Email', wajib: true, tipe: 'email' },
    sekolah_asal: { label: 'Sekolah asal', wajib: true, maks: 150 },
  },
  'sekolah-asal': {
    nama: { label: 'Nama sekolah', wajib: true, maks: 150 },
    kota: { label: 'Kota', maks: 80 },
  },
};
