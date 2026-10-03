import { NextRequest, NextResponse } from 'next/server';
import { executeIngestJob, IngestJobConfig } from '@/lib/pipeline/runpipeline';

// Helper to validate and default ingestion job configuration
function parseConfig(raw: Partial<IngestJobConfig>): IngestJobConfig {
  return {
    feedUrl: raw.feedUrl || './offers.csv',
    format: (raw.format as 'csv' | 'json' | 'xml') || 'csv',
    networkId: raw.networkId || 'cuelinks-jaypore',
    category: raw.category || 'general',
  };
}

// GET /api/trigger?feedUrl=...&format=csv&networkId=amazon&category=electronics
export async function GET(request: NextRequest) {
   if (!process.env.CRON_SECRET) {
       return NextResponse.json({error: 'Server configuration error'}, {status: 503});
   }
   
   const authHeader = request.headers.get('authorization');
    if(authHeader !== `Bearer ${process.env.CRON_SECRET}`){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
  try {
    const { searchParams } = new URL(request.url);

    const config = parseConfig({
      feedUrl: searchParams.get('feedUrl') || undefined,
      format: (searchParams.get('format') as 'csv' | 'json' | 'xml') || undefined,
      networkId: searchParams.get('networkId') || undefined,
      category: searchParams.get('category') || undefined,
    });

    const result = await executeIngestJob(config);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/trigger
// Body: { "feedUrl": "https://...", "format": "csv", "networkId": "amazon", "category": "electronics" }
export async function POST(request: NextRequest){
   if (!process.env.CRON_SECRET) {
       return NextResponse.json({error: 'Server configuration error'}, {status: 503});
   }

   const authHeader = request.headers.get('authorization');
    if(authHeader !== `Bearer ${process.env.CRON_SECRET}`){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

  try {
    const body = await request.json().catch(() => ({}));
    const config = parseConfig(body);

    const result = await executeIngestJob(config);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}