import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, ZoomIn, ZoomOut, RotateCcw, Move, Layers, ChevronLeft, ChevronRight, Info, Download } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { toast } from "sonner";

const CARPET_PATTERNS = [
  { id: "p1", label: "Persian Medallion", color: "#8B1A1A", pattern: "radial" },
  { id: "p2", label: "Geometric Modern", color: "#2C3E50", pattern: "grid" },
  { id: "p3", label: "Floral Ivory", color: "#FFFDD0", pattern: "dots" },
  { id: "p4", label: "Tribal Brown", color: "#6B3A2A", pattern: "diagonal" },
  { id: "p5", label: "Solid Burgundy", color: "#800020", pattern: "solid" },
  { id: "p6", label: "Teal Abstract", color: "#008080", pattern: "wave" },
];

interface CarpetTransform {
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  perspective: number;
}

export const RoomPreview = () => {
  const { products } = useProductStore();
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null);
  const [selectedPattern, setSelectedPattern] = useState(CARPET_PATTERNS[0]);
  const [productPage, setProductPage] = useState(0);
  const [transform, setTransform] = useState<CarpetTransform>({
    x: 150, y: 250, width: 300, height: 150, opacity: 0.88, perspective: 30,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<"product" | "pattern">("product");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRODUCTS_PER_PAGE = 4;
  const pagedProducts = products.slice(productPage * PRODUCTS_PER_PAGE, (productPage + 1) * PRODUCTS_PER_PAGE);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw room background
    if (roomImage) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        drawCarpet(ctx, canvas);
      };
      img.src = roomImage;
    } else {
      // Placeholder room
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#E8D5C4");
      grad.addColorStop(0.6, "#D4B896");
      grad.addColorStop(1, "#C19A6B");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floor line
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.55);
      ctx.lineTo(canvas.width, canvas.height * 0.55);
      ctx.stroke();

      // Wall texture
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (let i = 0; i < canvas.width; i += 60) {
        ctx.fillRect(i, 0, 1, canvas.height * 0.55);
      }

      // Furniture silhouette (sofa)
      ctx.fillStyle = "rgba(139,69,19,0.3)";
      ctx.fillRect(canvas.width * 0.15, canvas.height * 0.45, canvas.width * 0.7, canvas.height * 0.2);
      ctx.fillRect(canvas.width * 0.13, canvas.height * 0.35, canvas.width * 0.12, canvas.height * 0.3);
      ctx.fillRect(canvas.width * 0.75, canvas.height * 0.35, canvas.width * 0.12, canvas.height * 0.3);

      ctx.fillStyle = "#6B3A2A";
      ctx.font = "14px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Upload your room photo below, or use this sample room", canvas.width / 2, 30);

      drawCarpet(ctx, canvas);
    }
  }, [roomImage, transform, selectedProduct, selectedPattern]);

  const drawCarpet = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { x, y, width, height, opacity, perspective } = transform;
    ctx.save();
    ctx.globalAlpha = opacity;

    // Perspective transform simulation
    const skew = perspective / 100;
    ctx.setTransform(1, skew * 0.1, -skew * 0.05, 1 - skew * 0.1, x, y);

    // Draw carpet image or pattern
    const carpetImg = new Image();
    carpetImg.crossOrigin = "anonymous";

    const drawPattern = () => {
      const pat = selectedPattern.pattern;
      const col = selectedPattern.color;

      ctx.fillStyle = col;
      ctx.fillRect(0, 0, width, height);

      if (pat === "grid") {
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        for (let gx = 0; gx < width; gx += 20) {
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, height); ctx.stroke();
        }
        for (let gy = 0; gy < height; gy += 20) {
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(width, gy); ctx.stroke();
        }
      } else if (pat === "radial") {
        const grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, width / 2);
        grad.addColorStop(0, "rgba(255,215,0,0.4)");
        grad.addColorStop(0.5, "rgba(139,0,0,0.2)");
        grad.addColorStop(1, "rgba(0,0,0,0.3)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        // Border
        ctx.strokeStyle = "rgba(255,215,0,0.5)";
        ctx.lineWidth = 3;
        ctx.strokeRect(6, 6, width - 12, height - 12);
      } else if (pat === "dots") {
        ctx.fillStyle = "#FFFDD0";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "rgba(139,69,19,0.4)";
        for (let dx = 10; dx < width; dx += 20) {
          for (let dy = 10; dy < height; dy += 20) {
            ctx.beginPath();
            ctx.arc(dx, dy, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (pat === "diagonal") {
        ctx.fillStyle = col;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(255,200,100,0.4)";
        ctx.lineWidth = 2;
        for (let d = -height; d < width + height; d += 15) {
          ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + height, height); ctx.stroke();
        }
      } else if (pat === "wave") {
        ctx.fillStyle = col;
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        for (let wy = 10; wy < height; wy += 15) {
          ctx.beginPath();
          for (let wx = 0; wx < width; wx += 5) {
            const yy = wy + Math.sin((wx + wy) * 0.15) * 5;
            wx === 0 ? ctx.moveTo(wx, yy) : ctx.lineTo(wx, yy);
          }
          ctx.stroke();
        }
      }

      // Shadow overlay for realism
      const shadow = ctx.createLinearGradient(0, 0, 0, height);
      shadow.addColorStop(0, "rgba(0,0,0,0.15)");
      shadow.addColorStop(1, "rgba(0,0,0,0.05)");
      ctx.fillStyle = shadow;
      ctx.fillRect(0, 0, width, height);

      // Border
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);

      // Fringe ends
      ctx.fillStyle = "rgba(255,235,180,0.6)";
      for (let fx = 5; fx < width - 5; fx += 8) {
        ctx.fillRect(fx, -4, 3, 4);
        ctx.fillRect(fx, height, 3, 4);
      }
    };

    if (selectedProduct) {
      carpetImg.onload = () => {
        ctx.drawImage(carpetImg, 0, 0, width, height);
        // Overlay pattern tint
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = selectedPattern.color;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = opacity;
        ctx.restore();
      };
      carpetImg.onerror = drawPattern;
      carpetImg.src = selectedProduct.images[0];
    } else {
      drawPattern();
    }

    ctx.restore();
  };

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setRoomImage(ev.target?.result as string);
      toast.success("Room photo uploaded! Adjust the carpet overlay below.");
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { x, y, width, height } = transform;
    // Resize handle (bottom-right corner)
    if (mx > x + width - 15 && mx < x + width + 15 && my > y + height - 15 && my < y + height + 15) {
      setIsResizing(true);
    } else if (mx > x && mx < x + width && my > y && my < y + height) {
      setIsDragging(true);
    }
    setDragStart({ x: mx, y: my });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const dx = mx - dragStart.x;
    const dy = my - dragStart.y;

    if (isDragging) {
      setTransform(t => ({ ...t, x: t.x + dx, y: t.y + dy }));
      setDragStart({ x: mx, y: my });
    } else if (isResizing) {
      setTransform(t => ({
        ...t,
        width: Math.max(80, t.width + dx),
        height: Math.max(40, t.height + dy),
      }));
      setDragStart({ x: mx, y: my });
    }
  };

  const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "carpet-room-preview.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Preview downloaded!");
  };

  const resetTransform = () => setTransform({ x: 150, y: 250, width: 300, height: 150, opacity: 0.88, perspective: 30 });

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative page-header min-h-[28vh]" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80)`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        <div className="relative z-10 text-center text-white px-4 py-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">AR Room Preview</h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">Upload your room photo and visualize any carpet in your space before buying</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Canvas */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Move className="w-4 h-4" /> Drag carpet · Drag corner to resize
                </div>
                <div className="flex gap-2">
                  <button onClick={resetTransform} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-muted" title="Reset"><RotateCcw className="w-3.5 h-3.5" /></button>
                  <button onClick={handleDownload} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-muted" title="Download"><Download className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div ref={containerRef} className="relative bg-muted" style={{ cursor: isDragging ? "grabbing" : "default" }}>
                <canvas
                  ref={canvasRef}
                  width={700}
                  height={450}
                  className="w-full"
                  style={{ cursor: isDragging ? "grabbing" : "grab" }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>
              {/* Upload */}
              <div className="px-4 py-3 border-t border-border">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium">
                  <Upload className="w-4 h-4" /> {roomImage ? "Change Room Photo" : "Upload Your Room Photo"}
                </button>
                {!roomImage && <p className="text-xs text-muted-foreground mt-1">JPEG, PNG up to 10MB · A sample room is shown by default</p>}
              </div>
            </div>

            {/* Controls */}
            <div className="bg-card border border-border rounded-2xl p-5 mt-4">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /> Carpet Controls</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Opacity: {Math.round(transform.opacity * 100)}%</label>
                  <input type="range" min="40" max="100" value={Math.round(transform.opacity * 100)} onChange={e => setTransform(t => ({ ...t, opacity: parseInt(e.target.value) / 100 }))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Perspective: {transform.perspective}°</label>
                  <input type="range" min="0" max="60" value={transform.perspective} onChange={e => setTransform(t => ({ ...t, perspective: parseInt(e.target.value) }))} className="w-full accent-primary" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Width: {transform.width}px</label>
                  <input type="range" min="100" max="550" value={transform.width} onChange={e => setTransform(t => ({ ...t, width: parseInt(e.target.value) }))} className="w-full accent-primary" />
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300">Tip: Drag the carpet overlay to position it on your floor. Drag the bottom-right corner to resize it to match your floor area.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            {/* Tabs */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex border-b border-border">
                {(["product", "pattern"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3 text-sm font-medium capitalize transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground"}`}>
                    {tab === "product" ? "Products" : "Patterns"}
                  </button>
                ))}
              </div>

              {activeTab === "product" && (
                <div className="p-3">
                  <div className="space-y-2 max-h-[480px] overflow-y-auto">
                    {pagedProducts.map(p => (
                      <button key={p.id} onClick={() => { setSelectedProduct(p); toast.success(`Previewing: ${p.name}`); }}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all text-left ${selectedProduct?.id === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                        <img src={p.images[0]} alt={p.name} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground line-clamp-1">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.material}</p>
                          <p className="text-xs font-bold text-primary mt-0.5">₹{p.price.toLocaleString("en-IN")}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <button onClick={() => setProductPage(p => Math.max(0, p - 1))} disabled={productPage === 0} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-xs text-muted-foreground">Page {productPage + 1} of {Math.ceil(products.length / PRODUCTS_PER_PAGE)}</span>
                    <button onClick={() => setProductPage(p => Math.min(Math.ceil(products.length / PRODUCTS_PER_PAGE) - 1, p + 1))} disabled={(productPage + 1) * PRODUCTS_PER_PAGE >= products.length} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {activeTab === "pattern" && (
                <div className="p-3 space-y-2">
                  {CARPET_PATTERNS.map(p => (
                    <button key={p.id} onClick={() => { setSelectedPattern(p); toast.success(`Pattern: ${p.label}`); }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all ${selectedPattern.id === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <div className="w-10 h-10 rounded-lg border border-border shrink-0" style={{ backgroundColor: p.color }} />
                      <span className="text-sm font-medium text-foreground">{p.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedProduct && (
              <div className="bg-card border border-border rounded-2xl p-4">
                <h4 className="font-heading font-semibold mb-2 text-sm">Selected Product</h4>
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                <p className="font-semibold text-sm">{selectedProduct.name}</p>
                <p className="text-xs text-muted-foreground">{selectedProduct.material} · {selectedProduct.category}</p>
                <p className="text-primary font-bold mt-1">₹{selectedProduct.price.toLocaleString("en-IN")}</p>
                <Link to={`/product/${selectedProduct.id}`} className="btn-primary w-full justify-center mt-3 text-sm py-2">View Product</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
