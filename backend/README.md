# ProExcel Maktaba — Backend NestJS

## Setup

```bash
cd backend
npm install
```

## Configuration

Edit `.env` if needed (defaults work out of the box):
```
PORT=3001
JWT_SECRET=proexcel-secret-key-2026
DB_PATH=./proexcel.sqlite
ADMIN_EMAIL=proexcel2026@gmail.com
ADMIN_PASSWORD=proexcel2026@@
FRONTEND_URL=http://localhost:5500
```

## Run (development)

```bash
# 1. Seed the database (first time only)
npm run seed

# 2. Start the server
npm run start:dev
```

The API will be available at `http://localhost:3001`.

## Production build

```bash
npm run build
npm run seed
npm start
```

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/login | ❌ | Admin login → JWT |
| GET | /api/auth/me | ✅ | Current user info |
| GET | /api/products | ❌ | List products (filters: category, search, sort) |
| POST | /api/products | ✅ | Create product |
| PATCH | /api/products/:id | ✅ | Update product |
| DELETE | /api/products/:id | ✅ | Delete product |
| GET | /api/categories | ❌ | List categories |
| POST | /api/categories | ✅ | Create category |
| GET | /api/orders | ✅ | List orders (filters: status, search, city, sort) |
| GET | /api/orders/stats | ✅ | Dashboard stats |
| POST | /api/orders | ❌ | Place order (checkout) |
| PATCH | /api/orders/:id/status | ✅ | Update order status |
| DELETE | /api/orders/:id | ✅ | Delete order |
| GET | /api/settings | ❌ | Get all settings |
| PATCH | /api/settings | ✅ | Update settings |
| POST | /api/upload/product-image | ✅ | Upload single product image |
| POST | /api/upload/product-images | ✅ | Upload multiple product images |
| POST | /api/upload/logo | ✅ | Upload store logo |
| POST | /api/upload/slider | ✅ | Upload slider image |
| POST | /api/upload/category-image | ✅ | Upload category image |

Uploaded files are served from `/uploads/*`.

## Auth

Send the JWT token as `Authorization: Bearer <token>` header for protected routes.
