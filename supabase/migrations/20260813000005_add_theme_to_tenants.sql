-- Tambahkan kolom theme pada tabel tenants untuk menyimpan pengaturan visual website builder
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{"primaryColor": "#3b23c6", "fontFamily": "Inter"}'::jsonb NOT NULL;
