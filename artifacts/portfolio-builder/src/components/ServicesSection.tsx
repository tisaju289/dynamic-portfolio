import { motion } from "framer-motion";
import { PenTool, Figma, Instagram, FileText } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useServices } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = { PenTool, Figma, Instagram, FileText };

const defaultServices = [
  { icon: PenTool, title: "Logo Design", desc_bn: "আপনার ব্র্যান্ডের জন্য ইউনিক, আধুনিক এবং প্রফেশনাল লোগো ডিজাইন যা আপনার ব্যবসাকে আলাদা করবে।", desc_en: "Unique, modern and professional logo design for your brand that will set your business apart." },
  { icon: Figma, title: "Brand Identity Design", desc_bn: "সম্পূর্ণ ব্র্যান্ড গাইডলাইন — কালার প্যালেট, টাইপোগ্রাফি, বিজনেস কার্ড এবং স্টেশনারি ডিজাইন।", desc_en: "Complete brand guidelines — color palette, typography, business cards and stationery design." },
  { icon: Instagram, title: "Social Media Content", desc_bn: "Facebook, Instagram ও অন্যান্য প্ল্যাটফর্মের জন্য আকর্ষণীয় ও এনগেজিং কনটেন্ট ডিজাইন।", desc_en: "Attractive & engaging content design for Facebook, Instagram and other platforms." },
  { icon: FileText, title: "Print & Marketing", desc_bn: "ব্রোশিউর, ফ্লায়ার, ব্যানার, পোস্টার ও অন্যান্য মার্কেটিং ম্যাটেরিয়াল ডিজাইন।", desc_en: "Brochure, flyer, banner, poster and other marketing material design." },
];

const ServicesSection = () => {
  const { t } = useLang();
  const { data: dbServices } = useServices();

  const services = dbServices && dbServices.length > 0
    ? dbServices.map((s: any) => ({ icon: iconMap[s.icon_name] || PenTool, title: s.title, desc: t(s.description_bn || "", s.description_en || "") }))
    : defaultServices.map((s) => ({ icon: s.icon, title: s.title, desc: t(s.desc_bn, s.desc_en) }));

  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading">{t("আমার সেবাসমূহ", "My Services")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("আপনার ব্র্যান্ডের প্রয়োজন অনুযায়ী প্রফেশনাল ডিজাইন সেবা", "Professional design services tailored to your brand's needs")}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((s: any, i: number) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }} className="gradient-border glass rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mb-5">
                <s.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
