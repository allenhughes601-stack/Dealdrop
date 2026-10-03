-- Enable pgcrypto extension for UUID generation (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Alternatively, use BIGSERIAL PRIMARY KEY for auto-increment integer
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    price NUMERIC(10, 2),
    original_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    category VARCHAR(255) NOT NULL,
    last_price_checked_at TIMESTAMPTZ,
    is_stale BOOLEAN DEFAULT FALSE,
    network_id VARCHAR(255),
    external_product_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Function and trigger to auto-update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
