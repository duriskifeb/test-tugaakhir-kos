-- Tambahkan kolom is_suspended pada tabel profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_suspended BOOLEAN DEFAULT false;

-- (Sudah tercover oleh migration sebelumnya: Admins can update all profiles)
