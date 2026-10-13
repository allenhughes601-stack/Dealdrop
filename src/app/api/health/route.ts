import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic'; // Never cache the health check!

export async function GET() {
    try {
        // Ping the database by checking for a single product ID
        const { error } = await supabase.from('products').select('id').limit(1);
        
        if (error) throw error;

         const { data: lastRun } = await supabase
          .from('feed_runs')
          .select('completed_at, status')
          .order('completed_at', { ascending: false })
          .limit(1)
          .single();

        const hoursSinceLastRun = lastRun?.completed_at
          ? (Date.now() - new Date(lastRun.completed_at).
  getTime()) / 1000 / 60 / 60
          : 999;

        return NextResponse.json({ status: 'healthy', database: 'connected' , last_feed_run: lastRun?.completed_at ?? 'never',feed_status: lastRun?.status ?? 'unknown',feed_overdue: hoursSinceLastRun > 2,}, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ status: 'unhealthy', error: error.message }, { status: 503 });
    }
}