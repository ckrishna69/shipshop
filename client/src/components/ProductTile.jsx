import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import * as Icons from "lucide-react";
import { Heart, X, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function ProductTile({ product }) {
  // Destructure openAuthModal (or setShowAuthModal) from AuthContext
  const { user, openAuthModal, setShowAuthModal } = useAuth();
  const { addToCart, toggleWishlist, wishlist, cart } = useShop();
  const navigate = useNavigate();

  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");

  const Icon = Icons[product.icon] || Icons.Package;
  const wished = wishlist.some((w) => w.productId === product.id);
  const isInCart = cart.some((item) => item.productId === product.id || item.id === product.id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (!user) {
      setPromptMessage("Please log in to add items to your wishlist.");
      setShowAuthPrompt(true);
      return;
    }
    toggleWishlist(product);
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    if (!user) {
      setPromptMessage("Please log in to add items to your cart.");
      setShowAuthPrompt(true);
      return;
    }

    if (isInCart) {
      navigate("/cart");
    } else {
      addToCart(product);
    }
  };

  const handleOpenLogin = () => {
    setShowAuthPrompt(false);
    setShowAuthModal(true); // Opens the login modal instantly!
  };
  return (
    <>
      <div className="hover-lift flex-shrink-0 w-full bg-white border border-line rounded-2xl overflow-hidden">
        <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://images.unsplash.com/photo-1608248597261-83325863d646?auto=format&fit=crop&w=800&q=80";
              }}
            />
          ) : (
            <Icon size={44} strokeWidth={1.2} color="#1F345C" />
          )}
          {product.tag && (
            <span
              className="absolute top-2.5 left-2.5 text-white font-mono text-[10px] px-2 py-1 rounded-md"
              style={{ background: product.tag === "NEW" ? "#2E6E60" : "#B2543A" }}
            >
              {product.tag}
            </span>
          )}
          <button
            onClick={handleWishlistClick}
            aria-label="Wishlist"
            className="absolute top-2 right-2 bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          >
            <Heart size={15} color={wished ? "#B2543A" : "#736D5E"} fill={wished ? "#B2543A" : "none"} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-3 pb-3.5">
          <p className="font-mono text-[10px] text-[#736D5E] uppercase mb-1 tracking-wide">{product.brand?.name}</p>
          <p className="font-body text-[13.5px] font-semibold mb-2 leading-snug min-h-[34px]">{product.name}</p>
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="font-mono text-sm font-bold">{money(product.price)}</span>
            <span className="font-mono text-[11px] text-[#736D5E] line-through">{money(product.mrp)}</span>
          </div>
          <button
            onClick={handleCartClick}
            className={`w-full py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
              isInCart 
                ? "border-ink text-ink bg-transparent hover:bg-canvasalt" 
                : "bg-ink text-white border-ink hover:bg-opacity-95"
            }`}
          >
            {isInCart ? "Go to cart" : "Add to cart"}
          </button>
        </div>
      </div>

      {/* --- AUTHENTICATION PROMPT POPUP --- */}
      {showAuthPrompt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowAuthPrompt(false)}
        >
          <div 
            className="bg-white border-2 border-black rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowAuthPrompt(false)}
              className="absolute top-3 right-3 text-black hover:opacity-70 p-1"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <LogIn size={22} />
            </div>

            <h3 className="text-xl font-bold text-black mb-2">Authentication Required</h3>
            
            <p className="text-sm font-semibold text-black mb-6">
              {promptMessage}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="flex-1 py-2.5 border-2 border-black font-bold text-black text-xs rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleOpenLogin}
                className="flex-1 py-2.5 bg-black font-bold text-white text-xs rounded-xl hover:bg-gray-800 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}