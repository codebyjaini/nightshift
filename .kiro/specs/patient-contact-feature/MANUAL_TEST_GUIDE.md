# Manual Testing Guide: Patient Contact Feature

## Prerequisites
- Application is running locally (npm run dev)
- Supabase database has the contact feature migration applied
- At least one test patient exists in the database
- Two browser windows/tabs open for real-time testing

## Test Environment Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the application in two browser tabs:**
   - Tab 1: http://localhost:5173/doctor
   - Tab 2: http://localhost:5173/doctor

3. **Verify database migration:**
   - Check that `patients` table has `contacted` and `contacted_at` columns
   - Check that `contact_history` table exists

---

## Test Cases

### ✅ Test 1: Phone Number Display on Patient Cards

**Objective:** Verify phone numbers are displayed correctly on patient cards

**Steps:**
1. Navigate to Doctor Dashboard
2. Locate a patient card in the list
3. Look for the phone number display with phone icon

**Expected Results:**
- [ ] Phone number is visible on the patient card
- [ ] Phone icon (from lucide-react) appears next to the number
- [ ] Phone number is formatted and readable
- [ ] Phone number is styled with accent-cyan color

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 2: Call Button Functionality (tel: link)

**Objective:** Verify the call button initiates a phone call

**Steps:**
1. On a patient card, locate the phone number
2. Click on the phone number link
3. Observe the system behavior

**Expected Results:**
- [ ] Clicking the phone number triggers the device's phone dialer
- [ ] The correct phone number is pre-populated in the dialer
- [ ] The tel: protocol is working correctly
- [ ] Clicking the phone link does NOT navigate away from the dashboard
- [ ] Event propagation is stopped (card doesn't expand when clicking phone)

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 3: Contact Status Badge Display

**Objective:** Verify contact status badges display correctly

**Steps:**
1. Find a patient that has NOT been contacted
2. Observe the badge on the patient card
3. Find a patient that HAS been contacted
4. Observe the badge on that patient card

**Expected Results:**
- [ ] Uncontacted patients show a yellow "Pending" badge
- [ ] Contacted patients show a green "Contacted" badge
- [ ] Badge colors match the design (yellow-500 for pending, green-500 for contacted)
- [ ] Badge text is clear and readable
- [ ] Badges are positioned correctly on the card

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 4: PatientDetail Call Button

**Objective:** Verify the call button in the detail view works

**Steps:**
1. Click on a patient card to open the detail view
2. Locate the "Contact Information" section
3. Find the "Call Now" button
4. Click the "Call Now" button

**Expected Results:**
- [ ] "Contact Information" section is visible
- [ ] "Call Now" button displays with phone icon
- [ ] Button is styled with accent-cyan background
- [ ] Clicking button triggers phone dialer with correct number
- [ ] Phone number is displayed next to the button

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 5: Mark as Contacted - Button Visibility

**Objective:** Verify "Mark as Contacted" button appears only for uncontacted patients

**Steps:**
1. Open detail view for an uncontacted patient (contacted = false)
2. Look for "Mark as Contacted" button
3. Open detail view for a contacted patient (contacted = true)
4. Look for "Mark as Contacted" button

**Expected Results:**
- [ ] "Mark as Contacted" button is visible for uncontacted patients
- [ ] Button has a check icon
- [ ] Button is NOT visible for already contacted patients
- [ ] Button is styled appropriately (secondary variant)

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 6: Mark as Contacted - Functionality

**Objective:** Verify marking a patient as contacted works correctly

**Steps:**
1. Open detail view for an uncontacted patient
2. Click "Mark as Contacted" button
3. Observe the UI changes
4. Close and reopen the patient detail

**Expected Results:**
- [ ] Button shows loading state when clicked
- [ ] Button is disabled during the operation
- [ ] After success, badge updates from "Pending" (yellow) to "Contacted" (green)
- [ ] "Mark as Contacted" button disappears after marking
- [ ] Patient card in the list also updates to show "Contacted" badge
- [ ] Changes persist after closing and reopening detail view

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 7: Database Record Verification

**Objective:** Verify database records are created correctly

**Steps:**
1. Mark a patient as contacted (note the patient ID)
2. Check the database using Supabase dashboard or SQL query

**SQL Queries to run:**
```sql
-- Check patients table
SELECT id, name, contacted, contacted_at 
FROM patients 
WHERE id = 'PATIENT_ID_HERE';

-- Check contact_history table
SELECT * 
FROM contact_history 
WHERE patient_id = 'PATIENT_ID_HERE'
ORDER BY contacted_at DESC;
```

**Expected Results:**
- [ ] `patients.contacted` is set to `true`
- [ ] `patients.contacted_at` has a valid timestamp
- [ ] A new record exists in `contact_history` table
- [ ] `contact_history.patient_id` matches the patient ID
- [ ] `contact_history.doctor_id` is populated (even if placeholder)
- [ ] `contact_history.contacted_at` matches `patients.contacted_at`

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 8: Real-time Updates Across Browser Tabs

**Objective:** Verify real-time updates work when marking patients as contacted

**Steps:**
1. Open Doctor Dashboard in two browser tabs (Tab 1 and Tab 2)
2. In Tab 1, open a patient detail view
3. In Tab 1, click "Mark as Contacted"
4. Observe Tab 2 (without refreshing)

**Expected Results:**
- [ ] Tab 2 automatically updates to show "Contacted" badge (green)
- [ ] Tab 2 updates without manual refresh
- [ ] Update happens within 1-2 seconds
- [ ] Both tabs show consistent data
- [ ] No console errors in either tab

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 9: Error Handling - Network Failure

**Objective:** Verify error handling when network request fails

**Steps:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Enable "Offline" mode or throttle to "Offline"
4. Try to mark a patient as contacted
5. Re-enable network

**Expected Results:**
- [ ] Error message or notification is displayed
- [ ] Button returns to normal state (not stuck in loading)
- [ ] User can retry the operation
- [ ] No console errors that crash the app
- [ ] Patient status remains unchanged in the database

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 10: Error Handling - Invalid Patient ID

**Objective:** Verify error handling for invalid operations

**Steps:**
1. Open browser DevTools console
2. Manually call the service function with invalid patient ID:
   ```javascript
   // In console
   import { markPatientContacted } from './services/patientService';
   markPatientContacted('invalid-id', 'doctor-id');
   ```
3. Observe the response

**Expected Results:**
- [ ] Function returns an error object
- [ ] Error message is meaningful
- [ ] No unhandled promise rejections
- [ ] Application remains stable

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 11: Accessibility - Keyboard Navigation

**Objective:** Verify keyboard accessibility for contact features

**Steps:**
1. Navigate to Doctor Dashboard
2. Use Tab key to navigate through patient cards
3. Use Tab to reach phone number link
4. Press Enter on phone number link
5. Open patient detail and Tab to "Mark as Contacted" button
6. Press Enter on the button

**Expected Results:**
- [ ] All interactive elements are reachable via Tab key
- [ ] Focus indicators are visible
- [ ] Enter key activates phone link
- [ ] Enter key activates "Mark as Contacted" button
- [ ] Focus management is logical and predictable

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 12: Accessibility - Screen Reader

**Objective:** Verify screen reader compatibility

**Steps:**
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through patient cards
3. Listen to phone number announcement
4. Listen to badge announcements
5. Navigate to "Mark as Contacted" button

**Expected Results:**
- [ ] Phone numbers are announced clearly
- [ ] Contact status badges are announced ("Contacted" or "Pending")
- [ ] Buttons have descriptive labels
- [ ] ARIA labels are present where needed
- [ ] Status changes are announced

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 13: No Breaking Changes - Existing Functionality

**Objective:** Verify existing features still work correctly

**Steps:**
1. Submit a new patient triage form
2. Mark a patient as treated
3. Mark a patient as not treated
4. Upload an image for a patient
5. Filter patients by risk level
6. Filter patients by treatment status

**Expected Results:**
- [ ] Patient triage submission works
- [ ] Treatment status updates work
- [ ] Image upload works
- [ ] All filters work correctly
- [ ] Real-time updates still work for treatment status
- [ ] No console errors
- [ ] No visual regressions

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

### ✅ Test 14: Mobile Responsiveness

**Objective:** Verify contact features work on mobile devices

**Steps:**
1. Open DevTools and toggle device toolbar (Ctrl+Shift+M)
2. Select a mobile device (iPhone, Android)
3. Test all contact features on mobile viewport

**Expected Results:**
- [ ] Phone numbers are visible and clickable on mobile
- [ ] Badges display correctly on small screens
- [ ] "Call Now" button is appropriately sized for touch
- [ ] "Mark as Contacted" button is touch-friendly
- [ ] No horizontal scrolling
- [ ] All text is readable

**Pass/Fail:** ___________

**Notes:** ___________________________________________

---

## Summary

**Total Tests:** 14  
**Passed:** ___________  
**Failed:** ___________  
**Blocked:** ___________  

**Critical Issues Found:**
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

**Minor Issues Found:**
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

**Tested By:** ___________  
**Date:** ___________  
**Environment:** ___________  

---

## Sign-off

- [ ] All critical tests passed
- [ ] All blocking issues resolved
- [ ] Feature ready for production

**Tester Signature:** ___________  
**Date:** ___________
