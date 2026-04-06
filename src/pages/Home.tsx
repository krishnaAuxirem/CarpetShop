import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Truck, Award, HeadphonesIcon,
  Star, ChevronRight, Sparkles, Tag, Mail, Phone
} from "lucide-react";
import { HeroSlider } from "@/components/features/HeroSlider";
import { ProductCard } from "@/components/features/ProductCard";
import { BlogCard } from "@/components/features/BlogCard";
import { CATEGORIES, PRODUCTS, TESTIMONIALS, BLOG_POSTS } from "@/constants/data";
import { toast } from "sonner";

const useInView = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
};

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

export const Home = () => {
  const [email, setEmail] = useState("");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const featured = PRODUCTS.filter(p => p.isFeatured);
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller);
  const blogPosts = BLOG_POSTS.filter(p => p.isPublished).slice(0, 3);

  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You've subscribed! Enjoy exclusive offers in your inbox.");
    setEmail("");
  };

  return (
    <div className="page-transition">
      {/* Hero */}
      <HeroSlider />

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Collections</span>
            <h2 className="section-title mt-2">Shop by Category</h2>
            <p className="section-subtitle">Explore our curated selection of premium carpets and rugs</p>
          </AnimatedSection>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <AnimatedSection key={cat.id} style={{ transitionDelay: `${i * 60}ms` } as React.CSSProperties}>
                <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden aspect-square card-hover">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-3">
                      <p className="text-white font-heading font-semibold text-sm leading-tight">{cat.name}</p>
                      <p className="text-white/70 text-xs">{cat.productCount} products</p>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Handpicked</span>
              <h2 className="section-title mt-2">Featured Products</h2>
              <p className="section-subtitle">Discover our most loved carpet designs</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <AnimatedSection key={product.id}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Us</span>
            <h2 className="section-title mt-2">The CarpetShop Advantage</h2>
            <p className="section-subtitle">Experience the difference of quality, service, and craftsmanship</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Authenticity Guaranteed", desc: "Every carpet comes with a certificate of authenticity. We source directly from verified master weavers.", color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
              { icon: Truck, title: "Free Delivery Across India", desc: "Complimentary delivery on all orders above ₹5,000. Secure packaging ensures your carpet arrives in perfect condition.", color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
              { icon: Award, title: "Premium Quality", desc: "Only the finest materials make it to our collection. Each carpet undergoes rigorous quality checks.", color: "bg-amber-100 dark:bg-amber-900/20 text-amber-600" },
              { icon: HeadphonesIcon, title: "Expert Support", desc: "Our carpet experts are available 7 days a week to help you find the perfect piece for your space.", color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600" },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <AnimatedSection key={title} style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}>
                <div className="bg-card border border-border rounded-2xl p-6 text-center card-hover">
                  <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Customization CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1549517045-bc93de075e53?w=1920&q=80" alt="Customization" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-carpet-dark/85" />
        </div>
        <AnimatedSection className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-carpet-gold text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" /> Custom Design Service
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
              Design Your Perfect Carpet
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Use our interactive customization tool to create a carpet that's uniquely yours. Choose size, material, design, and color — see pricing update in real-time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/customization" className="btn-accent">
                Start Customizing <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/shop" className="px-6 py-3 border-2 border-white/40 text-white rounded-lg font-semibold hover:bg-white/20 transition-all duration-300">
                Browse Catalog
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              {["Size", "Material", "Design", "Color"].map(step => (
                <div key={step} className="text-center text-white">
                  <div className="w-10 h-10 rounded-full bg-carpet-gold/20 border border-carpet-gold/40 flex items-center justify-center mx-auto mb-2">
                    <ChevronRight className="w-4 h-4 text-carpet-gold" />
                  </div>
                  <p className="text-xs text-white/70">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Top Picks</span>
              <h2 className="section-title mt-2">Best Sellers</h2>
              <p className="section-subtitle">Our most popular carpets loved by thousands of customers</p>
            </div>
            <Link to="/shop?sort=bestseller" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-200">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map(product => (
              <AnimatedSection key={product.id}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Designs */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Trending Now</span>
            <h2 className="section-title mt-2">Trending Designs</h2>
            <p className="section-subtitle">The hottest carpet styles this season</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Geometric Patterns", desc: "Bold modern aesthetics", img: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80", tag: "Modern" },
              { title: "Floral Medallion", desc: "Timeless classic beauty", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", tag: "Classic", large: true },
              { title: "Earthy Minimalist", desc: "Calm neutral tones", img: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&q=80", tag: "Minimal" },
            ].map(({ title, desc, img, tag, large }) => (
              <AnimatedSection key={title}>
                <Link to={`/shop?design=${encodeURIComponent(title)}`} className="group block relative rounded-2xl overflow-hidden card-hover" style={{ height: large ? "360px" : "280px" }}>
                  <img src={img} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="badge bg-white/20 text-white backdrop-blur-sm">{tag}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-heading text-white font-bold text-lg">{title}</h3>
                    <p className="text-white/70 text-sm">{desc}</p>
                    <span className="inline-flex items-center gap-1 text-carpet-gold text-sm mt-2 group-hover:gap-2 transition-all">
                      Shop Now <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="py-12 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Tag className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-white">Monsoon Sale — Up to 50% Off!</h3>
                <p className="text-white/80">Limited time offer on selected carpets. Use code <strong>CARPET50</strong></p>
              </div>
            </div>
            <Link to="/shop?sale=true" className="px-8 py-3 bg-white text-primary rounded-xl font-bold hover:bg-carpet-cream transition-colors whitespace-nowrap">
              Shop the Sale
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Reviews</span>
            <h2 className="section-title mt-2">What Our Customers Say</h2>
            <p className="section-subtitle">Real reviews from real carpet lovers across India</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <AnimatedSection key={t.id} style={{ transitionDelay: `${i * 100}ms` } as React.CSSProperties}>
                <div className="bg-card border border-border rounded-2xl p-6 card-hover">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= t.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">"{t.comment}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border border-border" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.location} · {t.product}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {TESTIMONIALS.slice(0, 5).map(t => (
                  <img key={t.id} src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full border-2 border-background -ml-2 first:ml-0" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">4.8/5</strong> based on 1,200+ reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Insights</span>
              <h2 className="section-title mt-2">From Our Blog</h2>
              <p className="section-subtitle">Expert advice, design tips, and carpet care guides</p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
              All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <AnimatedSection key={post.id}>
                <BlogCard post={post} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <AnimatedSection>
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-10 border border-primary/20">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="section-title mb-3">Get Exclusive Offers</h2>
              <p className="text-muted-foreground mb-8">Subscribe to our newsletter and be the first to know about new arrivals, special discounts, and carpet care tips.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="input-field flex-1"
                  required
                />
                <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">No spam, unsubscribe anytime. We respect your privacy.</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-carpet-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <AnimatedSection>
              <span className="text-carpet-gold text-sm font-semibold uppercase tracking-wider">Get in Touch</span>
              <h2 className="font-heading text-4xl font-bold mt-2 mb-4">Need Help Choosing the Right Carpet?</h2>
              <p className="text-white/70 leading-relaxed mb-8">Our carpet experts are ready to help you find the perfect piece for your home or office. Get personalized recommendations based on your space, budget, and style preferences.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact" className="btn-accent">Talk to an Expert</Link>
                <Link to="/customization" className="px-6 py-3 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">Custom Order</Link>
              </div>
            </AnimatedSection>
            <AnimatedSection className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Phone, title: "Call Us", value: "+91 12345 67890", sub: "Mon-Sat, 10am-7pm" },
                { icon: Mail, title: "Email Us", value: "info@carpetshop.in", sub: "Reply within 2 hours" },
              ].map(({ icon: Icon, title, value, sub }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <Icon className="w-6 h-6 text-carpet-gold mb-3" />
                  <p className="font-semibold text-white">{title}</p>
                  <p className="text-carpet-gold text-sm mt-1">{value}</p>
                  <p className="text-white/50 text-xs mt-1">{sub}</p>
                </div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};
