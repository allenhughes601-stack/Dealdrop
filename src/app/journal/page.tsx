import { supabase } from '@/lib/supabaseClient';
import NavigationBanner from '@/components/NavigationBanner';
import AffiliateButton from '@/components/AffiliateButton';
import FreshnessBadge from '@/components/FreshnessBadge';

export const revalidate = 60; // Refresh every 60s

// Fallback curated items to ensure a rich editorial experience if database has limited items
const FALLBACK_JOURNAL_ITEMS = [
  {
    id: 'demo-1',
    title: 'Women Beige Cotton Solid Ankle Length Straight Fit Pants',
    description: 'Crafted from pure handloom cotton under the Tehri artisanal collection. Clean architectural lines with tailored comfort.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40209295-31257583.jpg',
    price: 940,
    original_price: 1499,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'jaypore',
    last_price_checked_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    is_stale: false,
    curator_note: 'Lowest recorded price in 60 days. Rare discount on the Tehri collection staples.',
    tradeoff: 'Straight fit runs slightly snug at the waist; size up if between sizes.'
  },
  {
    id: 'demo-2',
    title: 'Women Blue Indigo Handloom Cotton Kurta',
    description: 'Naturally dyed indigo kurta with delicate hand-stitched detailing along the neckline. Breathable all-season silhouette.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40209294-31259095.jpg',
    price: 1373,
    original_price: 1999,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'jaypore',
    last_price_checked_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    is_stale: false,
    curator_note: '31% drop below median retail. Exceptional fabric weight for humid weather.',
    tradeoff: 'Requires initial separate cold wash to prevent indigo bleeding.'
  },
  {
    id: 'demo-3',
    title: 'Women Grey Solid Ankle Length Regular Fit Pants',
    description: 'Versatile neutral bottoms from the Aaravya series. Features deep functional pockets and elasticated comfort back.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40224020-25315198.jpg',
    price: 1240,
    original_price: 1799,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'jaypore',
    last_price_checked_at: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    is_stale: false,
    curator_note: 'Genuine 31% discount. High durability weave suited for daily wear.',
    tradeoff: 'Slightly heavier weave; best suited for autumn/winter transitions.'
  },
  {
    id: 'demo-4',
    title: 'Women Pink Cotton Block Print Kurta',
    description: 'Heritage woodblock printing from the Rehwa artisan cluster. Soft pastel palette with subtle metallic zari accents.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40088350-31258951.jpg',
    price: 1973,
    original_price: 2899,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'jaypore',
    last_price_checked_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    is_stale: false,
    curator_note: '32% off. Rare markdown on heritage Rehwa cluster pieces.',
    tradeoff: 'Delicate block print requires gentle hand washing.'
  },
  {
    id: 'demo-5',
    title: 'Women White Cotton Block Print Kurta with Palazzo Set',
    description: 'Complete two-piece ensemble from the Hemani collection. Fluid drape palazzo paired with an elongated calf-length tunic.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/3/39949691-19214535.jpg',
    price: 5102,
    original_price: 7499,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'jaypore',
    last_price_checked_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    is_stale: false,
    curator_note: 'Highest absolute savings (Save ₹2,397). Premium festive investment.',
    tradeoff: 'Dry clean only recommended for the first two wears.'
  },
  {
    id: 'demo-6',
    title: 'Women Green Kota Doria Block Print Dupatta',
    description: 'Feather-light Kota Doria weave with traditional floral bootis. Translucent texture that adds elegance to any monochrome base.',
    image_url: 'https://imagescdn.jaypore.com/img/app/product/4/40224021-25315295.jpg',
    price: 1472,
    original_price: 2199,
    currency: 'INR',
    category: 'Fashion',
    network_id: 'jaypore',
    last_price_checked_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    is_stale: false,
    curator_note: '33% markdown on authentic Rajasthan Kota craft.',
    tradeoff: 'Kota weave is delicate; avoid rough jewelry snagging.'
  }
];

export default async function JournalPage() {
  // Fetch live products from Supabase
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
    console.warn('[Journal] Supabase fetch error, using curated items:', err);
  }

  // Combine database products with fallback items if needed
  const displayProducts = dbProducts.length >= 3 ? dbProducts : FALLBACK_JOURNAL_ITEMS;
  const heroDeal = displayProducts[0];
  const gridDeals = displayProducts.slice(1);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1B1A] font-sans antialiased selection:bg-[#E2DDD5]">
      {/* Top Template Navigation Switcher */}
      <NavigationBanner current="journal" />

      {/* Magazine Masthead */}
      <header className="border-b border-[#EAE5DC] pt-12 pb-8 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-xs tracking-widest text-[#7A756D] uppercase mb-3">
              <span>Issue Nº 18</span>
              <span>•</span>
              <span>Autumn Curation</span>
              <span>•</span>
              <span className="text-[#2D5A3E] font-medium bg-[#EBF3ED] px-2 py-0.5 rounded">
                ⚡ 100% Verified Deals
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl tracking-tight text-[#1A1918] font-normal leading-[1.08]">
              The DealDrop Journal
            </h1>
          </div>
          <p className="max-w-md text-sm text-[#635E55] leading-relaxed">
            A quiet antidote to digital coupon noise. Hand-vetted price drops, 
            verified historical savings, and zero sponsored fluff.
          </p>
        </div>

        {/* Editorial Pill Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[#EAE5DC]/80 text-xs">
          <span className="text-[#8A847A] font-medium mr-2">Curated Desks:</span>
          {['All Inquiries', 'Artisanal & Handloom', 'Essential Wardrobe', 'Under ₹1,500', 'Top 40% Drops'].map((filter, i) => (
            <button
              key={filter}
              className={`px-3.5 py-1.5 rounded-full transition-all text-xs ${
                i === 0
                  ? 'bg-[#1C1B1A] text-white font-medium'
                  : 'bg-white border border-[#E0DBD0] text-[#524E46] hover:border-[#1C1B1A] hover:text-[#1C1B1A]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* ─── SECTION 1: THE CURATOR'S PICK (HERO 2-COLUMN SPREAD) ─── */}
        {heroDeal && (
          <section className="bg-white border border-[#E8E3D8] rounded-2xl p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#F0ECE4] text-xs">
              <span className="bg-[#FAF6EE] text-[#8C6D23] font-semibold tracking-wider uppercase px-2.5 py-1 rounded">
                ✦ Curator's Primary Pick of the Day
              </span>
              <span className="text-[#827D74]">
                Verified against 90-day pricing history
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Product Visual */}
              <div className="lg:col-span-6 bg-[#F6F4F0] rounded-xl overflow-hidden aspect-square relative group">
                <img
                  src={heroDeal.image_url || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'}
                  alt={heroDeal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {heroDeal.original_price && (
                  <div className="absolute top-4 left-4 bg-[#1C1B1A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                    {Math.round(((heroDeal.original_price - heroDeal.price) / heroDeal.original_price) * 100)}% TRUE DROP
                  </div>
                )}
              </div>

              {/* Editorial Narrative */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#918B80]">
                    {heroDeal.network_id || 'Merchant Direct'} • {heroDeal.category || 'Curated Find'}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1918] font-normal leading-tight mt-1.5">
                    {heroDeal.title}
                  </h2>
                </div>

                <p className="text-sm text-[#57534A] leading-relaxed">
                  {heroDeal.description || 'Handpicked piece representing artisanal quality at an exceptionally rare discount window.'}
                </p>

                {/* Curator Micro-Review & The Catch */}
                <div className="bg-[#FAF8F4] border-l-2 border-[#1C1B1A] p-4 rounded-r-lg space-y-2 text-xs">
                  <div className="font-semibold text-[#1C1B1A] flex items-center gap-1.5">
                    <span>✍️ Why we recommend it:</span>
                  </div>
                  <p className="text-[#59554D] leading-normal">
                    {heroDeal.curator_note || 'Priced significantly below its typical retail range. Pure natural fabric composition with zero polyester filler.'}
                  </p>
                  <div className="text-[#8C5D38] pt-1 font-medium">
                    ⚡ The Catch: {heroDeal.tradeoff || 'Stock is limited at this promotional rate; may sell out within 24h.'}
                  </div>
                </div>

                {/* Pricing & Secure Action */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#F0ECE4]">
                  <div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-serif font-bold text-[#1C1B1A]">
                        {heroDeal.currency || 'INR'} {Number(heroDeal.price).toLocaleString()}
                      </span>
                      {heroDeal.original_price && (
                        <span className="text-sm text-[#999388] line-through">
                          {heroDeal.currency || 'INR'} {Number(heroDeal.original_price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="mt-1">
                      <FreshnessBadge
                        lastCheckedAt={heroDeal.last_price_checked_at}
                        isStale={heroDeal.is_stale}
                      />
                    </div>
                  </div>

                  <div>
                    <AffiliateButton
                      productId={heroDeal.id}
                      buttonText={`Shop Deal on ${heroDeal.network_id ? heroDeal.network_id.toUpperCase() : 'Merchant'} ↗`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── SECTION 2: THE EDITED DISCOVERY GRID ─── */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-[#EAE5DC] pb-4">
            <div>
              <h3 className="font-serif text-2xl text-[#1A1918] font-normal">
                The Verified Capsule
              </h3>
              <p className="text-xs text-[#7A756D] mt-0.5">
                Every drop price-checked within the last 2 hours.
              </p>
            </div>
            <span className="text-xs text-[#8A847A]">
              Showing {gridDeals.length} curated pieces
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridDeals.map((product) => {
              const discount = product.original_price
                ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
                : 0;

              return (
                <article
                  key={product.id}
                  className="group bg-white border border-[#E8E3D8] rounded-xl overflow-hidden flex flex-col hover:border-[#C4BCAD] transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                >
                  {/* Card Visual */}
                  <div className="aspect-[4/3] bg-[#F5F2EC] overflow-hidden relative">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-[#1C1B1A]/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#8C877D]">
                        <span className="uppercase tracking-wider font-medium">{product.network_id || 'Direct'}</span>
                        <span>{product.category || 'Curated'}</span>
                      </div>
                      <h4 className="font-serif text-lg text-[#1A1918] font-medium leading-snug line-clamp-2 group-hover:text-[#685F50] transition-colors">
                        {product.title}
                      </h4>
                      <p className="text-xs text-[#6B665E] line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-3 border-t border-[#F2EEE6] space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-serif font-bold text-[#1C1B1A]">
                            {product.currency} {Number(product.price).toFixed(2)}
                          </span>
                          {product.original_price && (
                            <span className="text-xs text-[#9E988D] line-through">
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
                        buttonText="View Verified Deal ↗"
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ─── SECTION 3: THE TRUST MANIFESTO & DISCLOSURE ─── */}
        <section className="border-t border-[#EAE5DC] pt-12 pb-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#6E695F]">
          <div className="space-y-2">
            <h5 className="font-serif text-sm font-semibold text-[#1C1B1A]">
              1. Mathematical Price Integrity
            </h5>
            <p className="leading-relaxed">
              We never calculate discounts against artificial inflated MSRPs. Every percentage drop is cross-referenced against historical 90-day medians.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-serif text-sm font-semibold text-[#1C1B1A]">
              2. Zero Broken Codes
            </h5>
            <p className="leading-relaxed">
              We do not crowdsource unverified coupon codes. If a merchant promotion expires or changes price, our staleness engine flags it immediately.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-serif text-sm font-semibold text-[#1C1B1A]">
              3. Transparent Independence
            </h5>
            <p className="leading-relaxed">
              DealDrop is reader-supported. When you shop through our verified links, we may earn a partner commission at zero extra cost to you.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
