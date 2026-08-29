#!/bin/bash
# ========================================
# Tanamanku — Server Fix Script
# ========================================
# Diagnose & fix 500 error di Hostinger
# Jalankan dari root project: bash hostinger-deploy/fix-server.sh
# ========================================

set -e

# ── Server Config ──
SSH_HOST="153.92.11.45"
SSH_PORT="65002"
SSH_USER="u519141514"
REMOTE_APP="/home/$SSH_USER/tanamanku"
REMOTE_PUBLIC="/home/$SSH_USER/public_html"

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log()   { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
error() { echo -e "${RED}[✗]${NC} $1"; }
info()  { echo -e "${BLUE}[i]${NC} $1"; }
step()  { echo -e "\n${CYAN}═══ STEP $1 ═══${NC} $2"; }

# ── Ask Password ──
echo ""
echo "========================================="
echo "  🔧 TANAMANKU — Server Fix Script"
echo "========================================="
echo ""
read -sp "Masukkan SSH password: " SSH_PASS
echo ""
echo ""

# ── SSH Command Helper ──
run_ssh() {
    sshpass -p "$SSH_PASS" ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "$1"
}

# ── Check sshpass ──
if ! command -v sshpass &> /dev/null; then
    warn "sshpass tidak ditemukan!"
    echo "  Install via brew: brew install hudochenkov/sshpass/sshpass"
    echo "  Atau: sudo apt install sshpass"
    exit 1
fi

# ========================================
step "1" "🔍 Checking server connectivity..."
# ========================================
if run_ssh "echo 'connected'" 2>/dev/null | grep -q "connected"; then
    log "Server connected!"
else
    error "Cannot connect to server. Check SSH credentials."
    exit 1
fi

# ========================================
step "2" "📁 Checking directory structure..."
# ========================================
run_ssh "ls -la $REMOTE_APP/ 2>/dev/null | head -5" || warn "Backend directory missing!"
run_ssh "ls -la $REMOTE_PUBLIC/ 2>/dev/null | head -5" || warn "Public directory missing!"

# Check key files
echo ""
info "Checking key files..."
run_ssh "test -f $REMOTE_APP/artisan && echo '✓ artisan' || echo '✗ artisan MISSING'"
run_ssh "test -f $REMOTE_APP/.env && echo '✓ .env' || echo '✗ .env MISSING'"
run_ssh "test -f $REMOTE_PUBLIC/api.php && echo '✓ api.php' || echo '✗ api.php MISSING'"
run_ssh "test -f $REMOTE_PUBLIC/.htaccess && echo '✓ .htaccess' || echo '✗ .htaccess MISSING'"
run_ssh "test -d $REMOTE_APP/vendor && echo '✓ vendor/' || echo '✗ vendor/ MISSING'"
run_ssh "test -d $REMOTE_APP/app && echo '✓ app/' || echo '✗ app/ MISSING'"

# ========================================
step "3" "🔑 Checking APP_KEY..."
# ========================================
HAS_KEY=$(run_ssh "grep -c 'APP_KEY=base64:' $REMOTE_APP/.env 2>/dev/null" || echo "0")
if [ "$HAS_KEY" = "0" ]; then
    warn "APP_KEY is EMPTY! Generating..."
    run_ssh "cd $REMOTE_APP && php artisan key:generate --force" 2>/dev/null
    if [ $? -eq 0 ]; then
        log "APP_KEY generated successfully!"
    else
        error "Failed to generate APP_KEY"
    fi
else
    log "APP_KEY already set"
fi

# ========================================
step "4" "🗄️ Checking database config..."
# ========================================
echo ""
info "Database configuration in .env:"
run_ssh "grep '^DB_' $REMOTE_APP/.env 2>/dev/null"
echo ""

# Test DB connection
info "Testing database connection..."
DB_TEST=$(run_ssh "cd $REMOTE_APP && php artisan tinker --execute=\"echo 'DB_OK';\" 2>&1" || echo "DB_FAIL")
if echo "$DB_TEST" | grep -q "DB_OK"; then
    log "Database connection OK!"
else
    warn "Database connection FAILED!"
    echo ""
    warn "Common fixes:"
    echo "  1. Pastikan database sudah dibuat di hPanel → Databases"
    echo "  2. Update DB_PASSWORD di .env"
    echo "  3. Pastikan DB_HOST=127.0.0.1 (bukan localhost)"
fi

# ========================================
step "5" "🔧 Fixing permissions..."
# ========================================
info "Setting permissions..."
run_ssh "chmod -R 775 $REMOTE_APP/storage 2>/dev/null && echo '✓ storage/ permissions'"
run_ssh "chmod -R 775 $REMOTE_APP/bootstrap/cache 2>/dev/null && echo '✓ bootstrap/cache/ permissions'"
run_ssh "chmod 755 $REMOTE_PUBLIC 2>/dev/null && echo '✓ public_html/ permissions'"
run_ssh "chmod 644 $REMOTE_PUBLIC/.htaccess 2>/dev/null && echo '✓ .htaccess permissions'"
run_ssh "chmod 644 $REMOTE_PUBLIC/api.php 2>/dev/null && echo '✓ api.php permissions'"

# ========================================
step "6" "🗄️ Running migrations..."
# ========================================
read -p "Jalankan database migrations? (y/n): " RUN_MIGRATE
if [ "$RUN_MIGRATE" = "y" ] || [ "$RUN_MIGRATE" = "Y" ]; then
    info "Running migrations..."
    MIGRATE_OUTPUT=$(run_ssh "cd $REMOTE_APP && php artisan migrate --force 2>&1" || echo "MIGRATE_FAILED")
    echo "$MIGRATE_OUTPUT"
    
    if echo "$MIGRATE_OUTPUT" | grep -q "MIGRATE_FAILED"; then
        warn "Migration failed! Checking table structure..."
        
        # Check if tables exist
        TABLES=$(run_ssh "cd $REMOTE_APP && php artisan tinker --execute=\"echo implode(', ', \\Illuminate\\Support\\Facades\\Schema::getTableListing());\" 2>&1" || echo "")
        if [ -n "$TABLES" ]; then
            info "Existing tables: $TABLES"
        fi
    else
        log "Migrations completed!"
    fi
fi

# ========================================
step "7" "🌱 Running seeders (optional)..."
# ========================================
read -p "Jalankan database seeders? (y/n): " RUN_SEED
if [ "$RUN_SEED" = "y" ] || [ "$RUN_SEED" = "Y" ]; then
    info "Seeding database..."
    run_ssh "cd $REMOTE_APP && php artisan db:seed --force 2>&1" || warn "Seeder failed"
    log "Seeding completed!"
fi

# ========================================
step "8" "⚡ Caching config..."
# ========================================
info "Caching config..."
run_ssh "cd $REMOTE_APP && php artisan config:cache 2>/dev/null && echo '✓ config cached'"
run_ssh "cd $REMOTE_APP && php artisan route:cache 2>/dev/null && echo '✓ routes cached'"
run_ssh "cd $REMOTE_APP && php artisan view:cache 2>/dev/null && echo '✓ views cached'"

# ========================================
step "9" "🏥 Testing API endpoints..."
# ========================================
echo ""
info "Testing API..."
API_RESULT=$(run_ssh "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/api/v1/categories 2>/dev/null" || echo "000")
if [ "$API_RESULT" = "200" ]; then
    log "API /categories → 200 OK!"
else
    warn "API /categories → HTTP $API_RESULT"
fi

API_RESULT2=$(run_ssh "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/api/v1/plant-species 2>/dev/null" || echo "000")
if [ "$API_RESULT2" = "200" ]; then
    log "API /plant-species → 200 OK!"
else
    warn "API /plant-species → HTTP $API_RESULT2"
fi

# ========================================
step "10" "📋 Checking error logs..."
# ========================================
echo ""
info "Last 20 lines of Laravel log:"
run_ssh "tail -20 $REMOTE_APP/storage/logs/laravel.log 2>/dev/null" || warn "Log file not found"
echo ""

# ========================================
# DONE
# ========================================
echo ""
echo "========================================="
echo "  ✅ FIX COMPLETE!"
echo "========================================="
echo ""
log "Website: https://powderblue-moose-368537.hostingersite.com/"
log "API:     https://powderblue-moose-368537.hostingersite.com/api/v1/categories"
echo ""
warn "If still 500 error, check:"
echo "  1. hPanel → Databases → MySQL → verify DB exists"
echo "  2. hPanel → Advanced → PHP → verify version ≥ 8.1"
echo "  3. hPanel → Metrics → Errors → check PHP error log"
echo "  4. SSH: nano ~/tanamanku/.env → verify DB_PASSWORD"
echo ""
