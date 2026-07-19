import { X, Minus, Plus } from "lucide-react";
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function CartDrawer({ onClose }) {
  const { cart, changeQty, removeFromCart } = useShop();
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + i.qty * i.product.price, 0);

  return (
    <div className="fixed inset-0 bg-ink/35 z-[100] flex justify-end" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-[380px] max-w-[90vw] bg-canvas h-full p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4.5">
          <p className="font-display text-xl font-semibold">Your cart</p>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {cart.length === 0 ? (
          <p className="text-[#736D5E] text-[13.5px]">Your cart is empty. Add something you like.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((i) => {
                const Icon = Icons[i.product.icon] || Icons.Package;
                return (
                  <div key={i.id} className="flex gap-2.5 py-3 border-b border-line">
                    <div className="w-[54px] h-[54px] rounded-lg bg-canvasalt flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {i.product.image ? (
                        <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Icon size={22} color="#1F345C" strokeWidth={1.4} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold mb-1">{i.product.name}</p>
                      <p className="font-mono text-[12.5px] font-bold mb-1.5">{money(i.product.price)}</p>
                      <div className="flex items-center gap-2">
                        <button onClick={() => changeQty(i.productId, i.qty - 1)} className="w-[22px] h-[22px] rounded-md border border-line bg-white"><Minus size={12} className="mx-auto" /></button>
                        <span className="font-mono text-[12.5px]">{i.qty}</span>
                        <button onClick={() => changeQty(i.productId, i.qty + 1)} className="w-[22px] h-[22px] rounded-md border border-line bg-white"><Plus size={12} className="mx-auto" /></button>
                        <button onClick={() => removeFromCart(i.productId)} className="ml-auto text-rust text-[11.5px]">Remove</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="pt-4 mt-6 border-t border-line">
              <div className="flex justify-between text-sm font-bold mb-3.5">
                <span>Subtotal</span><span className="font-mono">{money(total)}</span>
              </div>
              <button
                onClick={() => { onClose(); navigate("/checkout"); }}
                className="w-full py-3 mt-4 bg-gold text-ink rounded-lg font-medium transition-colors text-[13.5px]"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
