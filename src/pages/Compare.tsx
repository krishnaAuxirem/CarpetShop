import { Link } from "react-router-dom";
import { X, Star, ShoppingCart, Check, Minus, ArrowLeft } from "lucide-react";
import { useCompareStore } from "@/stores/compareStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const ROW_LABELS = [
  { key: "image", label: "Product" },
  { key: "price", label: "Price" },
  { key: "rating", label: "Rating" },
  { key: "material", label: "Material" },
  { key: "category", label: "Category" },
  { key: "sizes", label: "Available Sizes" },
  { key: "colors", label: "Colors" },
  { key: "stock", label: "In Stock" },
  { key: "seller", label: "Seller" },
  { key: "discount", label: "Discount" },
  { key: "delivery", label: "Delivery" },
  { key: "description", label: "Description" },
  { key: "action", label: "" },
];

export const Compare = () => {
  const { items, removeItem, clearAll } = useCompareStore();
  const { addItem, isInCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  if (items.length === 0) {
    return (
      <div className="page-transition pt-16 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Minus className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-bold mb-2">No Products to Compare</h2>
          <p className="text-muted-foreground mb-6">Add up to 3 carpets from the shop to compare them side by side.</p>
          <Link to="/shop" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const getValue = (product: (typeof items)[0], key: string) => {
    switch (key) {
      case "price":
        return (
          <div>
            <p className="font-heading text-xl font-bold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        );
      case "rating":
        return (
          <div className="flex items-center gap-1.5 justify-center">
            <div className="flex">
              {[1, 2, 3, 4, 5].map(i => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        );
      case "sizes":
        return (
          <div className="flex flex-wrap gap-1 justify-center">
            {product.sizes.slice(0, 4).map(s => (
              <span key={s} className="px-1.5 py-0.5 bg-muted rounded text-xs">{s}</span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-muted-foreground">+{product.sizes.length - 4} more</span>
            )}
          </div>
        );
      case "colors":
        return (
          <div className="flex flex-wrap gap-1.5 justify-center">
            {product.colors.slice(0, 5).map(c => (
              <div
                key={c}
                title={c}
                className="w-5 h-5 rounded-full border border-border"
                style={{ backgroundColor: c.toLowerCase().replace(" ", "") }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-muted-foreground">+{product.colors.length - 5}</span>
            )}
          </div>
        );
      case "stock":
        return product.stock > 0 ? (
          <span className="flex items-center gap-1 justify-center text-green-600 text-sm font-medium">
            <Check className="w-4 h-4" /> {product.stock} units
          </span>
        ) : (
          <span className="text-red-500 text-sm">Out of Stock</span>
        );
      case "seller":
        return <span className="text-sm">{product.sellerName}</span>;
      case "discount":
        return product.discount ? (
          <span className="badge bg-red-100 text-red-700">{product.discount}% OFF</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      case "delivery":
        return (
          <span className={`text-sm font-medium ${product.price > 5000 ? "text-green-600" : "text-muted-foreground"}`}>
            {product.price > 5000 ? "Free Delivery" : "₹800"}
          </span>
        );
      case "description":
        return (
          <p className="text-xs text-muted-foreground text-left leading-relaxed line-clamp-3">
            {product.description}
          </p>
        );
      case "material":
        return <span className="text-sm font-medium">{product.material}</span>;
      case "category":
        return <span className="badge bg-primary/10 text-primary text-xs">{product.category}</span>;
      default:
        return <span className="text-sm text-muted-foreground">{(product as any)[key] ?? "—"}</span>;
    }
  };

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/shop" className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-heading text-xl font-bold">Product Comparison</h1>
              <p className="text-sm text-muted-foreground">Comparing {items.length} carpet{items.length > 1 ? "s" : ""}</p>
            </div>
          </div>
          <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1.5 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
            <X className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Product headers */}
          <div className="grid gap-4 mb-1" style={{ gridTemplateColumns: `220px repeat(${items.length}, 1fr)` }}>
            <div />
            {items.map(product => (
              <div key={product.id} className="bg-card border border-border rounded-2xl overflow-hidden relative group">
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="h-36 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 text-center">
                  <p className="font-heading font-bold text-sm line-clamp-2 leading-tight">{product.name}</p>
                  <Link to={`/product/${product.id}`} className="text-xs text-primary hover:underline mt-1 inline-block">View Details</Link>
                </div>
              </div>
            ))}
            {/* Add more slot */}
            {items.length < 3 && (
              <Link
                to="/shop"
                className="border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 py-8 hover:border-primary hover:text-primary transition-all text-muted-foreground"
              >
                <div className="w-10 h-10 rounded-full border-2 border-current flex items-center justify-center text-xl font-bold">+</div>
                <span className="text-sm font-medium">Add Product</span>
              </Link>
            )}
          </div>

          {/* Comparison rows */}
          {ROW_LABELS.map(({ key, label }) => {
            if (key === "image") return null;
            if (key === "action") {
              return (
                <div
                  key={key}
                  className="grid gap-4 py-3"
                  style={{ gridTemplateColumns: `220px repeat(${items.length}, 1fr)` }}
                >
                  <div />
                  {items.map(product => (
                    <div key={product.id} className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          if (!isAuthenticated) { window.location.href = "/login"; return; }
                          addItem(product, product.sizes[0], product.colors[0]);
                          toast.success(`${product.name} added to cart!`);
                        }}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                          isInCart(product.id)
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-primary hover:bg-primary/90 text-white"
                        }`}
                      >
                        {isInCart(product.id) ? (
                          <><Check className="w-4 h-4" /> In Cart</>
                        ) : (
                          <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div
                key={key}
                className="grid gap-4 py-3 border-b border-border last:border-0 items-center"
                style={{ gridTemplateColumns: `220px repeat(${items.length}, 1fr)` }}
              >
                <div className="text-sm font-semibold text-muted-foreground pl-2">{label}</div>
                {items.map(product => (
                  <div key={product.id} className="text-center px-2">
                    {getValue(product, key)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
