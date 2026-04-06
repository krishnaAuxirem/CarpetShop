import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, Plus, Edit3, Trash2, BarChart2, ShoppingBag, LogOut,
  TrendingUp, DollarSign, Eye, Star, Camera, Save, X, AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { useOrderStore } from "@/stores/orderStore";
import { CATEGORIES, MATERIALS, CARPET_COLORS, CARPET_SIZES } from "@/constants/data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { toast } from "sonner";

const SIDEBAR_ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "products", label: "My Products", icon: Package },
  { id: "add-product", label: "Add Product", icon: Plus },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "analytics", label: "Sales Analytics", icon: TrendingUp },
];

const SALES_DATA = [
  { month: "Oct", revenue: 85000, orders: 12 },
  { month: "Nov", revenue: 120000, orders: 18 },
  { month: "Dec", revenue: 180000, orders: 28 },
  { month: "Jan", revenue: 140000, orders: 22 },
  { month: "Feb", revenue: 160000, orders: 24 },
  { month: "Mar", revenue: 210000, orders: 32 },
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

  if (!user || user.role !== "seller") { navigate("/login"); return null; }

  const myProducts = products.filter(p => p.sellerId === user.id);
  const allOrders = getAllOrders();
  const myOrders = allOrders.filter(o => o.items.some(i => myProducts.find(p => p.id === i.productId)));
  const totalRevenue = myOrders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0);

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
    if (editId) {
      updateProduct(editId, productData);
      toast.success("Product updated!");
    } else {
      addProduct(productData);
      toast.success("Product added!");
    }
    setForm({ ...emptyProduct });
    setEditId(null);
    setActive("products");
  };

  const handleEdit = (p: typeof products[0]) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), originalPrice: String(p.originalPrice || ""), category: p.category, material: p.material, sizes: p.sizes, colors: p.colors, stock: String(p.stock), images: p.images });
    setEditId(p.id);
    setActive("add-product");
  };

  const toggleSize = (s: string) => setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s] }));
  const toggleColor = (c: string) => setForm(f => ({ ...f, colors: f.colors.includes(c) ? f.colors.filter(x => x !== c) : [...f.colors, c] }));

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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: DollarSign, color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
                    { label: "Total Orders", value: myOrders.length, icon: ShoppingBag, color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
                    { label: "Products", value: myProducts.length, icon: Package, color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600" },
                    { label: "Avg Rating", value: myProducts.length ? (myProducts.reduce((s, p) => s + p.rating, 0) / myProducts.length).toFixed(1) : "0", icon: Star, color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-card border border-border rounded-2xl p-5">
                      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}><Icon className="w-5 h-5" /></div>
                      <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold mb-4">Revenue Trend (Last 6 months)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} className="text-xs" />
                      <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                      <Bar dataKey="revenue" fill="#8B4513" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
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
                            <span className="text-xs text-muted-foreground">Stock: {p.stock}</span>
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
                            <img src={item.product.images[0]} className="w-6 h-6 rounded object-cover" />
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
                <h2 className="font-heading text-2xl font-bold">Sales Analytics</h2>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-heading font-semibold mb-4">Monthly Revenue vs Orders</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8B4513" strokeWidth={2} dot={{ fill: "#8B4513" }} />
                      <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#D4AF37" strokeWidth={2} dot={{ fill: "#D4AF37" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
