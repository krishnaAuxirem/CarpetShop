import { useEffect } from "react";
import { PRODUCTS, CATEGORIES } from "@/constants/data";

// Print-optimized catalog page - auto-triggers print on mount
export const CatalogPDF = () => {
  useEffect(() => {
    // Small delay to let images load
    const t = setTimeout(() => window.print(), 800);
    return () => clearTimeout(t);
  }, []);

  const publishedProducts = PRODUCTS.slice(0, 24);

  return (
    <div className="catalog-pdf bg-white min-h-screen">
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { page-break-after: always; }
          .avoid-break { page-break-inside: avoid; }
        }
        @page { margin: 0.6in; size: A4; }
        body { font-family: Georgia, serif; }
        .catalog-pdf * { box-sizing: border-box; }
      `}</style>

      {/* Close button (hidden on print) */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-3">
        <button onClick={() => window.print()} className="px-4 py-2 bg-[#8B4513] text-white rounded-lg text-sm font-medium shadow-lg hover:bg-[#7a3b10]">
          🖨️ Print / Save PDF
        </button>
        <button onClick={() => window.close()} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium shadow-lg hover:bg-gray-700">
          ✕ Close
        </button>
      </div>

      {/* Cover Page */}
      <div className="page-break avoid-break" style={{ backgroundColor: "#3E2723", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 40px" }}>
        {/* Logo area */}
        <div style={{ width: 80, height: 80, backgroundColor: "#D4AF37", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <span style={{ color: "#3E2723", fontSize: 40, fontWeight: 900, fontFamily: "serif" }}>C</span>
        </div>

        <h1 style={{ color: "#F5F5DC", fontSize: 48, fontWeight: 900, letterSpacing: 2, textAlign: "center", margin: "0 0 8px 0", fontFamily: "Georgia, serif" }}>
          CarpetShop
        </h1>
        <p style={{ color: "#D4AF37", fontSize: 16, letterSpacing: 4, textTransform: "uppercase", margin: "0 0 48px 0" }}>
          Premium Carpets & Rugs
        </p>

        <div style={{ width: 60, height: 2, backgroundColor: "#D4AF37", margin: "0 0 48px 0" }} />

        <h2 style={{ color: "#F5F5DC", fontSize: 28, fontWeight: 400, textAlign: "center", margin: "0 0 16px 0", fontStyle: "italic" }}>
          Product Catalog {new Date().getFullYear()}
        </h2>
        <p style={{ color: "#F5F5DC99", fontSize: 14, textAlign: "center", maxWidth: 400, lineHeight: 1.7 }}>
          Curated collection of handcrafted carpets from master weavers across India. Each piece tells a story of tradition, artistry, and uncompromising quality.
        </p>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 32, marginTop: 64 }}>
          {[
            { value: `${PRODUCTS.length}+`, label: "Products" },
            { value: `${CATEGORIES.length}`, label: "Categories" },
            { value: "100%", label: "Authentic" },
            { value: "5★", label: "Avg Rating" },
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <p style={{ color: "#D4AF37", fontSize: 24, fontWeight: 900, margin: 0 }}>{value}</p>
              <p style={{ color: "#F5F5DC80", fontSize: 11, margin: "2px 0 0 0", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", bottom: 32, color: "#F5F5DC40", fontSize: 11 }}>
          Printed {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · carpetshop.in
        </div>
      </div>

      {/* Categories Overview */}
      <div className="page-break avoid-break" style={{ padding: "48px 40px" }}>
        <div style={{ borderBottom: "3px solid #8B4513", paddingBottom: 12, marginBottom: 32 }}>
          <h2 style={{ color: "#3E2723", fontSize: 28, fontWeight: 900, margin: 0, fontFamily: "Georgia, serif" }}>Our Collections</h2>
          <p style={{ color: "#8B7355", fontSize: 13, margin: "4px 0 0 0" }}>Browse by carpet style and room type</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="avoid-break" style={{ border: "1px solid #E5E0D8", borderRadius: 12, overflow: "hidden" }}>
              <img src={cat.image} alt={cat.name} style={{ width: "100%", height: 120, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "12px 14px", backgroundColor: "#FAFAF8" }}>
                <p style={{ color: "#3E2723", fontWeight: 700, fontSize: 14, margin: "0 0 2px 0" }}>{cat.name}</p>
                <p style={{ color: "#8B7355", fontSize: 11, margin: 0 }}>{cat.productCount} products · {cat.description?.slice(0, 50)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid — 4 per page */}
      {Array.from({ length: Math.ceil(publishedProducts.length / 6) }).map((_, pageIdx) => {
        const pageProducts = publishedProducts.slice(pageIdx * 6, (pageIdx + 1) * 6);
        return (
          <div key={pageIdx} className="page-break avoid-break" style={{ padding: "40px" }}>
            <div style={{ borderBottom: "2px solid #D4AF37", paddingBottom: 8, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ color: "#3E2723", fontSize: 16, fontWeight: 700, margin: 0 }}>
                Product Catalog — Page {pageIdx + 2}
              </h3>
              <p style={{ color: "#8B7355", fontSize: 11, margin: 0 }}>
                Items {pageIdx * 6 + 1}–{Math.min((pageIdx + 1) * 6, publishedProducts.length)} of {publishedProducts.length}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {pageProducts.map(product => (
                <div key={product.id} className="avoid-break" style={{ border: "1px solid #E5E0D8", borderRadius: 10, overflow: "hidden", backgroundColor: "#FAFAF8" }}>
                  <div style={{ position: "relative" }}>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{ width: "100%", height: 130, objectFit: "cover", display: "block" }}
                    />
                    {product.discount && (
                      <div style={{ position: "absolute", top: 8, left: 8, backgroundColor: "#DC2626", color: "white", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                        -{product.discount}%
                      </div>
                    )}
                    {product.isBestSeller && (
                      <div style={{ position: "absolute", top: 8, right: 8, backgroundColor: "#8B4513", color: "white", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                        BEST SELLER
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ color: "#8B4513", fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 3px 0" }}>
                      {product.category}
                    </p>
                    <p style={{ color: "#3E2723", fontSize: 12, fontWeight: 700, margin: "0 0 4px 0", lineHeight: 1.3 }}>
                      {product.name}
                    </p>
                    <p style={{ color: "#6B5740", fontSize: 10, margin: "0 0 6px 0" }}>
                      {product.material} · Stock: {product.stock}
                    </p>
                    {/* Sizes */}
                    <p style={{ color: "#8B7355", fontSize: 9, margin: "0 0 6px 0" }}>
                      Sizes: {product.sizes.slice(0, 3).join(", ")}{product.sizes.length > 3 ? " +" + (product.sizes.length - 3) + " more" : ""}
                    </p>
                    {/* Rating */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 1 }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <span key={s} style={{ color: s <= Math.round(product.rating) ? "#F59E0B" : "#D1D5DB", fontSize: 10 }}>★</span>
                        ))}
                      </div>
                      <span style={{ fontSize: 9, color: "#8B7355" }}>({product.reviewCount})</span>
                    </div>
                    {/* Price */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <p style={{ color: "#8B4513", fontWeight: 900, fontSize: 15, margin: 0 }}>
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      {product.originalPrice && (
                        <p style={{ color: "#9CA3AF", fontSize: 10, textDecoration: "line-through", margin: 0 }}>
                          ₹{product.originalPrice.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bulk Pricing Page */}
      <div className="page-break avoid-break" style={{ padding: "48px 40px" }}>
        <div style={{ borderBottom: "3px solid #8B4513", paddingBottom: 12, marginBottom: 32 }}>
          <h2 style={{ color: "#3E2723", fontSize: 28, fontWeight: 900, margin: 0, fontFamily: "Georgia, serif" }}>Bulk & Corporate Pricing</h2>
          <p style={{ color: "#8B7355", fontSize: 13, margin: "4px 0 0 0" }}>Special discounts for businesses, hotels & interior designers</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { qty: "5–10 units", discount: 10, label: "Starter Bulk", color: "#EFF6FF", border: "#BFDBFE" },
            { qty: "11–25 units", discount: 18, label: "Business Pack", color: "#FFFBEB", border: "#FDE68A" },
            { qty: "26–50 units", discount: 25, label: "Corporate", color: "#F0FDF4", border: "#BBF7D0" },
            { qty: "51–100 units", discount: 32, label: "Enterprise", color: "#FAF5FF", border: "#DDD6FE" },
            { qty: "100+ units", discount: 40, label: "Wholesale", color: "#FFF7ED", border: "#FED7AA" },
          ].map(tier => (
            <div key={tier.label} style={{ backgroundColor: tier.color, border: `2px solid ${tier.border}`, borderRadius: 12, padding: "16px 12px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", margin: "0 0 4px 0", textTransform: "uppercase" }}>{tier.label}</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: "#8B4513", margin: "0 0 4px 0" }}>{tier.discount}%</p>
              <p style={{ fontSize: 10, color: "#374151", margin: 0, fontWeight: 600 }}>OFF</p>
              <p style={{ fontSize: 9, color: "#6B7280", margin: "6px 0 0 0" }}>{tier.qty}</p>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: "#F5F5DC", border: "2px solid #D4AF37", borderRadius: 16, padding: "24px 28px", marginBottom: 24 }}>
          <h3 style={{ color: "#3E2723", fontWeight: 800, margin: "0 0 16px 0", fontSize: 16 }}>All Bulk Orders Include:</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {[
              "Free shipping across India on all bulk orders",
              "Dedicated account manager assigned to your order",
              "GST-compliant invoicing with GSTIN support",
              "Custom packaging and branding options",
              "Priority production queue for large orders",
              "Pre-shipment quality inspection certification",
              "Flexible payment terms for corporate clients",
              "Free installation advisory for hotel/office projects",
            ].map(item => (
              <div key={item} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#16A34A", fontWeight: 900, fontSize: 13, lineHeight: 1.5 }}>✓</span>
                <p style={{ color: "#3E2723", fontSize: 11, margin: 0, lineHeight: 1.5 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "Phone", value: "+91 1800 123 4567", note: "Mon–Sat 9am–6pm IST" },
            { label: "Email", value: "bulk@carpetshop.in", note: "Response within 2 hours" },
            { label: "WhatsApp", value: "+91 98765 00000", note: "Instant quotes via chat" },
          ].map(c => (
            <div key={c.label} style={{ border: "1px solid #E5E0D8", borderRadius: 10, padding: "14px 16px", backgroundColor: "#FAFAF8" }}>
              <p style={{ color: "#8B7355", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 4px 0" }}>{c.label}</p>
              <p style={{ color: "#8B4513", fontWeight: 700, fontSize: 13, margin: "0 0 2px 0" }}>{c.value}</p>
              <p style={{ color: "#9CA3AF", fontSize: 10, margin: 0 }}>{c.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Back Cover */}
      <div className="avoid-break" style={{ backgroundColor: "#3E2723", minHeight: "50vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 40px", textAlign: "center" }}>
        <h2 style={{ color: "#F5F5DC", fontSize: 28, fontWeight: 900, margin: "0 0 12px 0", fontFamily: "Georgia, serif" }}>Begin Your Journey</h2>
        <p style={{ color: "#F5F5DC80", fontSize: 14, maxWidth: 380, lineHeight: 1.7, margin: "0 0 32px 0" }}>
          Every carpet in this catalog is handcrafted by skilled artisans who have perfected their craft over generations. When you bring home a CarpetShop carpet, you bring home a piece of living art.
        </p>
        <div style={{ width: 60, height: 2, backgroundColor: "#D4AF37", margin: "0 0 32px 0" }} />
        <p style={{ color: "#D4AF37", fontWeight: 700, margin: "0 0 6px 0", fontSize: 16 }}>www.carpetshop.in</p>
        <p style={{ color: "#F5F5DC60", fontSize: 12, margin: 0 }}>GST No. 22AAAAA0000A1Z5 · CIN: U52399MH2020PTC000000</p>
        <p style={{ color: "#F5F5DC40", fontSize: 10, marginTop: 32 }}>
          Prices are indicative and subject to change. All products carry a 1-year workmanship warranty. E&OE.
        </p>
      </div>
    </div>
  );
};
