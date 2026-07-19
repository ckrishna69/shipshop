import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";
import { useAuth } from "./AuthContext.jsx";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
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
    fire(`${product.name} added to cart`);
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

  return (
    <ShopContext.Provider
      value={{
        categories, brands, products, coupons,
        cart, wishlist,
        addToCart, changeQty, removeFromCart, toggleWishlist,
        toast, fire, searchProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
