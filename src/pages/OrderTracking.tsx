import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Package, Truck, MapPin, CheckCircle2, Clock, XCircle, Cog } from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";
import { useAuthStore } from "@/stores/authStore";

const STATUS_FLOW = [
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { status: "processing", label: "Processing", icon: Cog },
  { status: "shipped", label: "Shipped", icon: Package },
  { status: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { status: "delivered", label: "Delivered", icon: MapPin },
];

const STATUS_INDEX = {
  pending: 0, confirmed: 0, processing: 1, shipped: 2, out_for_delivery: 3, delivered: 4, cancelled: -1, returned: -1,
};

export const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("order") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("order") || "");
  const { orders } = useOrderStore();
  const { user } = useAuthStore();

  const order = orderId ? orders.find(o => o.id === orderId || o.trackingNumber === orderId) : null;
  const userOrders = user ? orders.filter(o => o.userId === user.id) : [];

  const currentStep = order ? STATUS_INDEX[order.status as keyof typeof STATUS_INDEX] : -1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderId(searchInput.trim());
  };

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative h-48 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80" alt="Track Order" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="font-heading text-4xl font-bold mb-2">Track Your Order</h1>
          <p className="text-white/80">Enter your order ID or tracking number</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Search */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Enter Order ID or Tracking Number (e.g., ORD-2024-001 or CS2024001789)" className="input-field pl-10" />
            </div>
            <button type="submit" className="btn-primary">Track</button>
          </form>
        </div>

        {/* Order Results */}
        {orderId && !order && (
          <div className="bg-card border border-border rounded-2xl p-10 text-center mb-8">
            <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">Order Not Found</h3>
            <p className="text-muted-foreground">No order found with ID: <strong>{orderId}</strong></p>
          </div>
        )}

        {order && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden mb-8 animate-fade-in">
            <div className="bg-primary/5 border-b border-border p-5 flex flex-wrap gap-4 justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Order ID</p>
                <p className="font-bold">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tracking No.</p>
                <p className="font-mono font-medium">{order.trackingNumber}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Est. Delivery</p>
                <p className="font-medium">{new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</p>
              </div>
            </div>

            <div className="p-6">
              {order.status === "cancelled" ? (
                <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-600">Order Cancelled</p>
                    <p className="text-sm text-red-500/80">This order has been cancelled. Refund will be processed in 5-7 business days.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center mb-8">
                    {STATUS_FLOW.map(({ status, label, icon: Icon }, i) => (
                      <div key={status} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            i <= currentStep ? "bg-primary border-primary text-white" : "border-border text-muted-foreground bg-background"
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-xs mt-1.5 text-center hidden sm:block ${i <= currentStep ? "text-primary font-semibold" : "text-muted-foreground"}`}>{label}</span>
                        </div>
                        {i < STATUS_FLOW.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? "bg-primary" : "bg-border"}`} />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-primary/5 rounded-xl p-4 flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Current Status: <span className="text-primary capitalize">{order.status.replace(/_/g, " ")}</span></p>
                      <p className="text-sm text-muted-foreground">Last updated: {new Date(order.updatedAt).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                </>
              )}

              {/* Items */}
              <div>
                <p className="font-semibold text-sm mb-3">Order Items</p>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 bg-muted rounded-xl p-3">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">{item.selectedSize} · {item.selectedColor} · ×{item.quantity}</p>
                        <p className="text-sm font-bold text-primary">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between">
                <span className="font-semibold">Total Paid</span>
                <span className="font-heading font-bold text-primary text-lg">₹{order.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        )}

        {/* User orders quick access */}
        {user && userOrders.length > 0 && (
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Your Recent Orders</h3>
            <div className="space-y-3">
              {userOrders.slice(0, 5).map(o => (
                <button key={o.id} onClick={() => { setOrderId(o.id); setSearchInput(o.id); }}
                  className={`w-full bg-card border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-all ${orderId === o.id ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{o.id}</p>
                    <p className="text-xs text-muted-foreground">{o.items.length} items · ₹{o.totalAmount.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="text-right">
                    <span className={`badge text-xs capitalize ${
                      o.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" :
                      "bg-primary/10 text-primary"
                    }`}>{o.status.replace(/_/g, " ")}</span>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
