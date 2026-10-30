// Memvalidasi body request dengan skema. Skema boleh berupa objek, atau fungsi (req) => skema
// untuk kasus skema ditentukan dinamis (mis. dari parameter URL). Hasil bersih ada di req.dataValid.
import { validasiData } from '../validasi/validator.js';
import { GalatAplikasi } from '../utilitas/responsStandar.js';

export const validasiRequest = (skemaAtauFungsi, sumber = 'body') => (req, _res, lanjut) => {
  const skema = typeof skemaAtauFungsi === 'function' ? skemaAtauFungsi(req) : skemaAtauFungsi;
  const { galat, data } = validasiData(skema, req[sumber]);
  if (galat.length > 0) return lanjut(new GalatAplikasi(galat[0], 422, galat));
  req.dataValid = data;
  return lanjut();
};
