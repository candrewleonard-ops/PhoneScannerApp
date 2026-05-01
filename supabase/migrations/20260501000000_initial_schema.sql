-- =========================================================================
-- Reinnovation Scan: Initial schema
-- Tables, indexes, triggers, RLS policies for the entire application.
-- =========================================================================

create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------------------
-- updated_at trigger helper
-- -------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- -------------------------------------------------------------------------
-- profiles
-- -------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Auto-create a profile when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -------------------------------------------------------------------------
-- properties
-- -------------------------------------------------------------------------
create table public.properties (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text,
  city text,
  state text,
  zip text,
  status text default 'active',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_properties_user_id on public.properties(user_id);

create trigger set_updated_at_properties
  before update on public.properties
  for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------------
-- rooms
-- -------------------------------------------------------------------------
create table public.rooms (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references public.properties(id) on delete cascade,
  name text not null,
  floor_level text,
  room_type text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_rooms_property_id on public.rooms(property_id);

create trigger set_updated_at_rooms
  before update on public.rooms
  for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------------
-- room_scans
-- -------------------------------------------------------------------------
create table public.room_scans (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  scan_status text default 'pending',
  raw_roomplan_json jsonb,
  model_file_url text,
  floor_area numeric,
  ceiling_height numeric,
  confidence_score numeric,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_room_scans_room_id on public.room_scans(room_id);

create trigger set_updated_at_room_scans
  before update on public.room_scans
  for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------------
-- walls
-- -------------------------------------------------------------------------
create table public.walls (
  id uuid primary key default uuid_generate_v4(),
  room_scan_id uuid not null references public.room_scans(id) on delete cascade,
  external_identifier text,
  length numeric,
  height numeric,
  area numeric,
  transform jsonb,
  confidence numeric,
  notes text,
  created_at timestamptz default now() not null
);

create index idx_walls_room_scan_id on public.walls(room_scan_id);

-- -------------------------------------------------------------------------
-- openings (doors, windows, openings)
-- -------------------------------------------------------------------------
create table public.openings (
  id uuid primary key default uuid_generate_v4(),
  room_scan_id uuid not null references public.room_scans(id) on delete cascade,
  wall_id uuid references public.walls(id) on delete set null,
  type text not null,
  width numeric,
  height numeric,
  sill_height numeric,
  transform jsonb,
  confidence numeric,
  created_at timestamptz default now() not null
);

create index idx_openings_room_scan_id on public.openings(room_scan_id);
create index idx_openings_wall_id on public.openings(wall_id);

-- -------------------------------------------------------------------------
-- detected_objects (RoomPlan furniture/fixtures)
-- -------------------------------------------------------------------------
create table public.detected_objects (
  id uuid primary key default uuid_generate_v4(),
  room_scan_id uuid not null references public.room_scans(id) on delete cascade,
  type text not null,
  dimensions jsonb,
  transform jsonb,
  confidence numeric,
  created_at timestamptz default now() not null
);

create index idx_detected_objects_room_scan_id on public.detected_objects(room_scan_id);

-- -------------------------------------------------------------------------
-- scan_photos
-- -------------------------------------------------------------------------
create table public.scan_photos (
  id uuid primary key default uuid_generate_v4(),
  room_scan_id uuid not null references public.room_scans(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  wall_id uuid references public.walls(id) on delete set null,
  opening_id uuid references public.openings(id) on delete set null,
  photo_type text not null,
  image_url text not null,
  local_pose jsonb,
  camera_transform jsonb,
  notes text,
  created_at timestamptz default now() not null
);

create index idx_scan_photos_room_scan_id on public.scan_photos(room_scan_id);
create index idx_scan_photos_room_id on public.scan_photos(room_id);
create index idx_scan_photos_wall_id on public.scan_photos(wall_id);

-- -------------------------------------------------------------------------
-- inspection_checklist_items
-- -------------------------------------------------------------------------
create table public.inspection_checklist_items (
  id uuid primary key default uuid_generate_v4(),
  room_scan_id uuid not null references public.room_scans(id) on delete cascade,
  label text not null,
  item_type text not null,
  target_wall_id uuid references public.walls(id) on delete set null,
  target_opening_id uuid references public.openings(id) on delete set null,
  required boolean default true,
  completed boolean default false,
  completed_photo_id uuid references public.scan_photos(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_checklist_room_scan_id on public.inspection_checklist_items(room_scan_id);

create trigger set_updated_at_checklist
  before update on public.inspection_checklist_items
  for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------------
-- repair_notes
-- -------------------------------------------------------------------------
create table public.repair_notes (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete cascade,
  room_scan_id uuid references public.room_scans(id) on delete set null,
  wall_id uuid references public.walls(id) on delete set null,
  opening_id uuid references public.openings(id) on delete set null,
  title text not null,
  body text,
  severity text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_repair_notes_property_id on public.repair_notes(property_id);
create index idx_repair_notes_room_id on public.repair_notes(room_id);

create trigger set_updated_at_repair_notes
  before update on public.repair_notes
  for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------------
-- repair_items
-- -------------------------------------------------------------------------
create table public.repair_items (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references public.properties(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete cascade,
  room_scan_id uuid references public.room_scans(id) on delete set null,
  wall_id uuid references public.walls(id) on delete set null,
  opening_id uuid references public.openings(id) on delete set null,
  category text,
  description text not null,
  quantity numeric,
  unit text,
  unit_cost numeric,
  total_cost numeric,
  status text default 'pending',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_repair_items_property_id on public.repair_items(property_id);

create trigger set_updated_at_repair_items
  before update on public.repair_items
  for each row execute procedure public.set_updated_at();

-- -------------------------------------------------------------------------
-- generated_scopes
-- -------------------------------------------------------------------------
create table public.generated_scopes (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid not null references public.properties(id) on delete cascade,
  title text not null,
  body text not null,
  total_estimated_cost numeric,
  created_at timestamptz default now() not null
);

create index idx_generated_scopes_property_id on public.generated_scopes(property_id);

-- =========================================================================
-- RLS HELPERS
-- =========================================================================

create or replace function public.user_owns_property(prop_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists(
    select 1 from public.properties
    where id = prop_id and user_id = auth.uid()
  );
$$;

create or replace function public.user_owns_room(rm_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists(
    select 1
    from public.rooms r
    join public.properties p on p.id = r.property_id
    where r.id = rm_id and p.user_id = auth.uid()
  );
$$;

create or replace function public.user_owns_room_scan(scan_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists(
    select 1
    from public.room_scans rs
    join public.rooms r on r.id = rs.room_id
    join public.properties p on p.id = r.property_id
    where rs.id = scan_id and p.user_id = auth.uid()
  );
$$;

-- =========================================================================
-- ENABLE RLS
-- =========================================================================

alter table public.profiles                    enable row level security;
alter table public.properties                  enable row level security;
alter table public.rooms                       enable row level security;
alter table public.room_scans                  enable row level security;
alter table public.walls                       enable row level security;
alter table public.openings                    enable row level security;
alter table public.detected_objects            enable row level security;
alter table public.scan_photos                 enable row level security;
alter table public.inspection_checklist_items  enable row level security;
alter table public.repair_notes                enable row level security;
alter table public.repair_items                enable row level security;
alter table public.generated_scopes            enable row level security;

-- =========================================================================
-- RLS POLICIES
-- =========================================================================

-- profiles: own row only
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- properties: own
create policy "properties_select_own" on public.properties
  for select using (auth.uid() = user_id);
create policy "properties_insert_own" on public.properties
  for insert with check (auth.uid() = user_id);
create policy "properties_update_own" on public.properties
  for update using (auth.uid() = user_id);
create policy "properties_delete_own" on public.properties
  for delete using (auth.uid() = user_id);

-- rooms: through property
create policy "rooms_select_own" on public.rooms
  for select using (public.user_owns_property(property_id));
create policy "rooms_insert_own" on public.rooms
  for insert with check (public.user_owns_property(property_id));
create policy "rooms_update_own" on public.rooms
  for update using (public.user_owns_property(property_id));
create policy "rooms_delete_own" on public.rooms
  for delete using (public.user_owns_property(property_id));

-- room_scans: through room
create policy "room_scans_select_own" on public.room_scans
  for select using (public.user_owns_room(room_id));
create policy "room_scans_insert_own" on public.room_scans
  for insert with check (public.user_owns_room(room_id));
create policy "room_scans_update_own" on public.room_scans
  for update using (public.user_owns_room(room_id));
create policy "room_scans_delete_own" on public.room_scans
  for delete using (public.user_owns_room(room_id));

-- walls / openings / detected_objects / scan_photos / checklist: through room_scan
create policy "walls_select_own" on public.walls
  for select using (public.user_owns_room_scan(room_scan_id));
create policy "walls_insert_own" on public.walls
  for insert with check (public.user_owns_room_scan(room_scan_id));
create policy "walls_update_own" on public.walls
  for update using (public.user_owns_room_scan(room_scan_id));
create policy "walls_delete_own" on public.walls
  for delete using (public.user_owns_room_scan(room_scan_id));

create policy "openings_select_own" on public.openings
  for select using (public.user_owns_room_scan(room_scan_id));
create policy "openings_insert_own" on public.openings
  for insert with check (public.user_owns_room_scan(room_scan_id));
create policy "openings_update_own" on public.openings
  for update using (public.user_owns_room_scan(room_scan_id));
create policy "openings_delete_own" on public.openings
  for delete using (public.user_owns_room_scan(room_scan_id));

create policy "detected_objects_select_own" on public.detected_objects
  for select using (public.user_owns_room_scan(room_scan_id));
create policy "detected_objects_insert_own" on public.detected_objects
  for insert with check (public.user_owns_room_scan(room_scan_id));
create policy "detected_objects_update_own" on public.detected_objects
  for update using (public.user_owns_room_scan(room_scan_id));
create policy "detected_objects_delete_own" on public.detected_objects
  for delete using (public.user_owns_room_scan(room_scan_id));

create policy "scan_photos_select_own" on public.scan_photos
  for select using (public.user_owns_room_scan(room_scan_id));
create policy "scan_photos_insert_own" on public.scan_photos
  for insert with check (public.user_owns_room_scan(room_scan_id));
create policy "scan_photos_update_own" on public.scan_photos
  for update using (public.user_owns_room_scan(room_scan_id));
create policy "scan_photos_delete_own" on public.scan_photos
  for delete using (public.user_owns_room_scan(room_scan_id));

create policy "checklist_select_own" on public.inspection_checklist_items
  for select using (public.user_owns_room_scan(room_scan_id));
create policy "checklist_insert_own" on public.inspection_checklist_items
  for insert with check (public.user_owns_room_scan(room_scan_id));
create policy "checklist_update_own" on public.inspection_checklist_items
  for update using (public.user_owns_room_scan(room_scan_id));
create policy "checklist_delete_own" on public.inspection_checklist_items
  for delete using (public.user_owns_room_scan(room_scan_id));

-- repair_notes / repair_items / generated_scopes: through property
create policy "repair_notes_select_own" on public.repair_notes
  for select using (public.user_owns_property(property_id));
create policy "repair_notes_insert_own" on public.repair_notes
  for insert with check (public.user_owns_property(property_id));
create policy "repair_notes_update_own" on public.repair_notes
  for update using (public.user_owns_property(property_id));
create policy "repair_notes_delete_own" on public.repair_notes
  for delete using (public.user_owns_property(property_id));

create policy "repair_items_select_own" on public.repair_items
  for select using (public.user_owns_property(property_id));
create policy "repair_items_insert_own" on public.repair_items
  for insert with check (public.user_owns_property(property_id));
create policy "repair_items_update_own" on public.repair_items
  for update using (public.user_owns_property(property_id));
create policy "repair_items_delete_own" on public.repair_items
  for delete using (public.user_owns_property(property_id));

create policy "scopes_select_own" on public.generated_scopes
  for select using (public.user_owns_property(property_id));
create policy "scopes_insert_own" on public.generated_scopes
  for insert with check (public.user_owns_property(property_id));
create policy "scopes_update_own" on public.generated_scopes
  for update using (public.user_owns_property(property_id));
create policy "scopes_delete_own" on public.generated_scopes
  for delete using (public.user_owns_property(property_id));
