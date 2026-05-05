import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-end overflow-hidden bg-[#A90409]">

      {/* Background Text - Refined Scale and Spacing */}
      <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden select-none pointer-events-none">
        <h1 className="text-[25vw] font-bold text-white leading-[0.85] tracking-[0.02em] opacity-100 uppercase transform scale-y-125 translate-y-[-12%]" style={{ fontFamily: "'Anton', sans-serif" }}>
          EAT UP
        </h1>
      </div>

      {/* Foreground Content */}
      <div className="w-full relative z-10 flex flex-col items-center justify-end h-full">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-full max-w-[1600px] flex flex-col items-center"
        >
          {/* Main Burger Image - Flush with bottom */}
          <div className="relative w-full translate-y-[10%]">
            <img
              src="/burger.png"
              alt="Perfect Burger"
              className="w-full h-auto object-contain drop-shadow-[0_45px_45px_rgba(0,0,0,0.3)]"
            />

            {/* Content Over the Burger - Precise Typography Match */}
            <div className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-[340px] md:w-[450px] text-center space-y-6 z-50">
              <p className="text-white text-[11px] md:text-[13px] font-normal leading-relaxed opacity-90 [text-shadow:_0_1px_3px_rgba(0,0,0,0.3)]">
                Deep inside our wonderful world of vertical farms, freshness runs free, bland gets banished, and smart produce secures the future of food.
              </p>
              
              <Link 
                to="/dashboard"
                className="inline-block bg-white text-black px-8 py-2 rounded-sm font-bold text-[9px] uppercase tracking-[0.1em] hover:bg-stone-100 transition-all shadow-xl active:scale-95"
              >
                Discover Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
