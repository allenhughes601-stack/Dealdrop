import { NextRequest, NextResponse } from 'next/server';
import { runAnomalyDetection } from '@/lib/redirect/anomaldetector';

export async function POST(request: NextRequest) {
    if (!process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 503 });
    }
    // Protect endpoint with CRON_SECRET token
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const alerts = await runAnomalyDetection();

    return NextResponse.json({
        success: true,
        alertsFired: alerts.length,
        alerts,
    });
}