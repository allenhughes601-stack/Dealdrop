import { parse } from 'csv-parse/sync';
import { NormalizedProduct } from '../../../types/products';

export function parseCsvFeed(
  csvContent: string,
  networkId: string,
  category: string
): NormalizedProduct[] {
  const products: NormalizedProduct[] = [];

  const records: unknown[] = parse(csvContent, {
    columns: true,               // Uses first row as header keys
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,    // Doesn't crash on slightly uneven rows
  });

  for (const record of records) {
    try {
      const row = record as Record<string, any>;
      const id = row.id || row.product_id || row.sku;
      const title = row.title || row.name || row.product_name;
      const price = parseFloat(row.price || row.deal_price || row.sale_price);

      if (!id || !title || isNaN(price)) continue;

      products.push({
        externalProductId: String(id),
        title: String(title),
        description: row.description || row.desc || '',
        imageUrl: row.image_url || row.image || row.img || '',
        price: price,
        originalPrice: row.original_price ? parseFloat(row.original_price) : undefined,
        currency: row.currency || 'INR',
        category: category,
        affiliateUrl: row.affiliate_url || row.url || row.link || '',
        networkId: networkId,
      });
    } catch (err) {
      console.warn(`[CSV Parser] Skipped malformed row:`, err);
    }
  }

  return products;
}