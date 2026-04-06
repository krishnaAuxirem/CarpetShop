import { Link } from "react-router-dom";
import { X, BarChart2 } from "lucide-react";
import { useCompareStore } from "@/stores/compareStore";

export const CompareBar = () => {
  const { items, removeItem, clearAll } = useCompareStore();
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <BarChart2 className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm hidden sm:block">Compare ({items.length}/3)</span>
        </div>

        <div className="flex-1 flex items-center gap-3 overflow-x-auto min-w-0">
          {items.map(product => (
            <div key={product.id} className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 shrink-0">
              <img src={product.images[0]} alt={product.name} className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs font-medium max-w-[100px] truncate hidden sm:block">{product.name}</span>
              <button
                onClick={() => removeItem(product.id)}
                className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div key={i} className="w-12 h-12 border-2 border-dashed border-border rounded-xl shrink-0 flex items-center justify-center text-muted-foreground text-xs">
              +
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          >
            Clear
          </button>
          <Link
            to="/compare"
            className={`btn-primary text-sm py-2 px-4 ${items.length < 2 ? "opacity-60 pointer-events-none" : ""}`}
          >
            <BarChart2 className="w-4 h-4" />
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
};
