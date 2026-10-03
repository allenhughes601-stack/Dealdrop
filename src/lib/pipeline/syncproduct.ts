 import { supabase } from '../supabaseClient';                                                       
    import { NormalizedProduct, FeedRunResult } from '../../types/products';                             
    import { fetchOgFallback } from './ogScraper';                                                      
                                                                                                        
    export async function syncProductsToDatabase(                                                       
      feedResult: FeedRunResult                                                                         
    ): Promise<{ successCount: number; failCount: number }> {                                           
      const { networkId, category, products } = feedResult;                                             
      let successCount = 0;                                                                             
      let failCount = 0;                                                                                
                                                                                                        
      // 1. Record start in feed_runs table                                                             
      const { data: runRecord, error: runError } = await supabase                                       
        .from('feed_runs')                                                                              
        .insert({                                                                                       
          network_id: networkId,                                                                        
          category: category,                                                                           
          status: 'running',                                                                            
          started_at: new Date().toISOString(),                                                         
        })                                                                                              
        .select('id')                                                                                   
        .single();                                                                                      
                                                                                                        
      const runId = runRecord?.id;                                                                      
                                                                                                        
      for (const item of products) {                                                                    
        try {                                                                                           
          // 2. Open Graph Fallback [FR-17]: Fill missing image/description/title                       
          if (!item.imageUrl || !item.description) {                                                    
            const ogData = await fetchOgFallback(item.affiliateUrl);                                    
            if (!item.imageUrl && ogData.imageUrl) item.imageUrl = ogData.imageUrl;                     
            if (!item.description && ogData.description) item.description = ogData.description;         
            if (!item.title && ogData.title) item.title = ogData.title;                                 
          }                                                                                             
                                                                                                        
          // 3. Upsert into products table [FR-19, FR-20]                                               
          // Matches on external_product_id + network_id                                                
          const now = new Date().toISOString();                                                         
          const { data: productData, error: productError } = await supabase                             
            .from('products')                                                                           
            .upsert(                                                                                    
              {                                                                                         
                external_product_id: item.externalProductId,                                            
                network_id: item.networkId,                                                             
                title: item.title,                                                                      
                description: item.description,                                                          
                image_url: item.imageUrl,                                                               
                price: item.price,                                                                      
                original_price: item.originalPrice,                                                     
                currency: item.currency,                                                                
                category: item.category,                                                                
                last_price_checked_at: now,                                                             
                is_stale: false, // Mark fresh on every successful update                               
                updated_at: now,                                                                        
              },                                                                                        
              { onConflict: 'network_id,external_product_id' }                                          
            )                                                                                           
            .select('id')                                                                               
            .single();                                                                                  
                                                                                                        
          if (productError || !productData) {                                                           
            throw new Error(`Product upsert error: ${productError?.message}`);                          
          }                                                                                             
                                                                                                        
          const productId = productData.id;                                                             
                                                                                                        
          // 4. Upsert into link_reg registry [FR-08, FR-16]
          const { error: linkError } = await supabase
            .from('link_reg')
            .upsert(
              {
                products_id: productId,
                link_url: item.affiliateUrl,
                network_id: item.networkId,
              },
              { onConflict: 'products_id' }
            );                                                                                          
                                                                                                        
          if (linkError) {                                                                              
            throw new Error(`Affiliate link registry error: ${linkError.message}`);                     
          }                                                                                             
                                                                                                        
          successCount++;                                                                               
        } catch (err: any) {                                                                            
          failCount++;                                                                                  
          console.error(`[Sync Error] Failed to sync product ${item.externalProductId}:`, err.message); 
        }                                                                                               
      }                                                                                                 
                                                                                                        
      // 5. Update feed_runs table with completion status                                               
      if (runId) {                                                                                      
        await supabase                                                                                  
          .from('feed_runs')                                                                            
          .update({                                                                                     
            completed_at: new Date().toISOString(),                                                     
            status: failCount === products.length && products.length > 0 ? 'failed' : 'success',        
            records_processed: successCount,                                                            
            records_failed: failCount,                                                                  
          })                                                                                            
          .eq('id', runId);                                                                             
      }                                                                                                 
                                                                                                        
      return { successCount, failCount };                                                               
    }   