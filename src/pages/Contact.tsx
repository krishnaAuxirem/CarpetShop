import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success("Message sent! We'll respond within 2 hours.");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80" alt="Contact" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Get in Touch</h1>
          <p className="text-white/80">We'd love to help you find the perfect carpet</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold mb-2">Contact Information</h2>
              <p className="text-muted-foreground">Reach out and we'll get back to you within 2 hours during business hours.</p>
            </div>
            {[
              { icon: Phone, title: "Call Us", details: ["+91 12345 67890", "+91 98765 43210"], sub: "Mon-Sat, 10am–7pm IST" },
              { icon: Mail, title: "Email Us", details: ["info@carpetshop.in", "support@carpetshop.in"], sub: "Response within 2 hours" },
              { icon: MapPin, title: "Visit Us", details: ["123 Carpet Lane, Connaught Place", "New Delhi – 110001, India"], sub: "Open Mon-Sat, 10am-7pm" },
              { icon: Clock, title: "Business Hours", details: ["Monday – Saturday: 10:00 AM – 7:00 PM", "Sunday: 11:00 AM – 5:00 PM"], sub: "Closed on public holidays" },
            ].map(({ icon: Icon, title, details, sub }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-4 flex gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">{title}</p>
                  {details.map(d => <p key={d} className="text-sm text-muted-foreground">{d}</p>)}
                  <p className="text-xs text-primary mt-1">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="font-heading text-2xl font-bold">Send Us a Message</h2>
              </div>

              {sent && (
                <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <p className="text-green-700 dark:text-green-400 font-medium">Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input-field" placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input-field" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input-field" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Subject *</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field" required>
                      <option value="">Select subject</option>
                      <option>Product Enquiry</option>
                      <option>Custom Carpet Order</option>
                      <option>Order Support</option>
                      <option>Return & Refund</option>
                      <option>Bulk Order</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="input-field min-h-[140px] resize-none" placeholder="How can we help you? Describe your requirement in detail..." required />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full justify-center py-3">
                  {sending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : <><Send className="w-5 h-5" /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 rounded-2xl overflow-hidden border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9!2d77.2167!3d28.6328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzU4LjAiTiA3N8KwMTMnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%" height="350" style={{ border: 0 }} allowFullScreen loading="lazy"
            title="CarpetShop Location"
          />
        </div>
      </div>
    </div>
  );
};
