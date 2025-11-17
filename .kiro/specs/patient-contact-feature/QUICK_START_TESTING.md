# Quick Start: Manual Testing Guide

## 🚀 Pre-Testing Setup (5 minutes)

### 1. Verify Database Migration
```sql
-- Run this in Supabase SQL Editor to verify migration was applied
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'patients' 
AND column_name IN ('contacted', 'contacted_at');

-- Should return:
-- contacted    | boolean                  | YES
-- contacted_at | timestamp with time zone | YES

-- Verify contact_history table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'contact_history';
```

**If migration not applied:** Run the SQL from `supabase-contact-migration.sql` in Supabase SQL Editor

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Two Browser Tabs
- Tab 1: http://localhost:5173/doctor
- Tab 2: http://localhost:5173/doctor (for real-time testing)

---

## ✅ Critical Test Scenarios (15 minutes)

### Test 1: Phone Number Display & Call Button
**Location:** Patient Card

1. ✓ Phone number visible with phone icon
2. ✓ Click phone number → device dialer opens
3. ✓ Clicking phone doesn't expand card

**Expected:** Phone link works, no navigation away from page

---

### Test 2: Contact Status Badges
**Location:** Patient Card & Patient Detail

1. ✓ Uncontacted patient shows yellow "Pending" badge
2. ✓ Contacted patient shows green "Contacted" badge
3. ✓ Badge colors are distinct and readable

**Expected:** Badges display correctly in both locations

---

### Test 3: Mark as Contacted Flow
**Location:** Patient Detail Modal

1. Open uncontacted patient detail
2. ✓ "Mark as Contacted" button is visible
3. Click "Mark as Contacted"
4. ✓ Button shows loading state
5. ✓ Badge changes from yellow "Pending" to green "Contacted"
6. ✓ "Mark as Contacted" button disappears
7. Close and reopen patient detail
8. ✓ Changes persist

**Expected:** Complete flow works, changes persist

---

### Test 4: Real-time Updates
**Location:** Two Browser Tabs

**Setup:** Both tabs open to Doctor Dashboard

1. In Tab 1: Mark a patient as contacted
2. Watch Tab 2 (don't refresh)
3. ✓ Tab 2 updates within 1-2 seconds
4. ✓ Badge changes from yellow to green in Tab 2
5. ✓ No console errors in either tab

**Expected:** Real-time sync works across tabs

---

### Test 5: Database Verification
**Location:** Supabase Dashboard

After marking a patient as contacted:

```sql
-- Check patients table
SELECT id, name, contacted, contacted_at 
FROM patients 
WHERE contacted = true 
ORDER BY contacted_at DESC 
LIMIT 5;

-- Check contact_history table
SELECT * 
FROM contact_history 
ORDER BY contacted_at DESC 
LIMIT 5;
```

**Expected:**
- ✓ `patients.contacted` = true
- ✓ `patients.contacted_at` has timestamp
- ✓ `contact_history` has matching record
- ✓ `contact_history.patient_id` matches patient
- ✓ `contact_history.doctor_id` = 'temp-doctor-id'

---

### Test 6: Error Handling
**Location:** Browser DevTools

1. Open DevTools (F12) → Network tab
2. Enable "Offline" mode
3. Try to mark patient as contacted
4. ✓ Error message displays
5. ✓ Button returns to normal state
6. Re-enable network
7. ✓ Can retry successfully

**Expected:** Graceful error handling, no crashes

---

### Test 7: No Breaking Changes
**Location:** Full Application

Quick smoke test of existing features:

1. ✓ Submit new patient triage form
2. ✓ Mark patient as treated
3. ✓ Mark patient as not treated
4. ✓ Upload image for patient
5. ✓ Filter by risk level
6. ✓ Filter by treatment status

**Expected:** All existing features work normally

---

## 🎯 Quick Accessibility Check (5 minutes)

### Keyboard Navigation
1. Tab through patient cards
2. ✓ Can reach phone link with Tab
3. ✓ Enter key activates phone link
4. ✓ Can reach "Mark as Contacted" button
5. ✓ Enter key activates button
6. ✓ Focus indicators visible

**Expected:** Full keyboard accessibility

---

## 📱 Mobile Responsiveness (5 minutes)

1. Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Select iPhone or Android device
3. ✓ Phone numbers readable on mobile
4. ✓ Badges display correctly
5. ✓ Buttons are touch-friendly
6. ✓ No horizontal scrolling

**Expected:** Works well on mobile viewports

---

## 🐛 Common Issues & Solutions

### Issue: Phone link doesn't work
**Solution:** Check browser settings - some browsers block tel: links

### Issue: Real-time updates not working
**Solution:** 
1. Check Supabase realtime is enabled
2. Verify subscription in browser console
3. Check network tab for websocket connection

### Issue: "Mark as Contacted" button doesn't appear
**Solution:** Patient may already be contacted - check database

### Issue: Database records not created
**Solution:** 
1. Verify migration was applied
2. Check Supabase logs for errors
3. Verify RLS policies allow inserts

---

## ✅ Testing Complete Checklist

- [ ] All 7 critical tests passed
- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Database records verified
- [ ] Real-time updates confirmed
- [ ] No breaking changes to existing features

**If all checked:** Feature is ready! ✨

---

## 📝 Report Issues

If you find issues during testing, document:

1. **What you did:** Step-by-step actions
2. **What happened:** Actual behavior
3. **What should happen:** Expected behavior
4. **Browser/Device:** Chrome, Firefox, Safari, etc.
5. **Console errors:** Any errors in DevTools console

Save notes in: `.kiro/specs/patient-contact-feature/TEST_RESULTS.md`
