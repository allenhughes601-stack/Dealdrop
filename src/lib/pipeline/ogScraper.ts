 import axios from 'axios';                                                                          
    import * as cheerio from 'cheerio';                                                                 
                                                                                                        
    interface OgMetadata {                                                                              
      title?: string;                                                                                   
      description?: string;                                                                             
      imageUrl?: string;                                                                                
    }                                                                                                   
                                                                                                        
    export async function fetchOgFallback(url: string): Promise<OgMetadata> {                           
      if (!url || !url.startsWith('http')) return {};                                                   
                                                                                                        
      try {                                                                                             
        const response = await axios.get(url, {                                                         
          timeout: 8000,                                                                                
          headers: {                                                                                    
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',               
            'Accept': 'text/html,application/xhtml+xml',                                                
          },                                                                                            
          maxRedirects: 5,                                                                              
        });                                                                                             
                                                                                                        
        const html = response.data;                                                                     
        const $ = cheerio.load(html);                                                                   
                                                                                                        
        // Extract ONLY og meta tags [NFR-04: No bulk scraping of full page content]                    
        const title = $('meta[property="og:title"]').attr('content') || $('title').text() || undefined; 
        const description = $('meta[property="og:description"]').attr('content') ||                     
  $('meta[name="description"]').attr('content') || undefined;                                           
        const imageUrl = $('meta[property="og:image"]').attr('content') || undefined;                   
                                                                                                        
        return {                                                                                        
          title: title ? title.trim() : undefined,                                                      
          description: description ? description.trim() : undefined,                                    
          imageUrl: imageUrl ? imageUrl.trim() : undefined,                                             
        };                                                                                              
      } catch (error) {                                                                                 
        // Non-fatal: if OG read fails, return empty object and continue                                
        return {};                                                                                      
      }                                                                                                 
    }