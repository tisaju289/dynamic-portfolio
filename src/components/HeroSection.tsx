import { motion } from "framer-motion";
import heroImage from "@/assets/mk-kopil.png";

const HeroSection = () => {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="order-1"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              আমি{" "}
              <span className="gradient-text">MK Kopil</span>
              <br />
              একজন পেশাদার গ্রাফিক্স ডিজাইনার
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
              লোগো ডিজাইন, ব্র্যান্ডিং, সোশ্যাল মিডিয়া ক্রিয়েটিভ ও প্রিন্ট ডিজাইনে অভিজ্ঞ। আপনার ব্র্যান্ডকে ভিজ্যুয়ালভাবে আলাদা করে তুলতে আমি প্রস্তুত।
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("#portfolio")}
                className="gradient-bg text-primary-foreground px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                আমার কাজ দেখুন
              </button>
              <button
                onClick={() => scrollTo("#contact")}
                className="border border-primary/30 text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-all duration-200 active:scale-95"
              >
                যোগাযোগ করুন
              </button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]">
              <div className="absolute inset-0 gradient-bg rounded-3xl rotate-6 opacity-20" />
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={heroImage}
                  alt="MK Kopil - গ্রাফিক্স ডিজাইনার"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
