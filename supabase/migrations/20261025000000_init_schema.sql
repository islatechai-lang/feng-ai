-- ==============================================================================
-- FengShui Room Analyzer - Full Database Schema & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users or guest sessions)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  auth_user_id uuid references auth.users(id) on delete set null,
  display_name text,
  birth_year int,
  country text default 'US',
  is_anonymous boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_profiles_auth_user_id on public.profiles(auth_user_id);

-- 2. Analyses Table
create table if not exists public.analyses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'analyzing', 'completed', 'failed')),
  room_type text not null check (room_type in ('bedroom', 'living_room', 'office', 'kitchen', 'shop')),
  door_direction text not null default 'UNKNOWN',
  goal text not null default 'sleep',
  birth_year int,
  input_image_path text,
  parsed_json jsonb,
  result_json jsonb,
  score int check (score >= 0 and score <= 100),
  is_unlocked boolean not null default false,
  share_token text unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_analyses_user_id on public.analyses(user_id);
create index if not exists idx_analyses_share_token on public.analyses(share_token);

-- 3. Analysis Images Table
create table if not exists public.analysis_images (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  kind text not null check (kind in ('original', 'edited', 'annotated', 'diagram', 'share_card')),
  path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_analysis_images_analysis_id on public.analysis_images(analysis_id);

-- 4. Entitlements Table (Subscriptions and Credits)
create table if not exists public.entitlements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null check (plan in ('free', 'single_room', 'weekly_pass', 'pro_yearly')),
  credits_remaining int default 0,
  expires_at timestamp with time zone,
  provider text check (provider in ('stripe', 'lemonsqueezy', 'paddle', 'revenuecat', 'demo')),
  provider_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_entitlements_user_id on public.entitlements(user_id);

-- 5. Payments Table
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  analysis_id uuid references public.analyses(id) on delete set null,
  provider text not null default 'stripe',
  amount int not null, -- stored in smallest currency unit (e.g. cents)
  currency text not null default 'usd',
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'refunded')),
  provider_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_payments_user_id on public.payments(user_id);

-- 6. Usage Logs Table (LLM Token and Cost Monitoring)
create table if not exists public.usage_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete set null,
  analysis_id uuid references public.analyses(id) on delete set null,
  step text not null check (step in ('vision', 'reasoning', 'image_edit')),
  model text not null,
  tokens_in int default 0,
  tokens_out int default 0,
  cost_estimate numeric(10, 6) default 0.000000,
  duration_ms int default 0,
  status text default 'success',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_usage_logs_created_at on public.usage_logs(created_at desc);

-- 7. Feedback Table
create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_feedback_analysis_id on public.feedback(analysis_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.analysis_images enable row level security;
alter table public.entitlements enable row level security;
alter table public.payments enable row level security;
alter table public.usage_logs enable row level security;
alter table public.feedback enable row level security;

-- Profiles: Users can view and update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = auth_user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = auth_user_id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = auth_user_id or auth_user_id is null);

-- Analyses: Users view own analyses, or public can view via share_token
create policy "Users can view own analyses"
  on public.analyses for select
  using (
    user_id in (select id from public.profiles where auth_user_id = auth.uid())
    or share_token is not null
  );

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (
    user_id in (select id from public.profiles where auth_user_id = auth.uid())
    or user_id is null
  );

create policy "Users can update own analyses"
  on public.analyses for update
  using (
    user_id in (select id from public.profiles where auth_user_id = auth.uid())
  );

-- Analysis Images: Inherit access from parent analysis
create policy "Users can view images for viewable analyses"
  on public.analysis_images for select
  using (
    analysis_id in (select id from public.analyses)
  );

-- Entitlements: Users can view their own entitlements
create policy "Users can view own entitlements"
  on public.entitlements for select
  using (
    user_id in (select id from public.profiles where auth_user_id = auth.uid())
  );

-- Feedback: Users can submit feedback
create policy "Users can insert feedback"
  on public.feedback for insert
  with check (true);

-- Usage Logs: Only readable by service_role (Admin)
create policy "Service role has full access to usage logs"
  on public.usage_logs for all
  using (auth.role() = 'service_role');

-- ==============================================================================
-- Storage Bucket Setup (run in Supabase SQL editor)
-- ==============================================================================
-- insert into storage.buckets (id, name, public) values ('room-photos', 'room-photos', false);
-- insert into storage.buckets (id, name, public) values ('room-results', 'room-results', false);
