import { LanguageProvider } from "@/context/LanguageContext";
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
import { useSiteSettings } from "@/hooks/useSiteContent";

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
  const order = (settings as any)?.section_order || DEFAULT_ORDER;

  return (
    <>
      {order.map((key: string) => {
        const Comp = sectionComponents[key];
        return Comp ? <Comp key={key} /> : null;
      })}
    </>
  );
};

const Index = () => (
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
);

export default Index;
