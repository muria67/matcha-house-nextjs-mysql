# Matcha House

Next.js + Express + MySQL untuk toko matcha.

Fitur: halaman customer, menu, keranjang, checkout, pembayaran, login admin/petugas, dashboard, menu & stok, transaksi, laporan, pengguna.

## Database
Jalankan `backend/database.sql` di phpMyAdmin/MySQL. Database: `matcha_house`.

## Backend
```bash
cd backend
npm install
copy .env.example .env
node server.js
```
Tes `http://localhost:5000/test-db`. Admin otomatis dibuat oleh backend: `admin / admin123`.

## Frontend
Di terminal baru dari folder utama:
```bash
npm install
npm run dev
```
Buka `http://localhost:3000`.

Alur: Customer -> Menu -> Keranjang -> Checkout -> MySQL. Staff -> Login -> Dashboard -> Menu/Stok -> Transaksi -> Laporan.
"# matcha-house-nextjs-mysql" 
"# matcha-house-nextjs-mysql" 
