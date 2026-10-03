create table if not exists public.click_logs (    
    
    id uuid primary key default gen_random_uuid(),

    products_id uuid not null
        references public.products (id)
        on delete cascade,

    timestamp timestamptz not null default now(),

    ip_address varchar(45) not null,
    user_agent text ,
    referer text,
    status varchar(50) not null default 'honoured',
    rejection_reason text
    
);

create index if not exists idx_click_logs_products_timestamp on click_logs(products_id,timestamp);
create index if not exists idx_click_logs_ip_address_timestamp on click_logs(ip_address,timestamp)