import * as Icons from "lucide-react";
import { Heart } from "lucide-react";
import { useShop } from "../context/ShopContext.jsx";

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

export default function ProductTile({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const Icon = Icons[product.icon] || Icons.Package;
  const wished = wishlist.some((w) => w.productId === product.id);

  return (
    <div className="hover-lift flex-shrink-0 w-[190px] bg-white border border-line rounded-2xl overflow-hidden">
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
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
          onClick={() => toggleWishlist(product)}
          aria-label="Wishlist"
          className="absolute top-2 right-2 bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center"
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
          onClick={() => addToCart(product)}
          className="w-full py-2 bg-ink text-white rounded-lg text-xs font-semibold"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
