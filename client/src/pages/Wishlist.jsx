import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, Heart } from "lucide-react";
import * as Icons from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function Wishlist() {
  const { user } = useAuth();
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  const handleMoveToBag = async (product) => {
    await addToCart(product);
    await toggleWishlist(product);
  };

  return (
    <div className="bg-[#f9f9fa] min-h-screen font-body text-ink flex flex-col">
      <Navbar onOpenAuth={() => setAuthOpen(true)} onSelectCategory={() => navigate("/")} />

      <main className="flex-grow max-w-[1240px] w-full mx-auto px-5 py-8">
        {!user ? (
          <div className="bg-white rounded-2xl border border-line p-10 text-center max-w-[480px] mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-canvasalt rounded-full flex items-center justify-center mx-auto mb-5 text-[#1F345C]">
              <Icons.Lock size={28} />
            </div>
            <h2 className="font-display text-xl font-bold mb-3">Please log in</h2>
            <p className="text-[#736D5E] text-sm mb-6">Login to view and manage items in your wishlist.</p>
            <button
              onClick={() => setAuthOpen(true)}
              className="px-8 py-3 bg-ink text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
            >
              Login / Register
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-7">
              <h1 className="font-display text-xl font-bold flex items-center gap-2">
                My Wishlist <span className="text-sm font-normal font-body text-[#736D5E]">({wishlist.length} Items)</span>
              </h1>
            </div>

            {wishlist.length === 0 ? (
              <div className="bg-white rounded-2xl border border-line p-10 text-center max-w-[480px] mx-auto my-6 shadow-sm">
                <div className="w-16 h-16 bg-canvasalt rounded-full flex items-center justify-center mx-auto mb-5 text-[#132242]">
                  <Heart size={28} />
                </div>
                <h2 className="font-display text-xl font-bold mb-3">Your wishlist is empty</h2>
                <p className="text-[#736D5E] text-sm mb-6">Save items you like to monitor price changes and quick checkout later.</p>
                <Link
                  to="/"
                  className="inline-block px-8 py-3 bg-ink text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              /* Grid Layout */
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {wishlist.map((i) => {
                  const Icon = Icons[i.product.icon] || Icons.Package;
                  const discountPct = Math.round(((i.product.mrp - i.product.price) / i.product.mrp) * 100);

                  return (
                    <div key={i.id} className="relative bg-white border border-line rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
                      {/* Product Photo */}
                      <div className="w-full aspect-[3/4] bg-canvasalt flex items-center justify-center relative overflow-hidden">
                        {i.product.image ? (
                          <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        ) : (
                          <Icon size={44} color="#1F345C" strokeWidth={1.2} />
                        )}

                        {/* 'X' Close Icon */}
                        <button
                          onClick={() => toggleWishlist(i.product)}
                          className="absolute top-2.5 right-2.5 bg-white/95 hover:bg-white rounded-full w-[26px] h-[26px] flex items-center justify-center shadow-sm text-ink hover:text-rust transition"
                          aria-label="Remove from wishlist"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Product details */}
                      <div className="p-3 flex-1 flex flex-col justify-between">
                        <div className="mb-2">
                          <p className="font-mono text-[9px] text-[#736D5E] uppercase tracking-wider mb-0.5">{i.product.brand?.name}</p>
                          <p className="text-[12.5px] font-semibold text-ink leading-tight line-clamp-2 min-h-[34px]">{i.product.name}</p>
                        </div>

                        <div>
                          <div className="flex flex-wrap items-baseline gap-1.5 mb-1.5">
                            <span className="font-mono text-sm font-extrabold">{money(i.product.price)}</span>
                            <span className="font-mono text-[11px] text-[#736D5E] line-through">{money(i.product.mrp)}</span>
                          </div>
                          <span className="text-[10px] text-teal font-semibold font-mono">
                            {discountPct}% OFF
                          </span>
                        </div>
                      </div>

                      {/* Prominent Action Button */}
                      <button
                        onClick={() => handleMoveToBag(i.product)}
                        className="w-full border-t border-line py-3 bg-white text-[#132242] font-bold text-xs uppercase tracking-wide hover:bg-canvasalt transition-colors"
                      >
                        Move to Bag
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
