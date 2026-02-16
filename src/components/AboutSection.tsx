import { motion } from "framer-motion";
import { Palette, Layers, Share2, Printer } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const AboutSection = () => {
  const { t } = useLang();

  const skills = [
    { icon: Palette, title: "Logo Design", desc: t("ইউনিক ও মনে রাখার মতো লোগো তৈরি", "Creating unique & memorable logos") },
    { icon: Layers, title: "Brand Identity", desc: t("সম্পূর্ণ ব্র্যান্ড ভিজ্যুয়াল সিস্টেম", "Complete brand visual system") },
    { icon: Share2, title: "Social Media Creative", desc: t("আকর্ষণীয় সোশ্যাল মিডিয়া কনটেন্ট", "Engaging social media content") },
    { icon: Printer, title: "Print & Marketing", desc: t("প্রফেশনাল প্রিন্ট ম্যাটেরিয়াল ডিজাইন", "Professional print material design") },
  ];

  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-heading">
            {t("আমার সম্পর্কে", "About Me")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t(
              "আমি MK Kopil, একজন অভিজ্ঞ গ্রাফিক্স ডিজাইনার। বিগত কয়েক বছর ধরে আমি বিভিন্ন ব্র্যান্ড ও ব্যবসার জন্য প্রফেশনাল ভিজ্যুয়াল আইডেন্টিটি তৈরি করে আসছি। আমার লক্ষ্য হলো প্রতিটি প্রজেক্টে ক্রিয়েটিভিটি ও প্রফেশনালিজমের সমন্বয় ঘটানো।",
              "I'm MK Kopil, an experienced graphics designer. Over the past few years, I've been creating professional visual identities for various brands and businesses. My goal is to combine creativity and professionalism in every project."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="glass rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-14 h-14 mx-auto mb-4 gradient-bg rounded-xl flex items-center justify-center">
                <skill.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">{skill.title}</h3>
              <p className="text-muted-foreground text-sm">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
