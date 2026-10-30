export function emailValid(email) {
  const e = String(email ?? '').trim();
  const pola = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return e.length <= 254 && !e.includes('..') && pola.test(e);
}
