-- Drop the problematic staff policies that query auth.users
DROP POLICY IF EXISTS "Staff can view assigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Staff can update assigned bookings" ON public.bookings;

-- Recreate policies using authenticated JWT email directly instead of querying auth.users
CREATE POLICY "Staff can view assigned bookings" 
    ON public.bookings FOR SELECT 
    USING (
        boarding_house_id IN (
            SELECT tenant_id FROM public.tenant_staffs 
            WHERE email = auth.jwt()->>'email'
            AND status = 'active'
        )
    );

CREATE POLICY "Staff can update assigned bookings" 
    ON public.bookings FOR UPDATE 
    USING (
        boarding_house_id IN (
            SELECT tenant_id FROM public.tenant_staffs 
            WHERE email = auth.jwt()->>'email'
            AND status = 'active'
        )
    );
