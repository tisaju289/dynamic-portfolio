import { Facebook, Instagram, Globe, Mail } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useSocialLinks } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = { Facebook, Instagram, Globe, Mail };

const defaultLinks = [
  { icon: Facebook, label: "Facebook", href: "https://web.facebook.com/mk.kopil.71" },
  { icon: Mail, label: "Email", href: "mailto:contact.mkkopil@gmail.com" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Globe, label: "Behance", href: "#" },
];

const Footer = () => {
  const { t } = useLang();
  const { data: dbLinks } = useSocialLinks();

  const links = dbLinks && dbLinks.length > 0
    ? dbLinks.map((l: any) => ({ icon: iconMap[l.icon_name] || Globe, label: l.platform, href: l.url }))
    : defaultLinks;

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4 text-center">
        <a href="#home" className="text-2xl font-bold gradient-text inline-block mb-6">MK Kopil</a>
        <div className="flex justify-center gap-4 mb-6">
          {links.map((s: any) => (
            <a key={s.label} href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={s.label} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:gradient-bg hover:text-primary-foreground transition-all duration-200">
              <s.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p className="text-muted-foreground text-sm">© 2026 MK Kopil | {t("সর্বস্বত্ব সংরক্ষিত", "All Rights Reserved")}</p>
        <p className="text-muted-foreground text-xs mt-3">{t("ডেভেলপ করেছেন", "Developed by")} <a href="https://tisaju.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Tajul Islam Saju</a></p>
      </div>
    </footer>
  );
};

export default Footer;
