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
  const { categories, brands, products, coupons, toast } = useShop();
  const [authOpen, setAuthOpen] = useState(false);
  const [shopTab, setShopTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const q = params.get("q");

  useEffect(() => {
    if (categories.length && !shopTab) setShopTab(categories[0].slug);
  }, [categories, shopTab]);

  const newReleases = useMemo(() => products.filter((p) => p.tag === "NEW"), [products]);
  const trending = useMemo(() => products.filter((p) => p.tag === "TRENDING"), [products]);
  const shopTabProducts = useMemo(
    () => (q ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.description?.toLowerCase().includes(q.toLowerCase())) : products.filter((p) => p.category?.slug === shopTab)),
    [products, shopTab, q]
  );

  const filteredProducts = useMemo(() => {
    const source = searchQuery ? products : shopTabProducts;
    return source.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, shopTabProducts, searchQuery]);

  const goShop = (slug) => {
    setShopTab(slug);
    document.getElementById("shopgrid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-canvas min-h-screen font-body">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} onOpenAuth={() => setAuthOpen(true)} onSelectCategory={goShop} />
      <HeroBanner onShop={goShop} />

      <div className="max-w-[1240px] mx-auto px-5 pt-5.5">
        <div className="flex gap-3.5 overflow-x-auto hide-scroll pb-1.5">
          {categories.map((c) => {
            const imageUrl = CATEGORY_IMAGES[c.slug];
            const Icon = Icons[c.icon] || Package;
            return (
              <div key={c.id} onClick={() => goShop(c.slug)} className="hover-lift flex-shrink-0 w-[108px] text-center cursor-pointer">
                <div className="w-[68px] h-[68px] rounded-full bg-canvasalt flex items-center justify-center mx-auto mb-2 overflow-hidden">
                  {imageUrl ? (
                    <img src={imageUrl} alt={c.name} className="object-cover w-full h-full rounded-full" />
                  ) : (
                    <Icon size={26} strokeWidth={1.4} color="#1F345C" />
                  )}
                </div>
                <span className="text-xs font-semibold">{c.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 pt-8.5">
        <Divider label="New releases" />
        <div className="flex gap-3.5 overflow-x-auto hide-scroll pb-1.5">
          {newReleases.map((p) => <ProductTile key={p.id} product={p} />)}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 pt-7.5">
        <Divider label="Trending now" />
        <div className="flex gap-3.5 overflow-x-auto hide-scroll pb-1.5">
          {trending.map((p) => <ProductTile key={p.id} product={p} />)}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 pt-7.5">
        <Divider label="Offers for you" />
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {coupons.map((c) => {
            const Icon = COUPON_ICONS[c.code] || Gift;
            return (
              <div key={c.code} className="hover-lift flex items-center gap-3.5 bg-ink rounded-2xl px-4.5 py-4">
                <div className="w-[42px] h-[42px] rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} color="#C69A3E" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="font-mono text-[13px] font-bold text-gold mb-0.5 tracking-wide">{c.code}</p>
                  <p className="text-xs text-[#D9D4C6]">{c.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div id="shopgrid" className="max-w-[1240px] mx-auto px-5 pt-8.5">
        <Divider label="Shop by category" />
        <div className="flex gap-2 mb-4.5 flex-wrap">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setShopTab(c.slug)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border ${shopTab === c.slug ? "bg-ink text-white border-ink" : "bg-white border-line"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#736D5E] font-medium text-sm">
              No products found matching your search
            </div>
          ) : (
            filteredProducts.map((p) => <ProductTile key={p.id} product={p} />)
          )}
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-5 pt-8.5">
        <Divider label="Explore brands" />
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}>
          {brands.map((b) => {
            const logoUrl = BRAND_LOGOS[b.slug];
            return (
              <div key={b.id} onClick={() => navigate(`/brands/${b.slug}`)} className="hover-lift cursor-pointer bg-white border border-line rounded-2xl px-3 py-4.5 flex flex-col items-center gap-2.5">
                <div className="w-[46px] h-[46px] rounded-full text-white flex items-center justify-center font-display font-semibold text-[15px] overflow-hidden" style={{ background: b.colorHex }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt={b.name} className="object-cover w-full h-full rounded-full" />
                  ) : (
                    b.initials
                  )}
                </div>
                <span className="text-xs font-semibold text-center">{b.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-3 rounded-lg text-[13px] z-[200]">
          {toast}
        </div>
      )}
    </div>
  );
}
