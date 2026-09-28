-- ==========================================================
-- SKETCH EVENT MANAGEMENT PLATFORM - SUPABASE SCHEMA V1
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (SRM & External Participants)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text unique not null,
  phone text not null,
  participant_type text not null check (participant_type in ('srm', 'external')),
  institution text not null,
  srm_reg_number text unique, -- Nullable for external, unique across platform
  department text,
  year text,
  section text,
  account_status text not null default 'active' check (account_status in ('active', 'suspended', 'blocked')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. User Roles Table (RBAC: Master Admin, Event Manager, Attendance Staff, Participant)
create table if not exists public.user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null check (role in ('master_admin', 'event_manager', 'attendance_staff', 'participant')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, role)
);

-- 3. Events Table
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique,
  description text not null,
  poster_url text,
  category text not null check (category in ('Workshop', 'Hackathon', 'Competition', 'Debate', 'Tech Talk', 'Symposium', 'Other')),
  organizer text not null default 'SKETCH',
  contact_email text,
  contact_phone text,
  event_type text not null check (event_type in ('physical', 'online', 'hybrid')),
  venue text,
  building text,
  room text,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  reg_open_date timestamp with time zone not null,
  reg_close_date timestamp with time zone not null,
  eligibility text not null check (eligibility in ('srm_only', 'srm_external', 'open')),
  registration_type text not null check (registration_type in ('individual', 'team')),
  capacity integer not null default 100,
  min_team_size integer default 1,
  max_team_size integer default 4,
  team_institution_rule text default 'mixed' check (team_institution_rule in ('mixed', 'same_institution')),
  lifecycle_status text not null default 'published' check (lifecycle_status in ('draft', 'published', 'registration_open', 'registration_closed', 'event_live', 'completed', 'archived')),
  certificate_enabled boolean not null default true,
  important_instructions text,
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Dynamic Event Registration Questions
create table if not exists public.event_questions (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  question_text text not null,
  question_type text not null check (question_type in ('short_text', 'long_text', 'dropdown', 'multiple_choice', 'checkbox', 'file_upload')),
  options jsonb, -- Array of string choices for dropdown/radio
  is_required boolean not null default false,
  sort_order integer not null default 0
);

-- 5. Teams Table
create table if not exists public.teams (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  team_name text not null,
  team_code text unique not null,
  leader_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Team Members Table
create table if not exists public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'member' check (role in ('leader', 'member')),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (team_id, user_id)
);

-- 7. Registrations Table
create table if not exists public.registrations (
  id uuid primary key default uuid_generate_v4(),
  registration_code text unique not null,
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  registration_type text not null check (registration_type in ('individual', 'team')),
  team_id uuid references public.teams(id) on delete set null,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  responses jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, user_id)
);

-- 8. Event Passes Table (Secure Server-verifiable QR tokens)
create table if not exists public.event_passes (
  id uuid primary key default uuid_generate_v4(),
  registration_id uuid references public.registrations(id) on delete cascade not null unique,
  qr_token text unique not null,
  status text not null default 'active' check (status in ('active', 'used', 'invalidated')),
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Attendance Table (Prevents Duplicate Check-In via unique registration constraint)
create table if not exists public.attendance (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  registration_id uuid references public.registrations(id) on delete cascade not null unique,
  user_id uuid references public.profiles(id) on delete cascade not null,
  scanned_by uuid references public.profiles(id) not null,
  checked_in_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text not null default 'checked_in' check (status in ('checked_in', 'manual_override')),
  notes text
);

-- 10. Certificates Table
create table if not exists public.certificates (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  registration_id uuid references public.registrations(id) on delete cascade not null,
  certificate_number text unique not null,
  issued_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, user_id)
);

-- 11. Event Manager Assignments
create table if not exists public.event_managers (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assigned_by uuid references public.profiles(id) not null,
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, user_id)
);

-- 12. Attendance Staff Assignments
create table if not exists public.attendance_staff_assignments (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  assigned_by uuid references public.profiles(id) not null,
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (event_id, user_id)
);

-- 13. Audit Logs
create table if not exists public.audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references public.profiles(id),
  actor_name text not null,
  action text not null,
  target_type text not null,
  target_id text not null,
  details jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.registrations enable row level security;
alter table public.event_passes enable row level security;
alter table public.attendance enable row level security;
alter table public.certificates enable row level security;
alter table public.audit_logs enable row level security;
