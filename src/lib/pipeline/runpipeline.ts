import { downloadandparsefeed } from './feed_download';
import { syncProductsToDatabase } from './syncproduct';
import { markStaleProducts } from './stalenesscheck';
import { sendAlertWebhook } from '../monitoring/notifier';

export interface IngestJobConfig {
  feedUrl: string;
  format: 'json' | 'csv' | 'xml';
  networkId: string;
  category: string;
}

export async function executeIngestJob(config: IngestJobConfig) {
  console.log(`[Pipeline] Starting feed ingest for ${config.networkId} - ${config.category}...`);

  try {
    // 1. Download & Parse
    const feedResult = await downloadandparsefeed(
      config.feedUrl,
      config.format,
      config.networkId,
      config.category
    );

    console.log(`[Pipeline] Parsed ${feedResult.products.length} products.`);

    if (feedResult.products.length === 0) {
      await sendAlertWebhook(
        `⚠️ Pipeline Warning: Feed for ${config.networkId} / ${config.category} returned 0 products. Check feed URL or format.`
      );
    }

    // 2. Sync to Supabase
    const syncResult = await syncProductsToDatabase(feedResult);
    console.log(`[Pipeline] Sync complete: ${syncResult.successCount} saved, ${syncResult.failCount} failed.`);

    // 3. Run staleness check
    await markStaleProducts();

    // 4. Purge frontend ISR cache so new products appear immediately
    await triggerFrontendCachePurge();

    return {
      ...feedResult,
      ...syncResult,
    };

  } catch (error: any) {
    console.error('[Pipeline] Fatal error during ingest job:', error.message);
    await sendAlertWebhook(
      `🚨 Pipeline FAILED for ${config.networkId} / ${config.category}.\nError: ${error.message}`
    );
    throw error;
  }
}

async function triggerFrontendCachePurge() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    await fetch(`${SITE_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REVALIDATION_SECRET}`,
      },
      body: JSON.stringify({ path: '/' }),
    });
    console.log('[Cache] Frontend ISR cache purged successfully.');
  } catch (error) {
    console.error('[Cache] Failed to purge frontend cache:', error);
  }
}
