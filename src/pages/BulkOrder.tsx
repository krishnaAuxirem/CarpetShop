import { useState } from "react";
import { Building2, Package, FileText, ChevronDown, ChevronUp, Check, Download, Send, Phone, Mail, Globe, Users, TrendingDown } from "lucide-react";
import { PRODUCTS, MATERIALS, CARPET_SIZES } from "@/constants/data";
import { toast } from "sonner";

const PRICING_TIERS = [
  { qty: "5–10 units", discount: 10, label: "Starter Bulk", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  { qty: "11–25 units", discount: 18, label: "Business Pack", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  { qty: "26–50 units", discount: 25, label: "Corporate Tier", color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
  { qty: "51–100 units", discount: 32, label: "Enterprise", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" },
  { qty: "100+ units", discount: 40, label: "Wholesale", color: "bg-primary/10 border-primary/30" },
];

const USE_CASES = [
  { icon: Building2, title: "Hotels & Resorts", desc: "Bulk orders for lobbies, corridors, and guest rooms" },
  { icon: Users, title: "Corporate Offices", desc: "Professional carpeting for workspaces and conference rooms" },
  { icon: Globe, title: "Real Estate Developers", desc: "Large-scale supply for residential projects" },
  { icon: Package, title: "Interior Designers", desc: "Trade pricing for design professionals" },
];

interface RFQForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  designation: string;
  gstin: string;
  address: string;
  productInterest: string;
  material: string;
  size: string;
  quantity: string;
  budget: string;
  timeline: string;
  requirements: string;
  heardFrom: string;
}

const emptyForm: RFQForm = {
  companyName: "", contactName: "", email: "", phone: "", designation: "",
  gstin: "", address: "", productInterest: "", material: "", size: "",
  quantity: "", budget: "", timeline: "", requirements: "", heardFrom: "",
};

export const BulkOrder = () => {
  const [form, setForm] = useState<RFQForm>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [expandedTier, setExpandedTier] = useState<number | null>(1);
  const [step, setStep] = useState<"info" | "requirements" | "review">("info");

  const setField = (k: keyof RFQForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName || !form.email || !form.quantity) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("RFQ submitted successfully! Our team will contact you within 24 hours.");
  };

  const generatePDF = () => {
    // Simulate PDF generation/download
    const content = PRODUCTS.map(p =>
      `${p.name} | ${p.category} | ${p.material} | MRP: ₹${p.price.toLocaleString("en-IN")}`
    ).join("\n");
    const blob = new Blob([
      `CarpetShop – Product Catalog\n${"=".repeat(50)}\n\n${content}\n\n` +
      `Bulk Pricing Tiers:\n${PRICING_TIERS.map(t => `${t.qty}: ${t.discount}% off`).join("\n")}\n\n` +
      `Contact: bulk@carpetshop.in | +91 1800 123 4567`
    ], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CarpetShop-Product-Catalog.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Product catalog downloaded!");
  };

  const estimatedDiscount = () => {
    const qty = parseInt(form.quantity) || 0;
    if (qty >= 100) return 40;
    if (qty >= 51) return 32;
    if (qty >= 26) return 25;
    if (qty >= 11) return 18;
    if (qty >= 5) return 10;
    return 0;
  };

  if (submitted) {
    return (
      <div className="page-transition pt-16 min-h-screen bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-3">RFQ Submitted Successfully!</h1>
          <p className="text-muted-foreground mb-6 text-lg">Thank you, <strong>{form.contactName || form.companyName}</strong>. Our business team will review your requirements and reach out within 24 hours.</p>
          <div className="bg-card border border-border rounded-2xl p-6 text-left mb-8 space-y-3">
            <h3 className="font-heading font-semibold">Your Request Summary</h3>
            {[
              ["Company", form.companyName],
              ["Contact", form.contactName],
              ["Email", form.email],
              ["Quantity Required", `${form.quantity} units`],
              ["Est. Discount", `${estimatedDiscount()}% off`],
              ["Product Interest", form.productInterest || "Multiple products"],
            ].map(([k, v]) => v && (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium text-foreground">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={generatePDF} className="btn-primary"><Download className="w-4 h-4" /> Download Catalog</button>
            <button onClick={() => { setSubmitted(false); setForm(emptyForm); setStep("info"); }} className="btn-secondary">Submit Another Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative min-h-[32vh] flex items-center justify-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80)`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50" />
        <div className="relative z-10 text-center text-white px-4 py-10">
          <span className="badge bg-accent text-accent-foreground mb-4 px-4 py-1.5 text-sm">For Businesses</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3">Bulk & Corporate Orders</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Premium carpets at wholesale prices. Request a quote for your hotel, office, or commercial project.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-2.5 text-center">
              <p className="font-heading font-bold text-2xl">Up to 40%</p>
              <p className="text-sm text-white/70">Bulk Discount</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-2.5 text-center">
              <p className="font-heading font-bold text-2xl">Free</p>
              <p className="text-sm text-white/70">Shipping on Bulk</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-2.5 text-center">
              <p className="font-heading font-bold text-2xl">24hr</p>
              <p className="text-sm text-white/70">Response Time</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Use Cases */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {USE_CASES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-5 text-center card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3"><Icon className="w-6 h-6 text-primary" /></div>
              <h3 className="font-heading font-semibold mb-1 text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pricing Tiers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold">Bulk Pricing Tiers</h2>
              <button onClick={generatePDF} className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium">
                <Download className="w-4 h-4" /> Catalog
              </button>
            </div>
            {PRICING_TIERS.map((tier, i) => (
              <div key={i} className={`border rounded-2xl overflow-hidden transition-all ${tier.color}`}>
                <button onClick={() => setExpandedTier(expandedTier === i ? null : i)} className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/50 dark:bg-black/20 rounded-xl flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-heading font-semibold text-sm">{tier.label}</p>
                      <p className="text-xs text-muted-foreground">{tier.qty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-primary text-lg">{tier.discount}% OFF</span>
                    {expandedTier === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>
                {expandedTier === i && (
                  <div className="px-4 pb-4 text-sm space-y-1.5">
                    {["Free shipping across India", "Dedicated account manager", "Custom branding on packaging", tier.discount >= 25 ? "Priority production queue" : null, tier.discount >= 32 ? "GST invoice included" : null, tier.discount >= 40 ? "Showroom visit & consultation" : null].filter(Boolean).map(b => (
                      <div key={b as string} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span className="text-muted-foreground">{b}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <h4 className="font-heading font-semibold flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> Direct Contact</h4>
              {[["Phone", "+91 1800 123 4567"], ["Email", "bulk@carpetshop.in"], ["WhatsApp", "+91 98765 00000"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium text-primary">{v}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-1">Mon–Sat 9:00 AM – 6:00 PM IST</p>
            </div>
          </div>

          {/* RFQ Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {/* Step indicator */}
              <div className="flex border-b border-border">
                {[["info", "Company Info"], ["requirements", "Requirements"], ["review", "Review & Submit"]].map(([s, label], i) => (
                  <button key={s} onClick={() => step !== "review" && setStep(s as any)} className={`flex-1 py-4 text-xs font-medium transition-colors ${step === s ? "text-primary border-b-2 border-primary bg-primary/5" : "text-muted-foreground"}`}>
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs mr-1.5 ${step === s ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{i + 1}</span>
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  {step === "info" && (
                    <>
                      <h3 className="font-heading font-semibold text-lg">Company Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Company Name *</label>
                          <input value={form.companyName} onChange={e => setField("companyName", e.target.value)} className="input-field" placeholder="Acme Hotels Pvt. Ltd." required />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Contact Person *</label>
                          <input value={form.contactName} onChange={e => setField("contactName", e.target.value)} className="input-field" placeholder="Rajesh Sharma" required />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
                          <input type="email" value={form.email} onChange={e => setField("email", e.target.value)} className="input-field" placeholder="rajesh@acmehotels.com" required />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Phone Number *</label>
                          <input value={form.phone} onChange={e => setField("phone", e.target.value)} className="input-field" placeholder="+91 XXXXX XXXXX" required />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Designation</label>
                          <input value={form.designation} onChange={e => setField("designation", e.target.value)} className="input-field" placeholder="Procurement Manager" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">GSTIN (Optional)</label>
                          <input value={form.gstin} onChange={e => setField("gstin", e.target.value)} className="input-field" placeholder="22AAAAA0000A1Z5" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Company Address</label>
                        <textarea value={form.address} onChange={e => setField("address", e.target.value)} className="input-field min-h-[80px] resize-none" placeholder="Full company address with PIN code" />
                      </div>
                      <button type="button" onClick={() => setStep("requirements")} className="btn-primary w-full justify-center">Next: Requirements</button>
                    </>
                  )}

                  {step === "requirements" && (
                    <>
                      <h3 className="font-heading font-semibold text-lg">Order Requirements</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Product of Interest</label>
                          <select value={form.productInterest} onChange={e => setField("productInterest", e.target.value)} className="input-field">
                            <option value="">Select a product</option>
                            {PRODUCTS.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                            <option value="Multiple">Multiple Products</option>
                            <option value="Custom">Custom Design</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Preferred Material</label>
                          <select value={form.material} onChange={e => setField("material", e.target.value)} className="input-field">
                            <option value="">Any material</option>
                            {MATERIALS.map(m => <option key={m}>{m}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Preferred Size</label>
                          <select value={form.size} onChange={e => setField("size", e.target.value)} className="input-field">
                            <option value="">Standard / Custom</option>
                            {CARPET_SIZES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Quantity Required *</label>
                          <input type="number" min="5" value={form.quantity} onChange={e => setField("quantity", e.target.value)} className="input-field" placeholder="Minimum 5 units" required />
                          {estimatedDiscount() > 0 && (
                            <p className="text-xs text-green-600 mt-1 font-medium">🎉 You qualify for {estimatedDiscount()}% bulk discount!</p>
                          )}
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Budget (₹)</label>
                          <select value={form.budget} onChange={e => setField("budget", e.target.value)} className="input-field">
                            <option value="">Select budget range</option>
                            {["Under ₹1 Lakh", "₹1–5 Lakh", "₹5–10 Lakh", "₹10–25 Lakh", "₹25 Lakh+"].map(b => <option key={b}>{b}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Timeline</label>
                          <select value={form.timeline} onChange={e => setField("timeline", e.target.value)} className="input-field">
                            <option value="">When do you need it?</option>
                            {["Within 2 weeks", "1 month", "2-3 months", "3-6 months", "Flexible"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Special Requirements</label>
                        <textarea value={form.requirements} onChange={e => setField("requirements", e.target.value)} className="input-field min-h-[100px] resize-none" placeholder="Custom sizes, specific colors, branding needs, installation services, etc." />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">How did you hear about us?</label>
                        <select value={form.heardFrom} onChange={e => setField("heardFrom", e.target.value)} className="input-field">
                          <option value="">Select</option>
                          {["Google Search", "Social Media", "Trade Fair", "Referral", "Print Advertisement", "Other"].map(h => <option key={h}>{h}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep("info")} className="btn-secondary flex-1 justify-center">Back</button>
                        <button type="button" onClick={() => setStep("review")} className="btn-primary flex-1 justify-center">Review Request</button>
                      </div>
                    </>
                  )}

                  {step === "review" && (
                    <>
                      <h3 className="font-heading font-semibold text-lg">Review Your RFQ</h3>
                      <div className="space-y-3 bg-muted rounded-2xl p-4">
                        {[
                          ["Company", form.companyName], ["Contact", form.contactName],
                          ["Email", form.email], ["Phone", form.phone],
                          ["GSTIN", form.gstin], ["Product Interest", form.productInterest],
                          ["Material", form.material], ["Size", form.size],
                          ["Quantity", `${form.quantity} units`], ["Budget", form.budget],
                          ["Timeline", form.timeline],
                        ].filter(([, v]) => v).map(([k, v]) => (
                          <div key={k as string} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{k}</span>
                            <span className="font-medium">{v}</span>
                          </div>
                        ))}
                        {estimatedDiscount() > 0 && (
                          <div className="flex justify-between text-sm pt-2 border-t border-border">
                            <span className="text-muted-foreground">Estimated Discount</span>
                            <span className="font-bold text-green-600">{estimatedDiscount()}% off</span>
                          </div>
                        )}
                      </div>
                      {form.requirements && (
                        <div className="bg-muted rounded-xl p-4">
                          <p className="text-xs text-muted-foreground mb-1">Special Requirements</p>
                          <p className="text-sm">{form.requirements}</p>
                        </div>
                      )}
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-xs text-amber-700 dark:text-amber-300">
                        By submitting this RFQ, you agree to be contacted by our sales team. All pricing is subject to final negotiation.
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep("requirements")} className="btn-secondary flex-1 justify-center">Back</button>
                        <button type="submit" className="btn-primary flex-1 justify-center"><Send className="w-4 h-4" /> Submit RFQ</button>
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
