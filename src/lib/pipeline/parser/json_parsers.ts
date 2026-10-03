import { NormalizedProduct } from '../../../types/products';                                         
                                                                                                        
    export function parseJsonFeed(                                                                      
      rawJsonData: string | object,                                                                     
      networkId: string,                                                                                
      category: string                                                                                  
    ): NormalizedProduct[] {                                                                            
      const products: NormalizedProduct[] = [];                                                         
      const data = typeof rawJsonData === 'string' ? JSON.parse(rawJsonData) : rawJsonData;             
                                                                                                        
      // Handle both array of items or object with an items/products array                              
      const items = Array.isArray(data) ? data : data.products || data.items || [];                     
                                                                                                        
      for (const item of items) {                                                                       
        try {                                                                                           
          // Basic validation: must have ID, title, price, and link                                     
          if (!item.id && !item.product_id) continue;                                                   
          if (!item.title && !item.name) continue;                                                      
                                                                                                        
          products.push({                                                                               
            externalProductId: String(item.id || item.product_id),                                      
            title: String(item.title || item.name).trim(),                                              
            description: item.description || '',                                                        
            imageUrl: item.image_url || item.image || '',                                               
            price: parseFloat(item.price || item.deal_price || 0),                                      
            originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,           
            currency: item.currency || 'INR',                                                           
            category: category,                                                                         
            affiliateUrl: item.affiliate_url || item.url || item.link || '',                            
            networkId: networkId,                                                                       
          });                                                                                           
        } catch (err) {                                                                                 
          console.warn(`[JSON Parser] Skipped malformed record:`, err);                                 
        }                                                                                               
      }                                                                                                 
                                                                                                        
      return products;                                                                                  
    }      