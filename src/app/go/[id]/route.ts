import { NextRequest, NextResponse } from 'next/server';
import { getaffiliatelinkbyid } from '@/lib/redirect/registrylookup';
import { logclickevent } from '@/lib/redirect/clicklogger';
import { checkRateLimit } from '@/lib/redirect/ratelimiter';
import { validateReferer } from '@/lib/redirect/referervalidator';
import { validateredirectchain } from '@/lib/redirect/validateredirectchain';

// Request headers on every response from this route
const redirect_header = {
    'X-Robots-Tag': 'noindex, nofollow',
    'Cache-Control': 'no-store, no-cache',
};

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id: productId } = await context.params;
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const referer = request.headers.get('referer') || '';
    const userAgent = request.headers.get('user-agent') || '';

    // Guard 1: Referer validator [FR-11]
    const referercheck = validateReferer(referer || null);

    if (!referercheck.valid) {
        await logclickevent({
            productId,
            ipAddress: clientIp,
            referer,
            userAgent,
            status: 'rejected_referer',
            rejectionReason: referercheck.reason,
        });

        return new NextResponse('Forbidden', {
            status: 403,
            headers: redirect_header,
        });
    }

    // Guard 2: IP rate limiting [FR-10]
    const ratelimitecheck = await checkRateLimit(clientIp);
    if (!ratelimitecheck.allowed) {
        await logclickevent({
            productId,
            ipAddress: clientIp,
            referer,
            userAgent,
            status: 'rejected_rate_limit',
            rejectionReason: `Rate limit exceeded. resets at ${ratelimitecheck.resetAt.toISOString()}`,
        });

        return new NextResponse('Too many requests', {
            status: 429,
            headers: {
                ...redirect_header,
                'Retry-After': String(Math.ceil((ratelimitecheck.resetAt.getTime() - Date.now()) / 1000)),
            },
        });
    }

    // Resolve affiliate link URL from central registry [FR-08]
    const linkRecord = await getaffiliatelinkbyid(productId);
    if (!linkRecord) {
        await logclickevent({
            productId,
            ipAddress: clientIp,
            referer,
            userAgent,
            status: 'rejected_not_found',
            rejectionReason: 'Product ID not found in registry',
        });

        return new NextResponse('Not Found', {
            status: 404,
            headers: redirect_header,
        });
    }

    // Guard 3: Redirect chain validation check [FR-09]
    // Non-blocking validation for hop-limit security
    validateredirectchain(linkRecord.affiliateurl).then((isValid) => {
        if (!isValid) {
            console.warn(`[Redirect Chain] Hop limit exceeded for product ${productId}`);
        }
    });

    // ── SUCCESS: Log + Redirect [FR-05, FR-06, FR-12]
    await logclickevent({
        productId,
        ipAddress: clientIp,
        referer,
        userAgent,
        status: 'honoured',
    });

    return NextResponse.redirect(linkRecord.affiliateurl, {
        status: 302,
        headers: redirect_header,
    });
}