FROM php:8.1-apache

RUN apt-get update && \
    apt-get install -y libzip-dev zip unzip && \
    docker-php-ext-install pdo_mysql

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction

COPY . .

EXPOSE 80
CMD ["apache2-foreground"]
