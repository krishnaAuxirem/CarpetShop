import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Smartphone, Building2, CheckCircle, Lock, ChevronRight, Gift, Tag, X, Check } from "lucide-react";
import { useCouponStore } from "@/stores/couponStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useReferralStore } from "@/stores/referralStore";
import type { Address } from "@/types";
import { toast } from "sonner";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: Smartphone, desc: "Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Building2, desc: "All major banks" },
  { id: "cod", label: "Cash on Delivery", icon: CheckCircle, desc: "Pay when delivered" },
];

export const Checkout = () => {
  const { items, totalAmount, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { placeOrder } = useOrderStore();
  const { getPoints, getDiscount, redeemPoints, addPoints } = useReferralStore();
  const { validateCoupon, applyCoupon, getDiscount: getCouponDiscount } = useCouponStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"address" | "payment" | "confirm">("address");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [redeemEnabled, setRedeemEnabled] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<ReturnType<typeof validateCoupon>["coupon"]>(undefined);
  const [couponError, setCouponError] = useState("");

  const availablePoints = user ? getPoints(user.id) : 0;
  const maxRedeemable = Math.min(availablePoints, 2000);

  const [address, setAddress] = useState<Address>({
    name: user?.name || "",
    phone: user?.phone || "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const subtotal = totalAmount();
  const delivery = subtotal > 5000 ? 0 : 800;
  const pointsDiscount = redeemEnabled ? getDiscount(user?.id || "", pointsToRedeem) : 0;
  const couponDiscount = appliedCoupon ? getCouponDiscount(appliedCoupon, subtotal) : 0;
  const total = Math.max(0, subtotal + delivery - pointsDiscount - couponDiscount);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) { setCouponError("Please enter a coupon code"); return; }
    const result = validateCoupon(couponCode.trim(), subtotal, user?.id || "");
    if (result.valid && result.coupon) {
      setAppliedCoupon(result.coupon);
      setCouponError("");
      toast.success(`Coupon applied! You save ₹${getCouponDiscount(result.coupon, subtotal).toLocaleString("en-IN")}`);
    } else {
      setCouponError(result.message);
      setAppliedCoupon(undefined);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(undefined);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.line1 || !address.city || !address.state || !address.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0 });
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      if (redeemEnabled && pointsToRedeem > 0) redeemPoints(user!.id, pointsToRedeem);
      if (appliedCoupon) applyCoupon(appliedCoupon.code, user!.id);
      const earnedPoints = Math.floor(subtotal / 100);
      addPoints(user!.id, earnedPoints, `Purchase of ${items.length} item(s)`, "earned_purchase");
      const order = placeOrder(user!.id, user!.name, items, address, paymentMethod);
      clearCart();
      toast.success(`+${earnedPoints} reward points earned!`, { duration: 4000 });
      navigate(`/order-confirmation/${order.id}`);
    }, 2000);
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="page-transition pt-16">
      <div className="bg-muted border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            {["address", "payment", "confirm"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s ? "bg-primary text-white" :
                  ["address", "payment", "confirm"].indexOf(step) > i ? "bg-green-500 text-white" :
                  "bg-muted-foreground/30 text-muted-foreground"
                }`}>{i + 1}</div>
                <span className={`text-sm capitalize font-medium ${step === s ? "text-primary" : "text-muted-foreground"}`}>{s}</span>
                {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {step === "address" && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Delivery Address
                </h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                      <input value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className="input-field" placeholder="Full name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Phone *</label>
                      <input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="input-field" placeholder="+91 XXXXX XXXXX" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Address Line 1 *</label>
                    <input value={address.line1} onChange={e => setAddress({ ...address, line1: e.target.value })} className="input-field" placeholder="House/Flat no., Building, Street" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Address Line 2</label>
                    <input value={address.line2} onChange={e => setAddress({ ...address, line2: e.target.value })} className="input-field" placeholder="Area, Landmark (optional)" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">City *</label>
                      <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input-field" placeholder="City" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">State *</label>
                      <input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="input-field" placeholder="State" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">PIN Code *</label>
                      <input value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="input-field" placeholder="6-digit PIN" maxLength={6} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Country</label>
                      <input value={address.country} className="input-field bg-muted" readOnly />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full justify-center mt-2">
                    Continue to Payment <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {step === "payment" && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                </h2>
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                    <button key={id} onClick={() => setPaymentMethod(id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentMethod === id ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === id ? "border-primary" : "border-muted-foreground"}`}>
                        {paymentMethod === id && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                    </button>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div className="bg-muted rounded-xl p-4 mb-4">
                    <label className="text-sm font-medium mb-2 block">UPI ID</label>
                    <input className="input-field" placeholder="yourname@upi" />
                  </div>
                )}
                {paymentMethod === "card" && (
                  <div className="bg-muted rounded-xl p-4 mb-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Card Number</label>
                      <input className="input-field" placeholder="•••• •••• •••• ••••" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Expiry</label>
                        <input className="input-field" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">CVV</label>
                        <input className="input-field" placeholder="•••" maxLength={3} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Coupon Code */}
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block flex items-center gap-1.5"><Tag className="w-4 h-4 text-primary" /> Coupon Code</label>
                  {appliedCoupon ? (
                    <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                      <Check className="w-5 h-5 text-green-600 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-green-700 dark:text-green-400">{appliedCoupon.code}</p>
                        <p className="text-xs text-green-600">
                          {appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% off` : `₹${appliedCoupon.value} off`} · You save ₹{couponDiscount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <button onClick={handleRemoveCoupon} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-green-200 dark:hover:bg-green-900/30 transition-colors"><X className="w-4 h-4 text-green-700" /></button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          value={couponCode}
                          onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                          className={`input-field flex-1 font-mono tracking-wider ${couponError ? "border-red-400 focus:ring-red-400" : ""}`}
                          placeholder="Enter coupon code"
                        />
                        <button onClick={handleApplyCoupon} className="btn-secondary px-4 py-2.5 text-sm shrink-0">Apply</button>
                      </div>
                      {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {["WELCOME20", "FLAT500"].map(code => (
                          <button key={code} onClick={() => { setCouponCode(code); setCouponError(""); }} className="text-xs px-2.5 py-1 border border-dashed border-primary/50 text-primary rounded-full hover:bg-primary/5 transition-colors font-mono">{code}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Points Redemption */}
                {availablePoints > 0 && (
                  <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Reward Points Balance</span>
                      </div>
                      <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{availablePoints} pts</span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer mb-2">
                      <input type="checkbox" checked={redeemEnabled} onChange={e => { setRedeemEnabled(e.target.checked); if (!e.target.checked) setPointsToRedeem(0); }} className="w-4 h-4 accent-amber-600" />
                      <span className="text-xs text-amber-700 dark:text-amber-400">Use points for discount (1 pt = ₹0.10)</span>
                    </label>
                    {redeemEnabled && (
                      <div>
                        <div className="flex items-center gap-3">
                          <input type="range" min={0} max={maxRedeemable} step={100} value={pointsToRedeem} onChange={e => setPointsToRedeem(parseInt(e.target.value))} className="flex-1 accent-amber-600" />
                          <span className="text-xs font-bold w-20 text-right shrink-0">{pointsToRedeem} pts</span>
                        </div>
                        {pointsToRedeem > 0 && (
                          <p className="text-xs text-green-600 mt-1 font-medium">You save ₹{pointsDiscount} using {pointsToRedeem} points</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 bg-green-50 dark:bg-green-900/10 p-3 rounded-lg">
                  <Lock className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Your payment information is encrypted and secure. We never store card details.</span>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep("address")} className="btn-secondary flex-1 justify-center">Back</button>
                  <button onClick={handlePayment} disabled={processing} className="btn-primary flex-1 justify-center">
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : `Pay ₹${total.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h3 className="font-heading font-bold mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map(item => (
                  <div key={`${item.productId}-${item.selectedSize}`} className="flex gap-3">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.selectedSize} · ×{item.quantity}</p>
                      <p className="text-xs font-bold text-primary">₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className={delivery === 0 ? "text-green-600" : ""}>{delivery === 0 ? "FREE" : `₹${delivery}`}</span></div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Coupon ({appliedCoupon?.code})</span>
                    <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Points Discount</span><span>-₹{pointsDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border">
                  <span>Total</span><span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              {availablePoints > 0 && !redeemEnabled && (
                <div className="mt-3 p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-xs text-amber-700 dark:text-amber-400 text-center">
                  <Gift className="w-3 h-3 inline mr-1" />
                  You have <strong>{availablePoints}</strong> reward points to redeem on payment step!
                </div>
              )}
              {step === "payment" && address.city && (
                <div className="mt-4 p-3 bg-muted rounded-xl text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Delivering to:</p>
                  <p>{address.name} · {address.phone}</p>
                  <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
                  <p>{address.city}, {address.state} {address.pincode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
