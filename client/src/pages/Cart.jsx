import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X, Heart, Shield, ArrowLeft } from "lucide-react";
import * as Icons from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function Cart() {
  const { user } = useAuth();
  const { cart, changeQty, removeFromCart, toggleWishlist, wishlist } = useShop();
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();

  const totalMRP = cart.reduce((s, i) => s + i.qty * i.product.mrp, 0);
  const totalDiscount = cart.reduce((s, i) => s + i.qty * (i.product.mrp - i.product.price), 0);
  const platformFee = cart.length > 0 ? 49 : 0;
  const totalPayable = totalMRP - totalDiscount + platformFee;

  const handleMoveToWishlist = async (product) => {
    const isWished = wishlist.some((w) => w.productId === product.id);
    if (!isWished) {
      await toggleWishlist(product);
    }
    await removeFromCart(product.id);
  };

  return (
    <div className="bg-[#f9f9fa] min-h-screen font-body text-ink flex flex-col">
      <Navbar onOpenAuth={() => setAuthOpen(true)} onSelectCategory={() => navigate("/")} />

      <main className="flex-grow max-w-[1100px] w-full mx-auto px-5 py-8">
        {!user ? (
          <div className="bg-white rounded-2xl border border-line p-10 text-center max-w-[480px] mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-canvasalt rounded-full flex items-center justify-center mx-auto mb-5 text-[#1F345C]">
              <Icons.Lock size={28} />
            </div>
            <h2 className="font-display text-xl font-bold mb-3">Please log in</h2>
            <p className="text-[#736D5E] text-sm mb-6">Login to view the items in your shopping bag and proceed to checkout.</p>
            <button
              onClick={() => setAuthOpen(true)}
              className="px-8 py-3 bg-ink text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
            >
              Login / Register
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-2xl border border-line p-10 text-center max-w-[480px] mx-auto my-12 shadow-sm">
            <div className="w-16 h-16 bg-canvasalt rounded-full flex items-center justify-center mx-auto mb-5 text-ink">
              <Icons.ShoppingBag size={28} />
            </div>
            <h2 className="font-display text-xl font-bold mb-3">Your shopping bag is empty</h2>
            <p className="text-[#736D5E] text-sm mb-6">There is nothing in your bag. Add items from your wishlist or active offers.</p>
            <Link
              to="/"
              className="inline-block px-8 py-3 bg-ink text-white rounded-lg text-sm font-semibold hover:bg-opacity-90 transition"
            >
              Go Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Item List */}
            <div className="w-full lg:w-2/3 space-y-4">
              <div className="bg-white border border-line rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <span className="font-semibold text-[15px]">Items in Bag ({cart.reduce((s, i) => s + i.qty, 0)})</span>
                <Link to="/" className="text-xs text-ink font-bold flex items-center gap-1 hover:underline">
                  <ArrowLeft size={13} /> Continue Shopping
                </Link>
              </div>

              <div className="space-y-3.5">
                {cart.map((i) => {
                  const Icon = Icons[i.product.icon] || Icons.Package;
                  return (
                    <div key={i.id} className="relative bg-white border border-line rounded-2xl p-5 flex items-stretch gap-4 shadow-sm hover:shadow-md transition-shadow min-h-[160px] sm:min-h-[180px]">
                      {/* Product Image */}
                      <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-xl bg-canvasalt flex items-center justify-center flex-shrink-0 overflow-hidden border border-line self-center">
                        {i.product.image ? (
                          <img 
                            src={i.product.image} 
                            alt={i.product.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "https://images.unsplash.com/photo-1608248597261-83325863d646?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        ) : (
                          <Icon size={34} color="#1F345C" strokeWidth={1.2} />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between pl-1">
                        {/* Top: Brand, Title, Price */}
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-mono text-[10px] text-[#736D5E] uppercase tracking-wide mb-0.5">{i.product.brand?.name}</p>
                              <h3 className="text-sm font-bold text-ink pr-5 leading-tight mb-1.5">{i.product.name}</h3>
                            </div>
                            <button
                              onClick={() => removeFromCart(i.productId)}
                              className="absolute top-4 right-4 text-ink hover:text-rust transition"
                              aria-label="Remove item"
                            >
                              <X size={17} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm font-extrabold">{money(i.product.price)}</span>
                            <span className="font-mono text-xs text-[#736D5E] line-through">{money(i.product.mrp)}</span>
                            <span className="text-[10.5px] text-teal font-semibold font-mono">
                              ({Math.round(((i.product.mrp - i.product.price) / i.product.mrp) * 100)}% OFF)
                            </span>
                          </div>
                        </div>

                        {/* Middle: Qty Selector */}
                        <div className="my-2 flex items-center">
                          <div className="flex items-center gap-2 bg-canvasalt px-2.5 py-1 rounded-lg">
                            <span className="text-xs font-semibold text-[#736D5E]">Qty:</span>
                            <button
                              onClick={() => changeQty(i.productId, i.qty - 1)}
                              className="w-[20px] h-[20px] rounded bg-white border border-line flex items-center justify-center disabled:opacity-50"
                              disabled={i.qty <= 1}
                            >
                              <Minus size={11} />
                            </button>
                            <span className="font-mono text-xs font-semibold w-4 text-center">{i.qty}</span>
                            <button
                              onClick={() => changeQty(i.productId, i.qty + 1)}
                              className="w-[20px] h-[20px] rounded bg-white border border-line flex items-center justify-center"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Bottom: Move to Wishlist */}
                        <div className="pt-2.5 border-t border-line">
                          <button
                            onClick={() => handleMoveToWishlist(i.product)}
                            className="text-xs text-ink font-bold flex items-center gap-1.5 py-1 hover:underline"
                          >
                            <Heart size={13} fill="#132242" color="#132242" /> Move to Wishlist
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Price Summary */}
            <div className="w-full lg:w-1/3 lg:sticky lg:top-[85px] space-y-4">
              <div className="bg-white border border-line rounded-2xl p-8 shadow-sm">
                <p className="font-mono text-[10.5px] text-[#736D5E] uppercase tracking-wider mb-4">Price Details ({cart.reduce((s, i) => s + i.qty, 0)} Items)</p>

                <div className="space-y-4 text-[13px] border-b border-line pb-6 my-4">
                  <div className="flex justify-between text-ink">
                    <span>Total MRP</span>
                    <span className="font-mono">{money(totalMRP)}</span>
                  </div>
                  <div className="flex justify-between text-teal">
                    <span>Discount on MRP</span>
                    <span className="font-mono">-{money(totalDiscount)}</span>
                  </div>
                  <div className="flex justify-between text-ink">
                    <span>Platform Fee</span>
                    <span className="font-mono text-[#736D5E]">{money(platformFee)}</span>
                  </div>
                </div>

                <div className="pt-4 pb-1">
                  <div className="flex justify-between text-sm font-bold mb-5">
                    <span>Total Payable</span>
                    <span className="font-mono">{money(totalPayable)}</span>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full py-4 bg-[#132242] hover:bg-[#1f345c] text-white font-bold tracking-wide rounded-xl uppercase transition-colors text-[13.5px] shadow-sm shadow-[#132242]/20"
                  >
                    Place Order
                  </button>
                </div>
              </div>

              {/* Secure Transaction Info */}
              <div className="flex items-center gap-3 px-3 text-[#736D5E]">
                <Shield size={20} className="text-teal flex-shrink-0" />
                <span className="text-[11.5px] leading-snug">Safe and Secure Payments. 100% Authentic products guaranteed.</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
