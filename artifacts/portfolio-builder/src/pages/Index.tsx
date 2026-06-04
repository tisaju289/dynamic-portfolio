import { useParams } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext";
import { PortfolioProvider } from "@/context/PortfolioContext";
import DynamicThemeProvider from "@/components/DynamicThemeProvider";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTop from "@/components/BackToTop";
import Preloader from "@/components/Preloader";
import DynamicHead from "@/components/DynamicHead";
import { useSiteSettings, useProfileByUsername } from "@/hooks/useSiteContent";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const sectionComponents: Record<string, React.FC> = {
  home: HeroSection,
  about: AboutSection,
  stats: StatsSection,
  services: ServicesSection,
  portfolio: PortfolioSection,
  testimonials: TestimonialsSection,
  blog: BlogSection,
  contact: ContactSection,
};

const DEFAULT_ORDER = ["home", "about", "stats", "services", "portfolio", "testimonials", "blog", "contact"];

const SiteContent = () => {
  const { data: settings } = useSiteSettings();
  const dbOrder = (settings as any)?.section_order as string[] | undefined;
  const order = dbOrder && dbOrder.length > 0
    ? [...dbOrder, ...DEFAULT_ORDER.filter((s) => !dbOrder.includes(s))]
    : DEFAULT_ORDER;

  return (
    <>
      {order.map((key: string) => {
        const Comp = sectionComponents[key];
        return Comp ? <Comp key={key} /> : null;
      })}
    </>
  );
};

const PortfolioSite = ({ userId, username }: { userId: string; username: string }) => (
  <PortfolioProvider userId={userId} username={username}>
    <LanguageProvider>
      <DynamicThemeProvider>
        <DynamicHead />
        <Preloader />
        <main className="min-h-screen">
          <ScrollProgress />
          <Navbar />
          <SiteContent />
          <Footer />
          <WhatsAppButton />
          <BackToTop />
        </main>
      </DynamicThemeProvider>
    </LanguageProvider>
  </PortfolioProvider>
);

const useProfileByUserId = (userId: string | undefined) =>
  useQuery({
    queryKey: ["profile_by_uid", userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await fetch("/api/profiles/me", { credentials: "include" });
      return res.ok ? res.json() : null;
    },
    enabled: !!userId,
  });

const Index = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  // If root URL and user is logged in, show their portfolio
  const { data: ownProfile } = useProfileByUserId(!username ? user?.id : undefined);

  const resolvedUsername = username || ownProfile?.username;
  const { data: profile, isLoading, isError } = useProfileByUsername(resolvedUsername);

  if (!resolvedUsername) {
    // Not logged in, no username in URL — show welcome page
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-heading mb-4">Portfolio Builder</h1>
          <p className="text-muted-foreground mb-8">Create your beautiful portfolio. Sign in to get started.</p>
          <a href="/sign-in" className="gradient-bg text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-block">
            Sign In
          </a>
          <div className="mt-4">
            <a href="/sign-up" className="text-primary hover:underline text-sm">
              Don't have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground">Portfolio not found</p>
          {user && (
            <p className="text-sm text-muted-foreground mt-2">
              Set up your portfolio from the <a href="/admin" className="text-primary underline">admin panel</a>
            </p>
          )}
        </div>
      </div>
    );
  }

  return <PortfolioSite userId={profile.user_id} username={profile.username} />;
};

export default Index;
