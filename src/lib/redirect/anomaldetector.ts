// Background job that queries click_logs and fires a webhook alert when suspicious spike patterns are detected
import { supabase } from "../supabaseClient";

const SPIKE_THRESHOLD = parseInt(process.env.ALERT_SPIKE_THRESHOLD || '20', 10);
const SPIKE_WINDOW_MINUTES = parseInt(process.env.ALERT_SPIKE_WINDOW_MINUTES || '5', 10);
const ALERT_WEBHOOK_URL = process.env.ALERT_WEBHOOK_URL || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

export interface SpikeAlert {
    product_id: string;
    ip_address: string;
    click_count: number;
    windowMinutes: number;
}

export async function runAnomalyDetection(): Promise<SpikeAlert[]> {
    const windowStart = new Date(
        Date.now() - SPIKE_WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    // Query honoured clicks grouped by (product_id, ip_address) in time window
    const { data, error } = await supabase.rpc('detect_click_spikes', {
        p_window_start: windowStart,
        p_threshold: SPIKE_THRESHOLD,
    });

    if (error) {
        console.error('[Anomaly Detector] Query failed:', error.message);
        return [];
    }

    const alerts: SpikeAlert[] = (data || []).map((row: any) => ({
        product_id: row.product_id,
        ip_address: row.ip_address,
        click_count: Number(row.click_count),
        windowMinutes: SPIKE_WINDOW_MINUTES,
    }));

    // Fire alert for each spike detected
    for (const alert of alerts) {
        console.warn(
            `[SPIKE ALERT] product: ${alert.product_id} | IP: ${alert.ip_address} | clicks: ${alert.click_count} in ${SPIKE_WINDOW_MINUTES} mins`
        );

        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            const message =
                `🚨 *CLICK SPIKE ALERT*\n\n` +
                `Product: \`${alert.product_id}\`\n` +
                `IP: \`${alert.ip_address}\`\n` +
                `Clicks: *${alert.click_count}* in ${SPIKE_WINDOW_MINUTES} mins`;

            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown',
                }),
            }).catch((err) => console.error('[Alert] Telegram webhook failed:', err.message));

        } else if (ALERT_WEBHOOK_URL) {
            await fetch(ALERT_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `🚨 CLICK SPIKE: Product ${alert.product_id} | IP ${alert.ip_address} | ${alert.click_count} clicks in ${SPIKE_WINDOW_MINUTES} mins`,
                }),
            }).catch((err) => console.error('[Alert] Webhook failed:', err.message));
        }
    }

    return alerts;
}
