#!/bin/bash
# ========================================
# Tanamanku — SCP Upload Script
# ========================================
# Upload backend & frontend ke Hostinger
# Jalankan dari root project: bash hostinger-deploy/upload.sh
# ========================================

set -e

# ── Server Config ──
SSH_HOST="153.92.11.45"
SSH_PORT="65002"
SSH_USER="u519141514"
REMOTE_APP="/home/$SSH_USER/tanamanku"
REMOTE_PUBLIC="/home/$SSH_USER/public_html"

# ── Local Paths ──
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
WEB_DIST="$ROOT_DIR/web/dist"
DEPLOY_DIR="$ROOT_DIR/hostinger-deploy"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; exit 1; }
info()  { echo -e "${BLUE}[i]${NC} $1"; }

# ========================================
# Pre-flight Checks
# ========================================
echo ""
echo "========================================="
echo "  🌱 TANAMANKU — SCP Upload Script"
echo "========================================="
echo ""

# Check sshpass
if ! command -v sshpass &> /dev/null; then
    warn "sshpass tidak ditemukan. Menginstall..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install hudochenkov/sshpass/sshpass 2>/dev/null || error "Install sshpass: brew install hudochenkov/sshpass/sshpass"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y sshpass 2>/dev/null || sudo yum install -y sshpass 2>/dev/null || error "Install sshpass manual"
    else
        error "Install sshpass manual untuk OS kamu"
    fi
fi

# Check local dirs exist
[ -d "$BACKEND_DIR" ] || error "Backend directory tidak ditemukan: $BACKEND_DIR"
[ -d "$WEB_DIST" ]    || error "Web dist tidak ditemukan: $WEB_DIST (jalankan: cd web && npm run build)"
[ -f "$DEPLOY_DIR/backend-env" ] || error "backend-env tidak ditemukan: $DEPLOY_DIR/backend-env"
[ -f "$DEPLOY_DIR/.htaccess" ]   || error ".htaccess tidak ditemukan: $DEPLOY_DIR/.htaccess"
[ -f "$DEPLOY_DIR/api.php" ]     || error "api.php tidak ditemukan: $DEPLOY_DIR/api.php"

info "SSH: $SSH_USER@$SSH_HOST:$SSH_PORT"
info "Remote app: $REMOTE_APP"
info "Remote public: $REMOTE_PUBLIC"
echo ""

# ── Ask Password ──
read -sp "Masukkan SSH password: " SSH_PASS
echo ""
echo ""

# ── SSH Command Helper ──
run_ssh() {
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "$1"
}

# ── SCP Helper ──
scp_upload() {
    local src="$1"
    local dst="$2"
    sshpass -p "$SSH_PASS" scp -o StrictHostKeyChecking=no -P "$SSH_PORT" -r "$src" "$SSH_USER@$SSH_HOST:$dst"
}

# ========================================
# STEP 1: Create Directories
# ========================================
log "Membuat direktori di server..."
run_ssh "mkdir -p $REMOTE_APP $REMOTE_PUBLIC" 2>/dev/null || warn "Gagal membuat direktori (mungkin sudah ada)"
echo ""

# ========================================
# STEP 2: Upload Backend
# ========================================
log "📦 Uploading Backend ke $REMOTE_APP/ ..."
echo ""

# Upload core directories
for dir in app bootstrap config database routes resources; do
    if [ -d "$BACKEND_DIR/$dir" ]; then
        info "  → $dir/"
        scp_upload "$BACKEND_DIR/$dir" "$REMOTE_APP/" 2>/dev/null
    fi
done

# Upload vendor (this is the big one)
if [ -d "$BACKEND_DIR/vendor" ]; then
    info "  → vendor/ (large, please wait...)"
    scp_upload "$BACKEND_DIR/vendor" "$REMOTE_APP/" 2>/dev/null
fi

# Upload individual files
for file in artisan composer.json composer.lock phpunit.xml .dockerignore Dockerfile; do
    if [ -f "$BACKEND_DIR/$file" ]; then
        info "  → $file"
        scp_upload "$BACKEND_DIR/$file" "$REMOTE_APP/" 2>/dev/null
    fi
done

# Upload .env
info "  → .env (from backend-env)"
scp_upload "$DEPLOY_DIR/backend-env" "$REMOTE_APP/.env" 2>/dev/null

log "Backend uploaded!"
echo ""

# ========================================
# STEP 3: Upload Frontend
# ========================================
log "🌐 Uploading Frontend ke $REMOTE_PUBLIC/ ..."
echo ""

# Upload dist contents
info "  → dist/ (index.html, assets/, icons/, manifest, etc.)"
scp_upload "$WEB_DIST/"* "$REMOTE_PUBLIC/" 2>/dev/null

# Upload icons directory if exists
if [ -d "$WEB_DIST/icons" ]; then
    info "  → icons/"
    scp_upload "$WEB_DIST/icons" "$REMOTE_PUBLIC/" 2>/dev/null
fi

# Upload deploy-specific files
info "  → .htaccess"
scp_upload "$DEPLOY_DIR/.htaccess" "$REMOTE_PUBLIC/.htaccess" 2>/dev/null

info "  → api.php"
scp_upload "$DEPLOY_DIR/api.php" "$REMOTE_PUBLIC/api.php" 2>/dev/null

log "Frontend uploaded!"
echo ""

# ========================================
# STEP 4: Setup Permissions
# ========================================
log "🔧 Setting permissions..."
run_ssh "chmod -R 775 $REMOTE_APP/storage 2>/dev/null; chmod -R 775 $REMOTE_APP/bootstrap/cache 2>/dev/null; chmod 755 $REMOTE_PUBLIC 2>/dev/null; chmod 644 $REMOTE_PUBLIC/.htaccess 2>/dev/null; chmod 644 $REMOTE_PUBLIC/api.php 2>/dev/null"
echo ""

# ========================================
# STEP 5: Generate APP_KEY (if needed)
# ========================================
log "🔑 Checking APP_KEY..."
HAS_KEY=$(run_ssh "grep -c 'APP_KEY=base64:' $REMOTE_APP/.env 2>/dev/null" || echo "0")
if [ "$HAS_KEY" = "0" ]; then
    info "Generating APP_KEY..."
    run_ssh "cd $REMOTE_APP && php artisan key:generate --force" 2>/dev/null || warn "Gagal generate key — jalankan manual"
else
    log "APP_KEY sudah ada"
fi
echo ""

# ========================================
# STEP 6: Run Migrations
# ========================================
read -p "Jalankan database migrations? (y/n): " RUN_MIGRATE
if [ "$RUN_MIGRATE" = "y" ] || [ "$RUN_MIGRATE" = "Y" ]; then
    log "🗄️ Running migrations..."
    run_ssh "cd $REMOTE_APP && php artisan migrate --force" 2>/dev/null || warn "Migration gagal — cek database di .env"
    echo ""
fi

# ========================================
# STEP 7: Run Seeders (optional)
# ========================================
read -p "Jalankan database seeders? (y/n): " RUN_SEED
if [ "$RUN_SEED" = "y" ] || [ "$RUN_SEED" = "Y" ]; then
    log "🌱 Seeding database..."
    run_ssh "cd $REMOTE_APP && php artisan db:seed --force" 2>/dev/null || warn "Seeder gagal"
    echo ""
fi

# ========================================
# STEP 8: Cache Config
# ========================================
log "⚡ Caching config..."
run_ssh "cd $REMOTE_APP && php artisan config:cache 2>/dev/null; php artisan route:cache 2>/dev/null; php artisan view:cache 2>/dev/null"
echo ""

# ========================================
# STEP 9: Run SQL Migrations (if needed)
# ========================================
if [ -f "$DEPLOY_DIR/create-missing-tables.sql" ]; then
    read -p "Jalankan SQL: create-missing-tables.sql? (y/n): " RUN_SQL
    if [ "$RUN_SQL" = "y" ] || [ "$RUN_SQL" = "Y" ]; then
        log "📄 Running SQL migrations..."
        scp_upload "$DEPLOY_DIR/create-missing-tables.sql" "/tmp/create-missing-tables.sql" 2>/dev/null
        warn "SQL upload selesai — jalankan manual via phpMyAdmin atau SSH:"
        warn "  mysql -u u519141514_tanamanku -p u519141514_tanamanku < /tmp/create-missing-tables.sql"
        echo ""
    fi
fi

# ========================================
# DONE
# ========================================
echo ""
echo "========================================="
echo "  ✅ UPLOAD SELESAI!"
echo "========================================="
echo ""
log "Website: https://powderblue-moose-368537.hostingersite.com/"
log "API:     https://powderblue-moose-368537.hostingersite.com/api/v1/health"
echo ""
warn "Jika ada error, cek log:"
echo "  - Laravel log: ~/tanamanku/storage/logs/laravel.log"
echo "  - PHP error log di hPanel → Metrics → Logs"
echo ""
info "Next steps:"
echo "  1. Buka browser → test login & fitur"
echo "  2. Setelah yakin OK, commit perubahan .env ke git"
echo "  3. Untuk update: jalankan script ini lagi"
echo ""
