import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-carpet-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-carpet-brown rounded-lg flex items-center justify-center text-white font-bold">C</div>
              <span className="font-heading font-bold text-xl">CarpetShop</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's premier destination for luxury carpets, rugs, and flooring solutions. Bringing tradition and modernity together since 2018.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Youtube, href: "https://youtube.com" },
                { Icon: Linkedin, href: "https://linkedin.com" },
              ].map(({ Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-carpet-brown transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", to: "/about" },
                { label: "Shop All Products", to: "/shop" },
                { label: "Customization", to: "/customization" },
                { label: "Blog", to: "/blog" },
                { label: "Contact Us", to: "/contact" },
                { label: "Seller Dashboard", to: "/dashboard/seller" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Terms & Conditions", to: "/terms" },
                { label: "Help & Support", to: "/support" },
                { label: "Return Policy", to: "/support#returns" },
                { label: "Shipping Info", to: "/support#shipping" },
                { label: "Track Order", to: "/order-tracking" },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-carpet-brown mt-0.5 shrink-0" />
                <span>123 Carpet Lane, Connaught Place, New Delhi – 110001, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-carpet-brown shrink-0" />
                <a href="tel:+911234567890" className="hover:text-white transition-colors">+91 12345 67890</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-carpet-brown shrink-0" />
                <a href="mailto:info@carpetshop.in" className="hover:text-white transition-colors">info@carpetshop.in</a>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Business Hours</p>
              <p className="text-sm text-white">Mon – Sat: 10:00 AM – 7:00 PM</p>
              <p className="text-sm text-white">Sunday: 11:00 AM – 5:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} CarpetShop. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms</Link>
            <Link to="/support" className="text-xs text-gray-500 hover:text-white transition-colors">Support</Link>
          </div>
          <p className="text-xs text-gray-600">Accepting: UPI • Cards • NetBanking • EMI</p>
        </div>
      </div>
    </footer>
  );
};
