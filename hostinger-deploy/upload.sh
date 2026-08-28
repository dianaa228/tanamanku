#!/bin/bash
# ========================================
# Tanamanku — Upload Files via SCP
# ========================================
# Jalankan dari komputer lokal (di folder project root)
# chmod +x hostinger-deploy/upload.sh && ./hostinger-deploy/upload.sh
# ========================================

set -e

HOST="153.92.11.45"
PORT="65002"
USER="u519141514"
REMOTE_HOME="/home/$USER"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo ""
echo "========================================="
echo "  🌱 TANAMANKU — Upload via SCP"
echo "========================================="
echo ""

# ── STEP 1: Build frontend dengan URL production ──
log "Building frontend dengan URL production..."
cd web

# Backup .env lama
[ -f .env ] && cp .env .env.bak

cat > .env << 'EOF'
VITE_MIDTRANS_SANDBOX=true
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-XXXXX
VITE_API_BASE_URL=https://powderblue-moose-368537.hostingersite.com/api/v1
EOF

npm install
npm run build
cd ..

log "Frontend build selesai!"
echo ""

# ── STEP 2: Upload backend ke ~/tanamanku/ ──
log "Upload backend ke server..."
scp -P "$PORT" -r backend/* "$USER@$HOST:$REMOTE_HOME/tanamanku/" 2>/dev/null || \
  warn "SCP gagal — coba upload manual via File Manager hPanel"

# Upload .env
scp -P "$PORT" hostinger-deploy/backend-env "$USER@$HOST:$REMOTE_HOME/tanamanku/.env" 2>/dev/null || \
  warn "Upload .env gagal"
echo ""

# ── STEP 3: Upload frontend ke ~/public_html/ ──
log "Upload frontend ke server..."
scp -P "$PORT" -r web/dist/* "$USER@$HOST:$REMOTE_HOME/public_html/" 2>/dev/null || \
  warn "SCP frontend gagal"

# Upload .htaccess dan api.php
scp -P "$PORT" hostinger-deploy/.htaccess "$USER@$HOST:$REMOTE_HOME/public_html/.htaccess" 2>/dev/null || \
  warn "Upload .htaccess gagal"

scp -P "$PORT" hostinger-deploy/api.php "$USER@$HOST:$REMOTE_HOME/public_html/api.php" 2>/dev/null || \
  warn "Upload api.php gagal"
echo ""

# ── STEP 4: Jalankan setup di server ──
log "Menjalankan setup di server..."
ssh -p "$PORT" "$USER@$HOST" << 'REMOTE_CMD'
cd ~/tanamanku

# Generate APP_KEY
php artisan key:generate --force 2>/dev/null || true

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Install dependencies jika vendor kosong
if [ ! -d vendor ]; then
    composer install --no-dev --optimize-autoloader --no-interaction
fi

# Run migrations
php artisan migrate --force 2>/dev/null || echo "⚠️  Migration: cek database di .env"

# Cache config
php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
REMOTE_CMD

echo ""
echo "========================================="
echo "  ✅ UPLOAD & SETUP SELESAI!"
echo "========================================="
echo ""
log "Website: https://powderblue-moose-368537.hostingersite.com"
log "API:     https://powderblue-moose-368537.hostingersite.com/api/v1/health"
echo ""
