import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useTestimonials } from "@/hooks/useSiteContent";

const defaultTestimonials = [
  { name_bn: "রহিম আহমেদ", name_en: "Rahim Ahmed", role_bn: "ব্যবসায়ী", role_en: "Businessman", text_bn: "MK Kopil আমার কোম্পানির লোগো ডিজাইন করেছেন। অসাধারণ কাজ!", text_en: "MK Kopil designed my company's logo. Amazing work!", rating: 5 },
  { name_bn: "সাবরিনা খান", name_en: "Sabrina Khan", role_bn: "উদ্যোক্তা", role_en: "Entrepreneur", text_bn: "সোশ্যাল মিডিয়া কনটেন্ট ডিজাইনে দারুণ দক্ষ। সময়মতো ডেলিভারি দেন।", text_en: "Excellent at social media content design. Delivers on time.", rating: 5 },
  { name_bn: "কামাল হোসেন", name_en: "Kamal Hossain", role_bn: "মার্কেটিং ম্যানেজার", role_en: "Marketing Manager", text_bn: "ব্র্যান্ডিং প্রজেক্টে চমৎকার কাজ করেছেন। অত্যন্ত প্রফেশনাল।", text_en: "Did excellent work on the branding project. Highly professional.", rating: 5 },
];

const TestimonialsSection = () => {
  const { t } = useLang();
  const { data: dbTestimonials } = useTestimonials();

  const testimonials = dbTestimonials && dbTestimonials.length > 0
    ? dbTestimonials.map((item: any) => ({ name: t(item.name_bn || "", item.name_en || ""), role: t(item.role_bn || "", item.role_en || ""), text: t(item.text_bn || "", item.text_en || ""), rating: item.rating || 5 }))
    : defaultTestimonials.map((item) => ({ name: t(item.name_bn, item.name_en), role: t(item.role_bn, item.role_en), text: t(item.text_bn, item.text_en), rating: item.rating }));

  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading">{t("ক্লায়েন্ট মতামত", "Client Testimonials")}</h2>
          <p className="text-muted-foreground text-lg">{t("যারা আমার সাথে কাজ করেছেন", "Those who have worked with me")}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((item: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="glass rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => <Star key={j} className="w-4 h-4 fill-accent text-accent" />)}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">"{item.text}"</p>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
