import { supabase } from './supabase';
import { RoomInsert, RoomUpdate } from '@/types';

export async function createRoom(propertyId: string, room: Omit<RoomInsert, 'property_id'>) {
  const { data, error } = await supabase
    .from('rooms')
    .insert({ ...room, property_id: propertyId })
    .select()
    .single();
  return { data, error };
}

export async function getRoomsForProperty(propertyId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getRoomById(id: string) {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
  return { data, error };
}

export async function updateRoom(id: string, updates: RoomUpdate) {
  const { data, error } = await supabase
    .from('rooms')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteRoom(id: string) {
  const { error } = await supabase.from('rooms').delete().eq('id', id);
  return { error };
}
