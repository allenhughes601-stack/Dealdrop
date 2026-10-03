import axios from "axios";

export async function validateredirectchain(affiliateUrl: string): Promise<boolean> {
    let hopCount = 0;
    let currentUrl = affiliateUrl;
    const MAX_HOPS = 2;

    try {
        while (hopCount < MAX_HOPS) {
            const response = await axios.head(currentUrl, {
                maxRedirects: 0,
                timeout: 5000,
                validateStatus: (status) => status >= 200 && status < 400,
            });

            // If not redirect - we are at final destination
            if (response.status < 300 || response.status >= 400) {
                return true;
            }

            // Follow the redirect manually and count
            const nextUrl = response.headers['location'];
            if (!nextUrl) return true;

            currentUrl = nextUrl;
            hopCount++;
        }

        // Exceeded max_hops
        console.warn(`[redirect validator] Chain exceeded ${MAX_HOPS} hops for: ${affiliateUrl}`);
        return false;
    } catch {
        // If HEAD fails (some servers block HEAD), assume valid and let user browser handle it
        return true;
    }
}