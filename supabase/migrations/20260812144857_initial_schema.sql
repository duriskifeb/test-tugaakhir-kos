-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMs
CREATE TYPE user_role AS ENUM ('admin', 'owner', 'staff', 'renter');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance');

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'owner'::user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tenants Table (Boarding Houses)
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    subdomain TEXT UNIQUE,
    plan TEXT DEFAULT 'free' NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Rooms Table
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    boarding_house_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    status room_status DEFAULT 'available'::room_status NOT NULL,
    facilities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Page Sections Table (Website Builder)
CREATE TABLE public.page_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
    section_type TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Tenants: Owners can view and manage their own tenants (boarding houses)
CREATE POLICY "Owners can view own tenants" 
    ON public.tenants FOR SELECT 
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own tenants" 
    ON public.tenants FOR INSERT 
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own tenants" 
    ON public.tenants FOR UPDATE 
    USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own tenants" 
    ON public.tenants FOR DELETE 
    USING (auth.uid() = owner_id);

-- Rooms: Owners can manage rooms belonging to their boarding house
CREATE POLICY "Owners can view rooms of their tenant" 
    ON public.rooms FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = rooms.boarding_house_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can insert rooms to their tenant" 
    ON public.rooms FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = rooms.boarding_house_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can update rooms of their tenant" 
    ON public.rooms FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = rooms.boarding_house_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can delete rooms of their tenant" 
    ON public.rooms FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = rooms.boarding_house_id 
        AND tenants.owner_id = auth.uid()
    ));

-- Page Sections: Owners can manage sections belonging to their tenant
CREATE POLICY "Owners can view page sections of their tenant" 
    ON public.page_sections FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = page_sections.tenant_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can insert page sections to their tenant" 
    ON public.page_sections FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = page_sections.tenant_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can update page sections of their tenant" 
    ON public.page_sections FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = page_sections.tenant_id 
        AND tenants.owner_id = auth.uid()
    ));

CREATE POLICY "Owners can delete page sections of their tenant" 
    ON public.page_sections FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM public.tenants 
        WHERE tenants.id = page_sections.tenant_id 
        AND tenants.owner_id = auth.uid()
    ));

-------------------------------------------------------
-- PUBLIC ACCESS POLICIES (For Public Pages)
-------------------------------------------------------
-- Note: These policies allow anyone (including anon) to view data.
-- If we want to restrict by subdomain in the future, we will do it at application level
-- or via RLS if possible. For now, we allow public read.

CREATE POLICY "Anyone can view tenants" 
    ON public.tenants FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can view available rooms" 
    ON public.rooms FOR SELECT 
    USING (status = 'available'::room_status);

CREATE POLICY "Anyone can view page sections" 
    ON public.page_sections FOR SELECT 
    USING (true);

-------------------------------------------------------
-- TRIGGERS
-------------------------------------------------------
-- Automatically create profile when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'owner'::user_role)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
