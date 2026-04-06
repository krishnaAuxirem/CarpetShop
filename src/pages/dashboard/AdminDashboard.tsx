import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Package, ShoppingBag, BarChart2, Settings, LogOut,
  Tag, FileText, Trash2, Edit3, TrendingUp,
  DollarSign, Plus, Check, X, Percent, Calendar, Hash, ToggleLeft, ToggleRight
} from "lucide-react";
import { useCouponStore, type Coupon } from "@/stores/couponStore";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { useOrderStore } from "@/stores/orderStore";
import { useBlogStore } from "@/stores/blogStore";
import { CATEGORIES } from "@/constants/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const SIDEBAR_ITEMS = [
  { id: "overview", label: "Dashboard", icon: BarChart2 },
  { id: "users", label: "Manage Users", icon: Users },
  { id: "products", label: "Manage Products", icon: Package },
  { id: "orders", label: "Manage Orders", icon: ShoppingBag },
  { id: "coupons", label: "Coupons", icon: Tag },
  { id: "categories", label: "Categories", icon: Hash },
  { id: "blog", label: "Blog Management", icon: FileText },
  { id: "settings", label: "Platform Settings", icon: Settings },
];

const CHART_COLORS = ["#8B4513", "#D4AF37", "#3E2723", "#F5F5DC", "#6B3A2A"];

const MONTHLY_DATA = [
  { month: "Oct", users: 120, orders: 45, revenue: 380000 },
  { month: "Nov", users: 180, orders: 72, revenue: 540000 },
  { month: "Dec", users: 250, orders: 98, revenue: 820000 },
  { month: "Jan", users: 210, orders: 85, revenue: 670000 },
  { month: "Feb", users: 290, orders: 112, revenue: 890000 },
  { month: "Mar", users: 340, orders: 145, revenue: 1120000 },
];

export const AdminDashboard = () => {
  const { user, logout, registeredUsers } = useAuthStore();
  const { products, deleteProduct } = useProductStore();
  const { getAllOrders, updateOrderStatus } = useOrderStore();
  const { posts, addPost, updatePost, deletePost } = useBlogStore();
  const { coupons, addCoupon, updateCoupon, deleteCoupon, toggleActive: toggleCouponActive } = useCouponStore();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [blogForm, setBlogForm] = useState({ title: "", excerpt: "", content: "", category: "Interior Design", image: "", isPublished: false });
  const [editBlogId, setEditBlogId] = useState<string | null>(null);
  const [showBlogForm, setShowBlogForm] = useState(false);

  // Coupon form state
  const emptyCouponForm = { code: "", type: "percentage" as "percentage" | "flat", value: 10, minOrderValue: 0, maxUses: 100, expiryDate: "", isActive: true, isSingleUse: false, description: "" };
  const [couponForm, setCouponForm] = useState(emptyCouponForm);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editCouponId, setEditCouponId] = useState<string | null>(null);

  if (!user || user.role !== "admin") { navigate("/login"); return null; }

  const orders = getAllOrders();
  const totalRevenue = orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0);

  const categoryData = CATEGORIES.map(cat => ({
    name: cat.name.split(" ")[0],
    value: products.filter(p => p.category === cat.name).length,
  })).filter(d => d.value > 0);

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editBlogId) {
      updatePost(editBlogId, blogForm);
      toast.success("Blog post updated!");
    } else {
      addPost({
        ...blogForm, slug: blogForm.title.toLowerCase().replace(/\s+/g, "-"),
        author: user.name, authorAvatar: user.avatar || "",
        tags: [], publishedAt: new Date().toISOString(), readTime: Math.ceil(blogForm.content.length / 1000),
      });
      toast.success("Blog post created!");
    }
    setBlogForm({ title: "", excerpt: "", content: "", category: "Interior Design", image: "", isPublished: false });
    setEditBlogId(null);
    setShowBlogForm(false);
  };

  const STATUS_BADGE: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700", shipped: "bg-indigo-100 text-indigo-700",
    out_for_delivery: "bg-orange-100 text-orange-700", delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <div className="page-transition pt-16 min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-60 shrink-0 hidden md:block">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-24">
              <div className="p-3 border-b border-border mb-3 text-center">
                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-accent" />
                <p className="font-heading font-bold">{user.name}</p>
                <span className="badge bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">Admin</span>
              </div>
              <nav className="space-y-0.5">
                {SIDEBAR_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActive(id)} className={`sidebar-link w-full ${active === id ? "active" : ""}`}>
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
                <button onClick={() => { logout(); navigate("/"); }} className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4" />Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            {active === "overview" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="font-heading text-2xl font-bold">Admin Dashboard</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Revenue", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
                    { label: "Total Orders", value: orders.length, icon: ShoppingBag, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
                    { label: "Total Users", value: registeredUsers.length, icon: Users, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
                    { label: "Products Listed", value: products.length, icon: Package, color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-5">
                      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                      <p className="font-heading text-2xl font-bold">{value}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-semibold mb-4">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={MONTHLY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} className="text-xs" />
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                        <Bar dataKey="revenue" fill="#8B4513" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-semibold mb-4">Products by Category</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }: { name: string; value: number }) => `${name}: ${value}`}>
                          {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Users */}
            {active === "users" && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6">Manage Users ({registeredUsers.length})</h2>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">User</th>
                          <th className="text-left px-4 py-3 font-medium">Role</th>
                          <th className="text-left px-4 py-3 font-medium">Joined</th>
                          <th className="text-left px-4 py-3 font-medium">Status</th>
                          <th className="text-left px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {registeredUsers.map(u => (
                          <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt="" className="w-8 h-8 rounded-full" />
                                <div>
                                  <p className="font-medium">{u.name}</p>
                                  <p className="text-xs text-muted-foreground">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3"><span className={`badge capitalize ${u.role === "admin" ? "bg-red-100 text-red-700" : u.role === "seller" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{u.role}</span></td>
                            <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                            <td className="px-4 py-3"><span className={`badge ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.isActive ? "Active" : "Inactive"}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => toast.success("User status toggled")} className="text-xs px-2 py-1 border border-border rounded-md hover:bg-muted">{u.isActive ? "Deactivate" : "Activate"}</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {active === "products" && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6">Manage Products ({products.length})</h2>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Product</th>
                          <th className="text-left px-4 py-3 font-medium">Category</th>
                          <th className="text-left px-4 py-3 font-medium">Price</th>
                          <th className="text-left px-4 py-3 font-medium">Stock</th>
                          <th className="text-left px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                <p className="font-medium line-clamp-1 max-w-[180px]">{p.name}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                            <td className="px-4 py-3 font-semibold text-primary">₹{p.price.toLocaleString("en-IN")}</td>
                            <td className="px-4 py-3"><span className={`badge ${p.stock < 5 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{p.stock}</span></td>
                            <td className="px-4 py-3">
                              <button onClick={() => { deleteProduct(p.id); toast.success("Product removed"); }} className="w-7 h-7 flex items-center justify-center text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Orders */}
            {active === "orders" && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6">All Orders ({orders.length})</h2>
                <div className="space-y-3">
                  {orders.map(o => (
                    <div key={o.id} className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-3 items-center justify-between">
                      <div>
                        <p className="font-bold text-sm">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.userName} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                        <select value={o.status} onChange={e => { updateOrderStatus(o.id, e.target.value as any); toast.success("Status updated"); }}
                          className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background">
                          {["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"].map(s =>
                            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                          )}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupons */}
            {active === "coupons" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold">Coupon Management ({coupons.length})</h2>
                  <button onClick={() => { setCouponForm(emptyCouponForm); setEditCouponId(null); setShowCouponForm(true); }} className="btn-primary text-sm">
                    <Plus className="w-4 h-4" /> New Coupon
                  </button>
                </div>

                {showCouponForm && (
                  <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-scale-in">
                    <h3 className="font-heading font-semibold mb-4">{editCouponId ? "Edit Coupon" : "Create New Coupon"}</h3>
                    <form onSubmit={e => {
                      e.preventDefault();
                      if (!couponForm.code || !couponForm.expiryDate) { toast.error("Fill all required fields"); return; }
                      if (editCouponId) {
                        updateCoupon(editCouponId, couponForm);
                        toast.success("Coupon updated!");
                      } else {
                        addCoupon(couponForm);
                        toast.success("Coupon created!");
                      }
                      setShowCouponForm(false); setEditCouponId(null); setCouponForm(emptyCouponForm);
                    }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Coupon Code *</label>
                        <input value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="input-field font-mono tracking-wider" placeholder="e.g. SUMMER25" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Description</label>
                        <input value={couponForm.description} onChange={e => setCouponForm(f => ({ ...f, description: e.target.value }))} className="input-field" placeholder="Short description" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Discount Type</label>
                        <select value={couponForm.type} onChange={e => setCouponForm(f => ({ ...f, type: e.target.value as "percentage" | "flat" }))} className="input-field">
                          <option value="percentage">Percentage (%)</option>
                          <option value="flat">Flat Amount (₹)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">{couponForm.type === "percentage" ? "Discount %" : "Discount Amount (₹)"}</label>
                        <input type="number" min="1" max={couponForm.type === "percentage" ? 99 : undefined} value={couponForm.value} onChange={e => setCouponForm(f => ({ ...f, value: parseInt(e.target.value) || 0 }))} className="input-field" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Minimum Order Value (₹)</label>
                        <input type="number" min="0" value={couponForm.minOrderValue} onChange={e => setCouponForm(f => ({ ...f, minOrderValue: parseInt(e.target.value) || 0 }))} className="input-field" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Max Uses</label>
                        <input type="number" min="1" value={couponForm.maxUses} onChange={e => setCouponForm(f => ({ ...f, maxUses: parseInt(e.target.value) || 1 }))} className="input-field" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Expiry Date *</label>
                        <input type="date" value={couponForm.expiryDate} onChange={e => setCouponForm(f => ({ ...f, expiryDate: e.target.value }))} className="input-field" required />
                      </div>
                      <div className="flex items-center gap-6 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={couponForm.isActive} onChange={e => setCouponForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
                          <span className="text-sm font-medium">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={couponForm.isSingleUse} onChange={e => setCouponForm(f => ({ ...f, isSingleUse: e.target.checked }))} className="w-4 h-4 accent-primary" />
                          <span className="text-sm font-medium">Single-use per user</span>
                        </label>
                      </div>
                      <div className="sm:col-span-2 flex gap-3 pt-2">
                        <button type="submit" className="btn-primary text-sm">{editCouponId ? "Update Coupon" : "Create Coupon"}</button>
                        <button type="button" onClick={() => { setShowCouponForm(false); setEditCouponId(null); }} className="btn-secondary text-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left px-4 py-3 font-medium">Code</th>
                          <th className="text-left px-4 py-3 font-medium">Type</th>
                          <th className="text-left px-4 py-3 font-medium">Value</th>
                          <th className="text-left px-4 py-3 font-medium">Min Order</th>
                          <th className="text-left px-4 py-3 font-medium">Usage</th>
                          <th className="text-left px-4 py-3 font-medium">Expiry</th>
                          <th className="text-left px-4 py-3 font-medium">Status</th>
                          <th className="text-left px-4 py-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {coupons.map(coupon => {
                          const isExpired = new Date(coupon.expiryDate) < new Date();
                          return (
                            <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                              <td className="px-4 py-3">
                                <div>
                                  <code className="font-mono font-bold text-primary">{coupon.code}</code>
                                  {coupon.isSingleUse && <span className="ml-2 badge bg-purple-100 text-purple-700 text-xs">1×</span>}
                                  <p className="text-xs text-muted-foreground mt-0.5">{coupon.description}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`badge text-xs ${coupon.type === "percentage" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                                  {coupon.type === "percentage" ? <><Percent className="w-3 h-3 inline" /> %</> : "₹ Flat"}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-bold text-primary">
                                {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {coupon.minOrderValue > 0 ? `₹${coupon.minOrderValue.toLocaleString("en-IN")}` : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="flex items-center gap-1 text-xs">
                                    <span className="font-medium">{coupon.usedCount}</span>
                                    <span className="text-muted-foreground">/ {coupon.maxUses}</span>
                                  </div>
                                  <div className="w-16 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${(coupon.usedCount / coupon.maxUses) * 100}%` }} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1 text-xs">
                                  <Calendar className="w-3 h-3" />
                                  <span className={isExpired ? "text-red-500" : "text-muted-foreground"}>
                                    {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                                  </span>
                                  {isExpired && <span className="badge bg-red-100 text-red-700 text-xs">Expired</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <button onClick={() => { toggleCouponActive(coupon.id); toast.success(coupon.isActive ? "Coupon deactivated" : "Coupon activated"); }}>
                                  {coupon.isActive ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-muted-foreground" />}
                                </button>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-1.5">
                                  <button onClick={() => { setCouponForm({ code: coupon.code, type: coupon.type, value: coupon.value, minOrderValue: coupon.minOrderValue, maxUses: coupon.maxUses, expiryDate: coupon.expiryDate, isActive: coupon.isActive, isSingleUse: coupon.isSingleUse, description: coupon.description }); setEditCouponId(coupon.id); setShowCouponForm(true); }} className="w-7 h-7 flex items-center justify-center border border-border rounded-lg hover:bg-muted">
                                    <Edit3 className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => { deleteCoupon(coupon.id); toast.success("Coupon deleted"); }} className="w-7 h-7 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {coupons.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground text-sm">No coupons yet. Create your first one!</div>
                  )}
                </div>
              </div>
            )}

            {/* Categories */}
            {active === "categories" && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6">Manage Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CATEGORIES.map(cat => (
                    <div key={cat.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                      <img src={cat.image} alt={cat.name} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-heading font-semibold">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.productCount} products</p>
                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => toast.success("Edit category (feature coming soon)")} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-muted"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => toast.error("Cannot delete system categories")} className="w-8 h-8 flex items-center justify-center border border-red-200 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => toast.success("Add category (feature coming soon)")} className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary hover:text-primary transition-all">
                    <Plus className="w-8 h-8" />
                    <span className="font-medium">Add Category</span>
                  </button>
                </div>
              </div>
            )}

            {/* Blog */}
            {active === "blog" && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">Blog Management ({posts.length})</h2>
                  <button onClick={() => { setBlogForm({ title: "", excerpt: "", content: "", category: "Interior Design", image: "", isPublished: false }); setEditBlogId(null); setShowBlogForm(true); }} className="btn-primary text-sm">
                    <Plus className="w-4 h-4" /> New Post
                  </button>
                </div>

                {showBlogForm && (
                  <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-scale-in">
                    <h3 className="font-heading font-semibold mb-4">{editBlogId ? "Edit Post" : "New Blog Post"}</h3>
                    <form onSubmit={handleBlogSubmit} className="space-y-4">
                      <input value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Post title" required />
                      <input value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} className="input-field" placeholder="Short excerpt" />
                      <input value={blogForm.image} onChange={e => setBlogForm(f => ({ ...f, image: e.target.value }))} className="input-field" placeholder="Featured image URL" />
                      <textarea value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))} className="input-field min-h-[120px] resize-none" placeholder="Write your blog content here..." />
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={blogForm.isPublished} onChange={e => setBlogForm(f => ({ ...f, isPublished: e.target.checked }))} className="w-4 h-4 accent-primary" />
                          <span className="text-sm font-medium">Publish immediately</span>
                        </label>
                      </div>
                      <div className="flex gap-3">
                        <button type="submit" className="btn-primary text-sm">{editBlogId ? "Update Post" : "Create Post"}</button>
                        <button type="button" onClick={() => { setShowBlogForm(false); setEditBlogId(null); }} className="btn-secondary text-sm">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="space-y-3">
                  {posts.map(post => (
                    <div key={post.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center">
                      <img src={post.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80"} alt={post.title} className="w-14 h-14 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-1">{post.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="badge bg-muted text-muted-foreground text-xs">{post.category}</span>
                          <span className={`badge text-xs ${post.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{post.isPublished ? "Published" : "Draft"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => { setBlogForm({ title: post.title, excerpt: post.excerpt, content: post.content, category: post.category, image: post.image, isPublished: post.isPublished }); setEditBlogId(post.id); setShowBlogForm(true); }} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-muted">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { updatePost(post.id, { isPublished: !post.isPublished }); toast.success(`Post ${post.isPublished ? "unpublished" : "published"}!`); }} className="w-8 h-8 flex items-center justify-center border border-border rounded-lg hover:bg-muted">
                          {post.isPublished ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => { deletePost(post.id); toast.success("Post deleted"); }} className="w-8 h-8 flex items-center justify-center border border-red-200 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            {active === "settings" && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-2xl font-bold mb-6">Platform Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: "Maintenance Mode", desc: "Temporarily disable the shop for maintenance" },
                    { label: "Allow New Registrations", desc: "Enable or disable new user sign-ups" },
                    { label: "Seller Self-Registration", desc: "Let sellers register without admin approval" },
                    { label: "Auto-approve Products", desc: "Automatically approve seller product listings" },
                    { label: "Email Notifications", desc: "Send email notifications for all order updates" },
                  ].map(({ label, desc }) => (
                    <div key={label} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                      <div>
                        <p className="font-medium text-foreground">{label}</p>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                      <button onClick={() => toast.success("Setting updated")} className="relative w-12 h-6 rounded-full bg-primary">
                        <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-6 transition-all" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
