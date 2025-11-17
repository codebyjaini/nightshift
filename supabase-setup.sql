-- NightShift MD Database Schema
-- Execute this SQL in your Supabase SQL Editor

-- Create patients table with constraints
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
  symptoms TEXT NOT NULL CHECK (char_length(symptoms) >= 10 AND char_length(symptoms) <= 1000),
  pain_level TEXT NOT NULL CHECK (pain_level IN ('Low', 'Medium', 'High')),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'Critical')),
  image TEXT,
  treated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster sorting and filtering
CREATE INDEX IF NOT EXISTS idx_patients_risk_created ON patients(risk_level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_treated ON patients(treated);

-- Enable real-time for the patients table
ALTER PUBLICATION supabase_realtime ADD TABLE patients;

-- Optional: Add Row Level Security (RLS) policies
-- Uncomment these if you want to enable RLS (recommended for production)
-- ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for patient submissions)
-- CREATE POLICY "Allow anonymous inserts" ON patients
--   FOR INSERT
--   TO anon
--   WITH CHECK (true);

-- Allow anonymous reads (for doctor dashboard)
-- CREATE POLICY "Allow anonymous reads" ON patients
--   FOR SELECT
--   TO anon
--   USING (true);

-- Allow anonymous updates (for treatment status)
-- CREATE POLICY "Allow anonymous updates" ON patients
--   FOR UPDATE
--   TO anon
--   USING (true)
--   WITH CHECK (true);
