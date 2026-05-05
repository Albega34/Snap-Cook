import { Link } from "react-router-dom";
import { Hero } from "../components/sections/Hero";

export function Landing() {
  return (
    <main className="h-screen w-screen bg-[#A90409] text-white font-sans selection:bg-red-200 selection:text-red-900 relative overflow-hidden">
      
      <header className="absolute top-0 left-0 right-0 z-50 py-10 px-10">
        <div className="flex justify-center items-center w-full">
          <div className="text-3xl font-bold tracking-[0.05em]" style={{ fontFamily: "'Anton', sans-serif" }}>
            SNAPCOOK
          </div>
        </div>
      </header>

      <Hero />
    </main>
  );
}
