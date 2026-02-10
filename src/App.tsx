import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/use-auth";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { usePageTracking } from "@/hooks/usePageTracking";

// Public pages
import Index from "./pages/Index";
import Download from "./pages/Download";
import Privacy from "./pages/Privacy";
import Changelog from "./pages/Changelog";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminFAQ from "./pages/admin/FAQ";
import AdminChangelog from "./pages/admin/Changelog";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminDownloads from "./pages/admin/Downloads";
import AdminFeatures from "./pages/admin/Features";
import AdminRoadmap from "./pages/admin/Roadmap";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";

const queryClient = new QueryClient();

// Create a component that uses the hook inside Router context
const PageTracker = () => {
  usePageTracking();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTracker />
            <ScrollProgress />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/download" element={<Download />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/changelog" element={<Changelog />} />

              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="faq" element={<AdminFAQ />} />
                <Route path="changelog" element={<AdminChangelog />} />
                <Route path="subscribers" element={<AdminSubscribers />} />
                <Route path="downloads" element={<AdminDownloads />} />
                <Route path="features" element={<AdminFeatures />} />
                <Route path="roadmap" element={<AdminRoadmap />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BackToTop />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
