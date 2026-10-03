'use client';

import React from 'react';
import { SortMode } from '../types/frontend';

interface MacDockProps {
  activeCategory: string;
  onToggleCategory: () => void;
  isCategoryOpen: boolean;
  
  sortMode: SortMode;
  onToggleTrending: () => void;
  
  onOpenSearch: () => void;
  
  activeDiscount: number;
  onToggleDiscount: () => void;
  isDiscountOpen: boolean;
}

export default function MacDock({
  activeCategory,
  onToggleCategory,
  isCategoryOpen,
  sortMode,
  onToggleTrending,
  onOpenSearch,
  activeDiscount,
  onToggleDiscount,
  isDiscountOpen,
}: MacDockProps) {
  const isTrendingActive = sortMode === 'trending';
  const isCategoryFiltered = activeCategory !== 'all';
  const isDiscountFiltered = activeDiscount > 0;

  return (
    <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 select-none">
      <nav
        role="navigation"
        aria-label="Bottom Nav Menu"
        className="flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4.5 py-2 rounded-[24px] glass-dock bg-white/85 backdrop-blur-2xl shadow-xl border border-white/85"
      >
        {/* 1. Deals (Category Drawer Trigger) */}
        <button
          onClick={onToggleCategory}
          className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 min-w-[44px] sm:min-w-[48px]"
          title="Browse Deals by Category"
          aria-expanded={isCategoryOpen}
        >
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] sm:rounded-[16px] flex items-center justify-center shadow-sm transition-all duration-200 ${
              isCategoryOpen || isCategoryFiltered
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white ring-2 ring-blue-400 ring-offset-1 shadow-md shadow-blue-500/25'
                : 'bg-gradient-to-tr from-blue-500 to-sky-400 text-white group-hover:shadow-md'
            }`}
          >
            {isCategoryOpen || isCategoryFiltered ? (
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </div>
          <span className={`text-[10px] sm:text-[11px] mt-1 transition-colors ${
            isCategoryFiltered || isCategoryOpen ? 'font-black text-zinc-950' : 'font-bold text-zinc-700'
          }`}>
            Deals
          </span>
          {(isCategoryFiltered || isCategoryOpen) && (
            <span className="mt-0.5 h-0.5 w-5 bg-blue-600 rounded-full animate-in fade-in duration-200"></span>
          )}
        </button>

        {/* 2. Trending Deals Button */}
        <button
          onClick={onToggleTrending}
          className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 min-w-[44px] sm:min-w-[48px]"
          title="Toggle Trending Deals"
          aria-pressed={isTrendingActive}
        >
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] sm:rounded-[16px] flex items-center justify-center shadow-sm transition-all duration-200 ${
              isTrendingActive
                ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white ring-2 ring-orange-400 ring-offset-1 shadow-md shadow-orange-500/25'
                : 'bg-gradient-to-tr from-orange-500 to-amber-400 text-white group-hover:shadow-md'
            }`}
          >
            {isTrendingActive ? (
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 23c6.075 0 11-4.925 11-11 0-4.14-2.29-7.75-5.7-9.64-.46-.26-1.02.09-.98.62.19 2.51-.76 4.96-2.58 6.64-1.32-2.15-2.06-4.67-2.14-7.27-.02-.55-.61-.89-1.07-.61C7.26 3.73 5 7.6 5 12c0 2.22.67 4.28 1.81 6.01L6.1 19.34C4.81 17.38 4 15.01 4 12.48c0-.49-.55-.78-.94-.48C1.86 12.91 1 14.85 1 17c0 3.31 2.69 6 6 6h5z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            )}
          </div>
          <span className={`text-[10px] sm:text-[11px] mt-1 transition-colors ${
            isTrendingActive ? 'font-black text-zinc-950' : 'font-bold text-zinc-700'
          }`}>
            Trending
          </span>
          {isTrendingActive && (
            <span className="mt-0.5 h-0.5 w-5 bg-orange-600 rounded-full animate-in fade-in duration-200"></span>
          )}
        </button>

        {/* 3. Search Button (Spotlight Modal Trigger) */}
        <button
          onClick={onOpenSearch}
          className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 min-w-[44px] sm:min-w-[48px]"
          title="Search Drops (Cmd+K)"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] sm:rounded-[16px] bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:from-purple-500 group-hover:to-indigo-400 transition-all duration-200">
            <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-[10px] sm:text-[11px] font-bold text-zinc-700 mt-1">
            Search
          </span>
        </button>

        {/* 4. Coupons & Discount Popover Button */}
        <button
          onClick={onToggleDiscount}
          className="group relative flex flex-col items-center focus:outline-none transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 min-w-[44px] sm:min-w-[48px]"
          title="Filter by Coupon & Discount %"
          aria-expanded={isDiscountOpen}
        >
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] sm:rounded-[16px] flex items-center justify-center shadow-sm transition-all duration-200 ${
              isDiscountOpen || isDiscountFiltered
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white ring-2 ring-emerald-400 ring-offset-1 shadow-md shadow-emerald-500/25'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-white group-hover:shadow-md'
            }`}
          >
            {isDiscountOpen || isDiscountFiltered ? (
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.97 2.59a1.5 1.5 0 00-1.06-.44H4.5A2.5 2.5 0 002 4.65v7.41c0 .4.16.78.44 1.06l8.89 8.89a2.5 2.5 0 003.54 0l6.13-6.13a2.5 2.5 0 000-3.54L12.97 2.59zM6.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            )}
          </div>
          <span className={`text-[10px] sm:text-[11px] mt-1 transition-colors ${
            isDiscountFiltered || isDiscountOpen ? 'font-black text-zinc-950' : 'font-bold text-zinc-700'
          }`}>
            {activeDiscount > 0 ? `${activeDiscount}%+` : 'Coupons'}
          </span>
          {(isDiscountFiltered || isDiscountOpen) && (
            <span className="mt-0.5 h-0.5 w-5 bg-emerald-600 rounded-full animate-in fade-in duration-200"></span>
          )}
        </button>
      </nav>
    </div>
  );
}
