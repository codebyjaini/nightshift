# Authentication Troubleshooting Guide

## 🔍 Current Issue
Getting "Invalid login credentials" error when trying to log in.

## ✅ Verified Items
- ✅ Environment variables are correct (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`)
- ✅ Auth service is using `supabase.auth.signInWithPassword()` correctly
- ✅ Login form is passing email and password properly

## 🎯 Solution: Create Test User in Supabase

### Option 1: Create User via Supabase Dashboard (RECOMMENDED)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `acgfrasgdxgcjcvumobg`
3. **Navigate to**: Authentication → Users (left sidebar)
4. **Click**: "Add user" button (top right)
5. **Fill in**:
   - Email: `testdoctor@demo.com`
   - Password: `TestDoctor123!`
   - Auto Confirm User: ✅ **CHECK THIS BOX** (important!)
6. **Click**: "Create user"

### Option 2: Create User via SQL (Alternative)

If you prefer SQL, run this in Supabase SQL Editor:

```sql
-- Create a test doctor user
-- Note: This creates the user in auth.users table
-- Password will be hashed automatically

-- First, check if Email provider is enabled
-- Go to: Authentication → Providers → Email (should be enabled)

-- Create user with SQL (requires admin access)
-- This is a workaround - Dashboard method is preferred
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
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
  crypt('TestDoctor123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

**⚠️ WARNING**: The SQL method above may not work due to security restrictions. **Use the Dashboard method instead**.

## 🔧 Additional Checks

### 1. Verify Email Authentication is Enabled

1. Go to: **Authentication → Providers**
2. Find: **Email** provider
3. Ensure: It's **ENABLED** (toggle should be ON)
4. Settings should show:
   - ✅ Enable email provider
   - ✅ Confirm email (can be disabled for testing)

### 2. Check Authentication Settings

1. Go to: **Authentication → Settings**
2. Verify:
   - Site URL: Should match your app URL
   - Redirect URLs: Add `http://localhost:5173/**` for local testing

### 3. Test with These Credentials

After creating the user, test with:
- **Email**: `testdoctor@demo.com`
- **Password**: `TestDoctor123!`

### 4. Check Browser Console

Open browser DevTools (F12) and check:
- Network tab: Look for auth requests
- Console tab: Check for error messages
- Look for the `signInWithPassword` request and response

## 🐛 Common Issues & Solutions

### Issue: "Invalid login credentials"
**Causes**:
- User doesn't exist in Supabase
- Password is incorrect
- Email is not confirmed (if email confirmation is required)

**Solution**:
1. Create user via Dashboard (Option 1 above)
2. Make sure "Auto Confirm User" is checked
3. Use exact credentials: `testdoctor@demo.com` / `TestDoctor123!`

### Issue: "Email not confirmed"
**Solution**:
1. Go to Authentication → Users
2. Find the user
3. Click the three dots (•••)
4. Select "Confirm email"

### Issue: "User already exists but can't login"
**Solution**:
1. Go to Authentication → Users
2. Find the user `testdoctor@demo.com`
3. Delete the user
4. Create a new user with "Auto Confirm User" checked

## 🧪 Testing Steps

### Step 1: Verify User Exists
```sql
-- Run this in Supabase SQL Editor
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
WHERE email = 'testdoctor@demo.com';
```

Expected result: Should return 1 row with the user details

### Step 2: Test Login
1. Go to: `http://localhost:5173/login`
2. Enter:
   - Email: `testdoctor@demo.com`
   - Password: `TestDoctor123!`
3. Click "Sign In"
4. Should redirect to dashboard

### Step 3: Check Browser Console
If login fails, check console for:
```
Sign in error: { message: "...", status: ... }
```

## 📝 Quick Setup Checklist

- [ ] Email provider is enabled in Supabase
- [ ] Test user created via Dashboard
- [ ] "Auto Confirm User" was checked when creating user
- [ ] Email: `testdoctor@demo.com`
- [ ] Password: `TestDoctor123!`
- [ ] User appears in Authentication → Users list
- [ ] Browser console shows no CORS errors
- [ ] Environment variables are loaded (check `import.meta.env.VITE_SUPABASE_URL`)

## 🎯 Expected Behavior After Fix

1. Navigate to `/login`
2. Enter credentials
3. Click "Sign In"
4. See loading state
5. Redirect to `/doctor/dashboard`
6. Dashboard loads with patient list

## 💡 Pro Tip

For easier testing, you can also:
1. Create multiple test users
2. Use simple passwords for development (e.g., `password123`)
3. Disable email confirmation in Supabase settings for faster testing

---

**Need more help?** Check the browser console for specific error messages and share them for more targeted troubleshooting.
