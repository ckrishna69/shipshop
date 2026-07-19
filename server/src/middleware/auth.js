import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../db.js";

// Attaches req.user if a valid session cookie is present, but doesn't block the request.
export async function attachUser(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return next();
  const payload = verifyToken(token);
  if (!payload) return next();
  req.user = await prisma.user.findUnique({ where: { id: payload.sub } });
  next();
}

// Blocks the request if there's no logged-in user.
export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Log in to continue." });
  next();
}
