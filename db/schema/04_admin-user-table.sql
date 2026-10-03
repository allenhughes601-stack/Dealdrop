create table if not exists admin_user_table (
  id uuid primary key default gen_random_uuid(),

  email varchar(255) unique not null,
  hashed_password text not null,
  role varchar(50) default 'admin',
  created_at timestamptz default now(),
  last_login_attempt_at timestamptz
  
);