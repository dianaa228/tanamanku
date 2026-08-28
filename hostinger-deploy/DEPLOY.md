# 🌱 Tanamanku — Deploy ke Hostinger (Panduan Lengkap)

## Info Server

| Item | Value |
|------|-------|
| **Domain** | `powderblue-moose-368537.hostingersite.com` |
| **SSH IP** | `153.92.11.45` |
| **SSH Port** | `65002` |
| **SSH User** | `u519141514` |
| **SSH Password** | `Tanamanku1"` |

---

## Arsitektur Deploy

```
/home/u519141514/
├── tanamanku/               # Laravel app (di luar public_html — aman)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/             # Harus writable
│   └── vendor/
│
public_html/                 # Document root (Apache)
├── .htaccess                # Routing: API → Laravel, lainnya → React
├── api.php                  # Entry point Laravel (modified)
├── index.html               # React SPA (dari dist/)
├── assets/                  # React compiled JS/CSS
├── icons/                   # React icons
├── manifest.json
├── robots.txt
└── apple-touch-icon.svg
```

**URL mapping:**
- `https://domain.com/` → React SPA
- `https://domain.com/api/v1/*` → Laravel API

---

## STEP 1: Buat Database di hPanel

1. Login ke **hPanel Hostinger** → `powderblue-moose-368537.hostingersite.com`
2. Menu **Databases** → **MySQL Databases**
3. Buat database baru:
   - **Name**: `u519141514_tanamanku`
   - **Username**: `u519141514_tanamanku`
   - **Password**: buat password baru (simpan!)
4. Setelah dibuat, catat:
   - DB Host: biasanya `localhost` atau `127.0.0.1`
   - DB Name: `u519141514_tanamanku`
   - DB User: `u519141514_tanamanku`
   - DB Password: (yang baru dibuat)

---

## STEP 2: Upload Files via hPanel File Manager

### A. Upload Backend ke `~/tanamanku/`

Buka **File Manager** di hPanel → navigate ke `/home/u519141514/`

1. Buat folder `tanamanku`
2. Upload SELURUH isi folder `backend/` ke `~/tanamanku/`
   - Harusnya ada: `app/`, `bootstrap/`, `config/`, `database/`, `routes/`, `vendor/`, `artisan`, `composer.json`, `composer.lock`
3. Upload file `hostinger-deploy/backend-env` → rename jadi `~/tanamanku/.env`

### B. Upload Frontend ke `~/public_html/`

1. Buka folder `public_html/`
2. Upload ISI folder `web/dist/` ke `~/public_html/`
   - Harusnya ada: `index.html`, `assets/`, `icons/`, `manifest.json`, `robots.txt`, `apple-touch-icon.svg`
3. Upload file `hostinger-deploy/.htaccess` → `~/public_html/.htaccess`
4. Upload file `hostinger-deploy/api.php` → `~/public_html/api.php`

---

## STEP 3: Konfigurasi .env Backend

Edit file `~/tanamanku/.env` — ganti bagian database:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u519141514_tanamanku
DB_USERNAME=u519141514_tanamanku
DB_PASSWORD=password_yang_baru_dibuat
```

**Cara edit di hPanel:**
- File Manager → klik file `.env` → klik icon Edit (pencil)

---

## STEP 4: Build Frontend dengan URL Production

Di **komputer lokal** (sebelum upload), jalankan:

```bash
cd web/

# Buat .env untuk production
cat > .env << 'EOF'
VITE_MIDTRANS_SANDBOX=true
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-XXXXX
VITE_API_BASE_URL=https://powderblue-moose-368537.hostingersite.com/api/v1
EOF

# Build
npm install
npm run build
```

Upload isi folder `web/dist/` ke `~/public_html/` (overwrite jika sudah ada).

---

## STEP 5: Jalankan via SSH Terminal

Buka **SSH Terminal** di hPanel:

```bash
# 1. Masuk ke direktori aplikasi
cd ~/tanamanku

# 2. Generate APP_KEY
php artisan key:generate --force

# 3. Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# 4. Install dependencies (jika vendor belum lengkap)
composer install --no-dev --optimize-autoloader

# 5. Jalankan migrations
php artisan migrate --force

# 6. (Opsional) Seed database
php artisan db:seed --force

# 7. Cache untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## STEP 6: Test

1. Buka browser → `https://powderblue-moose-368537.hostingersite.com/`
   - Harusnya load React SPA
2. Test API: `https://powderblue-moose-368537.hostingersite.com/api/v1/health`
   - Harusnya return: `{"success":true,"message":"Tanamanku API OK"}`

---

## Troubleshooting

### 500 Internal Server Error
- Cek log: `~/tanamanku/storage/logs/laravel.log`
- Atau di hPanel → **Metrics** → **Logs**

### API tidak bisa diakses
- Pastikan file `api.php` ada di `public_html/`
- Pastikan `~/tanamanku/vendor/` ada dan lengkap
- Cek apakah `mod_rewrite` aktif (biasanya sudah aktif di Hostinger)

### Database connection error
- Pastikan database sudah dibuat di hPanel
- Pastikan `.env` sudah diisi benar

### Storage tidak bisa ditulis
```bash
chmod -R 775 ~/tanamanku/storage
chown -R $(whoami):$(whoami) ~/tanamanku/storage
```

### CORS error
- Pastikan `FRONTEND_URL` di `.env` sudah benar:
  `FRONTEND_URL=https://powderblue-moose-368537.hostingersite.com`
- Pastikan `SANCTUM_STATEFUL_DOMAINS` sudah benar

---

## Struktur File yang Benar di Server

```
~/tanamanku/
├── .env                    ← Konfigurasi production
├── artisan                 ← Laravel CLI
├── composer.json
├── composer.lock
├── app/
├── bootstrap/
│   └── cache/
├── config/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
├── storage/
│   ├── app/
│   ├── framework/
│   │   ├── cache/
│   │   ├── sessions/
│   │   └── views/
│   └── logs/
└── vendor/

~/public_html/
├── .htaccess               ← Routing rules
├── api.php                 ← Laravel entry point
├── index.html              ← React SPA
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ... (semua compiled assets)
├── icons/
├── manifest.json
├── robots.txt
└── apple-touch-icon.svg
```
