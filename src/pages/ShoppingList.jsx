import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { motion, AnimatePresence } from "framer-motion";

export function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/shopping-list");
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/shopping-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [newItem.trim()] })
      });
      const data = await res.json();
      setItems(data.items);
      setNewItem("");
    } catch (err) {
      console.error("Add item err:", err);
    }
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/shopping-list/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      setItems(data.items);
    } catch (err) {
      console.error("Remove item err:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md">
      <Header />
      
      <main className="mt-20 md:mt-24 max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <header className="mb-10 md:mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-brand uppercase tracking-tighter text-primary mb-2 md:mb-4">Grocery List</h1>
          <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px]">Your Culinary Inventory</p>
        </header>

        {/* Add Item Section */}
        <section className="mb-8 md:mb-12">
          <form onSubmit={addItem} className="flex flex-col sm:flex-row gap-3 md:gap-4 p-1.5 md:p-2 bg-white rounded-2xl md:rounded-[32px] border border-stone-300 shadow-xl shadow-primary/5">
            <input 
              type="text" 
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add fresh ingredients..." 
              className="flex-grow bg-transparent border-none outline-none px-4 md:px-8 py-3 md:py-4 text-base md:text-lg font-bold text-on-surface placeholder:text-stone-300"
            />
            <button 
              type="submit"
              className="bg-primary text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-[24px] font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              Add Item
            </button>
          </form>
        </section>

        {/* Items List */}
        <div className="bg-white rounded-[32px] md:rounded-[48px] border border-stone-300 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 md:py-20 text-center">
               <div className="animate-spin text-primary mb-4">
                  <span className="material-symbols-outlined text-3xl md:text-4xl">refresh</span>
               </div>
               <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px] md:text-xs">Fetching your list...</p>
            </div>
          ) : items.length > 0 ? (
            <div className="divide-y divide-stone-100">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group flex items-center justify-between p-5 md:p-8 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-stone-200 flex items-center justify-center group-hover:border-primary transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-primary text-sm md:text-base scale-0 group-hover:scale-100 transition-transform">check</span>
                      </div>
                      <span className="text-base md:text-xl font-bold text-on-surface truncate max-w-[180px] sm:max-w-none">{item.name}</span>
                    </div>
                    <button 
                      onClick={() => removeItem(item._id)}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <span className="material-symbols-outlined text-xl md:text-2xl">delete</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-24 md:py-32 text-center px-6">
               <span className="material-symbols-outlined text-5xl md:text-6xl text-stone-200 mb-4 md:mb-6">shopping_basket</span>
               <h3 className="text-xl md:text-2xl font-black mb-2">Empty Basket</h3>
               <p className="text-stone-400 text-sm md:text-medium">Your pantry is waiting for new ingredients.</p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {items.length > 0 && (
          <footer className="mt-8 md:mt-12 flex justify-between items-center px-4 md:px-8">
            <p className="text-[10px] md:text-xs font-black text-stone-400 uppercase tracking-widest">{items.length} Items Total</p>
            <button className="text-primary font-black text-[10px] md:text-xs uppercase tracking-widest hover:underline">Clear Completed</button>
          </footer>
        )}
      </main>
    </div>
  );
}
