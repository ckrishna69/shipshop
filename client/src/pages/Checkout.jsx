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
  const { cart, fire, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [method, setMethod] = useState("razorpay");
  const [upiInfo, setUpiInfo] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [demoMode, setDemoMode] = useState(true);

  const totalMRP = cart.reduce((s, i) => s + i.qty * i.product.mrp, 0);
  const totalDiscount = cart.reduce((s, i) => s + i.qty * (i.product.mrp - i.product.price), 0);
  const platformFee = cart.length > 0 ? 49 : 0;
  const totalPayable = totalMRP - totalDiscount + platformFee;

  useEffect(() => {
    if (method === "upi") api.get("/payment/support-upi").then(setUpiInfo).catch(() => {});
  }, [method]);

  const payWithRazorpay = async () => {
    if (!user) { setAuthOpen(true); return; }
    setProcessing(true);
    try {
      const order = await api.post("/orders", {});
      const rp = await api.post("/payment/create-order", { amount: totalPayable, orderId: order.id });
      const ok = await loadRazorpayScript();
      if (!ok) { fire("Couldn't load Razorpay — check your connection"); setProcessing(false); return; }

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TFdQU3Ym45s2qQ",
        amount: rp.amount,
        currency: rp.currency,
        name: "Shipshop",
        description: "Order payment",
        order_id: rp.id,
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: { color: "#132242" },
        handler: async (response) => {
          const res = await api.post("/payment/verify", response);
          clearCart();
          setCompletedOrder(res.order);
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

  const handleDemoPayment = async () => {
    if (!user) { setAuthOpen(true); return; }
    setProcessing(true);
    try {
      const order = await api.post("/orders", {});
      const mockPaymentId = `pay_demo_${Date.now()}`;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await api.post("/payment/verify", {
        razorpay_payment_id: mockPaymentId,
        orderId: order.id
      });
      clearCart();
      setCompletedOrder(res.order);
    } catch (e) {
      fire(e.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-canvas min-h-screen font-body">
      <Navbar onOpenAuth={() => setAuthOpen(true)} onOpenCart={() => setCartOpen(true)} onOpenWishlist={() => setWishOpen(true)} onSelectCategory={() => navigate("/")} />
      <div className="max-w-[720px] mx-auto px-5 py-8">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1F345C] mb-6"><ArrowLeft size={16} /> Continue shopping</button>
        <p className="font-display text-[28px] font-semibold mb-1">Checkout</p>
        <p className="text-[13px] text-[#736D5E] mb-6">Review your order and choose how you'd like to pay.</p>

        <div className="bg-white border border-line rounded-2xl p-5 mb-5">
          <p className="font-mono text-[10px] text-[#736D5E] uppercase tracking-wider mb-3">Order Summary</p>
          {cart.map((i) => (
            <div key={i.id} className="flex justify-between text-[13px] py-1 text-ink/90">
              <span>{i.product.name} × {i.qty}</span>
              <span className="font-mono">{money(i.product.price * i.qty)}</span>
            </div>
          ))}
          <div className="space-y-2.5 text-[12.5px] border-t border-line/60 pt-3.5 mt-3 text-ink">
            <div className="flex justify-between">
              <span className="text-[#736D5E]">Total MRP</span>
              <span className="font-mono">{money(totalMRP)}</span>
            </div>
            <div className="flex justify-between text-teal">
              <span>Discount on MRP</span>
              <span className="font-mono">-{money(totalDiscount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#736D5E]">Platform Fee</span>
              <span className="font-mono">{money(platformFee)}</span>
            </div>
          </div>
          <div className="flex justify-between text-[14.5px] font-bold pt-3 mt-3 border-t border-dashed border-line text-ink">
            <span>Total Payable</span>
            <span className="font-mono">{money(totalPayable)}</span>
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
            <div className="flex items-center justify-between p-3.5 mb-4 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <p className="text-[13px] font-bold text-emerald-950">Instant Payment (Demo Mode)</p>
                  <p className="text-[11px] text-emerald-700/80">Skip Razorpay popup & verify instantly</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={demoMode} 
                  onChange={(e) => setDemoMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <div className="flex items-center gap-2 mb-4 text-[12.5px] text-[#736D5E]">
              <ShieldCheck size={15} color="#2E6E60" /> Secured by Razorpay — a real, test-mode payment gateway
            </div>

            {demoMode ? (
              <>
                <button 
                  onClick={handleDemoPayment} 
                  disabled={processing || cart.length === 0} 
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[13.5px] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    "Instant Payment (Demo & Print Receipt)"
                  )}
                </button>
                <button
                  type="button"
                  onClick={payWithRazorpay}
                  disabled={processing || cart.length === 0}
                  className="w-full mt-2.5 py-2.5 bg-white border border-line text-ink rounded-lg font-semibold text-[13px] hover:bg-canvasalt transition-colors"
                >
                  Pay via Razorpay Portal
                </button>
              </>
            ) : (
              <button 
                onClick={payWithRazorpay} 
                disabled={processing || cart.length === 0} 
                className="w-full py-3 bg-ink text-white rounded-lg font-bold text-[13.5px] disabled:opacity-50"
              >
                {processing ? "Opening Razorpay…" : `Pay ${money(totalPayable)}`}
              </button>
            )}

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

      {completedOrder && (
        <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[250] flex items-center justify-center p-4 print:p-0 print:static print:bg-transparent print:backdrop-blur-none animate-fade-in">
          <div className="bg-white border border-line rounded-2xl p-6 max-w-[440px] w-full shadow-2xl relative print:border-none print:shadow-none print:p-0 print:max-w-none print:rounded-none animate-scale-up">
            
            {/* Printable Invoice Container */}
            <div className="print-content">
              {/* Green checkmark header */}
              <div className="flex flex-col items-center mb-4 text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2.5 border border-emerald-100">
                  <Check size={24} strokeWidth={3} />
                </div>
                <h2 className="font-display text-xl font-bold text-ink">Payment Successful</h2>
                <p className="text-[12px] text-[#736D5E] mt-0.5">Thank you for your order!</p>
              </div>

              {completedOrder.paymentMethod === "demo" && (
                <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-[11.5px] font-bold flex items-center justify-center gap-1.5 print:bg-emerald-50 print:border-emerald-200 print:text-emerald-800">
                  <span>✓ Payment Successful - Demo Mode</span>
                </div>
              )}

              <div className="space-y-3 mb-4 text-[12px] text-ink">
                <div className="bg-canvasalt/50 border border-line/60 rounded-xl p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#736D5E]">Store Name:</span>
                    <span className="font-semibold text-right">ShipShop</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736D5E]">Order ID:</span>
                    <span className="font-mono font-semibold text-right break-all max-w-[60%]">{completedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736D5E]">Payment ID:</span>
                    <span className="font-mono font-semibold text-right break-all max-w-[60%]">{completedOrder.razorpayPaymentId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#736D5E]">Date:</span>
                    <span className="text-right">{new Date(completedOrder.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between border-t border-line/40 pt-2 mt-1.5 text-[12.5px] font-bold">
                    <span>Total Paid:</span>
                    <span className="font-mono text-emerald-700">{money(completedOrder.totalAmount)}</span>
                  </div>
                </div>

                <div className="border border-line/60 rounded-xl p-3 bg-white max-h-[140px] overflow-y-auto">
                  <p className="font-mono text-[9px] text-[#736D5E] uppercase tracking-wider mb-2">Itemized Summary</p>
                  <table className="w-full text-left border-collapse text-[11.5px]">
                    <thead>
                      <tr className="border-b border-line/60 text-[#736D5E] text-[11px]">
                        <th className="pb-1.5 font-normal">Item</th>
                        <th className="pb-1.5 text-center font-normal">Qty</th>
                        <th className="pb-1.5 text-right font-normal">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedOrder.items.map((i) => (
                        <tr key={i.id} className="border-b border-line/20 last:border-0">
                          <td className="py-1.5 text-ink/90 pr-2 max-w-[160px] truncate">{i.product.name}</td>
                          <td className="py-1.5 text-center font-mono text-[#736D5E]">{i.qty}</td>
                          <td className="py-1.5 text-right font-mono font-semibold">{money(i.price * i.qty)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Buttons (Hidden when printing) */}
            <div className="flex gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-white border border-ink text-ink rounded-lg font-semibold text-[13px] hover:bg-canvasalt transition-colors"
              >
                Print Receipt
              </button>
              <button
                onClick={() => {
                  clearCart();
                  setCompletedOrder(null);
                  navigate("/");
                }}
                className="flex-1 py-2.5 bg-ink text-white rounded-lg font-semibold text-[13px] hover:bg-opacity-95 transition-opacity"
              >
                Back to Home
              </button>
            </div>
            
            <style>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .print-content, .print-content * {
                  visibility: visible;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                .print-content {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                }
                .print-content div {
                  max-height: none !important;
                  overflow: visible !important;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
