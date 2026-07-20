import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// Snapshot the current cart into an Order + OrderItems, priced at today's product prices.
router.post("/orders", async (req, res) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId: req.user.id },
    include: { product: true },
  });
  if (cartItems.length === 0) return res.status(400).json({ error: "Your cart is empty." });

  const subtotal = cartItems.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const platformFee = cartItems.length > 0 ? 49 : 0;
  const totalAmount = subtotal + platformFee;

  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      totalAmount,
      status: "pending",
      items: {
        create: cartItems.map((i) => ({ productId: i.productId, qty: i.qty, price: i.product.price })),
      },
    },
    include: { items: { include: { product: true } } },
  });

  res.status(201).json(order);
});

router.get("/orders", async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(orders);
});

router.get("/orders/:id", async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, userId: req.user.id },
    include: { items: { include: { product: true } } },
  });
  if (!order) return res.status(404).json({ error: "Order not found." });
  res.json(order);
});

export default router;
