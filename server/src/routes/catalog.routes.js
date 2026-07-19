import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

router.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({ include: { subcategories: true } });
  res.json(categories);
});

router.get("/brands", async (req, res) => {
  const brands = await prisma.brand.findMany();
  res.json(brands);
});

router.get("/brands/:slug/products", async (req, res) => {
  const brand = await prisma.brand.findUnique({ where: { slug: req.params.slug } });
  if (!brand) return res.status(404).json({ error: "Brand not found." });
  const products = await prisma.product.findMany({ where: { brandId: brand.id }, include: { brand: true, category: true } });
  res.json({ brand, products });
});

router.get("/products", async (req, res) => {
  const { category, tag, q, search } = req.query;
  const queryTerm = search || q;
  const where = {};
  if (category) where.category = { slug: category };
  if (tag) where.tag = tag;
  if (queryTerm) {
    where.OR = [
      { name: { contains: queryTerm, mode: "insensitive" } },
      { description: { contains: queryTerm, mode: "insensitive" } }
    ];
  }

  const products = await prisma.product.findMany({ where, include: { brand: true, category: true } });
  res.json(products);
});

router.get("/products/:slug", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { brand: true, category: true },
  });
  if (!product) return res.status(404).json({ error: "Product not found." });
  res.json(product);
});

router.get("/coupons", async (req, res) => {
  const coupons = await prisma.coupon.findMany({ where: { active: true } });
  res.json(coupons);
});

export default router;
