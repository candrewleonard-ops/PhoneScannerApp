export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  property_id: string;
  name: string;
  description?: string;
  floor_area?: number;
  ceiling_height?: number;
  room_data?: Record<string, unknown>;
  scan_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Wall {
  id: string;
  room_id: string;
  name: string;
  length?: number;
  height?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Door {
  id: string;
  room_id: string;
  wall_id?: string;
  width?: number;
  height?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Window {
  id: string;
  room_id: string;
  wall_id?: string;
  width?: number;
  height?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RoomPhoto {
  id: string;
  room_id: string;
  wall_id?: string;
  door_id?: string;
  window_id?: string;
  photo_url: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RepairItem {
  id: string;
  room_id: string;
  wall_id?: string;
  door_id?: string;
  window_id?: string;
  description: string;
  estimated_cost?: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export * from './navigation';
