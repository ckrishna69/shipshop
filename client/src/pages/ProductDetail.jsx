import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import AuthModal from "../components/AuthModal.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, cart } = useShop();
  const [authOpen, setAuthOpen] = useState(false);

  const product = products.find((p) => String(p.id || p._id) === String(id));

  const isInCart = cart.some((item) => {
    const prodId = item.productId || item.product?.id || item.product?._id || item.id || item._id;
    return String(prodId) === String(product?.id || product?._id);
  });

  const handleCartAction = async () => {
    if (isInCart) {
      navigate("/cart");
    } else {
      await addToCart(product);
    }
  };

  if (!product) {
    return (
      <div className="bg-canvas min-h-screen font-body flex flex-col justify-between">
        <Navbar onOpenAuth={() => setAuthOpen(true)} />
        <div className="max-w-[1240px] mx-auto px-5 py-12 text-center flex-1 flex flex-col justify-center">
          <h2 className="font-display text-2xl font-bold text-ink mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-6 mb-6 font-bold text-black text-lg block cursor-pointer hover:underline mx-auto"
          >
            ← Back to Home
          </button>
        </div>
        <Footer />
        {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
      </div>
    );
  }

  const handleAddToCart = async () => {
    await addToCart(product);
  };

  return (
    <div className="bg-canvas min-h-screen font-body flex flex-col justify-between">
      <Navbar onOpenAuth={() => setAuthOpen(true)} />

      <div className="max-w-[1240px] mx-auto px-5 py-6 flex-1 w-full">
        <button
          onClick={() => navigate("/")}
          className="mt-6 mb-6 font-bold text-black text-lg block cursor-pointer hover:underline"
        >
          ← Back to Home
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 bg-white border border-line rounded-2xl p-8 shadow-sm">
          {/* Left: Image */}
          <div className="w-full h-[450px] rounded-xl overflow-hidden border border-line bg-canvasalt">
            <img
              src={product.image}
              alt={product.name || product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-between py-2">
            <div>
              <p className="text-xs uppercase font-mono tracking-wider text-teal mb-2">
                {typeof product.brand === "object" ? product.brand?.name : String(product.brand || "")}
              </p>
              <h1 className="font-display text-3xl font-bold text-ink mb-4">
                {product.name || product.title}
              </h1>
              <p className="text-sm text-[#736D5E] mb-6 leading-relaxed">
                {product.description || "No description available for this premium quality product."}
              </p>
              
              <div className="flex items-center gap-3.5 mb-6">
                <span className="font-display text-2xl font-bold text-ink">
                  ₹{(Number(product.price || 0) / 100).toFixed(2)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm line-through text-[#736D5E]">
                      ₹{(Number(product.originalPrice || 0) / 100).toFixed(2)}
                    </span>
                    <span className="bg-rust/10 text-rust text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                      SAVE {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div>
              <button
                onClick={handleCartAction}
                className={`w-full md:w-auto px-10 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 hover:scale-[1.01] ${
                  isInCart
                    ? "border border-[#111827] text-[#111827] bg-transparent hover:bg-gray-50"
                    : "bg-[#111827] text-white"
                }`}
              >
                {isInCart ? "Go to cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
