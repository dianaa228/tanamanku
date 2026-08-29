#!/bin/bash
# ========================================
# Tanamanku — Quick API Test (SSH)
# ========================================
# Test API dari server Hostinger
# Jalankan: bash hostinger-deploy/test-api.sh
# ========================================

SSH_OPTS="-o StrictHostKeyChecking=no -o ConnectTimeout=10 -p 65002"
SSH_USER="u519141514"
SSH_HOST="153.92.11.45"

echo "🔧 Connecting to server..."
echo "Ketika diminta password, masukkan: Tanamanku1\""
echo ""

ssh $SSH_OPTS "$SSH_USER@$SSH_HOST" bash -s <<'REMOTE_SCRIPT'
echo "═══════════════════════════════════════"
echo "  🔍 SERVER DIAGNOSTIC"
echo "═══════════════════════════════════════"
echo ""

echo "--- 1. Cek file di public_html ---"
ls -la ~/public_html/.htaccess 2>/dev/null && echo "✓ .htaccess ada" || echo "✗ .htaccess TIDAK ADA!"
ls -la ~/public_html/api.php 2>/dev/null && echo "✓ api.php ada" || echo "✗ api.php TIDAK ADA!"
ls -la ~/public_html/index.html 2>/dev/null && echo "✓ index.html ada" || echo "✗ index.html TIDAK ADA!"
echo ""

echo "--- 2. Cek web.php ---"
head -3 ~/tanamanku/routes/web.php
echo ""

echo "--- 3. Cek .env (DB config) ---"
grep '^DB_' ~/tanamanku/.env
echo ""

echo "--- 4. Clear & rebuild cache ---"
cd ~/tanamanku
php artisan config:clear 2>/dev/null
php artisan route:clear 2>/dev/null
php artisan cache:clear 2>/dev/null
php artisan config:cache 2>/dev/null
php artisan route:cache 2>/dev/null
echo "✓ Cache rebuilt"
echo ""

echo "--- 5. Test API dari server ---"
echo "GET /api/v1/categories:"
curl -s -w "\nHTTP Status: %{http_code}\n" http://127.0.0.1/api/v1/categories 2>/dev/null | head -5
echo ""
echo "GET /api/v1/plant-species:"
curl -s -w "\nHTTP Status: %{http_code}\n" http://127.0.0.1/api/v1/plant-species 2>/dev/null | head -5
echo ""

echo "--- 6. Cek route list ---"
cd ~/tanamanku
php artisan route:list --path=api 2>/dev/null | head -20
echo ""

echo "--- 7. Last 10 error logs ---"
tail -10 ~/tanamanku/storage/logs/laravel.log 2>/dev/null || echo "No log file"
echo ""

echo "═══════════════════════════════════════"
echo "  ✅ DIAGNOSTIC COMPLETE"
echo "═══════════════════════════════════════"
REMOTE_SCRIPT
