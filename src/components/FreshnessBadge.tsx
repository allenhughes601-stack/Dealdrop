import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    lastCheckedAt?: string | null;
    isStale?: boolean;
}

export default function FreshnessBadge({ lastCheckedAt, isStale }: Props) {
    if (!lastCheckedAt) return null;

    let timeAgo = '';
    try {
        timeAgo = formatDistanceToNow(new Date(lastCheckedAt), { addSuffix: true });
    } catch {
        return null;
    }

    if (isStale) {
        return (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-amber-100 text-amber-800 text-[8px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-amber-500 rounded-full"></div>
                Unverified
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 sm:gap-1.5 bg-[#e0f5ee] text-[#047857] text-[8px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full"></div>
            Verified {timeAgo.replace('about ', '')}
        </div>
    );
}