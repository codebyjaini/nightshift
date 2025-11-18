# Design Document

## Overview

This design implements a patient deletion feature for the doctor dashboard, allowing doctors to permanently remove patient records from the system. The implementation follows the existing architecture patterns in the codebase, utilizing the Supabase backend, centralized error handling, and real-time updates.

The deletion feature will be integrated into the existing patient detail modal with a confirmation dialog to prevent accidental deletions. The implementation prioritizes user safety through confirmation prompts, clear visual feedback, and proper error handling.

## Architecture

The patient deletion feature follows a three-layer architecture consistent with the existing codebase:

1. **Service Layer** (`patientService.js`): Handles database operations via Supabase
2. **Component Layer** (`DoctorDashboard.tsx`, `PatientDetail.jsx`): Manages UI state and user interactions
3. **Utility Layer** (`errorHandler.js`): Provides centralized error handling
4. **Authentication Layer**: Supabase handles authentication and Row Level Security (RLS) policies

**Design Rationale**: This architecture maintains consistency with the existing codebase patterns (as seen in `updateTreatmentStatus` and `markPatientContacted`), ensuring maintainability and reducing cognitive load for developers.

### Data Flow

```
User clicks delete → Confirmation dialog → User confirms → 
DoctorDashboard calls deletePatient → patientService executes DELETE → 
Supabase verifies authentication & RLS policies → 
Database processes deletion → Response returned → 
UI shows success confirmation → Modal closes → 
Real-time subscription propagates changes to all connected clients
```

### Authentication & Authorization

**Design Decision**: Leverage Supabase's built-in authentication and Row Level Security (RLS) rather than implementing custom authorization logic.

- **Authentication Verification**: Supabase automatically includes the authenticated user's JWT token with all requests. If the token is missing or invalid, Supabase returns a 401 error.
- **Authorization**: RLS policies on the `patients` table enforce that only authenticated doctors can delete records. This is handled at the database level, not in application code.
- **Error Handling**: Authentication and permission errors are caught by the service layer and returned with appropriate user-friendly messages.

**Rationale**: Database-level security is more robust than application-level checks, as it prevents unauthorized access even if the application layer is compromised.

## Components and Interfaces

### 1. Patient Service Extension

Add a new `deletePatient` function to `src/services/patientService.js`:

```javascript
/**
 * Delete a patient record permanently
 * @param {string} patientId - Patient UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const deletePatient = async (patientId)
```


**Function Signature:**
- Input: `patientId` (string) - UUID of the patient to delete
- Output: Promise resolving to `{data, error}` object
  - On success: `{data: {id: string}, error: null}`
  - On failure: `{data: null, error: {message, userMessage, canRetry}}`

**Implementation Details:**
- Uses Supabase `.delete()` method on the `patients` table
- Filters by patient ID using `.eq('id', patientId)`
- Returns the deleted record ID on success
- Wraps errors using the existing `handleError` utility
- Follows the same error handling pattern as other service functions

### 2. Doctor Dashboard State Management

Extend `src/pages/DoctorDashboard.tsx` with deletion state:

```typescript
const [deleteLoading, setDeleteLoading] = useState(false)
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
const [deleteError, setDeleteError] = useState<string | null>(null)
const [showDeleteSuccess, setShowDeleteSuccess] = useState(false)
```

**New Handler Functions:**

1. `handleDeleteClick()` - Opens confirmation dialog, resets error state
2. `handleDeleteConfirm()` - Executes deletion after confirmation
   - Sets `deleteLoading` to true
   - Calls `deletePatient` service function
   - On success: Shows success confirmation briefly, then closes modal
   - On error: Displays error message with retry option
   - Sets `deleteLoading` to false
3. `handleDeleteCancel()` - Closes confirmation dialog, resets state
4. `handleDeleteRetry()` - Retries deletion after error (calls `handleDeleteConfirm` again)

**State Management Rationale**: Separate loading states for different operations (treatment, contact, deletion) prevent UI conflicts and provide clear feedback for each action.

### 3. Patient Detail Component Updates

Modify `src/components/doctor/PatientDetail.jsx` to include:

- Delete button in the action button group (positioned after other action buttons)
- Props for delete handler and loading state
- Visual styling consistent with existing buttons
- Disabled state during any loading operation (treatment, contact, or deletion)

**New Props:**
```javascript
{
  onDelete: Function,        // Handler for delete button click
  deleteLoading: boolean,    // Loading state for delete operation
  deleteError: string | null // Error message to display
}
```

**Design Rationale**: Adding the delete button to the existing action group maintains UI consistency and keeps all patient actions in one location.

### 4. Confirmation Dialog Component

Use the existing `Modal` component with custom confirmation content (nested modal pattern):

**Dialog Content:**
- Warning icon (⚠️ or AlertTriangle from lucide-react)
- Confirmation message: "Are you sure you want to delete this patient record?"
- Patient name display for verification: "Patient: [Name]"
- Warning text: "This action cannot be undone."
- "Cancel" and "Delete" buttons
- Delete button styled as destructive action (red background, `bg-risk-critical`)
- Loading spinner on Delete button during deletion

**Modal Behavior:**
- Appears on top of the patient detail modal
- Cannot be closed by clicking outside or pressing Escape while deletion is in progress
- Closes automatically on cancel or after successful deletion

**Design Rationale**: Reusing the existing Modal component reduces code duplication and maintains consistent modal behavior across the application.

### 5. Success Confirmation

After successful deletion, show a brief success message before closing the modal:

**Success Display:**
- Green checkmark icon
- Message: "Patient record deleted successfully"
- Auto-dismiss after 1.5 seconds
- Then close both modals and refresh patient list

**Design Rationale**: Brief success confirmation provides closure to the user action without requiring additional interaction, following common UX patterns.



## Data Models

### Patient Record (Existing)

The patient record structure remains unchanged. The deletion operation removes the entire record:

```typescript
interface Patient {
  id: string              // UUID
  name: string
  age: number
  phone: string
  symptoms: string
  pain_level: 'Low' | 'Medium' | 'High'
  risk_level: 'Low' | 'Medium' | 'Critical'
  image: string | null
  treated: boolean
  contacted: boolean
  contacted_at: string | null
  created_at: string
}
```

### Delete Response

```typescript
interface DeleteResponse {
  data: { id: string } | null
  error: {
    message: string
    userMessage: string
    canRetry: boolean
  } | null
}
```



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

After analyzing the acceptance criteria, I've identified redundancies and consolidated the properties. Properties 1.3, 2.4, 4.2, 5.1, and 5.3 all test the same core behavior (deletion removes records), so they've been combined into Properties 1 and 2. Properties 1.2 and 2.1 both test confirmation dialog appearance, combined into Property 7. Properties 2.5 and 6.5 both test button disabling, combined into Property 10. Properties 1.5 and 6.3 both test error display, combined into Property 4. Properties about authentication (3.1-3.3) are handled by Supabase's authentication layer and RLS policies, not testable at the application level.

### Core Deletion Properties

**Property 1: Deletion removes record from database**
*For any* valid patient record in the database, when deletePatient is called with that patient's ID, the patient record should no longer exist in the database.
**Validates: Requirements 1.3, 2.4, 4.2**

**Property 2: Deletion removes patient from UI list**
*For any* patient displayed in the patient list, when that patient is deleted, the patient should no longer appear in the displayed list.
**Validates: Requirements 1.4, 5.1, 5.3**

**Property 3: Successful deletion returns proper response structure**
*For any* successful deletion operation, the response should contain data with the deleted patient ID and no error object.
**Validates: Requirements 4.3**

**Property 4: Failed deletion returns error with user message**
*For any* failed deletion operation, the response should contain null data and an error object with userMessage and canRetry fields.
**Validates: Requirements 1.5, 4.4, 6.3**

**Property 5: Invalid ID deletion handles errors gracefully**
*For any* invalid patient ID (non-existent, malformed, or null), calling deletePatient should return an error response without throwing exceptions.
**Validates: Requirements 4.5**

**Property 6: Permission errors return clear error messages**
*For any* deletion operation that fails due to insufficient permissions, the error response should contain a user-friendly message explaining the permission issue.
**Validates: Requirements 3.4**

### UI Interaction Properties

**Property 7: Delete button triggers confirmation dialog**
*For any* patient record, when the delete button is clicked, a confirmation dialog should appear before any deletion occurs.
**Validates: Requirements 1.2, 2.1**

**Property 8: Confirmation dialog displays patient name**
*For any* patient record, when the delete confirmation dialog is shown, the dialog content should include that patient's name.
**Validates: Requirements 2.2**

**Property 9: Canceling deletion preserves patient record**
*For any* patient record, when deletion is initiated but then canceled, the patient record should remain unchanged in the database and UI.
**Validates: Requirements 2.3**

**Property 10: Delete button disabled during deletion**
*For any* deletion operation in progress, the delete button should be in a disabled state until the operation completes.
**Validates: Requirements 2.5, 6.5**

**Property 11: Deletion closes patient detail modal**
*For any* patient with an open detail modal, when that patient is successfully deleted, the modal should close automatically.
**Validates: Requirements 5.2**

**Property 12: Loading indicator shown during deletion**
*For any* deletion operation in progress, a loading indicator should be visible on the delete button.
**Validates: Requirements 6.1**

**Property 13: Success confirmation displayed after deletion**
*For any* successful deletion operation, a visual success confirmation should be displayed before the modal closes.
**Validates: Requirements 6.2**

**Property 14: Error display includes retry option**
*For any* deletion failure where retry is possible (canRetry is true), the error display should include a retry button.
**Validates: Requirements 6.4**

**Property 15: Real-time deletions update UI**
*For any* patient deletion performed by another user, when the real-time subscription receives the delete event, the patient should be removed from the local UI immediately.
**Validates: Requirements 5.4**



## Testing Strategy

The patient deletion feature will be tested using a dual testing approach that combines unit tests and property-based tests to ensure comprehensive coverage.

### Unit Testing

Unit tests will verify specific examples, edge cases, and integration points:

**Service Layer Tests** (`patientService.test.js`):
- Test `deletePatient` function exists and is exported
- Test successful deletion with a valid patient ID
- Test deletion with non-existent patient ID returns appropriate error
- Test deletion with null/undefined ID returns appropriate error
- Test error response structure matches expected format

**Component Tests**:
- Test delete button renders in PatientDetail component
- Test confirmation dialog appears when delete button is clicked
- Test confirmation dialog displays correct patient name
- Test cancel button closes dialog without deletion
- Test modal closes after successful deletion

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** (JavaScript property-based testing library). Each property-based test will run a minimum of 100 iterations to ensure thorough coverage.

**Configuration**:
```javascript
import fc from 'fast-check'

// Each test will use: fc.assert(property, { numRuns: 100 })
```

**Property Test Tags**:
Each property-based test will include a comment tag explicitly referencing the correctness property from this design document:
```javascript
// Feature: patient-deletion, Property 1: Deletion removes record from database
```

**Test Coverage**:
- Property 1: Generate random patient records, delete them, verify they're removed from database
- Property 2: Generate random patient lists, delete patients, verify UI list updates
- Property 3: Generate random successful deletions, verify response structure
- Property 4: Generate random failure scenarios, verify error response structure
- Property 5: Generate random invalid IDs (null, malformed, non-existent), verify graceful error handling
- Property 6: Generate random permission errors, verify user-friendly error messages
- Property 7-15: Generate random UI interactions, verify correct behavior

**Generators**:
Custom generators will be created for:
- Valid patient records (with realistic data)
- Invalid patient IDs (null, undefined, malformed UUIDs, non-existent IDs)
- Error responses (with various error types)
- UI states (loading, error, success)

### Integration Testing

Integration tests will verify the complete deletion flow:
- End-to-end deletion from button click to database removal
- Real-time synchronization when another user deletes a patient
- Error handling across all layers (UI → Service → Database)

**Design Rationale**: The dual testing approach ensures both concrete bugs (unit tests) and general correctness (property tests) are caught. Property-based testing is particularly valuable for deletion operations, as it can uncover edge cases with invalid IDs, concurrent deletions, and error handling that might be missed by example-based tests.

## Error Handling

The deletion feature follows the existing error handling patterns established in the codebase:

### Service Layer Error Handling

1. **Network Errors**: Caught and wrapped with user-friendly message "Unable to connect to the server"
2. **Database Errors**: Supabase errors are caught and processed through `handleError` utility
3. **Permission Errors**: Handled by Supabase RLS policies, returned as database errors
4. **Invalid Input**: Gracefully handled with appropriate error messages

### Error Response Structure

All errors follow the consistent pattern:
```javascript
{
  data: null,
  error: {
    message: string,        // Technical error message
    userMessage: string,    // User-friendly message
    canRetry: boolean      // Whether operation can be retried
  }
}
```

### UI Error Display

- Errors displayed in the confirmation dialog (not the patient detail modal)
- Error messages styled with red background (`bg-risk-critical/10`)
- Retry button shown for retryable errors (when `canRetry` is true)
- Cancel button always available to abort the operation
- Confirmation dialog remains open on error to allow retry or cancellation
- Patient detail modal remains open behind the confirmation dialog

**Design Rationale**: Displaying errors in the confirmation dialog keeps the error context close to the action that caused it, improving user understanding.

### Error Scenarios

1. **Patient Not Found**: "Patient record not found. It may have been deleted by another user."
   - `canRetry`: false
   - Action: Show "Close" button only
2. **Network Failure**: "Unable to connect to the server. Please check your internet connection."
   - `canRetry`: true
   - Action: Show "Retry" and "Cancel" buttons
3. **Permission Denied**: "You don't have permission to delete this patient record. Please ensure you're logged in as a doctor."
   - `canRetry`: false
   - Action: Show "Close" button only
4. **Database Error**: "Failed to delete patient record. Please try again."
   - `canRetry`: true
   - Action: Show "Retry" and "Cancel" buttons
5. **Unknown Error**: "An unexpected error occurred. Please try again."
   - `canRetry`: true
   - Action: Show "Retry" and "Cancel" buttons

### Real-Time Synchronization

The existing real-time subscription (`useRealtimePatients` hook) automatically handles deletions made by other users:

- When another doctor deletes a patient, the subscription receives a `DELETE` event
- The hook removes the patient from the local state
- The UI updates automatically to reflect the deletion
- If the deleted patient's detail modal is open, it should close automatically

**Implementation Note**: Add logic to `DoctorDashboard.tsx` to detect when `selectedPatient` is no longer in the `patients` array and close the modal accordingly.

**Design Rationale**: Leveraging the existing real-time infrastructure ensures consistency across all real-time features and reduces implementation complexity.

