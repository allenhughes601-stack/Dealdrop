  import { supabase } from '../supabaseClient';                                                       
                                                                                                        
    const DEFAULT_STALE_THRESHOLD_SECONDS = parseInt(                                                   
      process.env.STALE_PRICE_THRESHOLD_SECONDS || '86400', // Default: 24 hours                        
      10                                                                                                
    );                                                                                                  
                                                                                                        
    export async function markStaleProducts(thresholdSeconds: number = DEFAULT_STALE_THRESHOLD_SECONDS) 
  {                                                                                                     
      const cutoffTime = new Date(Date.now() - thresholdSeconds * 1000).toISOString();                  
                                                                                                        
      // Flag any product whose last_price_checked_at is older than cutoffTime                          
      const { data, error } = await supabase                                                            
        .from('products')                                                                               
        .update({ is_stale: true })                                                                     
        .lt('last_price_checked_at', cutoffTime)                                                        
        .eq('is_stale', false)                                                                          
        .select('id');                                                                                  
                                                                                                        
      if (error) {                                                                                      
        console.error('[Staleness Check] Error updating stale products:', error.message);               
        return 0;                                                                                       
      }                                                                                                 
                                                                                                        
      const count = data?.length || 0;                                                                  
      if (count > 0) {                                                                                  
        console.log(`[Staleness Check] Flagged ${count} products as stale (older than                   
  ${thresholdSeconds}s).`);                                                                             
      }                                                                                                 
      return count;                                                                                     
    }