-- Add 'role' column to profiles if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'owner', 'staff', 'renter');
    END IF;
END$$;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'owner'::user_role NOT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create a SECURITY DEFINER function to check admin status without triggering RLS recursively
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS for profiles so admins can read/update all
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
    ON public.profiles FOR SELECT 
    USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" 
    ON public.profiles FOR UPDATE 
    USING ( public.is_admin() );

-- Add 'status' column to tenants (boarding houses) if it doesn't exist
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'UNVERIFIED';

-- We need to ensure admins can view and update tenants (boarding houses).
DROP POLICY IF EXISTS "Admins can view all tenants" ON public.tenants;
CREATE POLICY "Admins can view all tenants" 
    ON public.tenants FOR SELECT 
    USING ( public.is_admin() );

DROP POLICY IF EXISTS "Admins can update all tenants" ON public.tenants;
CREATE POLICY "Admins can update all tenants" 
    ON public.tenants FOR UPDATE 
    USING ( public.is_admin() );


-- Create a dummy admin user in auth.users and profiles
DO $$
DECLARE
  admin_uid UUID := '00000000-0000-0000-0000-000000000000'::UUID; -- deterministic UUID for dummy admin
BEGIN
  -- Insert into auth.users (if not exists)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@admin.com') THEN
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      admin_uid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@admin.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"full_name": "Super Admin"}',
      now(),
      now()
    );
    
    -- handle_new_user trigger might have fired and created the profile as 'owner'
    -- We force the profile to be 'admin'
    UPDATE public.profiles SET role = 'admin'::user_role, email = 'admin@admin.com', full_name = 'Super Admin' WHERE id = admin_uid;
    
    -- If the trigger failed or didn't exist for this UUID, insert it manually
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = admin_uid) THEN
        INSERT INTO public.profiles (id, full_name, email, role) 
        VALUES (admin_uid, 'Super Admin', 'admin@admin.com', 'admin'::user_role);
    END IF;
  END IF;
END
$$;
