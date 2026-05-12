import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { FoodSpinner } from "../components/ui/FoodSpinner";

const API_URL = import.meta.env.VITE_API_URL;

export function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    // Fetch Recipe
    fetch(`${API_URL}/recipes/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Recipe not found");
        return res.json();
      })
      .then(data => {
        setRecipe(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Fetch User Profile to check if saved
    fetch(`${API_URL}/user/profile`)
      .then(res => res.json())
      .then(data => {
        setUserProfile(data);
        if (data.savedRecipes?.includes(id)) {
          setIsSaved(true);
        }
      });
  }, [id]);

  const toggleSave = () => {
    const endpoint = isSaved ? "unsave-recipe" : "save-recipe";
    fetch(`${API_URL}/user/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: id })
    })
    .then(res => res.json())
    .then(data => {
      setIsSaved(!isSaved);
      setUserProfile(data);
    })
    .catch(err => console.error("Save err:", err));
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSubstitutes, setShowSubstitutes] = useState({});

  const toggleSubstitutes = (e, idx) => {
    e.stopPropagation();
    setShowSubstitutes(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const speakRecipe = () => {
    if (!recipe) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const textToSpeak = `Recipe for ${recipe.title}. Ingredients: ${recipe.ingredients.map(i => i.name).join(', ')}. Instructions: ${recipe.instructions.map(i => 'Step ' + i.step + ', ' + i.desc).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const [addedToList, setAddedToList] = useState(false);

  const addToShoppingList = () => {
    if (!recipe) return;
    const items = recipe.ingredients.map(ing => ing.name);
    fetch(`${API_URL}/shopping-list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items })
    })
    .then(res => res.json())
    .then(data => {
      setAddedToList(true);
      setTimeout(() => setAddedToList(false), 2000);
    });
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16 bg-background"><FoodSpinner /></div>;
  if (!recipe) return <div className="p-20 text-center pt-32">Recipe not found</div>;

  return (
    <div className="font-body-md text-on-surface bg-[#FDFDFD] min-h-screen transition-colors duration-300">
      <Header />

      <main className="pt-20 md:pt-24 pb-20 px-4 md:px-12 max-w-[1500px] mx-auto">
        {/* Refined Hero Section */}
        <div className="relative w-full rounded-[32px] md:rounded-[48px] overflow-hidden mb-8 md:mb-12 min-h-[400px] md:min-h-[500px] lg:min-h-[600px] shadow-2xl group">
          <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" src={recipe.image} alt={recipe.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {recipe.tags?.map((tag, i) => (
                  <span key={i} className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary/20 backdrop-blur-md text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-brand text-white mb-4 md:mb-6 leading-[1.1] md:leading-[0.9] tracking-tighter uppercase">
                {recipe.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm md:text-base">timer</span>
                  <span className="font-bold text-sm md:text-base">{recipe.time} <small className="text-[9px] md:text-[10px] opacity-60">MIN</small></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm md:text-base">local_fire_department</span>
                  <span className="font-bold text-sm md:text-base">{recipe.calories} <small className="text-[9px] md:text-[10px] opacity-60">KCAL</small></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-400 text-sm md:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-bold text-sm md:text-base">{recipe.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4">
               <button onClick={speakRecipe} className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${isSpeaking ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}>
                  <span className="material-symbols-outlined text-xl md:text-2xl">{isSpeaking ? 'stop_circle' : 'volume_up'}</span>
               </button>
               <button onClick={toggleSave} className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all ${isSaved ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}`}>
                  <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "" }}>favorite</span>
               </button>
               <button className="flex-grow md:flex-grow-0 bg-primary text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 md:gap-3">
                  <span className="material-symbols-outlined text-xl">play_circle</span>
                  Start Cooking
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar: Ingredients & Macros */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Macro Visualization */}
            <section className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-300">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-8">Vitality Index</h3>
               <div className="grid grid-cols-3 gap-4">
                  {['Protein', 'Carbs', 'Fats'].map((macro) => (
                    <div key={macro} className="text-center">
                       <div className="relative w-full aspect-square mb-3">
                          <svg className="w-full h-full -rotate-90">
                             <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-stone-50" />
                             <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="100 100" strokeDashoffset="40" className={macro === 'Protein' ? 'text-blue-500' : macro === 'Carbs' ? 'text-emerald-500' : 'text-amber-500'} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                             <span className="text-sm font-black">{recipe[macro.toLowerCase()]}</span>
                             <span className="text-[8px] font-bold text-stone-400 uppercase">grams</span>
                          </div>
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">{macro}</span>
                    </div>
                  ))}
               </div>
            </section>

            {/* Ingredients Section */}
            <section className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-300">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black">Pantry</h3>
                <span className="px-3 py-1 bg-stone-50 rounded-lg text-[10px] font-black uppercase tracking-widest">{recipe.servings} Servings</span>
              </div>
              <div className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="group">
                    <div 
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${checkedIngredients[idx] ? 'bg-stone-50' : 'bg-white border border-stone-50 hover:border-primary/20 hover:bg-stone-50'}`}
                    >
                      <div className="flex items-center gap-4">
                         <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checkedIngredients[idx] ? 'bg-primary border-primary' : 'border-stone-200'}`}>
                            {checkedIngredients[idx] && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
                         </div>
                         <span className={`text-sm font-bold ${checkedIngredients[idx] ? 'line-through text-stone-300' : 'text-stone-700'}`}>{ing.name}</span>
                      </div>
                      {ing.substitutes?.length > 0 && (
                         <button onClick={(e) => toggleSubstitutes(e, idx)} className="text-stone-300 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-lg">swap_horiz</span>
                         </button>
                      )}
                    </div>
                    {showSubstitutes[idx] && (
                       <div className="mt-2 ml-10 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-top-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">Alternatives</p>
                          <div className="flex flex-wrap gap-2">
                             {ing.substitutes.map(s => <span key={s} className="px-2 py-1 bg-white rounded-lg text-[10px] font-bold shadow-sm">{s}</span>)}
                          </div>
                       </div>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={addToShoppingList} className={`w-full mt-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${addedToList ? 'bg-emerald-500 text-white' : 'bg-stone-900 text-white hover:opacity-90'}`}>
                {addedToList ? 'Added to List ✓' : 'Add to Groceries'}
              </button>
            </section>
          </div>

          {/* Content: Instructions & Culture */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            
            {/* Steps Section */}
            <section className="bg-white p-8 md:p-10 rounded-[32px] md:rounded-[48px] shadow-sm border border-stone-200">
               <h3 className="text-2xl md:text-3xl font-black mb-8 md:mb-12">Instructions</h3>
               <div className="space-y-8 md:space-y-10">
                  {recipe.instructions.map((step, idx) => (
                    <div key={idx} className="flex gap-8 group">
                       <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center font-black text-stone-400 group-hover:bg-primary group-hover:text-white transition-all">
                             {step.step}
                          </div>
                          {idx !== recipe.instructions.length - 1 && (
                            <div className="w-px flex-grow bg-stone-100 my-2"></div>
                          )}
                       </div>
                       <div className="pb-10">
                          <div className="flex justify-between items-center mb-3">
                             <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{step.title}</h4>
                             <span className="px-2 py-1 bg-stone-50 rounded-md text-[9px] font-black uppercase tracking-widest text-stone-400">{step.time}</span>
                          </div>
                          <p className="text-stone-500 leading-relaxed text-lg">{step.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* History & Trends */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <section className="bg-white p-10 rounded-[48px] shadow-sm border border-stone-300">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Origins</h3>
                  <p className="text-lg leading-relaxed text-stone-500 italic mb-8">"{recipe.history?.story}"</p>
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-xl overflow-hidden border border-stone-300">
                        <img src={recipe.history?.image || recipe.image} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black uppercase opacity-40">Heritage Rank</p>
                        <p className="text-xl font-black text-on-surface">{recipe.history?.rank || '#1 Trending'}</p>
                     </div>
                  </div>
               </section>

               <section className="bg-white p-10 rounded-[48px] shadow-sm border border-stone-300">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-8">Global Trends</h3>
                  <div className="space-y-6">
                     {(recipe.trends || []).map((trend, i) => (
                       <div key={i} className="flex flex-col gap-2">
                          <div className="flex justify-between text-[11px] font-bold">
                             <span className="text-on-surface">{trend.flag} {trend.country}</span>
                             <span className="text-primary">{trend.consumption}%</span>
                          </div>
                          <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden">
                             <div className="h-full bg-primary" style={{ width: `${trend.consumption}%` }}></div>
                          </div>
                       </div>
                     ))}
                  </div>
               </section>
            </div>
          </div>
        </div>
      </main>

      {/* Simplified FAB */}
      <button onClick={() => navigate('/dashboard')} className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl">add_a_photo</span>
      </button>
    </div>
  );
}
