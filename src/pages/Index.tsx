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

const Index = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading, isError } = useProfileByUsername(username);

  if (!username) {
    // Home page - show a directory or redirect
    return <HomeDirectory />;
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
        </div>
      </div>
    );
  }

  return <PortfolioSite userId={profile.user_id} username={profile.username} />;
};

// Simple home page that lists all portfolios
const HomeDirectory = () => {
  const { data: profiles = [], isLoading } = useAllProfilesFromHook();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">Portfolio Directory</h1>
        <p className="text-muted-foreground text-center mb-12">Browse portfolios</p>
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {profiles.map((p: any) => (
              <a
                key={p.id}
                href={`/${p.username}`}
                className="glass rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 block text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-primary">
                  {(p.display_name || p.username).charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-lg">{p.display_name || p.username}</h3>
                <p className="text-sm text-muted-foreground mt-1">@{p.username}</p>
              </a>
            ))}
            {profiles.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No portfolios yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Import inside the component to avoid circular deps
import { useAllProfiles as useAllProfilesFromHook } from "@/hooks/useSiteContent";

export default Index;
