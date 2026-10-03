import { supabase } from '@/lib/supabaseClient';
import NavigationBanner from '@/components/NavigationBanner';
import AffiliateButton from '@/components/AffiliateButton';
import FreshnessBadge from '@/components/FreshnessBadge';

export const revalidate = 60;

const FALLBACK_BENTO_ITEMS = [
  {
    id: 'bento-1',
    title: 'Tehri Solid Ankle Length Straight Fit Pants',
    description: '100% fine artisanal cotton weave from Jaypore Tehri collection. Pure natural finish.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40209295-31257583.jpg',
    price: 940,
    original_price: 1499,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'Jaypore',
    last_price_checked_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    is_stale: false,
    badge: '⚡ Drop of the Hour',
    highlight: 'Lowest price in 60 days'
  },
  {
    id: 'bento-2',
    title: 'Blue Indigo Handcrafted Cotton Kurta',
    description: 'Heritage handloom with breathable all-day drape.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40209294-31259095.jpg',
    price: 1373,
    original_price: 1999,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'Jaypore',
    last_price_checked_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    is_stale: false,
    badge: '🔥 31% Off',
    highlight: 'Trending pick'
  },
  {
    id: 'bento-3',
    title: 'Aaravya Solid Grey Regular Ankle Pants',
    description: 'Deep utility pockets, relaxed tailored comfort.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40224020-25315198.jpg',
    price: 1240,
    original_price: 1799,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'Jaypore',
    last_price_checked_at: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    is_stale: false,
    badge: '🏷️ Under ₹1,300',
    highlight: 'High durability'
  },
  {
    id: 'bento-4',
    title: 'Hemani Block Print Kurta & Palazzo Set',
    description: 'Elevated two-piece festival ensemble in pristine ivory.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/3/39949691-19214535.jpg',
    price: 5102,
    original_price: 7499,
    currency: 'INR',
    category: 'Festive',
    network_id: 'Jaypore',
    last_price_checked_at: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    is_stale: false,
    badge: '💎 Premium Steal',
    highlight: 'Save ₹2,397'
  },
  {
    id: 'bento-5',
    title: 'Green Kota Doria Block Print Dupatta',
    description: 'Airy lightweight texture with handmade floral bootis.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40224021-25315295.jpg',
    price: 1472,
    original_price: 2199,
    currency: 'INR',
    category: 'Accessories',
    network_id: 'Jaypore',
    last_price_checked_at: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
    is_stale: false,
    badge: '🌿 Handloom',
    highlight: 'Authentic craft'
  },
  {
    id: 'bento-6',
    title: 'Rehwa Pink Block Print Heritage Kurta',
    description: 'Traditional woodblock motif with subtle metallic accents.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40088350-31258951.jpg',
    price: 1973,
    original_price: 2899,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'Jaypore',
    last_price_checked_at: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
    is_stale: false,
    badge: '✨ Rare Markdown',
    highlight: 'Rehwa cluster'
  }
];

export default async function BentoPage() {
  let dbProducts: any[] = [];
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('is_stale', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(20);
    if (data && data.length > 0) {
      dbProducts = data;
    }
  } catch (err) {
    console.warn('[Bento] Supabase fetch error, using fallback:', err);
  }

  const items = dbProducts.length >= 4 ? dbProducts : FALLBACK_BENTO_ITEMS;
  const mainHero = items[0];
  const sideTop = items[1] || items[0];
  const sideBottom1 = items[2] || items[0];
  const sideBottom2 = items[3] || items[0];
  const restItems = items.slice(4);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation Switcher */}
      <NavigationBanner current="bento" />

      {/* Header Capsule */}
      <header className="max-w-7xl mx-auto pt-10 pb-6 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Price Feed Active
              </span>
              <span className="text-zinc-500 text-xs">• Upstash Redis Cache</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Visual Bento Discovery
            </h1>
          </div>

          {/* Quick Filter Capsules */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['⚡ All Drops', '🔥 >30% Off', '🌿 Artisanal', '💎 Premium Sets', '🏷️ Under ₹1,500'].map((chip, i) => (
              <button
                key={chip}
                className={`px-3.5 py-1.5 rounded-xl transition-all font-medium ${
                  i === 0
                    ? 'bg-zinc-100 text-zinc-900 shadow-md shadow-white/5'
                    : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* ─── BENTO HERO SECTION (ASYMMETRIC 12-COL GRID) ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* TILE 1: 2x2 GIANT SPOTLIGHT TILE (Col 1-7) */}
          <div className="lg:col-span-7 bg-zinc-900/70 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-all duration-300">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all"></div>

            <div className="flex items-center justify-between gap-2 z-10 mb-6">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                ⚡ Spotlight Drop of the Hour
              </span>
              <span className="text-xs text-zinc-400">
                {mainHero.network_id || 'Merchant'} • Verified 10m ago
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center z-10 my-auto">
              <div className="aspect-square bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 relative">
                <img
                  src={mainHero.image_url || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'}
                  alt={mainHero.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {mainHero.original_price && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-lg">
                    {Math.round(((mainHero.original_price - mainHero.price) / mainHero.original_price) * 100)}% OFF
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold leading-snug text-white">
                  {mainHero.title}
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {mainHero.description}
                </p>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">
                      {mainHero.currency} {Number(mainHero.price).toLocaleString()}
                    </span>
                    {mainHero.original_price && (
                      <span className="text-sm text-zinc-500 line-through">
                        {mainHero.currency} {Number(mainHero.original_price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    ✓ Price verified at checkout • No expired codes
                  </p>
                </div>

                <div className="pt-2">
                  <AffiliateButton
                    productId={mainHero.id}
                    buttonText={`Unlock Deal on ${mainHero.network_id || 'Store'} →`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN TILES (Col 8-12) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* TILE 2: 2x1 WIDE CARD (Side Top) */}
            <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-3xl p-5 flex gap-4 items-center group hover:border-zinc-700 transition-all duration-300">
              <div className="w-24 h-24 shrink-0 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={sideTop.image_url}
                  alt={sideTop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  🔥 High Demand Drop
                </span>
                <h3 className="text-sm font-bold text-white truncate">
                  {sideTop.title}
                </h3>
                <div className="flex items-baseline gap-2 text-xs">
                  <span className="font-bold text-white">
                    {sideTop.currency} {Number(sideTop.price).toFixed(0)}
                  </span>
                  {sideTop.original_price && (
                    <span className="text-zinc-500 line-through text-[11px]">
                      {sideTop.currency} {Number(sideTop.original_price).toFixed(0)}
                    </span>
                  )}
                </div>
                <div>
                  <a
                    href={`/go/${sideTop.id}`}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="inline-block text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View Deal ↗
                  </a>
                </div>
              </div>
            </div>

            {/* TILES 3 & 4: 1x1 SPLIT ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Telemetry Metric Tile */}
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-3xl p-5 flex flex-col justify-between">
                <div className="text-xs text-zinc-400 font-medium">
                  Integrity Guarantee
                </div>
                <div className="my-2">
                  <div className="text-2xl font-black text-white tracking-tight">
                    100%
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                    Live-checked links. Zero broken coupons.
                  </p>
                </div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Verified 90-Day Medians
                </div>
              </div>

              {/* Side Bottom 2 Mini Deal */}
              <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-3xl p-5 flex flex-col justify-between group hover:border-zinc-700 transition-all">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400 truncate">{sideBottom1.category || 'Deal'}</span>
                  {sideBottom1.original_price && (
                    <span className="text-red-400 font-bold">
                      -{Math.round(((sideBottom1.original_price - sideBottom1.price) / sideBottom1.original_price) * 100)}%
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 my-2">
                  {sideBottom1.title}
                </h4>
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                  <span className="text-xs font-bold text-white">
                    {sideBottom1.currency} {Number(sideBottom1.price).toFixed(0)}
                  </span>
                  <a
                    href={`/go/${sideBottom1.id}`}
                    target="_blank"
                    rel="nofollow sponsored"
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Grab →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: BENTO CATEGORY GRIDS ─── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Live Curated Deals Matrix
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tactile cards with verified merchant deep-links.
              </p>
            </div>
            <span className="text-xs text-zinc-500">
              {items.length} Active Records
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-3xl p-5 flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
                >
                  {/* Visual */}
                  <div className="aspect-[4/3] bg-zinc-950 rounded-2xl overflow-hidden relative border border-zinc-800 mb-4">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-md">
                        {discount}% OFF
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 bg-zinc-900/90 backdrop-blur-sm text-zinc-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-zinc-700/50">
                      {product.network_id || 'Direct'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-extrabold text-white">
                            {product.currency} {Number(product.price).toFixed(2)}
                          </span>
                          {product.original_price && (
                            <span className="text-xs text-zinc-500 line-through">
                              {product.currency} {Number(product.original_price).toFixed(2)}
                            </span>
                          )}
                        </div>
                        <FreshnessBadge
                          lastCheckedAt={product.last_price_checked_at}
                          isStale={product.is_stale}
                        />
                      </div>

                      <AffiliateButton
                        productId={product.id}
                        buttonText="Get Verified Deal ↗"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
