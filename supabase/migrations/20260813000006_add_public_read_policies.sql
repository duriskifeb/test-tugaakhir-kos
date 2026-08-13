-- Mengizinkan publik (siapapun) untuk membaca data tenant, rooms, dan page_sections
-- Ini diperlukan agar public landing page (/kos/[subdomain]) bisa diakses tanpa login.

-- Tenants
CREATE POLICY "Public can view tenants" 
    ON public.tenants FOR SELECT 
    USING (true);

-- Rooms
CREATE POLICY "Public can view rooms" 
    ON public.rooms FOR SELECT 
    USING (true);

-- Page Sections
CREATE POLICY "Public can view page sections" 
    ON public.page_sections FOR SELECT 
    USING (true);
