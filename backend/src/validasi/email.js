export const POLA_EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

/** @returns {boolean} true bila format email valid. */
export function emailValid(email) {
  const e = String(email ?? '').trim();
  return e.length <= 254 && !e.includes('..') && POLA_EMAIL.test(e);
}