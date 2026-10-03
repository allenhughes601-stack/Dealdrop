import React from 'react';
import AffiliateButton from './AffiliateButton';
import FreshnessBadge from './FreshnessBadge';

export interface Product {
    id: string;
    title: string;
    image_url?: string | null;
    price: number;
    original_price?: number | null;
    currency: string;
    last_price_checked_at?: string | null;
    is_stale?: boolean;
    category?: string;
    description?: string;
    network_id?: string;
    merchant?: string;
    editorial_tag?: string;
    featured?: boolean;
    badge?: string;
}

interface ProductCardProps {
    product: Product;
    onCopyLink?: (product: Product) => void;
    onSelectCategory?: (category: string) => void;
}

export default function ProductCard({ product, onCopyLink, onSelectCategory }: ProductCardProps) {
    // Determine the icon to show for missing images
    const renderPlaceholder = () => (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
            <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl sm:rounded-[1.5rem] p-2 sm:p-3 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            
            {/* Image Container */}
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden relative mb-2.5 sm:mb-4 bg-gray-100">
                {/* Share/Copy Icon (Top Right) */}
                {onCopyLink && (
                    <button 
                        onClick={(e) => { e.preventDefault(); onCopyLink(product); }}
                        className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 bg-white/90 backdrop-blur text-gray-600 hover:text-black p-1 sm:p-1.5 rounded-lg shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                )}

                {/* Merchant Badge (Bottom Left) */}
                {(product.merchant || product.network_id) && (
                    <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-10 bg-white/90 backdrop-blur text-gray-800 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider">
                        {product.merchant || product.network_id}
                    </div>
                )}

                {product.image_url ? (
                    <img 
                        src={product.image_url} 
                        alt={product.title} 
                        className="object-cover w-full h-full" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                ) : renderPlaceholder()}
            </div>

            {/* Content Area */}
            <div className="flex flex-col flex-grow px-1">
                {/* Category */}
                <button 
                    onClick={(e) => { e.preventDefault(); if(product.category) onSelectCategory?.(product.category); }}
                    className="text-[9px] sm:text-[10px] font-semibold tracking-wide uppercase text-gray-400 hover:text-gray-600 transition-colors mb-1 text-left"
                >
                    {product.category ? product.category.split(',')[0] : 'DEAL'}
                </button>

                {/* Title */}
                <h3 className="font-sans font-bold text-[13px] sm:text-[15px] text-gray-900 line-clamp-2 leading-snug mb-1.5 sm:mb-2">
                    {product.title}
                </h3>

                {/* Description */}
                {product.description && (
                    <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto pt-1 sm:pt-2">
                    {/* Price & Freshness Row */}
                    <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Deal Price
                        </span>
                        <FreshnessBadge
                            lastCheckedAt={product.last_price_checked_at || null}
                            isStale={Boolean(product.is_stale)}
                        />
                    </div>

                    {/* Price Value */}
                    <div className="text-xl sm:text-2xl font-black text-black mb-2 sm:mb-3">
                        {product.currency === 'INR' ? '₹' : product.currency === 'USD' ? '$' : product.currency}{product.price.toLocaleString('en-IN')}
                    </div>

                    {/* Full Width Action Button */}
                    <AffiliateButton productId={product.id} buttonText="Claim Deal" />
                </div>
            </div>
        </div>
    );
}