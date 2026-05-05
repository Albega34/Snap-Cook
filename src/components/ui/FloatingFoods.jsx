import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

const FOOD_ITEMS = [
  { id: "burger", src: "/foods/burger.png", size: "w-40 md:w-56", top: "10%", left: "15%", speed: 7, z: 10 },
  { id: "pizza", src: "/foods/pizza.png", size: "w-32 md:w-48", top: "50%", left: "5%", speed: 9, z: 5 },
  { id: "ramen", src: "/foods/ramen.png", size: "w-36 md:w-52", top: "70%", left: "40%", speed: 8, z: 20 },
  { id: "paneer", src: "/foods/paneer.png", size: "w-28 md:w-44", top: "20%", left: "50%", speed: 6, z: 15 },
  { id: "sushi", src: "/foods/sushi.png", size: "w-24 md:w-36", top: "80%", left: "10%", speed: 10, z: 8 },
  { id: "donut", src: "/foods/donut.png", size: "w-24 md:w-36", top: "40%", left: "70%", speed: 7, z: 25 },
  { id: "ice_cream", src: "/foods/ice_cream.png", size: "w-28 md:w-40", top: "15%", left: "80%", speed: 9, z: 12 },
];

export function FloatingFoods() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalize to -1 to 1
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
      {FOOD_ITEMS.map((item, i) => {
        // Different parallax factors for depth
        const parallaxFactor = (item.z / 10) * 30; 
        
        const x = useTransform(smoothX, [-1, 1], [-parallaxFactor, parallaxFactor]);
        const y = useTransform(smoothY, [-1, 1], [-parallaxFactor, parallaxFactor]);

        return (
          <motion.div
            key={item.id}
            className={`absolute ${item.size}`}
            style={{
              top: item.top,
              left: item.left,
              zIndex: item.z,
              x,
              y,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, i % 2 === 0 ? 5 : -5, 0],
            }}
            transition={{
              duration: item.speed,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <img 
              src={item.src} 
              alt={item.id} 
              className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]"
              loading="lazy"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
