// Logger sederhana berstempel waktu. Bisa diganti pino/winston tanpa mengubah kode lain.
const stempel = () => new Date().toISOString();

export const logger = {
  info: (...pesan) => console.log(`[${stempel()}] INFO `, ...pesan),
  peringatan: (...pesan) => console.warn(`[${stempel()}] WARN `, ...pesan),
  galat: (...pesan) => console.error(`[${stempel()}] ERROR`, ...pesan),
};
