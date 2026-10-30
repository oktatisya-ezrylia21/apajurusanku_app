# 🎓 ApaJurusanku 🎓
**Panduan Masa Depan Siswa SMP menuju SMK**

> _“Pernahkah kamu merasa bingung saat harus menentukan masa depan di usia 14 – 15 tahun?”_

Bagi banyak siswa SMP, masa transisi menuju jenjang pendidikan berikutnya adalah fase yang membingungkan. Berawal dari pengalaman pribadi kami dan pembekalan ilmu dari Pelatihan TIK (Latika), kami, dua siswi berusia 16 tahun, membuktikan bahwa usia bukanlah halangan untuk menciptakan solusi nyata.

**ApaJurusanku** hadir sebagai aplikasi web interaktif yang membantu siswa SMP/sederajat menemukan arah jurusan SMK yang paling tepat. Tidak hanya itu, aplikasi ini juga menjadi jembatan teknologi bagi Guru Bimbingan Konseling (BK) untuk mendampingi langkah anak didiknya secara digital, menggantikan metode manual yang memakan waktu.

---

## 🤔 Mengapa ApaJurusanku Diciptakan?

- **Kebingungan Siswa:** Banyak siswa yang tidak mengenali minat dan bakat mereka sendiri saat harus memilah jurusan SMK.
- **Keterbatasan Alat Evaluasi:** Guru BK membutuhkan instrumen digital yang cepat, akurat, dan mudah dipantau untuk memetakan rencana masa depan siswa.
- **Kesenjangan Informasi Geografis:** Setelah mengetahui jurusan yang cocok, siswa sering kesulitan untuk mencari SMK mana di sekitar mereka yang menyediakan jurusan tersebut.

## 💡 Solusi Kami

Sebuah platform **tes psikologi RIASEC** berbasis kartu visual yang interaktif. Tes ini tidak membosankan karena ditemani oleh maskot ramah kami, yaitu **Gardaratama**, yang akan mendampingi siswa hingga menemukan rekomendasi jurusan dan lokasi sekolah terdekat.

---

## ✨ Fitur Unggulan

Kami merancang antarmuka yang spesifik untuk tiga peran pengguna:

### 👨‍🎓 Untuk Siswa (Student Portal)
- **Akses Mudah & Aman:** Sistem login yang terintegrasi.
- **Tes Psikologi Interaktif:** Tes minat bakat metode RIASEC dengan antarmuka kartu visual yang menarik.
- **Dasbor Hasil Personal:** Menampilkan daftar SMK terdekat yang menyediakan jurusan sesuai hasil tes siswa.

### 👨‍🏫 Untuk Guru (Teacher Portal)
- **Manajemen Kelas:** Guru dapat login untuk memantau daftar siswa di sekolahnya yang telah mengikuti tes.
- **Laporan Terintegrasi:** Kemudahan dalam mencetak rekapitulasi hasil tes siswa sebagai bahan konseling lanjutan.

### 🙎‍♂️ Untuk Admin (Dashboard Control)
- **Sistem Manajemen:** Admin dapat membuat, membaca, mengedit, dan menghapus data siswa, sekolah, jurusan, guru, dan soal tes tanpa perlu menyentuh *hard-code*.
- **Keamanan Data:** Validasi NISN (Nomor Induk Siswa Nasional) dan deteksi email terdaftar untuk mencegah duplikasi atau potensi peretasan.
- **Integrasi Tautan:** Pengecekan NISN langsung melalui integrasi tautan pada aplikasi.

---

## 💻 Teknologi di Balik Layar

Untuk memastikan aplikasi ini ringan, cepat, dan mudah diakses, kami menggunakan susunan teknologi berikut:

- **Frontend:** HTML, CSS, dan Vanilla JavaScript (Antarmuka responsif tanpa *framework* yang berat).
- **Backend & Manajemen Data:** JavaScript dengan sistem penyimpanan data berbasis JSON (`store.js`) untuk kemudahan modifikasi.
- **API Integrasi:** Google Maps API (Digunakan untuk melacak lokasi pengguna dan merekomendasikan rute ke SMK terdekat berdasarkan koordinat).
- **Deployment:** GitHub Pages (Memastikan aplikasi selalu *online* dan dapat diakses publik dengan mudah).

---

## 🔗 Coba Aplikasi Kami
👉 **[Masukkan Link GitHub Pages/Website Anda di sini]**

---

## 📊 Sumber & Validasi Data 

Data sekolah dan jurusan pada ApaJurusanku dikumpulkan dan diverifikasi secara manual:
- **Data SMK:** Data SMK (Nama sekolah, NPSN, dan jurusan) didapat melalui situs [Profil Sekolah Dindik Jatim](https://ppsmk.dindik.jatimprov.go.id/profil/sekolah). Agar tidak sekadar menyalin, setiap data kami cocokkan kembali dengan informasi yang dipublikasikan di Instagram, TikTok, Google, dan Facebook.
- **Data SMP:** Data SMP dihimpun dari sumber terpercaya dan divalidasi untuk disesuaikan dengan jangkauan wilayah pengguna. *(Catatan: Data dapat diperbarui seiring berjalannya waktu)*.

---

## 🤖 AI Sebagai Co-Pilot Pengembangan

Dalam era modern, kolaborasi dengan Kecerdasan Buatan adalah kunci efisiensi. Kami memanfaatkan berbagai model AI mutakhir untuk mempercepat siklus pengembangan proyek ini:

- **Gemini AI (Pro 3.1 & Flash 3.6):** Bertindak sebagai arsitek utama kami. Digunakan untuk perencanaan alur sistem, analisis logika, *debugging* kode kompleks, generasi gambar maskot Gardaratama, dan sebagai mentor tanya-jawab teknis.
- **Claude AI (Sonnet 3.5):** Bertindak sebagai *Fullstack Agent*. Sangat krusial dalam pembuatan *mockup* desain, *wireframe flow system*, dan penulisan struktur kode *website*.
- **Google AI Search:** Digunakan untuk riset data empiris dan pencarian referensi sumber terpercaya secara *real-time*.

🔍 **Transparansi AI:** Seluruh interaksi *prompting* dan penyesuaian saran dari AI kami didokumentasikan secara lengkap. Silakan lihat riwayat kolaborasi kami di file `AI_LOGBOOK.md`.

---

## 🚀 Panduan Penggunaan (Instalasi Lokal)

Jika kamu ingin menjalankan proyek ini secara lokal, ikuti langkah berikut ini:

1. **Unduh atau *clone* repositori ini** ke perangkat kamu:
   ```bash
   git clone https://github.com/username-kamu/ApaJurusanku.git
   ```
2. Ekstrak file jika mengunduh dalam bentuk ZIP.
3. Buka folder proyek, dan jalankan file `index.html` menggunakan *browser* pilihan kamu.
4. *(Opsional)* Gunakan ekstensi **Live Server** di VSCode untuk pengalaman *testing* yang lebih optimal dan *auto-reload*.

---

## 👩‍💻 Tim Pengembang

Proyek **ApaJurusanku** dikembangkan oleh:
- **Ezrylia Oktisya Putriadi** (Kelas 11, Jurusan SIJA)
- **Intan Gandhini** (Kelas 11, Jurusan SIJA)

*Dikembangkan dengan ❤️, Kode, dan Bantuan AI*