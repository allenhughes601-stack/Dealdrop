import axios from 'axios';
import { parseJsonFeed } from './parser/json_parsers';
import { parseCsvFeed } from './parser/csv_parser';
import { parseXmlFeed } from './parser/xml_parsers';
import { FeedRunResult, NormalizedProduct } from '../../types/products';

export async function downloadandparsefeed(
    feedUrl: string,
    format: 'json' | 'csv' | 'xml',
    networkId: string,
    category: string
): Promise<FeedRunResult> {
    const errors: string[] = [];

    try {
        // Download raw feed content
        const response = await axios.get(feedUrl, {
            timeout: 10000,
            responseType: format === 'json' ? 'json' : 'text',
            headers: { 'user-agent': 'DealPlatformFeedIngestion/1.0' },
        });

        let products: NormalizedProduct[] = [];

        // Route to appropriate parser
        if (format === 'json') {
            products = parseJsonFeed(response.data, networkId, category);
        } else if (format === 'csv') {
            products = parseCsvFeed(response.data, networkId, category);
        } else if (format === 'xml') {
            products = parseXmlFeed(response.data, networkId, category);
        }

        return {
            networkId,
            category,
            totalRecords: products.length,
            successfulRecords: products.length,
            failedRecords: 0,
            products,
            errors,
        };
    } catch (err: any) {
        const errormsg = `Failed to download/parse feed from ${feedUrl}: ${err.message}`;
        console.error('[Feed Download Error]', errormsg);
        errors.push(errormsg);

        return {
            networkId,
            category,
            totalRecords: 0,
            successfulRecords: 0,
            failedRecords: 0,
            products: [],
            errors,
        };
    }
}