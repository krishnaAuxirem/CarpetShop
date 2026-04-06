import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, X, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { useProductStore } from "@/stores/productStore";
import type { Product } from "@/types";

const MAX_RECENT = 6;
const TRENDING = ["Persian Carpet", "Wool Rug", "Silk Carpet", "Runner", "Customization"];

interface LiveSearchProps {
  onClose?: () => void;
}

export const LiveSearch = ({ onClose }: LiveSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("carpet-recent-searches") || "[]"); } catch { return []; }
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { products } = useProductStore();

  const saveRecent = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem("carpet-recent-searches", JSON.stringify(updated));
  };

  const search = useCallback(
    (q: string) => {
      if (!q.trim()) { setResults([]); return; }
      const lower = q.toLowerCase();
      const filtered = products
        .filter(
          p =>
            p.name.toLowerCase().includes(lower) ||
            p.category.toLowerCase().includes(lower) ||
            p.material.toLowerCase().includes(lower) ||
            p.description.toLowerCase().includes(lower)
        )
        .slice(0, 6);
      setResults(filtered);
    },
    [products]
  );

  useEffect(() => {
    const t = setTimeout(() => search(query), 150);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (term: string) => {
    saveRecent(term);
    setIsOpen(false);
    setQuery("");
    onClose?.();
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  const handleProductSelect = (product: Product) => {
    saveRecent(product.name);
    setIsOpen(false);
    setQuery("");
    onClose?.();
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const total = results.length + (query ? 0 : recentSearches.length);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(i => Math.min(i + 1, total - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && results[focusedIndex]) {
        handleProductSelect(results[focusedIndex]);
      } else if (query.trim()) {
        handleSelect(query.trim());
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      onClose?.();
    }
  };

  const clearRecent = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem("carpet-recent-searches", JSON.stringify(updated));
  };

  const showDropdown = isOpen && (query.trim() || recentSearches.length > 0);

  return (
    <div className="relative w-full max-w-xl">
      {/* Search input */}
      <div className={`flex items-center gap-2 bg-muted/80 border rounded-xl px-3 py-2 transition-all ${isOpen ? "border-primary shadow-md bg-background" : "border-border"}`}>
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); setFocusedIndex(-1); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search carpets, rugs, materials..."
          className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-2xl z-[200] overflow-hidden animate-scale-in"
        >
          {/* No results */}
          {query.trim() && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results for "<strong>{query}</strong>"</p>
              <button onClick={() => handleSelect(query)} className="mt-3 text-xs text-primary hover:underline flex items-center gap-1 mx-auto">
                Search in shop <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Product results */}
          {results.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Products</p>
              </div>
              {results.map((product, i) => (
                <button
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left ${focusedIndex === i ? "bg-muted" : ""}`}
                >
                  <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {highlightMatch(product.name, query)}
                    </p>
                    <p className="text-xs text-muted-foreground">{product.category} · {product.material}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary shrink-0">₹{product.price.toLocaleString("en-IN")}</span>
                </button>
              ))}
              <div className="px-4 py-2 border-t border-border">
                <button onClick={() => handleSelect(query)} className="text-xs text-primary hover:underline flex items-center gap-1">
                  See all results for "{query}" <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Recent searches (only when no query) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div>
              <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Recent
                </p>
                <button
                  onClick={() => { setRecentSearches([]); localStorage.removeItem("carpet-recent-searches"); }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
              {recentSearches.map((term, i) => (
                <div key={term} className={`flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors ${focusedIndex === i ? "bg-muted" : ""}`}>
                  <button onClick={() => handleSelect(term)} className="flex-1 flex items-center gap-2 text-sm text-foreground text-left">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {term}
                  </button>
                  <button onClick={e => clearRecent(term, e)} className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Trending (only when no query and no results) */}
          {!query.trim() && (
            <div className="px-4 pt-2 pb-3 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3 h-3" /> Trending
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(term => (
                  <button
                    key={term}
                    onClick={() => handleSelect(term)}
                    className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-primary/20 text-primary rounded">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}
