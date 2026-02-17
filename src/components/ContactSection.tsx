import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { t } = useLang();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = t("নাম আবশ্যক", "Name is required");
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = t("সঠিক ইমেইল দিন", "Enter a valid email");
    if (!form.message.trim()) errs.message = t("মেসেজ আবশ্যক", "Message is required");
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim().slice(0, 100),
      email: form.email.trim().slice(0, 255),
      message: form.message.trim().slice(0, 1000),
    });

    if (error) {
      toast({ title: t("ত্রুটি", "Error"), description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }
    setSending(false);
  };

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.5 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading">{t("যোগাযোগ করুন", "Contact Me")}</h2>
          <p className="text-muted-foreground text-lg">{t("আপনার প্রজেক্ট নিয়ে আলোচনা করতে চাইলে মেসেজ করুন", "Send a message to discuss your project")}</p>
          <p className="text-muted-foreground mt-2">{t("ইমেইল", "Email")}: <a href="mailto:contact.mkkopil@gmail.com" className="text-primary hover:underline">contact.mkkopil@gmail.com</a></p>
        </motion.div>

        {submitted ? (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
            <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-2">{t("ধন্যবাদ!", "Thank You!")}</h3>
            <p className="text-muted-foreground">{t("আপনার মেসেজ পাঠানো হয়েছে। শীঘ্রই যোগাযোগ করা হবে।", "Your message has been sent. We'll get back to you soon.")}</p>
            <button onClick={() => setSubmitted(false)} className="mt-6 text-primary font-medium hover:underline">{t("আবার মেসেজ করুন", "Send Another Message")}</button>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
            {(["name", "email", "message"] as const).map((field) => (
              <div key={field} className="relative">
                <label className="block text-sm font-medium mb-2 text-foreground">
                  {field === "name" ? t("নাম", "Name") : field === "email" ? t("ইমেইল", "Email") : t("মেসেজ", "Message")}
                </label>
                {field === "message" ? (
                  <textarea value={form[field]} onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: "" }); }} rows={5} maxLength={1000} className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none" />
                ) : (
                  <input type={field === "email" ? "email" : "text"} value={form[field]} onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: "" }); }} maxLength={field === "email" ? 255 : 100} className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                )}
                {errors[field] && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1">{errors[field]}</motion.p>}
              </div>
            ))}
            <button type="submit" disabled={sending} className="w-full gradient-bg text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50">
              <Send className="w-4 h-4" />
              {sending ? t("পাঠানো হচ্ছে...", "Sending...") : t("মেসেজ পাঠান", "Send Message")}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
