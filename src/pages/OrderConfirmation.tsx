import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, Truck, MapPin, ArrowRight, Download } from "lucide-react";
import { useOrderStore } from "@/stores/orderStore";

export const OrderConfirmation = () => {
  const { id } = useParams();
  const { orders } = useOrderStore();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-heading text-2xl mb-4">Order not found</h2>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition pt-16 min-h-screen bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for shopping with CarpetShop. Your order is being processed.</p>
        </div>

        {/* Order Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
          <div className="bg-primary/5 border-b border-border p-5 flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-heading font-bold text-lg">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Items */}
            <div>
              <p className="font-semibold text-sm mb-3">Items Ordered ({order.items.length})</p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.selectedSize} · {item.selectedColor} · ×{item.quantity}</p>
                      <p className="text-sm font-bold text-primary">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                <p className="font-heading font-bold text-xl text-primary">₹{order.totalAmount.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Payment</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
                <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 mt-1">Paid</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Delivery Address</p>
              <p className="text-sm font-medium">{order.shippingAddress.name}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
            </div>

            <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Truck className="w-3 h-3" /> Est. Delivery</p>
                <p className="text-sm font-medium">{new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Package className="w-3 h-3" /> Tracking No.</p>
                <p className="text-sm font-medium font-mono">{order.trackingNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <h3 className="font-heading font-semibold mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            {[
              { icon: CheckCircle2, title: "Order Confirmed", desc: "Your order has been received and confirmed.", done: true },
              { icon: Package, title: "Processing", desc: "Our team is carefully preparing your carpet for shipping.", done: false },
              { icon: Truck, title: "Shipped", desc: "Your carpet will be dispatched within 2-3 business days.", done: false },
              { icon: MapPin, title: "Delivered", desc: `Expected by ${new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { month: "long", day: "numeric" })}`, done: false },
            ].map(({ icon: Icon, title, desc, done }, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`font-medium text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/order-tracking?order=${order.id}`} className="btn-primary flex-1 justify-center">
            <Truck className="w-4 h-4" /> Track Order
          </Link>
          <Link to="/shop" className="btn-secondary flex-1 justify-center">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={() => window.print()} className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            <Download className="w-4 h-4" /> Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
