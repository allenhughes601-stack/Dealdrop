'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DealProduct, SearchMode } from '../types/frontend';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: DealProduct[];
  onSelectCategory: (category: string) => void;
}

const STORAGE_KEY = 'dealdrop_search_history';

export default function SearchModal({
  isOpen,
  onClose,
  products,
  onSelectCategory,
}: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('deals');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from user browser (localStorage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setHistory(parsed);
        }
      } catch (err) {
        console.warn('Failed to load search history from localStorage:', err);
      }
    }
  }, [isOpen]);

  // Save search query to history in localStorage
  const saveToHistory = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;

    const updated = [trimmed, ...history.filter(h => h.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
    setHistory(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save search history to localStorage:', err);
      }
    }
  };

  // Remove single history item
  const removeHistoryItem = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(h => h !== term);
    setHistory(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to update search history:', err);
      }
    }
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.warn('Failed to clear search history:', err);
      }
    }
  };

  // Focus input when opened and listen to keyboard shortcuts
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract unique categories and merchants from database products
  const uniqueCategories = Array.from(new Set(products.map(p => p.category.split(',')[0]))).filter(Boolean);
  const uniqueMerchants = Array.from(new Set(products.map(p => p.merchant || p.network_id.split('-')[0]))).filter(Boolean);

  // Filter products based on search mode and query
  const trimmedQuery = query.toLowerCase().trim();
  const hasActiveQuery = trimmedQuery.length > 0;

  const filteredProducts = products.filter(p => {
    if (selectedMerchant !== 'all' && (p.merchant || p.network_id) !== selectedMerchant) {
      return false;
    }

    if (!hasActiveQuery) return false; // When query is empty, do not dump database products

    if (mode === 'deals') {
      return (
        p.title.toLowerCase().includes(trimmedQuery) ||
        (p.description && p.description.toLowerCase().includes(trimmedQuery)) ||
        p.category.toLowerCase().includes(trimmedQuery)
      );
    } else if (mode === 'categories') {
      return p.category.toLowerCase().includes(trimmedQuery);
    } else if (mode === 'merchants') {
      return (
        (p.merchant && p.merchant.toLowerCase().includes(trimmedQuery)) ||
        p.network_id.toLowerCase().includes(trimmedQuery)
      );
    }
    return true;
  });

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = query.trim();
      if (trimmed) {
        saveToHistory(trimmed);
        onClose();
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  const handleSelectHistory = (term: string) => {
    saveToHistory(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleNavigateToSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    saveToHistory(trimmed);
    onClose();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Deep Backdrop Blur Overlay */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xl transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Spotlight Search Modal Box */}
      <div className="relative w-full max-w-2xl bg-[#121316]/95 backdrop-blur-3xl border border-white/15 rounded-[28px] shadow-2xl text-white overflow-hidden z-10 transition-all scale-100">
        
        {/* Top Search Bar Row */}
        <div className="p-4 sm:p-5 pb-3">
          <div className="flex items-center gap-3 bg-[#1c1e24] border border-white/10 rounded-2xl px-4 py-3 shadow-inner">
            {/* Search Magnifying Glass */}
            <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            {/* Live Search Input */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDownInput}
              placeholder="Search products, brands, keywords... (Press Enter to view all)"
              className="w-full bg-transparent text-white placeholder-zinc-500 text-sm sm:text-base font-medium focus:outline-none"
            />

            {/* Clear Query Button */}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
                title="Clear search"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Funnel Filter Icon Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg transition-colors ${
                showFilters ? 'bg-white/20 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
              title="Toggle Merchant Filters"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>

            {/* Enter Shortcut Badge */}
            {hasActiveQuery ? (
              <button
                onClick={() => handleNavigateToSearch(query)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-zinc-950 bg-white hover:bg-zinc-200 rounded-lg shadow-sm transition-all"
                title="Search on full page"
              >
                <span>Search</span>
                <span className="font-mono">↵</span>
              </button>
            ) : (
              <kbd
                onClick={onClose}
                className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 rounded cursor-pointer hover:text-white hover:bg-white/10"
              >
                ESC
              </kbd>
            )}
          </div>
        </div>

        {/* Segmented Mode Selector: DEALS | CATEGORIES | MERCHANTS */}
        <div className="px-5 pb-3 flex items-center justify-between border-b border-white/5 text-xs">
          <div className="flex items-center gap-2 bg-[#1c1e24] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setMode('deals')}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                mode === 'deals' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              DEALS
            </button>
            <button
              onClick={() => setMode('categories')}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                mode === 'categories' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              CATEGORIES
            </button>
            <button
              onClick={() => setMode('merchants')}
              className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                mode === 'merchants' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-400 hover:text-white'
              }`}
            >
              MERCHANTS
            </button>
          </div>

          {hasActiveQuery && (
            <span className="text-[11px] text-zinc-500 font-mono">
              {filteredProducts.length} match{filteredProducts.length === 1 ? '' : 'es'}
            </span>
          )}
        </div>

        {/* Expanded Filters Drawer (When Funnel Clicked) */}
        {showFilters && (
          <div className="px-5 py-3 bg-[#17191e] border-b border-white/10 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-400 text-[11px] font-semibold">Filter Store:</span>
            <button
              onClick={() => setSelectedMerchant('all')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                selectedMerchant === 'all' ? 'bg-white text-zinc-950 font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              All Stores
            </button>
            {uniqueMerchants.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMerchant(m)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  selectedMerchant === m ? 'bg-white text-zinc-950 font-bold' : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto p-3 divide-y divide-white/5">
          
          {/* STATE 1: User is NOT typing (empty query) in DEALS mode -> Show Search History */}
          {!hasActiveQuery && mode === 'deals' ? (
            <div className="p-3">
              {history.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3 px-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Searches
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="flex flex-col gap-1">
                    {history.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleSelectHistory(term)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="text-sm font-medium">{term}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                            Search ↵
                          </span>
                          <button
                            onClick={(e) => removeHistoryItem(term, e)}
                            className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition-colors"
                            title="Remove from history"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-zinc-500">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm font-semibold text-zinc-400 mb-1">Search Products & Brands</p>
                  <p className="text-xs text-zinc-600">Start typing above and press Enter to view dedicated results.</p>
                </div>
              )}
            </div>
          ) : mode === 'categories' ? (
            /* STATE 2: CATEGORIES mode */
            <div className="grid grid-cols-2 gap-2 p-2">
              {uniqueCategories
                .filter(cat => !hasActiveQuery || cat.toLowerCase().includes(trimmedQuery))
                .map(cat => {
                  const count = products.filter(p => p.category.includes(cat)).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        saveToHistory(cat);
                        onSelectCategory(cat);
                        onClose();
                        router.push(`/search?category=${encodeURIComponent(cat)}`);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-colors group"
                    >
                      <span className="font-semibold text-sm text-zinc-200 group-hover:text-white">{cat}</span>
                      <span className="text-xs text-zinc-500 font-mono">{count} products</span>
                    </button>
                  );
                })}
            </div>
          ) : mode === 'merchants' ? (
            /* STATE 3: MERCHANTS mode */
            <div className="grid grid-cols-2 gap-2 p-2">
              {uniqueMerchants
                .filter(m => !hasActiveQuery || m.toLowerCase().includes(trimmedQuery))
                .map(m => {
                  const count = products.filter(p => (p.merchant || p.network_id).includes(m)).length;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        saveToHistory(m);
                        onClose();
                        router.push(`/search?q=${encodeURIComponent(m)}`);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-colors group"
                    >
                      <span className="font-semibold text-sm text-zinc-200 group-hover:text-white">{m}</span>
                      <span className="text-xs text-zinc-500 font-mono">{count} products</span>
                    </button>
                  );
                })}
            </div>
          ) : filteredProducts.length > 0 ? (
            /* STATE 4: DEALS mode with active query results */
            <div>
              {/* Dedicated Search Results Navigation Banner */}
              <div className="mb-2 p-1">
                <button
                  onClick={() => handleNavigateToSearch(query)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">View all results for</span>
                    <span className="text-white font-bold">&ldquo;{query}&rdquo;</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-zinc-300 font-mono">
                      {filteredProducts.length} items
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-300 group-hover:text-white font-bold">
                    <span>Open Results Page</span>
                    <span className="font-mono">↵</span>
                  </div>
                </button>
              </div>

              {filteredProducts.map(product => {
                const discount = (product.original_price && product.original_price > product.price)
                  ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      saveToHistory(product.title);
                      onClose();
                      router.push(`/search?q=${encodeURIComponent(product.title)}`);
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 shrink-0 overflow-hidden relative border border-white/10">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">Deal</div>
                      )}
                    </div>

                    {/* Title & Category */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] uppercase font-bold text-zinc-400">{product.category.split(',')[0]}</span>
                        {product.merchant && (
                          <span className="text-[10px] text-zinc-500 font-mono">• {product.merchant}</span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-zinc-100 truncate group-hover:text-indigo-400 transition-colors">
                        {product.title}
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          {product.currency === 'INR' ? '₹' : product.currency + ' '}
                          {product.price.toLocaleString('en-IN')}
                        </div>
                        {discount > 0 && (
                          <span className="text-[10px] font-extrabold text-emerald-400">-{discount}%</span>
                        )}
                      </div>

                      <a
                        href={`/go/${product.id}`}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                        onClick={() => saveToHistory(product.title)}
                        className="px-3 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all shrink-0"
                      >
                        Get Deal
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-zinc-400 mb-1">No products matching &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-600 mb-4">Try searching with a different term or clear your filters.</p>
              <button
                onClick={() => handleNavigateToSearch(query)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all"
              >
                Search on full page &ldquo;{query}&rdquo; →
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Hotkeys Bar */}
        <div className="px-5 py-3 bg-[#0d0e11] border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-zinc-400">ESC</kbd> to exit</span>
            <span>•</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-zinc-400">ENTER</kbd> to search page</span>
          </div>
          <button
            onClick={() => {
              setQuery('');
              setSelectedMerchant('all');
              setMode('deals');
            }}
            className="text-zinc-400 hover:text-white underline underline-offset-2"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
