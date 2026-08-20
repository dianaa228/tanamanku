# Backend — Tanamanku (Laravel REST API)

> ⚠️ **PHP 8.3 + Composer belum terpasang** di mesin pengembang saat ini. Ikuti panduan instalasi: **[`docs/INSTALLATION.md`](../docs/INSTALLATION.md)**.

## Teknologi

- **Laravel 11** (PHP 8.2+) · **Eloquent ORM** · **MySQL 8**
- **Laravel Sanctum** — autentikasi token Bearer
- Arsitektur: REST API `/api/v1` (lihat `docs/06-api.json`)

## Struktur Scaffold

```
backend/
├── app/
│   ├── Enums/UserRole.php             → role customer/seller/admin
│   ├── Http/
│   │   ├── Controllers/Api/V1/        → 23 controller tipis (request handling only)
│   │   ├── Middleware/EnsureRole.php  → middleware role
│   │   ├── Requests/                  → validasi per modul (docs/13)
│   │   └── Resources/                 → 8 resource transformasi API
│   ├── Jobs/                          → ProcessPlantReminder, SendOrderNotification, UpdateInventory
│   ├── Models/                        → 33 model Eloquent (docs/05)
│   ├── Notifications/                 → Order, PlantCare, Community
│   ├── Policies/                      → 6 policy (ownership & authorization)
│   ├── Services/                      → 13 service class (business logic — docs/16)
│   └── Support/ApiResponse.php        → format respons sukses/error (docs/06)
├── bootstrap/app.php                  → konfigurasi middleware & routing API v1
├── config/roles.php                   → role & permission map
├── database/
│   ├── migrations/                    → 15 file migration (infra + semua tabel)
│   ├── seeders/                       → Database, Role, Category, PlantSpecies, Admin
│   └── factories/                     → User, Product, PlantSpecies, Post
├── routes/
│   ├── api.php                        → seluruh endpoint /api/v1
│   └── console.php                    → scheduler pengingat perawatan
└── tests/Feature/                     → Auth & Order (business rules)
```

## Cara Menjalankan

```bash
# 1. Pastikan PHP 8.3 + Composer terpasang (docs/INSTALLATION.md)
# 2. Buat proyek Laravel — folder backend/ harus kosong untuk create-project:
#    - pindahkan dulu isi scaffold ini ke folder aman, ATAU
#    - buat proyek baru di folder lain lalu salin boilerplate framework ke sini
#    (detail lengkap: bagian "Overlay Scaffold" di docs/INSTALLATION.md)
composer create-project laravel/laravel . --prefer-dist

# 3. Salin kembali kode Tanamanku (app/, database/, routes/, config/roles.php, tests/)
# 4. Pasang Sanctum + jalankan
composer require laravel/sanctum
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve            # → http://localhost:8000  (API: /api/v1)

# 5. Scheduler pengingat (dev)
php artisan schedule:work
```

## Prinsip Penting (docs/16-business-rules.json)

- **Backend adalah source of truth** — total order, harga, dan stok dihitung & diverifikasi di server.
- Controller tipis; business logic di **Services**.
- Semua resource ownership-sensitive dicek via **Policy** (orders, user_plants, posts, dll.).
- Checkout memakai **database transaction** + pengecekan stok server-side.
- Password di-hash; konfigurasi sensitif hanya di env.

## Referensi

- Skema tabel & kolom: `docs/05-database.json`
- Kontrak API & response format: `docs/06-api.json`
- Service & business rules: `docs/16-business-rules.json`
- Validasi: `docs/13-validation.json` · Keamanan: `docs/12-security.json`
- Pengujian: `docs/17-testing.json` · Deployment: `docs/18-deployment.json`
