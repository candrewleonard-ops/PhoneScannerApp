import { supabase } from './supabase';
import { Json, RoomScanInsert, RoomScanUpdate } from '@/types';

/**
 * Create a placeholder room_scan row before native scanning begins.
 * The native module will later push wall/opening/object/photo data
 * via saveRoomScanStructure().
 */
export async function createRoomScan(
  roomId: string,
  scan: Omit<RoomScanInsert, 'room_id'> = {}
) {
  const { data, error } = await supabase
    .from('room_scans')
    .insert({
      room_id: roomId,
      scan_status: 'in_progress',
      ...scan,
    })
    .select()
    .single();
  return { data, error };
}

export async function getRoomScan(id: string) {
  const { data, error } = await supabase
    .from('room_scans')
    .select('*, walls(*), openings(*), detected_objects(*), scan_photos(*)')
    .eq('id', id)
    .single();
  return { data, error };
}

/**
 * Returns the most recent room_scan for a room, or null if no scans exist yet.
 */
export async function getLatestRoomScanForRoom(roomId: string) {
  const { data, error } = await supabase
    .from('room_scans')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return { data, error };
}

export interface RoomScanStructure {
  floor_area?: number | null;
  ceiling_height?: number | null;
  confidence_score?: number | null;
  raw_roomplan_json?: Json | null;
  model_file_url?: string | null;
  walls?: Array<{
    external_identifier?: string | null;
    length?: number | null;
    height?: number | null;
    area?: number | null;
    transform?: Json | null;
    confidence?: number | null;
  }>;
  openings?: Array<{
    type: string;
    wall_id?: string | null;
    width?: number | null;
    height?: number | null;
    sill_height?: number | null;
    transform?: Json | null;
    confidence?: number | null;
  }>;
  detected_objects?: Array<{
    type: string;
    dimensions?: Json | null;
    transform?: Json | null;
    confidence?: number | null;
  }>;
}

/**
 * Persist parsed RoomPlan output for an existing room_scan row.
 * - Updates scan-level summary fields (floor_area, etc.) and scan_status
 * - Inserts walls, then openings (with wall_id mapping by external_identifier),
 *   and detected_objects.
 *
 * NOTE: Wiring of wall_id mapping happens here so the native side can refer to
 * walls by an external identifier (e.g. RoomPlan UUID) rather than DB UUIDs.
 */
export async function saveRoomScanStructure(roomScanId: string, structure: RoomScanStructure) {
  const updates: RoomScanUpdate = {
    scan_status: 'completed',
    floor_area: structure.floor_area ?? null,
    ceiling_height: structure.ceiling_height ?? null,
    confidence_score: structure.confidence_score ?? null,
    raw_roomplan_json: structure.raw_roomplan_json ?? null,
    model_file_url: structure.model_file_url ?? null,
  };

  const { error: updateError } = await supabase
    .from('room_scans')
    .update(updates)
    .eq('id', roomScanId);

  if (updateError) return { error: updateError, wallsByExtId: {} };

  // Insert walls and build a map of external_identifier -> new uuid
  const wallsByExtId: Record<string, string> = {};

  if (structure.walls && structure.walls.length > 0) {
    const wallRows = structure.walls.map((w) => ({ ...w, room_scan_id: roomScanId }));
    const { data: insertedWalls, error: wallErr } = await supabase
      .from('walls')
      .insert(wallRows)
      .select();

    if (wallErr) return { error: wallErr, wallsByExtId };

    insertedWalls?.forEach((w) => {
      if (w.external_identifier) wallsByExtId[w.external_identifier] = w.id;
    });
  }

  // Insert openings, resolving wall_id from external identifier if needed
  if (structure.openings && structure.openings.length > 0) {
    const openingRows = structure.openings.map((o) => ({
      ...o,
      room_scan_id: roomScanId,
      wall_id: o.wall_id && wallsByExtId[o.wall_id] ? wallsByExtId[o.wall_id] : o.wall_id ?? null,
    }));
    const { error: openErr } = await supabase.from('openings').insert(openingRows);
    if (openErr) return { error: openErr, wallsByExtId };
  }

  // Insert detected objects
  if (structure.detected_objects && structure.detected_objects.length > 0) {
    const objRows = structure.detected_objects.map((o) => ({ ...o, room_scan_id: roomScanId }));
    const { error: objErr } = await supabase.from('detected_objects').insert(objRows);
    if (objErr) return { error: objErr, wallsByExtId };
  }

  return { error: null, wallsByExtId };
}
