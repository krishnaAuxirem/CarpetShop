import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { ScrollToTopButton } from "@/components/features/ScrollToTopButton";
import { useAuthStore } from "@/stores/authStore";

// Pages
import { Home } from "@/pages/Home";
import { Shop } from "@/pages/Shop";
import { ProductDetail } from "@/pages/ProductDetail";
import { Customization } from "@/pages/Customization";
import { About } from "@/pages/About";
import { Blog, BlogDetail } from "@/pages/Blog";
import { Contact } from "@/pages/Contact";
import { Cart } from "@/pages/Cart";
import { Checkout } from "@/pages/Checkout";
import { OrderConfirmation } from "@/pages/OrderConfirmation";
import { OrderTracking } from "@/pages/OrderTracking";
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";
import { CustomerDashboard } from "@/pages/dashboard/CustomerDashboard";
import { SellerDashboard } from "@/pages/dashboard/SellerDashboard";
import { AdminDashboard } from "@/pages/dashboard/AdminDashboard";
import { Wishlist } from "@/pages/Wishlist";
import { Notifications } from "@/pages/Notifications";
import { PrivacyPolicy, Terms, Support } from "@/pages/StaticPages";
import { NotFound } from "@/pages/NotFound";
import { RoomPreview } from "@/pages/RoomPreview";
import { BulkOrder } from "@/pages/BulkOrder";
import { Compare } from "@/pages/Compare";
import { RoomCalculator } from "@/pages/RoomCalculator";
import { ARCameraView } from "@/pages/ARCameraView";
import { CatalogPDF } from "@/pages/CatalogPDF";
import { ChatWidget } from "@/components/features/ChatWidget";
import { CompareBar } from "@/components/features/CompareBar";

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

// Full app layout (with navbar + footer)
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <main className="min-h-screen pb-16">{children}</main>
    <Footer />
    <ScrollToTopButton />
    <ChatWidget />
    <CompareBar />
  </>
);

// Auth layout (no navbar/footer)
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster richColors position="top-right" duration={3000} />
      <Routes>
        {/* Auth routes (no navbar) */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

        {/* Main routes */}
        <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        <Route path="/shop" element={<AppLayout><Shop /></AppLayout>} />
        <Route path="/product/:id" element={<AppLayout><ProductDetail /></AppLayout>} />
        <Route path="/customization" element={<AppLayout><Customization /></AppLayout>} />
        <Route path="/about" element={<AppLayout><About /></AppLayout>} />
        <Route path="/blog" element={<AppLayout><Blog /></AppLayout>} />
        <Route path="/blog/:slug" element={<AppLayout><BlogDetail /></AppLayout>} />
        <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
        <Route path="/privacy-policy" element={<AppLayout><PrivacyPolicy /></AppLayout>} />
        <Route path="/terms" element={<AppLayout><Terms /></AppLayout>} />
        <Route path="/support" element={<AppLayout><Support /></AppLayout>} />
        <Route path="/order-tracking" element={<AppLayout><OrderTracking /></AppLayout>} />
        <Route path="/room-preview" element={<AppLayout><RoomPreview /></AppLayout>} />
        <Route path="/bulk-order" element={<AppLayout><BulkOrder /></AppLayout>} />
        <Route path="/compare" element={<AppLayout><Compare /></AppLayout>} />
        <Route path="/room-calculator" element={<AppLayout><RoomCalculator /></AppLayout>} />
        <Route path="/ar-camera" element={<ARCameraView />} />
        <Route path="/catalog-pdf" element={<CatalogPDF />} />
        <Route path="/wishlist/shared/:shareId" element={<AppLayout><Wishlist /></AppLayout>} />

        {/* Protected routes */}
        <Route path="/cart" element={<AppLayout><ProtectedRoute><Cart /></ProtectedRoute></AppLayout>} />
        <Route path="/wishlist" element={<AppLayout><ProtectedRoute><Wishlist /></ProtectedRoute></AppLayout>} />
        <Route path="/notifications" element={<AppLayout><ProtectedRoute><Notifications /></ProtectedRoute></AppLayout>} />
        <Route path="/checkout" element={<AppLayout><ProtectedRoute><Checkout /></ProtectedRoute></AppLayout>} />
        <Route path="/order-confirmation/:id" element={<AppLayout><ProtectedRoute><OrderConfirmation /></ProtectedRoute></AppLayout>} />
        <Route path="/dashboard/customer" element={<AppLayout><ProtectedRoute><CustomerDashboard /></ProtectedRoute></AppLayout>} />
        <Route path="/dashboard/seller" element={<AppLayout><ProtectedRoute requiredRole="seller"><SellerDashboard /></ProtectedRoute></AppLayout>} />
        <Route path="/dashboard/admin" element={<AppLayout><ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute></AppLayout>} />

        {/* Catch all */}
        <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
