import { Metadata } from 'next';
import { supabase } from '../../../lib/supabaseClient';
import FreshnessBadge from '../../../components/FreshnessBadge';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { data: product } = await supabase
    .from('products')
    .select('title, description')
    .eq('id', id)
    .single();

  const title = product?.title || 'Product Details';
  const description = product?.description || 'DealDrop Discovery';

  return {
    title: `${title} — DealDrop`,
    description,
    alternates:{
      canonical:`${baseUrl}/products/${id}`,
    }
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-[#F8F5F0]">
        <div className="glass-panel p-8 rounded-3xl max-w-md text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Product Not Found</h1>
          <p className="text-sm text-zinc-500 mb-6">
            This product could not be found in the database.
          </p>
          <a
            href="/"
            className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-black transition-all"
          >
            ← Back to Home
          </a>
        </div>
      </main>
    );
  }

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image_url,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0] py-10 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-950 mb-6 transition-colors"
        >
          <span>← Back to All Deals</span>
        </a>

        <div className="glass-panel rounded-[32px] p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-black/5 shadow-inner">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400 font-semibold">
                  No Image Available
                </div>
              )}

              {discount > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-zinc-900 text-white font-bold text-xs shadow-md">
                  -{discount}% OFF
                </span>
              )}
            </div>

            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                    {product.category || 'General'}
                  </span>
                  <FreshnessBadge
                    lastCheckedAt={product.last_price_checked_at}
                    isStale={product.is_stale}
                  />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950 mb-4 leading-snug">
                  {product.title}
                </h1>

                {product.description && (
                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-black/5">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl sm:text-4xl font-extrabold text-zinc-950">
                    {product.currency === 'INR' ? '₹' : product.currency + ' '}
                    {Number(product.price).toLocaleString('en-IN')}
                  </span>
                  {product.original_price && Number(product.original_price) > Number(product.price) && (
                    <span className="text-lg text-zinc-400 line-through">
                      {product.currency === 'INR' ? '₹' : product.currency + ' '}
                      {Number(product.original_price).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <a
                  href={`/go/${product.id}`}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-zinc-900 hover:bg-black text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <span>Claim Deal</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}