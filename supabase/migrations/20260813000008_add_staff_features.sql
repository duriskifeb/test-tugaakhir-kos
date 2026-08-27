-- 1. Tabel Renters (Penghuni Kamar)
CREATE TABLE public.renters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    check_in_date DATE NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL, -- active | moved_out
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Payments (Tagihan)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    renter_id UUID REFERENCES public.renters(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status TEXT DEFAULT 'unpaid' NOT NULL, -- unpaid | paid
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Maintenance (Keluhan/Perbaikan)
CREATE TABLE public.maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    reported_by TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- pending | in_progress | resolved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Aktifkan RLS untuk keamanan
ALTER TABLE public.renters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

-- 5. Buat Hak Akses (Policies) untuk Pemilik dan Staf
-- (Script ini otomatis memberi akses ke Owner dan Staff yang aktif)

-- Akses Renters
CREATE POLICY "Manage renters" ON public.renters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tenants WHERE tenants.id = renters.tenant_id AND tenants.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.tenant_staffs ts JOIN public.profiles p ON p.email = ts.email WHERE ts.tenant_id = renters.tenant_id AND p.id = auth.uid() AND ts.status = 'active')
);

-- Akses Payments
CREATE POLICY "Manage payments" ON public.payments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tenants WHERE tenants.id = payments.tenant_id AND tenants.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.tenant_staffs ts JOIN public.profiles p ON p.email = ts.email WHERE ts.tenant_id = payments.tenant_id AND p.id = auth.uid() AND ts.status = 'active')
);

-- Akses Maintenance
CREATE POLICY "Manage maintenance" ON public.maintenance_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM public.tenants WHERE tenants.id = maintenance_requests.tenant_id AND tenants.owner_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.tenant_staffs ts JOIN public.profiles p ON p.email = ts.email WHERE ts.tenant_id = maintenance_requests.tenant_id AND p.id = auth.uid() AND ts.status = 'active')
);
