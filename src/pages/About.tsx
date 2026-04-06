import { Award, Users, Heart, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { TESTIMONIALS } from "@/constants/data";

export const About = () => {
  return (
    <div className="page-transition pt-16">
      {/* Header */}
      <div className="relative h-64 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80" alt="About" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">About CarpetShop</h1>
          <p className="text-white/80">India's premium carpet destination since 2018</p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="section-title mt-2 mb-4">Weaving Dreams Into Reality Since 2018</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CarpetShop was founded with a simple yet powerful vision: to bring India's rich textile heritage to modern homes. We started with a small collection of handpicked carpets from master weavers across Rajasthan, Kashmir, and UP, and have grown into India's most trusted carpet destination.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Today, we partner with over 500 artisans across the country, offering everything from authentic Persian rugs to contemporary modern carpets, all with the promise of quality, authenticity, and exceptional service.
              </p>
              <Link to="/shop" className="btn-primary">Explore Our Collection <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80" alt="Our story" className="rounded-2xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-2xl shadow-xl">
                <p className="font-heading text-3xl font-bold">6+</p>
                <p className="text-sm text-white/80">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Stand For</span>
            <h2 className="section-title mt-2">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: "Authenticity", desc: "Every carpet comes with a certificate of authenticity from verified artisans.", color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600" },
              { icon: Users, title: "Community", desc: "We support over 500 artisan families across India through fair trade practices.", color: "bg-green-100 dark:bg-green-900/20 text-green-600" },
              { icon: Heart, title: "Craftsmanship", desc: "We celebrate and preserve India's 2000-year-old carpet weaving traditions.", color: "bg-rose-100 dark:bg-rose-900/20 text-rose-600" },
              { icon: Leaf, title: "Sustainability", desc: "We prioritize natural materials, eco-friendly dyes, and sustainable practices.", color: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600" },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-card border border-border rounded-2xl p-6 text-center card-hover">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}><Icon className="w-7 h-7" /></div>
                <h3 className="font-heading font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-carpet-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[["50,000+", "Happy Customers"], ["500+", "Partner Artisans"], ["5,000+", "Products"], ["25+", "States Served"]].map(([v, l]) => (
              <div key={l}>
                <p className="font-heading text-4xl font-bold text-carpet-gold mb-1">{v}</p>
                <p className="text-white/70 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="section-title mt-2">The People Behind CarpetShop</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Aryan Kapoor", role: "Founder & CEO", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=aryan" },
              { name: "Priya Sharma", role: "Head of Design", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya" },
              { name: "Rahul Gupta", role: "Master Curator", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=rahulg" },
              { name: "Meera Nair", role: "Customer Relations", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera" },
            ].map(({ name, role, img }) => (
              <div key={name} className="bg-card border border-border rounded-2xl p-6 text-center card-hover">
                <img src={img} alt={name} className="w-20 h-20 rounded-full border-4 border-primary/20 mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-foreground">{name}</h3>
                <p className="text-sm text-muted-foreground">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(3, 6).map(t => (
              <div key={t.id} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(s => <span key={s} className={`text-lg ${s <= t.rating ? "star" : "text-gray-300"}`}>★</span>)}</div>
                <p className="text-muted-foreground text-sm italic mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
