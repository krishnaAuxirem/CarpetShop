import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, CameraOff, AlertCircle, RotateCcw, ZoomIn, ZoomOut, Move } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { toast } from "sonner";

const CARPET_SIZE_OPTIONS = [
  { label: "2×3 ft", widthM: 0.61, heightM: 0.91 },
  { label: "3×5 ft", widthM: 0.91, heightM: 1.52 },
  { label: "4×6 ft", widthM: 1.22, heightM: 1.83 },
  { label: "5×7 ft", widthM: 1.52, heightM: 2.13 },
  { label: "6×9 ft", widthM: 1.83, heightM: 2.74 },
  { label: "8×10 ft", widthM: 2.44, heightM: 3.05 },
  { label: "9×12 ft", widthM: 2.74, heightM: 3.66 },
];

const CARPET_PATTERNS = [
  { label: "Persian", color: "#8B1A1A", pattern: "persian" },
  { label: "Geometric", color: "#1A4A8B", pattern: "geometric" },
  { label: "Solid Brown", color: "#8B4513", pattern: "solid" },
  { label: "Cream Ivory", color: "#FFFDD0", pattern: "solid" },
  { label: "Dark Charcoal", color: "#333333", pattern: "solid" },
  { label: "Gold Trellis", color: "#D4AF37", pattern: "trellis" },
];

// Reference object height in meters (standard door is ~2.0m)
const REF_HEIGHT_M = 2.0;

function drawCarpet(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  pattern: typeof CARPET_PATTERNS[0],
  opacity: number
) {
  ctx.save();
  ctx.globalAlpha = opacity;

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;

  // Base fill
  ctx.fillStyle = pattern.color;
  ctx.fillRect(x, y, w, h);
  ctx.shadowBlur = 0;

  // Pattern overlay
  if (pattern.pattern === "persian") {
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    // Border
    ctx.strokeRect(x + 8, y + 8, w - 16, h - 16);
    ctx.strokeRect(x + 16, y + 16, w - 32, h - 32);
    // Center medallion
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h / 2, w * 0.15, h * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    // Corner motifs
    [[x + 20, y + 20], [x + w - 20, y + 20], [x + 20, y + h - 20], [x + w - 20, y + h - 20]].forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.stroke();
    });
  } else if (pattern.pattern === "geometric") {
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    const step = Math.min(w, h) / 6;
    for (let i = 0; i < w; i += step) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i, y + h);
      ctx.stroke();
    }
    for (let j = 0; j < h; j += step) {
      ctx.beginPath();
      ctx.moveTo(x, y + j);
      ctx.lineTo(x + w, y + j);
      ctx.stroke();
    }
    // Diagonal
    for (let i = -h; i < w + h; i += step * 2) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      ctx.lineTo(x + i + h, y + h);
      ctx.stroke();
    }
  } else if (pattern.pattern === "trellis") {
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    const s = Math.min(w, h) / 7;
    for (let i = 0; i < w; i += s) {
      for (let j = 0; j < h; j += s) {
        ctx.beginPath();
        ctx.ellipse(x + i + s / 2, y + j + s / 2, s * 0.4, s * 0.4, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Border glow
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);

  // Fringe top
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  for (let i = x + 4; i < x + w - 4; i += 6) {
    ctx.fillRect(i, y - 5, 2, 6);
  }
  // Fringe bottom
  for (let i = x + 4; i < x + w - 4; i += 6) {
    ctx.fillRect(i, y + h, 2, 6);
  }

  // Size label
  ctx.globalAlpha = opacity * 0.9;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(x + w / 2 - 36, y + h / 2 - 12, 72, 24);
  ctx.fillStyle = "#ffffff";
  ctx.font = `bold ${Math.max(11, Math.min(14, w / 10))}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(CARPET_SIZE_OPTIONS[0]?.label || "", x + w / 2, y + h / 2);

  ctx.restore();
}

export const ARCameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const navigate = useNavigate();

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [selectedSize, setSelectedSize] = useState(CARPET_SIZE_OPTIONS[4]);
  const [selectedPattern, setSelectedPattern] = useState(CARPET_PATTERNS[0]);
  const [opacity, setOpacity] = useState(0.78);
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0.5, y: 0.6 }); // normalized 0-1
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const { products } = useProductStore();

  const startCamera = async (facingMode: "environment" | "user") => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setHasCamera(true);
    } catch {
      setHasCamera(false);
      toast.error("Camera access denied or not available");
    }
  };

  useEffect(() => {
    startCamera(facing);
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Render loop: draw video + carpet overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (video.readyState >= 2) {
        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Estimate carpet pixel size
        // Using perspective: carpet in the floor is foreshortened
        const perspectiveRatio = 0.55; // floor foreshortening factor
        const pxPerMeter = (canvas.height * 0.35) / REF_HEIGHT_M * scale;
        const carpetPxW = selectedSize.widthM * pxPerMeter;
        const carpetPxH = selectedSize.heightM * pxPerMeter * perspectiveRatio;

        const cx = position.x * canvas.width - carpetPxW / 2;
        const cy = position.y * canvas.height - carpetPxH / 2;

        drawCarpet(ctx, cx, cy, carpetPxW, carpetPxH, selectedPattern, opacity);

        // HUD overlay
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(8, 8, 200, 56);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`Size: ${selectedSize.label}`, 16, 16);
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillText(`${selectedSize.widthM.toFixed(2)}m × ${selectedSize.heightM.toFixed(2)}m`, 16, 34);
        ctx.fillText("Drag to reposition", 16, 50);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [selectedSize, selectedPattern, opacity, scale, position]);

  const handleCanvasPointer = (e: React.PointerEvent<HTMLCanvasElement>, type: "down" | "move" | "up") => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    if (type === "down") {
      setIsDragging(true);
      setDragStart({ x: nx - position.x, y: ny - position.y });
    } else if (type === "move" && isDragging) {
      setPosition({
        x: Math.max(0.05, Math.min(0.95, nx - dragStart.x)),
        y: Math.max(0.05, Math.min(0.95, ny - dragStart.y)),
      });
    } else if (type === "up") {
      setIsDragging(false);
    }
  };

  const flipCamera = () => {
    const next = facing === "environment" ? "user" : "environment";
    setFacing(next);
    startCamera(next);
  };

  return (
    <div className="page-transition pt-16 min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black/80 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-base">AR Carpet Sizer</h1>
            <p className="text-xs text-white/60">Point camera at your floor</p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-white/70 hover:text-white text-sm border border-white/20 px-3 py-1.5 rounded-lg"
        >
          Exit
        </button>
      </div>

      {hasCamera === false && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center text-white max-w-sm">
            <CameraOff className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="font-heading text-xl font-bold mb-2">Camera Not Available</h2>
            <p className="text-white/70 text-sm mb-4">
              Please allow camera access or ensure your device has a camera. This feature works best on mobile devices.
            </p>
            <div className="bg-white/10 rounded-xl p-4 text-left mb-4">
              <p className="text-xs font-semibold mb-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-amber-400" /> To enable camera:</p>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Chrome: Click the 🔒 icon → Allow camera</li>
                <li>• Safari: Settings → Safari → Camera → Allow</li>
                <li>• Firefox: Click the camera icon in address bar</li>
              </ul>
            </div>
            <button onClick={() => startCamera(facing)} className="btn-primary w-full">
              <Camera className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      )}

      {hasCamera !== false && (
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Camera view */}
          <div className="relative flex-1 bg-black min-h-[50vh] lg:min-h-0">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onPointerDown={e => handleCanvasPointer(e, "down")}
              onPointerMove={e => handleCanvasPointer(e, "move")}
              onPointerUp={e => handleCanvasPointer(e, "up")}
              onPointerLeave={e => handleCanvasPointer(e, "up")}
            />

            {/* Camera controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/80"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={flipCamera}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/80"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setScale(s => Math.min(3, s + 0.1))}
                className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/80"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Drag hint */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Move className="w-3 h-3" /> Drag carpet to reposition
            </div>
          </div>

          {/* Controls panel */}
          <div className="lg:w-80 bg-gray-900 text-white p-4 space-y-5 overflow-y-auto max-h-[50vh] lg:max-h-none">
            {/* Size selector */}
            <div>
              <h3 className="font-heading font-semibold text-sm mb-2 text-white/80">Carpet Size</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {CARPET_SIZE_OPTIONS.map(s => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s)}
                    className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                      selectedSize.label === s.label
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-white/20 text-white/70 hover:border-white/40"
                    }`}
                  >
                    {s.label}
                    <span className="block text-[10px] opacity-60">
                      {s.widthM.toFixed(1)}m × {s.heightM.toFixed(1)}m
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern selector */}
            <div>
              <h3 className="font-heading font-semibold text-sm mb-2 text-white/80">Pattern & Color</h3>
              <div className="grid grid-cols-3 gap-2">
                {CARPET_PATTERNS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => setSelectedPattern(p)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                      selectedPattern.label === p.label
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div
                      className="w-10 h-6 rounded-md border border-white/20"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-[10px] text-white/70">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity */}
            <div>
              <h3 className="font-heading font-semibold text-sm mb-2 text-white/80">
                Transparency: {Math.round(opacity * 100)}%
              </h3>
              <input
                type="range"
                min="30"
                max="100"
                value={Math.round(opacity * 100)}
                onChange={e => setOpacity(parseInt(e.target.value) / 100)}
                className="w-full accent-primary"
              />
            </div>

            {/* Scale */}
            <div>
              <h3 className="font-heading font-semibold text-sm mb-2 text-white/80">
                Room Scale: {scale.toFixed(1)}×
              </h3>
              <input
                type="range"
                min="5"
                max="30"
                value={Math.round(scale * 10)}
                onChange={e => setScale(parseInt(e.target.value) / 10)}
                className="w-full accent-primary"
              />
              <p className="text-[10px] text-white/40 mt-1">
                Adjust if the carpet appears too large or too small
              </p>
            </div>

            {/* Tips */}
            <div className="bg-white/5 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-semibold text-amber-400">Tips for best results:</p>
              <ul className="text-[11px] text-white/60 space-y-1">
                <li>• Point camera at an open floor area</li>
                <li>• Ensure good lighting for accuracy</li>
                <li>• Use "Room Scale" to calibrate size</li>
                <li>• Drag the carpet to desired position</li>
                <li>• Works best on mobile in landscape mode</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
