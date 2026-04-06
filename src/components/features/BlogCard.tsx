import { Link } from "react-router-dom";
import { Clock, User, Tag } from "lucide-react";
import type { BlogPost } from "@/types";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <div className={`bg-card border border-border rounded-2xl overflow-hidden card-hover ${featured ? "md:flex" : ""}`}>
        <div className={`overflow-hidden ${featured ? "md:w-1/2 h-56 md:h-auto" : "h-48"}`}>
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className={`p-5 flex flex-col justify-between ${featured ? "md:w-1/2" : ""}`}>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="badge bg-primary/10 text-primary">{post.category}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />{post.readTime} min read
              </span>
            </div>
            <h3 className={`font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2 ${featured ? "text-xl" : "text-base"}`}>
              {post.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={post.authorAvatar} alt={post.author} className="w-7 h-7 rounded-full border border-border" />
              <span className="text-xs text-muted-foreground">{post.author}</span>
            </div>
            <span className="text-xs text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
