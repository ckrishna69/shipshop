import { Monitor, Package, Home } from "lucide-react";

export default function Footer() {
  return (
    <div className="mt-12 bg-ink text-[#D9D4C6]">
      <div className="max-w-[1240px] mx-auto px-5 pt-11 pb-6.5">
        <div className="flex items-center gap-4.5 justify-center mb-9">
          <div className="flex flex-col items-center gap-1.5">
            <Monitor size={20} color="#C69A3E" strokeWidth={1.5} />
            <span className="font-mono text-[10.5px] text-[#B7B29F]">Your screen</span>
          </div>
          <span className="dashline w-[60px]" />
          <div className="flex flex-col items-center gap-1.5">
            <Package size={20} color="#C69A3E" strokeWidth={1.5} />
            <span className="font-mono text-[10.5px] text-[#B7B29F]">Our warehouse</span>
          </div>
          <span className="dashline w-[60px]" />
          <div className="flex flex-col items-center gap-1.5">
            <Home size={20} color="#C69A3E" strokeWidth={1.5} />
            <span className="font-mono text-[10.5px] text-[#B7B29F]">Your doorstep</span>
          </div>
        </div>
        <div className="grid gap-6 border-t border-white/10 pt-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <div>
            <p className="font-display text-xl text-white mb-1.5">Shipshop</p>
            <p className="text-xs text-[#B7B29F]">From your screen to your doorstep.</p>
          </div>
          {["Shop", "Company", "Support"].map((h) => (
            <div key={h}>
              <p className="text-xs font-bold text-white mb-2.5 uppercase tracking-wide">{h}</p>
              {["Categories", "New releases", "Offers"].map((l) => (
                <p key={l} className="text-xs my-2 text-[#B7B29F] cursor-pointer">{l}</p>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-[#8B8672] text-center mt-7">© 2026 Shipshop. All rights reserved.</p>
      </div>
    </div>
  );
}
