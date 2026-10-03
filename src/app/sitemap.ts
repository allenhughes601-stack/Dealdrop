import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabaseClient";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/search`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        }
    ];

    // Dynamic product routes
    try {
        const { data: products } = await supabase
            .from('products')
            .select('id, updated_at')
            .eq('is_stale', false)
            .limit(500);

        const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
            url: `${baseUrl}/products/${p.id}`,
            lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
            changeFrequency: 'daily',
            priority: 0.7,
        }));

        return [...staticRoutes, ...productRoutes];
    } catch (err) {
        console.error('[Sitemap] Error fetching products:', err);
        return staticRoutes;
    }
}