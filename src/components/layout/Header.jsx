import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearching(true);
      try {
        const res = await fetch("http://localhost:5000/api/search-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery.trim() })
        });
        const data = await res.json();
        if (res.ok) {
          navigate(`/recipe/${data.id}`);
          setSearchQuery("");
        } else {
          alert(data.message || "Failed to generate recipe");
        }
      } catch (err) {
        console.error("Search error:", err);
        alert("Server error while searching");
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/90 backdrop-blur-xl border-b border-outline/50 shadow-sm shadow-slate-900/5 transition-colors">
      <div className="flex justify-between items-center h-16 px-6 md:px-12 w-full mx-auto">
        <div className="flex items-center gap-10">
          <Link to="/" className="text-3xl font-brand uppercase tracking-tighter text-primary">
            Snapcook
          </Link>
          <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium tracking-tight">
            <Link 
              className={`pb-1 border-b-2 transition-colors ${currentPath === '/dashboard' ? 'text-primary border-primary' : 'text-stone-600 dark:text-stone-400 border-transparent hover:text-primary'}`} 
              to="/dashboard"
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative group">
            <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isSearching ? 'text-primary animate-spin' : 'text-on-surface-variant group-focus-within:text-primary group-focus-within:scale-110'}`}>
              {isSearching ? 'refresh' : 'search'}
            </span>
            <input 
              className="bg-stone-100 border border-stone-200 rounded-2xl py-3 pl-12 pr-12 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary w-80 transition-all disabled:opacity-50 text-stone-900 placeholder:text-stone-400 outline-none shadow-sm hover:shadow-md focus:shadow-lg focus:bg-white" 
              placeholder={isSearching ? "Cooking up your recipe..." : "Search for any dish (e.g. Pizza)"} 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              disabled={isSearching}
            />
            {searchQuery && !isSearching && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
            {!isSearching && searchQuery && (
               <span className="absolute right-12 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary/40 uppercase tracking-widest hidden group-focus-within:block">Enter</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2.5 hover:bg-primary/10 rounded-xl transition-all active:scale-95 text-stone-600 dark:text-stone-300 group"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="material-symbols-outlined transition-transform duration-500 group-hover:rotate-12">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button className="ml-1 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-transform hidden sm:flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40">
              <span className="material-symbols-outlined text-sm">camera</span>
              Snap Food
            </button>
            <div className="w-9 h-9 rounded-full bg-surface-variant ml-2 overflow-hidden border border-outline/20">
              <img alt="User Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
