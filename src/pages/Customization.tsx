import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Plus, Minus, ShoppingCart, Eye } from "lucide-react";
import { CARPET_SIZES, MATERIALS, CARPET_DESIGNS, CARPET_COLORS, PRICE_MULTIPLIERS, SIZE_MULTIPLIERS } from "@/constants/data";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import type { Product } from "@/types";
import { toast } from "sonner";

const BASE_PRICE = 8000;

const DESIGN_IMAGES: Record<string, string> = {
  "Medallion": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  "Floral": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80",
  "Geometric": "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=500&q=80",
  "Abstract": "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=500&q=80",
  "Tribal": "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=500&q=80",
  "Striped": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500&q=80",
};

export const Customization = () => {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState("6x8 ft");
  const [selectedMaterial, setSelectedMaterial] = useState("Pure Wool");
  const [selectedDesign, setSelectedDesign] = useState("Medallion");
  const [selectedColor, setSelectedColor] = useState("Burgundy");
  const [customWidth, setCustomWidth] = useState(6);
  const [customHeight, setCustomHeight] = useState(8);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const price = useMemo(() => {
    const sizeMult = selectedSize === "Custom" ? (customWidth * customHeight) / 48 : SIZE_MULTIPLIERS[selectedSize] || 1;
    const matMult = PRICE_MULTIPLIERS[selectedMaterial] || 1;
    return Math.round(BASE_PRICE * sizeMult * matMult);
  }, [selectedSize, selectedMaterial, customWidth, customHeight]);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setLoading(true);
    const customProduct: Product = {
      id: `custom_${Date.now()}`,
      name: `Custom ${selectedDesign} Carpet`,
      description: `Custom-made ${selectedDesign} pattern carpet in ${selectedColor} color, made from ${selectedMaterial}.`,
      price,
      images: [DESIGN_IMAGES[selectedDesign] || DESIGN_IMAGES["Medallion"]],
      category: "Custom",
      material: selectedMaterial,
      sizes: [selectedSize],
      colors: [selectedColor],
      rating: 5,
      reviewCount: 0,
      stock: 99,
      sellerId: "custom",
      sellerName: "CarpetShop Custom",
      tags: ["custom", "handmade"],
      createdAt: new Date().toISOString(),
    };
    setTimeout(() => {
      addItem(customProduct, selectedSize, selectedColor, qty, { size: selectedSize, material: selectedMaterial, design: selectedDesign, color: selectedColor });
      toast.success("Custom carpet added to cart!");
      setLoading(false);
    }, 800);
  };

  const STEPS = [
    { n: 1, label: "Size" },
    { n: 2, label: "Material" },
    { n: 3, label: "Design" },
    { n: 4, label: "Color" },
  ];

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1549517045-bc93de075e53?w=1920&q=80" alt="Customization" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-carpet-gold" />
            <span className="text-carpet-gold text-sm font-medium uppercase tracking-wider">Custom Design Studio</span>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Design Your Carpet</h1>
          <p className="text-white/80">Create a unique carpet tailored to your specifications</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps */}
          <div className="lg:col-span-2">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center flex-1">
                  <button
                    onClick={() => setStep(s.n)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${step === s.n ? "bg-primary text-white font-semibold" : step > s.n ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{s.n}</span>
                    <span className="text-sm hidden sm:block">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${step > s.n ? "bg-green-400" : "bg-border"}`} />}
                </div>
              ))}
            </div>

            {/* Step 1: Size */}
            {step === 1 && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-2xl font-bold mb-2">Choose Size</h2>
                <p className="text-muted-foreground mb-6">Select a standard size or specify custom dimensions</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {CARPET_SIZES.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${selectedSize === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                {selectedSize === "Custom" && (
                  <div className="bg-muted rounded-xl p-5 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Width (feet)</label>
                      <div className="flex items-center gap-3 border border-border bg-background rounded-lg">
                        <button onClick={() => setCustomWidth(Math.max(2, customWidth - 1))} className="w-9 h-9 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                        <span className="flex-1 text-center font-semibold">{customWidth} ft</span>
                        <button onClick={() => setCustomWidth(Math.min(20, customWidth + 1))} className="w-9 h-9 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Length (feet)</label>
                      <div className="flex items-center gap-3 border border-border bg-background rounded-lg">
                        <button onClick={() => setCustomHeight(Math.max(2, customHeight - 1))} className="w-9 h-9 flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                        <span className="flex-1 text-center font-semibold">{customHeight} ft</span>
                        <button onClick={() => setCustomHeight(Math.min(30, customHeight + 1))} className="w-9 h-9 flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={() => setStep(2)} className="btn-primary w-full mt-6">Continue to Material</button>
              </div>
            )}

            {/* Step 2: Material */}
            {step === 2 && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-2xl font-bold mb-2">Choose Material</h2>
                <p className="text-muted-foreground mb-6">Material affects durability, softness, and price</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {MATERIALS.map(m => (
                    <button key={m} onClick={() => setSelectedMaterial(m)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${selectedMaterial === m ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{m}</span>
                        <span className="text-xs text-primary font-semibold">{((PRICE_MULTIPLIERS[m] || 1) * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {m === "Pure Silk" ? "Luxurious shine, finest quality" :
                         m === "Pure Wool" ? "Durable, soft, naturally stain-resistant" :
                         m === "Organic Cotton" ? "Eco-friendly, easy maintenance" :
                         m === "Jute" ? "Natural, biodegradable, rustic" :
                         "Premium quality fiber"}
                      </p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">Continue to Design</button>
                </div>
              </div>
            )}

            {/* Step 3: Design */}
            {step === 3 && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-2xl font-bold mb-2">Choose Design Pattern</h2>
                <p className="text-muted-foreground mb-6">Select the pattern that speaks to your style</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  {CARPET_DESIGNS.map(d => (
                    <button key={d} onClick={() => setSelectedDesign(d)}
                      className={`rounded-xl border-2 overflow-hidden transition-all ${selectedDesign === d ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"}`}>
                      <div className="h-24 overflow-hidden">
                        <img src={DESIGN_IMAGES[d] || DESIGN_IMAGES["Medallion"]} alt={d} className="w-full h-full object-cover" />
                      </div>
                      <div className={`p-2 text-sm font-medium text-center ${selectedDesign === d ? "bg-primary/10 text-primary" : "text-foreground"}`}>{d}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setStep(4)} className="btn-primary flex-1">Continue to Color</button>
                </div>
              </div>
            )}

            {/* Step 4: Color */}
            {step === 4 && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-2xl font-bold mb-2">Choose Color</h2>
                <p className="text-muted-foreground mb-6">Pick the perfect color palette for your space</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {CARPET_COLORS.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-2 ${selectedColor === c ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.toLowerCase().replace(" ", "") }} />
                      {c}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(3)} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setStep(1)} className="px-4 py-3 rounded-lg border border-dashed border-primary text-primary font-medium text-sm hover:bg-primary/5 transition-colors">Restart</button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="relative h-56 bg-muted">
                  <img src={DESIGN_IMAGES[selectedDesign] || DESIGN_IMAGES["Medallion"]} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass-card px-3 py-1.5 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium">Live Preview</span>
                    </div>
                  </div>
                  <div className="absolute inset-0" style={{ backgroundColor: selectedColor.toLowerCase().replace(" ", ""), opacity: 0.15 }} />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg mb-4">Your Custom Carpet</h3>
                  <div className="space-y-2 mb-4">
                    {[
                      ["Size", selectedSize === "Custom" ? `${customWidth}x${customHeight} ft` : selectedSize],
                      ["Material", selectedMaterial],
                      ["Design", selectedDesign],
                      ["Color", selectedColor],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{k}</span>
                        <span className="font-medium text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-muted-foreground text-sm">Estimated Price</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-3xl font-bold text-primary">₹{price.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-muted-foreground">per unit</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Inclusive of GST • Free delivery</p>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2 border border-border rounded-lg">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                      <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="w-8 h-8 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-sm text-muted-foreground">Total: <strong className="text-primary">₹{(price * qty).toLocaleString("en-IN")}</strong></span>
                  </div>
                  <button onClick={handleAddToCart} disabled={loading} className="btn-primary w-full">
                    {loading ? "Adding..." : <><ShoppingCart className="w-4 h-4" /> Add Custom Carpet to Cart</>}
                  </button>
                  <p className="text-xs text-center text-muted-foreground mt-3">Delivery in 2-4 weeks for custom orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16">
          <h2 className="section-title text-center mb-10">How Custom Orders Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Design", desc: "Use our tool to choose size, material, pattern, and color to your liking." },
              { step: "02", title: "Order", desc: "Place your order with 50% advance payment. We begin production immediately." },
              { step: "03", title: "Weave", desc: "Skilled artisans handcraft your carpet using traditional techniques." },
              { step: "04", title: "Deliver", desc: "Your custom carpet is carefully packaged and delivered to your doorstep." },
            ].map(({ step: s, title, desc }) => (
              <div key={s} className="text-center p-6 bg-card border border-border rounded-2xl">
                <div className="font-heading text-5xl font-bold text-primary/20 mb-3">{s}</div>
                <h3 className="font-heading font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
