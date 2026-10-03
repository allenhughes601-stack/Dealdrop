import { supabase } from '../../lib/supabaseClient';
import { DealProduct } from '../../types/frontend';
import SearchResultsView from '../../components/SearchResultsView';

export const revalidate = 60; // Refresh price check every 60 seconds

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const q = searchParams.q?.trim() || '';
  const category = searchParams.category?.trim() || '';

  let allDbProducts: DealProduct[] = [];

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('is_stale', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data && data.length > 0) {
      allDbProducts = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || undefined,
        image_url: item.image_url || '',
        price: Number(item.price) || 0,
        original_price: item.original_price ? Number(item.original_price) : null,
        currency: item.currency || 'INR',
        category: item.category || 'General',
        network_id: item.network_id || 'direct',
        merchant: item.network_id?.split('-')[0] || 'Merchant',
        last_price_checked_at: item.last_price_checked_at || item.created_at,
        is_stale: Boolean(item.is_stale),
        editorial_tag: item.editorial_tag,
        featured: false,
      }));
    }
  } catch (err) {
    console.error('[DealDrop] Error fetching products for search page from Supabase:', err);
  }

  // Filter products based on query or category
  let filtered = [...allDbProducts];

  if (category) {
    filtered = filtered.filter((p) =>
      p.category?.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (q) {
    const queryLower = q.toLowerCase();
    filtered = filtered.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(queryLower);
      const descMatch = p.description?.toLowerCase().includes(queryLower);
      const catMatch = p.category?.toLowerCase().includes(queryLower);
      const merchMatch = p.merchant?.toLowerCase().includes(queryLower);
      const networkMatch = p.network_id?.toLowerCase().includes(queryLower);
      return titleMatch || descMatch || catMatch || merchMatch || networkMatch;
    });
  }

  const queryLabel = q || category || '';

  return (
    <SearchResultsView
      initialProducts={filtered}
      allDbProducts={allDbProducts}
      searchQuery={queryLabel}
    />
  );
}
