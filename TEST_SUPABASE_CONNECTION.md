# Supabase Connection Test & Fix

## Error: "Failed to create patient record"

This error occurs when:
1. The Supabase table doesn't exist
2. The table structure doesn't match
3. Connection credentials are wrong
4. RLS (Row Level Security) is blocking inserts

## Step 1: Verify Supabase Connection

Open your browser console (F12) and check for error messages. You should see logs like:
- "Form data before submission: {...}"
- "Submitting patient data: {...}"
- "Inserting patient data to Supabase: {...}"

## Step 2: Create the Patients Table

Go to your Supabase Dashboard:
1. Open https://supabase.com/dashboard
2. Select your project: `acgfrasgdxgcjcvumobg`
3. Go to **SQL Editor**
4. Run this SQL:

```sql
-- Drop existing table if needed (CAUTION: This deletes all data!)
-- DROP TABLE IF EXISTS patients CASCADE;

-- Create patients table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patients_risk_created ON patients(risk_level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patients_treated ON patients(treated);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE patients;

-- IMPORTANT: Disable RLS for testing (enable later for production)
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
```

## Step 3: Verify Table Structure

In Supabase Dashboard:
1. Go to **Table Editor**
2. Find the `patients` table
3. Verify these columns exist:
   - `id` (uuid)
   - `name` (text)
   - `age` (int4)
   - `symptoms` (text)
   - `pain_level` (text)
   - `risk_level` (text)
   - `image` (text, nullable)
   - `treated` (bool)
   - `created_at` (timestamptz)

## Step 4: Test Insert Manually

In SQL Editor, try inserting a test record:

```sql
INSERT INTO patients (name, age, symptoms, pain_level, risk_level, image, treated)
VALUES ('Test Patient', 25, 'Test symptoms for testing purposes', 'Medium', 'Low', NULL, FALSE);

-- Check if it worked
SELECT * FROM patients ORDER BY created_at DESC LIMIT 1;
```

If this works, the table is set up correctly.

## Step 5: Check RLS Policies

If RLS is enabled, you need to allow anonymous inserts:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'patients';

-- If rowsecurity is TRUE, either disable it or add policies:

-- Option A: Disable RLS (for development/testing)
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Option B: Add policies (for production)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON patients
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous reads" ON patients
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous updates" ON patients
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
```

## Step 6: Verify Environment Variables

Check your `.env` file has the correct values:

```
VITE_SUPABASE_URL=https://acgfrasgdxgcjcvumobg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 7: Test the Form Again

1. Restart your dev server: `npm run dev`
2. Open the patient form
3. Fill in all fields:
   - Name: "John Doe"
   - Age: 30
   - Symptoms: "Chest pain and difficulty breathing"
   - Pain Level: Medium
4. Submit the form
5. Check browser console for logs

## Common Errors & Solutions

### Error: "relation 'patients' does not exist"
**Solution:** Run the CREATE TABLE SQL from Step 2

### Error: "new row violates row-level security policy"
**Solution:** Disable RLS or add policies (Step 5)

### Error: "null value in column 'name' violates not-null constraint"
**Solution:** Ensure all form fields are filled before submission

### Error: "value too long for type character varying"
**Solution:** Check that symptoms are between 10-1000 characters

### Error: "new row for relation 'patients' violates check constraint"
**Solution:** 
- Age must be 0-150
- Pain level must be exactly: 'Low', 'Medium', or 'High' (case-sensitive)
- Risk level must be exactly: 'Low', 'Medium', or 'Critical' (case-sensitive)

## Quick Fix Command

Run this in Supabase SQL Editor to reset everything:

```sql
-- Drop and recreate table
DROP TABLE IF EXISTS patients CASCADE;

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  symptoms TEXT NOT NULL,
  pain_level TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  image TEXT,
  treated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for testing
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE patients;

-- Test insert
INSERT INTO patients (name, age, symptoms, pain_level, risk_level)
VALUES ('Test Patient', 25, 'Test symptoms', 'Medium', 'Low');

-- Verify
SELECT * FROM patients;
```

If this works, your form should work too!
