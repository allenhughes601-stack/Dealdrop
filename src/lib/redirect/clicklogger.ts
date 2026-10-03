import { supabase } from "../supabaseClient";

interface ClickEventPayload {
    productId: string;
    ipAddress: string;
    referer?: string;
    userAgent?: string;
    status: 'honoured' | 'rejected_not_found' | 'rejected_rate_limit' | 'rejected_referer' | 'rejected_bot';
    rejectionReason?: string;
}

export async function logclickevent(payload: ClickEventPayload): Promise<void> {
    // Fire and forget: non-blocking, never delays the redirects
    supabase
        .from('click_logs')
        .insert({
            products_id: payload.productId,
            timestamp: new Date().toISOString(),
            ip_address: payload.ipAddress,
            user_agent: payload.userAgent || null,
            referer: payload.referer || null,
            status: payload.status,
            rejection_reason: payload.rejectionReason || null,
        })
        .then(({ error }) => {
            if (error) console.error('[click logger] Failed to write log:', error.message);
        });
}