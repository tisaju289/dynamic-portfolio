import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";

const categories = ["সকল", "Logo", "Branding", "Social Media", "Print"];

const placeholderProjects = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `প্রজেক্ট ${i + 1}`,
  category: categories[1 + (i % 4)],
}));

const PortfolioSection = () => (
  <section id="portfolio" className="py-24">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          আমার <span className="gradient-text">কাজসমূহ</span>
        </h2>
        <p className="text-muted-foreground text-lg">সাম্প্রতিক কিছু প্রজেক্ট</p>
      </motion.div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 active:scale-95 ${
              i === 0 ? "gradient-bg text-primary-foreground shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Placeholder grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {placeholderProjects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="glass rounded-2xl overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
          >
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <div className="p-5">
              <span className="text-xs font-medium text-primary mb-1 block">{p.category}</span>
              <h3 className="font-bold">{p.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-muted-foreground mt-8 text-sm">
        🔗 Lovable Cloud সংযুক্ত করার পর এখানে আসল প্রজেক্ট দেখা যাবে
      </p>
    </div>
  </section>
);

export default PortfolioSection;
