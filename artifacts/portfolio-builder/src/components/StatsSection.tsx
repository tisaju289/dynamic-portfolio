import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Users, Briefcase, Award, Star, Target, TrendingUp, Heart, Zap } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useStats } from "@/hooks/useSiteContent";

const iconMap: Record<string, any> = { Users, Briefcase, Award, Star, Target, TrendingUp, Heart, Zap };

const CountUp = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const StatsSection = () => {
  const { t } = useLang();
  const { data: stats } = useStats();

  const items = stats && stats.length > 0
    ? stats.map((s: any) => ({ icon: iconMap[s.icon_name] || Star, value: s.value, suffix: s.suffix || "+", label: t(s.label_bn || "", s.label_en || "") }))
    : [
        { icon: Users, value: 50, suffix: "+", label: t("সন্তুষ্ট ক্লায়েন্ট", "Happy Clients") },
        { icon: Briefcase, value: 100, suffix: "+", label: t("সম্পন্ন প্রজেক্ট", "Projects Done") },
        { icon: Award, value: 3, suffix: "+", label: t("বছরের অভিজ্ঞতা", "Years Experience") },
        { icon: Star, value: 30, suffix: "+", label: t("৫ স্টার রিভিউ", "5 Star Reviews") },
      ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="glass rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {items.map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-3 gradient-bg rounded-xl flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-heading mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
