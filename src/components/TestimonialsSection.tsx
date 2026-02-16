import { motion } from "framer-motion";
import { Star } from "lucide-react";

const placeholderTestimonials = [
  { name: "রহিম আহমেদ", role: "ব্যবসায়ী", text: "MK Kopil আমার কোম্পানির লোগো ডিজাইন করেছেন। অসাধারণ কাজ!", rating: 5 },
  { name: "সাবরিনা খান", role: "উদ্যোক্তা", text: "সোশ্যাল মিডিয়া কনটেন্ট ডিজাইনে দারুণ দক্ষ। সময়মতো ডেলিভারি দেন।", rating: 5 },
  { name: "কামাল হোসেন", role: "মার্কেটিং ম্যানেজার", text: "ব্র্যান্ডিং প্রজেক্টে চমৎকার কাজ করেছেন। অত্যন্ত প্রফেশনাল।", rating: 5 },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="py-24 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          ক্লায়েন্ট মতামত
        </h2>
        <p className="text-muted-foreground text-lg">যারা আমার সাথে কাজ করেছেন</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {placeholderTestimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
            <div>
              <p className="font-bold">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
