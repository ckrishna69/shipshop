# 🛍️ ShipShop — Premium Full-Stack E-Commerce Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue?style=for-the-badge&logo=vercel)](https://shipshop-by5cn0qzu-ckrishnasingh69-2699s-projects.vercel.app)
[![Backend Status](https://img.shields.io/badge/Backend-Render-green?style=for-the-badge&logo=render)](https://shipshop-1.onrender.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://shipshop-1.onrender.com)

**ShipShop** is a modern, responsive, full-stack e-commerce web application designed to deliver a seamless shopping experience. Built with a decoupled architecture featuring a React SPA frontend and a RESTful Node.js backend, the platform supports real-time product browsing, user authentication with token persistence, persistent shopping cart/wishlist management, and checkout integrations.

> **PBEL Project Submission Notice:**  
> This project has been deployed to production and is fully accessible via the live demo link below.

---

## 🚀 Live Application Links

* **Live Frontend Application (Vercel):** [https://shipshop-by5cn0qzu-ckrishnasingh69-2699s-projects.vercel.app](https://shipshop-by5cn0qzu-ckrishnasingh69-2699s-projects.vercel.app)
* **Live Backend API Base (Render):** `https://shipshop-1.onrender.com/api`

---

## 🛠️ Tech Stack & Architecture

ShipShop utilizes a decoupled Client-Server architecture with state-of-the-art web technologies:

### 📱 Frontend (`/client`)
* **Framework / Core Library:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vite.dev/) (Optimized production bundles & lightning-fast HMR)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) (Modern, responsive UI components)
* **Routing:** [React Router DOM v6](https://reactrouter.com/) (Declarative nested routing)
* **HTTP Client:** Custom `fetch` / Axios client with automatic Bearer token interceptors
* **Deployment:** Hosted on **Vercel**

### ⚙️ Backend (`/server`)
* **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+)
* **Server Framework:** [Express.js](https://expressjs.com/) (RESTful API architecture with `/api` prefixed routing)
* **Database & ORM:** [Prisma ORM](https://www.prisma.io/) paired with a production **PostgreSQL** database (Local SQLite supported for dev)
* **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) stored in `localStorage` & attached via `Authorization: Bearer <token>` headers
* **Security & Utilities:** `bcryptjs` password hashing, CORS configuration, and route guard middleware
* **Deployment:** Hosted on **Render**

---

## 🌟 Key Features

* **Authentication & Session Persistence:**
  * User registration and login with bcrypt password hashing.
  * OTP-based authentication support (`verifyOtp`).
  * JWT auth token saved in browser `localStorage` to ensure persistent user sessions across page reloads.
  * Automatic token attachment on all protected requests (Cart, Wishlist, Profile).

* **Product Catalog & Browsing:**
  * Category and Brand filtering.
  * Product badges (`NEW`, `TRENDING`).
  * Real-time search and product detail views.

* **E-Commerce Operations:**
  * Dynamic, context-driven persistent Shopping Cart (Add, Remove, Quantity adjustments).
  * Wishlist management with instantaneous sync.
  * Address Book manager for checkout preparation.

* **Checkout & Payment Integration:**
  * Integration with **Razorpay Payment Gateway API** (Test Mode).
  * UPI Static QR Code support for direct payments.

* **Database Seeding & Schema:**
  * Comprehensive Prisma schema covering `User`, `Product`, `Category`, `Brand`, `CartItem`, `Wishlist`, and `Order` entities.

---

## 📂 Project Structure

```text
shipshop/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Navbar, Footer, Modals)
│   │   ├── context/            # AuthContext & CartContext with storage persistence
│   │   ├── services/           # client.js (API HTTP client with Bearer token header)
│   │   ├── pages/              # Product Details, Cart, Checkout, Auth pages
│   │   └── main.jsx            # React root component
│   ├── tailwind.config.js      # Utility styling configuration
│   └── package.json            # Client dependencies and scripts
│
└── server/                     # Node.js + Express Backend API
    ├── prisma/
    │   ├── schema.prisma       # Prisma ORM Data Models (PostgreSQL / SQLite)
    │   └── seed.js             # Initial database seeding script
    ├── src/
    │   ├── controllers/        # Business logic for auth, cart, products, orders
    │   ├── middleware/         # Auth verification middleware (JWT verification)
    │   ├── routes/             # Express API routes (/api/auth, /api/cart, etc.)
    │   └── index.js            # Express application entry point
    └── package.json            # Server dependencies and deployment scripts
