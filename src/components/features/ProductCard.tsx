import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye, Zap, BarChart2, Check, Bell, BellOff } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { useCompareStore } from "@/stores/compareStore";
import { useAlertStore } from "@/stores/alertStore";
import type { Product } from "@/types";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [hovered, setHovered] = useState(false);
  const { addItem, isInCart } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    addItem(product, product.sizes[0], product.colors[0]);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    toggleWishlist(product);
    toast.success(isWishlisted(product.id) ? "Removed from wishlist" : "Added to wishlist!");
  };

  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare } = useCompareStore();
  const { addPriceAlert, removePriceAlert, hasAlert, getAlert } = useAlertStore();
  const wishListed = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const inCompare = isInCompare(product.id);
  const hasActiveAlert = hasAlert(product.id);

  const handleAlert = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate("/login"); return; }
    if (hasActiveAlert) {
      const alert = getAlert(product.id);
      if (alert) removePriceAlert(alert.id);
      toast.success("Price alert removed");
    } else {
      addPriceAlert({
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        targetPrice: Math.round(product.price * 0.9),
        currentPrice: product.price,
      });
      toast.success("Price alert set! We'll notify you when price drops.");
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inCompare) {
      removeFromCompare(product.id);
      toast.success("Removed from comparison");
    } else {
      const added = addToCompare(product);
      if (!added) toast.error("You can compare up to 3 products at a time");
      else toast.success(`${product.name} added to compare!`);
    }
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        className="bg-card rounded-2xl overflow-hidden border border-border card-hover"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-56">
          <img
            src={product.images[hovered && product.images.length > 1 ? 1 : 0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge bg-green-500 text-white px-2 py-0.5">New</span>
            )}
            {product.isBestSeller && (
              <span className="badge bg-carpet-brown text-white px-2 py-0.5">Best Seller</span>
            )}
            {product.discount && (
              <span className="badge bg-red-500 text-white px-2 py-0.5">-{product.discount}%</span>
            )}
          </div>

          {/* Action buttons */}
          {/* Alert badge */}
          {hasActiveAlert && (
            <div className="absolute top-3 left-3 bottom-auto z-10">
              <div className="mt-auto" />
            </div>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                wishListed ? "bg-red-500 text-white" : "bg-white/90 text-gray-600"
              }`}
            >
              <Heart className={`w-4 h-4 ${wishListed ? "fill-current" : ""}`} />
            </button>
            <Link
              to={`/product/${product.id}`}
              onClick={e => e.stopPropagation()}
              className="w-9 h-9 rounded-full bg-white/90 text-gray-600 flex items-center justify-center shadow-md hover:scale-110 transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={handleCompare}
              title={inCompare ? "Remove from compare" : "Add to compare"}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                inCompare ? "bg-primary text-white" : "bg-white/90 text-gray-600"
              }`}
            >
              {inCompare ? <Check className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleAlert}
              title={hasActiveAlert ? "Remove price alert" : "Set price drop alert"}
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
                hasActiveAlert ? "bg-amber-500 text-white" : "bg-white/90 text-gray-600"
              }`}
            >
              {hasActiveAlert ? <Bell className="w-4 h-4 fill-current" /> : <Bell className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick add overlay */}
          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-all duration-300 ${hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
            <button
              onClick={handleCart}
              className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                inCart ? "bg-green-500 text-white" : "bg-white text-carpet-dark hover:bg-carpet-brown hover:text-white"
              }`}
            >
              {inCart ? <><Zap className="w-4 h-4" /> In Cart</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2">{product.material}</p>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="price-tag text-lg">₹{product.price.toLocaleString("en-IN")}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through ml-2">₹{product.originalPrice.toLocaleString("en-IN")}</span>
              )}
              {hasActiveAlert && (
                <span className="ml-1.5 inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  <Bell className="w-2.5 h-2.5 fill-current" /> Alert
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {product.colors.slice(0, 3).map(color => (
                <div
                  key={color}
                  title={color}
                  className="w-4 h-4 rounded-full border border-border"
                  style={{ backgroundColor: color.toLowerCase().replace(" ", "") }}
                />
              ))}
              {product.colors.length > 3 && <span className="text-xs text-muted-foreground">+{product.colors.length - 3}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
