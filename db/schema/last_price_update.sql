                                                                                                     
  ALTER TABLE products ADD COLUMN IF NOT EXISTS last_price_checked_at TIMESTAMPTZ;                    
    ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC;                               
    ALTER TABLE products ADD COLUMN IF NOT EXISTS network_id TEXT;                                      
    ALTER TABLE products ADD COLUMN IF NOT EXISTS external_product_id TEXT;  