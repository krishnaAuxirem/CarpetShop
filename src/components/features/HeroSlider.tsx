import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85",
    tag: "New Collection 2024",
    title: "Luxury Persian Carpets",
    subtitle: "Hand-Knotted by Master Artisans",
    description: "Discover our exclusive collection of authentic Persian carpets, crafted using centuries-old techniques with the finest materials from around the world.",
    cta: "Explore Collection",
    ctaLink: "/shop",
    ctaSecondary: "Customize Yours",
    ctaSecondaryLink: "/customization",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=85",
    tag: "Premium Quality",
    title: "Transform Your Space",
    subtitle: "With Handwoven Elegance",
    description: "From traditional designs to modern aesthetics, our curated collection brings warmth, comfort, and artistry to every room in your home.",
    cta: "Shop Now",
    ctaLink: "/shop",
    ctaSecondary: "View Deals",
    ctaSecondaryLink: "/shop?filter=discount",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1920&q=85",
    tag: "Custom Design",
    title: "Design Your Dream Carpet",
    subtitle: "Personalized to Perfection",
    description: "Use our interactive customization tool to create a carpet that's uniquely yours — choose size, material, color, and design to match your vision.",
    cta: "Start Customizing",
    ctaLink: "/customization",
    ctaSecondary: "Learn More",
    ctaSecondaryLink: "/about",
  },
];

export const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((idx: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + SLIDES.length) % SLIDES.length), [current, goTo]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPlaying, next]);

  const slide = SLIDES[current];

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Images */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`max-w-2xl transition-all duration-500 ${transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
            <span className="inline-block px-4 py-1.5 bg-carpet-brown/80 text-white text-sm font-medium rounded-full mb-4 backdrop-blur-sm">
              {slide.tag}
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-tight mb-2">
              {slide.title}
            </h1>
            <p className="font-heading text-2xl md:text-3xl text-carpet-gold font-medium mb-4">
              {slide.subtitle}
            </p>
            <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
              {slide.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={slide.ctaLink} className="btn-primary text-base shadow-2xl">
                {slide.cta}
              </Link>
              <Link to={slide.ctaSecondaryLink} className="px-6 py-3 border-2 border-white/60 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                {slide.ctaSecondary}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: "5000+", label: "Products" },
                { value: "50K+", label: "Happy Customers" },
                { value: "25+", label: "States Covered" },
              ].map(stat => (
                <div key={stat.label} className="text-white">
                  <div className="font-heading text-2xl font-bold text-carpet-gold">{stat.value}</div>
                  <div className="text-xs text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button onClick={prev} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-8 h-2.5 bg-carpet-gold" : "w-2.5 h-2.5 bg-white/40"
              }`}
            />
          ))}
        </div>

        <button onClick={next} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/40 transition-colors ml-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
      </div>
    </section>
  );
};
