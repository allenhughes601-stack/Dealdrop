import React from 'react';

interface Props {
    productId: string;
    buttonText?: string;
}

export default function AffiliateButton({ productId, buttonText = 'Claim Deal' }: Props) {
    return (
        <a 
            href={`/go/${productId}`}
            target="_blank"
            rel="nofollow sponsored" // Crucial for Google compliance
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-[#1a1a1a] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-bold hover:bg-black transition-colors text-[11px] sm:text-[13px]"
        >
            {buttonText}
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </a>
    );
}