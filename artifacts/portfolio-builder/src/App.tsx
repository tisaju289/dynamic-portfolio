import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignIn, SignUp, useClerk, useUser } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
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

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

const clerkAppearance = {
  theme: shadcn,
  variables: {
    colorPrimary: "hsl(145, 60%, 40%)",
    colorForeground: "hsl(240, 10%, 10%)",
    colorBackground: "hsl(0, 0%, 100%)",
    colorInput: "hsl(0, 0%, 98%)",
    colorInputForeground: "hsl(240, 10%, 10%)",
    colorNeutral: "hsl(145, 10%, 80%)",
    fontFamily: "'Noto Sans Bengali', Inter, sans-serif",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "w-[440px] max-w-full",
    card: "!shadow-none",
  },
};

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsub = addListener(({ user }) => {
      const uid = user?.id ?? null;
      if (prevRef.current !== undefined && prevRef.current !== uid) {
        qc.clear();
      }
      prevRef.current = uid;
    });
    return unsub;
  }, [addListener, qc]);

  return null;
}

function AdminGuardInner({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!isSignedIn) return <Navigate to="/sign-in" replace />;
  return <>{children}</>;
}

function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
}

function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
}

const App = () => (
  <ClerkProvider
    publishableKey={clerkPubKey!}
    proxyUrl={clerkProxyUrl}
    appearance={clerkAppearance}
    signInUrl="/sign-in"
    signUpUrl="/sign-up"
  >
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ClerkQueryClientCacheInvalidator />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/admin/login" element={<Navigate to="/sign-in" replace />} />
            <Route path="/admin" element={<AdminGuardInner><Admin /></AdminGuardInner>}>
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
            <Route path="/:username" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
