import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "./AuthContext.jsx";

const FALLBACK_CATEGORIES = [
  { id: "groceries", slug: "groceries", name: "Groceries", icon: "Apple", subcategories: [{ id: "sub-g1", name: "Fresh produce" }, { id: "sub-g2", name: "Pantry staples" }] },
  { id: "fashion", slug: "fashion", name: "Fashion", icon: "Shirt", subcategories: [{ id: "sub-f1", name: "Men" }, { id: "sub-f2", name: "Women" }] },
  { id: "electronics", slug: "electronics", name: "Electronics", icon: "Smartphone", subcategories: [{ id: "sub-e1", name: "Phones" }, { id: "sub-e2", name: "Laptops" }] },
  { id: "home", slug: "home", name: "Home & Living", icon: "Home", subcategories: [{ id: "sub-h1", name: "Furniture" }, { id: "sub-h2", name: "Decor" }] },
  { id: "beauty", slug: "beauty", name: "Beauty", icon: "Sparkles", subcategories: [{ id: "sub-b1", name: "Skincare" }, { id: "sub-b2", name: "Makeup" }] },
  { id: "sports", slug: "sports", name: "Sports", icon: "Dumbbell", subcategories: [{ id: "sub-s1", name: "Fitness gear" }, { id: "sub-s2", name: "Footwear" }] },
  { id: "kids", slug: "kids", name: "Kids", icon: "Baby", subcategories: [{ id: "sub-k1", name: "Toys" }, { id: "sub-k2", name: "Clothing" }] }
];

const FALLBACK_BRANDS = [
  { id: "northfield", slug: "northfield", name: "Northfield", initials: "NF", colorHex: "#2E6E60" },
  { id: "kessler", slug: "kessler", name: "Kessler & Co", initials: "K&", colorHex: "#B2543A" },
  { id: "verve", slug: "verve", name: "Verve", initials: "VV", colorHex: "#C69A3E" },
  { id: "solstice", slug: "solstice", name: "Solstice", initials: "SO", colorHex: "#132242" },
  { id: "marchetti", slug: "marchetti", name: "Marchetti", initials: "MC", colorHex: "#1E4A40" },
  { id: "nimbus", slug: "nimbus", name: "Nimbus", initials: "NB", colorHex: "#9C7626" },
  { id: "cardinal", slug: "cardinal", name: "Cardinal Goods", initials: "CG", colorHex: "#B2543A" },
  { id: "wren", slug: "wren", name: "Wren & Ash", initials: "WA", colorHex: "#2E6E60" },
  { id: "aarohi", slug: "aarohi", name: "Aarohi", initials: "AR", colorHex: "#132242" },
  { id: "lumen", slug: "lumen", name: "Lumen Studio", initials: "LS", colorHex: "#C69A3E" }
];

const FALLBACK_PRODUCTS = [
  {
    id: "nr-1",
    slug: "wool-blend-overcoat",
    name: "Wool-blend overcoat",
    price: 8990,
    mrp: 12990,
    originalPrice: 12990,
    category: { id: "fashion", slug: "fashion", name: "Fashion" },
    brand: { id: "northfield", slug: "northfield", name: "Northfield" },
    isNew: true,
    tag: "NEW",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "nr-2",
    slug: "ceramic-pour-over-set",
    name: "Ceramic pour-over set",
    price: 1890,
    mrp: 2490,
    originalPrice: 2490,
    category: { id: "home", slug: "home", name: "Home & Living" },
    brand: { id: "kessler", slug: "kessler", name: "Kessler & Co" },
    isNew: true,
    tag: "NEW",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "solstice-serum",
    slug: "hydrating-botanical-serum",
    name: "Hydrating Botanical Serum",
    price: 1190,
    mrp: 1490,
    originalPrice: 1490,
    category: { id: "beauty", slug: "beauty", name: "Beauty" },
    brand: { id: "solstice", slug: "solstice", name: "Solstice" },
    isNew: true,
    isTrending: false,
    tag: "NEW",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "nr-4",
    slug: "wooden-building-blocks",
    name: "Wooden building blocks",
    price: 1490,
    mrp: 1890,
    originalPrice: 1890,
    category: { id: "kids", slug: "kids", name: "Kids" },
    brand: { id: "lumen", slug: "lumen", name: "Lumen Studio" },
    isNew: true,
    tag: "NEW",
    icon: "Baby",
    image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "nr-5",
    slug: "portable-bluetooth-speaker",
    name: "Portable bluetooth speaker",
    price: 2990,
    mrp: 3990,
    originalPrice: 3990,
    category: { id: "electronics", slug: "electronics", name: "Electronics" },
    brand: { id: "nimbus", slug: "nimbus", name: "Nimbus" },
    isNew: true,
    tag: "NEW",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "tr-1",
    slug: "everyday-oxford-shirt",
    name: "Everyday oxford shirt",
    price: 2190,
    mrp: 2990,
    originalPrice: 2990,
    category: { id: "fashion", slug: "fashion", name: "Fashion" },
    brand: { id: "marchetti", slug: "marchetti", name: "Marchetti" },
    isTrending: true,
    tag: "TRENDING",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "tr-2",
    slug: "wireless-anc-headphones",
    name: "Wireless ANC headphones",
    price: 6990,
    mrp: 8990,
    originalPrice: 8990,
    category: { id: "electronics", slug: "electronics", name: "Electronics" },
    brand: { id: "verve", slug: "verve", name: "Verve" },
    isTrending: true,
    tag: "TRENDING",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "tr-3",
    slug: "trail-running-shoes",
    name: "Trail running shoes",
    price: 3990,
    mrp: 5490,
    originalPrice: 5490,
    category: { id: "sports", slug: "sports", name: "Sports" },
    brand: { id: "aarohi", slug: "aarohi", name: "Aarohi" },
    isTrending: true,
    tag: "TRENDING",
    icon: "Dumbbell",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "tr-4",
    slug: "organic-artisan-sourdough",
    name: "Organic artisan sourdough",
    price: 290,
    mrp: 360,
    originalPrice: 360,
    category: { id: "groceries", slug: "groceries", name: "Groceries" },
    brand: { id: "cardinal", slug: "cardinal", name: "Cardinal Goods" },
    isTrending: true,
    tag: "TRENDING",
    icon: "Apple",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "tr-5",
    slug: "classic-matte-sunglasses",
    name: "Classic Matte Sunglasses",
    price: 1490,
    mrp: 2290,
    originalPrice: 2290,
    category: { id: "fashion", slug: "fashion", name: "Fashion" },
    brand: { id: "solstice", slug: "solstice", name: "Solstice" },
    isTrending: true,
    tag: "TRENDING",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "exp-1",
    slug: "minimalist-desk-lamp",
    name: "Minimalist Desk Lamp",
    price: 2490,
    mrp: 3290,
    originalPrice: 3290,
    category: { id: "home", slug: "home", name: "Home & Living" },
    brand: { id: "wren", slug: "wren", name: "Wren & Ash" },
    isNew: true,
    tag: "NEW",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "exp-2",
    slug: "smart-fitness-tracker",
    name: "Smart Fitness Tracker",
    price: 3490,
    mrp: 4490,
    originalPrice: 4490,
    category: { id: "electronics", slug: "electronics", name: "Electronics" },
    brand: { id: "nimbus", slug: "nimbus", name: "Nimbus" },
    isNew: true,
    tag: "NEW",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "exp-3",
    slug: "italian-leather-cardholder",
    name: "Italian Leather Cardholder",
    price: 1290,
    mrp: 1790,
    originalPrice: 1790,
    category: { id: "fashion", slug: "fashion", name: "Fashion" },
    brand: { id: "marchetti", slug: "marchetti", name: "Marchetti" },
    isNew: true,
    tag: "NEW",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "exp-4",
    slug: "double-wall-glass-tumbler",
    name: "Double-Wall Glass Tumbler",
    price: 890,
    mrp: 1190,
    originalPrice: 1190,
    category: { id: "home", slug: "home", name: "Home & Living" },
    brand: { id: "kessler", slug: "kessler", name: "Kessler & Co" },
    isNew: true,
    tag: "NEW",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "fill-1",
    slug: "classic-matte-polarized-sunglasses",
    name: "Classic Matte Polarized Sunglasses",
    price: 1490,
    mrp: 2290,
    originalPrice: 2290,
    category: { id: "fashion", slug: "fashion", name: "Fashion" },
    brand: { id: "solstice", slug: "solstice", name: "Solstice" },
    isNew: true,
    tag: "NEW",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "fill-2",
    slug: "water-resistant-commuter-backpack",
    name: "Water-Resistant Commuter Backpack",
    price: 3290,
    mrp: 4500,
    originalPrice: 4500,
    category: { id: "fashion", slug: "fashion", name: "Fashion" },
    brand: { id: "northfield", slug: "northfield", name: "Northfield" },
    isNew: true,
    tag: "NEW",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "fill-3",
    slug: "minimalist-smartwatch-series-4",
    name: "Minimalist Smartwatch Series 4",
    price: 4990,
    mrp: 6990,
    originalPrice: 6990,
    category: { id: "electronics", slug: "electronics", name: "Electronics" },
    brand: { id: "verve", slug: "verve", name: "Verve" },
    isNew: true,
    tag: "NEW",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "fill-last-1",
    slug: "ergonomic-mechanical-keyboard",
    name: "Ergonomic Mechanical Keyboard",
    price: 4290,
    mrp: 5990,
    originalPrice: 5990,
    category: { id: "electronics", slug: "electronics", name: "Electronics" },
    brand: { id: "aarohi", slug: "aarohi", name: "Aarohi" },
    isNew: true,
    tag: "NEW",
    icon: "Smartphone",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    stock: 50
  },
  {
    id: "fill-last-2",
    slug: "handcrafted-leather-journal",
    name: "Handcrafted Leather Journal",
    price: 990,
    mrp: 1490,
    originalPrice: 1490,
    category: { id: "home", slug: "home", name: "Home & Living" },
    brand: { id: "marchetti", slug: "marchetti", name: "Marchetti" },
    isNew: true,
    tag: "NEW",
    icon: "Home",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    stock: 50
  }
];

const FALLBACK_COUPONS = [
  { code: "FIRST200", description: "Flat ₹200 off on your first order", discountType: "flat", discountValue: 200, active: true },
  { code: "CARD10", description: "10% off + loyalty fee waived on card payments", discountType: "percent", discountValue: 10, active: true }
];

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [brands, setBrands] = useState(FALLBACK_BRANDS);
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [coupons, setCoupons] = useState(FALLBACK_COUPONS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const fire = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  useEffect(() => {
    api.get("/categories").then(setCategories).catch(() => {});
    api.get("/brands").then(setBrands).catch(() => {});
    api.get("/products").then(setProducts).catch(() => {});
    api.get("/coupons").then(setCoupons).catch(() => {});
  }, []);

  const refreshCart = useCallback(() => {
    if (!user) return setCart([]);
    api.get("/cart").then(setCart).catch(() => {});
  }, [user]);

  const refreshWishlist = useCallback(() => {
    if (!user) return setWishlist([]);
    api.get("/wishlist").then(setWishlist).catch(() => {});
  }, [user]);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [refreshCart, refreshWishlist]);

  const searchProducts = useCallback(async (query) => {
    try {
      const results = await api.get(`/products?search=${encodeURIComponent(query)}`);
      setProducts(results);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const requireLogin = () => {
    fire("Log in to continue");
    return false;
  };

  const addToCart = async (product) => {
    if (!user) return requireLogin();
    await api.post("/cart", { productId: product.id, qty: 1 });
    refreshCart();
  };

  const changeQty = async (productId, qty) => {
    await api.patch(`/cart/${productId}`, { qty });
    refreshCart();
  };

  const removeFromCart = async (productId) => {
    await api.delete(`/cart/${productId}`);
    refreshCart();
  };

  const toggleWishlist = async (product) => {
    if (!user) return requireLogin();
    const exists = wishlist.find((w) => w.productId === product.id);
    if (exists) {
      await api.delete(`/wishlist/${product.id}`);
    } else {
      await api.post("/wishlist", { productId: product.id });
      fire(`${product.name} added to wishlist`);
    }
    refreshWishlist();
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <ShopContext.Provider
      value={{
        categories, brands, products, coupons,
        cart, wishlist,
        addToCart, changeQty, removeFromCart, toggleWishlist, clearCart,
        toast, fire, searchProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
