import React from "react";

interface Props {
    position: 'sidebar' | 'in-feed' | 'below-fold';
}

export default function AdSlot({ position }: Props) {
    return (
        <div className="w-full bg-gray-50 border border-gray-200 text-center p-4 rounded text-gray-400 text-sm">
            Advertisement ({ position })
        </div>
    );
}