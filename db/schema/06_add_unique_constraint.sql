-- This constraint is required for the pipeline upsert to work correctly.
-- It ensures we don't insert duplicate products from the same network.
ALTER TABLE public.products ADD CONSTRAINT products_network_external_id_key UNIQUE (network_id, external_product_id);
ALTER TABLE public.link_reg ALTER COLUMN link_url TYPE text;