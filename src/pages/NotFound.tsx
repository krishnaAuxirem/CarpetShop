import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <p className="font-heading text-[120px] font-bold text-primary/10 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80" alt="404" className="w-32 h-32 object-cover rounded-xl mx-auto mb-4 opacity-50" />
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Page Not Found</h1>
              <p className="text-muted-foreground text-sm">Oops! The carpet you're looking for seems to have rolled away. Let's get you back on track.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-48">
          <Link to="/" className="btn-primary justify-center"><Home className="w-4 h-4" /> Go Home</Link>
          <button onClick={() => history.back()} className="btn-secondary justify-center"><ArrowLeft className="w-4 h-4" /> Go Back</button>
        </div>
      </div>
    </div>
  );
};
