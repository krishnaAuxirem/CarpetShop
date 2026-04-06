import { useState, useRef, useCallback, useEffect } from "react";
import { RotateCcw, Info, ZoomIn, ZoomOut } from "lucide-react";

interface ProductViewer360Props {
  images: string[];
  productName: string;
}

export const ProductViewer360 = ({ images, productName }: ProductViewer360Props) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [accumulated, setAccumulated] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<ReturnType<typeof setInterval>>();

  // Duplicate images to simulate 360 frames (we cycle through them)
  const frames = images.length >= 3
    ? [...images, ...images.slice().reverse(), ...images].slice(0, 24)
    : images;

  const totalFrames = frames.length;

  const advance = useCallback((dir: 1 | -1) => {
    setFrameIndex(i => (i + dir + totalFrames) % totalFrames);
  }, [totalFrames]);

  useEffect(() => {
    if (isAutoRotating) {
      autoRef.current = setInterval(() => advance(1), 80);
    }
    return () => clearInterval(autoRef.current);
  }, [isAutoRotating, advance]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const delta = clientX - startX;
    const newAccumulated = accumulated + delta;
    // Every 12px of drag = 1 frame
    const frameDelta = Math.round(newAccumulated / 12);
    if (frameDelta !== 0) {
      setFrameIndex(i => (i + frameDelta + totalFrames) % totalFrames);
      setAccumulated(newAccumulated - frameDelta * 12);
    } else {
      setAccumulated(newAccumulated);
    }
    setStartX(clientX);
  }, [isDragging, startX, accumulated, totalFrames]);

  const handleMouseUp = () => {
    setIsDragging(false);
    setAccumulated(0);
  };

  const progress = ((frameIndex / totalFrames) * 360).toFixed(0);

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">360° View</span>
          <span className="text-xs text-muted-foreground">· Drag to rotate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(z => Math.max(1, z - 0.25))}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            disabled={zoom <= 1}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs w-10 text-center font-medium">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2.5, z + 0.25))}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
            disabled={zoom >= 2.5}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsAutoRotating(r => !r)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              isAutoRotating ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"
            }`}
          >
            {isAutoRotating ? "⏸ Stop" : "▶ Auto"}
          </button>
        </div>
      </div>

      {/* Viewer area */}
      <div
        ref={containerRef}
        className="relative overflow-hidden bg-muted aspect-square"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        <img
          src={frames[frameIndex]}
          alt={`${productName} - 360° view`}
          className="w-full h-full object-cover select-none transition-none"
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          draggable={false}
        />

        {/* Degree indicator */}
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm font-mono">
          {progress}°
        </div>

        {/* Drag hint (disappears after first interaction) */}
        {!isDragging && frameIndex === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm rounded-2xl px-5 py-3 text-white text-center animate-pulse">
              <RotateCcw className="w-6 h-6 mx-auto mb-1" />
              <p className="text-xs font-medium">Drag to rotate 360°</p>
            </div>
          </div>
        )}

        {/* Frame strip */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5">
          {Array.from({ length: Math.min(12, totalFrames) }).map((_, i) => {
            const normalizedI = Math.floor((i / 12) * totalFrames);
            const isActive = Math.abs(frameIndex - normalizedI) < Math.floor(totalFrames / 12);
            return (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isActive ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-border">
        <button
          onClick={() => advance(-1)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Previous
        </button>
        <div className="w-full mx-4 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-75"
            style={{ width: `${(frameIndex / totalFrames) * 100}%` }}
          />
        </div>
        <button
          onClick={() => advance(1)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Next →
        </button>
      </div>

      <div className="px-4 pb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Info className="w-3 h-3" />
        360° view simulation using available product images
      </div>
    </div>
  );
};
