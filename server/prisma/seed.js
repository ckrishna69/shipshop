import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "groceries", name: "Groceries", icon: "Apple", sub: ["Fresh produce", "Pantry staples", "Snacks", "Beverages"] },
  { slug: "fashion", name: "Fashion", icon: "Shirt", sub: ["Men", "Women", "Unisex", "Kids"] },
  { slug: "electronics", name: "Electronics", icon: "Smartphone", sub: ["Phones", "Laptops", "Audio", "Smart home"] },
  { slug: "home", name: "Home & Living", icon: "Home", sub: ["Furniture", "Decor", "Kitchen", "Bedding"] },
  { slug: "beauty", name: "Beauty", icon: "Sparkles", sub: ["Skincare", "Makeup", "Haircare", "Fragrance"] },
  { slug: "sports", name: "Sports", icon: "Dumbbell", sub: ["Fitness gear", "Footwear", "Outdoor", "Team sports"] },
  { slug: "kids", name: "Kids", icon: "Baby", sub: ["Toys", "Clothing", "Nursery", "School"] },
];

const BRANDS = [
  { slug: "northfield", name: "Northfield", initials: "NF", colorHex: "#2E6E60" },
  { slug: "kessler", name: "Kessler & Co", initials: "K&", colorHex: "#B2543A" },
  { slug: "verve", name: "Verve", initials: "VV", colorHex: "#C69A3E" },
  { slug: "solstice", name: "Solstice", initials: "SO", colorHex: "#132242" },
  { slug: "marchetti", name: "Marchetti", initials: "MC", colorHex: "#1E4A40" },
  { slug: "nimbus", name: "Nimbus", initials: "NB", colorHex: "#9C7626" },
  { slug: "cardinal", name: "Cardinal Goods", initials: "CG", colorHex: "#B2543A" },
  { slug: "wren", name: "Wren & Ash", initials: "WA", colorHex: "#2E6E60" },
  { slug: "aarohi", name: "Aarohi", initials: "AR", colorHex: "#132242" },
  { slug: "lumen", name: "Lumen Studio", initials: "LS", colorHex: "#C69A3E" },
];

const PRODUCTS = [
  ["Wool-blend overcoat", "fashion", "northfield", 8990, 12990, "NEW", "Shirt", "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop"],
  ["Everyday oxford shirt", "fashion", "marchetti", 2190, 2990, "TRENDING", "Shirt", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop"],
  ["Tailored linen trousers", "fashion", "northfield", 3290, 3990, null, "Shirt", "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop"],
  ["Cropped denim jacket", "fashion", "marchetti", 4490, 5990, "NEW", "Shirt", "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600&auto=format&fit=crop"],
  ["Wireless ANC headphones", "electronics", "verve", 6990, 9990, "TRENDING", "Smartphone", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop"],
  ["45W fast charging adapter", "electronics", "nimbus", 1290, 1690, null, "Smartphone", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600&auto=format&fit=crop"],
  ["Smart fitness watch", "electronics", "verve", 5490, 7990, "NEW", "Smartphone", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600&auto=format&fit=crop"],
  ["Portable bluetooth speaker", "electronics", "nimbus", 2990, 3990, "TRENDING", "Smartphone", "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=600&auto=format&fit=crop"],
  ["Ceramic pour-over set", "home", "kessler", 1890, 2490, "NEW", "Home", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop"],
  ["Linen cushion covers (set of 2)", "home", "wren", 1290, 1690, null, "Home", "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop"],
  ["Oak dining chair", "home", "kessler", 7490, 9990, null, "Home", "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop"],
  ["Woven storage basket", "home", "wren", 990, 1290, "TRENDING", "Home", "https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=600&auto=format&fit=crop"],
  ["Cold-pressed argan oil", "beauty", "solstice", 890, 1090, "NEW", "Sparkles", "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop"],
  ["Vitamin C serum", "beauty", "solstice", 1190, 1490, "TRENDING", "Sparkles", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop"],
  ["Matte lip set", "beauty", "solstice", 790, 990, null, "Sparkles", "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop"],
  ["Trail running shoes", "sports", "aarohi", 3990, 5490, "TRENDING", "Dumbbell", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop"],
  ["Foldable yoga mat", "sports", "aarohi", 1190, 1490, null, "Dumbbell", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=600&auto=format&fit=crop"],
  ["Insulated water bottle", "sports", "aarohi", 690, 890, "NEW", "Dumbbell", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop"],
  ["Organic breakfast oats 1kg", "groceries", "cardinal", 290, 350, null, "Apple", "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=600&auto=format&fit=crop"],
  ["Cold-pressed olive oil 1L", "groceries", "cardinal", 690, 850, "TRENDING", "Apple", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop"],
  ["Artisan sourdough loaf", "groceries", "cardinal", 190, 220, "NEW", "Apple", "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop"],
  ["Wooden building blocks", "kids", "lumen", 1490, 1890, "NEW", "Baby", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&auto=format&fit=crop&q=80"],
  ["Storybook collection (5 books)", "kids", "lumen", 990, 1290, null, "Baby", "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"],
  ["Soft cotton romper", "kids", "lumen", 690, 890, "TRENDING", "Baby", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop"],
];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  const catMap = {};
  for (const c of CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        subcategories: { create: c.sub.map((name) => ({ name })) },
      },
    });
    catMap[c.slug] = cat.id;
  }

  const brandMap = {};
  for (const b of BRANDS) {
    const brand = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: b,
    });
    brandMap[b.slug] = brand.id;
  }

  for (const [name, catSlug, brandSlug, price, mrp, tag, icon, image] of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: slugify(name) },
      update: {
        image: image || "",
      },
      create: {
        slug: slugify(name),
        name,
        price,
        mrp,
        tag,
        icon,
        image: image || "",
        categoryId: catMap[catSlug],
        brandId: brandMap[brandSlug],
      },
    });
  }

  await prisma.coupon.upsert({
    where: { code: "FIRST200" },
    update: {},
    create: { code: "FIRST200", description: "Flat ₹200 off on your first order", discountType: "flat", discountValue: 200 },
  });
  await prisma.coupon.upsert({
    where: { code: "CARD10" },
    update: {},
    create: { code: "CARD10", description: "10% off + loyalty fee waived on card payments", discountType: "percent", discountValue: 10 },
  });

  console.log("Seed complete.");
}

main().finally(() => prisma.$disconnect());
