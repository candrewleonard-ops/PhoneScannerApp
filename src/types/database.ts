/**
 * Supabase database type definitions.
 *
 * Mirror of supabase/migrations/20260501000000_initial_schema.sql.
 * Keep in sync. Can also be regenerated via:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ScanStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type OpeningType = 'door' | 'window' | 'opening';
export type PhotoType = 'auto_frame' | 'wall_photo' | 'detail_photo' | 'ceiling' | 'floor' | 'damage';
export type RepairItemStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
export type RepairSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: '12';
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          address: string | null;
          city: string | null;
          state: string | null;
          zip: string | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip?: string | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rooms: {
        Row: {
          id: string;
          property_id: string;
          name: string;
          floor_level: string | null;
          room_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          name: string;
          floor_level?: string | null;
          room_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          name?: string;
          floor_level?: string | null;
          room_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      room_scans: {
        Row: {
          id: string;
          room_id: string;
          scan_status: string | null;
          raw_roomplan_json: Json | null;
          model_file_url: string | null;
          floor_area: number | null;
          ceiling_height: number | null;
          confidence_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          scan_status?: string | null;
          raw_roomplan_json?: Json | null;
          model_file_url?: string | null;
          floor_area?: number | null;
          ceiling_height?: number | null;
          confidence_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          scan_status?: string | null;
          raw_roomplan_json?: Json | null;
          model_file_url?: string | null;
          floor_area?: number | null;
          ceiling_height?: number | null;
          confidence_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      walls: {
        Row: {
          id: string;
          room_scan_id: string;
          external_identifier: string | null;
          length: number | null;
          height: number | null;
          area: number | null;
          transform: Json | null;
          confidence: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_scan_id: string;
          external_identifier?: string | null;
          length?: number | null;
          height?: number | null;
          area?: number | null;
          transform?: Json | null;
          confidence?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_scan_id?: string;
          external_identifier?: string | null;
          length?: number | null;
          height?: number | null;
          area?: number | null;
          transform?: Json | null;
          confidence?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      openings: {
        Row: {
          id: string;
          room_scan_id: string;
          wall_id: string | null;
          type: string;
          width: number | null;
          height: number | null;
          sill_height: number | null;
          transform: Json | null;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_scan_id: string;
          wall_id?: string | null;
          type: string;
          width?: number | null;
          height?: number | null;
          sill_height?: number | null;
          transform?: Json | null;
          confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_scan_id?: string;
          wall_id?: string | null;
          type?: string;
          width?: number | null;
          height?: number | null;
          sill_height?: number | null;
          transform?: Json | null;
          confidence?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      detected_objects: {
        Row: {
          id: string;
          room_scan_id: string;
          type: string;
          dimensions: Json | null;
          transform: Json | null;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_scan_id: string;
          type: string;
          dimensions?: Json | null;
          transform?: Json | null;
          confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_scan_id?: string;
          type?: string;
          dimensions?: Json | null;
          transform?: Json | null;
          confidence?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      scan_photos: {
        Row: {
          id: string;
          room_scan_id: string;
          room_id: string;
          wall_id: string | null;
          opening_id: string | null;
          photo_type: string;
          image_url: string;
          local_pose: Json | null;
          camera_transform: Json | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_scan_id: string;
          room_id: string;
          wall_id?: string | null;
          opening_id?: string | null;
          photo_type: string;
          image_url: string;
          local_pose?: Json | null;
          camera_transform?: Json | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_scan_id?: string;
          room_id?: string;
          wall_id?: string | null;
          opening_id?: string | null;
          photo_type?: string;
          image_url?: string;
          local_pose?: Json | null;
          camera_transform?: Json | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      inspection_checklist_items: {
        Row: {
          id: string;
          room_scan_id: string;
          label: string;
          item_type: string;
          target_wall_id: string | null;
          target_opening_id: string | null;
          required: boolean;
          completed: boolean;
          completed_photo_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_scan_id: string;
          label: string;
          item_type: string;
          target_wall_id?: string | null;
          target_opening_id?: string | null;
          required?: boolean;
          completed?: boolean;
          completed_photo_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_scan_id?: string;
          label?: string;
          item_type?: string;
          target_wall_id?: string | null;
          target_opening_id?: string | null;
          required?: boolean;
          completed?: boolean;
          completed_photo_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      repair_notes: {
        Row: {
          id: string;
          property_id: string;
          room_id: string | null;
          room_scan_id: string | null;
          wall_id: string | null;
          opening_id: string | null;
          title: string;
          body: string | null;
          severity: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          room_id?: string | null;
          room_scan_id?: string | null;
          wall_id?: string | null;
          opening_id?: string | null;
          title: string;
          body?: string | null;
          severity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          room_id?: string | null;
          room_scan_id?: string | null;
          wall_id?: string | null;
          opening_id?: string | null;
          title?: string;
          body?: string | null;
          severity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      repair_items: {
        Row: {
          id: string;
          property_id: string;
          room_id: string | null;
          room_scan_id: string | null;
          wall_id: string | null;
          opening_id: string | null;
          category: string | null;
          description: string;
          quantity: number | null;
          unit: string | null;
          unit_cost: number | null;
          total_cost: number | null;
          status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          room_id?: string | null;
          room_scan_id?: string | null;
          wall_id?: string | null;
          opening_id?: string | null;
          category?: string | null;
          description: string;
          quantity?: number | null;
          unit?: string | null;
          unit_cost?: number | null;
          total_cost?: number | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          room_id?: string | null;
          room_scan_id?: string | null;
          wall_id?: string | null;
          opening_id?: string | null;
          category?: string | null;
          description?: string;
          quantity?: number | null;
          unit?: string | null;
          unit_cost?: number | null;
          total_cost?: number | null;
          status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      generated_scopes: {
        Row: {
          id: string;
          property_id: string;
          title: string;
          body: string;
          total_estimated_cost: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          title: string;
          body: string;
          total_estimated_cost?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          title?: string;
          body?: string;
          total_estimated_cost?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ----- Convenience aliases for app code -----

type Tables = Database['public']['Tables'];

export type Profile = Tables['profiles']['Row'];
export type ProfileInsert = Tables['profiles']['Insert'];
export type ProfileUpdate = Tables['profiles']['Update'];

export type Property = Tables['properties']['Row'];
export type PropertyInsert = Tables['properties']['Insert'];
export type PropertyUpdate = Tables['properties']['Update'];

export type Room = Tables['rooms']['Row'];
export type RoomInsert = Tables['rooms']['Insert'];
export type RoomUpdate = Tables['rooms']['Update'];

export type RoomScan = Tables['room_scans']['Row'];
export type RoomScanInsert = Tables['room_scans']['Insert'];
export type RoomScanUpdate = Tables['room_scans']['Update'];

export type Wall = Tables['walls']['Row'];
export type WallInsert = Tables['walls']['Insert'];
export type WallUpdate = Tables['walls']['Update'];

export type Opening = Tables['openings']['Row'];
export type OpeningInsert = Tables['openings']['Insert'];
export type OpeningUpdate = Tables['openings']['Update'];

export type DetectedObject = Tables['detected_objects']['Row'];
export type DetectedObjectInsert = Tables['detected_objects']['Insert'];
export type DetectedObjectUpdate = Tables['detected_objects']['Update'];

export type ScanPhoto = Tables['scan_photos']['Row'];
export type ScanPhotoInsert = Tables['scan_photos']['Insert'];
export type ScanPhotoUpdate = Tables['scan_photos']['Update'];

export type InspectionChecklistItem = Tables['inspection_checklist_items']['Row'];
export type InspectionChecklistItemInsert = Tables['inspection_checklist_items']['Insert'];
export type InspectionChecklistItemUpdate = Tables['inspection_checklist_items']['Update'];

export type RepairNote = Tables['repair_notes']['Row'];
export type RepairNoteInsert = Tables['repair_notes']['Insert'];
export type RepairNoteUpdate = Tables['repair_notes']['Update'];

export type RepairItem = Tables['repair_items']['Row'];
export type RepairItemInsert = Tables['repair_items']['Insert'];
export type RepairItemUpdate = Tables['repair_items']['Update'];

export type GeneratedScope = Tables['generated_scopes']['Row'];
export type GeneratedScopeInsert = Tables['generated_scopes']['Insert'];
export type GeneratedScopeUpdate = Tables['generated_scopes']['Update'];

// ----- Storage bucket names -----

export const STORAGE_BUCKETS = {
  SCAN_PHOTOS: 'scan-photos',
  SCAN_MODELS: 'scan-models',
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
