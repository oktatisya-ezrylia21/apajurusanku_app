// Tautan ke Google Maps. Tidak butuh API key dan tidak perlu izin lokasi dari aplikasi ini:
// Google Maps (aplikasi di HP / situs di komputer) sendiri yang memakai posisi pengguna untuk
// mengurutkan hasil "terdekat".

/** Pencarian "SMK <jurusan> terdekat" di Google Maps. Di HP otomatis membuka aplikasi Google Maps. */
export const urlCariSekolahTerdekat = (namaJurusan) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`SMK ${namaJurusan} terdekat`)}`;
