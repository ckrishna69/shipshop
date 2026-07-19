import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, QrCode, ShieldCheck, ArrowLeft, Check } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import CartDrawer from "../components/CartDrawer.jsx";
import WishlistDrawer from "../components/WishlistDrawer.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { api } from "../api/client.js";
import { useShop } from "../context/ShopContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

// Loads Razorpay's checkout.js once and reuses it.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, fire } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [method, setMethod] = useState("razorpay");
  const [upiInfo, setUpiInfo] = useState(null);
  const [paid, setPaid] = useState(false);
  const [processing, setProcessing] = useState(false);

  const total = cart.reduce((s, i) => s + i.qty * i.product.price, 0);

  useEffect(() => {
    if (method === "upi") api.get("/payment/support-upi").then(setUpiInfo).catch(() => {});
  }, [method]);

  const payWithRazorpay = async () => {
    if (!user) { setAuthOpen(true); return; }
    setProcessing(true);
    try {
      const order = await api.post("/orders", {});
      const rp = await api.post("/payment/razorpay/create-order", { orderId: order.id });
      const ok = await loadRazorpayScript();
      if (!ok) { fire("Couldn't load Razorpay — check your connection"); setProcessing(false); return; }

      const rzp = new window.Razorpay({
        key: rp.keyId,
        amount: rp.amount,
        currency: rp.currency,
        name: "Shipshop",
        description: "Order payment",
        order_id: rp.razorpayOrderId,
        prefill: { name: user.name, email: user.email },
        theme: { color: "#132242" },
        handler: async (response) => {
          await api.post("/payment/razorpay/verify", response);
          setPaid(true);
        },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } catch (e) {
      fire(e.message);
    } finally {
      setProcessing(false);
    }
  };

  if (paid) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-[#E1F0EB] flex items-center justify-center mx-auto mb-5">
            <Check size={28} color="#2E6E60" />
          </div>
          <p className="font-display text-2xl font-semibold mb-2">Payment successful</p>
          <p className="text-sm text-[#736D5E] mb-6">Your order has been placed. You can track it from your orders page.</p>
          <button onClick={() => navigate("/orders")} className="bg-ink text-white px-6 py-3 rounded-lg font-bold text-sm">View orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-canvas min-h-screen font-body">
      <Navbar onOpenAuth={() => setAuthOpen(true)} onOpenCart={() => setCartOpen(true)} onOpenWishlist={() => setWishOpen(true)} onSelectCategory={() => navigate("/")} />
      <div className="max-w-[720px] mx-auto px-5 py-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1F345C] mb-6"><ArrowLeft size={16} /> Continue shopping</button>
        <p className="font-display text-[28px] font-semibold mb-1">Checkout</p>
        <p className="text-[13px] text-[#736D5E] mb-6">Review your order and choose how you'd like to pay.</p>

        <div className="bg-white border border-line rounded-2xl p-5 mb-5">
          {cart.map((i) => (
            <div key={i.id} className="flex justify-between text-[13.5px] py-1.5">
              <span>{i.product.name} × {i.qty}</span>
              <span className="font-mono">{money(i.product.price * i.qty)}</span>
            </div>
          ))}
          <div className="flex justify-between text-[15px] font-bold pt-3 mt-2 border-t-[1.5px] border-dashed border-line">
            <span>Total</span><span className="font-mono">{money(total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button onClick={() => setMethod("razorpay")} className={`flex items-center gap-2.5 p-4 rounded-2xl border text-left ${method === "razorpay" ? "border-ink bg-white" : "border-line bg-white/60"}`}>
            <CreditCard size={20} color="#132242" strokeWidth={1.6} />
            <div>
              <p className="text-[13.5px] font-bold">Pay with Razorpay</p>
              <p className="text-[11px] text-[#736D5E]">Cards, UPI, netbanking</p>
            </div>
          </button>
          <button onClick={() => setMethod("upi")} className={`flex items-center gap-2.5 p-4 rounded-2xl border text-left ${method === "upi" ? "border-ink bg-white" : "border-line bg-white/60"}`}>
            <QrCode size={20} color="#132242" strokeWidth={1.6} />
            <div>
              <p className="text-[13.5px] font-bold">Support this project</p>
              <p className="text-[11px] text-[#736D5E]">Optional UPI tip, no shipment</p>
            </div>
          </button>
        </div>

        {method === "razorpay" && (
          <div className="bg-white border border-line rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 text-[12.5px] text-[#736D5E]">
              <ShieldCheck size={15} color="#2E6E60" /> Secured by Razorpay — a real, test-mode payment gateway
            </div>
            <button onClick={payWithRazorpay} disabled={processing || cart.length === 0} className="w-full py-3 bg-ink text-white rounded-lg font-bold text-[13.5px] disabled:opacity-50">
              {processing ? "Opening Razorpay…" : `Pay ${money(total)}`}
            </button>
            {!user && <p className="text-[11.5px] text-[#736D5E] mt-2.5">You'll be asked to log in first.</p>}
          </div>
        )}

        {method === "upi" && (
          <div className="bg-white border border-line rounded-2xl p-5 text-center">
            <p className="text-[12.5px] text-rust font-semibold mb-4 bg-[#FBEDE8] rounded-lg p-3">
              {upiInfo?.disclaimer || "This is a portfolio project. No product will be shipped. Paying is entirely optional and not verified automatically."}
            </p>
            {upiInfo?.qrDataUrl && <img src={upiInfo.qrDataUrl} alt="UPI QR code" className="w-[180px] h-[180px] mx-auto mb-3 rounded-lg border border-line" />}
            <p className="text-[13px] font-mono font-bold">{upiInfo?.upiId}</p>
            <p className="text-[12px] text-[#736D5E] mt-1">{upiInfo?.name}</p>
          </div>
        )}
      </div>
      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
      {wishOpen && <WishlistDrawer onClose={() => setWishOpen(false)} />}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
