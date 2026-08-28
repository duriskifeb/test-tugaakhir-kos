import type React from "react";
import type { Database } from "./database.types";

// --- Database Row Types (shorthand) ---
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type BoardingHouse = Database["public"]["Tables"]["tenants"]["Row"];
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type Renter = Database["public"]["Tables"]["renters"]["Row"];
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type TenantStaff = Database["public"]["Tables"]["tenant_staffs"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PageSection = Database["public"]["Tables"]["page_sections"]["Row"];

// --- Insert Types ---
export type InsertRoom = Database["public"]["Tables"]["rooms"]["Insert"];
export type InsertTenant = Database["public"]["Tables"]["tenants"]["Insert"];
export type InsertBoardingHouse = Database["public"]["Tables"]["tenants"]["Insert"];
export type InsertRenter = Database["public"]["Tables"]["renters"]["Insert"];
export type InsertPayment = Database["public"]["Tables"]["payments"]["Insert"];

// --- Update Types ---
export type UpdateRoom = Database["public"]["Tables"]["rooms"]["Update"];
export type UpdateBoardingHouse = Database["public"]["Tables"]["tenants"]["Update"];

// --- Enums ---
export type RoomStatus = Database["public"]["Enums"]["room_status"];
export type UserRole = Database["public"]["Enums"]["user_role"];

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

export type FilterOption = "All" | "available" | "occupied" | "maintenance";

// --- API Response Types ---

export type ServiceResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
