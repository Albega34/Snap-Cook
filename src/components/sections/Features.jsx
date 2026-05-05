import { motion } from "framer-motion";
import { Zap, Target, BookOpen, Sparkles } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "99% AI Accuracy",
    description: "Trained on millions of culinary images to recognize even the most obscure regional dishes."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Results delivered in under a second. No waiting around while your food gets cold."
  },
  {
    icon: BookOpen,
    title: "Authentic Recipes",
    description: "Get traditional, verified recipes from top chefs and grandmas alike."
  },
  {
    icon: Sparkles,
    title: "Smart Alternatives",
    description: "Missing an ingredient? Our AI suggests perfect substitutes instantly."
  }
];

export function Features() {
  return (
    <section className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Why SnapAndCook?</h2>
          <p className="text-lg text-slate-600">Built with cutting-edge vision AI to deliver an unparalleled cooking experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start gap-6 p-8 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <feature.icon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
