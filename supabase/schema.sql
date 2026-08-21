-- ============================================================
-- Kindermeilensteine – Supabase Schema + RLS Policies
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (already enabled by default)
-- create extension if not exists "uuid-ossp";

-- ─── profiles ────────────────────────────────────────────────
-- Extends Supabase Auth users with a display name
create table if not exists public.profiles (
  id            uuid references auth.users on delete cascade primary key,
  display_name  text,
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── children ────────────────────────────────────────────────
create table if not exists public.children (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  geburtsdatum  date,
  foto_url      text,
  owner_id      uuid references auth.users on delete cascade not null,
  created_at    timestamptz default now()
);

alter table public.children enable row level security;

-- Users can only see children they own or are members of
create policy "Members can view child"
  on public.children for select
  using (
    auth.uid() = owner_id
    or exists (
      select 1 from public.child_members
      where child_id = children.id and user_id = auth.uid()
    )
  );

create policy "Owner can insert child"
  on public.children for insert
  with check (auth.uid() = owner_id);

create policy "Owner can update child"
  on public.children for update
  using (auth.uid() = owner_id);

create policy "Owner can delete child"
  on public.children for delete
  using (auth.uid() = owner_id);

-- ─── child_members ───────────────────────────────────────────
create table if not exists public.child_members (
  id        uuid primary key default gen_random_uuid(),
  child_id  uuid references public.children on delete cascade not null,
  user_id   uuid references auth.users on delete cascade not null,
  rolle     text not null check (rolle in ('owner', 'member')),
  joined_at timestamptz default now(),
  unique (child_id, user_id)
);

alter table public.child_members enable row level security;

create policy "Members can view memberships for their children"
  on public.child_members for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.child_members cm2
      where cm2.child_id = child_members.child_id and cm2.user_id = auth.uid()
    )
  );

create policy "Anyone can insert membership (join via code)"
  on public.child_members for insert
  with check (user_id = auth.uid());

create policy "Owner can delete membership"
  on public.child_members for delete
  using (
    exists (
      select 1 from public.children
      where id = child_members.child_id and owner_id = auth.uid()
    )
  );

-- ─── entries ─────────────────────────────────────────────────
create table if not exists public.entries (
  id           uuid primary key default gen_random_uuid(),
  child_id     uuid references public.children on delete cascade not null,
  titel        text not null,
  kategorie    text not null check (kategorie in ('motorisch', 'sprachlich', 'sozial', 'sonstiges')),
  datum        date not null,
  notiz        text,
  foto_url     text,
  erstellt_von uuid references auth.users on delete set null,
  created_at   timestamptz default now()
);

alter table public.entries enable row level security;

-- Members can see entries for their children
create policy "Members can view entries"
  on public.entries for select
  using (
    exists (
      select 1 from public.child_members
      where child_id = entries.child_id and user_id = auth.uid()
    )
  );

create policy "Members can insert entries"
  on public.entries for insert
  with check (
    auth.uid() = erstellt_von
    and exists (
      select 1 from public.child_members
      where child_id = entries.child_id and user_id = auth.uid()
    )
  );

-- Creator or owner can update
create policy "Creator or owner can update entry"
  on public.entries for update
  using (
    auth.uid() = erstellt_von
    or exists (
      select 1 from public.children
      where id = entries.child_id and owner_id = auth.uid()
    )
  );

-- Creator or owner can delete
create policy "Creator or owner can delete entry"
  on public.entries for delete
  using (
    auth.uid() = erstellt_von
    or exists (
      select 1 from public.children
      where id = entries.child_id and owner_id = auth.uid()
    )
  );

-- ─── invites ─────────────────────────────────────────────────
create table if not exists public.invites (
  id            uuid primary key default gen_random_uuid(),
  child_id      uuid references public.children on delete cascade not null,
  code          text not null unique,
  erstellt_von  uuid references auth.users on delete cascade,
  gueltig_bis   timestamptz not null,
  created_at    timestamptz default now()
);

alter table public.invites enable row level security;

-- Owner can create invite
create policy "Owner can insert invite"
  on public.invites for insert
  with check (
    auth.uid() = erstellt_von
    and exists (
      select 1 from public.children
      where id = invites.child_id and owner_id = auth.uid()
    )
  );

-- Anyone logged in can read invites (to join via code)
create policy "Logged-in users can read valid invites"
  on public.invites for select
  using (auth.uid() is not null);

-- Owner can delete invite
create policy "Owner can delete invite"
  on public.invites for delete
  using (auth.uid() = erstellt_von);

-- ─── Indexes ──────────────────────────────────────────────────
create index if not exists idx_entries_child_id on public.entries(child_id);
create index if not exists idx_entries_datum on public.entries(datum desc);
create index if not exists idx_child_members_user_id on public.child_members(user_id);
create index if not exists idx_child_members_child_id on public.child_members(child_id);
create index if not exists idx_invites_code on public.invites(code);
