# 🌿 Tanamanku

**Urban Gardening Marketplace & Management Platform** — versi 1.0.0
Monorepo untuk platform berkebun perkotaan: belanja tanaman & perlengkapan, kelola kebun pribadi (My Garden), perawatan tanaman terjadwal, serta rekomendasi & diagnosis tanaman.

> Bahasa produk & antarmuka: **Indonesia** · Pasar: **Indonesia**

## 📦 Arsitektur

| Bagian   | Teknologi                          | Keterangan                              |
| -------- | ---------------------------------- | --------------------------------------- |
| `backend`| Laravel 11 + PHP 8.3               | REST API, Eloquent ORM, Sanctum auth    |
| `web`    | React 18 + Vite + Tailwind CSS     | Aplikasi customer / seller / admin web  |
| `mobile` | Flutter (Android + iOS)            | Aplikasi customer mobile                |
| `docs`   | —                                  | Single source of truth (JSON)           |

- Database: **MySQL 8**
- Backend adalah **source of truth**. React & Flutter hanya menangani UI, state, interaksi, dan konsumsi API.
- React & Flutter mengonsumsi **API yang sama** (`/api/v1`).

## 🚀 Memulai Cepat

### Web (React)

```bash
cd web
npm install
npm run dev        # development → http://localhost:5173
npm run build      # production build
```

### Backend (Laravel) — butuh PHP 8.3 + Composer

Panduan instalasi PHP & Composer (Windows/Linux/macOS/Docker): **[`docs/INSTALLATION.md`](docs/INSTALLATION.md)**

```bash
cd backend
composer create-project laravel/laravel . --prefer-dist   # lihat overlay scaffold di docs/INSTALLATION.md
composer require laravel/sanctum
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve      # → http://localhost:8000
```

### Mobile (Flutter) — butuh Flutter SDK

```bash
cd mobile
flutter pub get
flutter run
```

### Database via Docker (opsional)

```bash
docker compose up -d mysql
```

## 📚 Dokumentasi

Seluruh keputusan proyek terdokumentasi dalam JSON di `docs/`:

| File                          | Isi                            |
| ----------------------------- | ------------------------------ |
| `docs/00-project.json`        | Ringkasan proyek               |
| `docs/01-product.json`        | Definisi produk & marketplace  |
| `docs/02-business.json`       | Model bisnis                   |
| `docs/03-user-roles.json`     | Role & permission              |
| `docs/04-features.json`       | Fitur (MVP / next / future)    |
| `docs/05-database.json`       | Skema & domain database        |
| `docs/06-api.json`            | Arsitektur API                 |
| `docs/07-web-react.json`      | Struktur aplikasi React        |
| `docs/08-mobile-flutter.json` | Struktur aplikasi Flutter      |
| `docs/09-admin.json`          | Modul admin                    |
| `docs/10-seller.json`         | Modul seller                   |
| `docs/11-ui-ux.json`          | Pedoman desain UI/UX           |
| `docs/12-security.json`       | Arsitektur keamanan            |
| `docs/13-validation.json`     | Aturan validasi                |
| `docs/14-notification.json`   | Notifikasi                     |
| `docs/15-payment.json`        | Pembayaran                     |
| `docs/16-business-rules.json` | Aturan bisnis                  |
| `docs/17-testing.json`        | Strategi pengujian             |
| `docs/18-deployment.json`     | Deployment                     |
| `docs/19-development-rules.json` | Aturan & urutan pengembangan |

## 🗺️ Roadmap (12 fase)

1. **Project Foundation** — Laravel, React, Flutter, MySQL, API
2. **Authentication** — users, roles, Sanctum
3. **Marketplace** — kategori, toko, produk, stok, pencarian
4. **Commerce** — keranjang, checkout, pesanan, pembayaran, pengiriman, ulasan
5. **My Garden** — spesies, tanaman pengguna, foto, pertumbuhan, catatan perawatan
6. **Plant Care** — pengingat, penyiraman, pemupukan, repotting, notifikasi
7. **Smart Plant** — Plant Finder, rule engine, diagnosis
8. **Community** — post, komentar, like, laporan
9. **Seller** — dashboard, produk, stok, pesanan, penjualan
10. **Services** — jasa berkebun & pemesanan
11. **Plant Exchange** — listing & tukar tanaman
12. **Testing & Production**

## 🎯 Cakupan MVP

Autentikasi · Produk & Kategori · Pencarian · Detail Produk · Keranjang · Checkout · Pesanan · My Garden · Pengingat Perawatan

---

*Dibangun dengan 🧡 oleh tim Tanamanku.*
