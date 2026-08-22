FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    libzip-dev \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip bcmath gd opcache intl

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# PHP configuration
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Nginx configuration
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Supervisor configuration
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /var/www/html

# Copy application files
COPY --chown=www-data:www-data . /var/www/html

# Install dependencies
RUN if [ -f "composer.json" ]; then \
    composer install --no-dev --optimize-autoloader --no-interaction; \
    fi

# Generate application key if not set
RUN if [ ! -f ".env" ]; then \
    cp .env.example .env && \
    php artisan key:generate --ansi; \
    fi

# Create storage directories
RUN mkdir -p storage/framework/{cache,sessions,views} \
    storage/logs \
    storage/app/public \
    bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
