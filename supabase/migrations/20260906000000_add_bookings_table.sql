-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boarding_house_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    renter_name TEXT NOT NULL,
    renter_phone TEXT NOT NULL,
    renter_email TEXT,
    planned_check_in DATE NOT NULL,
    additional_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Setup Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 1. Allow public (anyone) to insert new bookings (calon penyewa yang submit form)
CREATE POLICY "Allow public to submit bookings" 
    ON public.bookings FOR INSERT 
    WITH CHECK (true);

-- 2. Allow Owner to view/update bookings for their boarding houses
CREATE POLICY "Owner can view their bookings" 
    ON public.bookings FOR SELECT 
    USING (
        boarding_house_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Owner can update their bookings" 
    ON public.bookings FOR UPDATE 
    USING (
        boarding_house_id IN (
            SELECT id FROM public.tenants WHERE owner_id = auth.uid()
        )
    );

-- 3. Allow Staff to view/update bookings for their assigned boarding house
CREATE POLICY "Staff can view assigned bookings" 
    ON public.bookings FOR SELECT 
    USING (
        boarding_house_id IN (
            SELECT tenant_id FROM public.tenant_staffs 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND status = 'active'
        )
    );

CREATE POLICY "Staff can update assigned bookings" 
    ON public.bookings FOR UPDATE 
    USING (
        boarding_house_id IN (
            SELECT tenant_id FROM public.tenant_staffs 
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
            AND status = 'active'
        )
    );
