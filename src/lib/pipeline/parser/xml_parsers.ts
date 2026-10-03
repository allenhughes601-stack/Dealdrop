 import { XMLParser } from 'fast-xml-parser';                                                        
    import { NormalizedProduct } from '../../../types/products';                                         
                                                                                                        
    export function parseXmlFeed(                                                                       
      xmlContent: string,                                                                               
      networkId: string,                                                                                
      category: string                                                                                  
    ): NormalizedProduct[] {                                                                            
      const products: NormalizedProduct[] = [];                                                         
      const parser = new XMLParser({ ignoreAttributes: false });                                        
      const jsonObj = parser.parse(xmlContent);                                                         
                                                                                                        
      // Extract items array from typical XML feed structures (<catalog><product>...                    
                                                                            
      const catalog = jsonObj.catalog || jsonObj.feed || jsonObj.rss?.channel || jsonObj;               
      const items = catalog.product || catalog.item || [];                                              
                                                                                                        
      const itemArray = Array.isArray(items) ? items : [items];                                         
                                                                                                        
      for (const item of itemArray) {                                                                   
        try {                                                                                           
          const id = item.id || item.product_id;                                                        
          const title = item.title || item.name;                                                        
          const price = parseFloat(item.price || item.deal_price);                                      
                                                                                                        
          if (!id || !title || isNaN(price)) continue;                                                  
                                                                                                        
          products.push({                                                                               
            externalProductId: String(id),                                                              
            title: String(title),                                                                       
            description: item.description || '',                                                        
            imageUrl: item.image_url || item.image || '',                                               
            price: price,                                                                               
            originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,           
            currency: item.currency || 'INR',                                                           
            category: category,                                                                         
            affiliateUrl: item.affiliate_url || item.link || item.url || '',                            
            networkId: networkId,                                                                       
          });                                                                                           
        } catch (err) {                                                                                 
          console.warn(`[XML Parser] Skipped malformed record:`, err);                                  
        }                                                                                               
      }                                                                                                 
      return products;    
    }                                                                                                  
        