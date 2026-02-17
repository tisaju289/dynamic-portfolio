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
import { useSiteSettings, useProfileByUsername } from "@/hooks/useSiteContent";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

const DEMO_USER_ID = "d79f99e7-f381-45e6-9896-a5f3f4fbe4eb";
const DEMO_USERNAME = "sajufeni";

const useProfileByUserId = (userId: string | undefined) =>
  useQuery({
    queryKey: ["profile_by_uid", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).single();
      return data;
    },
    enabled: !!userId,
  });

const Index = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();

  // If root URL and user is logged in, show their portfolio
  const { data: ownProfile } = useProfileByUserId(!username ? user?.id : undefined);

  const resolvedUsername = username || ownProfile?.username || DEMO_USERNAME;
  const { data: profile, isLoading, isError } = useProfileByUsername(resolvedUsername);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError || !profile) {
    if (!username) {
      return <PortfolioSite userId={DEMO_USER_ID} username={DEMO_USERNAME} />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground">Portfolio not found</p>
        </div>
      </div>
    );
  }

  return <PortfolioSite userId={profile.user_id} username={profile.username} />;
};

export default Index;
