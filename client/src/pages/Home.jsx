import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Icons from "lucide-react";
import { Package, Gift, Award, Truck } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import HeroBanner from "../components/HeroBanner.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import ProductTile from "../components/ProductTile.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { BRAND_LOGOS } from "../constants/brandLogos.js";

function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-2 mb-5">
      <span className="font-mono text-[11px] tracking-wide text-[#736D5E] uppercase whitespace-nowrap">{label}</span>
      <span className="dashline flex-1" />
      <Package size={14} color="#736D5E" strokeWidth={1.5} />
    </div>
  );
}

const COUPON_ICONS = { FIRST200: Gift, CARD10: Award, FREESHIP: Truck };

const CATEGORY_IMAGES = {
  groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150",
  fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150",
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150",
  home: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150",
  kids: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150"
};

export default function Home() {
  const { categories, products, toast, fire } = useShop();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const shopTab = searchParams.get("category") || "All";

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product) return false;
      const matchesSearch = !searchQuery || 
        String(product.name || product.title || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      const selectedCategory = shopTab || 'All';
      const categorySlug = typeof product.category === 'object'
        ? (product.category?.slug || product.category?.name || '')
        : (product.category || '');
      
      const matchesCategory = selectedCategory === 'All' || 
        categorySlug.toLowerCase() === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, shopTab]);

  const handleBackToHome = () => {
    setSearchParams({});
    navigate("/", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goShop = (slug) => {
    const newParams = { ...Object.fromEntries(searchParams) };
    if (slug === 'All') {
      delete newParams.category;
    } else {
      newParams.category = slug;
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-canvas min-h-screen font-body">
      <Navbar onOpenAuth={() => setAuthOpen(true)} onSelectCategory={goShop} />
      
      {!searchQuery && <HeroBanner onShop={goShop} />}

      <div id="shopgrid" className="max-w-[1240px] mx-auto px-5 pt-4 pb-16">
        {searchQuery && (
          <h1 className="font-display text-2xl font-bold text-ink mb-6">
            Search Results for "{searchQuery}"
          </h1>
        )}

        {/* --- CATEGORY PILLS BAR WITH INCREASED TOP/BOTTOM SPACING --- */}
        <div className="flex gap-3.5 my-8 flex-wrap items-center">
          <button
            onClick={() => goShop("All")}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
              shopTab === "All" ? "bg-ink text-white border-ink" : "bg-white border-line hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => goShop(c.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                shopTab === c.slug ? "bg-ink text-white border-ink" : "bg-white border-line hover:bg-gray-50"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {(searchQuery || shopTab !== "All") && (
          <button
            onClick={handleBackToHome}
            className="mt-2 mb-6 font-bold text-black text-lg block cursor-pointer hover:underline"
          >
            ← Back to Home
          </button>
        )}

        {/* --- PRODUCT GRID WITH SPACING --- */}
        <div className="grid gap-6 mt-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
          {filteredProducts.length === 0 ? (
            <div className="col-span-full bg-white border border-line rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-canvasalt rounded-full flex items-center justify-center mx-auto mb-4 text-[#736D5E]">
                <Icons.Inbox size={28} strokeWidth={1.5} />
              </div>
              <p className="font-display text-lg font-bold mb-2 text-ink">No products found</p>
              <p className="text-xs text-[#736D5E] mb-6 max-w-sm mx-auto">We couldn't find any products matching your selection. Try clearing your filters or changing the search terms.</p>
              <button
                onClick={handleBackToHome}
                className="px-6 py-2.5 bg-ink text-white rounded-lg text-xs font-semibold hover:bg-opacity-95 transition-all shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProducts.map((p) => <ProductTile key={p.id} product={p} />)
          )}
        </div>
      </div>

      <Footer />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}