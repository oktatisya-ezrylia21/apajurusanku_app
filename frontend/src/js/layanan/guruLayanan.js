// Layanan untuk dashboard guru.
import { panggilApi } from './apiKlien.js';

export const ambilDashboard = (cari = '') => panggilApi('/guru/dashboard', { parameter: { cari } });
export const ambilDetailSiswa = (id) => panggilApi(`/guru/siswa/${id}`);
