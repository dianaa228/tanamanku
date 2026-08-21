# Setup Database & Backend Tanamanku

## Status Saat Ini
- ✅ Backend scaffold sudah lengkap (Laravel 11)
- ✅ PHP 8.2.33 tersedia di `C:\xampp\php.exe`
- ✅ MySQL/MariaDB process running
- ❌ MySQL handshake error (perlu restart XAMPP atau fix config)
- ✅ Config files sudah dibuat (database.php, app.php, auth.php)
- ✅ Migration baru sudah dibuat (Loyalty, Subscription, Nursery)
- ✅ Models, Controllers, Services sudah dibuat
- ✅ Routes sudah diupdate

## Yang Perlu Dilakukan Manual

### 1. Fix MySQL Connection (XAMPP)
```bash
# Buka XAMPP Control Panel
# Stop MySQL, lalu Start ulang
# Atau restart komputer

# Test koneksi:
C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1"
```

### 2. Buat Database
```bash
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE tanamanku CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
```

### 3. Generate APP_KEY
```bash
cd backend
C:\xampp\php.exe artisan key:generate
```

### 4. Jalankan Migration
```bash
cd backend
C:\xampp\php.exe artisan migrate
```

### 5. Seed Database (opsional)
```bash
cd backend
C:\xampp\php.exe artisan db:seed
```

### 6. Jalankan Backend
```bash
cd backend
C:\xampp\php.exe artisan serve
# API akan jalan di http://localhost:8000
```

### 7. Test API
```bash
# Health check
curl http://localhost:8000/api/v1/health

# Login (setelah seed)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tanamanku.id","password":"password"}'
```

### 8. Connect Frontend
Frontend sudah otomatis detect backend. Saat backend nyala:
- Buka http://localhost:5173
- Frontend akan switch dari mock mode ke API mode

## Troubleshooting

### MySQL Handshake Error
1. Buka XAMPP Control Panel
2. Klik "Stop" pada MySQL
3. Tunggu 5 detik
4. Klik "Start" pada MySQL
5. Test lagi: `C:\xampp\mysql\bin\mysql.exe -u root -e "SELECT 1"`

### Port Conflict
Jika port 3306 sudah dipakai:
1. Edit `C:\xampp\mysql\bin\my.ini`
2. Ganti `port=3306` ke port lain (misal 3307)
3. Update `backend/.env`: `DB_PORT=3307`
4. Restart MySQL

### PHP Not Found
Pastikan path PHP benar:
```bash
C:\xampp\php.exe --version
```

## File Yang Sudah Dibuat/Diupdate

### Config Files (baru)
- `backend/config/database.php`
- `backend/config/app.php`
- `backend/config/auth.php`

### Migrations (baru)
- `2026_08_10_000015_create_loyalty_tables.php`
- `2026_08_10_000016_create_subscription_tables.php`
- `2026_08_10_000017_create_nursery_tables.php`

### Models (baru)
- `backend/app/Models/LoyaltyProfile.php`
- `backend/app/Models/LoyaltyReward.php`
- `backend/app/Models/LoyaltyTransaction.php`
- `backend/app/Models/SubscriptionPlan.php`
- `backend/app/Models/Subscription.php`
- `backend/app/Models/Nursery.php`
- `backend/app/Models/NurseryProduct.php`

### Services (baru)
- `backend/app/Services/LoyaltyService.php`
- `backend/app/Services/SubscriptionService.php`
- `backend/app/Services/NurseryService.php`
- `backend/app/Services/AnalyticsService.php`

### Controllers (baru)
- `backend/app/Http/Controllers/Api/V1/LoyaltyController.php`
- `backend/app/Http/Controllers/Api/V1/SubscriptionController.php`
- `backend/app/Http/Controllers/Api/V1/NurseryController.php`
- `backend/app/Http/Controllers/Api/V1/AnalyticsController.php`

### Routes (diupdate)
- `backend/routes/api.php` — ditambah endpoint Loyalty, Subscription, Nursery, Analytics
