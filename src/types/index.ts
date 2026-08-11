import type React from "react";
import type { Database } from "./database.types";

// --- Database Row Types (shorthand) ---
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type BoardingHouse = Database["public"]["Tables"]["boarding_houses"]["Row"];
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];

// --- Insert Types ---
export type InsertRoom = Database["public"]["Tables"]["rooms"]["Insert"];
export type InsertTenant = Database["public"]["Tables"]["tenants"]["Insert"];
export type InsertBoardingHouse = Database["public"]["Tables"]["boarding_houses"]["Insert"];

// --- Update Types ---
export type UpdateRoom = Database["public"]["Tables"]["rooms"]["Update"];
export type UpdateBoardingHouse = Database["public"]["Tables"]["boarding_houses"]["Update"];

// --- Enums ---
export type RoomType = Database["public"]["Enums"]["room_type"];
export type RoomStatus = Database["public"]["Enums"]["room_status"];

// --- Composite / Extended Types ---

/** Room dengan data tenant yang sedang menempati */
export type RoomWithTenant = Room & {
  tenant: Tenant | null;
};

/** Boarding House dengan statistik kamar */
export type BoardingHouseWithStats = BoardingHouse & {
  total_rooms: number;
  occupied_rooms: number;
  occupancy_rate: number;
};

// --- UI / Form Types ---

export type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};

export type FilterOption = "All" | "empty" | "occupied" | "maintenance";

// --- API Response Types ---

export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
