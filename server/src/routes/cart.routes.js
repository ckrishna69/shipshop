import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// ---- Cart ----
router.get("/cart", async (req, res) => {
  const items = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: { include: { brand: true } } },
  });
  res.json(items);
});

router.post("/cart", async (req, res) => {
  const { productId, qty = 1 } = req.body;
  const item = await prisma.cartItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: { qty: { increment: qty } },
    create: { userId: req.user.id, productId, qty },
  });
  res.json(item);
});

router.patch("/cart/:productId", async (req, res) => {
  const { qty } = req.body;
  if (qty <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id, productId: req.params.productId } });
    return res.json({ removed: true });
  }
  const item = await prisma.cartItem.update({
    where: { userId_productId: { userId: req.user.id, productId: req.params.productId } },
    data: { qty },
  });
  res.json(item);
});

router.delete("/cart/:productId", async (req, res) => {
  await prisma.cartItem.deleteMany({ where: { userId: req.user.id, productId: req.params.productId } });
  res.json({ removed: true });
});

// ---- Wishlist ----
router.get("/wishlist", async (req, res) => {
  const items = await prisma.wishlistItem.findMany({
    where: { userId: req.user.id },
    include: { product: { include: { brand: true } } },
  });
  res.json(items);
});

router.post("/wishlist", async (req, res) => {
  const { productId } = req.body;
  const item = await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: req.user.id, productId } },
    update: {},
    create: { userId: req.user.id, productId },
  });
  res.json(item);
});

router.delete("/wishlist/:productId", async (req, res) => {
  await prisma.wishlistItem.deleteMany({ where: { userId: req.user.id, productId: req.params.productId } });
  res.json({ removed: true });
});

export default router;
