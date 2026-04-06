import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search, SlidersHorizontal, X, Grid, List, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/features/ProductCard";
import { useProductStore } from "@/stores/productStore";
import { CATEGORIES, MATERIALS, CARPET_COLORS } from "@/constants/data";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest First" },
  { value: "bestseller", label: "Best Sellers" },
];

export const Shop = () => {
  const { products } = useProductStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [sort, setSort] = useState(searchParams.get("sort") || "default");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    const cat = searchParams.get("category") || "";
    const q = searchParams.get("q") || "";
    setCategory(cat);
    setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter(p => p.category === category);
    if (selectedColors.length) list = list.filter(p => p.colors.some(c => selectedColors.includes(c)));
    if (selectedMaterials.length) list = list.filter(p => selectedMaterials.includes(p.material));
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sort === "bestseller") list = list.filter(p => p.isBestSeller).concat(list.filter(p => !p.isBestSeller));
    return list;
  }, [products, search, category, selectedColors, selectedMaterials, priceRange, sort]);

  const paginated = filtered.slice(0, page * PER_PAGE);
  const hasMore = filtered.length > paginated.length;

  const toggleColor = (color: string) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const toggleMaterial = (m: string) => setSelectedMaterials(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  const clearFilters = () => { setSearch(""); setCategory(""); setSelectedColors([]); setSelectedMaterials([]); setPriceRange([0, 200000]); setSort("default"); };
  const hasActiveFilters = search || category || selectedColors.length || selectedMaterials.length || priceRange[0] > 0 || priceRange[1] < 200000;

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80" alt="Shop" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Our Collection</h1>
          <p className="text-white/80">Explore {products.length}+ premium carpets & rugs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search carpets, rugs, materials..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border font-medium text-sm transition-colors ${showFilters ? "bg-primary text-white border-primary" : "hover:bg-muted"}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            <select value={sort} onChange={e => setSort(e.target.value)} className="input-field py-2.5 pr-8 appearance-none cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button onClick={() => setView("grid")} className={`px-3 py-2 ${view === "grid" ? "bg-primary text-white" : "hover:bg-muted"}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setView("list")} className={`px-3 py-2 ${view === "list" ? "bg-primary text-white" : "hover:bg-muted"}`}><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <button onClick={() => { setCategory(""); setPage(1); }} className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!category ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>
            All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setCategory(cat.name); setPage(1); }} className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${category === cat.name ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-primary/10"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-64 shrink-0 animate-slide-in-left">
              <div className="bg-card border border-border rounded-2xl p-5 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold">Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-primary flex items-center gap-1">
                      <X className="w-3 h-3" /> Clear All
                    </button>
                  )}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input type="range" min={0} max={200000} step={1000} value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-primary" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹{priceRange[0].toLocaleString("en-IN")}</span>
                      <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Material */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm mb-3">Material</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {MATERIALS.map(m => (
                      <label key={m} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={selectedMaterials.includes(m)} onChange={() => { toggleMaterial(m); setPage(1); }}
                          className="w-4 h-4 accent-primary rounded" />
                        <span className="text-sm text-foreground">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div className="mb-6">
                  <h4 className="font-medium text-sm mb-3">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {CARPET_COLORS.slice(0, 16).map(color => (
                      <button key={color}
                        onClick={() => { toggleColor(color); setPage(1); }}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColors.includes(color) ? "border-primary scale-110" : "border-border"}`}
                        style={{ backgroundColor: color.toLowerCase().replace(" ", "") }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{paginated.length}</strong> of <strong className="text-foreground">{filtered.length}</strong> products
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-2xl">
                <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {paginated.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {hasMore && (
                  <div className="text-center mt-10">
                    <button onClick={() => setPage(p => p + 1)} className="btn-secondary">
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
