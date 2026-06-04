import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteContent";

const WhatsAppButton = () => {
  const { data: settings } = useSiteSettings();
  const number = settings?.whatsapp_number || "8801634124689";

  return (
    <motion.a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.4, ease: "backOut" }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 active:scale-95"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
};

export default WhatsAppButton;
