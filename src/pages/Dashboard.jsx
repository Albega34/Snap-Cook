import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { userData, recentScans } from "../data/mockData";
import { Header } from "../components/layout/Header";
import { FoodSpinner } from "../components/ui/FoodSpinner";

export function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Phase 2 State
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);

  const navigate = useNavigate();

  // Phase 4 State
  const [shoppingList, setShoppingList] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [nutrition, setNutrition] = useState(userData);

  // Upload/Modal State
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tempDietPrefs, setTempDietPrefs] = useState({
    vegan: false,
    vegetarian: false,
    keto: false,
    glutenFree: false
  });

  useEffect(() => {
    // Fetch Recipes
    fetch("http://localhost:5000/api/recipes")
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setLoading(false);
        const total = data.reduce((acc, cur) => {
          acc.calories += (cur.calories || 0);
          acc.protein += (cur.protein || 0);
          acc.carbs += (cur.carbs || 0);
          acc.fats += (cur.fats || 0);
          return acc;
        }, { calories: 0, protein: 0, carbs: 0, fats: 0 });

        setNutrition(prev => ({
          calories: { ...prev.calories, current: total.calories },
          macros: {
            protein: { ...prev.macros.protein, current: total.protein },
            carbs: { ...prev.macros.carbs, current: total.carbs },
            fats: { ...prev.macros.fats, current: total.fats }
          }
        }));
      })
      .catch(err => { console.error("Failed to fetch recipes:", err); setLoading(false); });

    // Fetch User Profile
    fetch("http://localhost:5000/api/user/profile")
      .then(res => res.json())
      .then(data => {
        setUserProfile(data);
        fetchRecommendations(data.dietaryPreferences);
      });

    // Fetch Shopping List
    fetch("http://localhost:5000/api/shopping-list")
      .then(res => res.json())
      .then(data => setShoppingList(data.items || []))
      .catch(err => console.error("Shopping list err:", err));

    // Fetch Meal Plans
    fetch("http://localhost:5000/api/meal-plans")
      .then(res => res.json())
      .then(data => setMealPlans(data || []))
      .catch(err => console.error("Meal plans err:", err));
  }, []);

  const fetchRecommendations = (prefs) => {
    setRecsLoading(true);
    fetch("http://localhost:5000/api/recommendations/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dietaryPreferences: prefs })
    })
      .then(res => res.json())
      .then(data => {
        setRecommendations(data);
        setRecsLoading(false);
      })
      .catch(err => {
        console.error("Recs fetch err:", err);
        setRecsLoading(false);
      });
  };

  const toggleSaveRecipe = (recipeId) => {
    if (!userProfile) return;
    const isSaved = userProfile.savedRecipes?.includes(recipeId);
    const endpoint = isSaved ? "unsave-recipe" : "save-recipe";

    fetch(`http://localhost:5000/api/user/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId })
    })
      .then(res => res.json())
      .then(data => {
        setUserProfile(data);
      })
      .catch(err => console.error("Save error:", err));
  };

  const removeShoppingListItem = (itemId) => {
    fetch(`http://localhost:5000/api/shopping-list/${itemId}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(data => setShoppingList(data.items || []))
      .catch(err => console.error(err));
  };

  const savedList = recipes.filter(r => userProfile?.savedRecipes?.includes(r.id));
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const meals = ["Breakfast", "Lunch", "Dinner"];

  const getMealForSlot = (day, meal) => {
    return mealPlans.find(plan => plan.day === day && plan.meal === meal);
  };

  const [mealDay, setMealDay] = useState("Monday");
  const [mealType, setMealType] = useState("Lunch");
  const [mealRecipe, setMealRecipe] = useState("");

  const addMealPlan = () => {
    if (!mealRecipe) return;
    fetch("http://localhost:5000/api/meal-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day: mealDay, meal: mealType, recipeTitle: mealRecipe })
    })
      .then(res => res.json())
      .then(data => {
        setMealPlans(prev => [...prev, data]);
        setMealRecipe("");
      });
  };

  const handleImageSelection = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setTempDietPrefs({
      vegan: false,
      vegetarian: false,
      keto: false,
      glutenFree: false
    });
    setIsDietModalOpen(true);
  };

  const confirmScan = async () => {
    if (!selectedFile) return;
    setIsDietModalOpen(false);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("dietaryPreferences", JSON.stringify(tempDietPrefs));

    try {
      const res = await fetch("http://localhost:5000/api/scan", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        const newId = data.id;
        const imageUrl = data.image;

        recentScans.unshift({
          id: newId,
          title: "AI Scanned Dish",
          image: imageUrl
        });

        navigate(`/recipe/${newId}`);
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="font-body-md min-h-screen flex flex-col bg-background text-on-surface">
      <Header />

      <main className="mt-16 flex-grow w-full px-6 md:px-12 py-6">
        {/* Hero Section */}
        <section className="mb-12 relative rounded-[40px] overflow-hidden bg-primary min-h-[380px] flex items-center p-8 lg:p-16 shadow-xl">
          <div className="absolute inset-0 z-0">
            <img alt="Food background" className="w-full h-full object-cover" src="/foods/hero.png" />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-brand text-5xl md:text-6xl text-white mb-4 uppercase tracking-tighter leading-none">What's Cooking Today?</h1>
            <p className="font-body-lg text-blue-100 mb-10 leading-relaxed max-w-lg">Snap a photo of your ingredients and let AI reveal the magic within.</p>
            <div className="flex flex-wrap gap-5">
              <button className="bg-white text-primary px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                <span className="material-symbols-outlined">add_a_photo</span>
                Open Camera
              </button>
              <label className={`bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all ${isUploading ? 'opacity-70 cursor-wait' : 'hover:bg-white/20 active:scale-95 cursor-pointer'}`}>
                <span className="material-symbols-outlined">{isUploading ? 'refresh' : 'upload_file'}</span>
                {isUploading ? "Scanning..." : "Upload Image"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageSelection} disabled={isUploading} />
              </label>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <FoodSpinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-9 space-y-12">
                {/* Recent Scans */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black">Recent Scans</h2>
                    <Link to="#" className="text-sm font-bold text-primary hover:underline">View All</Link>
                  </div>
                  <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
                    {recipes.length > 0 ? recipes.slice(0, 12).map((recipe) => (
                      <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="flex-shrink-0 w-64 group">
                        <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden mb-4 shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-outline/10">
                          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                          <div className="absolute top-4 right-4 bg-primary px-3 py-1.5 rounded-xl text-[10px] font-black text-white shadow-xl">
                            {recipe.confidence}% Match
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                             <h5 className="font-bold text-lg text-white truncate mb-1">{recipe.title}</h5>
                             <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{recipe.cuisine}</p>
                          </div>
                        </div>
                      </Link>
                    )) : (
                      recentScans.map((scan) => (
                        <div key={scan.id} className="flex-shrink-0 w-56 opacity-60">
                          <div className="aspect-[4/5] rounded-[48px] bg-stone-100 overflow-hidden mb-3">
                             <img src={scan.image} className="w-full h-full object-cover grayscale" />
                          </div>
                          <p className="text-sm font-bold text-center">{scan.title}</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                {/* AI Recommendations */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-4xl">auto_awesome</span>
                      Personalized for You
                    </h2>
                    <button onClick={() => fetchRecommendations(userProfile?.dietaryPreferences)} className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary/10 transition-all">
                      <span className={`material-symbols-outlined ${recsLoading ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {recommendations.length > 0 ? recommendations.map((recipe, idx) => (
                      <div key={idx} className="bg-white rounded-[40px] p-0 shadow-sm border border-stone-300 hover:shadow-xl hover:-translate-y-2 transition-all relative overflow-hidden group">
                        <div className="relative aspect-video overflow-hidden">
                           <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent"></div>
                           <div className="absolute bottom-4 left-6">
                              <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-[10px] font-black text-white uppercase tracking-widest">Recommended</span>
                           </div>
                        </div>
                        <div className="p-8">
                          <h4 className="font-bold text-xl mb-3 pr-10 leading-tight group-hover:text-primary transition-colors">{recipe.title}</h4>
                          <p className="text-sm text-stone-400 mb-8 line-clamp-2 font-medium">{recipe.description}</p>
                          <div className="flex gap-3">
                            <button 
                              onClick={async () => {
                                // If it's a recommendation, we might need to generate it first
                                if (recipe.id.startsWith('rec-')) {
                                  setLoading(true);
                                  try {
                                    const res = await fetch("http://localhost:5000/api/search-generate", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ query: recipe.title })
                                    });
                                    const data = await res.json();
                                    if (res.ok) navigate(`/recipe/${data.id}`);
                                    else alert("Could not generate recipe");
                                  } catch (e) { alert("Server error"); }
                                  finally { setLoading(false); }
                                } else {
                                  navigate(`/recipe/${recipe.id}`);
                                }
                              }} 
                              className="flex-[3] py-4 bg-stone-100 hover:bg-primary hover:text-white font-black text-sm rounded-2xl transition-all"
                            >
                              View Recipe
                            </button>
                            <button onClick={() => toggleSaveRecipe(recipe.id)} className={`flex-1 h-14 flex items-center justify-center rounded-2xl transition-all ${userProfile?.savedRecipes?.includes(recipe.id) ? 'bg-red-50 text-red-500' : 'bg-stone-100 hover:text-red-500'}`}>
                              <span className="material-symbols-outlined" style={{ fontVariationSettings: userProfile?.savedRecipes?.includes(recipe.id) ? "'FILL' 1" : "" }}>favorite</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-20 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200 text-center">
                         <p className="text-stone-400 font-bold">Recommendations are loading...</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="lg:col-span-3 space-y-10">
                {/* Health Center */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-stone-400 px-2">Health Center</h3>
                  <div className="bg-gradient-to-br from-primary via-blue-600 to-indigo-700 p-8 rounded-[48px] text-white shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Calories</p>
                    <h3 className="text-4xl font-black mb-1">{nutrition?.calories?.current?.toLocaleString() || 0}</h3>
                    <p className="text-xs font-bold opacity-70 mb-6">kcal today</p>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(100, (nutrition?.calories?.current / (nutrition?.calories?.max || 2000)) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {['Protein', 'Carbs', 'Fats'].map(label => (
                      <div key={label} className="bg-white p-5 rounded-[32px] border border-stone-100 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-[10px] font-black text-stone-400 uppercase">{label}</p>
                          <h4 className="text-lg font-black">{nutrition?.macros?.[label.toLowerCase()]?.current || 0}g</h4>
                        </div>
                        <div className="h-1.5 bg-stone-50 rounded-full overflow-hidden">
                          <div className={`h-full ${label === 'Protein' ? 'bg-blue-500' : label === 'Carbs' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: '40%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Saved Recipes Widget */}
                <div className="bg-white p-7 rounded-[40px] shadow-sm border border-stone-100 transition-all">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-red-500" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                      Saved Recipes
                    </h3>
                    <span className="text-xs font-black bg-stone-50 px-2 py-1 rounded-lg text-stone-400">{savedList.length}</span>
                  </div>
                  {savedList.length > 0 ? (
                    <div className="space-y-4">
                      {savedList.slice(0, 3).map(recipe => (
                        <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="flex items-center gap-4 group">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                            <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold truncate text-on-surface group-hover:text-primary transition-colors">{recipe.title}</h4>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">{recipe.cuisine}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 font-bold text-center py-6">No saved recipes yet.</p>
                  )}
                </div>

                <div className="bg-stone-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary">shopping_basket</span>
                      Groceries
                    </h3>
                    {shoppingList.length > 0 ? (
                      <ul className="space-y-4 mb-8">
                        {shoppingList.slice(0, 4).map(item => (
                          <li key={item._id} className="flex justify-between items-center group">
                            <span className="text-sm text-stone-400 group-hover:text-white transition-colors">{item.name}</span>
                            <button onClick={() => removeShoppingListItem(item._id)} className="text-stone-600 hover:text-red-400">
                              <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-stone-400 mb-8 italic">Your list is empty.</p>
                    )}
                    <button onClick={() => navigate('/shopping-list')} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs transition-all border border-white/10">
                      View Full List
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Weekly Planner */}
            <section className="pt-20 border-t border-stone-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="text-4xl font-black mb-2 text-on-surface">Weekly Planner</h2>
                  <p className="text-sm text-stone-400 font-medium">Plan your meals and track your culinary schedule.</p>
                </div>
                <div className="flex gap-3 p-1.5 bg-white rounded-[28px] border border-stone-300 shadow-sm">
                  <input type="text" placeholder="Recipe name..." className="bg-transparent border-none outline-none px-6 text-sm font-bold w-56 text-on-surface placeholder:text-stone-300" value={mealRecipe} onChange={(e) => setMealRecipe(e.target.value)} />
                  <button onClick={addMealPlan} className="bg-primary text-white w-12 h-12 rounded-[22px] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-[48px] shadow-md border border-stone-300 overflow-x-auto scrollbar-hide">
                <div className="grid grid-cols-8 divide-x-2 divide-stone-200 min-w-[1200px]">
                  <div className="bg-stone-50/50 p-6 flex flex-col justify-around text-center border-r-2 border-stone-200">
                    <div className="h-10"></div>
                    {meals.map(m => (
                      <div key={m} className="h-32 flex items-center justify-center">
                         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-400 -rotate-90">{m}</span>
                      </div>
                    ))}
                  </div>
                  {days.map(day => (
                    <div key={day} className="col-span-1">
                      <div className="p-5 text-center border-b-2 border-stone-300 bg-stone-50/20">
                         <span className="text-sm font-black uppercase tracking-widest text-primary">{day.slice(0, 3)}</span>
                      </div>
                      {meals.map(meal => {
                        const plan = getMealForSlot(day, meal);
                        const mealColors = {
                          'Breakfast': 'bg-rose-50 border-rose-100 text-rose-600',
                          'Lunch': 'bg-orange-50 border-orange-100 text-orange-600',
                          'Dinner': 'bg-red-50 border-red-100 text-red-600'
                        };
                        const colorClass = mealColors[meal] || 'bg-stone-50 border-stone-100 text-stone-600';
                        
                        return (
                          <div key={meal} className="h-32 p-3 group border-b border-stone-50 last:border-b-0">
                            {plan ? (
                              <div className={`${colorClass} border rounded-[24px] p-4 h-full flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md`}>
                                <h6 className="text-[11px] font-black leading-tight line-clamp-2 uppercase tracking-tight">{plan.recipeTitle}</h6>
                                <div className="flex justify-between items-center">
                                   <span className="text-[9px] font-black uppercase opacity-60">{meal}</span>
                                   <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                </div>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-stone-100 rounded-[24px] h-full flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all cursor-pointer hover:bg-stone-50" onClick={() => { setMealDay(day); setMealType(meal); }}>
                                <span className="material-symbols-outlined text-stone-300">add_circle</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="mt-20 py-20 bg-stone-50 border-t border-stone-200">
        <div className="w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-12">
          <h2 className="text-4xl font-brand text-primary uppercase tracking-tighter">Snapcook</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">© 2026 Snapcook AI</p>
        </div>
      </footer>

      {isDietModalOpen && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] p-10 shadow-2xl border border-stone-100">
            <h3 className="text-3xl font-black mb-2">Refine Your Recipe</h3>
            <p className="text-stone-400 text-sm mb-10">Select your dietary preferences.</p>
            <div className="grid grid-cols-2 gap-4 mb-12">
              {Object.keys(tempDietPrefs).map(diet => (
                <button key={diet} onClick={() => setTempDietPrefs(prev => ({ ...prev, [diet]: !prev[diet] }))} className={`py-5 rounded-2xl text-xs font-black capitalize border-2 ${tempDietPrefs[diet] ? 'bg-primary border-primary text-white' : 'bg-white border-stone-100 text-stone-400'}`}>{diet}</button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsDietModalOpen(false)} className="flex-1 font-bold text-stone-400">Cancel</button>
              <button onClick={confirmScan} className="flex-[2] py-5 bg-primary text-white rounded-3xl font-black">Generate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
