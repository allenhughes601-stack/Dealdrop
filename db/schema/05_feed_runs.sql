create table if not exists public.feed_runs (
  id uuid primary key default gen_random_uuid(),
  network_id varchar(100) not null,
  category varchar(100),
  started_at timestamptz default now(),
  completed_at timestamptz,
  status varchar(50) not null default 'running',
  records_processed integer default 0,
  records_failed integer default 0,
  error_message text
);
