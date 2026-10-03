create or replace function detect_click_spikes(
  p_window_start timestamptz,
  p_threshold int
)
returns table (
  product_id uuid,
  ip_address varchar(45),
  click_count bigint
)
language plpgsql
as $$
begin
  if p_threshold is null or p_threshold <= 0 then
    raise exception 'p_threshold must be greater than zero';
  end if;

  return query
  select
    cl.products_id::uuid,
    cl.ip_address::varchar(45),
    count(*)::bigint
  from public.click_logs as cl
  where cl.status = 'honoured'
    and cl.timestamp >= p_window_start
  group by cl.products_id, cl.ip_address
  having count(*) >= p_threshold;
end;
$$;