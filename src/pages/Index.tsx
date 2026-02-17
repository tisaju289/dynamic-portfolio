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

// Landing page with demo + CTA
const HomeDirectory = () => {
  const { data: profiles = [], isLoading } = useAllProfilesFromHook();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">Folio</span>
          <a
            href="/admin/login"
            className="gradient-bg text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
          >
            Login / Sign Up
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Build Your <span className="text-primary">Portfolio</span> in Minutes
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Create a stunning personal portfolio website. Customize everything — hero, about, projects, testimonials & more. No coding needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/admin/login"
              className="gradient-bg text-primary-foreground px-8 py-3.5 rounded-xl text-base font-bold hover:shadow-xl transition-all"
            >
              Get Started Free
            </a>
            <a
              href="#portfolios"
              className="border border-border bg-muted/50 text-foreground px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-muted transition-all"
            >
              Browse Portfolios
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Choose Folio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🎨", title: "Fully Customizable", desc: "Theme colors, fonts, section order — make it truly yours." },
              { icon: "🌐", title: "Bilingual Support", desc: "Built-in Bengali & English language toggle for global reach." },
              { icon: "⚡", title: "Instant Setup", desc: "Sign up, fill in your details, and your portfolio is live." },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-8 text-center hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Directory */}
      <section id="portfolios" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Live Portfolios</h2>
          <p className="text-muted-foreground text-center mb-12">See what others have built</p>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Folio. All rights reserved.
      </footer>
    </div>
  );
};

// Import inside the component to avoid circular deps
import { useAllProfiles as useAllProfilesFromHook } from "@/hooks/useSiteContent";

export default Index;
