# Shipshop — Premium Full-Stack E-Commerce Platform

Shipshop is a modern, responsive, full-stack e-commerce web application built for a seamless user shopping experience. Designed with a clean aesthetic and responsive layout, the platform features a complete product catalog, full shopping cart and wishlist management, dual authentication mechanisms (traditional passwords and OTP-based login), and verified checkout integrations.

This project is prepared and optimized for a PBEL course submission.

---

## 🛠️ Tech Stack

The application is structured as a decoupled client-server architecture:

### 1. Frontend ([/client](file:///c:/Users/ckris/Downloads/shipshop-fullstack/shipshop/client))
* **Core Library:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vite.dev/) (ensuring lightning-fast HMR and build times)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) (custom UI components and responsive utilities)
* **Routing:** [React Router DOM v6](https://reactrouter.com/) (declarative nested routes)

### 2. Backend ([/server](file:///c:/Users/ckris/Downloads/shipshop-fullstack/shipshop/server))
* **Runtime Environment:** [Node.js](https://nodejs.org/) (v18+)
* **Framework:** [Express.js](https://expressjs.com/) (robust REST API endpoints)
* **Database & ORM:** [Prisma ORM](https://www.prisma.io/) with a local [SQLite](https://www.sqlite.org/) database
* **Authentication:** [JSON Web Tokens (JWT)](https://jwt.io/) stored securely in `httpOnly` cookies

---

## 🌟 Key Features

* **Dual Authentication Flows:**
  * Standard signup and login with secure bcrypt-hashed passwords.
  * Password-less OTP (One-Time Password) login (OTP is printed to the server console).
  * Forgot/reset password email support (reset links print to console in development).
* **Product Catalog:**
  * Categories and Brands filtering mechanism.
  * Badges for special products (e.g., `NEW`, `TRENDING`).
* **Interactive Shopping Experience:**
  * React Context-driven persistent shopping cart.
  * Persistent wishlist and interactive cart adjustments.
  * Address book manager with default address flags.
* **Checkout & Payments System:**
  * Full integration with [Razorpay API](https://razorpay.com/) (operating in test mode) for verified order signatures.
  * Dynamic UPI "support this project" Tip Jar option with automatic client-side static QR code generation.
* **Database Management:**
  * Programmatic schema definitions and seed data featuring categories, brands, coupons, and mock products.

---

## 📋 Prerequisites

Before running the project locally, ensure you have:
* **Node.js** (v18.0.0 or higher) installed.
* **npm** (v9.0.0 or higher) installed.

---

## 🚀 Step-by-Step Local Setup

Follow these steps to get both the backend and frontend up and running.

### Step 1: Set Up the Backend Server

1. Open your terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file. Copy the template:
   ```bash
   cp .env.example .env
   ```

4. Open the newly created `.env` file and verify or fill in the parameters:
   * **`DATABASE_URL`**: Set to `"file:./dev.db"` (default for SQLite).
   * **`JWT_SECRET`**: Set a secure secret string (e.g., `openssl rand -hex 32` output).
   * **`PORT`**: Set to `4000` (default port).
   * **`RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`**: Fill in your Razorpay API credentials for testing.

5. Run database migrations to create the database schema:
   ```bash
   npx prisma migrate dev --name init
   ```

6. Seed the SQLite database with products, categories, brands, and coupons:
   ```bash
   npm run prisma:seed
   ```

7. Start the Express development server:
   ```bash
   npm run dev
   ```
   *The backend API will run on **http://localhost:4000**.*

---

### Step 2: Set Up the Frontend Client

1. Open a new terminal window and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Create the client environment file:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `VITE_API_URL` points to `http://localhost:4000/api` so request proxying works seamlessly.)*

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The Vite server will start on **http://localhost:5173**.*

---

## 📂 Project Structure

```
shipshop/
├── client/                     # Vite React Frontend App
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Cart, Navbar, Footer)
│   │   ├── context/            # Auth and Cart React contexts
│   │   ├── pages/              # Product Details, Cart, Checkout, Auth pages
│   │   └── main.jsx            # Application entry point
│   ├── tailwind.config.js      # Tailwind layout styles
│   └── package.json            # Frontend script dependencies
│
└── server/                     # Node/Express Backend Server
    ├── prisma/
    │   ├── dev.db              # SQLite Local Database file
    │   ├── schema.prisma       # Prisma DB Schema definition
    │   └── seed.js             # Seeding database entries
    ├── src/
    │   ├── controllers/        # Route business logic handlers
    │   ├── middleware/         # JWT parsing and route protection middleware
    │   ├── routes/             # API routes definition (auth, products, order)
    │   └── index.js            # Express server entry point
    └── package.json            # Backend scripts and server dependencies
```
