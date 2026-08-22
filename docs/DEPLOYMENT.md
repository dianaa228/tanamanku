# 🚀 Panduan Deployment Produksi — Tanamanku

## Ikhtisar

Panduan ini menjelaskan cara mendeploy Tanamanku ke server produksi menggunakan **Docker** atau **manual setup**. Arsitektur produksi menggunakan **Nginx + PHP 8.3-FPM + MySQL 8 + Redis**.

| Komponen | Port | Keterangan |
|----------|------|------------|
| Nginx (reverse proxy) | 80, 443 | Routing & SSL termination |
| Backend API | 8000 | Laravel PHP-FPM |
| Web App | 5173 | React SPA (Nginx) |
| MySQL | 3306 | Database |
| Redis | 6379 | Cache & Queue |

---

## 📋 Prasyarat Server

### Minimum Requirements

| Resource | Minimum | Disarankan |
|----------|---------|------------|
| CPU | 2 vCPU | 4 vCPU |
| RAM | 2 GB | 4 GB |
| Storage | 20 GB SSD | 50 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

### Software Required

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

---

## 🔧 Konfigurasi Environment

### 1. Buat `.env.production`

```bash
cp .env.example .env.production
```

Edit `.env.production`:

```ini
APP_NAME="Tanamanku"
APP_ENV=production
APP_KEY=base64:GENERATE_WITH_php_artisan_key_generate
APP_DEBUG=false
APP_URL=https://api.tanamanku.id
APP_TIMEZONE=Asia/Jakarta

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=tanamanku
DB_USERNAME=tanamanku
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

FRONTEND_URL=https://tanamanku.id

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# Payment gateway
PAYMENT_PROVIDER=midtrans
PAYMENT_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Mail (opsional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=YOUR_MAIL_USERNAME
MAIL_PASSWORD=YOUR_MAIL_PASSWORD
MAIL_FROM_ADDRESS="noreply@tanamanku.id"
MAIL_FROM_NAME="Tanamanku"
```

### 2. Generate APP_KEY

```bash
docker run --rm -v "$(pwd)/backend:/app" -w /app composer:latest \
  php artisan key:generate --show
```

Copy hasilnya ke `APP_KEY` di `.env.production`.

---

## 🐳 Deployment dengan Docker (Disarankan)

### Step 1: Clone & Setup

```bash
git clone https://github.com/your-repo/tanamanku.git
cd tanamanku

# Copy environment
cp backend/.env.example backend/.env
# Edit backend/.env sesuai konfigurasi produksi (lihat di atas)
```

### Step 2: Build & Start Services

```bash
# Build semua image
docker compose -f docker-compose.prod.yml up -d --build

# Atau build satu per satu
docker compose build backend
docker compose build web
docker compose up -d
```

### Step 3: Setup Database

```bash
# Jalankan migrasi
docker compose exec backend php artisan migrate --force

# Jalankan seeders (hanya untuk pertama kali)
docker compose exec backend php artisan db:seed --force

# Storage link
docker compose exec backend php artisan storage:link
```

### Step 4: Cache Configuration

```bash
docker compose exec backend php artisan config:cache
docker compose exec backend php artisan route:cache
docker compose exec backend php artisan view:cache
docker compose exec backend php artisan event:cache
```

### Step 5: Setup Scheduler & Queue

```bash
# Tambahkan cron ke host
crontab -e
```

Tambahkan baris:

```
* * * * * docker compose -f /path/to/tanamanku/docker-compose.prod.yml exec -T backend php artisan schedule:run >> /dev/null 2>&1
```

```bash
# Jalankan queue worker (background jobs)
docker compose exec backend php artisan queue:work --sleep=3 --tries=3
```

### Step 6: Setup Reverse Proxy (Nginx)

Buat `/etc/nginx/sites-available/tanamanku`:

```nginx
server {
    listen 80;
    server_name api.tanamanku.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.tanamanku.id;

    ssl_certificate /etc/letsencrypt/live/api.tanamanku.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tanamanku.id/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:8000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```nginx
# Web app
server {
    listen 80;
    server_name tanamanku.id;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tanamanku.id;

    ssl_certificate /etc/letsencrypt/live/tanamanku.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tanamanku.id/privkey.pem;

    root /var/www/tanamanku/web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tanamanku /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Setup SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d tanamanku.id -d api.tanamanku.id
sudo certbot renew --dry-run
```

---

## 🔧 Manual Setup (Tanpa Docker)

### Step 1: Install Dependencies

```bash
# PHP 8.3
sudo apt install -y php8.3 php8.3-fpm php8.3-mysql php8.3-mbstring \
  php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-gd php8.3-intl

# MySQL 8
sudo apt install -y mysql-server

# Redis
sudo apt install -y redis-server

# Nginx
sudo apt install -y nginx

# Node.js (untuk build web)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### Step 2: Setup Database

```bash
sudo mysql -u root -e "CREATE DATABASE tanamanku CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -u root -e "CREATE USER 'tanamanku'@'localhost' IDENTIFIED BY 'YOUR_PASSWORD';"
sudo mysql -u root -e "GRANT ALL PRIVILEGES ON tanamanku.* TO 'tanamanku'@'localhost';"
sudo mysql -u root -e "FLUSH PRIVILEGES;"
```

### Step 3: Setup Backend

```bash
cd /var/www/tanamanku/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Environment
cp .env.example .env
php artisan key:generate

# Edit .env sesuai konfigurasi

# Migrate & seed
php artisan migrate --force
php artisan db:seed --force

# Storage link
php artisan storage:link

# Cache
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### Step 4: Setup Web

```bash
cd /var/www/tanamanku/web

# Install & build
npm ci
npm run build

# Copy ke web root
sudo cp -r dist /var/www/tanamanku-web
sudo chown -R www-data:www-data /var/www/tanamanku-web
```

### Step 5: Setup Nginx

Buat `/etc/nginx/sites-available/tanamanku` (lihat konfigurasi di atas).

### Step 6: Setup PHP-FPM

```bash
# Pastikan php-fpm listen ke socket
sudo sed -i 's/listen = .*/listen = \/run\/php\/php8.3-fpm.sock/' /etc/php/8.3/fpm/pool.d/www.conf
sudo systemctl restart php8.3-fpm
```

### Step 7: Setup Supervisor (Queue Worker)

```bash
sudo apt install supervisor -y
```

Buat `/etc/supervisor/conf.d/tanamanku-worker.conf`:

```ini
[program:tanamanku-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/tanamanku/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/tanamanku/worker.log
stopwaitsecs=3600
```

```bash
sudo mkdir -p /var/log/tanamanku
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start tanamanku-worker:*
```

### Step 8: Setup Cron

```bash
crontab -e
```

Tambahkan:

```
* * * * * cd /var/www/tanamanku/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔒 Checklist Keamanan Produksi

- [ ] `APP_DEBUG=false` di `.env`
- [ ] `APP_KEY` sudah di-generate
- [ ] Password database kuat & unik
- [ ] SSL/TLS aktif (HTTPS)
- [ ] `APP_URL` dan `FRONTEND_URL` benar
- [ ] CORS dikonfigurasi untuk domain produksi
- [ ] Rate limiting aktif
- [ ] File permissions dikunci (775 untuk storage, 644 untuk file)
- [ ] SSH key-based auth (disable password login)
- [ ] Firewall aktif (ufw)

```bash
# UFW setup
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 💾 Backup Database

### Manual Backup

```bash
# Backup
docker compose exec mysql mysqldump -u root -proot_secret tanamanku > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker compose exec -T mysql mysql -u root -proot_secret tanamanku < backup.sql
```

### Automated Daily Backup

```bash
# Tambah cron
crontab -e
```

```
0 2 * * * docker compose -f /path/to/tanamanku/docker-compose.prod.yml exec -T mysql mysqldump -u root -proot_secret tanamanku | gzip > /backups/tanamanku_$(date +\%Y\%m\%d).sql.gz
```

### Retention Policy

```bash
# Hapus backup lebih dari 14 hari
0 3 * * * find /backups -name "tanamanku_*.sql.gz" -mtime +14 -delete
```

---

## 📊 Monitoring

### Health Check

```bash
# Backend API
curl -s http://localhost:8000/api/v1/health | jq .

# Database
docker compose exec mysql mysqladmin ping -h localhost -proot_secret
```

### Log Files

```bash
# Laravel logs
docker compose exec backend tail -f storage/logs/laravel.log

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Queue worker logs
sudo tail -f /var/log/tanamanku/worker.log
```

### Metrics to Monitor

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | > 1% | Check logs |
| Response time | > 2s | Optimize queries |
| Queue lag | > 100 jobs | Scale workers |
| Disk usage | > 80% | Cleanup logs/backups |
| Memory usage | > 80% | Scale server |

---

## 🔄 Update Deployment

```bash
# Pull latest code
git pull origin master

# Backend updates
docker compose exec backend composer install --no-dev --optimize-autoloader
docker compose exec backend php artisan migrate --force
docker compose exec backend php artisan config:cache
docker compose exec backend php artisan route:cache

# Web updates
cd web && npm ci && npm run build
cd ..

# Restart services
docker compose restart backend web

# Clear caches if needed
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan view:clear
```

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `502 Bad Gateway` | Cek PHP-FPM running: `systemctl status php8.3-fpm` |
| `Database connection refused` | Cek MySQL running: `docker compose ps mysql` |
| `Permission denied` | `sudo chown -R www-data:www-data storage bootstrap/cache` |
| `Cache not cleared` | `docker compose exec backend php artisan cache:clear` |
| `Queue jobs stuck` | `docker compose exec backend php artisan queue:restart` |
| `SSL not working` | `sudo certbot renew --force-renewal` |
| `Migration failed` | `docker compose exec backend php artisan migrate:status` |

---

## 📚 Referensi

- [Laravel Deployment](https://laravel.com/docs/11.x/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
