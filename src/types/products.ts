 export interface NormalizedProduct {                                                                
      externalProductId: string;   // Merchant's product ID from feed                                   
      title: string;               // Product title                                                     
      description?: string;        // Product description                                               
      imageUrl?: string;           // Product image URL                                                 
      price: number;               // Current deal price                                                
      originalPrice?: number;      // Strikethrough/original price                                      
      currency: string;            // e.g. "INR", "USD"                                                 
      category: string;            // Product category                                                  
      affiliateUrl: string;        // Raw or generated affiliate deep-link                              
      networkId: string;           // e.g. "amazon", "admitad", "cue-links"                             
    }                                                                                                   
                                                                                                        
    export interface FeedRunResult {                                                                    
      networkId: string;                                                                                
      category: string;                                                                                 
      totalRecords: number;                                                                             
      successfulRecords: number;                                                                        
      failedRecords: number;                                                                            
      products: NormalizedProduct[];                                                                    
      errors: string[];                                                                                 
    }  