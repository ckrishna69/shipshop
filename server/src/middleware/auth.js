import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../db.js";

// Attaches req.user if a valid session cookie or Bearer token is present, but doesn't block the request.
export async function attachUser(req, res, next) {
  let token = req.cookies?.token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) return next();
  const payload = verifyToken(token);
  if (!payload) return next();
  req.user = await prisma.user.findUnique({ where: { id: payload.sub } });
  next();
}

// Blocks the request if there's no logged-in user.
export async function requireAuth(req, res, next) {
  if (req.user) return next();

  let token = req.cookies?.token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  if (!token) return res.status(401).json({ error: "Log in to continue." });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Log in to continue." });

  req.user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!req.user) return res.status(401).json({ error: "Log in to continue." });

  next();
}

// Alias for validation routing
export const authMiddleware = requireAuth;
