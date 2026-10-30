export const POLA_NISN = /^\d{10}$/;

/** @returns {boolean} true bila NISN valid. */
export function nisnValid(nisn) {
  const n = String(nisn ?? '').trim();
  return POLA_NISN.test(n) && !/^(\d)\1{9}$/.test(n);
}