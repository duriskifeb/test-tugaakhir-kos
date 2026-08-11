import { createClient } from "@/lib/supabase/server";
import type { Room, InsertRoom, UpdateRoom, RoomWithTenant, ServiceResult } from "@/types";

/**
 * Mengambil semua kamar milik boarding house tertentu.
 * @param boardingHouseId - UUID boarding house
 */
export async function getRooms(boardingHouseId: string): Promise<ServiceResult<RoomWithTenant[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select(`*, tenant:tenants(*)`)
    .eq("boarding_house_id", boardingHouseId)
    .order("number")
    .returns<RoomWithTenant[]>();

  if (error) return { data: null, error: error.message };
  return { data: data ?? [], error: null };
}

/**
 * Mengambil satu kamar berdasarkan ID.
 * @param roomId - UUID kamar
 */
export async function getRoomById(roomId: string): Promise<ServiceResult<Room>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single()
    .returns<Room>();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Kamar tidak ditemukan." };
  return { data, error: null };
}

/**
 * Membuat kamar baru.
 * @param room - Data kamar baru
 */
export async function createRoom(newRoom: InsertRoom): Promise<ServiceResult<Room>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .insert([newRoom] as never)
    .select()
    .single()
    .returns<Room>();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Gagal membuat kamar." };
  return { data, error: null };
}

/**
 * Mengupdate data kamar.
 * @param roomId - UUID kamar
 * @param updates - Field yang diupdate
 */
export async function updateRoom(
  roomId: string,
  updates: UpdateRoom
): Promise<ServiceResult<Room>> {
  const supabase = await createClient();

  const payload = { ...updates, updated_at: new Date().toISOString() } as never;

  const { data, error } = await supabase
    .from("rooms")
    .update(payload)
    .eq("id", roomId)
    .select()
    .single()
    .returns<Room>();

  if (error) return { data: null, error: error.message };
  if (!data) return { data: null, error: "Kamar tidak ditemukan." };
  return { data, error: null };
}

/**
 * Menghapus kamar berdasarkan ID.
 * @param roomId - UUID kamar
 */
export async function deleteRoom(roomId: string): Promise<ServiceResult<null>> {
  const supabase = await createClient();
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

/**
 * Mengambil statistik kamar untuk sebuah boarding house.
 */
export async function getRoomStats(boardingHouseId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("rooms")
    .select("status")
    .eq("boarding_house_id", boardingHouseId)
    .returns<{ status: string }[]>();

  if (error || !data) return null;

  const total = data.length;
  const occupied = data.filter((r) => r.status === "occupied").length;
  const empty = data.filter((r) => r.status === "empty").length;
  const maintenance = data.filter((r) => r.status === "maintenance").length;

  return {
    total,
    occupied,
    empty,
    maintenance,
    occupancy_rate: total > 0 ? Math.round((occupied / total) * 100) : 0,
  };
}
