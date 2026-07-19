import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Heart, ShoppingCart, User, ChevronDown, Truck, LogOut, LayoutGrid } from "lucide-react";
import * as Icons from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useShop } from "../context/ShopContext.jsx";

const CATEGORY_IMAGES = {
  groceries: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=150",
  fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150",
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150",
  home: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=150",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150",
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=150",
  kids: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150"
};

export default function Navbar({ onOpenAuth, onSelectCategory, searchQuery, setSearchQuery }) {
  const { user, logout } = useAuth();
  const { categories, cart, wishlist, searchProducts } = useShop();
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCat, setActiveCat] = useState(null);
  const [localSearch, setLocalSearch] = useState("");
  const navigate = useNavigate();

  const search = searchQuery !== undefined ? searchQuery : localSearch;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const active = categories.find((c) => c.id === activeCat) || categories[0];

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (setSearchQuery) {
      setSearchQuery(val);
    } else {
      setLocalSearch(val);
    }
    if (window.location.pathname === "/") {
      searchProducts(val);
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      navigate(`/?q=${encodeURIComponent(search)}`);
    } else {
      searchProducts(search);
    }
  };

  return (
    <>
      <div className="bg-canvas border-b border-line sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-5 py-3.5 flex items-center gap-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-lg bg-ink flex items-center justify-center">
              <Truck size={18} color="#C69A3E" strokeWidth={2} />
            </div>
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">Shipshop</span>
          </Link>

          <div className="relative">
            <button onClick={() => setMegaOpen((v) => !v)} className="flex items-center gap-1.5 font-semibold text-sm">
              <LayoutGrid size={16} className="text-ink flex-shrink-0" />
              Categories <ChevronDown size={15} className={megaOpen ? "rotate-180 transition" : "transition"} />
            </button>
            {megaOpen && (
              <div className="absolute top-9 left-0 w-[620px] bg-white border border-line rounded-2xl shadow-xl flex overflow-hidden z-50">
                <div className="w-[180px] bg-canvasalt p-2.5">
                  {categories.map((c) => {
                    const Icon = Icons[c.icon] || Icons.Package;
                    return (
                      <div
                        key={c.id}
                        onMouseEnter={() => setActiveCat(c.id)}
                        onClick={() => { onSelectCategory(c.slug); setMegaOpen(false); }}
                        className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-[13.5px] font-semibold ${activeCat === c.id ? "bg-white" : ""}`}
                      >
                        {CATEGORY_IMAGES[c.slug] ? (
                          <img src={CATEGORY_IMAGES[c.slug]} alt={c.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <Icon size={16} strokeWidth={1.6} color="#1F345C" />
                        )}
                        <span>{c.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex-1 flex flex-col">
                  <p className="font-mono text-[10.5px] text-[#736D5E] uppercase pt-6 px-6 mb-1 tracking-wider">{active?.name}</p>
                  <div className="flex gap-4 p-6 pt-2 flex-grow justify-between items-start">
                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                      {active?.subcategories?.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => { onSelectCategory(active.slug); setMegaOpen(false); }}
                          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-[12.5px] font-medium"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                          <span>{s.name}</span>
                        </div>
                      ))}
                    </div>
                    {active && CATEGORY_IMAGES[active.slug] && (
                      <div className="w-[140px] h-[130px] rounded-xl overflow-hidden relative flex-shrink-0 shadow-sm border border-line bg-canvasalt flex items-end">
                        <img src={CATEGORY_IMAGES[active.slug]} alt={active.name} className="w-full h-full object-cover absolute inset-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                        <span className="relative z-10 p-2.5 text-[10.5px] font-bold text-white tracking-wide uppercase leading-tight">{active.name} Collection</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={submitSearch} className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#736D5E]" />
            <input
              value={search}
              onChange={handleSearchChange}
              placeholder="Search for products, brands and more"
              className="w-full py-2.5 pl-9 pr-3 rounded-lg border border-line bg-white text-[13.5px]"
            />
          </form>

          <div className="flex items-center gap-5">
            <Link to="/wishlist" className="relative flex items-center" aria-label="Wishlist">
              <Heart size={21} strokeWidth={1.5} color="#132242" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rust text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-mono">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="relative flex items-center" aria-label="Cart">
              <ShoppingCart size={21} strokeWidth={1.5} color="#132242" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-teal text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-mono">{cartCount}</span>
              )}
            </Link>
            {user ? (
              <div onClick={logout} className="flex items-center gap-1.5 cursor-pointer" title="Log out">
                <div className="w-[30px] h-[30px] rounded-full bg-gold text-white flex items-center justify-center font-semibold text-xs">
                  {user.name?.[0] || "U"}
                </div>
                <LogOut size={15} color="#736D5E" />
              </div>
            ) : (
              <button onClick={onOpenAuth} className="flex items-center gap-1.5 bg-ink text-white px-4 py-2 rounded-lg font-semibold text-[13.5px]">
                <User size={15} /> Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
