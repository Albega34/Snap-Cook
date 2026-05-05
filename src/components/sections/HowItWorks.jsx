import { motion } from "framer-motion";
import { UploadCloud, ScanLine, ChefHat } from "lucide-react";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload Image",
    description: "Snap a fresh photo or upload any food picture from your gallery.",
    color: "bg-blue-100 text-blue-500"
  },
  {
    icon: ScanLine,
    title: "AI Detects Food",
    description: "Our advanced vision models identify the exact dish and its ingredients.",
    color: "bg-orange-100 text-orange-500"
  },
  {
    icon: ChefHat,
    title: "Get Recipe",
    description: "Receive step-by-step cooking instructions and tailored recommendations.",
    color: "bg-green-100 text-green-500"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 relative z-10 bg-white/40 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">How It Works</h2>
          <p className="text-lg text-slate-600">Three simple steps to unlock the culinary secrets of any meal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${step.color}`}>
                <step.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
