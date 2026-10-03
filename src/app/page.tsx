import { supabase } from "../lib/supabaseClient";
import DealDropApp from "../components/DealDropApp";
import { DealProduct } from "../types/frontend";

export const revalidate = 1800;

export default async function HomePage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('is_stale', { ascending: true }) // Fresh first
    .order('created_at', { ascending: false })
    .limit(100);

  return <DealDropApp initialProducts={(products || []) as DealProduct[]} />;
}