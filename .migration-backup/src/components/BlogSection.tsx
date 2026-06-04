import { motion } from "framer-motion";
import { Calendar, ArrowRight, Facebook, MessageCircle, Link2 } from "lucide-react";
import DOMPurify from "dompurify";
import { useLang } from "@/context/LanguageContext";
import { useBlogPosts } from "@/hooks/useSiteContent";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const BlogSection = () => {
  const { t } = useLang();
  const { data: posts } = useBlogPosts();
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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
              className="glass rounded-2xl overflow-hidden group hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedPost(post)}
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
                  {t(post.excerpt_bn, post.excerpt_en)}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  {t("বিস্তারিত দেখুন", "Read More")}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
          <ScrollArea className="max-h-[90vh]">
            {selectedPost?.cover_image_url && (
              <img
                src={selectedPost.cover_image_url}
                alt={t(selectedPost.title_bn, selectedPost.title_en)}
                className="w-full aspect-video object-cover"
              />
            )}
            <div className="p-6">
              <DialogHeader>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Calendar className="w-3 h-3" />
                  {selectedPost && new Date(selectedPost.created_at).toLocaleDateString(t("bn-BD", "en-US"), { year: "numeric", month: "long", day: "numeric" })}
                </div>
                <DialogTitle className="text-xl md:text-2xl font-bold">
                  {selectedPost && t(selectedPost.title_bn, selectedPost.title_en)}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1">
                  {selectedPost && t(selectedPost.excerpt_bn, selectedPost.excerpt_en)}
                </DialogDescription>
              </DialogHeader>
              <div 
                className="mt-4 text-sm leading-relaxed text-foreground prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost ? DOMPurify.sanitize(t(selectedPost.content_bn, selectedPost.content_en) || "") : "" }}
              />
              {selectedPost && (
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{t("শেয়ার করুন:", "Share:")}</span>
                  <button
                    onClick={() => {
                      const title = t(selectedPost.title_bn, selectedPost.title_en);
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(title)}`, "_blank", "width=600,height=400");
                    }}
                    className="p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      const title = t(selectedPost.title_bn, selectedPost.title_en);
                      window.open(`https://wa.me/?text=${encodeURIComponent(title + " " + window.location.href)}`, "_blank");
                    }}
                    className="p-2 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success(t("লিংক কপি হয়েছে!", "Link copied!"));
                    }}
                    className="p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                    aria-label="Copy link"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BlogSection;
