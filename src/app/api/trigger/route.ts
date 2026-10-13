import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { supabase } from '@/lib/supabaseClient';
import { executeIngestJob, IngestJobConfig } from '@/lib/pipeline/runpipeline';

// Initialize Redis client at module level (no await needed here — just setup)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const LOCK_KEY = 'feed_sync_lock';
const LOCK_TTL = 600; // 10 minutes max

// Helper to validate and default ingestion job configuration
function parseConfig(raw: Partial<IngestJobConfig>): IngestJobConfig {
  return {
    feedUrl: raw.feedUrl || './offers.csv',
    format: (raw.format as 'csv' | 'json' | 'xml') || 'csv',
    networkId: raw.networkId || 'cuelinks-jaypore',
    category: raw.category || 'general',
  };
}

// Shared handler — contains all lock + idempotency + pipeline logic
async function handleTrigger(config: IngestJobConfig): Promise<NextResponse> {
  // --- Idempotency: reject duplicate runs within the same minute ---
  const jobId = `sync_${new Date().toISOString().slice(0, 16)}`; // e.g. "sync_2026-10-13T14:30"

  const { data: existing } = await supabase
    .from('feed_runs')
    .select('id')
    .eq('job_id', jobId)
    .single();

  if (existing) {
    return NextResponse.json(
      { success: false, message: 'Already ran this minute.' },
      { status: 409 }
    );
  }

  // --- Distributed Lock: prevent overlapping runs ---
  const lock = await redis.set(LOCK_KEY, '1', { nx: true, ex: LOCK_TTL });

  if (!lock) {
    return NextResponse.json(
      { success: false, message: 'Sync already running. Try again later.' },
      { status: 409 }
    );
  }

  // Insert job record before running
  await supabase.from('feed_runs').insert({ job_id: jobId, status: 'running' });

  try {
    const result = await executeIngestJob(config);
    return NextResponse.json({ success: true, jobId, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    // Always release the lock — even if the job crashes
    await redis.del(LOCK_KEY);
  }
}

// GET /api/trigger?feedUrl=...&format=csv&networkId=amazon&category=electronics
export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const config = parseConfig({
    feedUrl: searchParams.get('feedUrl') || undefined,
    format: (searchParams.get('format') as 'csv' | 'json' | 'xml') || undefined,
    networkId: searchParams.get('networkId') || undefined,
    category: searchParams.get('category') || undefined,
  });

  return handleTrigger(config);
}

// POST /api/trigger
// Body: { "feedUrl": "https://...", "format": "csv", "networkId": "amazon", "category": "electronics" }
export async function POST(request: NextRequest) {
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const config = parseConfig(body);

  return handleTrigger(config);
}