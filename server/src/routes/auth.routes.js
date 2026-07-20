import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "../db.js";
import { signToken, cookieOptions } from "../utils/jwt.js";
import { generateOtp, sendSms } from "../utils/otp.js";
import { sendResetEmail } from "../utils/email.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function setSession(res, userId) {
  res.cookie("token", signToken(userId), cookieOptions);
}

// ---- Signup ----
const signupSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

router.post("/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Check your name, email and password." });
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "An account with that email already exists." });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, passwordHash } });
  const token = signToken(user.id);
  setSession(res, user.id);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, token });
});

// ---- Login (password) ----
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password." });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid email or password." });

  const token = signToken(user.id);
  setSession(res, user.id);
  res.json({ id: user.id, name: user.name, email: user.email, token });
});

// ---- OTP login ----
router.post("/otp/request", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Enter a phone number." });

  const code = generateOtp();
  await prisma.otpCode.create({
    data: { phone, code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
  });
  await sendSms(phone, code);
  res.json({ sent: true });
});

router.post("/otp/verify", async (req, res) => {
  const { phone, code } = req.body;
  const record = await prisma.otpCode.findFirst({
    where: { phone, code, verified: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!record) return res.status(400).json({ error: "That code is invalid or expired." });

  await prisma.otpCode.update({ where: { id: record.id }, data: { verified: true } });

  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({ data: { name: "New user", phone } });
  }
  const token = signToken(user.id);
  setSession(res, user.id);
  res.json({ id: user.id, name: user.name, phone: user.phone, token });
});

// ---- Forgot / reset password ----
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  // Always return success so the response can't be used to check which emails are registered.
  if (!user) return res.json({ sent: true });

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.passwordResetToken.create({
    data: { userId: user.id, token, expiresAt: new Date(Date.now() + 30 * 60 * 1000) },
  });
  const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendResetEmail(email, link);
  res.json({ sent: true });
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.used || record.expiresAt < new Date()) {
    return res.status(400).json({ error: "This reset link is invalid or has expired." });
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.update({ where: { id: record.id }, data: { used: true } });
  res.json({ reset: true });
});

// ---- Session ----
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ loggedOut: true });
});

router.get("/me", requireAuth, (req, res) => {
  const { id, name, email, phone } = req.user;
  res.json({ id, name, email, phone });
});

export default router;
