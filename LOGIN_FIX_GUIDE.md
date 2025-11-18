# 🔐 NightShift MD - Doctor Login Fix Guide

## 🚨 Problem
Getting "Invalid login credentials" error when trying to log in with testdoctor@demo.com

## ✅ Solution Overview

The issue is most likely that **the test doctor user doesn't exist in Supabase Authentication**. Follow the steps below to fix it.

---

## 📋 Step-by-Step Fix

### Step 1: Create Test Doctor User in Supabase

**This is the most important step!**

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your NightShift MD project

2. **Navigate to Authentication**
   - Click on **"Authentication"** in the left sidebar
   - Click on **"Users"**

3. **Add New User**
   - Click the **"Add user"** button (top right)
   - Fill in the form:
     - **Email**: `testdoctor@demo.com`
     - **Password**: `Test123!`
     - **✅ IMPORTANT: Check "Auto Confirm User"** (This is critical!)
   - Click **"Create user"**

4. **Verify User Creation**
   - You should see the new user in the users list
   - Email should be: `testdoctor@demo.com`
   - Status should show as confirmed

---

### Step 2: Verify Environment Variables

Your `.env` file should have these exact values:

```env
VITE_SUPABASE_URL=https://acgfrasgdxgcjcvumobg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjZ2ZyYXNnZHhnY2pjdnVtb2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNjA4ODMsImV4cCI6MjA3ODkzNjg4M30.nmmCtw1OiPfJrOcTzeY9m0gvjBYzbz_swG70UtXXGSE
```

✅ These are already correct in your project!

---

### Step 3: Run SQL Diagnostic Script

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Create a new query**
4. **Copy and paste the contents of `fix-doctor-login.sql`**
5. **Run the query**

This will:
- Check if the user exists
- Verify email is confirmed
- Check authentication settings
- Verify RLS policies
- Show any issues

---

### Step 4: Test Login with Diagnostic Tool

1. **Open `test-login-connection.html` in your browser**
2. **Click "Test Connection"** - Should show ✅ success
3. **Click "Test Login"** with credentials:
   - Email: `testdoctor@demo.com`
   - Password: `Test123!`
4. **Check the results**:
   - ✅ Success = Login is working!
   - ❌ Error = Follow the troubleshooting steps shown

---

### Step 5: Test in Your App

1. **Restart your development server** (if running):
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. **Open your app**: http://localhost:5173/login

3. **Enter credentials**:
   - Email: `testdoctor@demo.com`
   - Password: `Test123!`

4. **Click "Sign In"**

5. **Check browser console** (F12) for detailed logs

---

## 🔍 Verification Checklist

Before testing, make sure:

- [ ] Test user exists in Supabase Dashboard → Authentication → Users
- [ ] User email is `testdoctor@demo.com`
- [ ] User is confirmed (Auto Confirm was checked)
- [ ] Environment variables are correct in `.env`
- [ ] Development server was restarted after any `.env` changes
- [ ] Browser cache was cleared (Ctrl+Shift+R for hard refresh)

---

## 🛠️ Troubleshooting

### Issue: "Invalid login credentials"

**Cause**: User doesn't exist or wrong password

**Solution**:
1. Go to Supabase Dashboard → Authentication → Users
2. Check if `testdoctor@demo.com` exists
3. If not, create it (see Step 1)
4. If it exists, try resetting the password:
   - Click the "..." menu next to the user
   - Select "Reset password"
   - Set password to `Test123!`

---

### Issue: "Email not confirmed"

**Cause**: User was created without "Auto Confirm User" checked

**Solution**:
1. Go to Supabase Dashboard → Authentication → Users
2. Find `testdoctor@demo.com`
3. Click the "..." menu
4. Select "Confirm email"

OR run this SQL:
```sql
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'testdoctor@demo.com';
```

---

### Issue: "Network error" or "Failed to fetch"

**Cause**: Can't connect to Supabase

**Solution**:
1. Check internet connection
2. Verify Supabase project is active (not paused)
3. Check environment variables are correct
4. Try the diagnostic tool to test connection

---

### Issue: Login works in diagnostic tool but not in app

**Cause**: Environment variables not loaded or cache issue

**Solution**:
1. Restart development server
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser localStorage:
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Local Storage"
   - Right-click and "Clear"
4. Try again

---

## 📊 What the Code Does

### Authentication Flow

1. **User enters credentials** in Login.tsx
2. **authService.signIn()** is called with email/password
3. **Supabase client** sends request to Supabase Auth API
4. **Supabase verifies**:
   - User exists in `auth.users` table
   - Password matches encrypted_password
   - Email is confirmed (email_confirmed_at is set)
5. **If successful**: Returns session token
6. **If failed**: Returns error message

### Current Implementation

✅ **Login.tsx**: Properly calls signIn with email/password
✅ **authService.js**: Uses correct `signInWithPassword` method
✅ **supabaseClient.js**: Properly configured with environment variables
✅ **Environment variables**: Correct format with VITE_ prefix

**Everything is implemented correctly!** The only issue is the missing user in Supabase.

---

## 🎯 Quick Fix (TL;DR)

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Email: `testdoctor@demo.com`
4. Password: `Test123!`
5. ✅ Check "Auto Confirm User"
6. Click "Create user"
7. Test login in your app

---

## 📞 Still Not Working?

If you've followed all steps and it's still not working:

1. **Open browser console** (F12) when trying to log in
2. **Look for error messages** - they will be detailed now
3. **Copy the exact error message**
4. **Check the Network tab** to see the actual API request/response
5. **Run the diagnostic tool** and share the results

The enhanced logging in the code will show:
- 🔐 Login attempt details
- ❌ Detailed error information
- ✅ Success confirmation

---

## 🚀 After Login Works

Once login is working, you should:

1. ✅ Be redirected to `/doctor/dashboard`
2. ✅ See the doctor dashboard with patient list
3. ✅ Be able to view patient details
4. ✅ Session should persist on page refresh

---

## 📝 Test Credentials

**Email**: `testdoctor@demo.com`
**Password**: `Test123!`

(Case-sensitive! Make sure to use exact capitalization)

---

## 🔒 Security Notes

- The test user is for development only
- In production, use proper user registration
- Never commit real passwords to git
- Use environment variables for all sensitive data
- Enable RLS policies for production

---

**Need more help?** Run the diagnostic tool and share the output!
