import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Truck } from "lucide-react";

const SLIDES = [
  { id: 1, eyebrow: "New season", title: "Layer up in kind", subtitle: "20% off outerwear across every brand", cta: "Shop fashion", category: "fashion", from: "#132242", to: "#1F345C", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" },
  { id: 2, eyebrow: "Just landed", title: "Sound, reimagined", subtitle: "Latest audio tech, up to 30% off", cta: "Shop electronics", category: "electronics", from: "#1E4A40", to: "#2E6E60", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { id: 3, eyebrow: "Home edit", title: "Slow living, fast delivery", subtitle: "Handpicked home goods from independent makers", cta: "Shop home", category: "home", from: "#9C7626", to: "#C69A3E", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80" },
  { id: 4, eyebrow: "Pantry refresh", title: "Good ingredients, good week", subtitle: "Fresh groceries delivered in under 2 hours", cta: "Shop groceries", category: "groceries", from: "#B2543A", to: "#8C4530", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" },
];

export default function HeroBanner({ onShop }) {
  const [slide, setSlide] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    timer.current = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 4800);
    return () => clearInterval(timer.current);
  }, []);

  const s = SLIDES[slide];

  return (
    <div className="max-w-[1240px] mx-auto px-5 pt-4.5">
      <div
        className="relative rounded-[20px] overflow-hidden h-[320px]"
        style={{ background: `linear-gradient(120deg, ${s.from}, ${s.to})` }}
      >
        {s.image && (
          <div key={`img-${slide}`} className="absolute top-6 right-16 bottom-16 w-[340px] hidden md:flex items-center justify-center overflow-hidden rounded-[16px] shadow-2xl border border-white/10 z-10">
            <img src={s.image} alt={s.title} className="w-full h-full object-cover transform hover:scale-105 transition duration-700" />
          </div>
        )}
        <div key={slide} className="absolute inset-0 flex flex-col justify-center px-14 max-w-[520px]">
          <span className="font-mono text-[11.5px] tracking-widest uppercase text-[#E9CE96]">{s.eyebrow}</span>
          <h1 className="font-display text-[42px] font-semibold text-white my-2.5 leading-[1.08]">{s.title}</h1>
          <p className="text-[15px] text-[#DCD8CB] mb-5">{s.subtitle}</p>
          <button
            onClick={() => onShop(s.category)}
            className="self-start flex items-center gap-2 bg-gold text-ink px-5 py-2.5 rounded-lg font-bold text-[13.5px]"
          >
            {s.cta} <ArrowRight size={15} />
          </button>
        </div>

        <button onClick={() => setSlide((v) => (v - 1 + SLIDES.length) % SLIDES.length)} aria-label="Previous slide" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full bg-white/25 text-white flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setSlide((v) => (v + 1) % SLIDES.length)} aria-label="Next slide" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[34px] h-[34px] rounded-full bg-white/25 text-white flex items-center justify-center">
          <ChevronRight size={18} />
        </button>

        <div className="absolute bottom-5 left-14 right-14">
          <div className="relative border-t-[1.5px] border-dashed border-white/40">
            <Truck key={slide} size={16} color="#fff" strokeWidth={1.8} style={{ position: "absolute", top: -8, animation: "travel 4.8s linear" }} />
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {SLIDES.map((sl, i) => (
              <button key={sl.id} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} style={{ width: i === slide ? 22 : 8 }} className="h-1 rounded bg-white/40 transition-all" >
                <span className="sr-only">Slide {i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes travel { from { left: 1%; } to { left: 95%; } }`}</style>
    </div>
  );
}
