#!/bin/bash
# ========================================
# Tanamanku — Deploy Script untuk Hostinger
# ========================================
# Jalankan via SSH Terminal dari hPanel Hostinger
# chmod +x deploy.sh && ./deploy.sh
# ========================================

set -e

# ── Config ──
DOMAIN="powderblue-moose-368537.hostingersite.com"
HOME_DIR="$HOME"
APP_DIR="$HOME_DIR/tanamanku"
PUBLIC_DIR="$HOME_DIR/public_html"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

# ========================================
# STEP 1: Cek Environment
# ========================================
echo ""
echo "========================================="
echo "  🌱 TANAMANKU — Deploy ke Hostinger"
echo "========================================="
echo ""

log "Cek PHP version..."
php -v 2>/dev/null || error "PHP tidak ditemukan di server"
echo ""

log "Cek Composer..."
composer --version 2>/dev/null || warn "Composer tidak ditemukan — akan install manual"
echo ""

# ========================================
# STEP 2: Buat Directory Structure
# ========================================
log "Membuat direktori aplikasi..."
mkdir -p "$APP_DIR"
mkdir -p "$PUBLIC_DIR"
echo ""

# ========================================
# STEP 3: Upload提醒 (User harus upload files dulu)
# ========================================
echo "========================================="
echo "  ⚠️  UPLOAD FILES DULU!"
echo "========================================="
echo ""
warn "Sebelum menjalankan script ini, kamu harus upload files via File Manager atau SCP:"
echo ""
echo "  📁 Upload folder 'backend/' → ~/tanamanku/"
echo "     (termasuk: app/, bootstrap/, config/, database/, routes/, vendor/, artisan)"
echo ""
echo "  📁 Upload folder 'web/dist/' isiannya → ~/public_html/"
echo "     (termasuk: index.html, assets/, icons/, manifest.json, robots.txt)"
echo ""
echo "  📁 Upload file dari 'hostinger-deploy/' → ~/public_html/"
echo "     (termasuk: .htaccess, api.php)"
echo ""
echo "  📁 Upload 'hostinger-deploy/backend-env' → ~/tanamanku/.env"
echo ""

read -p "Tekan Enter setelah semua files ter-upload... "

# ========================================
# STEP 4: Setup Backend (.env)
# ========================================
log "Setup .env untuk backend..."

if [ ! -f "$APP_DIR/.env" ]; then
    if [ -f "$APP_DIR/.env.example" ]; then
        cp "$APP_DIR/.env.example" "$APP_DIR/.env"
        warn ".env.example disalin ke .env — silakan edit manual jika perlu"
    else
        error ".env tidak ditemukan! Upload .env terlebih dahulu."
    fi
fi

# Generate APP_KEY jika belum ada
if ! grep -q "APP_KEY=base64:" "$APP_DIR/.env" 2>/dev/null; then
    log "Generating APP_KEY..."
    cd "$APP_DIR"
    php artisan key:generate --force 2>/dev/null || warn "Gagal generate key — jalankan manual: php artisan key:generate"
    cd - > /dev/null
fi
echo ""

# ========================================
# STEP 5: Setup Permissions
# ========================================
log "Setting permissions..."

# Storage & bootstrap/cache harus writable
chmod -R 775 "$APP_DIR/storage" 2>/dev/null || warn "Gagal set storage permissions"
chmod -R 775 "$APP_DIR/bootstrap/cache" 2>/dev/null || warn "Gagal set cache permissions"

# Pastikan public_html bisa diakses
chmod 755 "$PUBLIC_DIR" 2>/dev/null || true
chmod 644 "$PUBLIC_DIR/.htaccess" 2>/dev/null || true
chmod 644 "$PUBLIC_DIR/api.php" 2>/dev/null || true
chmod 644 "$PUBLIC_DIR/index.html" 2>/dev/null || true
echo ""

# ========================================
# STEP 6: Install Dependencies (jika vendor belum ada)
# ========================================
if [ ! -d "$APP_DIR/vendor" ]; then
    log "Installing Composer dependencies..."
    cd "$APP_DIR"
    composer install --no-dev --optimize-autoloader --no-interaction 2>/dev/null || warn "Composer install gagal — jalankan manual"
    cd - > /dev/null
else
    log "Vendor sudah ada — skip composer install"
fi
echo ""

# ========================================
# STEP 7: Run Migrations
# ========================================
log "Jalankan database migrations..."
cd "$APP_DIR"
php artisan migrate --force 2>/dev/null || warn "Migration gagal — cek koneksi database di .env"
cd - > /dev/null
echo ""

# ========================================
# STEP 8: Seed Database (opsional)
# ========================================
read -p "Jalankan database seeders? (y/n): " RUN_SEED
if [ "$RUN_SEED" = "y" ] || [ "$RUN_SEED" = "Y" ]; then
    log "Seeding database..."
    cd "$APP_DIR"
    php artisan db:seed --force 2>/dev/null || warn "Seeder gagal"
    cd - > /dev/null
fi
echo ""

# ========================================
# STEP 9: Cache Config
# ========================================
log "Cache configuration untuk production..."
cd "$APP_DIR"
php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
php artisan view:cache 2>/dev/null || true
cd - > /dev/null
echo ""

# ========================================
# STEP 10: Clear Old Cache
# ========================================
log "Clear old cache..."
cd "$APP_DIR"
php artisan cache:clear 2>/dev/null || true
php artisan config:clear 2>/dev/null || true
cd - > /dev/null
echo ""

# ========================================
# SELESAI
# ========================================
echo ""
echo "========================================="
echo "  ✅ DEPLOYMENT SELESAI!"
echo "========================================="
echo ""
log "Website: https://$DOMAIN"
log "API:     https://DOMAIN/api/v1/health"
echo ""
warn "Jika ada error, cek:"
echo "  - PHP error log di hPanel → Metrics → Logs"
echo "  - Laravel log: ~/tanamanku/storage/logs/laravel.log"
echo "  - Pastikan database sudah dibuat di hPanel → Databases"
echo ""
