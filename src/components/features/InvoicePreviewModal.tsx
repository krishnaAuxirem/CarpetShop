import { useOrderStore } from "@/stores/orderStore";
import { X, Printer, ExternalLink } from "lucide-react";

interface InvoicePreviewModalProps {
  orderId: string;
  onClose: () => void;
}

export const InvoicePreviewModal = ({ orderId, onClose }: InvoicePreviewModalProps) => {
  const { orders } = useOrderStore();
  const order = orders.find(o => o.id === orderId);

  if (!order) return null;

  const subtotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.12 / 1.12);
  const preGstSubtotal = subtotal - gstAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;
  const invoiceNo = `INV-${order.id.replace("ORD-", "")}`;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const handlePrint = () => window.open(`/invoice/${order.id}`, "_blank");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h3 className="font-heading font-bold text-lg">Invoice Preview</h3>
            <p className="text-xs text-muted-foreground">{invoiceNo} · {invoiceDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={() => window.open(`/invoice/${order.id}`, "_blank")}
              className="flex items-center gap-1.5 text-sm px-3 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scaled invoice preview */}
        <div className="flex-1 overflow-auto p-4">
          <div
            className="bg-white rounded-xl overflow-hidden shadow-lg"
            style={{ fontFamily: "Georgia, serif", color: "#111827", fontSize: 13 }}
          >
            {/* Header */}
            <div style={{ background: "#3E2723", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, background: "#D4AF37", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#3E2723", fontSize: 20, fontWeight: 900 }}>C</span>
                </div>
                <div>
                  <p style={{ color: "#F5F5DC", fontWeight: 900, fontSize: 16, margin: 0, letterSpacing: 0.5 }}>CarpetShop</p>
                  <p style={{ color: "#D4AF3780", fontSize: 9, margin: 0, textTransform: "uppercase", letterSpacing: 2 }}>Premium Carpets & Rugs</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ background: "#D4AF37", color: "#3E2723", padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>
                  TAX INVOICE
                </div>
                <p style={{ color: "#F5F5DC", fontSize: 11, margin: 0 }}>{invoiceNo}</p>
                <p style={{ color: "#F5F5DC80", fontSize: 10, margin: "2px 0 0" }}>{invoiceDate}</p>
              </div>
            </div>

            {/* Bill To */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid #E5E7EB", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#8B4513", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 5px" }}>Bill To</p>
                <p style={{ fontWeight: 700, margin: "0 0 2px", fontSize: 13 }}>{order.shippingAddress.name}</p>
                <p style={{ color: "#6B7280", fontSize: 10, margin: "0 0 1px" }}>{order.shippingAddress.line1}</p>
                <p style={{ color: "#6B7280", fontSize: 10, margin: 0 }}>{order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}</p>
              </div>
              <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, padding: "10px 12px" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#8B4513", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 5px" }}>Order Info</p>
                <p style={{ fontSize: 10, color: "#6B7280", margin: "0 0 2px" }}>Order: <strong style={{ color: "#111" }}>{order.id}</strong></p>
                <p style={{ fontSize: 10, color: "#6B7280", margin: "0 0 2px" }}>Payment: <strong style={{ color: "#111" }}>{order.paymentMethod.replace(/_/g, " ").toUpperCase()}</strong></p>
                <p style={{ fontSize: 10, color: "#6B7280", margin: 0 }}>Status: <strong style={{ color: order.paymentStatus === "paid" ? "#16A34A" : "#DC2626" }}>{order.paymentStatus.toUpperCase()}</strong></p>
              </div>
            </div>

            {/* Items */}
            <div style={{ padding: "0 24px 16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
                <thead>
                  <tr style={{ background: "#F9F5F0" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#6B7280", borderBottom: "2px solid #8B4513" }}>#</th>
                    <th style={{ padding: "8px 10px", textAlign: "left", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#6B7280", borderBottom: "2px solid #8B4513" }}>Product</th>
                    <th style={{ padding: "8px 10px", textAlign: "center", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#6B7280", borderBottom: "2px solid #8B4513" }}>Qty</th>
                    <th style={{ padding: "8px 10px", textAlign: "right", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#6B7280", borderBottom: "2px solid #8B4513" }}>Unit Price</th>
                    <th style={{ padding: "8px 10px", textAlign: "right", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: "#6B7280", borderBottom: "2px solid #8B4513" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F3F4F6", background: i % 2 === 0 ? "#FAFAF8" : "#fff" }}>
                      <td style={{ padding: "8px 10px", fontSize: 11, color: "#6B7280" }}>{i + 1}</td>
                      <td style={{ padding: "8px 10px" }}>
                        <p style={{ margin: "0 0 1px", fontSize: 12, fontWeight: 700 }}>{item.product.name}</p>
                        <p style={{ margin: 0, fontSize: 9, color: "#9CA3AF" }}>{item.product.material} · {item.selectedSize} · {item.selectedColor}</p>
                      </td>
                      <td style={{ padding: "8px 10px", fontSize: 12, textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ padding: "8px 10px", fontSize: 12, textAlign: "right" }}>₹{item.unitPrice.toLocaleString("en-IN")}</td>
                      <td style={{ padding: "8px 10px", fontSize: 12, fontWeight: 700, color: "#8B4513", textAlign: "right" }}>₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ padding: "0 24px 20px", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: 240, borderTop: "1px solid #E5E7EB", paddingTop: 12 }}>
                {[
                  { label: "Subtotal (ex-GST)", value: `₹${preGstSubtotal.toLocaleString("en-IN")}` },
                  { label: "CGST @ 6%", value: `₹${cgst.toLocaleString("en-IN")}` },
                  { label: "SGST @ 6%", value: `₹${sgst.toLocaleString("en-IN")}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>{label}</span>
                    <span style={{ fontSize: 11 }}>{value}</span>
                  </div>
                ))}
                {order.discount ? (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>Discount</span>
                    <span style={{ fontSize: 11, color: "#DC2626" }}>-₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                ) : null}
                <div style={{ borderTop: "2px solid #8B4513", paddingTop: 8, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, fontWeight: 900, color: "#111" }}>Grand Total</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: "#8B4513" }}>₹{order.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ background: "#3E2723", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ color: "#D4AF37", fontWeight: 700, fontSize: 11, margin: 0 }}>CarpetShop — Thank you for your order!</p>
              <p style={{ color: "#F5F5DC60", fontSize: 9, margin: 0 }}>carpetshop.in · GSTIN: 22AAAAA0000A1Z5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
