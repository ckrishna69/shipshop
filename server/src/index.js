import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";                       // <--- 1. IMPORT path
import { fileURLToPath } from "url";           // <--- 2. IMPORT fileURLToPath

import { attachUser } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

const app = express();

// Helper variables to handle folder paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic CORS Header Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Express parser middleware
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

// =========================================================
// ADD THIS HERE (BEFORE YOUR ROUTES)
// =========================================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));
// =========================================================

// YOUR ROUTES START HERE
app.get("/api/health", (req, res) => res.json({ ok: true }));

// PUBLIC ROUTES
app.use("/api/auth", authRoutes);
app.use("/api", catalogRoutes);

// PROTECTED / USER ATTACHED ROUTES
app.use(attachUser);

app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Shipshop API running on port ${port}`));