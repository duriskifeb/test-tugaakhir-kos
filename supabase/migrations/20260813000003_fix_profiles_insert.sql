-- 1. Tambahkan policy agar user baru bisa INSERT ke tabel profiles saat register
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- 2. Secara otomatis perbaiki data user yang profilnya gagal tersimpan sebelumnya
INSERT INTO public.profiles (id, full_name, role)
SELECT id, raw_user_meta_data->>'full_name', 'owner'::user_role
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
