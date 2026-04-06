import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      const user = useAuthStore.getState().user;
      if (user?.role === "admin") navigate("/dashboard/admin");
      else if (user?.role === "seller") navigate("/dashboard/seller");
      else navigate("/dashboard/customer");
    } else {
      setError(result.message);
    }
  };

  const fillDemo = (role: "customer" | "seller" | "admin") => {
    const creds = { customer: ["user@demo.com", "123456"], seller: ["seller@demo.com", "123456"], admin: ["admin@demo.com", "123456"] };
    setEmail(creds[role][0]);
    setPassword(creds[role][1]);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" alt="Carpet" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-carpet-dark/90 to-carpet-brown/70" />
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-carpet-brown rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span className="font-heading font-bold text-xl">CarpetShop</span>
          </Link>
          <h2 className="font-heading text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-white/70 text-lg mb-8">Login to access your account, track orders, and explore our premium carpet collection.</p>
          <div className="grid grid-cols-2 gap-4">
            {[{ n: "50K+", l: "Happy Customers" }, { n: "5000+", l: "Products" }, { n: "4.8★", l: "Average Rating" }, { n: "Free", l: "Delivery on ₹5K+" }].map(({ n, l }) => (
              <div key={l} className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="font-heading text-2xl font-bold text-carpet-gold">{n}</p>
                <p className="text-sm text-white/70">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="lg:hidden mb-4">
              <Link to="/" className="flex items-center justify-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">C</div>
                <span className="font-heading font-bold text-xl text-primary">CarpetShop</span>
              </Link>
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Sign In</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          {/* Demo credentials */}
          <div className="bg-muted rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold mb-2 text-foreground">Demo Accounts:</p>
            <div className="flex flex-wrap gap-2">
              {(["customer", "seller", "admin"] as const).map(role => (
                <button key={role} onClick={() => fillDemo(role)} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-medium hover:border-primary hover:text-primary transition-all capitalize">
                  {role} →
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10" placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="Your password" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : <><LogIn className="w-5 h-5" /> Sign In</>}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={() => { setEmail("user@demo.com"); setPassword("123456"); toast.info("Google login simulated — credentials filled!"); }} className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl hover:bg-muted transition-colors text-sm font-medium">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </button>
            <button onClick={() => { setEmail("user@demo.com"); setPassword("123456"); toast.info("Facebook login simulated — credentials filled!"); }} className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] text-white rounded-xl hover:bg-[#1864D9] transition-colors text-sm font-medium">
              <span className="font-bold">f</span> Facebook
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
