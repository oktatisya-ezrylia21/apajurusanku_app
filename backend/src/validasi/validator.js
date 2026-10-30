// Mesin validasi berbasis skema (deklaratif). Skema = objek { namaKolom: aturan }.
// Aturan yang didukung:
//   label (nama ramah untuk pesan galat), wajib, tipe, maks (panjang teks), min/maks (angka), pilihan, bawaan
//   tipe: 'teks' | 'angka' | 'boolean' | 'email' | 'nisn' | 'pilihan' | 'jalurGambar'
import { emailValid } from './email.js';
import { nisnValid } from './nisn.js';

/**
 * Memvalidasi dan membersihkan data sesuai skema.
 * Hanya kolom yang ada di skema yang dikembalikan (kolom asing dibuang → aman dari mass-assignment).
 * @returns {{galat: string[], data: object}}
 */
export function validasiData(skema, masukan = {}) {
  const galat = [];
  const data = {};

  for (const [kolom, aturan] of Object.entries(skema)) {
    const label = aturan.label ?? kolom;
    const nilaiMentah = masukan?.[kolom];
    const kosong = nilaiMentah === undefined || nilaiMentah === null || String(nilaiMentah).trim() === '';

    // Nilai kosong: wajib → galat; tidak wajib → pakai nilai bawaan (atau null).
    if (kosong) {
      if (aturan.wajib) galat.push(`${label} wajib diisi`);
      else data[kolom] = aturan.bawaan ?? null;
      continue;
    }

    const nilai = typeof nilaiMentah === 'string' ? nilaiMentah.trim() : nilaiMentah;

    switch (aturan.tipe ?? 'teks') {
      case 'teks':
        if (aturan.maks && String(nilai).length > aturan.maks) galat.push(`${label} maksimal ${aturan.maks} karakter`);
        else data[kolom] = String(nilai);
        break;
      case 'angka': {
        const angka = Number(nilai);
        if (Number.isNaN(angka)) galat.push(`${label} harus berupa angka`);
        else if (aturan.min !== undefined && angka < aturan.min) galat.push(`${label} minimal ${aturan.min}`);
        else if (aturan.maksNilai !== undefined && angka > aturan.maksNilai) galat.push(`${label} maksimal ${aturan.maksNilai}`);
        else data[kolom] = angka;
        break;
      }
      case 'boolean':
        data[kolom] = [1, '1', true, 'true'].includes(nilai) ? 1 : 0;
        break;
      case 'email':
        if (emailValid(nilai)) data[kolom] = String(nilai).toLowerCase();
        else galat.push('Format email salah');
        break;
      case 'nisn':
        if (nisnValid(nilai)) data[kolom] = String(nilai);
        else galat.push('NISN harus 10 digit angka');
        break;
      case 'pilihan':
        if (aturan.pilihan.includes(nilai)) data[kolom] = nilai;
        else galat.push(`${label} harus salah satu dari: ${aturan.pilihan.join(', ')}`);
        break;
      case 'jalurGambar':
        // Hanya jalur hasil unggahan resmi yang diterima (cegah penyisipan URL sembarang).
        if (/^\/unggahan\/[\w.-]+$/.test(nilai)) data[kolom] = nilai;
        else galat.push(`${label} tidak valid`);
        break;
      default:
        galat.push(`Tipe validasi tidak dikenal untuk ${label}`);
    }
  }
  return { galat, data };
}
