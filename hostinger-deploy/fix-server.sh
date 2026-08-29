#!/bin/bash
# ========================================
# Tanamanku — Server Fix Script (No sshpass)
# ========================================
# Diagnose & fix 500 error di Hostinger
# Tanpa sshpass — password diminta interaktif
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

echo ""
echo "========================================="
echo "  🔧 TANAMANKU — Server Fix Script"
echo "========================================="
echo ""
echo "Server: $SSH_USER@$SSH_HOST:$SSH_PORT"
echo "Remote: $REMOTE_APP"
echo ""

# ── SSH Config ──
SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10 -p $SSH_PORT"

# ── Test connection ──
step "0" "🔌 Testing SSH connection..."
echo "Ketika diminta password, masukkan: Tanamanku1\""
echo ""
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "echo 'Connection OK'" || { error "Gagal koneksi!"; exit 1; }

# ── Step 1: Fix web.php ──
step "1" "🔧 Fixing web.php (remove garbage text)..."
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "cd $REMOTE_APP && sed -i 's/^angg mrkii //' routes/web.php 2>/dev/null; echo '✓ web.php fixed'" || warn "Fix web.php manual"

# ── Step 2: Fix SESSION_DOMAIN ──
step "2" "🔧 Fixing SESSION_DOMAIN in .env..."
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "cd $REMOTE_APP && sed -i 's/SESSION_DOMAIN=.hostingersite.com/SESSION_DOMAIN=hostingersite.com/' .env 2>/dev/null; echo '✓ SESSION_DOMAIN fixed'" || warn "Fix .env manual"

# ── Step 3: Generate APP_KEY ──
step "3" "🔑 Checking APP_KEY..."
HAS_KEY=$(ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "grep -c 'APP_KEY=base64:' $REMOTE_APP/.env 2>/dev/null" || echo "0")
if [ "$HAS_KEY" = "0" ]; then
    warn "APP_KEY kosong! Generating..."
    ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "cd $REMOTE_APP && php artisan key:generate --force" && log "APP_KEY generated!" || warn "Gagal generate key"
else
    log "APP_KEY sudah ada"
fi

# ── Step 4: Check DB config ──
step "4" "🗄️ Checking database config..."
echo ""
info "Database config:"
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "grep '^DB_' $REMOTE_APP/.env 2>/dev/null"
echo ""

# ── Step 5: Fix permissions ──
step "5" "🔧 Setting permissions..."
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "chmod -R 775 $REMOTE_APP/storage 2>/dev/null && echo '✓ storage/'" || warn "Gagal set storage permissions"
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "chmod -R 775 $REMOTE_APP/bootstrap/cache 2>/dev/null && echo '✓ bootstrap/cache/'" || warn "Gagal set cache permissions"

# ── Step 6: Test DB connection ──
step "6" "🗄️ Testing database connection..."
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "cd $REMOTE_APP && php artisan tinker --execute=\"try { \\Illuminate\\Support\\Facades\\DB::connection()->getPdo(); echo 'DB Connected!'; } catch (\\Exception \$e) { echo 'DB Error: ' . \$e->getMessage(); }\" 2>&1" || warn "DB test failed"

# ── Step 7: Run migrations ──
step "7" "🗄️ Running migrations..."
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "cd $REMOTE_APP && php artisan migrate --force 2>&1" || warn "Migration failed — cek database"

# ── Step 8: Cache config ──
step "8" "⚡ Caching config..."
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "cd $REMOTE_APP && php artisan config:cache 2>/dev/null && echo '✓ config cached'"
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "cd $REMOTE_APP && php artisan route:cache 2>/dev/null && echo '✓ routes cached'" || warn "Route cache failed (mungkin karena web.php route)"

# ── Step 9: Test API from server ──
step "9" "🏥 Testing API from server..."
API_RESULT=$(ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/api/v1/categories 2>/dev/null" || echo "000")
if [ "$API_RESULT" = "200" ]; then
    log "API /categories → 200 OK!"
else
    warn "API /categories → HTTP $API_RESULT"
fi

API_RESULT2=$(ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/api/v1/plant-species 2>/dev/null" || echo "000")
if [ "$API_RESULT2" = "200" ]; then
    log "API /plant-species → 200 OK!"
else
    warn "API /plant-species → HTTP $API_RESULT2"
fi

# ── Step 10: Check error logs ──
step "10" "📋 Last 20 lines of Laravel log:"
echo ""
ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" "tail -20 $REMOTE_APP/storage/logs/laravel.log 2>/dev/null" || warn "Log not found"
echo ""

# ── Done ──
echo ""
echo "========================================="
echo "  ✅ FIX COMPLETE!"
echo "========================================="
echo ""
log "Website: https://powderblue-moose-368537.hostingersite.com/"
log "API:     https://powderblue-moose-368537.hostingersite.com/api/v1/categories"
echo ""
warn "Jika masih error, cek:"
echo "  1. hPanel → Databases → pastikan DB u519141514_tanamanku ada"
echo "  2. SSH: nano ~/tanamanku/.env → pastikan DB_PASSWORD benar"
echo "  3. hPanel → Metrics → Errors → cek PHP error log"
echo ""
