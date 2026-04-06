import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Heart, ShoppingCart, Star, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Minus, Plus, Share2, Check,
  ThumbsUp, BadgeCheck, Camera, BarChart2 as CompareIcon,
  MessageCircle, Send, ChevronDown, ChevronUp, Award
} from "lucide-react";
import { useQAStore } from "@/stores/qaStore";
import { ProductViewer360 } from "@/components/features/ProductViewer360";
import { useCompareStore } from "@/stores/compareStore";
import { useProductStore } from "@/stores/productStore";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useOrderStore } from "@/stores/orderStore";
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

  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare } = useCompareStore();
  const { getOrdersByUser } = useOrderStore();
  const { getByProduct, addQuestion, addAnswer, voteQuestion, voteAnswer } = useQAStore();
  const product = products.find(p => p.id === id);
  const [imgIdx, setImgIdx] = useState(0);
  const [size, setSize] = useState(product?.sizes[0] || "");
  const [color, setColor] = useState(product?.colors[0] || "");
  const [qty, setQty] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewPhoto, setReviewPhoto] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "care" | "viewer360" | "qa">("description");
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Q&A state
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswers, setQaAnswers] = useState<Record<string, string>>({});
  const [expandedQA, setExpandedQA] = useState<Set<string>>(new Set());
  const [showAnswerForm, setShowAnswerForm] = useState<string | null>(null);

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
  const userOrders = user ? getOrdersByUser(user.id) : [];
  const isVerifiedBuyer = userOrders.some(o => o.items.some(i => i.productId === product.id));
  const productQA = getByProduct(product.id);

  const handleQAQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!qaQuestion.trim()) return;
    addQuestion({ productId: product.id, userId: user!.id, userName: user!.name, text: qaQuestion });
    setQaQuestion("");
    toast.success("Question submitted! Seller will be notified.");
  };

  const handleQAAnswer = (questionId: string) => {
    const text = qaAnswers[questionId];
    if (!text?.trim()) return;
    if (!isAuthenticated) { navigate("/login"); return; }
    addAnswer(questionId, {
      userId: user!.id,
      userName: user!.name,
      userRole: (user!.role === "seller" || user!.role === "admin") ? user!.role : "customer",
      text,
      isSellerReply: user!.role === "seller" || user!.role === "admin",
    });
    setQaAnswers(a => ({ ...a, [questionId]: "" }));
    setShowAnswerForm(null);
    toast.success("Answer posted!");
  };

  const toggleQAExpand = (id: string) => {
    setExpandedQA(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Ratings breakdown
  const allReviews = [...productReviews];
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: allReviews.filter(r => Math.round(r.rating) === star).length,
    pct: allReviews.length ? Math.round(allReviews.filter(r => Math.round(r.rating) === star).length / allReviews.length * 100) : 0,
  }));

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

  const handleCompare = () => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      toast.success("Removed from comparison");
    } else {
      const added = addToCompare(product);
      if (!added) toast.error("You can compare up to 3 products");
      else toast.success("Added to compare!");
    }
  };

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    addReview({ productId: product.id, userId: user!.id, userName: user!.name, rating: reviewRating, comment: reviewText });
    setReviewText("");
    setReviewRating(5);
    setReviewPhoto(null);
    toast.success("Review submitted! Thank you.");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setReviewPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const toggleHelpful = (reviewId: string) => {
    if (!isAuthenticated) { toast.error("Login to mark helpful"); return; }
    setHelpfulVotes(v => ({ ...v, [reviewId]: !v[reviewId] }));
    toast.success(helpfulVotes[reviewId] ? "Vote removed" : "Marked as helpful!");
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
              <button onClick={handleCompare} title={isInCompare(product.id) ? "Remove from compare" : "Compare"}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all ${
                  isInCompare(product.id) ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"
                }`}>
                <CompareIcon className="w-5 h-5" />
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
            {(["description", "viewer360", "qa", "reviews", "care"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                {tab === "reviews" ? `Reviews (${productReviews.length})` : tab === "viewer360" ? "360° View" : tab === "qa" ? `Q&A (${productQA.length})` : tab}
              </button>
            ))}
          </div>

          {activeTab === "viewer360" && (
            <div className="animate-fade-in">
              <ProductViewer360 images={product.images.length >= 2 ? product.images : [...product.images, ...product.images, ...product.images]} productName={product.name} />
            </div>
          )}

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
              {/* Ratings Summary */}
              {allReviews.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
                  <div className="text-center shrink-0">
                    <p className="font-heading text-5xl font-bold text-primary">{product.rating.toFixed(1)}</p>
                    <StarRating rating={product.rating} size={18} />
                    <p className="text-sm text-muted-foreground mt-1">{allReviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingCounts.map(({ star, count, pct }) => (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-10 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-medium">{star}</span>
                        </div>
                        <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-14 text-right">{count} ({pct}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {productReviews.length === 0 ? (
                <div className="text-center py-10 bg-muted rounded-2xl">
                  <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productReviews.map(r => (
                    <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.userName}`} alt={r.userName} className="w-10 h-10 rounded-full border border-border shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{r.userName}</p>
                            {r.userId === "u1" && (
                              <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                                <BadgeCheck className="w-3 h-3" /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={r.rating} size={13} />
                            <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{r.comment}</p>
                      {/* Simulated review photo placeholder */}
                      {r.id === "r1" && (
                        <div className="flex gap-2 mb-3">
                          <img src={product.images[0]} alt="Review photo" className="w-16 h-16 rounded-lg object-cover border border-border" />
                          <img src={product.images[1] || product.images[0]} alt="Review photo" className="w-16 h-16 rounded-lg object-cover border border-border" />
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <button onClick={() => toggleHelpful(r.id)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${helpfulVotes[r.id] ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                          <ThumbsUp className="w-3 h-3" /> Helpful ({helpfulVotes[r.id] ? 1 : 0})
                        </button>
                        <span className="text-xs text-muted-foreground">Was this review helpful?</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isAuthenticated && (
                <form onSubmit={handleReview} className="bg-muted rounded-2xl p-5 space-y-4">
                  <h4 className="font-heading font-semibold">Write a Review</h4>
                  {isVerifiedBuyer && (
                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 dark:bg-green-900/10 px-3 py-2 rounded-lg">
                      <BadgeCheck className="w-4 h-4" /> You purchased this product — your review will show a Verified Purchase badge.
                    </div>
                  )}
                  <div>
                    <p className="text-sm mb-2">Your Rating</p>
                    <StarRating rating={reviewRating} size={24} interactive onChange={setReviewRating} />
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience with this carpet..." className="input-field min-h-[100px] resize-none" required />
                  {/* Photo upload */}
                  <div>
                    <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <button type="button" onClick={() => photoInputRef.current?.click()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors border border-dashed border-border rounded-lg px-4 py-2.5 hover:border-primary">
                      <Camera className="w-4 h-4" /> Add Photo (optional)
                    </button>
                    {reviewPhoto && (
                      <div className="mt-2 relative w-20 h-20">
                        <img src={reviewPhoto} alt="Review" className="w-full h-full object-cover rounded-lg border border-border" />
                        <button type="button" onClick={() => setReviewPhoto(null)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              )}
            </div>
          )}

          {activeTab === "qa" && (
            <div className="space-y-5 animate-fade-in">
              {/* Ask a question */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
                <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" /> Have a Question?
                </h3>
                {isAuthenticated ? (
                  <form onSubmit={handleQAQuestion} className="flex gap-3">
                    <input
                      value={qaQuestion}
                      onChange={e => setQaQuestion(e.target.value)}
                      placeholder="Ask about material, size, care instructions..."
                      className="input-field flex-1"
                      required
                    />
                    <button type="submit" className="btn-primary shrink-0">
                      <Send className="w-4 h-4" /> Ask
                    </button>
                  </form>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    <Link to="/login" className="text-primary hover:underline">Login</Link> to ask a question
                  </p>
                )}
              </div>

              {productQA.length === 0 ? (
                <div className="text-center py-10 bg-muted rounded-2xl">
                  <MessageCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No questions yet. Be the first to ask!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {productQA.map(q => {
                    const isExpanded = expandedQA.has(q.id);
                    const userVotedQ = user && q.helpfulVotes.includes(user.id);
                    return (
                      <div key={q.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${q.userName}`} alt="" className="w-9 h-9 rounded-full border border-border shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-semibold text-sm">{q.userName}</span>
                                <span className="text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString("en-IN")}</span>
                                {q.isAnswered && (
                                  <span className="badge bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Answered
                                  </span>
                                )}
                              </div>
                              <p className="text-foreground text-sm font-medium">{q.text}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <button
                                  onClick={() => user && voteQuestion(q.id, user.id)}
                                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                                    userVotedQ ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                                  }`}
                                >
                                  <ThumbsUp className="w-3 h-3" /> Helpful ({q.helpfulVotes.length})
                                </button>
                                <button
                                  onClick={() => setShowAnswerForm(showAnswerForm === q.id ? null : q.id)}
                                  className="text-xs text-primary hover:underline flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  {showAnswerForm === q.id ? "Cancel" : "Answer"}
                                </button>
                                {q.answers.length > 0 && (
                                  <button
                                    onClick={() => toggleQAExpand(q.id)}
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                  >
                                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    {q.answers.length} answer{q.answers.length > 1 ? "s" : ""}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          {showAnswerForm === q.id && isAuthenticated && (
                            <div className="mt-3 ml-12 flex gap-2">
                              <input
                                value={qaAnswers[q.id] || ""}
                                onChange={e => setQaAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                                placeholder={user?.role === "seller" ? "Reply as seller..." : "Share your answer..."}
                                className="input-field flex-1 text-sm"
                                onKeyDown={e => e.key === "Enter" && handleQAAnswer(q.id)}
                              />
                              <button onClick={() => handleQAAnswer(q.id)} className="btn-primary py-2 px-3 text-sm">
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        {isExpanded && q.answers.length > 0 && (
                          <div className="border-t border-border bg-muted/30">
                            {q.answers.map((a, ai) => {
                              const userVotedA = user && a.helpfulVotes.includes(user.id);
                              return (
                                <div key={a.id} className={`p-4 ${ai < q.answers.length - 1 ? "border-b border-border" : ""}`}>
                                  <div className="flex items-start gap-3">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.userName}`} alt="" className="w-8 h-8 rounded-full border border-border shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="font-semibold text-sm">{a.userName}</span>
                                        {a.isSellerReply && (
                                          <span className="badge bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 flex items-center gap-1">
                                            <Award className="w-3 h-3" /> Seller
                                          </span>
                                        )}
                                        <span className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("en-IN")}</span>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{a.text}</p>
                                      <button
                                        onClick={() => user && voteAnswer(q.id, a.id, user.id)}
                                        className={`mt-2 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                                          userVotedA ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                                        }`}
                                      >
                                        <ThumbsUp className="w-3 h-3" /> Helpful ({a.helpfulVotes.length})
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {!isExpanded && q.answers.length > 0 && (
                          <button
                            onClick={() => toggleQAExpand(q.id)}
                            className="w-full py-2 text-xs text-primary border-t border-border hover:bg-muted/50 transition-colors flex items-center justify-center gap-1"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                            View {q.answers.length} answer{q.answers.length > 1 ? "s" : ""}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
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
