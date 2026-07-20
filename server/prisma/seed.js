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
  ["Wool-blend overcoat", "fashion", "northfield", 8990, 12990, "NEW", "Shirt", "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80"],
  ["Ceramic pour-over set", "home", "kessler", 1890, 2490, "NEW", "Home", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"],
  ["Hydrating Botanical Serum", "beauty", "solstice", 1190, 1490, "NEW", "Sparkles", "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"],
  ["Wooden building blocks", "kids", "lumen", 1490, 1890, "NEW", "Baby", "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80"],
  ["Portable bluetooth speaker", "electronics", "nimbus", 2990, 3990, "NEW", "Smartphone", "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"],
  ["Everyday oxford shirt", "fashion", "marchetti", 2190, 2990, "TRENDING", "Shirt", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80"],
  ["Wireless ANC headphones", "electronics", "verve", 6990, 8990, "TRENDING", "Smartphone", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
  ["Trail running shoes", "sports", "aarohi", 3990, 5490, "TRENDING", "Dumbbell", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
  ["Organic artisan sourdough", "groceries", "cardinal", 290, 360, "TRENDING", "Apple", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80"],
  ["Classic Matte Sunglasses", "fashion", "solstice", 1490, 2290, "TRENDING", "Shirt", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"],
  ["Minimalist Desk Lamp", "home", "wren", 2490, 3290, "NEW", "Home", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"],
  ["Smart Fitness Tracker", "electronics", "nimbus", 3490, 4490, "NEW", "Smartphone", "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80"],
  ["Italian Leather Cardholder", "fashion", "marchetti", 1290, 1790, "NEW", "Shirt", "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"],
  ["Double-Wall Glass Tumbler", "home", "kessler", 890, 1190, "NEW", "Home", "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80"],
  ["Classic Matte Polarized Sunglasses", "fashion", "solstice", 1490, 2290, "NEW", "Shirt", "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80"],
  ["Water-Resistant Commuter Backpack", "fashion", "northfield", 3290, 4500, "NEW", "Shirt", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"],
  ["Minimalist Smartwatch Series 4", "electronics", "verve", 4990, 6990, "NEW", "Smartphone", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"],
  ["Ergonomic Mechanical Keyboard", "electronics", "aarohi", 4290, 5990, "NEW", "Smartphone", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"],
  ["Handcrafted Leather Journal", "home", "marchetti", 990, 1490, "NEW", "Home", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"]
];

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  await prisma.product.deleteMany({ where: { slug: "cold-pressed-argan-oil" } });
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
