import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, ShoppingCart, Star, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Minus, Plus, Share2, Check
} from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { StarRating } from "@/components/features/StarRating";
import { ProductCard } from "@/components/features/ProductCard";
import { toast } from "sonner";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, reviews, getReviewsByProduct, addReview } = useProductStore();
  const { addItem, isInCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const product = products.find(p => p.id === id);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] || "");
  const [color, setColor] = useState(product?.colors[0] || "");
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "care">("description");

  if (!product) {
    return (
      <div className="pt-24 text-center py-20">
        <h2 className="font-heading text-2xl mb-4">Product not found</h2>
        <Link to="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const productReviews = getReviewsByProduct(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inCart = isInCart(product.id);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    addItem(product, size, color, qty);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    addItem(product, size, color, qty);
    navigate("/cart");
  };

  const handleWishlist = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    toggleWishlist(product);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    addReview({ productId: product.id, userId: user!.id, userName: user!.name, rating: reviewRating, comment: reviewText });
    setReviewText("");
    setReviewRating(5);
    toast.success("Review submitted! Thank you.");
  };

  return (
    <div className="page-transition pt-16">
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to="/shop" className="text-muted-foreground hover:text-primary">Shop</Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium truncate">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
              {product.images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((imgIdx - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-md">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={() => setImgIdx((imgIdx + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-md">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.isNew && <span className="badge bg-green-500 text-white">New</span>}
                {product.isBestSeller && <span className="badge bg-carpet-brown text-white">Best Seller</span>}
                {product.discount && <span className="badge bg-red-500 text-white">-{product.discount}%</span>}
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-primary" : "border-border"}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-primary text-sm font-medium mb-1">{product.category}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground text-sm mb-4">By <strong>{product.sellerName}</strong> · Material: {product.material}</p>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.rating} showValue />
              <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-4xl font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">Save {product.discount}%</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-6">Inclusive of all taxes · Free delivery on this item</p>

            {/* Size */}
            <div className="mb-5">
              <p className="font-semibold text-sm mb-2">Size: <span className="text-primary">{size}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${size === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="font-semibold text-sm mb-2">Color: <span className="text-primary">{color}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${color === c ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="font-semibold text-sm">Quantity:</p>
              <div className="flex items-center gap-3 border border-border rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-l-lg"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-r-lg"><Plus className="w-4 h-4" /></button>
              </div>
              <span className="text-sm text-muted-foreground">{product.stock} available</span>
            </div>

            {/* CTA */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className={`flex-1 btn-primary ${inCart ? "bg-green-600 hover:bg-green-700" : ""}`}>
                {inCart ? <><Check className="w-4 h-4" /> In Cart</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
              </button>
              <button onClick={handleWishlist} className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${wishlisted ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500" : "border-border hover:border-primary/50"}`}>
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
              <button onClick={() => { navigator.share?.({ title: product.name, url: window.location.href }); toast.success("Link copied!"); }} className="w-12 h-12 flex items-center justify-center rounded-xl border border-border hover:border-primary/50 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            <button onClick={handleBuyNow} className="w-full btn-accent mb-6">Buy Now</button>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, label: "Free Delivery" },
                { icon: Shield, label: "Authenticity" },
                { icon: RotateCcw, label: "Easy Returns" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-muted rounded-xl text-center">
                  <Icon className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <div className="flex border-b border-border mb-6">
            {(["description", "reviews", "care"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab === "reviews" ? `Reviews (${productReviews.length})` : tab}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed text-base">{product.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[["Material", product.material], ["Category", product.category], ["Stock", `${product.stock} units`], ["Seller", product.sellerName]].map(([k, v]) => (
                  <div key={k} className="bg-muted p-4 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">{k}</p>
                    <p className="font-semibold text-foreground text-sm">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {productReviews.length === 0 ? (
                <div className="text-center py-10 bg-muted rounded-2xl">
                  <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map(r => (
                    <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.userName}`} alt={r.userName} className="w-9 h-9 rounded-full border border-border" />
                        <div>
                          <p className="font-semibold text-sm">{r.userName}</p>
                          <StarRating rating={r.rating} size={13} />
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                      </div>
                      <p className="text-muted-foreground text-sm">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
              {isAuthenticated && (
                <form onSubmit={handleReview} className="bg-muted rounded-2xl p-5 space-y-4">
                  <h4 className="font-heading font-semibold">Write a Review</h4>
                  <div>
                    <p className="text-sm mb-2">Your Rating</p>
                    <StarRating rating={reviewRating} size={24} interactive onChange={setReviewRating} />
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience with this carpet..." className="input-field min-h-[100px] resize-none" required />
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              )}
            </div>
          )}

          {activeTab === "care" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "Daily Care", tips: ["Vacuum regularly with low suction", "Rotate every 6 months for even wear", "Keep away from direct sunlight", "Use rug pads to prevent slipping"] },
                { title: "Stain Removal", tips: ["Blot immediately — never rub", "Use cold water for most stains", "Mild soap for persistent stains", "Avoid harsh chemicals"] },
                { title: "Deep Cleaning", tips: ["Professional cleaning every 2-3 years", "Hand wash small rugs gently", "Air dry flat, avoid machine drying", "Steam cleaning is safe for wool"] },
                { title: "Storage", tips: ["Roll (never fold) for storage", "Wrap in breathable cotton fabric", "Store in cool, dry environment", "Place cedar blocks to repel moths"] },
              ].map(({ title, tips }) => (
                <div key={title} className="bg-card border border-border rounded-xl p-5">
                  <h4 className="font-heading font-semibold mb-3">{title}</h4>
                  <ul className="space-y-1.5">
                    {tips.map(tip => (
                      <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
