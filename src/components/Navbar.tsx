import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useLang } from "@/context/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteContent";

const Navbar = () => {
  const { lang, toggleLang, t } = useLang();
  const { data: settings } = useSiteSettings();
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: t("হোম", "Home"), href: "#home" },
    { label: t("আমার সম্পর্কে", "About"), href: "#about" },
    { label: t("সেবাসমূহ", "Services"), href: "#services" },
    { label: t("আমার কাজসমূহ", "Portfolio"), href: "#portfolio" },
    { label: t("যোগাযোগ", "Contact"), href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = navItems.map((i) => i.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(`#${sections[i]}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lang]);

  const handleClick = (href: string) => {
    setMobileOpen(false);
    setActive(href);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <a href="#home" onClick={() => handleClick("#home")} className="flex items-center gap-2 text-xl font-bold text-heading">
          {(settings as any)?.logo_url && (
            <img src={(settings as any).logo_url} alt="Logo" className="w-8 h-8 object-contain rounded" />
          )}
          {settings?.site_name || "MK Kopil"}
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href} className="relative">
              <button
                onClick={() => handleClick(item.href)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  active === item.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {active === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 gradient-bg rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200 text-xs font-semibold"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            {lang === "bn" ? "EN" : "বাং"}
          </button>
          <ThemeToggle />
          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/50 overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => handleClick(item.href)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active === item.href
                        ? "gradient-bg text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
