import { Link } from "react-router-dom";
import { Shield, ChevronRight } from "lucide-react";

export const PrivacyPolicy = () => (
  <div className="page-transition pt-16">
    <div className="relative h-48 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80" alt="Privacy Policy" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center"><h1 className="font-heading text-4xl font-bold text-white">Privacy Policy</h1></div>
    </div>
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="w-4 h-4" /><span>Privacy Policy</span>
      </div>
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
          <div><p className="font-semibold">Last updated: March 2024</p><p className="text-sm text-muted-foreground">Effective immediately</p></div>
        </div>
        {[
          { title: "Information We Collect", content: "We collect information you provide when creating an account, placing orders, or contacting us. This includes name, email address, phone number, delivery address, and payment information (processed securely through payment gateways)." },
          { title: "How We Use Your Information", content: "We use your information to process orders, provide customer support, send order updates, improve our services, and send relevant offers (with your consent). We never sell your personal information to third parties." },
          { title: "Data Security", content: "We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information." },
          { title: "Cookies", content: "We use cookies to improve your browsing experience, remember your preferences, and analyze site traffic. You can control cookie settings through your browser preferences." },
          { title: "Your Rights", content: "You have the right to access, correct, or delete your personal data. You can opt out of marketing communications at any time. Contact us at privacy@carpetshop.in for data-related requests." },
          { title: "Contact Us", content: "For privacy-related concerns, email us at privacy@carpetshop.in or write to our Privacy Officer at 123 Carpet Lane, Connaught Place, New Delhi – 110001." },
        ].map(({ title, content }) => (
          <div key={title} className="border-t border-border pt-6">
            <h2 className="font-heading font-bold text-xl mb-3">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Terms = () => (
  <div className="page-transition pt-16">
    <div className="relative h-48 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1920&q=80" alt="Terms" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center"><h1 className="font-heading text-4xl font-bold text-white">Terms & Conditions</h1></div>
    </div>
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <p className="text-muted-foreground">Last updated: March 2024. By using CarpetShop, you agree to these terms.</p>
        {[
          { title: "1. Acceptance of Terms", content: "By accessing and using CarpetShop, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services." },
          { title: "2. Product Information", content: "We strive to display accurate product information, including colors, sizes, and materials. However, slight variations may occur due to photography and screen settings. Dimensions are approximate." },
          { title: "3. Pricing", content: "All prices are in Indian Rupees (₹) and inclusive of GST. Prices may change without notice. The price displayed at checkout is final." },
          { title: "4. Orders & Payment", content: "Orders are confirmed upon successful payment. We accept UPI, credit/debit cards, net banking, and EMI. For custom orders, 50% advance payment is required." },
          { title: "5. Shipping & Delivery", content: "We deliver across India. Delivery timelines are estimates and may vary. Free delivery on orders above ₹5,000. Custom orders take 2-4 weeks." },
          { title: "6. Returns & Refunds", content: "We accept returns within 30 days of delivery for damaged or defective items. Refunds are processed within 7-10 business days. Custom orders are non-returnable." },
          { title: "7. Intellectual Property", content: "All content on CarpetShop, including images, text, and designs, is our intellectual property. Unauthorized use is strictly prohibited." },
        ].map(({ title, content }) => (
          <div key={title} className="border-t border-border pt-6">
            <h2 className="font-heading font-bold text-xl mb-3">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{content}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Support = () => (
  <div className="page-transition pt-16">
    <div className="relative h-48 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1549517045-bc93de075e53?w=1920&q=80" alt="Support" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center"><h1 className="font-heading text-4xl font-bold text-white">Help & Support</h1></div>
    </div>
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { title: "Track Order", desc: "Track your order in real-time", link: "/order-tracking", icon: "📦" },
          { title: "Contact Us", desc: "Get in touch with our team", link: "/contact", icon: "💬" },
          { title: "Return Policy", desc: "30-day hassle-free returns", link: "#returns", icon: "↩️" },
        ].map(({ title, desc, link, icon }) => (
          <a key={title} href={link} className="bg-card border border-border rounded-2xl p-6 text-center card-hover block">
            <p className="text-4xl mb-3">{icon}</p>
            <h3 className="font-heading font-bold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{desc}</p>
          </a>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="font-heading text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Custom orders take 2-4 weeks. Express delivery available in select cities." },
            { q: "Can I return a carpet?", a: "Yes! We offer 30-day returns for standard products. Items must be unused and in original packaging. Custom orders are non-returnable." },
            { q: "How do I care for my carpet?", a: "Vacuum regularly, spot clean immediately, rotate every 6 months, and get professional cleaning every 1-2 years. Avoid direct sunlight." },
            { q: "Do you offer custom sizes?", a: "Absolutely! Use our Customization tool to specify exact dimensions. Custom orders typically take 2-4 weeks." },
            { q: "Is EMI available?", a: "Yes, EMI available on all orders above ₹5,000 through credit cards. 0% EMI available on select banks for 3-6 months." },
            { q: "How do I know if a carpet is authentic?", a: "All our carpets come with a certificate of authenticity from verified artisans. Look for the CarpetShop seal of authenticity." },
          ].map(({ q, a }, i) => (
            <div key={i} id={i === 1 ? "returns" : i === 4 ? "shipping" : undefined} className="border border-border rounded-xl p-5">
              <p className="font-semibold text-foreground mb-2">{q}</p>
              <p className="text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
