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

## Setup

### 1 Install dipendenze

composer install
npm install

### 2 Reset database (opzionale)

php artisan migrate:fresh


### 3 Avvio in locale
Apri due terminali:

-Terminale A (Laravel)
php artisan serve

-Terminale B 
npm run dev