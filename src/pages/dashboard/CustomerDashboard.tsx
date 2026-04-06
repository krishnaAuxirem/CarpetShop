
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User, Package, Heart, Bell, LogOut, Settings, ShoppingBag,
  Edit3, Save, X, MapPin, Phone, Mail, Camera,
  Gift, Coins, Copy, Users, TrendingUp, Star, ArrowUpRight, ArrowDownRight,
  FileText, BellRing, Trash2, Filter, SlidersHorizontal, Tag, Eye, Package2
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useReferralStore } from "@/stores/referralStore";
import { useAlertStore } from "@/stores/alertStore";
import { ProductCard } from "@/components/features/ProductCard";
import { InvoicePreviewModal } from "@/components/features/InvoicePreviewModal";
import { toast } from "sonner";

const SIDEBAR_ITEMS = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "orders", label: "Order History", icon: Package },
  { id: "current-orders", label: "Current Orders", icon: ShoppingBag },
  { id: "wishlist", label: "My Wishlist", icon: Heart },
  { id: "alerts", label: "My Alerts", icon: BellRing },
  { id: "referral", label: "Rewards & Referrals", icon: Gift },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-gray-100 text-gray-700",
};

export const CustomerDashboard = () => {
  const { user, logout, updateProfile } = useAuthStore();
  const { getOrdersByUser, cancelOrder } = useOrderStore();
  const { items: wishlistItems, removeItem: removeWishlist } = useWishlistStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: user?.address || "" });

  const { getPoints, getTransactions, getReferrals, getReferralCode, addReferral } = useReferralStore();
  const { savedFilters, priceAlerts, restockAlerts, removeFilter, removePriceAlert, removeRestockAlert } = useAlertStore();
  const [referralEmail, setReferralEmail] = useState("");
  const [referralName, setReferralName] = useState("");
  const [invoicePreviewOrderId, setInvoicePreviewOrderId] = useState<string | null>(null);

  if (!user) { navigate("/login"); return null; }

  const orders = getOrdersByUser(user.id);
  const currentOrders = orders.filter(o => !["delivered", "cancelled", "returned"].includes(o.status));
  const pastOrders = orders.filter(o => ["delivered", "cancelled", "returned"].includes(o.status));
  const userPoints = getPoints(user.id);
  const transactions = getTransactions(user.id);
  const referrals = getReferrals(user.id);
  const referralCode = getReferralCode(user.id);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const handleReferralSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralEmail || !referralName) { toast.error("Please enter name and email"); return; }
    addReferral(user.id, referralEmail, referralName);
    setReferralEmail(""); setReferralName("");
    toast.success(`Referral sent to ${referralName}! You earned 500 points.`);
  };

  const NOTIFICATIONS = [
    { id: "n1", title: "Order Delivered!", message: "Your Royal Persian Medallion carpet has been delivered.", type: "order", time: "2 hours ago", read: false },
    { id: "n2", title: "Special Offer!", message: "Get 30% off on Silk Carpets this weekend. Use code SILK30.", type: "offer", time: "1 day ago", read: false },
    { id: "n3", title: "Order Shipped", message: "Your order ORD-2024-002 has been shipped.", type: "order", time: "3 days ago", read: true },
  ];

  return (
    <div className="page-transition pt-16 min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 hidden md:block">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-24">
              <div className="text-center p-4 border-b border-border mb-3">
                <div className="relative w-16 h-16 mx-auto mb-3">
                  <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-primary" />
                  <button className="absolute bottom-0 right-0 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center"><Camera className="w-3 h-3" /></button>
                </div>
                <p className="font-heading font-bold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <span className="badge bg-primary/10 text-primary mt-1">Customer</span>
              </div>
              <nav className="space-y-0.5">
                {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActive(id)} className={`sidebar-link w-full ${active === id ? "active" : ""}`}>
                    <Icon className="w-4 h-4" />
                    <span className="flex-1 text-left">{label}</span>
                    {id === "alerts" && (priceAlerts.length + savedFilters.length + restockAlerts.length) > 0 && (
                      <span className="ml-auto bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {priceAlerts.length + savedFilters.length + restockAlerts.length}
                      </span>
                    )}
                  </button>
                ))}
                <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
                  <LogOut className="w-4 h-4" />Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Mobile nav */}
          <div className="md:hidden w-full overflow-x-auto pb-2 -mt-2 mb-4 flex gap-2">
            {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActive(id)} className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors ${active === id ? "bg-primary text-white" : "bg-card border border-border"}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Profile */}
            {active === "profile" && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold">My Profile</h2>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-2"><Edit3 className="w-4 h-4" /> Edit Profile</button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="btn-primary text-sm py-2"><Save className="w-4 h-4" /> Save</button>
                      <button onClick={() => setEditing(false)} className="btn-secondary text-sm py-2"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {[
                      { label: "Full Name", icon: User, key: "name", value: form.name, placeholder: "Your full name" },
                      { label: "Phone Number", icon: Phone, key: "phone", value: form.phone, placeholder: "+91 XXXXX XXXXX" },
                    ].map(({ label, icon: Icon, key, value, placeholder }) => (
                      <div key={key}>
                        <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1"><Icon className="w-3.5 h-3.5" />{label}</label>
                        {editing ? (
                          <input value={value} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field" placeholder={placeholder} />
                        ) : (
                          <p className="font-medium text-foreground">{value || "Not set"}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1"><Mail className="w-3.5 h-3.5" />Email Address</label>
                      <p className="font-medium text-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Address</label>
                      {editing ? (
                        <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="input-field min-h-[80px] resize-none" placeholder="Full address" />
                      ) : (
                        <p className="font-medium text-foreground">{form.address || "Not set"}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border grid grid-cols-3 gap-4">
                  {[["Total Orders", orders.length], ["Delivered", orders.filter(o => o.status === "delivered").length], ["Wishlist", wishlistItems.length]].map(([k, v]) => (
                    <div key={k as string} className="text-center bg-muted rounded-xl p-4">
                      <p className="font-heading text-2xl font-bold text-primary">{v}</p>
                      <p className="text-xs text-muted-foreground">{k}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders */}
            {(active === "orders" || active === "current-orders") && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-heading text-2xl font-bold">{active === "current-orders" ? "Current Orders" : "Order History"}</h2>
                {(active === "current-orders" ? currentOrders : orders).length === 0 ? (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                    <Link to="/shop" className="btn-primary">Shop Now</Link>
                  </div>
                ) : (
                  (active === "current-orders" ? currentOrders : orders).map(order => (
                    <div key={order.id} className="bg-card border border-border rounded-2xl p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <p className="font-heading font-bold">{order.id}</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`badge capitalize px-3 py-1 ${STATUS_BADGE[order.status] || "bg-muted"}`}>{order.status.replace(/_/g, " ")}</span>
                          <span className="font-heading font-bold text-primary">₹{order.totalAmount.toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 mb-4 overflow-x-auto">
                        {order.items.map((item, i) => (
                          <div key={i} className="shrink-0 flex items-center gap-2 bg-muted rounded-lg p-2">
                            <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="text-xs font-medium line-clamp-1 max-w-[120px]">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/order-tracking?order=${order.id}`} className="text-xs btn-secondary py-1.5 px-3">Track Order</Link>
                        <button
                          onClick={() => setInvoicePreviewOrderId(order.id)}
                          className="text-xs flex items-center gap-1.5 border border-border rounded-lg py-1.5 px-3 hover:bg-muted transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <button
                          onClick={() => { window.open(`/invoice/${order.id}`, "_blank"); }}
                          className="text-xs flex items-center gap-1.5 border border-border rounded-lg py-1.5 px-3 hover:bg-muted transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> Invoice
                        </button>
                        {!["delivered", "cancelled"].includes(order.status) && (
                          <button onClick={() => { cancelOrder(order.id); toast.success("Order cancelled"); }} className="text-xs text-red-500 border border-red-200 rounded-lg py-1.5 px-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Cancel Order</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* My Alerts */}
            {active === "alerts" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="font-heading text-2xl font-bold">My Alerts</h2>

                {/* Restock Alerts */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package2 className="w-5 h-5 text-purple-500" />
                      <h3 className="font-heading font-semibold">Restock Alerts</h3>
                    </div>
                    <span className="badge bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">{restockAlerts.length} active</span>
                  </div>
                  {restockAlerts.length === 0 ? (
                    <div className="p-10 text-center">
                      <Package2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No restock alerts yet</p>
                      <p className="text-xs text-muted-foreground mt-1">On any out-of-stock product page, click "Notify me when back in stock"</p>
                      <Link to="/shop" className="btn-primary mt-4 text-sm inline-flex">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {restockAlerts.map(alert => (
                        <div key={alert.id} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
                          <img src={alert.productImage} alt={alert.productName} className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground line-clamp-1">{alert.productName}</p>
                            <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-medium mt-0.5">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> Out of Stock
                            </span>
                            <p className="text-xs text-muted-foreground mt-0.5">Set on {new Date(alert.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Link to={`/product/${alert.productId}`} className="text-xs text-primary hover:underline">View</Link>
                            <button
                              onClick={() => { removeRestockAlert(alert.id); toast.success("Restock alert removed"); }}
                              className="w-8 h-8 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price Drop Alerts */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-amber-500" />
                      <h3 className="font-heading font-semibold">Price Drop Alerts</h3>
                    </div>
                    <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">{priceAlerts.length} active</span>
                  </div>
                  {priceAlerts.length === 0 ? (
                    <div className="p-10 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No price alerts yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Click the 🔔 bell icon on any product card to set a price drop alert</p>
                      <Link to="/shop" className="btn-primary mt-4 text-sm inline-flex">Browse Products</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {priceAlerts.map(alert => (
                        <div key={alert.id} className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors">
                          <img src={alert.productImage} alt={alert.productName} className="w-14 h-14 rounded-xl object-cover border border-border shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground line-clamp-1">{alert.productName}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs text-muted-foreground">Current: <strong className="text-foreground">₹{alert.currentPrice.toLocaleString("en-IN")}</strong></span>
                              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Alert at: ₹{alert.targetPrice.toLocaleString("en-IN")} or below</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Set on {new Date(alert.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Link to={`/product/${alert.productId}`} className="text-xs text-primary hover:underline">View</Link>
                            <button
                              onClick={() => { removePriceAlert(alert.id); toast.success("Alert removed"); }}
                              className="w-8 h-8 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Saved Filters */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary" />
                      <h3 className="font-heading font-semibold">Saved Shop Filters</h3>
                    </div>
                    <span className="badge bg-primary/10 text-primary">{savedFilters.length} saved</span>
                  </div>
                  {savedFilters.length === 0 ? (
                    <div className="p-10 text-center">
                      <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No saved filters yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Use the "Save Filters" button in the Shop page to save your favourite filter combinations</p>
                      <Link to="/shop" className="btn-primary mt-4 text-sm inline-flex">Go to Shop</Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {savedFilters.map(filter => (
                        <div key={filter.id} className="flex items-start gap-4 p-4 hover:bg-muted/40 transition-colors">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <Tag className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground">{filter.name}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {filter.category && (
                                <span className="text-[10px] bg-muted border border-border rounded-full px-2 py-0.5 text-muted-foreground">Category: {filter.category}</span>
                              )}
                              {filter.materials.length > 0 && (
                                <span className="text-[10px] bg-muted border border-border rounded-full px-2 py-0.5 text-muted-foreground">
                                  Materials: {filter.materials.join(", ")}
                                </span>
                              )}
                              {(filter.priceMin > 0 || filter.priceMax < 200000) && (
                                <span className="text-[10px] bg-muted border border-border rounded-full px-2 py-0.5 text-muted-foreground">
                                  ₹{filter.priceMin.toLocaleString("en-IN")} – ₹{filter.priceMax.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Saved {new Date(filter.createdAt).toLocaleDateString("en-IN")}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Link
                              to={`/shop?category=${encodeURIComponent(filter.category)}&material=${filter.materials[0] || ""}`}
                              className="text-xs btn-secondary py-1 px-2.5"
                            >
                              Apply
                            </Link>
                            <button
                              onClick={() => { removeFilter(filter.id); toast.success("Filter removed"); }}
                              className="w-8 h-8 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Referral & Rewards */}
            {active === "referral" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="font-heading text-2xl font-bold">Rewards & Referrals</h2>

                {/* Points Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white sm:col-span-1">
                    <div className="flex items-center gap-2 mb-2"><Gift className="w-5 h-5" /><span className="text-sm font-medium opacity-90">Total Points</span></div>
                    <p className="font-heading text-4xl font-bold">{userPoints.toLocaleString("en-IN")}</p>
                    <p className="text-xs opacity-80 mt-1">= ₹{Math.floor(userPoints * 0.1).toLocaleString("en-IN")} discount value</p>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-muted-foreground">Referrals</span></div>
                    <p className="font-heading text-3xl font-bold text-foreground">{referrals.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">{referrals.filter(r => r.status === "completed").length} completed</p>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2"><TrendingUp className="w-4 h-4 text-green-600" /><span className="text-sm font-medium text-muted-foreground">Points Earned</span></div>
                    <p className="font-heading text-3xl font-bold text-foreground">{transactions.filter(t => t.points > 0).reduce((s, t) => s + t.points, 0).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold mb-1">Your Referral Code</h3>
                  <p className="text-sm text-muted-foreground mb-4">Share this code with friends. You both get 500 bonus points when they make their first purchase!</p>
                  <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                    <code className="flex-1 font-mono font-bold text-primary text-lg tracking-wider">{referralCode}</code>
                    <button onClick={() => { navigator.clipboard?.writeText(referralCode); toast.success("Code copied!"); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  </div>
                </div>

                {/* Send Referral */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold mb-4">Invite a Friend</h3>
                  <form onSubmit={handleReferralSend} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={referralName} onChange={e => setReferralName(e.target.value)} className="input-field" placeholder="Friend's name" />
                      <input type="email" value={referralEmail} onChange={e => setReferralEmail(e.target.value)} className="input-field" placeholder="Friend's email" />
                    </div>
                    <button type="submit" className="btn-primary text-sm"><Gift className="w-4 h-4" /> Send Invite (+500 pts for you)</button>
                  </form>
                </div>

                {/* Points Tiers */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold mb-4">How to Earn Points</h3>
                  <div className="space-y-3">
                    {[
                      { icon: ShoppingBag, label: "Make a Purchase", pts: "1 pt per ₹100", color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
                      { icon: Users, label: "Refer a Friend", pts: "+500 pts", color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
                      { icon: Star, label: "Write a Review", pts: "+50 pts", color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600" },
                      { icon: Gift, label: "Welcome Bonus", pts: "+200 pts", color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
                    ].map(({ icon: Icon, label, pts, color }) => (
                      <div key={label} className="flex items-center gap-4 p-3 bg-muted rounded-xl">
                        <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}><Icon className="w-4 h-4" /></div>
                        <div className="flex-1"><p className="font-medium text-sm">{label}</p></div>
                        <span className="font-bold text-primary text-sm">{pts}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transactions */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-5 border-b border-border">
                    <h3 className="font-heading font-semibold">Points History</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {transactions.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8 text-sm">No transactions yet</p>
                    ) : transactions.slice(0, 8).map(tx => (
                      <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.points > 0 ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                          {tx.points > 0 ? <ArrowUpRight className="w-4 h-4 text-green-600" /> : <ArrowDownRight className="w-4 h-4 text-red-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{tx.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString("en-IN")}</p>
                        </div>
                        <span className={`font-bold text-sm ${tx.points > 0 ? "text-green-600" : "text-red-600"}`}>
                          {tx.points > 0 ? "+" : ""}{tx.points} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Referrals History */}
                {referrals.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-border"><h3 className="font-heading font-semibold">Referrals Sent ({referrals.length})</h3></div>
                    <div className="divide-y divide-border">
                      {referrals.map(r => (
                        <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.referredEmail}`} alt="" className="w-8 h-8 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{r.referredName}</p>
                            <p className="text-xs text-muted-foreground">{r.referredEmail}</p>
                          </div>
                          <div className="text-right">
                            <span className={`badge text-xs ${r.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{r.status}</span>
                            <p className="text-xs text-primary font-medium mt-0.5">+{r.pointsEarned} pts</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Redeem at Checkout reminder */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
                  <Coins className="w-8 h-8 text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Redeem at Checkout</p>
                    <p className="text-xs text-muted-foreground">Use your {userPoints} points during checkout to save up to ₹{Math.min(Math.floor(userPoints * 0.1), 200)} on your next order.</p>
                  </div>
                  <Link to="/shop" className="btn-primary text-sm py-2 px-3">Shop Now</Link>
                </div>
              </div>
            )}

            {/* Wishlist */}
            {active === "wishlist" && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6">My Wishlist ({wishlistItems.length})</h2>
                {wishlistItems.length === 0 ? (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-semibold mb-2">Your Wishlist is Empty</h3>
                    <p className="text-muted-foreground mb-6">Save carpets you love for later</p>
                    <Link to="/shop" className="btn-primary">Explore Products</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistItems.map(item => <ProductCard key={item.productId} product={item.product} />)}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {active === "notifications" && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6">Notifications</h2>
                <div className="space-y-3">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`bg-card border rounded-xl p-4 flex items-start gap-4 ${!n.read ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.type === "order" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"}`}>
                        {n.type === "order" ? <Package className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{n.title}</p>
                        <p className="text-sm text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            {active === "settings" && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-2xl font-bold mb-6">Account Settings</h2>
                <div className="space-y-4">
                  {[
                    { title: "Email Notifications", desc: "Receive order updates via email", enabled: true },
                    { title: "SMS Notifications", desc: "Get delivery updates via SMS", enabled: true },
                    { title: "Offer Alerts", desc: "Be notified of special deals and discounts", enabled: false },
                    { title: "Newsletter", desc: "Monthly newsletter with carpet trends and tips", enabled: true },
                  ].map(({ title, desc, enabled }) => (
                    <div key={title} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{title}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <button onClick={() => toast.success("Preference updated!")} className={`relative w-12 h-6 rounded-full transition-all ${enabled ? "bg-primary" : "bg-muted-foreground/30"}`}>
                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${enabled ? "left-6" : "left-0.5"}`} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <button onClick={() => toast.error("In a real app, this would prompt confirmation before deleting.")} className="text-red-500 text-sm hover:underline">Delete Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      {invoicePreviewOrderId && (
        <InvoicePreviewModal orderId={invoicePreviewOrderId} onClose={() => setInvoicePreviewOrderId(null)} />
      )}
    </div>
  );
};
