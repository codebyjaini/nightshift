# Implementation Plan

- [x] 1. Implement deletePatient service function





  - Add `deletePatient` function to `src/services/patientService.js`
  - Use Supabase `.delete()` method on patients table with `.eq('id', patientId)`
  - Return `{data: {id}, error: null}` on success
  - Wrap errors using `handleError` utility
  - Follow same error handling pattern as existing service functions
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ]* 1.1 Write property test for deletePatient with valid IDs
  - **Property 1: Deletion removes record from database**
  - **Validates: Requirements 1.3, 2.4, 4.2**

- [ ]* 1.2 Write property test for deletePatient response structure
  - **Property 3: Successful deletion returns proper response structure**
  - **Validates: Requirements 4.3**

- [ ]* 1.3 Write property test for deletePatient error handling
  - **Property 4: Failed deletion returns error with user message**
  - **Property 5: Invalid ID deletion handles errors gracefully**
  - **Property 6: Permission errors return clear error messages**
  - **Validates: Requirements 1.5, 4.4, 4.5, 3.4**

- [ ]* 1.4 Write unit tests for deletePatient service
  - Test function exists and is exported
  - Test successful deletion with valid patient ID
  - Test deletion with non-existent patient ID
  - Test deletion with null/undefined ID
  - Test error response structure
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2. Add delete button to PatientDetail component





  - Add delete button to action button group in `src/components/doctor/PatientDetail.jsx`
  - Add props: `onDelete`, `deleteLoading`
  - Style button consistently with existing buttons
  - Disable button during any loading operation (treatment, contact, or deletion)
  - Position button after other action buttons
  - _Requirements: 1.1_


- [x] 3. Implement confirmation dialog in DoctorDashboard




  - Add state variables to `src/pages/DoctorDashboard.tsx`: `deleteLoading`, `showDeleteConfirm`, `deleteError`, `showDeleteSuccess`
  - Create `handleDeleteClick` function to open confirmation dialog
  - Create nested Modal component for confirmation dialog
  - Display warning icon, confirmation message, patient name, and "This action cannot be undone" warning
  - Add "Cancel" and "Delete" buttons (Delete button styled with `bg-risk-critical`)
  - Prevent modal close during deletion (disable outside click and Escape key)
  - _Requirements: 1.2, 2.1, 2.2_

- [ ]* 3.1 Write property test for confirmation dialog behavior
  - **Property 7: Delete button triggers confirmation dialog**
  - **Property 8: Confirmation dialog displays patient name**
  - **Validates: Requirements 1.2, 2.1, 2.2**

- [x] 4. Implement deletion logic in DoctorDashboard




  - Create `handleDeleteConfirm` function in `src/pages/DoctorDashboard.tsx`
  - Set `deleteLoading` to true before calling `deletePatient`
  - Call `deletePatient` service function with patient ID
  - On success: Show success confirmation, wait 1.5 seconds, close modals
  - On error: Display error message in confirmation dialog with retry option
  - Set `deleteLoading` to false after operation completes
  - _Requirements: 1.3, 2.4, 6.1_

- [ ] 5. Implement cancel and retry handlers
  - Create `handleDeleteCancel` function to close confirmation dialog and reset state
  - Create `handleDeleteRetry` function to retry deletion after error
  - Ensure cancel preserves patient record in database and UI
  - _Requirements: 2.3, 6.4_

- [ ]* 5.1 Write property test for cancel behavior
  - **Property 9: Canceling deletion preserves patient record**
  - **Validates: Requirements 2.3**

- [ ] 6. Implement success confirmation display
  - Show green checkmark icon and "Patient record deleted successfully" message
  - Auto-dismiss after 1.5 seconds
  - Close both confirmation dialog and patient detail modal
  - _Requirements: 6.2_

- [ ]* 6.1 Write property test for success confirmation
  - **Property 13: Success confirmation displayed after deletion**
  - **Validates: Requirements 6.2**

- [ ] 7. Implement error display with retry option
  - Display errors in confirmation dialog with red background (`bg-risk-critical/10`)
  - Show "Retry" button when `canRetry` is true
  - Show "Close" button when `canRetry` is false
  - Always show "Cancel" button to abort operation
  - Keep confirmation dialog open on error
  - _Requirements: 1.5, 6.3, 6.4_

- [ ]* 7.1 Write property test for error display
  - **Property 14: Error display includes retry option**
  - **Validates: Requirements 6.4**

- [ ] 8. Implement UI state management during deletion
  - Disable delete button while `deleteLoading` is true
  - Show loading spinner on delete button during deletion
  - Prevent modal close during deletion
  - Disable all action buttons during deletion
  - _Requirements: 2.5, 6.1, 6.5_

- [ ]* 8.1 Write property test for button state during deletion
  - **Property 10: Delete button disabled during deletion**
  - **Property 12: Loading indicator shown during deletion**
  - **Validates: Requirements 2.5, 6.1, 6.5**

- [ ] 9. Implement automatic UI updates after deletion
  - Ensure patient is removed from displayed list after successful deletion
  - Close patient detail modal automatically after deletion
  - Leverage existing `useRealtimePatients` hook for real-time updates
  - _Requirements: 1.4, 5.1, 5.2, 5.3_

- [ ]* 9.1 Write property test for UI updates
  - **Property 2: Deletion removes patient from UI list**
  - **Property 11: Deletion closes patient detail modal**
  - **Validates: Requirements 1.4, 5.1, 5.2, 5.3**

- [ ] 10. Implement real-time synchronization for deletions by other users
  - Add logic to `DoctorDashboard.tsx` to detect when `selectedPatient` is no longer in `patients` array
  - Close patient detail modal automatically when selected patient is deleted by another user
  - Ensure UI updates immediately when real-time subscription receives DELETE event
  - _Requirements: 5.4_

- [ ]* 10.1 Write property test for real-time deletion updates
  - **Property 15: Real-time deletions update UI**
  - **Validates: Requirements 5.4**

- [ ] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
