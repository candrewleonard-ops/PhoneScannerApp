-- =========================================================================
-- Storage buckets and policies
--
-- Convention: every uploaded object is stored under a path beginning with
-- the owner's auth.uid(), e.g. "<user_id>/<property_id>/<filename>".
-- That makes RLS straightforward: a user can only read/write objects whose
-- top-level folder matches their uid.
-- =========================================================================

insert into storage.buckets (id, name, public, file_size_limit)
values
  ('scan-photos',  'scan-photos',  false, 52428800),    -- 50 MB per file
  ('scan-models',  'scan-models',  false, 524288000)   -- 500 MB per file (USDZ models)
on conflict (id) do nothing;

-- ---------------------------- scan-photos --------------------------------

create policy "scan_photos_select_own" on storage.objects
  for select using (
    bucket_id = 'scan-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "scan_photos_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'scan-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "scan_photos_update_own" on storage.objects
  for update using (
    bucket_id = 'scan-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "scan_photos_delete_own" on storage.objects
  for delete using (
    bucket_id = 'scan-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ---------------------------- scan-models --------------------------------

create policy "scan_models_select_own" on storage.objects
  for select using (
    bucket_id = 'scan-models'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "scan_models_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'scan-models'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "scan_models_update_own" on storage.objects
  for update using (
    bucket_id = 'scan-models'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "scan_models_delete_own" on storage.objects
  for delete using (
    bucket_id = 'scan-models'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
