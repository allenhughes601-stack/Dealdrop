'use client';

import React from 'react';
import { DealProduct } from '../types/frontend';
import FreshnessBadge from './FreshnessBadge';

interface HeroBentoProps {
  heroProduct?: DealProduct;
  secondaryProduct?: DealProduct;
  onOpenSearch: () => void;
  onSelectCategory: (cat: string) => void;
}

export default function HeroBento({
  heroProduct,
  secondaryProduct,
  onOpenSearch,
  onSelectCategory,
}: HeroBentoProps) {
  if (!heroProduct) return null;

  const heroDiscount = (heroProduct.original_price && heroProduct.original_price > heroProduct.price)
    ? Math.round(((heroProduct.original_price - heroProduct.price) / heroProduct.original_price) * 100)
    : 0;

  const secondaryDiscount = (secondaryProduct?.original_price && secondaryProduct.original_price > secondaryProduct.price)
    ? Math.round(((secondaryProduct.original_price - secondaryProduct.price) / secondaryProduct.original_price) * 100)
    : 0;

  return (
    <section className="mb-4 sm:mb-8">
      {/* Affiliate Notice Subheader */}
      <div className="mb-1.5 sm:mb-3">
        <h2 className="text-[11px] sm:text-sm text-zinc-500 font-sans font-medium tracking-wide">
          This site contain/promotes affiliate links
        </h2>
      </div>

      {/* Bento Grid Layout - Compact on Mobile, ~50% on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 items-stretch">
        
        {/* Left: Large Featured Drop (7 Cols on desktop, full width on mobile) */}
        <div className="lg:col-span-7 glass-panel glass-panel-hover rounded-2xl sm:rounded-[32px] p-3 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-sm">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-200/30 via-purple-100/15 to-transparent rounded-full blur-3xl pointer-events-none -z-0"></div>

          {/* Full Card Stretched Link */}
          <a
            href={`/go/${heroProduct.id}`}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="absolute inset-0 z-0"
            aria-label={`Claim spotlight deal for ${heroProduct.title}`}
          />

          <div className="flex flex-row gap-3 sm:gap-7 items-stretch relative z-10 flex-1">
            {/* Left: Clean Vertical Rounded-Rectangular Product Image */}
            <div className="w-[36%] sm:w-[38%] shrink-0 pointer-events-none flex flex-col">
              <div className="relative w-full h-full min-h-[140px] sm:min-h-[340px] rounded-xl sm:rounded-[24px] overflow-hidden bg-zinc-100 border border-black/[0.04] shadow-sm">
                {heroProduct.image_url ? (
                  <img
                    src={heroProduct.image_url}
                    alt={heroProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 text-zinc-400 p-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold text-zinc-500">{heroProduct.category || 'DealDrop Verified'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Product Details & Actions */}
            <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
              <div>
                {/* Category & Freshness Header */}
                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1 sm:mb-2.5">
                  {heroProduct.category ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectCategory(heroProduct.category!);
                      }}
                      className="text-[10px] sm:text-sm font-bold text-indigo-600 hover:text-indigo-900 uppercase tracking-wide transition-colors z-20 pointer-events-auto truncate max-w-[90px] sm:max-w-none"
                    >
                      {heroProduct.category.split(',')[0]}
                    </button>
                  ) : (
                    <span className="text-[10px] sm:text-sm font-bold text-indigo-600 uppercase tracking-wide">
                      Verified Drop
                    </span>
                  )}
                  <FreshnessBadge
                    lastCheckedAt={heroProduct.last_price_checked_at}
                    isStale={heroProduct.is_stale}
                  />
                </div>

                {/* Product Title */}
                <h2 className="text-xs sm:text-2xl md:text-3xl font-extrabold text-zinc-950 leading-snug sm:leading-tight mb-1 sm:mb-2.5 group-hover:text-indigo-950 transition-colors line-clamp-2">
                  {heroProduct.title}
                </h2>

                {/* Subheading / Description (Desktop/Tablet) */}
                {heroProduct.description && (
                  <p className="hidden sm:block text-xs sm:text-sm text-zinc-500 leading-relaxed line-clamp-2 md:line-clamp-3 mb-2">
                    {heroProduct.description}
                  </p>
                )}
              </div>

              {/* Price & Claim Deal */}
              <div className="pt-2 sm:pt-4 border-t border-zinc-100/90 mt-auto flex flex-col gap-2 sm:gap-3.5">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
                    {heroProduct.currency === 'INR' ? '₹' : heroProduct.currency + ' '}
                    {heroProduct.price.toLocaleString('en-IN')}
                  </span>
                  {heroProduct.original_price && heroProduct.original_price > heroProduct.price && (
                    <span className="text-[10px] sm:text-base text-zinc-400 line-through font-medium">
                      {heroProduct.currency === 'INR' ? '₹' : heroProduct.currency + ' '}
                      {heroProduct.original_price.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Pill Claim Deal Now Button */}
                <a
                  href={`/go/${heroProduct.id}`}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-3.5 px-3 sm:px-6 rounded-full bg-zinc-950 hover:bg-black text-white text-xs sm:text-base font-bold tracking-wide shadow-md hover:shadow-xl transition-all active:scale-[0.98] group/btn pointer-events-auto"
                >
                  <span>Claim Deal Now</span>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Secondary Pick + Anti-Spam (5 Cols - Desktop/Large Tablet) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col gap-4 sm:gap-5 justify-between">
          {secondaryProduct && (
            <div className="glass-panel glass-panel-hover rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 flex-1 flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-sm">
              <a
                href={`/go/${secondaryProduct.id}`}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="absolute inset-0 z-0"
                aria-label={`Claim deal for ${secondaryProduct.title}`}
              />

              <div className="flex gap-3.5 items-stretch relative z-10 flex-1">
                {secondaryProduct.image_url && (
                  <div className="w-24 sm:w-28 shrink-0 self-stretch rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-100 border border-black/5 pointer-events-none flex flex-col">
                    <img
                      src={secondaryProduct.image_url}
                      alt={secondaryProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold truncate">
                      ⚡ Verified
                    </span>
                    <FreshnessBadge
                      lastCheckedAt={secondaryProduct.last_price_checked_at}
                      isStale={secondaryProduct.is_stale}
                    />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-zinc-900 leading-snug line-clamp-2 mb-1 group-hover:text-indigo-900 transition-colors">
                    {secondaryProduct.title}
                  </h3>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm sm:text-lg font-extrabold text-zinc-950">
                      {secondaryProduct.currency === 'INR' ? '₹' : secondaryProduct.currency + ' '}
                      {secondaryProduct.price.toLocaleString('en-IN')}
                    </span>
                    {secondaryDiscount > 0 && (
                      <span className="text-[10px] sm:text-xs font-bold text-emerald-600">
                        -{secondaryDiscount}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 sm:pt-2.5 border-t border-black/[0.06] mt-2 relative z-10">
                <a
                  href={`/go/${secondaryProduct.id}`}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1 py-1.5 px-3.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <span>Claim Deal →</span>
                </a>
              </div>
            </div>
          )}

          {/* Anti-Spam Manifesto */}
          <div className="glass-panel rounded-[28px] sm:rounded-[32px] p-4 sm:p-5 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Anti-Spam Deal Verification</span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed mb-3">
                Zero fake coupons. Prices synced directly from verified affiliate feeds & database.
              </p>
            </div>

            <div className="pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all active:scale-95"
              >
                <span>Search database products...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] font-mono text-zinc-300">⌘K</kbd>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
