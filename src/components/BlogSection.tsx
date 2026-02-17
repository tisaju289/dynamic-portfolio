import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useBlogPosts } from "@/hooks/useSiteContent";
import { useState } from "react";

const BlogSection = () => {
  const { t } = useLang();
  const { data: posts } = useBlogPosts();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!posts || posts.length === 0) return null;

  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading">{t("ব্লগ ও আর্টিকেল", "Blog & Articles")}</h2>
          <p className="text-muted-foreground text-lg">{t("টিপস, টিউটোরিয়াল ও ইনসাইট", "Tips, tutorials & insights")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any, i: number) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              {post.cover_image_url && (
                <div className="aspect-video bg-muted overflow-hidden">
                  <img src={post.cover_image_url} alt={t(post.title_bn, post.title_en)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.created_at).toLocaleDateString(t("bn-BD", "en-US"), { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{t(post.title_bn, post.title_en)}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {expandedId === post.id ? t(post.content_bn, post.content_en) : t(post.excerpt_bn, post.excerpt_en)}
                </p>
                <button
                  onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {expandedId === post.id ? t("সংক্ষেপ", "Show Less") : t("আরো পড়ুন", "Read More")}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
