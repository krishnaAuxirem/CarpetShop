import { useParams, Link } from "react-router-dom";
import { Clock, ArrowLeft, Share2, Tag, ChevronRight } from "lucide-react";
import { useBlogStore } from "@/stores/blogStore";
import { BlogCard } from "@/components/features/BlogCard";

export const Blog = () => {
  const { posts } = useBlogStore();
  const published = posts.filter(p => p.isPublished);
  const categories = [...new Set(published.map(p => p.category))];
  const featured = published[0];
  const rest = published.slice(1);

  return (
    <div className="page-transition pt-16">
      <div className="relative h-56 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1920&q=80" alt="Blog" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-2">Our Blog</h1>
          <p className="text-white/80">Carpet care, design tips, and industry insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Posts */}
          <div className="flex-1">
            {featured && (
              <div className="mb-8">
                <BlogCard post={featured} featured />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-72 shrink-0">
            <div className="bg-card border border-border rounded-2xl p-5 mb-6">
              <h3 className="font-heading font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-foreground">{cat}</span>
                    <span className="badge bg-muted text-muted-foreground">{published.filter(p => p.category === cat).length}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
              <h3 className="font-heading font-semibold mb-2">Subscribe to Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-3">Get the latest articles delivered to your inbox</p>
              <input className="input-field mb-2 text-sm" placeholder="Your email" type="email" />
              <button className="btn-primary w-full justify-center text-sm">Subscribe</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getBySlug, getPublished } = useBlogStore();
  const post = getBySlug(slug || "");
  const related = getPublished().filter(p => p.slug !== slug).slice(0, 3);

  if (!post) return (
    <div className="pt-24 text-center py-20">
      <h2 className="font-heading text-2xl mb-4">Post not found</h2>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  );

  return (
    <div className="page-transition pt-16">
      <div className="relative h-64 overflow-hidden">
        <img src={post.image || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white max-w-4xl mx-auto w-full left-0 right-0">
          <span className="badge bg-primary/80 text-white mb-3">{post.category}</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
          <Link to="/blog" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-2 ml-auto">
            <img src={post.authorAvatar} alt={post.author} className="w-8 h-8 rounded-full border border-border" />
            <div>
              <p className="text-sm font-medium">{post.author}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />{post.readTime} min read · {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <button onClick={() => { navigator.clipboard?.writeText(window.location.href); }} className="w-8 h-8 flex items-center justify-center border border-border rounded-full hover:bg-muted">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-10">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("# ")) return <h1 key={i} className="font-heading text-3xl font-bold mt-8 mb-4">{line.slice(2)}</h1>;
            if (line.startsWith("## ")) return <h2 key={i} className="font-heading text-2xl font-bold mt-6 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-bold text-foreground mb-2">{line.slice(2, -2)}</p>;
            if (line.startsWith("- ")) return <li key={i} className="text-muted-foreground ml-4 mb-1">{line.slice(2)}</li>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} className="text-muted-foreground leading-relaxed mb-3">{line}</p>;
          })}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {post.tags.map(t => <span key={t} className="badge bg-muted text-muted-foreground"><Tag className="w-3 h-3 mr-1" />{t}</span>)}
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(p => <BlogCard key={p.id} post={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
