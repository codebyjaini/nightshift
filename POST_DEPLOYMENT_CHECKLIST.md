# Post-Deployment Testing Checklist

Use this checklist to verify your deployment is working correctly.

## Environment Setup

- [ ] Deployment URL is accessible
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is valid

## Environment Variables

- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] No console errors about missing environment variables

## Supabase Configuration

- [ ] Database schema is created (patients table exists)
- [ ] Storage bucket `patient-images` exists and is public
- [ ] Real-time is enabled for patients table
- [ ] Can connect to Supabase from deployed app

## Patient Interface Testing

### Landing Page
- [ ] Landing page loads without errors
- [ ] "I'm a Patient" button works
- [ ] "I'm a Doctor" button works
- [ ] Styling looks correct (dark theme, accent colors)

### Triage Form - Step 1 (Basic Info)
- [ ] Name input accepts text
- [ ] Age input accepts numbers
- [ ] Validation works (name min 2 chars, age 0-150)
- [ ] "Next" button is disabled when invalid
- [ ] "Next" button proceeds to Step 2 when valid

### Triage Form - Step 2 (Symptoms)
- [ ] Textarea accepts text
- [ ] Character counter shows (10-1000)
- [ ] Validation error shows if < 10 characters
- [ ] "Back" button returns to Step 1
- [ ] "Next" button proceeds to Step 3

### Triage Form - Step 3 (Pain Level)
- [ ] Three pain level cards display (Low, Medium, High)
- [ ] Clicking a card selects it (visual feedback)
- [ ] Only one card can be selected at a time
- [ ] "Back" button returns to Step 2
- [ ] "Next" button proceeds to Step 4

### Triage Form - Step 4 (Image Upload)
- [ ] File input is visible
- [ ] Can select an image file
- [ ] Image preview shows after selection
- [ ] File size validation works (max 5MB)
- [ ] File type validation works (JPEG, PNG, WebP only)
- [ ] "Remove" button clears selected image
- [ ] "Skip" button proceeds without image
- [ ] "Back" button returns to Step 3
- [ ] "Next" button proceeds to Review

### Review & Submit
- [ ] All entered data displays correctly
- [ ] Basic info section shows name and age
- [ ] Symptoms section shows full text
- [ ] Pain level displays correctly
- [ ] Image preview shows (if uploaded)
- [ ] "Edit" buttons work for each section
- [ ] "Submit" button shows loading state
- [ ] Form submits successfully

### Success Screen
- [ ] Success message displays with patient name
- [ ] "Submit Another Case" button resets form
- [ ] "Return to Home" button goes to landing page

### Data Verification
- [ ] Open Supabase dashboard
- [ ] Check patients table has new record
- [ ] Verify all fields are correct (name, age, symptoms, pain_level, risk_level)
- [ ] Check image URL is valid (if uploaded)
- [ ] Verify risk_level was calculated correctly
- [ ] Check treated is false by default
- [ ] Verify created_at timestamp is correct

## Doctor Dashboard Testing

### Patient List
- [ ] Dashboard loads without errors
- [ ] Patient list displays
- [ ] Patients are sorted by risk level (Critical, Medium, Low)
- [ ] Within each risk level, newest patients appear first
- [ ] Patient cards show: name, age, risk badge, treated status
- [ ] Risk badges have correct colors (Critical=red, Medium=orange, Low=green)
- [ ] Relative timestamps show (e.g., "5 minutes ago")

### Filtering
- [ ] "All" filter shows all patients
- [ ] "Untreated" filter shows only untreated patients
- [ ] "Treated" filter shows only treated patients
- [ ] Filter state persists when switching between filters
- [ ] Patient count updates based on filter

### Patient Detail View
- [ ] Clicking a patient card opens detail modal
- [ ] Modal displays all patient information
- [ ] Name, age, and risk badge show in header
- [ ] Symptoms display in full
- [ ] Pain level displays correctly
- [ ] Image displays (if uploaded, max 800px width)
- [ ] Submission timestamp shows in readable format
- [ ] Treatment status displays correctly
- [ ] Close button (X) closes modal

### Treatment Status Updates
- [ ] "Mark as Treated" button shows when patient is untreated
- [ ] Clicking "Mark as Treated" updates status
- [ ] Button shows loading state during update
- [ ] Status updates in UI after successful update
- [ ] "Mark as Not Treated" button shows when patient is treated
- [ ] Clicking "Mark as Not Treated" updates status
- [ ] Changes persist after closing and reopening modal

### Real-time Updates
- [ ] Open dashboard in two browser tabs
- [ ] Submit a new patient in Tab 1 (patient interface)
- [ ] Verify new patient appears in Tab 2 (dashboard) within 3 seconds
- [ ] Mark patient as treated in Tab 2
- [ ] Verify status updates in both tabs
- [ ] Check sorting is maintained after updates

## Responsive Design Testing

### Mobile (< 768px)
- [ ] Test on actual mobile device or Chrome DevTools
- [ ] Landing page is readable and buttons are tappable
- [ ] Triage form fields stack vertically
- [ ] Pain level cards stack vertically
- [ ] Patient cards display in single column
- [ ] Patient detail modal is full-screen
- [ ] All interactive elements are at least 44x44px
- [ ] Text is readable (min 14px font size)

### Tablet (768px - 1023px)
- [ ] Patient cards display in 2 columns
- [ ] Form layout is appropriate
- [ ] Modal has max-width 600px

### Desktop (1024px+)
- [ ] Patient cards display in 3 columns
- [ ] Modal has max-width 800px
- [ ] Hover effects work on cards and buttons

## Cross-Browser Testing

### Chrome (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Firefox (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Safari (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct
- [ ] Image upload works

### Edge (Latest)
- [ ] All features work
- [ ] No console errors
- [ ] Styling is correct

### Mobile Safari (iOS)
- [ ] All features work
- [ ] Touch interactions work
- [ ] Image upload works
- [ ] No layout issues

### Mobile Chrome (Android)
- [ ] All features work
- [ ] Touch interactions work
- [ ] Image upload works
- [ ] No layout issues

## Performance Testing

### Lighthouse Audit
- [ ] Run Lighthouse in Chrome DevTools
- [ ] Performance score: 90+ (target)
- [ ] Accessibility score: 90+ (target)
- [ ] Best Practices score: 90+ (target)
- [ ] SEO score: 90+ (target)

### Load Times
- [ ] Initial page load < 3 seconds
- [ ] Patient list loads < 2 seconds
- [ ] Form submission completes < 3 seconds
- [ ] Image upload completes < 5 seconds (for 5MB file)

### Bundle Size
- [ ] Total JS bundle < 500KB gzipped
- [ ] No unnecessary dependencies loaded
- [ ] Code splitting is working (check Network tab)

## Error Handling Testing

### Network Errors
- [ ] Disconnect internet
- [ ] Try to submit form - error message shows
- [ ] Try to load dashboard - error message shows
- [ ] Reconnect internet
- [ ] Retry button works

### Validation Errors
- [ ] Submit form with invalid name (< 2 chars) - error shows
- [ ] Submit form with invalid age (< 0 or > 150) - error shows
- [ ] Submit form with short symptoms (< 10 chars) - error shows
- [ ] Upload file > 5MB - error shows
- [ ] Upload invalid file type - error shows

### Supabase Errors
- [ ] Test with invalid Supabase URL - error message shows
- [ ] Test with invalid anon key - error message shows

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Enter key submits forms
- [ ] Escape key closes modals
- [ ] Arrow keys work for pain level selection

### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] All buttons have descriptive labels
- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Modal title is announced when opened

### Color Contrast
- [ ] Text has sufficient contrast (4.5:1 minimum)
- [ ] Risk badges are readable
- [ ] Button text is readable
- [ ] Error messages are readable

## Security Testing

### HTTPS
- [ ] All requests use HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificate is valid

### Input Sanitization
- [ ] Try entering HTML in form fields - displays as text, not rendered
- [ ] Try entering JavaScript in form fields - displays as text, not executed
- [ ] Try entering SQL in form fields - no errors, stored safely

### Environment Variables
- [ ] Check browser DevTools - no secrets exposed in client code
- [ ] Verify anon key is used (not service_role key)

## Monitoring Setup (Optional)

- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Analytics configured (Google Analytics, Plausible, etc.)
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom, etc.)

## Documentation

- [ ] README.md is up to date
- [ ] DEPLOYMENT.md has correct instructions
- [ ] Environment variables are documented
- [ ] Supabase setup instructions are clear

## Final Verification

- [ ] All critical features work end-to-end
- [ ] No console errors in production
- [ ] No broken links or 404 errors
- [ ] Application is usable on mobile and desktop
- [ ] Performance is acceptable
- [ ] Accessibility is acceptable

## Sign-off

**Tested by**: ___________________________

**Date**: ___________________________

**Deployment URL**: ___________________________

**Notes**: 
___________________________
___________________________
___________________________

## Issues Found

List any issues discovered during testing:

1. 
2. 
3. 

## Next Steps

After completing this checklist:

1. Document any issues found
2. Fix critical issues before announcing launch
3. Create tickets for non-critical issues
4. Set up monitoring and alerts
5. Plan for ongoing maintenance
6. Consider implementing authentication for doctor dashboard
7. Consider enabling Row Level Security in Supabase
8. Plan for scaling if needed
