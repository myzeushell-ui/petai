-- PetAI initial schema
-- Run via: supabase db push

-- Users are managed by auth.users (Supabase Auth)

create table if not exists pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text not null check (species in ('dog','cat','rabbit','bird','other')),
  breed text not null,
  age numeric not null,
  weight numeric not null,
  weight_unit text default 'kg' check (weight_unit in ('kg','lbs')),
  gender text check (gender in ('male','female')),
  neutered boolean default false,
  avatar_url text,
  color text default '#22c55e',
  health_score int default 80,
  created_at timestamptz default now()
);

create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  type text not null check (type in ('medication','vaccination','checkup','grooming','custom')),
  title text not null,
  description text,
  due_date timestamptz not null,
  recurring boolean default false,
  recurring_interval text check (recurring_interval in ('daily','weekly','monthly','yearly')),
  completed boolean default false,
  priority text default 'medium' check (priority in ('low','medium','high')),
  created_at timestamptz default now()
);

create table if not exists health_events (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  type text not null check (type in ('vaccination','checkup','surgery','medication','symptom','lab','note')),
  title text not null,
  description text,
  event_date timestamptz not null,
  vet_name text,
  clinic_name text,
  severity text check (severity in ('low','medium','high')),
  resolved boolean default false,
  created_at timestamptz default now()
);

create table if not exists lab_results (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  test_name text not null,
  test_date date not null,
  lab_name text,
  status text check (status in ('normal','abnormal','borderline','critical')),
  ai_analysis text,
  panels jsonb default '[]'::jsonb,
  pdf_url text,
  created_at timestamptz default now()
);

create table if not exists ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pet_id uuid references pets(id) on delete set null,
  role text not null check (role in ('user','assistant')),
  content text not null,
  tokens_used int,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free','pro','breeder')),
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table pets enable row level security;
alter table reminders enable row level security;
alter table health_events enable row level security;
alter table lab_results enable row level security;
alter table ai_chat_messages enable row level security;
alter table subscriptions enable row level security;

create policy "Owner can manage their pets" on pets
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Owner can manage reminders for their pets" on reminders
  for all using (exists (select 1 from pets where pets.id = reminders.pet_id and pets.owner_id = auth.uid()));

create policy "Owner can manage health events for their pets" on health_events
  for all using (exists (select 1 from pets where pets.id = health_events.pet_id and pets.owner_id = auth.uid()));

create policy "Owner can manage lab results for their pets" on lab_results
  for all using (exists (select 1 from pets where pets.id = lab_results.pet_id and pets.owner_id = auth.uid()));

create policy "User can read own chat messages" on ai_chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "User can read own subscription" on subscriptions
  for select using (auth.uid() = user_id);

-- Storage bucket for pet avatars + lab PDFs
insert into storage.buckets (id, name, public) values ('pet-photos', 'pet-photos', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('lab-pdfs', 'lab-pdfs', false)
on conflict (id) do nothing;
