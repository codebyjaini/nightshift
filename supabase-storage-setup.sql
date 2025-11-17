-- NightShift MD Storage Bucket Policies
-- Execute this SQL in your Supabase SQL Editor after creating the patient-images bucket

-- Note: First create the bucket via the Supabase Dashboard:
-- 1. Go to Storage
-- 2. Click "Create a new bucket"
-- 3. Name: patient-images
-- 4. Public bucket: ON
-- 5. Click "Create bucket"

-- Then run these policies:

-- Allow anonymous uploads to patient-images bucket
CREATE POLICY "Allow anonymous uploads to patient-images"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'patient-images');

-- Allow public reads from patient-images bucket
CREATE POLICY "Allow public reads from patient-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'patient-images');

-- Optional: Allow deletes (for cleanup/admin purposes)
-- Uncomment if needed
-- CREATE POLICY "Allow authenticated deletes from patient-images"
-- ON storage.objects FOR DELETE
-- TO authenticated
-- USING (bucket_id = 'patient-images');
