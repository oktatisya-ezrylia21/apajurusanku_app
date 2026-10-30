// Tes unit untuk logika murni: perhitungan skor, ranking jurusan, dan jarak.
import assert from 'node:assert/strict';
import { test } from 'node:test';

process.env.DB_PATH = ':memory:'; // rekomendasiSekolah.js mengimpor model → butuh database memori
const { hitungSkorPerTipe, hitungRekomendasiJurusan } = await import('../../src/layanan/hitungHasilTes.js');
const { hitungJarakKm } = await import('../../src/layanan/rekomendasiSekolah.js');

const jurusanContoh = [
  { kode: 'RPL', nama: 'Rekayasa Perangkat Lunak', kode_riasec: 'I, R' },
  { kode: 'OTO', nama: 'Teknik Otomotif', kode_riasec: 'R' },
  { kode: 'AKT', nama: 'Akuntansi', kode_riasec: 'C, E' },
];

test('hitungSkorPerTipe menghitung jumlah tiap tipe', () => {
  const skor = hitungSkorPerTipe(['R', 'R', 'I', 'A']);
  assert.deepEqual(skor, { R: 2, I: 1, A: 1, S: 0, E: 0, C: 0 });
});

test('jurusan dengan tipe utama terbanyak berada di peringkat pertama (95%)', () => {
  const ranking = hitungRekomendasiJurusan(['I', 'I', 'I', 'R'], jurusanContoh);
  assert.equal(ranking[0].kode, 'RPL');
  assert.equal(ranking[0].persen, 95);
});

test('tanpa jawaban sama sekali, persen tidak NaN', () => {
  const ranking = hitungRekomendasiJurusan([], jurusanContoh);
  assert.ok(ranking.every((r) => Number.isFinite(r.persen)));
});

test('hitungJarakKm: titik yang sama berjarak 0, Bandung–Jakarta sekitar 115–120 km', () => {
  const bandung = { latitude: -6.9175, longitude: 107.6191 };
  const jakarta = { latitude: -6.2088, longitude: 106.8456 };
  assert.equal(hitungJarakKm(bandung, bandung), 0);
  const jarak = hitungJarakKm(bandung, jakarta);
  assert.ok(jarak > 105 && jarak < 130, `jarak ${jarak}`);
});
