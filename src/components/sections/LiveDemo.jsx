import { motion } from "framer-motion";
import { Upload, ArrowRight, Star } from "lucide-react";
import { MagneticButton } from "../ui/MagneticButton";

export function LiveDemo() {
  return (
    <section className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-br from-orange-500 to-coral-600 rounded-[3rem] p-10 md:p-20 text-white relative shadow-2xl overflow-hidden">
          
          {/* Decorative background shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">See the magic happen.</h2>
              <p className="text-xl text-orange-100 mb-10 leading-relaxed">
                Upload an image right now and let our AI show you the recipe in seconds.
              </p>
              
              <div className="border-2 border-dashed border-white/40 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="w-20 h-20 bg-white text-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Drop your image here</h3>
                <p className="text-orange-200">or click to browse from your device</p>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative">
              <motion.div 
                className="bg-white text-slate-800 rounded-3xl p-6 shadow-2xl relative z-20 mx-auto max-w-sm"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative rounded-2xl overflow-hidden h-48 mb-6 bg-slate-100 flex items-center justify-center">
                  <img src="/foods/paneer.png" alt="Paneer result" className="w-40 object-contain drop-shadow-xl" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 flex items-center gap-1">
                    <Star size={12} className="fill-green-600" /> 99.8% Match
                  </div>
                </div>
                <h4 className="text-2xl font-bold mb-2">Paneer Butter Masala</h4>
                <div className="flex gap-2 mb-6">
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Indian</span>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">Vegetarian</span>
                  <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">45 mins</span>
                </div>
                <button className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors">
                  View Full Recipe <ArrowRight size={18} />
                </button>
              </motion.div>

              {/* Behind card decorative floating element */}
              <motion.div 
                className="absolute -top-10 -right-10 bg-yellow-400 text-yellow-900 font-bold px-6 py-4 rounded-3xl shadow-xl z-10 rotate-12"
                animate={{ y: [0, -10, 0], rotate: [12, 15, 12] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨ AI Magic!
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
