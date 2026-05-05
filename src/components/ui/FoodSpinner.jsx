import React from 'react';

export function FoodSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Center Item */}
        <div className="absolute z-10 bg-surface dark:bg-slate-900 rounded-full p-2 shadow-lg border border-outline dark:border-slate-800">
          <span className="material-symbols-outlined text-4xl text-primary block">
            restaurant_menu
          </span>
        </div>
        
        {/* Rotating Container */}
        <div className="absolute inset-0 animate-spin flex items-center justify-center" style={{ animationDuration: '4s', animationTimingFunction: 'linear' }}>
          {/* Top */}
          <span className="material-symbols-outlined text-2xl text-orange-500 absolute -top-2 left-1/2 -translate-x-1/2">
            local_pizza
          </span>
          {/* Bottom */}
          <span className="material-symbols-outlined text-2xl text-green-500 absolute -bottom-2 left-1/2 -translate-x-1/2">
            lunch_dining
          </span>
          {/* Left */}
          <span className="material-symbols-outlined text-2xl text-yellow-500 absolute left-0 top-1/2 -translate-y-1/2">
            ramen_dining
          </span>
          {/* Right */}
          <span className="material-symbols-outlined text-2xl text-red-500 absolute right-0 top-1/2 -translate-y-1/2">
            bakery_dining
          </span>
        </div>
      </div>
      <p className="mt-6 text-sm font-bold text-outline animate-pulse tracking-widest uppercase">
        Cooking up data...
      </p>
    </div>
  );
}
