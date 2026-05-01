import { supabase } from './supabase';
import { ScanPhotoInsert, STORAGE_BUCKETS } from '@/types';

export interface UploadScanPhotoInput {
  userId: string;
  propertyId: string;
  roomId: string;
  /** A local file URI (e.g. `file:///...`) returned by the camera/picker. */
  localUri: string;
  /** Optional override of the stored filename. Defaults to a timestamp. */
  filename?: string;
  contentType?: string;
}

export interface UploadScanPhotoResult {
  storagePath: string;
  publicUrl: string | null;
  error: Error | null;
}

/**
 * Upload a local image file to the `scan-photos` bucket.
 * Path convention enforced by RLS: `<userId>/<propertyId>/<roomId>/<filename>`.
 */
export async function uploadScanPhoto({
  userId,
  propertyId,
  roomId,
  localUri,
  filename,
  contentType,
}: UploadScanPhotoInput): Promise<UploadScanPhotoResult> {
  try {
    const ext = (filename?.split('.').pop() || localUri.split('.').pop() || 'jpg').toLowerCase();
    const safeName = filename || `${Date.now()}.${ext}`;
    const storagePath = `${userId}/${propertyId}/${roomId}/${safeName}`;
    const inferredType = contentType || (ext === 'png' ? 'image/png' : 'image/jpeg');

    const response = await fetch(localUri);
    if (!response.ok) {
      throw new Error(`Failed to read local file: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.SCAN_PHOTOS)
      .upload(storagePath, arrayBuffer, {
        contentType: inferredType,
        upsert: false,
      });

    if (uploadError) {
      return { storagePath, publicUrl: null, error: uploadError };
    }

    const { data: publicData } = supabase.storage
      .from(STORAGE_BUCKETS.SCAN_PHOTOS)
      .getPublicUrl(storagePath);

    return { storagePath, publicUrl: publicData?.publicUrl ?? null, error: null };
  } catch (err) {
    return { storagePath: '', publicUrl: null, error: err as Error };
  }
}

export interface CreateScanPhotoRecordInput
  extends Omit<ScanPhotoInsert, 'id' | 'created_at'> {}

/**
 * Insert a row in `scan_photos` describing a previously uploaded image.
 * Pass the storage path or public URL returned from `uploadScanPhoto` as `image_url`.
 */
export async function createScanPhotoRecord(input: CreateScanPhotoRecordInput) {
  const { data, error } = await supabase
    .from('scan_photos')
    .insert(input)
    .select()
    .single();
  return { data, error };
}

/**
 * Generate a short-lived signed URL for displaying a private photo.
 * Useful when displaying scan photos in the app.
 */
export async function getSignedPhotoUrl(storagePath: string, expiresInSec = 3600) {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.SCAN_PHOTOS)
    .createSignedUrl(storagePath, expiresInSec);
  return { url: data?.signedUrl ?? null, error };
}
