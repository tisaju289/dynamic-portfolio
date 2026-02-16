import { motion } from "framer-motion";
import { Palette, Layers, Share2, Printer } from "lucide-react";

const skills = [
  { icon: Palette, title: "Logo Design", desc: "ইউনিক ও মনে রাখার মতো লোগো তৈরি" },
  { icon: Layers, title: "Brand Identity", desc: "সম্পূর্ণ ব্র্যান্ড ভিজ্যুয়াল সিস্টেম" },
  { icon: Share2, title: "Social Media Creative", desc: "আকর্ষণীয় সোশ্যাল মিডিয়া কনটেন্ট" },
  { icon: Printer, title: "Print & Marketing", desc: "প্রফেশনাল প্রিন্ট ম্যাটেরিয়াল ডিজাইন" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const AboutSection = () => (
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
          আমার সম্পর্কে
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          আমি MK Kopil, একজন অভিজ্ঞ গ্রাফিক্স ডিজাইনার। বিগত কয়েক বছর ধরে আমি বিভিন্ন ব্র্যান্ড ও ব্যবসার জন্য
          প্রফেশনাল ভিজ্যুয়াল আইডেন্টিটি তৈরি করে আসছি। আমার লক্ষ্য হলো প্রতিটি প্রজেক্টে ক্রিয়েটিভিটি ও
          প্রফেশনালিজমের সমন্বয় ঘটানো।
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

export default AboutSection;
