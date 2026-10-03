'use client';

import React, { useState, useMemo } from 'react';
import { DealProduct, SortMode } from '../types/frontend';
import HeaderNav from './HeaderNav';
import HeroBento from './HeroBento';
import ProductCard from './ProductCard';
import MacDock from './MacDock';
import SearchModal from './SearchModal';
import CategoryDrawer from './CategoryDrawer';
import DiscountPopover from './DiscountPopover';

interface DealDropAppProps {
  initialProducts: DealProduct[];
}

export default function DealDropApp({ initialProducts }: DealDropAppProps) {
  // Active Filter States
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortMode, setSortMode] = useState<SortMode>('trending');
  const [activeDiscount, setActiveDiscount] = useState<number>(0);

  // Modal & Drawer Visibility States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Extract unique categories and counts dynamically from DB products
  const { categoryCounts, uniqueCategories } = useMemo(() => {
    const counts: Record<string, number> = {};
    const catSet = new Set<string>();

    initialProducts.forEach((p) => {
      if (p.category) {
        const parts = p.category.split(',').map((c) => c.trim()).filter(Boolean);
        parts.forEach((c) => {
          catSet.add(c);
          counts[c] = (counts[c] || 0) + 1;
        });
      }
    });

    return {
      categoryCounts: counts,
      uniqueCategories: Array.from(catSet),
    };
  }, [initialProducts]);

  // Dynamic Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Category Filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => {
        if (!p.category) return false;
        return p.category.toLowerCase().includes(activeCategory.toLowerCase());
      });
    }

    // 2. Discount Filter
    if (activeDiscount > 0) {
      result = result.filter((p) => {
        if (!p.original_price || p.original_price <= p.price) return false;
        const discountPct = ((p.original_price - p.price) / p.original_price) * 100;
        return discountPct >= activeDiscount;
      });
    }

    // 3. Sorting
    if (sortMode === 'trending') {
      result.sort((a, b) => {
        const discA = a.original_price && a.original_price > a.price ? (a.original_price - a.price) / a.original_price : 0;
        const discB = b.original_price && b.original_price > b.price ? (b.original_price - b.price) / b.original_price : 0;
        return discB - discA;
      });
    } else if (sortMode === 'discount') {
      result.sort((a, b) => {
        const discA = a.original_price && a.original_price > a.price ? (a.original_price - a.price) / a.original_price : 0;
        const discB = b.original_price && b.original_price > b.price ? (b.original_price - b.price) / b.original_price : 0;
        return discB - discA;
      });
    } else if (sortMode === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'newest') {
      result.sort((a, b) => {
        const dateA = a.last_price_checked_at ? new Date(a.last_price_checked_at).getTime() : 0;
        const dateB = b.last_price_checked_at ? new Date(b.last_price_checked_at).getTime() : 0;
        return dateB - dateA;
      });
    }

    return result;
  }, [initialProducts, activeCategory, activeDiscount, sortMode]);

  const spotlightProduct = initialProducts.length > 0 ? initialProducts[0] : undefined;
  const secondaryProduct = initialProducts.length > 1 ? initialProducts[1] : undefined;

  const handleToggleTrending = () => {
    if (sortMode === 'trending') {
      setSortMode('newest');
      showToast('Sorted by Newest');
    } else {
      setSortMode('trending');
      showToast('Sorted by Trending');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] text-zinc-900 pb-36 relative selection:bg-zinc-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="glass-panel px-4 py-2.5 rounded-2xl bg-zinc-950/90 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Header Navigation */}
      <HeaderNav
        onOpenSearch={() => setIsSearchOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          showToast(cat === 'all' ? 'Showing all products' : `Filtering by ${cat}`);
        }}
        totalDeals={filteredProducts.length}
        categories={uniqueCategories}
      />

      {/* Main Content Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1 w-full">
        {/* Hero Spotlight (Visible when no category filter is applied and DB has products) */}
        {activeCategory === 'all' && activeDiscount === 0 && spotlightProduct && (
          <HeroBento
            heroProduct={spotlightProduct}
            secondaryProduct={secondaryProduct}
            onOpenSearch={() => setIsSearchOpen(true)}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        )}

        {/* Dynamic Filter / Sort Controller Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/[0.08]">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-serif text-zinc-950 font-bold">
              {activeCategory === 'all' ? 'All Products' : activeCategory}
            </h2>
            <span className="text-xs text-zinc-500 font-mono px-2.5 py-0.5 rounded-full bg-black/5">
              {filteredProducts.length} item{filteredProducts.length === 1 ? '' : 's'}
            </span>

            {activeDiscount > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                ≥ {activeDiscount}% OFF
                <button
                  onClick={() => setActiveDiscount(0)}
                  className="hover:text-emerald-950 text-emerald-700 ml-1"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {/* Sort Controller Switcher */}
          <div className="flex items-center gap-1.5 bg-zinc-200/80 p-1 rounded-2xl text-xs self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setSortMode('trending')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                sortMode === 'trending' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setSortMode('discount')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                sortMode === 'discount' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              🏷️ % Discount
            </button>
            <button
              onClick={() => setSortMode('price-asc')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                sortMode === 'price-asc' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              ⚡ Price: Low
            </button>
          </div>
        </div>

        {/* Dynamic Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCopyLink={() => showToast(`Copied product link`)}
                onSelectCategory={(cat: string) => {
                  setActiveCategory(cat);
                  showToast(`Filtering by ${cat}`);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-3">📦</div>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">No products found</h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              {initialProducts.length === 0
                ? 'Your database currently has no products. Ingest items through your CSV/feed pipeline to populate this feed.'
                : 'No products match your currently active filters.'}
            </p>
            {initialProducts.length > 0 && (
              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveDiscount(0);
                  setSortMode('trending');
                  showToast('Reset all filters');
                }}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-black transition-all shadow-sm"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating macOS Dock Navbar */}
      <MacDock
        activeCategory={activeCategory}
        onToggleCategory={() => setIsCategoryOpen(!isCategoryOpen)}
        isCategoryOpen={isCategoryOpen}
        sortMode={sortMode}
        onToggleTrending={handleToggleTrending}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeDiscount={activeDiscount}
        onToggleDiscount={() => setIsDiscountOpen(!isDiscountOpen)}
        isDiscountOpen={isDiscountOpen}
      />

      {/* Category Selection Drawer */}
      <CategoryDrawer
        isOpen={isCategoryOpen}
        onClose={() => setIsCategoryOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          showToast(cat === 'all' ? 'Showing all products' : `Category: ${cat}`);
        }}
        categoryCounts={categoryCounts}
      />

      {/* Discount Selection Popover */}
      <DiscountPopover
        isOpen={isDiscountOpen}
        onClose={() => setIsDiscountOpen(false)}
        activeDiscount={activeDiscount}
        onSelectDiscount={(minPct) => {
          setActiveDiscount(minPct);
          showToast(minPct > 0 ? `Filtered deals ≥ ${minPct}% OFF` : 'All discounts shown');
        }}
      />

      {/* Spotlight Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={initialProducts}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          showToast(`Filtered by ${cat}`);
        }}
      />
    </div>
  );
}
