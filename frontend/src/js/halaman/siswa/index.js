// Perakit halaman siswa: menggabungkan langkah & aksi dari file-file di folder ini.
import { siapkanKerangka } from '../../inti/init.js';
import { jalankanHalaman } from '../../inti/router.js';
import { sudahMasukSebagai } from '../../layanan/authLayanan.js';
import { aksiHasil, langkahDetail, langkahHasil, langkahLaporan } from './hasil.js';
import { aksiInstruksi, langkahInstruksi } from './instruksi.js';
import { aksiLogin, langkahLogin } from './login.js';
import { aksiSoal, langkahSoal } from './soal.js';

siapkanKerangka();

jalankanHalaman({
  langkahAwal: 'login',
  langkah: {
    login: langkahLogin,
    ins: langkahInstruksi,
    soal: langkahSoal,
    hasil: langkahHasil,
    detail: langkahDetail,
    lap: langkahLaporan,
  },
  aksi: { ...aksiLogin, ...aksiInstruksi, ...aksiSoal, ...aksiHasil },
  terlindungi: ['ins', 'soal', 'hasil', 'detail', 'lap'],
  sudahMasuk: () => sudahMasukSebagai('siswa'),
});
