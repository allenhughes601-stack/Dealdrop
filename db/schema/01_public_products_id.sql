create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  description text,
  image_url text,
  price decimal(10,2),
  original_price numeric(10,2),
  currency varchar default 'INR',
  category varchar not null,
  last_price_checked_at timestamptz,
  is_stale boolean not null default false,
  network_id varchar(100),
  external_product_id varchar(255),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
); 
create index if not exists index_products_category on products(category);
create index if not exists index_products_is_stale on products(is_stale);
create index if not exists index_products_last_price_checked_at on products(last_price_checked_at);