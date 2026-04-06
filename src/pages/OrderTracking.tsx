import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  Search, Package, Truck, MapPin, CheckCircle2, Clock,
  XCircle, Cog, ShoppingCart, Timer, Navigation2
} from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { useAuthStore } from "@/stores/authStore";

const STATUS_FLOW = [
  { status: "pending", label: "Ordered", icon: ShoppingCart, color: "#6B7280", desc: "Order placed successfully" },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "#3B82F6", desc: "Order confirmed by seller" },
  { status: "processing", label: "Processing", icon: Cog, color: "#8B5CF6", desc: "Being prepared for dispatch" },
  { status: "shipped", label: "Shipped", icon: Package, color: "#F59E0B", desc: "Handed to courier partner" },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck, color: "#EF4444", desc: "Carrier is on the way!" },
  { status: "delivered", label: "Delivered", icon: MapPin, color: "#10B981", desc: "Successfully delivered" },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, out_for_delivery: 4, delivered: 5, cancelled: -1, returned: -1,
};

// Simulated carrier route: 10 cities across India (coordinates as % of SVG viewBox)
const ROUTE_CITIES = [
  { name: "Jaipur", x: 24, y: 30, label: "Origin Warehouse" },
  { name: "Delhi", x: 28, y: 20, label: "Hub" },
  { name: "Lucknow", x: 38, y: 27, label: "Hub" },
  { name: "Varanasi", x: 44, y: 33, label: "Transit" },
  { name: "Patna", x: 50, y: 31, label: "Hub" },
  { name: "Kolkata", x: 61, y: 40, label: "Regional Hub" },
  { name: "Bhubaneswar", x: 57, y: 50, label: "Transit" },
  { name: "Hyderabad", x: 41, y: 60, label: "Hub" },
  { name: "Bangalore", x: 38, y: 73, label: "Hub" },
  { name: "Chennai", x: 47, y: 76, label: "Delivery" },
];

// Animated dot position based on status
const getCarrierPositionIndex = (statusIdx: number) => {
  if (statusIdx <= 1) return 0;
  if (statusIdx === 2) return 2;
  if (statusIdx === 3) return 4;
  if (statusIdx === 4) return 7;
  if (statusIdx >= 5) return 9;
  return 0;
};

function useCountdown(targetDate: string | undefined) {
  const [remaining, setRemaining] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setRemaining({ days: 0, hours: 0, mins: 0, secs: 0 }); return; }
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return remaining;
}

export const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("order") || "");
  const { orders } = useOrderStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const dotAnimRef = useRef<number>(0);
  const [dotOffset, setDotOffset] = useState(0);

  const order = orderId ? orders.find(o => o.id === orderId || o.trackingNumber === orderId) : null;
  const userOrders = user ? orders.filter(o => o.userId === user.id) : [];
  const currentStep = order ? (STATUS_INDEX[order.status as keyof typeof STATUS_INDEX] ?? -1) : -1;
  const countdown = useCountdown(order?.estimatedDelivery);

  // Pulsing dot animation for the carrier icon
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      setDotOffset(Math.sin((ts - start) / 500) * 3);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const carrierPosIdx = order ? getCarrierPositionIndex(currentStep) : 0;
  const carrierCity = ROUTE_CITIES[carrierPosIdx];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId(searchInput.trim());
  };

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80" alt="Track Order" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-medium uppercase tracking-wider text-sm">Real-time Tracking</span>
          </div>
          <h1 className="font-heading text-4xl font-bold mb-2">Track Your Order</h1>
          <p className="text-white/80">Enter your order ID or tracking number</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Search */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Enter Order ID (e.g. ORD-2024-001) or Tracking No."
                className="input-field pl-10"
              />
            </div>
            <button type="submit" className="btn-primary px-6">Track</button>
          </form>
        </div>

        {orderId && !order && (
          <div className="bg-card border border-border rounded-2xl p-10 text-center mb-8">
            <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground">No order found with ID: <strong>{orderId}</strong></p>
          </div>
        )}

        {order && (
          <div className="space-y-5 animate-fade-in">
            {/* Order header */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border p-5 flex flex-wrap gap-4 justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Order ID</p>
                  <p className="font-bold text-foreground">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Tracking No.</p>
                  <p className="font-mono text-sm font-medium">{order.trackingNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Order Date</p>
                  <p className="font-medium text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Est. Delivery</p>
                  <p className="font-semibold text-primary text-sm">{new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}</p>
                </div>
              </div>

              {order.status === "cancelled" ? (
                <div className="p-6">
                  <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-red-600">Order Cancelled</p>
                      <p className="text-sm text-red-500/80">This order has been cancelled. Refund will be processed in 5-7 business days.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Progress Steps */}
                  <div>
                    <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-5">Delivery Progress</h3>
                    <div className="relative">
                      {/* Connecting line */}
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-border z-0" style={{ marginLeft: `calc(100% / ${STATUS_FLOW.length} / 2)`, marginRight: `calc(100% / ${STATUS_FLOW.length} / 2)` }} />
                      {/* Filled portion */}
                      <div
                        className="absolute top-5 left-5 h-0.5 bg-primary transition-all duration-1000 z-0"
                        style={{
                          left: `calc(100% / ${STATUS_FLOW.length} / 2)`,
                          width: currentStep >= 0
                            ? `${(Math.min(currentStep, STATUS_FLOW.length - 1) / (STATUS_FLOW.length - 1)) * 100}%`
                            : "0%",
                        }}
                      />
                      <div className="relative z-10 flex justify-between">
                        {STATUS_FLOW.map(({ status, label, icon: Icon, color, desc }, i) => {
                          const done = i <= currentStep;
                          const active = i === currentStep;
                          return (
                            <div key={status} className="flex flex-col items-center" style={{ width: `${100 / STATUS_FLOW.length}%` }}>
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                  active ? "shadow-lg scale-110" : ""
                                }`}
                                style={{
                                  backgroundColor: done ? color : "var(--background)",
                                  borderColor: done ? color : "var(--border)",
                                  color: done ? "#fff" : "var(--muted-foreground)",
                                }}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <p className={`text-xs mt-2 text-center font-medium hidden sm:block ${done ? "text-foreground" : "text-muted-foreground"}`} style={{ maxWidth: 72 }}>
                                {label}
                              </p>
                              {active && (
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Status + Countdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Current Status</p>
                        <p className="font-semibold text-primary capitalize">{order.status.replace(/_/g, " ")}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {STATUS_FLOW[currentStep]?.desc || "Processing your order"}
                        </p>
                      </div>
                    </div>

                    {order.status !== "delivered" && countdown && (
                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-2 flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5" /> Estimated Delivery Countdown
                        </p>
                        <div className="flex gap-2">
                          {[
                            { v: countdown.days, l: "Days" },
                            { v: countdown.hours, l: "Hrs" },
                            { v: countdown.mins, l: "Min" },
                            { v: countdown.secs, l: "Sec" },
                          ].map(({ v, l }) => (
                            <div key={l} className="flex-1 bg-white dark:bg-amber-900/20 rounded-lg py-1.5 text-center border border-amber-200 dark:border-amber-700">
                              <p className="font-heading font-bold text-amber-700 dark:text-amber-400 text-lg leading-none">{String(v).padStart(2, "0")}</p>
                              <p className="text-xs text-amber-500 mt-0.5">{l}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.status === "delivered" && (
                      <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle2 className="w-10 h-10 text-green-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-green-600">Delivered Successfully!</p>
                          <p className="text-xs text-green-500">Thank you for shopping with us</p>
                          <Link to="/shop" className="text-xs text-green-600 underline mt-1 block">Shop again →</Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* India Map with carrier dot */}
                  {currentStep >= 3 && currentStep < 5 && (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <h4 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                        <Navigation2 className="w-4 h-4 text-primary" />
                        Carrier Route — Live Simulation
                      </h4>
                      <div className="relative">
                        {/* Simplified India outline SVG */}
                        <svg viewBox="0 0 100 100" className="w-full max-h-64" style={{ backgroundColor: "#EFF6FF", borderRadius: 12 }}>
                          {/* India rough outline */}
                          <path
                            d="M20,12 L28,8 L38,8 L48,10 L56,8 L65,12 L70,20 L72,30 L68,38 L72,45 L70,55 L62,65 L55,72 L48,82 L44,90 L40,82 L32,72 L25,62 L20,50 L18,40 L22,30 Z"
                            fill="#DBEAFE"
                            stroke="#93C5FD"
                            strokeWidth="0.8"
                            opacity="0.8"
                          />
                          {/* Route line */}
                          <polyline
                            points={ROUTE_CITIES.map(c => `${c.x},${c.y}`).join(" ")}
                            fill="none"
                            stroke="#8B4513"
                            strokeWidth="0.6"
                            strokeDasharray="1.5,1"
                            opacity="0.6"
                          />
                          {/* City dots */}
                          {ROUTE_CITIES.map((city, i) => (
                            <g key={city.name}>
                              <circle
                                cx={city.x}
                                cy={city.y}
                                r={i === carrierPosIdx ? 0 : 1.2}
                                fill={i <= carrierPosIdx ? "#8B4513" : "#CBD5E1"}
                              />
                            </g>
                          ))}
                          {/* Animated carrier dot */}
                          <g transform={`translate(${carrierCity.x}, ${carrierCity.y + dotOffset * 0.2})`}>
                            <circle r="3.5" fill="#EF4444" opacity="0.3" />
                            <circle r="2.2" fill="#EF4444" />
                            <text textAnchor="middle" dy="-4" fontSize="4" fill="#DC2626">🚚</text>
                          </g>
                          {/* Destination marker */}
                          <g transform={`translate(${ROUTE_CITIES[9].x}, ${ROUTE_CITIES[9].y})`}>
                            <circle r="2.5" fill="#10B981" opacity="0.3" />
                            <circle r="1.5" fill="#10B981" />
                          </g>
                          {/* Labels */}
                          {[0, carrierPosIdx, 9].filter((v, i, a) => a.indexOf(v) === i).map(i => (
                            <text key={i} x={ROUTE_CITIES[i].x + 3} y={ROUTE_CITIES[i].y} fontSize="3.5" fill="#374151" dominantBaseline="middle">
                              {ROUTE_CITIES[i].name}
                            </text>
                          ))}
                        </svg>
                        <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 rounded-lg px-2.5 py-1.5 text-xs">
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            <span className="text-muted-foreground">Carrier at: <strong className="text-foreground">{carrierCity.name}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            <span className="text-muted-foreground">Destination: <strong className="text-foreground">Chennai</strong></span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Simulated route visualization · Actual route may vary
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timeline events */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-heading font-semibold mb-4">Shipment Timeline</h3>
              <div className="relative pl-6 space-y-4">
                <div className="absolute left-2 top-1 bottom-1 w-0.5 bg-border" />
                {STATUS_FLOW.slice(0, Math.max(1, currentStep + 2)).map(({ status, label, icon: Icon, color, desc }, i) => {
                  const done = i <= currentStep;
                  return (
                    <div key={status} className={`relative flex gap-3 ${!done ? "opacity-40" : ""}`}>
                      <div
                        className="absolute -left-4 w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2"
                        style={{ backgroundColor: done ? color : "var(--background)", borderColor: done ? color : "var(--border)" }}
                      >
                        <Icon className="w-2 h-2" style={{ color: done ? "#fff" : "var(--muted-foreground)" }} />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                        {done && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {i === 0 ? new Date(order.createdAt).toLocaleString("en-IN") :
                             i === currentStep ? new Date(order.updatedAt).toLocaleString("en-IN") :
                             "Completed"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="font-heading font-semibold mb-4">Order Items ({order.items.length})</p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3 bg-muted rounded-xl p-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.selectedSize} · {item.selectedColor} · ×{item.quantity}</p>
                      <p className="text-sm font-bold text-primary mt-1">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between">
                <span className="font-semibold">Total Paid</span>
                <span className="font-heading font-bold text-primary text-lg">₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        {/* User orders */}
        {user && userOrders.length > 0 && (
          <div className="mt-8">
            <h3 className="font-heading font-semibold text-lg mb-4">Your Recent Orders</h3>
            <div className="space-y-3">
              {userOrders.slice(0, 5).map(o => {
                const stepIdx = STATUS_INDEX[o.status] ?? 0;
                const pct = o.status === "cancelled" ? 0 : Math.round((stepIdx / (STATUS_FLOW.length - 1)) * 100);
                return (
                  <button
                    key={o.id}
                    onClick={() => { setOrderId(o.id); setSearchInput(o.id); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-full bg-card border rounded-xl p-4 hover:border-primary/50 transition-all text-left ${orderId === o.id ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.items.length} items · ₹{o.totalAmount.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-right">
                        <span className={`badge text-xs capitalize ${
                          o.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                          o.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-primary/10 text-primary"
                        }`}>{o.status.replace(/_/g, " ")}</span>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                    </div>
                    {o.status !== "cancelled" && (
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
