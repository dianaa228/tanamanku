# Panduan Instalasi PHP & Composer — Backend Tanamanku

Backend Tanamanku memakai **Laravel 11** yang membutuhkan:

| Kebutuhan | Versi Minimum | Keterangan |
| --------- | ------------- | ---------- |
| PHP       | 8.2 (disarankan 8.3) | Dengan ekstensi: `openssl, pdo_mysql, mbstring, tokenizer, xml, ctype, json, bcmath, curl, zip, fileinfo` |
| Composer  | 2.x           | Dependency manager PHP |
| MySQL     | 8.x           | Atau gunakan Docker (`docker compose up -d mysql`) |

---

## 🪟 Windows (panduan utama — mesin pengembang)

### Opsi A — Laragon (paling mudah & populer di Indonesia) ⭐

1. Unduh **Laragon Full** dari <https://laragon.org/download/> (sekitar 200MB, sudah termasuk PHP 8.3, Composer, MySQL, Node).
2. Jalankan installer → Next → Finish.
3. Buka **Laragon** → tombol **"Start All"** untuk menjalankan Apache + MySQL.
4. Cek versi di terminal:

   ```bash
   php -v        # PHP 8.3.x
   composer -V   # Composer 2.x
   mysql --version
   ```

### Opsi B — Instal manual (PHP + Composer terpisah)

1. **PHP**: unduh *Windows PHP 8.3 x64 Thread Safe* dari <https://windows.php.net/download/> → ekstrak ke `C:\php`.
2. Salin `C:\php\php.ini-development` menjadi `C:\php\php.ini`, lalu aktifkan ekstensi (hapus tanda `;` di depan):
   ```ini
   extension=openssl
   extension=pdo_mysql
   extension=mbstring
   extension=curl
   extension=zip
   extension=fileinfo
   extension=bcmath
   ```
3. **Composer**: unduh installer dari <https://getcomposer.org/download/> → jalankan, arahkan ke `C:\php\php.exe` → Next selesai.
4. **Tambahkan PATH** (Windows 10/11): *Settings → System → About → Advanced system settings → Environment Variables → Path → Edit → New*:
   ```
   C:\php
   %APPDATA%\Composer\vendor\bin
   ```
5. Buka terminal **baru** lalu verifikasi:
   ```bash
   php -v
   composer -V
   ```

### Opsi C — Chocolatey (jika sudah terpasang)

```powershell
choco install php -y
choco install composer -y
# refresh PATH, lalu:
php -v
composer -V
```

> 💡 Jika `composer` tidak dikenali setelah instalasi, tutup & buka ulang terminal, atau jalankan `refreshenv`.

---

## 🐧 Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install -y php8.3 php8.3-cli php8.3-common php8.3-mysql \
  php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath composer

php -v && composer -V
```

## 🍎 macOS (Homebrew)

```bash
brew install php@8.3 composer
php -v && composer -V
```

## 🐳 Alternatif tanpa instalasi lokal: Docker

Sudah ada `docker-compose.yml` di root. PHP & Composer bisa dijalankan via container:

```bash
docker compose up -d mysql                      # MySQL 8 + phpMyAdmin (port 8080)
docker run --rm -v "$PWD/backend:/app" -w /app composer:latest composer install
```

---

## 🚀 Langkah selanjutnya (menjalankan backend Tanamanku)

```bash
cd backend

# 1. Buat proyek Laravel baru (folder backend harus kosong untuk create-project).
#    Jika sudah berisi scaffold ini, ikuti bagian "Overlay scaffold" di bawah.
composer create-project laravel/laravel . --prefer-dist

# 2. Salin kode Tanamanku ke atasnya (lihat bagian Overlay Scaffold).
# 3. Pasang Sanctum
composer require laravel/sanctum

# 4. Siapkan environment
cp .env.example .env        # Windows: copy .env.example .env
php artisan key:generate

# 5. Migrasi + seed
php artisan migrate --seed

# 6. Jalankan API
php artisan serve           # → http://localhost:8000  (base URL API: /api/v1)

# 7. Scheduler untuk pengingat perawatan (wajib di server)
#    Windows (dev):  php artisan schedule:work
#    Linux (produksi): crontab -e  →  * * * * * cd /path/backend && php artisan schedule:run >> /dev/null 2>&1
```

### Overlay Scaffold

Folder `backend/` di repo ini berisi **kode kustom Tanamanku** (app/, database/, routes/, config/roles.php, tests/). Karena `composer create-project` membutuhkan folder kosong, ikuti salah satu:

**Cara 1 — Scaffold di tempat (disarankan):**

```bash
cd backend
# pindahkan sementara kode kustom ke luar
mv app database routes config tests phpunit.xml .env.example composer.json artisan bootstrap /tmp/tanamanku-scaffold
# buat Laravel baru di folder yang kini kosong
composer create-project laravel/laravel . --prefer-dist
# salin kembali kode kustom di atasnya
cp -r /tmp/tanamanku-scaffold/* .
```

**Cara 2 — Buat di folder lain lalu salin framework:**

```bash
composer create-project laravel/laravel fresh-backend --prefer-dist
# salin boilerplate framework (config, public, storage, resources, vendor, dll.)
cp -r fresh-backend/* backend/
# lalu pastikan kode kustom Tanamanku (app/, database/, routes/, dll.) tetap ada di backend/
```

---

## ✅ Verifikasi instalasi

```bash
cd backend
php artisan --version          # Laravel Framework 11.x
php artisan migrate:fresh --seed
php artisan test               # menjalankan test (Auth + Order)
curl http://localhost:8000/api/v1/health
```

Jika muncul error `Driver [mysql] not supported`, pastikan ekstensi `pdo_mysql` aktif di `php.ini`.

---

## Referensi

- Skema database: `docs/05-database.json`
- Kontrak API: `docs/06-api.json`
- Aturan bisnis & service: `docs/16-business-rules.json`
- Deployment: `docs/18-deployment.json`
