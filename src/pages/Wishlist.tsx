import { useState } from "react";
import { Heart, ShoppingCart, Share2, Link2, Twitter, Facebook, X, Copy, Check, Gift } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate a unique shareable URL based on user ID + product IDs
  const shareId = user ? btoa(`${user.id}-${items.map(i => i.productId).join(",")}`).replace(/=/g, "").slice(0, 16) : "";
  const shareUrl = `${window.location.origin}/wishlist/shared/${shareId}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    toast.success("Wishlist link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Check out my carpet wishlist on CarpetShop! ${shareUrl}`);
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${text}`,
    };
    window.open(urls[platform], "_blank", "noopener,noreferrer");
    toast.success(`Sharing to ${platform}!`);
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-heading text-2xl mb-4">Please Login First</h2>
          <Link to="/login" className="btn-primary">Login Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition pt-16">
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">My Wishlist ({items.length})</h1>
          {items.length > 0 && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 btn-secondary text-sm py-2"
            >
              <Share2 className="w-4 h-4" /> Share Wishlist
            </button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowShareModal(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold flex items-center gap-2"><Gift className="w-5 h-5 text-primary" /> Share Your Wishlist</h2>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Share your carpet wishlist as a gift hint! Anyone with this link can view your saved carpets.</p>

            {/* Preview */}
            <div className="bg-muted rounded-xl p-3 mb-4">
              <p className="text-xs font-medium mb-2">Wishlist Preview ({items.length} items):</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {items.slice(0, 5).map(item => (
                  <img key={item.productId} src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-border" />
                ))}
                {items.length > 5 && (
                  <div className="w-12 h-12 rounded-lg bg-muted-foreground/20 flex items-center justify-center text-xs font-bold shrink-0">+{items.length - 5}</div>
                )}
              </div>
            </div>

            {/* Shareable link */}
            <div className="mb-5">
              <label className="text-sm font-medium mb-2 block">Shareable Link</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-muted rounded-xl px-3 py-2.5 text-xs text-muted-foreground font-mono truncate border border-border">
                  {shareUrl}
                </div>
                <button onClick={handleCopy} className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all ${
                  copied ? "bg-green-500 text-white" : "bg-primary text-white hover:bg-primary/90"
                }`}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Social sharing */}
            <div>
              <p className="text-sm font-medium mb-3">Share via</p>
              <div className="grid grid-cols-3 gap-3">
                <button onClick={() => handleSocialShare("whatsapp")} className="flex flex-col items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">W</span>
                  </div>
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">WhatsApp</span>
                </button>
                <button onClick={() => handleSocialShare("twitter")} className="flex flex-col items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                    <Twitter className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Twitter/X</span>
                </button>
                <button onClick={() => handleSocialShare("facebook")} className="flex flex-col items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">Facebook</span>
                </button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Link2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                Anyone with this link can view (but not edit) your wishlist. Your personal details are never shared.
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="font-heading text-3xl font-bold mb-3">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-8">Save carpets you love for later!</p>
            <Link to="/shop" className="btn-primary">Start Exploring</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => (
              <div key={item.productId} className="bg-card border border-border rounded-2xl overflow-hidden card-hover">
                <div className="relative h-48 overflow-hidden">
                  <Link to={`/product/${item.productId}`}>
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <button onClick={() => { removeItem(item.productId); toast.success("Removed from wishlist"); }} className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <Link to={`/product/${item.productId}`}>
                    <h3 className="font-heading font-semibold hover:text-primary transition-colors line-clamp-1">{item.product.name}</h3>
                  </Link>
                  <p className="text-primary font-bold mt-1">₹{item.product.price.toLocaleString("en-IN")}</p>
                  <button
                    onClick={() => { addItem(item.product, item.product.sizes[0], item.product.colors[0]); toast.success("Added to cart!"); }}
                    className="btn-primary w-full justify-center mt-3 text-sm py-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
