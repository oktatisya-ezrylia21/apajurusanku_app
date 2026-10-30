# Panduan Deploy (VPS Ubuntu + IP publik)

## 1. Persiapan server
```bash
sudo apt update && sudo apt install -y nginx git build-essential python3
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2
```

## 2. Ambil kode & konfigurasi
```bash
sudo mkdir -p /var/www && cd /var/www
sudo git clone <url-repo> apajurusanku && sudo chown -R $USER apajurusanku
cd apajurusanku/backend
npm ci --omit=dev || npm install --omit=dev
cp .env.example .env && nano .env
```
Wajib diisi di `.env`: `NODE_ENV=production`, `JWT_RAHASIA` (acak, ≥ 32 karakter, mis. `openssl rand -hex 32`),
`ADMIN_KATA_SANDI`, `CORS_ASAL=http://IP-ATAU-DOMAIN-ANDA`, `SAJIKAN_FRONTEND=false`.

## 3. Jalankan dengan PM2
```bash
cd /var/www/apajurusanku
pm2 start deploy/pm2/ecosystem.config.js --env production
pm2 save && pm2 startup     # ikuti perintah yang ditampilkan
```
Saat pertama menyala, server membuat tabel dan mengisi data awal otomatis.

## 4. Nginx
```bash
sudo cp deploy/nginx/apajurusanku.conf /etc/nginx/sites-available/apajurusanku
sudo ln -s /etc/nginx/sites-available/apajurusanku /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```
Buka `http://IP-PUBLIK-ANDA`. Port 80 harus terbuka di firewall (`sudo ufw allow 80,443/tcp`).

## 5. HTTPS (disarankan, butuh domain)
```bash
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx -d domain-anda.com
```
Lalu ubah `CORS_ASAL` menjadi `https://domain-anda.com` dan `pm2 restart apajurusanku`.
Catatan: tombol "Lihat sekolah terdekat" membuka pencarian Google Maps langsung (tanpa API key & tanpa izin lokasi dari aplikasi), jadi tidak bergantung pada HTTPS.

## 6. Pembaruan & pencadangan
```bash
git pull && cd backend && npm install --omit=dev && pm2 restart apajurusanku
cp backend/data/apajurusanku.sqlite ~/cadangan-$(date +%F).sqlite   # cadangan database
```
Cadangkan juga folder `backend/unggahan/`.

## Alternatif: Docker
```bash
export JWT_RAHASIA=$(openssl rand -hex 32) ADMIN_KATA_SANDI='kata-sandi-kuat'
docker compose -f deploy/docker/docker-compose.yml up -d --build
```
