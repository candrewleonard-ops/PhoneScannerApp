import { create } from 'zustand';
import { Property, PropertyInsert, PropertyUpdate, Room, RoomInsert, RoomUpdate } from '@/types';
import * as supabaseService from '@/services/supabase';

interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  rooms: Room[];
  loading: boolean;
  error: string | null;

  fetchProperties: (userId: string) => Promise<void>;
  fetchProperty: (id: string) => Promise<void>;
  fetchRooms: (propertyId: string) => Promise<void>;

  createProperty: (
    userId: string,
    property: Omit<PropertyInsert, 'user_id'>
  ) => Promise<Property | null>;
  updateProperty: (id: string, updates: PropertyUpdate) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;

  createRoom: (
    propertyId: string,
    room: Omit<RoomInsert, 'property_id'>
  ) => Promise<Room | null>;
  updateRoom: (id: string, updates: RoomUpdate) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;

  clearError: () => void;
}

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  currentProperty: null,
  rooms: [],
  loading: false,
  error: null,

  fetchProperties: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.getProperties(userId);
      if (error) throw error;
      set({ properties: data || [], loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchProperty: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.getProperty(id);
      if (error) throw error;
      set({ currentProperty: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  fetchRooms: async (propertyId: string) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.getRooms(propertyId);
      if (error) throw error;
      set({ rooms: data || [], loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createProperty: async (userId, property) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.createProperty(userId, property);
      if (error) throw error;
      if (data) {
        set((state) => ({ properties: [data, ...state.properties], loading: false }));
        return data;
      }
      return null;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return null;
    }
  },

  updateProperty: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.updateProperty(id, updates);
      if (error) throw error;
      if (data) {
        set((state) => ({
          properties: state.properties.map((p) => (p.id === id ? data : p)),
          currentProperty: state.currentProperty?.id === id ? data : state.currentProperty,
          loading: false,
        }));
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  deleteProperty: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabaseService.deleteProperty(id);
      if (error) throw error;
      set((state) => ({
        properties: state.properties.filter((p) => p.id !== id),
        currentProperty: state.currentProperty?.id === id ? null : state.currentProperty,
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createRoom: async (propertyId, room) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.createRoom(propertyId, room);
      if (error) throw error;
      if (data) {
        set((state) => ({ rooms: [data, ...state.rooms], loading: false }));
        return data;
      }
      return null;
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
      return null;
    }
  },

  updateRoom: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabaseService.updateRoom(id, updates);
      if (error) throw error;
      if (data) {
        set((state) => ({
          rooms: state.rooms.map((r) => (r.id === id ? data : r)),
          loading: false,
        }));
      }
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  deleteRoom: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabaseService.deleteRoom(id);
      if (error) throw error;
      set((state) => ({
        rooms: state.rooms.filter((r) => r.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
