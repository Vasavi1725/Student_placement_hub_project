-- ============================================================
-- Placement Aptitude Master — Database Schema
-- Run this in the Supabase SQL editor (Project > SQL Editor)
-- ============================================================

-- PROFILES (extends auth.users) ------------------------------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SUBJECTS ----------------------------------------------------
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  icon text,
  color text,
  sort_order int default 0
);
alter table subjects enable row level security;
create policy "Subjects are publicly readable" on subjects for select using (true);

-- TOPICS --------------------------------------------------------
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade,
  slug text unique not null,
  name text not null,
  group_name text,
  overview text,
  formulas jsonb default '[]',
  tricks jsonb default '[]',
  common_mistakes jsonb default '[]',
  solved_examples jsonb default '[]',
  video_resources jsonb default '[]',
  reference_links jsonb default '[]',
  prerequisite_topic_id uuid references topics(id),
  sort_order int default 0
);
alter table topics enable row level security;
create policy "Topics are publicly readable" on topics for select using (true);
create index if not exists idx_topics_subject on topics(subject_id);

-- QUESTIONS -------------------------------------------------------
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade,
  question_text text not null,
  difficulty text check (difficulty in ('easy','medium','hard')) not null,
  company text,
  external_url text,
  sort_order int default 0
);
alter table questions enable row level security;
create policy "Questions are publicly readable" on questions for select using (true);
create index if not exists idx_questions_topic on questions(topic_id);

-- COMPANIES -----------------------------------------------------
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  sections jsonb default '[]',
  focus_topics jsonb default '[]',
  strategy text,
  resources jsonb default '[]'
);
alter table companies enable row level security;
create policy "Companies are publicly readable" on companies for select using (true);

-- PROGRESS (per user, per topic) -----------------------------------
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references topics(id) on delete cascade not null,
  status text check (status in ('not_started','in_progress','completed','revision_needed','mastered')) default 'not_started',
  completed_at timestamptz,
  revision_count int default 0,
  time_spent_minutes int default 0,
  quiz_score int,
  confidence_level int check (confidence_level between 1 and 5),
  updated_at timestamptz default now(),
  unique(user_id, topic_id)
);
alter table progress enable row level security;
create policy "Users manage own progress" on progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- BOOKMARKS ------------------------------------------------------
create table if not exists bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  item_type text check (item_type in ('topic','question','video','article')) not null,
  item_id text not null,
  created_at timestamptz default now(),
  unique(user_id, item_type, item_id)
);
alter table bookmarks enable row level security;
create policy "Users manage own bookmarks" on bookmarks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- NOTES (markdown, per user per topic) ----------------------------
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references topics(id) on delete cascade not null,
  content text default '',
  updated_at timestamptz default now(),
  unique(user_id, topic_id)
);
alter table notes enable row level security;
create policy "Users manage own notes" on notes for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- QUIZ SCORES -------------------------------------------------------
create table if not exists quiz_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references topics(id) on delete cascade not null,
  score int not null,
  total int not null,
  taken_at timestamptz default now()
);
alter table quiz_scores enable row level security;
create policy "Users manage own quiz scores" on quiz_scores for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- REVISION SCHEDULE (spaced repetition: 1,3,7,15,30 days) -----------
create table if not exists revision_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references topics(id) on delete cascade not null,
  interval_stage int default 0,
  due_date date not null,
  done boolean default false,
  unique(user_id, topic_id)
);
alter table revision_schedule enable row level security;
create policy "Users manage own revision schedule" on revision_schedule for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- STUDY SESSIONS (for analytics / streak / time stats) ---------------
create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  topic_id uuid references topics(id),
  started_at timestamptz default now(),
  duration_minutes int default 0
);
alter table study_sessions enable row level security;
create policy "Users manage own study sessions" on study_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Helper view: overall progress summary per user ----------------------
create or replace view user_progress_summary as
select
  user_id,
  count(*) filter (where status = 'completed' or status = 'mastered') as completed_count,
  count(*) as total_tracked
from progress
group by user_id;
