# Simple Project Manager (Laravel + Vite + Vue 3 + TS + Tailwind)

Web app per gestire Progetti e Task.

## Tech Stack
- Backend: Laravel (API REST)
- Frontend: Vue 3 + TypeScript (`<script setup lang="ts">`) integrato in Laravel tramite Vite
- Styling: Tailwind CSS

## Requisiti
- PHP 8+
- Composer
- Node.js + npm

## Setup & Run (comandi completi)

```bash
# 1) Install dipendenze
composer install
npm install

# 2) Config .env + APP_KEY
cp .env.example .env
php artisan key:generate

# 3) Database SQLite: crea file
mkdir -p database
touch database/database.sqlite

# 4) Imposta nel .env:
# DB_CONNECTION=sqlite
# DB_DATABASE=database/database.sqlite

# 5) Pulisci cache e migra
php artisan optimize:clear
php artisan migrate

# 6) Avvio (due terminali)
# Terminale A:
php artisan serve

# Terminale B:
npm run dev
