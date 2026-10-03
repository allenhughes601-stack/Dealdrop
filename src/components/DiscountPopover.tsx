'use client';

import React, { useRef, useEffect } from 'react';
import { DISCOUNT_TIERS } from '../types/frontend';

interface DiscountPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  activeDiscount: number;
  onSelectDiscount: (minPercent: number) => void;
}

export default function DiscountPopover({
  isOpen,
  onClose,
  activeDiscount,
  onSelectDiscount,
}: DiscountPopoverProps) {
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

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div
        ref={containerRef}
        className="glass-panel rounded-[24px] p-4 shadow-2xl border border-white/90 bg-white/90 backdrop-blur-2xl text-zinc-900"
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-base">🏷️</span>
            <span className="font-bold text-sm text-zinc-900">Coupons & Discount Tiers</span>
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

        <div className="flex flex-col gap-1.5">
          {DISCOUNT_TIERS.map((tier) => {
            const isSelected = activeDiscount === tier.minPercent;

            return (
              <button
                key={tier.id}
                onClick={() => {
                  onSelectDiscount(tier.minPercent);
                  onClose();
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold shadow-md'
                    : 'bg-zinc-100/70 hover:bg-zinc-200/80 text-zinc-800'
                }`}
              >
                <span className="text-xs font-semibold">{tier.label}</span>
                {tier.minPercent > 0 && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    ≥ {tier.minPercent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeDiscount > 0 && (
          <div className="mt-3 pt-3 border-t border-black/[0.06] text-center">
            <button
              onClick={() => {
                onSelectDiscount(0);
                onClose();
              }}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 underline underline-offset-2"
            >
              Clear Coupon Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
