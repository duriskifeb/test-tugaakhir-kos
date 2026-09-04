-- Create a bucket for tenant gallery images if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tenant-assets', 'tenant-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public to view images
CREATE POLICY "Give public access to tenant assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'tenant-assets');

-- Policy to allow authenticated users to upload their own tenant assets
CREATE POLICY "Allow authenticated users to upload assets" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'tenant-assets' AND 
    auth.role() = 'authenticated'
);
