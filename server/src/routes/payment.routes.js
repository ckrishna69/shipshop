import { Router } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import QRCode from "qrcode";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---- Real payment gateway: Razorpay ----

// Creates a Razorpay order for an existing Shipshop order, in paise.
router.post("/payment/razorpay/create-order", async (req, res) => {
  const { orderId } = req.body;
  const order = await prisma.order.findFirst({ where: { id: orderId, userId: req.user.id } });
  if (!order) return res.status(404).json({ error: "Order not found." });

  const razorpayOrder = await razorpay.orders.create({
    amount: order.totalAmount * 100,
    currency: "INR",
    receipt: order.id,
  });

  await prisma.order.update({ where: { id: order.id }, data: { razorpayOrderId: razorpayOrder.id } });

  res.json({
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// Verifies the signature Razorpay's checkout.js hands back after a successful payment.
router.post("/payment/razorpay/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ error: "Payment could not be verified." });
  }

  const order = await prisma.order.update({
    where: { razorpayOrderId: razorpay_order_id },
    data: { status: "paid", paymentMethod: "razorpay", razorpayPaymentId: razorpay_payment_id },
  });

  res.json({ verified: true, order });
});

// ---- Optional: support the project via UPI ----
// This is NOT a payment gateway integration — there's no automatic verification.
// It's a clearly-labeled "no product will be shipped" tip jar for a project demo.
router.get("/payment/support-upi", async (req, res) => {
  const upiId = process.env.SUPPORT_UPI_ID;
  const name = process.env.SUPPORT_UPI_NAME || "Shipshop Project";
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&cu=INR`;
  const qrDataUrl = await QRCode.toDataURL(upiUrl);

  res.json({
    upiId,
    name,
    qrDataUrl,
    disclaimer:
      "This is a portfolio project. No product will be shipped. Paying is entirely optional and not verified automatically.",
  });
});

export default router;
