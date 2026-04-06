import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, Plus, Edit3, Trash2, BarChart2, ShoppingBag, LogOut,
  TrendingUp, DollarSign, Eye, Star, Save, X, Users,
  ArrowUp, ArrowDown, Award
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { useOrderStore } from "@/stores/orderStore";
import { CATEGORIES, MATERIALS, CARPET_COLORS, CARPET_SIZES } from "@/constants/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";
import { toast } from "sonner";

const SIDEBAR_ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "products", label: "My Products", icon: Package },
  { id: "add-product", label: "Add Product", icon: Plus },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "analytics", label: "Sales Analytics", icon: TrendingUp },
];

const CHART_COLORS = ["#8B4513", "#D4AF37", "#3E2723", "#6B3A2A", "#C09060", "#5A2D0C"];

// Simulated time-series data
const DAILY_DATA = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
    revenue: Math.floor(Math.random() * 35000 + 8000),
    orders: Math.floor(Math.random() * 8 + 1),
    visitors: Math.floor(Math.random() * 120 + 30),
  };
});

const WEEKLY_DATA = Array.from({ length: 12 }, (_, i) => {
  const weekNum = 12 - i;
  return {
    week: `W${weekNum}`,
    revenue: Math.floor(Math.random() * 180000 + 60000),
    orders: Math.floor(Math.random() * 32 + 8),
    newCustomers: Math.floor(Math.random() * 15 + 3),
  };
}).reverse();

const MONTHLY_DATA = [
  { month: "Aug", revenue: 85000, orders: 12, returns: 1 },
  { month: "Sep", revenue: 98000, orders: 16, returns: 2 },
  { month: "Oct", revenue: 130000, orders: 20, returns: 2 },
  { month: "Nov", revenue: 160000, orders: 24, returns: 3 },
  { month: "Dec", revenue: 210000, orders: 34, returns: 4 },
  { month: "Jan", revenue: 175000, orders: 27, returns: 3 },
  { month: "Feb", revenue: 195000, orders: 30, returns: 2 },
  { month: "Mar", revenue: 240000, orders: 38, returns: 3 },
];

const emptyProduct = {
  name: "", description: "", price: "", originalPrice: "", category: CATEGORIES[0].name,
  material: MATERIALS[0], sizes: [] as string[], colors: [] as string[], stock: "", images: [""],
};

export const SellerDashboard = () => {
  const { user, logout } = useAuthStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { getAllOrders, updateOrderStatus } = useOrderStore();
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [form, setForm] = useState({ ...emptyProduct });
  const [editId, setEditId] = useState<string | null>(null);
  const [analyticsRange, setAnalyticsRange] = useState<"daily" | "weekly" | "monthly">("monthly");

  if (!user || user.role !== "seller") { navigate("/login"); return null; }

  const myProducts = products.filter(p => p.sellerId === user.id);
  const allOrders = getAllOrders();
  const myOrders = allOrders.filter(o => o.items.some(i => myProducts.find(p => p.id === i.productId)));
  const totalRevenue = myOrders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0);
  const avgRating = myProducts.length ? (myProducts.reduce((s, p) => s + p.rating, 0) / myProducts.length) : 0;

  // Analytics data derived from myProducts
  const topProducts = [...myProducts]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5)
    .map(p => ({ name: p.name.split(" ").slice(0, 3).join(" "), reviews: p.reviewCount, rating: p.rating, revenue: p.price * Math.floor(Math.random() * 10 + 2) }));

  const categoryRevenue = CATEGORIES.slice(0, 6).map((cat, i) => ({
    name: cat.name.split(" ")[0],
    revenue: Math.floor(Math.random() * 120000 + 30000),
    products: myProducts.filter(p => p.category === cat.name).length,
    color: CHART_COLORS[i % CHART_COLORS.length],
  })).filter(c => c.products > 0 || Math.random() > 0.4);

  const returnData = MONTHLY_DATA.map(m => ({
    ...m,
    returnRate: parseFloat(((m.returns / m.orders) * 100).toFixed(1)),
  }));

  // Overview KPI trend
  const prevMonthRevenue = MONTHLY_DATA[MONTHLY_DATA.length - 2].revenue;
  const currMonthRevenue = MONTHLY_DATA[MONTHLY_DATA.length - 1].revenue;
  const revenueGrowth = (((currMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1);

  const activeData = analyticsRange === "daily" ? DAILY_DATA : analyticsRange === "weekly" ? WEEKLY_DATA : MONTHLY_DATA;
  const xKey = analyticsRange === "daily" ? "date" : analyticsRange === "weekly" ? "week" : "month";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error("Please fill required fields"); return; }
    const productData = {
      name: form.name, description: form.description,
      price: parseInt(form.price), originalPrice: form.originalPrice ? parseInt(form.originalPrice) : undefined,
      images: form.images.filter(Boolean).length ? form.images.filter(Boolean) : ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"],
      category: form.category, material: form.material,
      sizes: form.sizes, colors: form.colors,
      rating: 0, reviewCount: 0,
      stock: parseInt(form.stock) || 10,
      sellerId: user.id, sellerName: user.name, tags: [],
    };
    if (editId) { updateProduct(editId, productData); toast.success("Product updated!"); }
    else { addProduct(productData); toast.success("Product added!"); }
    setForm({ ...emptyProduct }); setEditId(null); setActive("products");
  };

  const handleEdit = (p: typeof products[0]) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), originalPrice: String(p.originalPrice || ""), category: p.category, material: p.material, sizes: p.sizes, colors: p.colors, stock: String(p.stock), images: p.images });
    setEditId(p.id); setActive("add-product");
  };

  const toggleSize = (s: string) => setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s] }));
  const toggleColor = (c: string) => setForm(f => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c] }));

  const GrowthBadge = ({ value }: { value: string }) => {
    const isPos = parseFloat(value) >= 0;
    return (
      <span className={`flex items-center gap-0.5 text-xs font-semibold ${isPos ? "text-green-600" : "text-red-500"}`}>
        {isPos ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
        {Math.abs(parseFloat(value))}%
      </span>
    );
  };

  return (
    <div className="page-transition pt-16 min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-60 shrink-0 hidden md:block">
            <div className="bg-card border border-border rounded-2xl p-4 sticky top-24">
              <div className="p-3 border-b border-border mb-3 text-center">
                <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-primary" />
                <p className="font-heading font-bold">{user.name}</p>
                <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">Seller</span>
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

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            {active === "overview" && (
              <div className="animate-fade-in space-y-6">
                <h2 className="font-heading text-2xl font-bold">Seller Dashboard</h2>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Revenue", value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: `+${revenueGrowth}% this month`, icon: DollarSign, color: "bg-green-100 dark:bg-green-900/20 text-green-600", positive: parseFloat(revenueGrowth) >= 0 },
                    { label: "Total Orders", value: myOrders.length, sub: `${myOrders.filter(o => o.status === "pending").length} pending`, icon: ShoppingBag, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600", positive: true },
                    { label: "Products", value: myProducts.length, sub: `${myProducts.filter(p => p.stock < 5).length} low stock`, icon: Package, color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600", positive: true },
                    { label: "Avg Rating", value: avgRating.toFixed(1), sub: `${myProducts.reduce((s, p) => s + p.reviewCount, 0)} total reviews`, icon: Star, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600", positive: avgRating >= 4 },
                  ].map(({ label, value, sub, icon: Icon, color }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-5">
                      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                      <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                    </div>
                  ))}
                </div>

                {/* Mini charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-semibold mb-4">Revenue (Last 8 Months)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={MONTHLY_DATA}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B4513" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8B4513" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} className="text-xs" />
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                        <Area type="monotone" dataKey="revenue" stroke="#8B4513" strokeWidth={2} fill="url(#revGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-semibold mb-4">Top Products by Reviews</h3>
                    {topProducts.length > 0 ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={topProducts} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                          <XAxis type="number" className="text-xs" />
                          <YAxis dataKey="name" type="category" width={90} className="text-xs" />
                          <Tooltip />
                          <Bar dataKey="reviews" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                        Add products to see analytics
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent orders */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold">Recent Orders</h3>
                    <button onClick={() => setActive("orders")} className="text-xs text-primary hover:underline">View all</button>
                  </div>
                  {myOrders.slice(0, 3).map(o => (
                    <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">{o.id}</p>
                        <p className="text-xs text-muted-foreground">{o.userName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary text-sm">₹{o.totalAmount.toLocaleString("en-IN")}</p>
                        <p className="text-xs text-muted-foreground capitalize">{o.status.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                  ))}
                  {myOrders.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>}
                </div>
              </div>
            )}

            {/* My Products */}
            {active === "products" && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading text-2xl font-bold">My Products ({myProducts.length})</h2>
                  <button onClick={() => { setForm({ ...emptyProduct }); setEditId(null); setActive("add-product"); }} className="btn-primary text-sm">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
                {myProducts.length === 0 ? (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-semibold mb-2">No Products Listed</h3>
                    <p className="text-muted-foreground mb-6">Start by adding your first product</p>
                    <button onClick={() => setActive("add-product")} className="btn-primary">Add First Product</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myProducts.map(p => (
                      <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center">
                        <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground">{p.name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{p.category}</span>
                            <span className="text-xs text-primary font-semibold">₹{p.price.toLocaleString("en-IN")}</span>
                            <span className={`text-xs font-medium ${p.stock < 5 ? "text-red-500" : "text-muted-foreground"}`}>Stock: {p.stock}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Link to={`/product/${p.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"><Eye className="w-4 h-4" /></Link>
                          <button onClick={() => handleEdit(p)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button onClick={() => { deleteProduct(p.id); toast.success("Product deleted"); }} className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add/Edit Product */}
            {active === "add-product" && (
              <div className="bg-card border border-border rounded-2xl p-6 animate-scale-in">
                <h2 className="font-heading text-2xl font-bold mb-6">{editId ? "Edit Product" : "Add New Product"}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Product Name *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="e.g., Royal Persian Medallion" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Category</label>
                      <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                        {CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field min-h-[100px] resize-none" placeholder="Detailed product description..." />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Price (₹) *</label>
                      <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="input-field" placeholder="15000" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Original Price (₹)</label>
                      <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} className="input-field" placeholder="20000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Stock</label>
                      <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="input-field" placeholder="25" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Material</label>
                      <select value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} className="input-field">
                        {MATERIALS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Image URL</label>
                    <input value={form.images[0]} onChange={e => setForm(f => ({ ...f, images: [e.target.value] }))} className="input-field" placeholder="https://images.unsplash.com/..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sizes</label>
                    <div className="flex flex-wrap gap-2">
                      {CARPET_SIZES.slice(0, 10).map(s => (
                        <button type="button" key={s} onClick={() => toggleSize(s)} className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${form.sizes.includes(s) ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Colors</label>
                    <div className="flex flex-wrap gap-2">
                      {CARPET_COLORS.slice(0, 12).map(c => (
                        <button type="button" key={c} onClick={() => toggleColor(c)} className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-all ${form.colors.includes(c) ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary"><Save className="w-4 h-4" />{editId ? "Update Product" : "Add Product"}</button>
                    <button type="button" onClick={() => { setForm({ ...emptyProduct }); setEditId(null); setActive("products"); }} className="btn-secondary"><X className="w-4 h-4" />Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders */}
            {active === "orders" && (
              <div className="animate-fade-in">
                <h2 className="font-heading text-2xl font-bold mb-6">Orders ({myOrders.length})</h2>
                <div className="space-y-3">
                  {myOrders.length === 0 ? (
                    <div className="bg-card border border-border rounded-2xl p-12 text-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet</p>
                    </div>
                  ) : myOrders.map(o => (
                    <div key={o.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex flex-wrap justify-between gap-2 mb-3">
                        <div>
                          <p className="font-bold text-sm">{o.id}</p>
                          <p className="text-xs text-muted-foreground">{o.userName} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-bold">₹{o.totalAmount.toLocaleString("en-IN")}</span>
                          <select value={o.status} onChange={e => { updateOrderStatus(o.id, e.target.value as any); toast.success("Status updated"); }}
                            className="text-xs border border-border rounded-lg px-2 py-1 bg-background">
                            {["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"].map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {o.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs bg-muted rounded-lg px-2 py-1">
                            <img src={item.product.images[0]} className="w-6 h-6 rounded object-cover" alt="" />
                            <span>{item.product.name} ×{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics */}
            {active === "analytics" && (
              <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h2 className="font-heading text-2xl font-bold">Sales Analytics</h2>
                  <div className="flex border border-border rounded-xl overflow-hidden text-sm">
                    {(["daily", "weekly", "monthly"] as const).map(r => (
                      <button key={r} onClick={() => setAnalyticsRange(r)}
                        className={`px-4 py-2 font-medium capitalize transition-colors ${analyticsRange === r ? "bg-primary text-white" : "hover:bg-muted"}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Revenue + Orders trend */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold mb-1">Revenue Trend</h3>
                  <p className="text-xs text-muted-foreground mb-4 capitalize">{analyticsRange} view</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={activeData}>
                      <defs>
                        <linearGradient id="revArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B4513" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#8B4513" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ordArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                      <XAxis dataKey={xKey} className="text-xs" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} className="text-xs" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" className="text-xs" tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(v: number, name: string) => [name === "revenue" ? `₹${v.toLocaleString("en-IN")}` : v, name === "revenue" ? "Revenue" : "Orders"]} />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#8B4513" strokeWidth={2} fill="url(#revArea)" dot={false} name="revenue" />
                      <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#D4AF37" strokeWidth={2} fill="url(#ordArea)" dot={false} name="orders" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue by Category */}
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-semibold mb-4">Revenue by Category</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={categoryRevenue}
                          dataKey="revenue"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {categoryRevenue.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Customer Return Rate */}
                  <div className="bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-heading font-semibold mb-1">Return Rate vs Orders</h3>
                    <p className="text-xs text-muted-foreground mb-4">Monthly return rate (%)</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={returnData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                        <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="left" className="text-xs" tick={{ fontSize: 10 }} />
                        <YAxis yAxisId="right" orientation="right" unit="%" className="text-xs" tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8B4513" strokeWidth={2} dot={{ r: 3, fill: "#8B4513" }} name="Orders" />
                        <Line yAxisId="right" type="monotone" dataKey="returnRate" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: "#ef4444" }} name="Return %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Performing Products table */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" /> Top Performing Products
                  </h3>
                  {myProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Add products to see performance data</p>
                  ) : (
                    <div className="space-y-3">
                      {myProducts.slice(0, 5).map((p, i) => {
                        const estRevenue = p.price * Math.floor(Math.random() * 12 + 2);
                        return (
                          <div key={p.id} className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-gray-700" : i === 2 ? "bg-amber-700 text-white" : "bg-muted text-muted-foreground"
                            }`}>{i + 1}</div>
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex">
                                  {[1,2,3,4,5].map(s => (
                                    <Star key={s} className={`w-3 h-3 ${s <= Math.round(p.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{p.reviewCount} reviews</span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-primary text-sm">₹{estRevenue.toLocaleString("en-IN")}</p>
                              <p className="text-xs text-muted-foreground">est. revenue</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Customer insights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "New Customers", value: "34", sub: "This month", icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20", trend: "+12%" },
                    { label: "Repeat Customers", value: "18", sub: "Returned buyers", icon: TrendingUp, color: "text-green-600 bg-green-50 dark:bg-green-900/20", trend: "+5%" },
                    { label: "Avg Order Value", value: `₹${myProducts.length ? Math.round(myProducts.reduce((s, p) => s + p.price, 0) / myProducts.length).toLocaleString("en-IN") : "0"}`, sub: "Per order", icon: DollarSign, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20", trend: "+8%" },
                  ].map(({ label, value, sub, icon: Icon, color, trend }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-5">
                      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                      <p className="font-heading text-2xl font-bold">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">{trend} vs last month</p>
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
