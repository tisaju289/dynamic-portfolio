import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <main className="min-h-screen">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <PortfolioSection />
    <TestimonialsSection />
    <ContactSection />
    <Footer />
  </main>
);

export default Index;
