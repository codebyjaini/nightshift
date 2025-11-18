# NightShift MD - Quick Start Guide

## 🚀 Setup Instructions

### 1. Database Migration
Run this SQL in your Supabase SQL Editor:
```sql
-- Add phone and gender columns
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT;
```

### 2. Create Test User
In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - Email: `doctor@test.com`
   - Password: `Test123!`
4. Click **"Create user"**

### 3. Start Development Server
```bash
npm run dev
```

## 🧪 Test the Complete Flow

### Step 1: Test Protected Route
1. Open browser to `http://localhost:5173/doctor/dashboard`
2. ✅ Should redirect to `/login` (not authenticated)

### Step 2: Login
1. On login page, enter:
   - Email: `doctor@test.com`
   - Password: `Test123!`
2. Click **"Sign In"**
3. ✅ Should redirect to dashboard

### Step 3: Add a Patient
1. Go to home page: `http://localhost:5173`
2. Click **"Start Triage"**
3. Fill in Step 1:
   - Name: `John Doe`
   - Age: `35`
   - Phone: `(555) 123-4567`
   - Gender: `Male`
4. Continue through steps:
   - Symptoms: `Chest pain and shortness of breath`
   - Pain Level: `High`
5. Submit form
6. ✅ Should see success screen

### Step 4: View Patient on Dashboard
1. Go to dashboard: `http://localhost:5173/doctor/dashboard`
2. ✅ Should see the new patient card

### Step 5: Test Call Button
1. Click on the patient card to open details
2. Find the **"Call Patient"** button
3. Click it:
   - **On Mobile**: ✅ Should open phone dialer
   - **On Desktop**: ✅ Should show "Copied!" and copy number to clipboard

### Step 6: Test Logout
1. Click **"Logout"** button in dashboard header
2. ✅ Should redirect to login page
3. Try accessing `http://localhost:5173/doctor/dashboard`
4. ✅ Should redirect to login (protected)

## 📱 Features Summary

### Authentication
- ✅ Email/password login
- ✅ Protected dashboard route
- ✅ Logout functionality
- ✅ Session persistence

### Patient Form
- ✅ Name (required)
- ✅ Age (required)
- ✅ Phone (required, validated)
- ✅ Gender (required, dropdown)
- ✅ Symptoms (required)
- ✅ Pain level (required)

### Call Patient Feature
- ✅ **Mobile**: Opens phone dialer
- ✅ **Desktop**: Copies to clipboard
- ✅ Visual feedback ("Copied!")
- ✅ Clean UI with phone icon

### UI Improvements
- ✅ Clean spacing and alignment
- ✅ Consistent button sizes
- ✅ Dark theme throughout
- ✅ Loading states
- ✅ Error handling

## 🔧 Troubleshooting

### "Cannot access dashboard"
- Make sure you're logged in
- Check browser console for errors
- Verify Supabase credentials in `.env`

### "Phone/Gender fields not saving"
- Run the database migration SQL
- Check Supabase table structure
- Verify columns exist: `phone`, `gender`

### "Login not working"
- Verify Email auth is enabled in Supabase
- Check user exists in Authentication → Users
- Check browser console for errors

### "Call button not working"
- On mobile: Check browser permissions
- On desktop: Check clipboard permissions
- Verify phone number is not empty

## 📊 Database Schema

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  phone TEXT,              -- NEW
  gender TEXT,             -- NEW
  symptoms TEXT NOT NULL,
  pain_level TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  image TEXT,
  treated BOOLEAN DEFAULT false,
  contacted BOOLEAN DEFAULT false,
  contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## ✅ Verification Checklist

- [ ] Database migration applied
- [ ] Test user created in Supabase
- [ ] Can access login page
- [ ] Can login successfully
- [ ] Dashboard is protected (redirects when not logged in)
- [ ] Can submit patient form with phone and gender
- [ ] Patient appears on dashboard
- [ ] Call button works (mobile: dialer, desktop: clipboard)
- [ ] Logout works and protects dashboard
- [ ] Build completes without errors (`npm run build`)

## 🎉 Success!

If all checklist items are complete, your NightShift MD application is fully updated and ready to use!

---

**Need Help?** Check the `AUTHENTICATION_UPDATE_SUMMARY.md` for detailed implementation notes.
