import { supabase } from './supabase';
import { PropertyInsert, PropertyUpdate } from '@/types';

export async function createProperty(userId: string, property: Omit<PropertyInsert, 'user_id'>) {
  const { data, error } = await supabase
    .from('properties')
    .insert({ ...property, user_id: userId })
    .select()
    .single();
  return { data, error };
}

export async function getProperties(userId: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  return { data, error };
}

export async function updateProperty(id: string, updates: PropertyUpdate) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteProperty(id: string) {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  return { error };
}
