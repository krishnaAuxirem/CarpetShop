import { Heart, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

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
        <div className="max-w-7xl mx-auto px-4 py-5">
          <h1 className="font-heading text-2xl font-bold">My Wishlist ({items.length})</h1>
        </div>
      </div>
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
