/**
 * Database Types - Auto-generated dari Supabase CLI
 *
 * Cara generate otomatis:
 * npx supabase gen types typescript --project-id <your-project-id> > src/types/database.types.ts
 *
 * File ini adalah placeholder yang mendefinisikan struktur database saat ini.
 * Update sesuai dengan schema Supabase kamu.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "admin" | "owner" | "staff" | "renter";
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "owner" | "staff" | "renter";
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "admin" | "owner" | "staff" | "renter";
          email?: string | null;
          updated_at?: string;
        };
      };
      boarding_houses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          address: string | null;
          subdomain: string | null;
          primary_color: string | null;
          accent_color: string | null;
          whatsapp: string | null;
          status: "UNVERIFIED" | "VERIFIED";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          address?: string | null;
          subdomain?: string | null;
          primary_color?: string | null;
          accent_color?: string | null;
          whatsapp?: string | null;
          status?: "UNVERIFIED" | "VERIFIED";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          address?: string | null;
          subdomain?: string | null;
          primary_color?: string | null;
          accent_color?: string | null;
          whatsapp?: string | null;
          status?: "UNVERIFIED" | "VERIFIED";
          updated_at?: string;
        };
      };
      rooms: {
        Row: {
          id: string;
          boarding_house_id: string;
          number: string;
          type: "VIP" | "Standard" | "Economy";
          price_per_month: number;
          status: "empty" | "occupied" | "maintenance";
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          boarding_house_id: string;
          number: string;
          type: "VIP" | "Standard" | "Economy";
          price_per_month: number;
          status?: "empty" | "occupied" | "maintenance";
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          number?: string;
          type?: "VIP" | "Standard" | "Economy";
          price_per_month?: number;
          status?: "empty" | "occupied" | "maintenance";
          description?: string | null;
          updated_at?: string;
        };
      };
      tenants: {
        Row: {
          id: string;
          room_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          check_in_date: string;
          check_out_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          check_in_date: string;
          check_out_date?: string | null;
          created_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          check_out_date?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      room_type: "VIP" | "Standard" | "Economy";
      room_status: "empty" | "occupied" | "maintenance";
    };
  };
}
