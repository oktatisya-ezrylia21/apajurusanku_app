// Perakit halaman guru.
import { siapkanKerangka } from '../../inti/init.js';
import { jalankanHalaman } from '../../inti/router.js';
import * as authLayanan from '../../layanan/authLayanan.js';
import { aksiDashboard, langkahDashboard, langkahDetailSiswa } from './dashboard.js';
import { aksiForm, langkahForm } from './formSekolah.js';
import { aksiLaporan, langkahLaporan } from './laporan.js';

siapkanKerangka();

jalankanHalaman({
  langkahAwal: 'form',
  langkah: { form: langkahForm, dash: langkahDashboard, sd: langkahDetailSiswa, lap: langkahLaporan },
  aksi: {
    ...aksiForm, ...aksiDashboard, ...aksiLaporan,
    keluar() { authLayanan.keluar(); location.hash = 'form'; },
  },
  terlindungi: ['dash', 'sd', 'lap'],
  sudahMasuk: () => authLayanan.sudahMasukSebagai('guru'),
});
