-- NightShift MD - Patient Contact Feature Migration
-- Execute this SQL in your Supabase SQL Editor
-- This migration adds contact tracking functionality to the existing patients table

-- Add contact tracking columns to patients table
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS contacted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS contacted_at TIMESTAMP WITH TIME ZONE;

-- Create contact_history table for logging all contact attempts
CREATE TABLE IF NOT EXISTS contact_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL,
  doctor_id UUID NOT NULL,
  contacted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id)
    ON DELETE CASCADE
);

-- Add indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_patients_contacted ON patients(contacted);
CREATE INDEX IF NOT EXISTS idx_patients_contacted_at ON patients(contacted_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_history_patient_id ON contact_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_contact_history_doctor_id ON contact_history(doctor_id);
CREATE INDEX IF NOT EXISTS idx_contact_history_contacted_at ON contact_history(contacted_at DESC);

-- Enable real-time for the contact_history table (optional)
ALTER PUBLICATION supabase_realtime ADD TABLE contact_history;

-- Optional: Add Row Level Security (RLS) policies for contact_history
-- Uncomment these if you want to enable RLS (recommended for production)
-- ALTER TABLE contact_history ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for contact logging)
-- CREATE POLICY "Allow anonymous inserts" ON contact_history
--   FOR INSERT
--   TO anon
--   WITH CHECK (true);

-- Allow anonymous reads (for contact history viewing)
-- CREATE POLICY "Allow anonymous reads" ON contact_history
--   FOR SELECT
--   TO anon
--   USING (true);
