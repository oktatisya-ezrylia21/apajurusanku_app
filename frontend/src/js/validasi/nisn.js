// Aturan NISN di sisi browser (pemeriksaan cepat sebelum ke server; server tetap memeriksa ulang).
export const nisnValid = (nisn) => {
  const n = String(nisn ?? '').trim();
  return /^\d{10}$/.test(n) && !/^(\d)\1{9}$/.test(n);
};