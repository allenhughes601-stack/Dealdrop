export interface DealProduct {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  price: number;
  original_price?: number | null;
  currency: string;
  category: string;
  network_id: string;
  merchant?: string;
  last_price_checked_at?: string | null;
  is_stale?: boolean;
  editorial_tag?: string;
  featured?: boolean;
  badge?: string;
}

export type SearchMode = 'deals' | 'categories' | 'merchants';

export type SortMode = 'trending' | 'newest' | 'discount' | 'price-asc';

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
  count?: number;
}

export interface DiscountOption {
  id: string;
  label: string;
  minPercent: number;
}

export const DISCOUNT_TIERS: DiscountOption[] = [
  { id: 'all', label: 'All Discounts', minPercent: 0 },
  { id: '20', label: '20%+ OFF', minPercent: 20 },
  { id: '30', label: '30%+ OFF', minPercent: 30 },
  { id: '40', label: '40%+ OFF', minPercent: 40 },
  { id: '50', label: '50%+ OFF (Deep Steals)', minPercent: 50 },
];
