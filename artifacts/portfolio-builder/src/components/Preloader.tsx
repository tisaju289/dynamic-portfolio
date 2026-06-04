import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteContent";

const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            {(settings as any)?.logo_url ? (
              <img src={(settings as any).logo_url} alt="Logo" className="w-16 h-16 object-contain rounded-xl" />
            ) : (
              <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
                MK
              </div>
            )}
            <h2 className="text-xl font-bold text-heading">{settings?.site_name || "MK Kopil"}</h2>
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full gradient-bg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
