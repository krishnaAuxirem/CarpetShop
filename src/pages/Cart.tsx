import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, Tag, Truck } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";
import { toast } from "sonner";

export const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">Please Login First</h2>
          <p className="text-muted-foreground mb-6">Login to view your cart and continue shopping</p>
          <Link to="/login" className="btn-primary">Login Now</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="font-heading text-3xl font-bold mb-3">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Looks like you haven't added any carpets yet. Start exploring our beautiful collection!</p>
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = totalAmount();
  const delivery = subtotal > 5000 ? 0 : 800;
  const discountAmount = Math.round(subtotal * discount);
  const total = subtotal + delivery - discountAmount;

  const applyCoupon = () => {
    const coupons: Record<string, number> = { "CARPET50": 0.5, "CARPET20": 0.2, "WELCOME10": 0.1, "FIRST15": 0.15 };
    if (coupons[coupon.toUpperCase()]) {
      setDiscount(coupons[coupon.toUpperCase()]);
      toast.success(`Coupon applied! ${(coupons[coupon.toUpperCase()] * 100).toFixed(0)}% discount!`);
    } else {
      toast.error("Invalid coupon code");
    }
  };

  return (
    <div className="page-transition pt-16">
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="font-heading text-2xl font-bold">Shopping Cart ({items.length} items)</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, idx) => (
              <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}`} className="bg-card border border-border rounded-2xl p-4 flex gap-4">
                <Link to={`/product/${item.productId}`} className="shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 object-cover rounded-xl" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.productId}`}>
                    <h3 className="font-heading font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">{item.product.name}</h3>
                  </Link>
                  <div className="flex flex-wrap gap-3 mt-1 mb-3">
                    <span className="text-xs text-muted-foreground">Size: <strong>{item.selectedSize}</strong></span>
                    <span className="text-xs text-muted-foreground">Color: <strong>{item.selectedColor}</strong></span>
                    {item.customization && <span className="text-xs text-primary">Custom Order</span>}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 border border-border rounded-lg">
                      <button onClick={() => updateQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.selectedSize, item.selectedColor, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-muted"><Plus className="w-3 h-3" /></button>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-primary">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</p>
                      <p className="text-xs text-muted-foreground">₹{item.unitPrice.toLocaleString("en-IN")} each</p>
                    </div>
                    <button onClick={() => { removeItem(item.productId, item.selectedSize, item.selectedColor); toast.success("Item removed"); }} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <Link to="/shop" className="text-primary text-sm font-medium hover:underline">← Continue Shopping</Link>
              <button onClick={() => { clearCart(); toast.success("Cart cleared"); }} className="text-red-500 text-sm hover:text-red-700 font-medium">Clear Cart</button>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24 space-y-4">
              <h3 className="font-heading font-bold text-lg">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Delivery</span><span className={delivery === 0 ? "text-green-600" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
                {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Coupon Discount</span><span>-₹{discountAmount.toLocaleString("en-IN")}</span></div>}
              </div>

              {/* Coupon */}
              <div className="border-t border-border pt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="input-field pl-9 py-2.5 text-sm" />
                  </div>
                  <button onClick={applyCoupon} className="px-3 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Apply</button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">Try: CARPET50, CARPET20, WELCOME10</p>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between font-heading font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>
                {delivery === 0 && <p className="text-xs text-green-600 mt-1">✓ You qualify for free delivery!</p>}
              </div>

              <button onClick={() => navigate("/checkout")} className="btn-primary w-full justify-center">
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {["Visa/Mastercard", "UPI", "Net Banking", "EMI"].map(p => (
                  <div key={p} className="text-center py-1.5 bg-muted rounded-lg text-xs text-muted-foreground">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
