import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrderStore } from "@/stores/orderStore";

export const InvoicePage = () => {
  const { id } = useParams<{ id: string }>();
  const { orders } = useOrderStore();
  const order = orders.find(o => o.id === id);

  useEffect(() => {
    if (order) {
      const t = setTimeout(() => window.print(), 600);
      return () => clearTimeout(t);
    }
  }, [order]);

  if (!order) {
    return (
      <div style={{ fontFamily: "Georgia, serif", padding: 40, textAlign: "center", color: "#3E2723" }}>
        <h2>Invoice Not Found</h2>
        <p>Order ID: {id}</p>
        <button onClick={() => window.close()} style={{ marginTop: 16, padding: "8px 20px", background: "#8B4513", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Close</button>
      </div>
    );
  }

  const subtotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const gstRate = 0.12;
  const gstAmount = Math.round(subtotal * gstRate / (1 + gstRate));
  const preGstSubtotal = subtotal - gstAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;
  const shipping = order.totalAmount - subtotal > 0 ? order.totalAmount - subtotal : 0;

  const invoiceNo = `INV-${order.id.replace("ORD-", "")}`;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div style={{ fontFamily: "Georgia, serif", background: "#fff", minHeight: "100vh", padding: 0 }}>
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { page-break-after: always; }
        }
        @page { margin: 0.6in; size: A4; }
        * { box-sizing: border-box; }
        table { border-collapse: collapse; width: 100%; }
        th, td { text-align: left; padding: 8px 10px; }
      `}</style>

      {/* No-print toolbar */}
      <div className="no-print" style={{ position: "fixed", top: 16, right: 16, zIndex: 50, display: "flex", gap: 10 }}>
        <button onClick={() => window.print()} style={{ background: "#8B4513", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>
          🖨️ Print / Save PDF
        </button>
        <button onClick={() => window.close()} style={{ background: "#6B7280", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontFamily: "sans-serif", fontSize: 13 }}>
          ✕ Close
        </button>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 40px 60px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #8B4513", paddingBottom: 20, marginBottom: 28 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <div style={{ width: 44, height: 44, background: "#3E2723", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#D4AF37", fontSize: 26, fontWeight: 900 }}>C</span>
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: "#3E2723", letterSpacing: 1 }}>CarpetShop</h1>
                <p style={{ margin: 0, fontSize: 10, color: "#8B7355", letterSpacing: 2, textTransform: "uppercase" }}>Premium Carpets & Rugs</p>
              </div>
            </div>
            <p style={{ margin: "8px 0 2px", fontSize: 11, color: "#6B7280" }}>GSTIN: 22AAAAA0000A1Z5</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>CIN: U52399MH2020PTC000000</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>carpetshop.in · info@carpetshop.in · +91 12345 67890</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>123, Craft Nagar, Jaipur, Rajasthan – 302001</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: "#3E2723", color: "#D4AF37", padding: "6px 18px", borderRadius: 8, display: "inline-block", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>TAX INVOICE</span>
            </div>
            <table style={{ width: "auto", marginLeft: "auto" }}>
              <tbody>
                {[
                  ["Invoice No.", invoiceNo],
                  ["Invoice Date", invoiceDate],
                  ["Order ID", order.id],
                  ["Tracking No.", order.trackingNumber],
                ].map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ fontSize: 11, color: "#9CA3AF", padding: "2px 8px 2px 0", whiteSpace: "nowrap" }}>{k}</td>
                    <td style={{ fontSize: 11, color: "#3E2723", fontWeight: 700, padding: "2px 0", whiteSpace: "nowrap" }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#8B4513", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Bill To</p>
            <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: "#111827" }}>{order.shippingAddress.name}</p>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#6B7280" }}>{order.shippingAddress.line1}</p>
            {order.shippingAddress.line2 && <p style={{ margin: "0 0 2px", fontSize: 11, color: "#6B7280" }}>{order.shippingAddress.line2}</p>}
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#6B7280" }}>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>PIN: {order.shippingAddress.pincode}</p>
            {order.shippingAddress.phone && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#6B7280" }}>Ph: {order.shippingAddress.phone}</p>}
          </div>
          <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#8B4513", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 8px" }}>Ship To</p>
            <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: "#111827" }}>{order.shippingAddress.name}</p>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#6B7280" }}>{order.shippingAddress.line1}</p>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: "#6B7280" }}>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
              <p style={{ margin: "0 0 2px", fontSize: 11, color: "#6B7280" }}>Payment: <strong style={{ color: "#111827" }}>{order.paymentMethod.replace(/_/g, " ").toUpperCase()}</strong></p>
              <p style={{ margin: 0, fontSize: 11, color: "#6B7280" }}>Est. Delivery: <strong style={{ color: "#111827" }}>{new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong></p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ marginBottom: 24 }}>
          <table style={{ width: "100%", borderRadius: 10, overflow: "hidden", border: "1px solid #E5E7EB" }}>
            <thead>
              <tr style={{ background: "#3E2723", color: "#F5F5DC" }}>
                <th style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, width: 32 }}>#</th>
                <th style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Product Description</th>
                <th style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", width: 60 }}>Qty</th>
                <th style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, textAlign: "right", width: 100 }}>Unit Price</th>
                <th style={{ padding: "10px 12px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, textAlign: "right", width: 100 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#FAFAF8" : "#fff", borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 12px", fontSize: 12, color: "#6B7280", textAlign: "center" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#111827" }}>{item.product.name}</p>
                    <p style={{ margin: 0, fontSize: 10, color: "#9CA3AF" }}>
                      {item.product.category} · {item.product.material} · Size: {item.selectedSize} · Color: {item.selectedColor}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 10, color: "#8B4513" }}>HSN: 5702 | GST: 12%</p>
                  </td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#111827", textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, color: "#111827", textAlign: "right" }}>₹{item.unitPrice.toLocaleString("en-IN")}</td>
                  <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 700, color: "#8B4513", textAlign: "right" }}>₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 28 }}>
          <div style={{ width: 280 }}>
            <table style={{ width: "100%" }}>
              <tbody>
                {[
                  { label: "Subtotal (ex-GST)", value: `₹${preGstSubtotal.toLocaleString("en-IN")}`, bold: false },
                  { label: "CGST @ 6%", value: `₹${cgst.toLocaleString("en-IN")}`, bold: false },
                  { label: "SGST @ 6%", value: `₹${sgst.toLocaleString("en-IN")}`, bold: false },
                  ...(shipping > 0 ? [{ label: "Shipping & Handling", value: `₹${shipping.toLocaleString("en-IN")}`, bold: false }] : []),
                  ...(order.discount ? [{ label: "Discount / Coupon", value: `-₹${order.discount.toLocaleString("en-IN")}`, bold: false }] : []),
                ].map(({ label, value, bold }) => (
                  <tr key={label}>
                    <td style={{ padding: "4px 0", fontSize: 12, color: bold ? "#111827" : "#6B7280", fontWeight: bold ? 700 : 400 }}>{label}</td>
                    <td style={{ padding: "4px 0", fontSize: 12, color: bold ? "#8B4513" : "#111827", fontWeight: bold ? 900 : 500, textAlign: "right" }}>{value}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} style={{ padding: 0 }}>
                    <div style={{ height: 1, background: "#8B4513", margin: "8px 0" }} />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "6px 0", fontSize: 15, color: "#111827", fontWeight: 900 }}>Grand Total</td>
                  <td style={{ padding: "6px 0", fontSize: 17, color: "#8B4513", fontWeight: 900, textAlign: "right" }}>₹{order.totalAmount.toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td colSpan={2}>
                    <p style={{ margin: "4px 0 0", fontSize: 10, color: "#9CA3AF", textAlign: "right" }}>
                      Amount in words: <em>{numberToWords(order.totalAmount)} Rupees Only</em>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Status */}
        <div style={{ background: order.paymentStatus === "paid" ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${order.paymentStatus === "paid" ? "#BBF7D0" : "#FECACA"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: order.paymentStatus === "paid" ? "#10B981" : "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>
            {order.paymentStatus === "paid" ? "✓" : "!"}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: order.paymentStatus === "paid" ? "#065F46" : "#991B1B" }}>
              Payment {order.paymentStatus === "paid" ? "Received" : "Pending"}
            </p>
            <p style={{ margin: 0, fontSize: 11, color: order.paymentStatus === "paid" ? "#047857" : "#DC2626" }}>
              Mode: {order.paymentMethod.replace(/_/g, " ").toUpperCase()} · Date: {invoiceDate}
            </p>
          </div>
        </div>

        {/* Terms */}
        <div style={{ borderTop: "2px solid #E5E7EB", paddingTop: 16, marginBottom: 20 }}>
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#3E2723" }}>Terms & Conditions</p>
          <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 10, color: "#6B7280", lineHeight: 1.7 }}>
            <li>All carpets carry a 1-year workmanship warranty against manufacturing defects.</li>
            <li>Returns accepted within 7 days of delivery in original, unused condition.</li>
            <li>This is a computer-generated invoice and does not require a physical signature.</li>
            <li>Disputes, if any, are subject to jurisdiction of courts in Jaipur, Rajasthan.</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ background: "#3E2723", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, color: "#D4AF37", fontWeight: 700, fontSize: 13 }}>CarpetShop — Premium Carpets & Rugs</p>
            <p style={{ margin: "2px 0 0", color: "#F5F5DC60", fontSize: 10 }}>Thank you for shopping with us!</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "#F5F5DC80", fontSize: 10 }}>www.carpetshop.in</p>
            <p style={{ margin: "2px 0 0", color: "#F5F5DC60", fontSize: 10 }}>Invoice #{invoiceNo} | Order #{order.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple number to words for invoice amount
function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const convert = (n: number): string => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  };
  return convert(Math.floor(num));
}
