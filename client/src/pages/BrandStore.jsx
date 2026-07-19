import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ProductTile from "../components/ProductTile.jsx";
import AuthModal from "../components/AuthModal.jsx";
import { api } from "../api/client.js";
import { BRAND_LOGOS } from "../constants/brandLogos.js";

export default function BrandStore() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    api.get(`/brands/${slug}/products`).then(setData).catch(() => setData(null));
  }, [slug]);

  return (
    <div className="bg-canvas min-h-screen font-body">
      <Navbar onOpenAuth={() => setAuthOpen(true)} onSelectCategory={() => navigate("/")} />
      <div className="max-w-[1240px] mx-auto px-5 py-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1F345C] mb-5">
          <ArrowLeft size={16} /> Back to Shipshop
        </button>
        {data && (
          <>
            <div className="flex items-center gap-4 mb-7">
              <div className="w-16 h-16 rounded-full text-white flex items-center justify-center font-display font-semibold text-2xl overflow-hidden" style={{ background: data.brand.colorHex }}>
                {BRAND_LOGOS[data.brand.slug] ? (
                  <img src={BRAND_LOGOS[data.brand.slug]} alt={data.brand.name} className="object-cover w-full h-full rounded-full" />
                ) : (
                  data.brand.initials
                )}
              </div>
              <div>
                <p className="font-display text-[28px] font-semibold mb-1">{data.brand.name}</p>
                <p className="text-[13px] text-[#736D5E]">Official store on Shipshop</p>
              </div>
            </div>
            <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))" }}>
              {data.products.map((p) => <ProductTile key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
      <Footer />
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
