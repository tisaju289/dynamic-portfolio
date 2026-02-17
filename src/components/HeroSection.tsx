import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import heroImage from "@/assets/mk-kopil.png";
import illustratorLogo from "@/assets/icons/illustrator.png";
import photoshopLogo from "@/assets/icons/photoshop.png";
import { useLang } from "@/context/LanguageContext";
import { useHeroContent, useSiteSettings } from "@/hooks/useSiteContent";

const floatingIcons = [
  { img: illustratorLogo, label: "Illustrator", delay: 0 },
  { img: photoshopLogo, label: "Photoshop", delay: 0.3 },
];

const HeroSection = () => {
  const { t } = useLang();
  const { data: hero } = useHeroContent();
  const { data: settings } = useSiteSettings();
  const [roleIndex, setRoleIndex] = useState(0);

  const defaultRolesBn = ["গ্রাফিক্স ডিজাইনার", "লোগো ডিজাইনার", "ব্র্যান্ড এক্সপার্ট", "ক্রিয়েটিভ আর্টিস্ট"];
  const defaultRolesEn = ["Graphics Designer", "Logo Designer", "Brand Expert", "Creative Artist"];

  const rolesBn = hero?.roles_bn?.length ? hero.roles_bn : defaultRolesBn;
  const rolesEn = hero?.roles_en?.length ? hero.roles_en : defaultRolesEn;
  const roles = t(rolesBn.join("||"), rolesEn.join("||")).split("||");

  const name = hero?.name || "MK Kopil";
  const imgSrc = hero?.image_url || heroImage;
  const cvUrl = settings?.cv_url || "/mk-kopil-cv.pdf";

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [roles.length]);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-2 lg:order-1 flex flex-col items-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              {hero?.subtitle_bn || hero?.subtitle_en
                ? t(hero.subtitle_bn || "", hero.subtitle_en || "")
                : <>{t("আমি", "I'm")} </>}
              {" "}
              <span className="gradient-text">{name}</span>
              <br />
              {t("একজন পেশাদার", "A Professional")}{" "}
              <span className="relative inline-block min-w-[200px] md:min-w-[280px]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="gradient-text inline-block"
                  >
                    {roles[roleIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto leading-relaxed">
              {t(
                "লোগো ডিজাইন, ব্র্যান্ডিং, সোশ্যাল মিডিয়া ক্রিয়েটিভ ও প্রিন্ট ডিজাইনে অভিজ্ঞ। আপনার ব্র্যান্ডকে ভিজ্যুয়ালভাবে আলাদা করে তুলতে আমি প্রস্তুত।",
                "Experienced in logo design, branding, social media creatives & print design. I'm ready to make your brand visually stand out."
              )}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => scrollTo("#portfolio")} className="gradient-bg text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95">
                {t("আমার কাজ দেখুন", "View My Work")}
              </button>
              <button onClick={() => scrollTo("#contact")} className="border border-primary/30 text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all duration-200 active:scale-95">
                {t("যোগাযোগ করুন", "Contact Me")}
              </button>
              <a href={cvUrl} download className="flex items-center gap-2 border border-accent/30 text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/10 transition-all duration-200 active:scale-95">
                <Download className="w-4 h-4" />
                {t("CV ডাউনলোড", "Download CV")}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]">
              <div className="absolute inset-0 gradient-bg rounded-3xl rotate-6 opacity-20" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <img src={imgSrc} alt={`${name} - Graphics Designer`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
              {floatingIcons.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + item.delay, duration: 0.4, ease: "backOut" }} className="absolute" style={{ right: i === 1 ? "-16px" : "auto", left: i === 0 ? "-16px" : "auto", top: i === 1 ? "10%" : "auto", bottom: i === 0 ? "15%" : "auto" }}>
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: "easeInOut" }} className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-card/80 backdrop-blur-sm shadow-lg flex items-center justify-center p-2">
                    <img src={item.img} alt={item.label} className="w-full h-full object-contain" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
