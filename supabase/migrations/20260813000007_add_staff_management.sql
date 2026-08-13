-- 1. Penambahan role 'staff' ke enum user_role
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'staff';

-- 2. Pembuatan tabel tenant_staffs (Undangan Staf)
CREATE TABLE public.tenant_staffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending | active
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(tenant_id, email)
);

-- Enable RLS on tenant_staffs
ALTER TABLE public.tenant_staffs ENABLE ROW LEVEL SECURITY;

-- Owner can view and manage their staffs
CREATE POLICY "Owners can view staffs" 
    ON public.tenant_staffs FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = tenant_staffs.tenant_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can insert staffs" 
    ON public.tenant_staffs FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = tenant_staffs.tenant_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can delete staffs" 
    ON public.tenant_staffs FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = tenant_staffs.tenant_id 
        AND tenants.owner_id = auth.uid()
    ));

-- 3. Modifikasi trigger handle_new_user untuk mendeteksi email karyawan
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  is_staff BOOLEAN;
BEGIN
  -- Cek apakah email user yang mendaftar ada di tabel tenant_staffs
  SELECT EXISTS(SELECT 1 FROM public.tenant_staffs WHERE email = new.email) INTO is_staff;
  
  IF is_staff THEN
    -- Jika dia adalah karyawan, paksa role menjadi 'staff'
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'staff'::user_role);
    
    -- Ubah status undangan menjadi active
    UPDATE public.tenant_staffs SET status = 'active' WHERE email = new.email;
  ELSE
    -- Jika pendaftar biasa, role default (tenant) atau sesuai metadata
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'full_name',
      COALESCE((new.raw_user_meta_data->>'role')::user_role, 'tenant'::user_role)
    );
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Perbarui RLS Policy agar 'staff' bisa mengelola Kamar (rooms) dan Page Sections
-- Karena RLS untuk rooms/page_sections saat ini hanya public SELECT dan owner INSERT/UPDATE/DELETE.
-- Kita akan berikan akses INSERT/UPDATE/DELETE ke staff.

-- RLS Rooms untuk Staff
CREATE POLICY "Staff can manage rooms" 
    ON public.rooms FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.tenant_staffs ts
        JOIN public.profiles p ON p.email = ts.email
        WHERE ts.tenant_id = rooms.boarding_house_id
        AND p.id = auth.uid()
        AND ts.status = 'active'
      )
    );

-- RLS Page Sections untuk Staff
CREATE POLICY "Staff can manage page sections" 
    ON public.page_sections FOR ALL 
    USING (
      EXISTS (
        SELECT 1 FROM public.tenant_staffs ts
        JOIN public.profiles p ON p.email = ts.email
        WHERE ts.tenant_id = page_sections.tenant_id
        AND p.id = auth.uid()
        AND ts.status = 'active'
      )
    );
