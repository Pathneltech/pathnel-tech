# Pathnel Tech — E-Commerce MVP

A full-stack e-commerce platform for consumer electronics and tech accessories, built with React, Node.js/Express, and SQLite.

---

## 📁 Project Structure

```
pathnel-tech/
├── backend/          # Node.js + Express API + SQLite
├── frontend/         # React customer-facing store
├── admin/            # React admin dashboard
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ (https://nodejs.org)
- **npm** v9+

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed       # Creates DB and loads 12 sample products
npm start          # Starts API on http://localhost:3001
```

> **Dev mode with auto-reload:**
> ```bash
> npm run dev
> ```

### 2. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start          # Opens http://localhost:3000
```

### 3. Admin Panel Setup

Open another terminal:

```bash
cd admin
npm install
npm start          # Opens http://localhost:3002
```

**Admin credentials:**
- Username: `admin`
- Password: `pathnel123`

---

## 🔌 API Reference

Base URL: `http://localhost:3001`

### Public Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/products` | List products (supports `?category=`, `?min_price=`, `?max_price=`, `?sort=`, `?featured=1`) |
| `GET` | `/api/products/:id` | Get single product |
| `GET` | `/api/categories` | List all product categories |
| `POST` | `/api/orders` | Place a new order |
| `POST` | `/api/subscribers` | Subscribe to newsletter |

### Admin Endpoints (JWT Required)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/login` | Get JWT token |
| `POST` | `/api/products` | Create product |
| `PUT` | `/api/products/:id` | Update product |
| `DELETE` | `/api/products/:id` | Delete product |
| `GET` | `/api/orders` | List all orders |
| `GET` | `/api/orders/:id` | Get order with items |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `GET` | `/api/subscribers` | List subscribers |
| `GET` | `/api/stats` | Dashboard statistics |

---

## 🗄️ Database Schema

**SQLite** database stored at `backend/pathnel.db` (auto-created on first run).

| Table | Key Fields |
|-------|-----------|
| `products` | id, name, description, price, sale_price, category, image_url, stock_quantity, is_featured, is_new, is_sale |
| `orders` | id, customer_name, customer_email, shipping_address, total_amount, status |
| `order_items` | id, order_id, product_id, quantity, price_at_time |
| `subscribers` | id, email, created_at |

---

## 🛍️ Customer-Facing Pages

| Route | Page |
|-------|------|
| `/` | Home — hero, featured products, newsletter |
| `/shop` | Shop — filters, sorting, product grid |
| `/product/:id` | Product Detail — full info, add to cart |
| `/cart` | Cart — adjust quantities, subtotal |
| `/checkout` | Checkout — shipping form, place order |
| `/about` | About Pathnel Tech |
| `/contact` | Contact form |

---

## 🔧 Admin Panel Pages

| Route | Page |
|-------|------|
| `/login` | Admin sign in |
| `/dashboard` | Stats overview + recent orders |
| `/products` | CRUD for all products |
| `/orders` | Order list + status updates |
| `/subscribers` | Newsletter subscriber list |

---

## ⚙️ Configuration

Environment variables for the backend (create `backend/.env`):

```env
PORT=3001
JWT_SECRET=your-secret-key-here
ADMIN_USER=admin
ADMIN_PASS=your-secure-password
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Admin | React 18, React Router v6 |
| Backend | Node.js, Express 4 |
| Database | SQLite via better-sqlite3 |
| Auth | JWT (jsonwebtoken) |
| Fonts | Syne (display) + DM Sans (body) via Google Fonts |
| Images | Unsplash (sample product images) |

---

## 📦 Sample Data

Running `npm run seed` in the backend folder loads:
- **12 products** across categories: Audio, Chargers, Keyboards, Monitors, Mice, Accessories, Cameras
- **1 sample order** (Processing status)
- **2 newsletter subscribers**

---

## 🚫 Out of Scope (MVP)

- Real payment processing
- User accounts / authentication for customers
- Email notifications
- Multi-image galleries
- Product reviews & ratings
- Shipping rate calculation

---

## 📝 Notes

- The SQLite database file (`pathnel.db`) is created automatically on first start
- Cart state is stored in React context (in-memory, resets on page refresh)
- All monetary values are in USD
- Order status options: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`
