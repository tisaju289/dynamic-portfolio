import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import DashboardHome from "./pages/admin/DashboardHome";
import HeroEditor from "./pages/admin/HeroEditor";
import AboutEditor from "./pages/admin/AboutEditor";
import ServicesEditor from "./pages/admin/ServicesEditor";
import PortfolioEditor from "./pages/admin/PortfolioEditor";
import TestimonialsEditor from "./pages/admin/TestimonialsEditor";
import ContactEditor from "./pages/admin/ContactEditor";
import SocialEditor from "./pages/admin/SocialEditor";
import SettingsEditor from "./pages/admin/SettingsEditor";
import StatsEditor from "./pages/admin/StatsEditor";
import BlogEditor from "./pages/admin/BlogEditor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/:username" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />}>
            <Route index element={<DashboardHome />} />
            <Route path="hero" element={<HeroEditor />} />
            <Route path="about" element={<AboutEditor />} />
            <Route path="services" element={<ServicesEditor />} />
            <Route path="portfolio" element={<PortfolioEditor />} />
            <Route path="testimonials" element={<TestimonialsEditor />} />
            <Route path="contact" element={<ContactEditor />} />
            <Route path="social" element={<SocialEditor />} />
            <Route path="settings" element={<SettingsEditor />} />
            <Route path="stats" element={<StatsEditor />} />
            <Route path="blog" element={<BlogEditor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
