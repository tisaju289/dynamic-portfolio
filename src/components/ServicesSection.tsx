import { motion } from "framer-motion";
import { PenTool, Figma, Instagram, FileText } from "lucide-react";

const services = [
  {
    icon: PenTool,
    title: "Logo Design",
    desc: "আপনার ব্র্যান্ডের জন্য ইউনিক, আধুনিক এবং প্রফেশনাল লোগো ডিজাইন যা আপনার ব্যবসাকে আলাদা করবে।",
  },
  {
    icon: Figma,
    title: "Brand Identity Design",
    desc: "সম্পূর্ণ ব্র্যান্ড গাইডলাইন — কালার প্যালেট, টাইপোগ্রাফি, বিজনেস কার্ড এবং স্টেশনারি ডিজাইন।",
  },
  {
    icon: Instagram,
    title: "Social Media Content",
    desc: "Facebook, Instagram ও অন্যান্য প্ল্যাটফর্মের জন্য আকর্ষণীয় ও এনগেজিং কনটেন্ট ডিজাইন।",
  },
  {
    icon: FileText,
    title: "Print & Marketing",
    desc: "ব্রোশিউর, ফ্লায়ার, ব্যানার, পোস্টার ও অন্যান্য মার্কেটিং ম্যাটেরিয়াল ডিজাইন।",
  },
];

const ServicesSection = () => (
  <section id="services" className="py-24 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          আমার <span className="gradient-text">সেবাসমূহ</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          আপনার ব্র্যান্ডের প্রয়োজন অনুযায়ী প্রফেশনাল ডিজাইন সেবা
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {services.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
            className="gradient-border glass rounded-2xl p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-default"
          >
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

export default ServicesSection;
