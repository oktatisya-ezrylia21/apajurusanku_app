// Tes integrasi: menjalankan alur nyata (login → tes → hasil → sekolah → admin) pada database memori.
import assert from 'node:assert/strict';
import { before, test } from 'node:test';
import request from 'supertest';

process.env.DB_PATH = ':memory:';
process.env.ADMIN_USERNAME = 'admin';
process.env.ADMIN_KATA_SANDI = 'kata-sandi-tes';

let aplikasi;
let tokenSiswa;
let tokenAdmin;

before(async () => {
  const { isiBenih } = await import('../../src/basisdata/benih/jalankanBenih.js');
  isiBenih();
  ({ aplikasi } = await import('../../src/aplikasi.js'));
});

test('login siswa dengan NISN salah ditolak', async () => {
  const res = await request(aplikasi).post('/api/auth/siswa').send({ nama: 'Budi', nisn: '123' });
  assert.equal(res.status, 422);
});

test('siswa mengerjakan tes lalu menerima ranking jurusan', async () => {
  const masuk = await request(aplikasi).post('/api/auth/siswa').send({ nama: 'Budi Santoso', nisn: '0012345678' });
  assert.equal(masuk.status, 200);
  tokenSiswa = masuk.body.data.token;

  const soal = await request(aplikasi).get('/api/tes/soal').set('Authorization', `Bearer ${tokenSiswa}`);
  assert.equal(soal.body.data.length, 24);

  // Selalu memilih pilihan A pada setiap soal.
  const jawaban = soal.body.data.map((s) => ({ soal_id: s.id, tipe: s.tipe_a }));
  const hasil = await request(aplikasi).post('/api/tes/hasil').set('Authorization', `Bearer ${tokenSiswa}`).send({ jawaban });
  assert.equal(hasil.status, 201);
  assert.equal(hasil.body.data.ranking_jurusan.length, 6);
});

test('jawaban yang dipalsukan ditolak', async () => {
  const soal = await request(aplikasi).get('/api/tes/soal').set('Authorization', `Bearer ${tokenSiswa}`);
  const jawaban = soal.body.data.map((s) => ({ soal_id: s.id, tipe: 'X' }));
  const res = await request(aplikasi).post('/api/tes/hasil').set('Authorization', `Bearer ${tokenSiswa}`).send({ jawaban });
  assert.equal(res.status, 422);
});

test('rekomendasi sekolah mengembalikan daftar terdekat & favorit', async () => {
  const res = await request(aplikasi).get('/api/siswa/sekolah?kode=RPL&radius=50').set('Authorization', `Bearer ${tokenSiswa}`);
  assert.equal(res.status, 200);
  assert.ok(res.body.data.terdekat.length + res.body.data.favorit.length > 0);
});

test('siswa tidak boleh mengakses API admin', async () => {
  const res = await request(aplikasi).get('/api/admin/jurusan').set('Authorization', `Bearer ${tokenSiswa}`);
  assert.equal(res.status, 403);
});

test('admin login lalu menambah, mengubah, dan menghapus jurusan', async () => {
  const masuk = await request(aplikasi).post('/api/auth/admin').send({ username: 'admin', kata_sandi: 'kata-sandi-tes' });
  assert.equal(masuk.status, 200);
  tokenAdmin = masuk.body.data.token;
  const header = { Authorization: `Bearer ${tokenAdmin}` };

  const tambah = await request(aplikasi).post('/api/admin/jurusan').set(header)
    .send({ kode: 'tbg', nama: 'Tata Boga', kode_riasec: 'A, S' });
  assert.equal(tambah.status, 201);
  assert.equal(tambah.body.data.kode, 'TBG');

  const ubah = await request(aplikasi).put('/api/admin/jurusan/TBG').set(header)
    .send({ kode: 'TBG', nama: 'Tata Boga Modern', kode_riasec: 'A, S' });
  assert.equal(ubah.body.data.nama, 'Tata Boga Modern');

  const hapus = await request(aplikasi).delete('/api/admin/jurusan/TBG').set(header);
  assert.equal(hapus.status, 200);
});

test('guru melihat siswa yang sudah tes di sekolahnya', async () => {
  const masuk = await request(aplikasi).post('/api/auth/guru')
    .send({ nama: 'Rina', email: 'rina@smpn1.sch.id', sekolah_asal: 'SMPN 1 Contoh, Kota Bandung' });
  const dashboard = await request(aplikasi).get('/api/guru/dashboard').set('Authorization', `Bearer ${masuk.body.data.token}`);
  assert.equal(dashboard.status, 200);
  assert.ok(dashboard.body.data.total_sudah_tes >= 1);
});
