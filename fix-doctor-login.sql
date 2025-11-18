-- NightShift MD - Fix Doctor Login Issue
-- Run this in Supabase SQL Editor to diagnose and fix authentication

-- ============================================
-- STEP 1: Check if test doctor user exists
-- ============================================
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'testdoctor@demo.com';

-- If the query above returns no rows, the user doesn't exist!
-- Continue to STEP 2 to create the user.

-- ============================================
-- STEP 2: Create test doctor user
-- ============================================
-- Note: This uses Supabase's admin API internally
-- If this doesn't work, use the Dashboard method instead

-- Method A: Using Supabase Dashboard (RECOMMENDED)
-- 1. Go to Authentication → Users
-- 2. Click "Add user"
-- 3. Email: testdoctor@demo.com
-- 4. Password: Test123!
-- 5. Check "Auto Confirm User"
-- 6. Click "Create user"

-- Method B: Using SQL (may not work in all cases)
-- Uncomment the following if Method A doesn't work:

/*
-- First, check if pgcrypto extension is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the user with a hashed password
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'testdoctor@demo.com',
    crypt('Test123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
)
ON CONFLICT (email) DO NOTHING;
*/

-- ============================================
-- STEP 3: Verify email is confirmed
-- ============================================
-- If email_confirmed_at is NULL, the user can't log in
-- Run this to confirm the email:

UPDATE auth.users 
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'testdoctor@demo.com' 
  AND email_confirmed_at IS NULL;

-- ============================================
-- STEP 4: Check authentication configuration
-- ============================================
-- Verify that email authentication is enabled
SELECT 
    name,
    value
FROM auth.config 
WHERE name IN (
    'SITE_URL',
    'EXTERNAL_EMAIL_ENABLED',
    'MAILER_AUTOCONFIRM',
    'DISABLE_SIGNUP'
);

-- ============================================
-- STEP 5: Check Row Level Security on patients table
-- ============================================
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'patients';

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'patients';

-- ============================================
-- STEP 6: Ensure RLS doesn't block authentication
-- ============================================
-- RLS on the patients table shouldn't affect auth,
-- but let's make sure policies are correct

-- If RLS is enabled and causing issues, you can temporarily disable it:
-- ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Or ensure proper policies exist:
-- Drop existing policies if they're causing issues
DROP POLICY IF EXISTS "Authenticated users can view patients" ON patients;
DROP POLICY IF EXISTS "Anonymous users can create patients" ON patients;
DROP POLICY IF EXISTS "Authenticated users can update patients" ON patients;

-- Create proper policies
CREATE POLICY "Authenticated users can view patients" ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous users can create patients" ON patients
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update patients" ON patients
  FOR UPDATE
  TO authenticated
  USING (true);

-- Enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 7: Test authentication query
-- ============================================
-- This simulates what happens during login
-- Run this to see if the user can be authenticated

SELECT 
    id,
    email,
    encrypted_password IS NOT NULL as has_password,
    email_confirmed_at IS NOT NULL as email_confirmed,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'Email not confirmed'
        WHEN encrypted_password IS NULL THEN 'No password set'
        ELSE 'User should be able to login'
    END as status
FROM auth.users 
WHERE email = 'testdoctor@demo.com';

-- ============================================
-- STEP 8: Check for any auth-related errors
-- ============================================
-- Look at recent auth audit logs (if available)
SELECT 
    created_at,
    payload->>'action' as action,
    payload->>'actor_id' as actor_id,
    payload->>'error' as error
FROM auth.audit_log_entries 
WHERE payload->>'actor_username' = 'testdoctor@demo.com'
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================
-- VERIFICATION CHECKLIST
-- ============================================
-- After running this script, verify:
-- ✅ User exists in auth.users with email testdoctor@demo.com
-- ✅ email_confirmed_at is NOT NULL
-- ✅ encrypted_password is NOT NULL
-- ✅ Email provider is enabled in auth settings
-- ✅ RLS policies allow authenticated users to access patients table
-- ✅ No blocking policies on auth.users table

-- ============================================
-- FINAL TEST
-- ============================================
-- After running this script:
-- 1. Go to your app login page
-- 2. Enter: testdoctor@demo.com
-- 3. Enter: Test123!
-- 4. Click Sign In
-- 5. Check browser console for detailed error messages
