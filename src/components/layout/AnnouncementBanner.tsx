import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Zap, Timer, Truck, Tag } from "lucide-react";

const FLASH_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours
const DISMISS_KEY = "carpet-flash-banner-dismissed";
const END_KEY = "carpet-flash-end-time";
const ROTATE_INTERVAL_MS = 8000;

function getEndTime(): number {
  const stored = localStorage.getItem(END_KEY);
  if (stored) {
    const t = parseInt(stored, 10);
    if (t > Date.now()) return t;
  }
  const end = Date.now() + FLASH_DURATION_MS;
  localStorage.setItem(END_KEY, String(end));
  return end;
}

const MESSAGES = [
  { id: "flash", type: "sale" },
  { id: "shipping", type: "shipping" },
  { id: "coupon", type: "coupon" },
] as const;

export const AnnouncementBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(DISMISS_KEY) === "true";
  });
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 59, s: 59 });
  const [expired, setExpired] = useState(false);
  const [activeMsg, setActiveMsg] = useState(0);
  const endRef = useRef<number>(getEndTime());

  useEffect(() => {
    if (dismissed) return;
    const tick = () => {
      const diff = endRef.current - Date.now();
      if (diff <= 0) { setExpired(true); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [dismissed]);

  // Rotate messages every 8 seconds
  useEffect(() => {
    if (dismissed || expired) return;
    const t = setInterval(() => {
      setActiveMsg(prev => (prev + 1) % MESSAGES.length);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(t);
  }, [dismissed, expired]);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "true");
  };

  if (dismissed || expired) return null;

  return (
    <div
      className="relative z-50 bg-gradient-to-r from-gray-900 via-red-950 to-gray-900 border-b border-amber-500/30"
      style={{ minHeight: 40 }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-3 py-2">
        {/* Left: icon + label */}
        <div className="flex items-center gap-2 shrink-0 min-w-[90px]">
          {activeMsg === 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center animate-pulse shrink-0">
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <span className="text-white font-semibold text-xs sm:text-sm hidden sm:inline">Flash Sale</span>
              <span className="badge bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 animate-bounce">LIVE</span>
            </div>
          )}
          {activeMsg === 1 && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-semibold text-xs sm:text-sm hidden sm:inline">Free Shipping</span>
            </div>
          )}
          {activeMsg === 2 && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center shrink-0">
                <Tag className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-semibold text-xs sm:text-sm hidden sm:inline">Coupon</span>
            </div>
          )}
        </div>

        {/* Center: message content */}
        <div className="flex-1 flex items-center justify-center gap-3 overflow-hidden">
          {/* Flash Sale message */}
          {activeMsg === 0 && (
            <>
              <span className="text-white/90 font-medium text-xs hidden sm:inline">Up to 60% OFF — Ends in:</span>
              <div className="flex items-center gap-0.5">
                {[
                  { v: timeLeft.h, l: "H" },
                  { v: timeLeft.m, l: "M" },
                  { v: timeLeft.s, l: "S" },
                ].map(({ v, l }, i) => (
                  <div key={l} className="flex items-center">
                    <div className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 min-w-[28px] text-center">
                      <span className="font-heading font-bold text-white text-xs leading-none">{String(v).padStart(2, "0")}</span>
                      <span className="text-white/40 text-[9px] block leading-none">{l}</span>
                    </div>
                    {i < 2 && <span className="text-amber-400 font-bold text-xs mx-0.5">:</span>}
                  </div>
                ))}
              </div>
              <Link
                to="/shop?sale=true"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-amber-400 text-gray-900 px-3 py-1 rounded-full hover:bg-amber-300 transition-colors whitespace-nowrap"
              >
                Shop Now →
              </Link>
            </>
          )}

          {/* Free Shipping message */}
          {activeMsg === 1 && (
            <>
              <span className="text-white/90 text-xs sm:text-sm font-medium text-center">
                🚚 Free shipping on all orders above
                <strong className="text-blue-300 ml-1">₹9,999</strong>
              </span>
              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-blue-400 text-gray-900 px-3 py-1 rounded-full hover:bg-blue-300 transition-colors whitespace-nowrap"
              >
                Shop Now →
              </Link>
            </>
          )}

          {/* Coupon Code message */}
          {activeMsg === 2 && (
            <>
              <span className="text-white/90 text-xs sm:text-sm font-medium">
                Use code
                <code className="mx-1.5 px-2 py-0.5 bg-emerald-700/60 border border-emerald-400/40 rounded text-emerald-300 font-mono font-bold tracking-wider text-xs">
                  CARPET10
                </code>
                for 10% off your first order
              </span>
              <Link
                to="/shop"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold bg-emerald-400 text-gray-900 px-3 py-1 rounded-full hover:bg-emerald-300 transition-colors whitespace-nowrap"
              >
                Use Now →
              </Link>
            </>
          )}
        </div>

        {/* Right: dot indicators + dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Dot indicators */}
          <div className="flex gap-1 items-center">
            {MESSAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveMsg(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeMsg
                    ? "w-4 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Message ${i + 1}`}
              />
            ))}
          </div>
          {/* Dismiss */}
          <button
            onClick={handleDismiss}
            className="shrink-0 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
