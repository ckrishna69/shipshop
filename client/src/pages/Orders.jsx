import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import CartDrawer from "../components/CartDrawer.jsx";
import WishlistDrawer from "../components/WishlistDrawer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

const STATUS_STYLE = {
  paid: { bg: "#E1F0EB", color: "#2E6E60" },
  pending: { bg: "#FBF1DD", color: "#9C7626" },
  failed: { bg: "#FBEDE8", color: "#B2543A" },
  cancelled: { bg: "#F1ECDF", color: "#736D5E" },
};

export default function Orders() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(!user);

  useEffect(() => {
    if (user) api.get("/orders").then(setOrders).catch(() => {});
  }, [user]);

  return (
    <div className="bg-canvas min-h-screen font-body">
      <Navbar onOpenAuth={() => setAuthOpen(true)} onOpenCart={() => setCartOpen(true)} onOpenWishlist={() => setWishOpen(true)} onSelectCategory={() => navigate("/")} />
      <div className="max-w-[820px] mx-auto px-5 py-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1F345C] mb-6"><ArrowLeft size={16} /> Continue shopping</button>
        <p className="font-display text-[28px] font-semibold mb-6">Your orders</p>

        {!user && ready && <p className="text-[13.5px] text-[#736D5E]">Log in to see your order history.</p>}

        {user && orders.length === 0 && <p className="text-[13.5px] text-[#736D5E]">No orders yet — once you check out, they'll show up here.</p>}

        {orders.map((o) => {
          const st = STATUS_STYLE[o.status] || STATUS_STYLE.pending;
          return (
            <div key={o.id} className="bg-white border border-line rounded-2xl p-5 mb-3.5">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Package size={16} color="#1F345C" strokeWidth={1.6} />
                  <span className="font-mono text-[11.5px] text-[#736D5E]">{o.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase" style={{ background: st.bg, color: st.color }}>{o.status}</span>
              </div>
              {o.items.map((i) => (
                <div key={i.id} className="flex justify-between text-[13px] py-1">
                  <span>{i.product.name} × {i.qty}</span>
                  <span className="font-mono">{money(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[13.5px] font-bold pt-2.5 mt-2 border-t border-line">
                <span>Total</span><span className="font-mono">{money(o.totalAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
      {wishOpen && <WishlistDrawer onClose={() => setWishOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
