// Format respons JSON yang seragam supaya frontend mudah menanganinya:
// sukses -> { sukses: true, pesan, data }   gagal -> { sukses: false, pesan, rincian }

/** Galat buatan sendiri yang membawa kode status HTTP. Dilempar dari layanan/kontroler. */
export class GalatAplikasi extends Error {
  constructor(pesan, statusHttp = 400, rincian = null) {
    super(pesan);
    this.statusHttp = statusHttp;
    this.rincian = rincian;
  }
}

/** Mengirim respons sukses. */
export function kirimSukses(res, data = null, pesan = 'Berhasil', statusHttp = 200) {
  return res.status(statusHttp).json({ sukses: true, pesan, data });
}

/** Mengirim respons gagal. */
export function kirimGagal(res, pesan, statusHttp = 400, rincian = null) {
  return res.status(statusHttp).json({ sukses: false, pesan, rincian });
}
