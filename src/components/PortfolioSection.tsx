import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import alifClothing from "@/assets/portfolio/alif-clothing.png";
import rareZone from "@/assets/portfolio/rare-zone.jpg";
import uddoktaDigital from "@/assets/portfolio/uddokta-digital.png";
import uddoktaMedia from "@/assets/portfolio/uddokta-media.png";
import vishuddhaBazar from "@/assets/portfolio/vishuddha-bazar.png";
import waziCollection from "@/assets/portfolio/wazi-collection.png";

const PortfolioSection = () => {
  const { t } = useLang();
  const [active, setActive] = useState(t("সকল", "All"));
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const categories = [t("সকল", "All"), "Logo", "Branding", "Social Media", "Print"];

  const projects = [
    { id: 1, title: "Alif Clothing", category: "Logo", image: alifClothing, description: t("ফ্যাশন ব্র্যান্ডের জন্য মডার্ন লোগো ডিজাইন", "Modern logo design for a fashion brand") },
    { id: 2, title: "Rare Zone", category: "Branding", image: rareZone, description: t("শপিং ব্র্যান্ডের জন্য এলিগ্যান্ট ব্র্যান্ড আইডেন্টিটি", "Elegant brand identity for a shopping brand") },
    { id: 3, title: "Uddokta Digital Solution", category: "Logo", image: uddoktaDigital, description: t("ডিজিটাল এজেন্সির জন্য প্রফেশনাল লোগো", "Professional logo for a digital agency") },
    { id: 4, title: "Uddokta Media Solution", category: "Logo", image: uddoktaMedia, description: t("মিডিয়া কোম্পানির জন্য গ্র্যাডিয়েন্ট লোগো ডিজাইন", "Gradient logo design for a media company") },
    { id: 5, title: "Vishuddha Bazar", category: "Branding", image: vishuddhaBazar, description: t("ই-কমার্স ব্র্যান্ডের জন্য ক্রিয়েটিভ ব্র্যান্ডিং", "Creative branding for an e-commerce brand") },
    { id: 6, title: "Wazi Collection", category: "Logo", image: waziCollection, description: t("ক্লোদিং ব্র্যান্ডের জন্য ইউনিক লোগো", "Unique logo for a clothing brand") },
  ];

  const allLabel = categories[0];
  const filtered = active === allLabel ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading">
            {t("আমার কাজসমূহ", "My Portfolio")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("সাম্প্রতিক কিছু প্রজেক্ট", "Some recent projects")}</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
                active === cat
                  ? "gradient-bg text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              layout
              onClick={() => setSelectedProject(p)}
              className="glass rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              <div className="aspect-square bg-muted overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-primary mb-1 block">{p.category}</span>
                <h3 className="font-bold">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-w-3xl w-full glass rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full max-h-[60vh] object-contain bg-muted" />
              <div className="p-6">
                <span className="text-xs font-medium text-primary mb-1 block">{selectedProject.category}</span>
                <h3 className="text-xl font-bold mb-2">{selectedProject.title}</h3>
                <p className="text-muted-foreground">{selectedProject.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
