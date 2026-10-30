// Perakit halaman admin.
import { siapkanKerangka } from '../../inti/init.js';
import { jalankanHalaman } from '../../inti/router.js';
import * as authLayanan from '../../layanan/authLayanan.js';
import { aksiCrud, langkahDashboard } from './crud.js';
import { aksiLogin, langkahLogin } from './login.js';

siapkanKerangka();

jalankanHalaman({
  langkahAwal: 'login',
  langkah: { login: langkahLogin, dash: langkahDashboard },
  aksi: {
    ...aksiLogin, ...aksiCrud,
    keluar() { authLayanan.keluar(); location.href = '/'; },
  },
  terlindungi: ['dash'],
  sudahMasuk: () => authLayanan.sudahMasukSebagai('admin'),
});
