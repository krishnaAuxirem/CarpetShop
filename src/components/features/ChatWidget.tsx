import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ChevronDown, Bot, User, Phone, Mail, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
  time: string;
  buttons?: { label: string; action: string }[];
  link?: { text: string; to: string };
}

const QUICK_REPLIES = [
  { label: "Track My Order", action: "track_order" },
  { label: "Return / Refund", action: "returns" },
  { label: "Carpet Sizing Help", action: "sizing" },
  { label: "Bulk Orders", action: "bulk" },
  { label: "Payment Issues", action: "payment" },
  { label: "Talk to Human", action: "human" },
];

const BOT_RESPONSES: Record<string, { text: string; buttons?: { label: string; action: string }[]; link?: { text: string; to: string } }> = {
  track_order: {
    text: "To track your order, please visit the Order Tracking page and enter your order ID or tracking number. You can also find your order details in your customer dashboard.",
    link: { text: "Go to Order Tracking →", to: "/order-tracking" },
  },
  returns: {
    text: "Our return policy allows returns within 7 days of delivery. The carpet must be in original condition. To initiate a return:\n1. Go to your Order History\n2. Select the order\n3. Click 'Return/Exchange'\n\nFor urgent cases, call us at +91 1800 123 4567.",
    buttons: [{ label: "View My Orders", action: "go_orders" }],
  },
  sizing: {
    text: "Choosing the right size is important! Here's a quick guide:\n\n• Living Room: 8×10 ft or 9×12 ft\n• Bedroom: 5×7 ft or 6×9 ft\n• Dining Room: 8×10 ft\n• Hallway: Runner 2.5×8 ft\n\nAll furniture front legs should sit on the carpet.",
    buttons: [{ label: "Shop by Size", action: "go_shop" }, { label: "Custom Size", action: "customization" }],
  },
  bulk: {
    text: "We offer special corporate pricing for bulk orders:\n\n• 5–10 units: 10% off\n• 11–25 units: 18% off\n• 26–50 units: 25% off\n• 50+ units: Up to 40% off\n\nFill out our RFQ form for a personalized quote.",
    link: { text: "Submit Bulk Order RFQ →", to: "/bulk-order" },
  },
  payment: {
    text: "We accept the following payment methods:\n• UPI (Google Pay, PhonePe, Paytm)\n• Credit / Debit Cards (Visa, Mastercard, RuPay)\n• Net Banking\n• Cash on Delivery\n\nAll transactions are encrypted and secure.",
    buttons: [{ label: "Contact Support", action: "human" }],
  },
  human: {
    text: "I'll connect you with our customer support team. You can also reach us directly:",
    buttons: [{ label: "Email Support", action: "email_support" }, { label: "Contact Page", action: "go_contact" }],
  },
  go_orders: { text: "Please log in to view your orders in the Customer Dashboard.", link: { text: "Go to Dashboard →", to: "/dashboard/customer" } },
  go_shop: { text: "Browse our full collection with size filters.", link: { text: "Shop Now →", to: "/shop" } },
  customization: { text: "Design your perfect custom-size carpet.", link: { text: "Customize Now →", to: "/customization" } },
  email_support: { text: "You can email us at support@carpetshop.in. We typically respond within 2-4 hours during business hours (Mon–Sat, 9 AM–6 PM IST)." },
  go_contact: { text: "Visit our contact page for all ways to reach us.", link: { text: "Contact Us →", to: "/contact" } },
};

const WELCOME_MSG: Message = {
  id: "w1",
  from: "bot",
  text: "👋 Hi there! I'm CarpetBot, your shopping assistant. How can I help you today?",
  time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  buttons: QUICK_REPLIES.slice(0, 4),
};

const now = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendBotReply = (action: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const response = BOT_RESPONSES[action];
      if (response) {
        const botMsg: Message = {
          id: `b${Date.now()}`,
          from: "bot",
          text: response.text,
          time: now(),
          buttons: response.buttons,
          link: response.link,
        };
        setMessages(m => [...m, botMsg]);
      }
      setIsTyping(false);
    }, 900);
  };

  const handleQuickReply = (action: string) => {
    const label = QUICK_REPLIES.find(q => q.action === action)?.label || BOT_RESPONSES[action] ? action : action;
    const displayLabel = QUICK_REPLIES.find(q => q.action === action)?.label || action.replace(/_/g, " ");
    const userMsg: Message = { id: `u${Date.now()}`, from: "user", text: displayLabel, time: now() };
    setMessages(m => [...m, userMsg]);

    if (action === "human") {
      setTimeout(() => {
        setShowContactForm(true);
        sendBotReply(action);
      }, 500);
    } else {
      sendBotReply(action);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { id: `u${Date.now()}`, from: "user", text: input, time: now() };
    setMessages(m => [...m, userMsg]);
    const userText = input.toLowerCase();
    setInput("");

    // Simple NLP matching
    setIsTyping(true);
    setTimeout(() => {
      let action = "human";
      if (userText.includes("track") || userText.includes("order") || userText.includes("where")) action = "track_order";
      else if (userText.includes("return") || userText.includes("refund") || userText.includes("exchange")) action = "returns";
      else if (userText.includes("size") || userText.includes("dimension") || userText.includes("big") || userText.includes("small")) action = "sizing";
      else if (userText.includes("bulk") || userText.includes("corporate") || userText.includes("wholesale")) action = "bulk";
      else if (userText.includes("payment") || userText.includes("pay") || userText.includes("upi") || userText.includes("card")) action = "payment";

      const response = BOT_RESPONSES[action];
      const botMsg: Message = {
        id: `b${Date.now()}`,
        from: "bot",
        text: response ? response.text : "I'm sorry, I didn't quite understand that. Here are some topics I can help with:",
        time: now(),
        buttons: response?.buttons || QUICK_REPLIES.slice(0, 3),
        link: response?.link,
      };
      setMessages(m => [...m, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    const botMsg: Message = {
      id: `b${Date.now()}`,
      from: "bot",
      text: `Thanks ${contactForm.name || "for reaching out"}! We've received your message and will respond to ${contactForm.email} within 2-4 hours.`,
      time: now(),
    };
    setMessages(m => [...m, botMsg]);
    setShowContactForm(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-110 active:scale-95"
          aria-label="Open chat"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">1</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${isMinimized ? "h-14" : "h-[520px]"}`}>
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-primary text-white rounded-t-2xl shrink-0">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"><Bot className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="font-semibold text-sm">CarpetBot</p>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><p className="text-xs text-white/80">Online · Usually replies instantly</p></div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setIsMinimized(!isMinimized)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"><ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? "rotate-180" : ""}`} /></button>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex items-end gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${msg.from === "bot" ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                      {msg.from === "bot" ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`max-w-[75%] space-y-2 ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${msg.from === "bot" ? "bg-muted text-foreground rounded-tl-none" : "bg-primary text-white rounded-tr-none"}`}>
                        {msg.text}
                      </div>
                      {msg.link && (
                        <Link to={msg.link.to} onClick={() => setIsOpen(false)} className="text-xs text-primary hover:underline flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />{msg.link.text}
                        </Link>
                      )}
                      {msg.buttons && msg.buttons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.buttons.map(btn => (
                            <button key={btn.action} onClick={() => handleQuickReply(btn.action)} className="text-xs px-2.5 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground">{msg.time}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><Bot className="w-3.5 h-3.5" /></div>
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Form */}
                {showContactForm && !contactSent && (
                  <form onSubmit={handleContactSubmit} className="bg-muted rounded-2xl p-3 space-y-2">
                    <p className="text-xs font-semibold text-foreground">Contact Support Form</p>
                    <input value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))} className="w-full text-xs px-3 py-2 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary outline-none" placeholder="Your name" defaultValue={user?.name || ""} />
                    <input type="email" value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} className="w-full text-xs px-3 py-2 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary outline-none" placeholder="Email address" defaultValue={user?.email || ""} required />
                    <textarea value={contactForm.message} onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))} className="w-full text-xs px-3 py-2 bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none h-20" placeholder="Describe your issue..." required />
                    <button type="submit" className="w-full bg-primary text-white text-xs py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"><Send className="w-3 h-3" />Send Message</button>
                  </form>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-2 border-t border-border">
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {QUICK_REPLIES.map(q => (
                    <button key={q.action} onClick={() => handleQuickReply(q.action)} className="shrink-0 text-xs px-2.5 py-1.5 border border-border rounded-full hover:border-primary hover:text-primary hover:bg-primary/5 transition-all whitespace-nowrap">
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="flex gap-2 p-4 pt-2 shrink-0">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-xs px-3 py-2.5 bg-muted border border-border rounded-xl focus:ring-1 focus:ring-primary outline-none"
                />
                <button type="submit" className="w-9 h-9 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
