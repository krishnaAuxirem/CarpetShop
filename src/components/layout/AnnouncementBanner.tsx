import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Zap, Timer } from "lucide-react";

const FLASH_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours
const DISMISS_KEY = "carpet-flash-banner-dismissed";
const END_KEY = "carpet-flash-end-time";

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

export const AnnouncementBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(DISMISS_KEY) === "true";
  });
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 59, s: 59 });
  const [expired, setExpired] = useState(false);
  const endRef = useRef<number>(getEndTime());

  useEffect(() => {
    if (dismissed) return;
    const tick = () => {
      const diff = endRef.current - Date.now();
      if (diff <= 0) {
        setExpired(true);
        return;
      }
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
        {/* Left: Flash icon + label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center animate-pulse shrink-0">
            <Zap className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="text-white font-semibold text-xs sm:text-sm hidden sm:inline">
            Flash Sale — Up to 60% OFF
          </span>
          <span className="text-white font-semibold text-xs sm:hidden">Flash Sale</span>
          <span className="badge bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 animate-bounce">
            LIVE
          </span>
        </div>

        {/* Center: countdown + CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 text-amber-400">
            <Timer className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs text-amber-400/80 hidden sm:inline">Ends in:</span>
          </div>
          {/* Countdown blocks */}
          <div className="flex items-center gap-0.5">
            {[
              { v: timeLeft.h, l: "H" },
              { v: timeLeft.m, l: "M" },
              { v: timeLeft.s, l: "S" },
            ].map(({ v, l }, i) => (
              <div key={l} className="flex items-center">
                <div className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 min-w-[28px] text-center">
                  <span className="font-heading font-bold text-white text-xs leading-none">
                    {String(v).padStart(2, "0")}
                  </span>
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
        </div>

        {/* Right: dismiss */}
        <button
          onClick={handleDismiss}
          className="shrink-0 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
