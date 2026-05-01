import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database, Property, PropertyInsert, PropertyUpdate, Room, RoomInsert, RoomUpdate } from '@/types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase credentials not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env'
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ---------- Auth ----------
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user ?? null, error };
}

// ---------- Properties ----------
export async function createProperty(
  userId: string,
  property: Omit<PropertyInsert, 'user_id'>
) {
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

export async function getProperty(id: string) {
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

// ---------- Rooms ----------
export async function createRoom(
  propertyId: string,
  room: Omit<RoomInsert, 'property_id'>
) {
  const { data, error } = await supabase
    .from('rooms')
    .insert({ ...room, property_id: propertyId })
    .select()
    .single();
  return { data, error };
}

export async function getRooms(propertyId: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function getRoom(id: string) {
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
