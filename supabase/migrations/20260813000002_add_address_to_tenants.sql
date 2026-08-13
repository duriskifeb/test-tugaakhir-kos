-- Tambahkan kolom address dan description ke tabel tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS description TEXT;
