import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return {
        rules: {
            userAgent: '*',
            disallow: [
                '/go/',
                '/admin/',
                '/api/',
                '/*?category=',
                '/*?sort=',
                '/*?color=',
                '/*?filter=',
                '/*?page=',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}