'use client';

import React from 'react';

interface HeaderNavProps {
  onOpenSearch: () => void;
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  totalDeals: number;
  categories: string[];
}

export default function HeaderNav({
  onOpenSearch,
  activeCategory,
  onSelectCategory,
  totalDeals,
  categories,
}: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#F8F5F0]/85 backdrop-blur-xl border-b border-black/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-12 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Editorial Monogram */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-2 sm:gap-2.5 focus:outline-none group text-left"
          >
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-zinc-950 text-white flex items-center justify-center font-serif text-sm sm:text-lg font-bold shadow-md group-hover:bg-zinc-800 transition-colors">
              D
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-zinc-950 leading-none">
                  DealDrop
                </span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <p className="text-[8px] sm:text-[10px] text-zinc-500 font-sans tracking-wide uppercase font-semibold leading-tight mt-0.5">
                Anti-Spam Discovery
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic Category Quick Filters (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-black/5'
            }`}
          >
            All Products
          </button>

          {categories.slice(0, 4).map((cat) => {
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-black/5'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>

        {/* Right Search Action & Live Drops Count */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>{totalDeals} Products</span>
          </div>

          <button
            onClick={onOpenSearch}
            className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white hover:bg-zinc-50 border border-black/12 text-zinc-800 hover:text-zinc-950 text-sm font-bold shadow-sm hover:shadow-md backdrop-blur-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4 sm:w-4 sm:h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] font-mono text-zinc-500 border border-zinc-300">⌘K</kbd>
          </button>
        </div>

      </div>
    </header>
  );
}
