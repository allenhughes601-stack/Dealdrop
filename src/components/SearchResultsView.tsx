'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DealProduct, SortMode } from '../types/frontend';
import ProductCard from './ProductCard';
import FreshnessBadge from './FreshnessBadge';
import MacDock from './MacDock';
import SearchModal from './SearchModal';
import CategoryDrawer from './CategoryDrawer';
import DiscountPopover from './DiscountPopover';

interface SearchResultsViewProps {
  initialProducts: DealProduct[];
  allDbProducts: DealProduct[];
  searchQuery: string;
}

export default function SearchResultsView({
  initialProducts,
  allDbProducts,
  searchQuery,
}: SearchResultsViewProps) {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMerchant, setSelectedMerchant] = useState<string>('all');
  const [sortMode, setSortMode] = useState<SortMode>('trending');
  const [activeDiscount, setActiveDiscount] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'terminal'>('grid');

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Extract unique categories, merchants, and summary stats
  const { categoryCounts, uniqueCategories, uniqueMerchants, stats } = useMemo(() => {
    const counts: Record<string, number> = {};
    const catSet = new Set<string>();
    const merchSet = new Set<string>();
    let totalDiscountSum = 0;
    let discountCount = 0;
    let minPrice = Infinity;
    let maxPrice = 0;

    initialProducts.forEach((p) => {
      if (p.category) {
        const parts = p.category.split(',').map((c) => c.trim()).filter(Boolean);
        parts.forEach((c) => {
          catSet.add(c);
          counts[c] = (counts[c] || 0) + 1;
        });
      }
      const merch = p.merchant || p.network_id?.split('-')[0] || 'Merchant';
      merchSet.add(merch);

      if (p.original_price && p.original_price > p.price) {
        const discPct = Math.round(((p.original_price - p.price) / p.original_price) * 100);
        totalDiscountSum += discPct;
        discountCount += 1;
      }
      if (p.price < minPrice) minPrice = p.price;
      if (p.price > maxPrice) maxPrice = p.price;
    });

    return {
      categoryCounts: counts,
      uniqueCategories: Array.from(catSet),
      uniqueMerchants: Array.from(merchSet),
      stats: {
        avgDiscount: discountCount > 0 ? Math.round(totalDiscountSum / discountCount) : 0,
        minPrice: minPrice === Infinity ? 0 : minPrice,
        maxPrice,
      },
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

    // 2. Merchant Filter
    if (selectedMerchant !== 'all') {
      result = result.filter((p) => {
        const merch = p.merchant || p.network_id;
        return merch?.toLowerCase() === selectedMerchant.toLowerCase();
      });
    }

    // 3. Discount Filter
    if (activeDiscount > 0) {
      result = result.filter((p) => {
        if (!p.original_price || p.original_price <= p.price) return false;
        const discountPct = ((p.original_price - p.price) / p.original_price) * 100;
        return discountPct >= activeDiscount;
      });
    }

    // 4. Sorting
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
  }, [initialProducts, activeCategory, selectedMerchant, activeDiscount, sortMode]);

  const handleToggleTrending = () => {
    if (sortMode === 'trending') {
      setSortMode('newest');
      showToast('Sorted by Newest Check');
    } else {
      setSortMode('trending');
      showToast('Sorted by Highest Discount');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2] text-zinc-900 pb-36 relative selection:bg-zinc-900 selection:text-white font-sans antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-2.5 rounded-2xl bg-zinc-950/95 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Editorial Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#F9F7F2]/90 backdrop-blur-xl border-b border-black/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3 focus:outline-none group">
              <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-serif text-lg font-bold shadow-md group-hover:bg-zinc-800 transition-colors">
                D
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-tight text-zinc-950">
                  DealDrop
                </span>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-semibold">
                  Editorial Index
                </p>
              </div>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-black/5 hover:bg-black/10 text-zinc-700 hover:text-zinc-950 text-xs font-semibold transition-all"
            >
              ← Back to Catalog
            </a>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-black/10 text-zinc-600 hover:text-zinc-950 text-xs font-semibold shadow-xs transition-all"
            >
              <span>Spotlight</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] font-mono text-zinc-400 border border-zinc-200">⌘K</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Search & Value Terminal Banner */}
      <section className="border-b border-black/[0.06] bg-[#F8F5F0] pt-4 pb-4 sm:pt-8 sm:pb-6 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Top Pill: Verified Prices // Anti-Spam */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#E5E0D8]/90 border border-black/[0.06] text-[10px] sm:text-[11px] font-mono tracking-wide text-zinc-700 font-semibold mb-3 sm:mb-4 shadow-xs">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"></span>
            <span>Verified Prices // Anti-Spam</span>
          </div>

          {/* Search Query Heading if query exists */}
          {searchQuery && (
            <div className="mb-3 sm:mb-4">
              <h1 className="text-lg sm:text-2xl font-serif font-bold text-zinc-950">
                Search Results for &ldquo;{searchQuery}&rdquo;
              </h1>
            </div>
          )}

          {/* Mobile Format: Inline Pill Chips */}
          <div className="flex sm:hidden items-center justify-center gap-2 max-w-xs mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/10 text-[11px] font-sans shadow-xs">
              <span className="text-zinc-500 font-medium">Total Drops:</span>
              <span className="font-bold text-zinc-950 font-mono">{filteredProducts.length}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-black/10 text-[11px] font-sans shadow-xs">
              <span className="text-zinc-500 font-medium">Avg. Discount:</span>
              <span className="font-bold text-emerald-600 font-mono">
                {stats.avgDiscount > 0 ? `-${stats.avgDiscount}%` : 'Standard'}
              </span>
            </div>
          </div>

          {/* Desktop Format: Compact Metadata Tiles */}
          <div className="hidden sm:flex items-center justify-center gap-3 max-w-xs mx-auto">
            <div className="flex-1 py-2.5 px-3.5 rounded-xl bg-white shadow-xs border border-black/[0.04] text-left">
              <span className="block text-[10px] font-sans text-zinc-500 font-medium tracking-normal mb-0.5">Total Drops</span>
              <span className="text-sm sm:text-base font-bold text-zinc-950 font-mono">{filteredProducts.length}</span>
            </div>

            <div className="flex-1 py-2.5 px-3.5 rounded-xl bg-white shadow-xs border border-black/[0.04] text-left">
              <span className="block text-[10px] font-sans text-zinc-500 font-medium tracking-normal mb-0.5">Avg. Discount</span>
              <span className="text-sm sm:text-base font-bold text-emerald-600 font-mono">
                {stats.avgDiscount > 0 ? `-${stats.avgDiscount}%` : 'Standard'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Filter & Results Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        {/* RESULTS SECTION */}
        {filteredProducts.length > 0 ? (
          viewMode === 'grid' ? (
            /* 1. EDITORIAL BENTO GRID VIEW */
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onCopyLink={() => showToast('Copied product link')}
                  onSelectCategory={(cat: string) => {
                    setActiveCategory(cat);
                    showToast(`Filtering by ${cat}`);
                  }}
                />
              ))}
            </div>
          ) : (
            /* 2. VALUE TERMINAL LIST VIEW (High Density Monospace Table) */
            <div className="bg-white rounded-2xl border border-black/[0.08] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100/75 border-b border-black/[0.06] text-[11px] font-mono uppercase text-zinc-500">
                      <th className="py-3 px-4">Item & Curation</th>
                      <th className="py-3 px-4">Store</th>
                      <th className="py-3 px-4 text-right">Savings</th>
                      <th className="py-3 px-4 text-right">Deal Price</th>
                      <th className="py-3 px-4">Verification</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.05] text-sm">
                    {filteredProducts.map((product) => {
                      const discount =
                        product.original_price && product.original_price > product.price
                          ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                          : 0;

                      return (
                        <tr
                          key={product.id}
                          className="hover:bg-[#FAF8F5] transition-colors group"
                        >
                          {/* Item / Title */}
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-black/[0.06]">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-400">
                                    Drop
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <a
                                  href={`/go/${product.id}`}
                                  target="_blank"
                                  rel="nofollow sponsored noopener noreferrer"
                                  className="font-bold text-zinc-900 hover:text-indigo-900 transition-colors line-clamp-1 block"
                                >
                                  {product.title}
                                </a>
                                <span className="text-[11px] text-zinc-400 uppercase font-mono">
                                  {product.category.split(',')[0]}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Store */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-800 text-xs font-mono font-semibold border border-black/[0.04]">
                              {product.merchant || product.network_id?.split('-')[0] || 'Direct Store'}
                            </span>
                          </td>

                          {/* Discount % */}
                          <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap">
                            {discount > 0 ? (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                                -{discount}%
                              </span>
                            ) : (
                              <span className="text-zinc-400 text-xs">—</span>
                            )}
                          </td>

                          {/* Deal Price */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="font-extrabold text-zinc-950 font-mono text-base">
                              {product.currency === 'INR' ? '₹' : product.currency + ' '}
                              {product.price.toLocaleString('en-IN')}
                            </div>
                            {product.original_price && product.original_price > product.price && (
                              <div className="text-xs text-zinc-400 line-through font-mono">
                                {product.currency === 'INR' ? '₹' : product.currency + ' '}
                                {product.original_price.toLocaleString('en-IN')}
                              </div>
                            )}
                          </td>

                          {/* Verification Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <FreshnessBadge
                              lastCheckedAt={product.last_price_checked_at}
                              isStale={product.is_stale}
                            />
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <a
                              href={`/go/${product.id}`}
                              target="_blank"
                              rel="nofollow sponsored noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                            >
                              <span>Claim Deal</span>
                              <span className="font-mono text-[10px]">↗</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          /* EMPTY STATE */
          <div className="py-16 text-center bg-white rounded-3xl border border-black/[0.08] shadow-sm p-8 max-w-lg mx-auto">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="text-xl font-serif font-bold text-zinc-950 mb-2">No Matching Products Found</h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              We couldn&apos;t find verified products matching &ldquo;{searchQuery}&rdquo;. Try another term or explore trending categories below.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {['Electronics', 'Apparel', 'Smart Home', 'Accessories'].map((sug) => (
                <button
                  key={sug}
                  onClick={() => {
                    router.push(`/search?category=${encodeURIComponent(sug)}`);
                  }}
                  className="px-3 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>

            <a
              href="/"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-all shadow-sm"
            >
              Browse All Active Drops
            </a>
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
        products={allDbProducts}
        onSelectCategory={(cat) => {
          router.push(`/search?category=${encodeURIComponent(cat)}`);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
