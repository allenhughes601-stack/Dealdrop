import { supabase } from '../supabaseClient';

export interface Affiliatelinks {
    affiliateurl: string; 
    product_id: string; 
    networkId: string;
}

export async function getaffiliatelinkbyid(productId: string): Promise<Affiliatelinks | null> {
    const { data, error } = await supabase
        .from('link_reg')
        .select('link_url, products_id, network_id')
        .eq('products_id', productId)
        .maybeSingle();
    
    if (error || !data) {
        console.warn(`[registry lookup] no affiliate link found for product: ${productId}`);
        return null;
    }

    return {
        affiliateurl: data.link_url,
        product_id: data.products_id,
        networkId: data.network_id || '',
    };
}