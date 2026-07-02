-- ============================================================================
-- ADMINS TABLE, ROLE PERMISSIONS, AND AUDIT LOG SCHEMA
-- ============================================================================

-- Create role_permissions table
create table if not exists role_permissions (
  role text primary key check (role in ('super_admin','operations_manager','support_agent')),
  allowed_sections text[] not null,
  can_write boolean not null
);

-- Enable RLS on role_permissions table
alter table role_permissions enable row level security;

-- Seed role_permissions
insert into role_permissions (role, allowed_sections, can_write) values
  ('super_admin', array['dashboard', 'bookings', 'professionals', 'customers', 'services', 'payments', 'reviews', 'notifications', 'reports', 'settings', 'messages'], true),
  ('operations_manager', array['dashboard', 'bookings', 'professionals', 'customers', 'services', 'reviews', 'messages'], true),
  ('support_agent', array['dashboard', 'bookings', 'customers', 'reviews', 'messages'], false)
on conflict (role) do update set
  allowed_sections = excluded.allowed_sections,
  can_write = excluded.can_write;

-- Create admins table
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null unique,
  full_name text not null,
  role text not null references role_permissions(role),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on admins table
alter table admins enable row level security;

-- Create admin_audit_log table
create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references admins(id) on delete cascade,
  action text not null,
  target_table text,
  target_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Enable RLS on admin_audit_log table
alter table admin_audit_log enable row level security;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Role Permissions read access
create policy role_permissions_read_all on role_permissions
  for select using (true);

-- Only super_admin can modify role_permissions
create policy role_permissions_super_admin_modify on role_permissions
  for all using (
    exists (
      select 1 from admins a
      where a.auth_user_id = auth.uid()
        and a.is_active = true
        and a.role = 'super_admin'
    )
  );

-- Only super_admin can read/write the admins table
create policy admins_super_admin_all on admins
  for all using (
    exists (
      select 1 from admins a
      where a.auth_user_id = auth.uid()
        and a.is_active = true
        and a.role = 'super_admin'
    )
  );

-- Admins can read their own record
create policy admins_read_own on admins
  for select using (
    auth_user_id = auth.uid()
  );

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR GENERAL TABLES
-- ============================================================================

-- 1. Bookings Policies
alter table bookings enable row level security;

create policy admin_read_bookings on bookings
  for select using (
    exists (
      select 1 from admins
      where admins.auth_user_id = auth.uid()
        and admins.is_active = true
        and admins.role in (select role from role_permissions where allowed_sections @> array['bookings'])
    )
  );

create policy admin_write_bookings on bookings
  for all using (
    exists (
      select 1 from admins join role_permissions rp on admins.role = rp.role
      where admins.auth_user_id = auth.uid()
        and admins.is_active = true
        and rp.can_write = true
        and rp.allowed_sections @> array['bookings']
    )
  );

-- 2. Professionals Policies
alter table professionals enable row level security;

create policy admin_read_professionals on professionals
  for select using (
    exists (
      select 1 from admins
      where admins.auth_user_id = auth.uid()
        and admins.is_active = true
        and admins.role in (select role from role_permissions where allowed_sections @> array['professionals'])
    )
  );

create policy admin_write_professionals on professionals
  for all using (
    exists (
      select 1 from admins join role_permissions rp on admins.role = rp.role
      where admins.auth_user_id = auth.uid()
        and admins.is_active = true
        and rp.can_write = true
        and rp.allowed_sections @> array['professionals']
    )
  );

-- ============================================================================
-- CUSTOMERS AND PARTNERS CORES TABLES
-- ============================================================================

-- Create customers table
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null unique,
  name text not null,
  phone text unique,
  device_info text,
  ip_address text,
  location text,
  lat_lng text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on customers table
alter table customers enable row level security;

-- Customers RLS Policies
create policy customers_read_own on customers
  for select using (auth_user_id = auth.uid());

create policy customers_update_own on customers
  for update using (auth_user_id = auth.uid());

create policy admin_all_customers on customers
  for all using (
    exists (
      select 1 from admins
      where admins.auth_user_id = auth.uid()
        and admins.is_active = true
        and admins.role in (select role from role_permissions where allowed_sections @> array['customers'])
    )
  );

-- Create partners table
create table if not exists partners (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  email text not null unique,
  full_name text not null,
  phone text unique,
  category text not null,
  operating_city text,
  rating numeric not null default 4.8,
  status text not null default 'Pending' check (status in ('Active', 'Pending', 'Suspended')),
  verified boolean not null default false,
  experience text,
  experience_years integer default 0,
  response_time_minutes integer default 0,
  skills text[] default array[]::text[],
  availability text not null default 'Offline' check (availability in ('Online', 'Offline', 'Busy')),
  kyc_doc_type text,
  kyc_aged_days integer default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on partners table
alter table partners enable row level security;

-- Partners RLS Policies
create policy partners_read_own on partners
  for select using (auth_user_id = auth.uid());

create policy partners_update_own on partners
  for update using (auth_user_id = auth.uid());

create policy public_read_active_partners on partners
  for select using (status = 'Active' and is_active = true);

create policy admin_all_partners on partners
  for all using (
    exists (
      select 1 from admins
      where admins.auth_user_id = auth.uid()
        and admins.is_active = true
        and admins.role in (select role from role_permissions where allowed_sections @> array['professionals'])
    )
  );
