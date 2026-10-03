'use client';

import React, { useRef, useEffect } from 'react';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  categoryCounts: Record<string, number>;
}

export default function CategoryDrawer({
  isOpen,
  onClose,
  activeCategory,
  onSelectCategory,
  categoryCounts,
}: CategoryDrawerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = Object.keys(categoryCounts);
  const totalCount = Object.values(categoryCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        ref={containerRef}
        className="glass-panel rounded-[24px] p-4 shadow-2xl border border-white/90 bg-white/90 backdrop-blur-2xl text-zinc-900"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-base">🗂️</span>
            <span className="font-bold text-sm text-zinc-900">Browse Deals & Categories</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {/* All Drops Option */}
          <button
            onClick={() => {
              onSelectCategory('all');
              onClose();
            }}
            className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
              activeCategory === 'all'
                ? 'bg-zinc-900 text-white font-bold shadow-md'
                : 'bg-zinc-100/70 hover:bg-zinc-200/80 text-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-base">✨</span>
              <span className="text-xs font-semibold truncate">All Deals</span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${
                activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-black/5 text-zinc-600'
              }`}
            >
              {totalCount}
            </span>
          </button>

          {/* Dynamic DB Categories */}
          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            const isSelected = activeCategory.toLowerCase() === cat.toLowerCase();

            return (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-zinc-900 text-white font-bold shadow-md'
                    : 'bg-zinc-100/70 hover:bg-zinc-200/80 text-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-xs font-semibold truncate">{cat}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ml-1 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-zinc-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {activeCategory !== 'all' && (
          <div className="mt-3 pt-3 border-t border-black/[0.06] text-center">
            <button
              onClick={() => {
                onSelectCategory('all');
                onClose();
              }}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 underline underline-offset-2"
            >
              Reset to All Deals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
