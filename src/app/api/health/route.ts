import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic'; // Never cache the health check!

export async function GET() {
    try {
        // Ping the database by checking for a single product ID
        const { error } = await supabase.from('products').select('id').limit(1);
        
        if (error) throw error;
        return NextResponse.json({ status: 'healthy', database: 'connected' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ status: 'unhealthy', error: error.message }, { status: 503 });
    }
}