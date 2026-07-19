import { X } from "lucide-react";
import * as Icons from "lucide-react";
import { useShop } from "../context/ShopContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function WishlistDrawer({ onClose }) {
  const { wishlist, addToCart } = useShop();

  return (
    <div className="fixed inset-0 bg-ink/35 z-[100] flex justify-end" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-[380px] max-w-[90vw] bg-canvas h-full p-5.5 overflow-y-auto">
        <div className="flex justify-between items-center mb-4.5">
          <p className="font-display text-xl font-semibold">Your wishlist</p>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {wishlist.length === 0 ? (
          <p className="text-[#736D5E] text-[13.5px]">Nothing saved yet.</p>
        ) : (
          wishlist.map((i) => {
            const Icon = Icons[i.product.icon] || Icons.Package;
            return (
              <div key={i.id} className="flex gap-2.5 py-3 border-b border-line items-center">
                <div className="w-[54px] h-[54px] rounded-lg bg-canvasalt flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {i.product.image ? (
                    <img src={i.product.image} alt={i.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Icon size={22} color="#1F345C" strokeWidth={1.4} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold mb-1">{i.product.name}</p>
                  <p className="font-mono text-[12.5px] font-bold">{money(i.product.price)}</p>
                </div>
                <button onClick={() => addToCart(i.product)} className="bg-ink text-white rounded-lg px-2.5 py-1.5 text-[11.5px]">Add</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
