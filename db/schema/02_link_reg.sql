
create table if not exists public.link_reg (
    id uuid primary key default gen_random_uuid(),

    products_id uuid not null
        references public.products (id)
        on delete cascade,

    link_url text not null,
    network_id varchar(100),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint link_reg_products_id_unique
        unique (products_id)
);
