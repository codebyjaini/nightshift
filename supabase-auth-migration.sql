-- NightShift MD - Authentication & Phone/Gender Fields Migration
-- Execute this SQL in your Supabase SQL Editor

-- Add phone and gender columns to patients table if they don't exist
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add comments for documentation
COMMENT ON COLUMN patients.phone IS 'Patient phone number for contact';
COMMENT ON COLUMN patients.gender IS 'Patient gender (male, female, other, prefer_not_to_say)';

-- Optional: Add check constraint for gender values
ALTER TABLE patients
DROP CONSTRAINT IF EXISTS patients_gender_check;

ALTER TABLE patients
ADD CONSTRAINT patients_gender_check 
CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say') OR gender IS NULL);

-- Create index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);

-- Note: Authentication is handled by Supabase Auth
-- No additional tables needed for authentication

-- To enable Row Level Security (RLS) for authenticated users:
-- Uncomment the following if you want to restrict access

-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- -- Allow authenticated users to read all patients
-- CREATE POLICY "Authenticated users can view patients" ON patients
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- -- Allow anonymous users to insert (for patient triage form)
-- CREATE POLICY "Anonymous users can create patients" ON patients
--   FOR INSERT
--   TO anon
--   WITH CHECK (true);

-- -- Allow authenticated users to update patients
-- CREATE POLICY "Authenticated users can update patients" ON patients
--   FOR UPDATE
--   TO authenticated
--   USING (true);
