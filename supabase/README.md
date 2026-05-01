# Supabase

Schema, migrations, and storage setup for Reinnovation Scan.

## Files

- `migrations/20260501000000_initial_schema.sql` — All 12 tables, indexes, triggers, RLS policies, helper functions
- `migrations/20260501000001_storage_buckets.sql` — `scan-photos` and `scan-models` buckets + RLS

## Applying migrations

### Option A: Supabase CLI (recommended)

```bash
# from project root
supabase link --project-ref <your-project-ref>
supabase db push
```

### Option B: Manual via SQL Editor

1. Open Supabase dashboard → SQL Editor
2. Paste contents of `20260501000000_initial_schema.sql`, run
3. Paste contents of `20260501000001_storage_buckets.sql`, run

## Tables

| Table | Purpose |
| --- | --- |
| `profiles` | Extends `auth.users` (auto-populated on signup via trigger) |
| `properties` | Top-level user-owned property/project |
| `rooms` | Rooms inside a property |
| `room_scans` | Each scan attempt for a room (RoomPlan output) |
| `walls` | Walls captured by a scan |
| `openings` | Doors / windows / openings (typed by `type` column) |
| `detected_objects` | Furniture/fixtures detected by RoomPlan |
| `scan_photos` | Photos anchored to room/wall/opening |
| `inspection_checklist_items` | Required inspection items per scan |
| `repair_notes` | Free-form repair observations |
| `repair_items` | Costed repair line items |
| `generated_scopes` | Compiled scope-of-work documents |

## Storage convention

All uploads must be stored under a path that begins with the user's `auth.uid()`:

```
scan-photos/<user_id>/<property_id>/<room_id>/<filename>.jpg
scan-models/<user_id>/<property_id>/<room_id>/<scan_id>.usdz
```

RLS uses `(storage.foldername(name))[1]` to enforce this — anything not under your uid is invisible.

## RLS model

- `properties`: owner is `auth.uid()` directly via `user_id`
- `rooms`: ownership inherited from `properties`
- `room_scans` / `walls` / `openings` / `detected_objects` / `scan_photos` / `inspection_checklist_items`: ownership inherited up through `room_scans → rooms → properties`
- `repair_notes` / `repair_items` / `generated_scopes`: ownership inherited from `properties`

Helper SECURITY DEFINER functions (`user_owns_property`, `user_owns_room`, `user_owns_room_scan`) keep policies short and avoid recursive RLS evaluation.

## TypeScript types

The hand-written `Database` type lives at `src/types/database.ts` and mirrors this schema. After any migration change, regenerate:

```bash
npx supabase gen types typescript --project-id <id> > src/types/database.ts
```
