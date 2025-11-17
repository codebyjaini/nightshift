# Design Document: Patient Contact Feature

## Overview

This document outlines the technical design for implementing a patient contact management system in the NightShift MD doctor dashboard. The feature enables doctors to call patients directly and track contact history through an intuitive UI with backend persistence.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Doctor Dashboard UI                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PatientCard  │  │PatientDetail │  │  Badge       │      │
│  │  Component   │  │  Component   │  │  Component   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────────────┘      │
│         │                  │                                 │
└─────────┼──────────────────┼─────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           patientService.js                          │   │
│  │  - markPatientContacted(patientId, doctorId)        │   │
│  │  - getPatients(filter)                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  patients table  │      │ contact_history  │            │
│  │  + contacted     │◄─────┤     table        │            │
│  │  + contacted_at  │  FK  │                  │            │
│  └──────────────────┘      └──────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Database Schema Changes

#### patients Table (Modifications)
```sql
ALTER TABLE patients
ADD COLUMN contacted BOOLEAN DEFAULT false,
ADD COLUMN contacted_at TIMESTAMP WITH TIME ZONE;

-- Add index for performance
CREATE INDEX idx_patients_contacted ON patients(contacted);
```

#### contact_history Table (New)
```sql
CREATE TABLE contact_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL,
  contacted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT fk_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id)
    ON DELETE CASCADE
);

-- Add indexes for performance
CREATE INDEX idx_contact_history_patient_id ON contact_history(patient_id);
CREATE INDEX idx_contact_history_doctor_id ON contact_history(doctor_id);
CREATE INDEX idx_contact_history_contacted_at ON contact_history(contacted_at DESC);
```

### 2. Service Layer

#### patientService.js - New Function

```javascript
/**
 * Mark patient as contacted and log to contact history
 * @param {string} patientId - Patient UUID
 * @param {string} doctorId - Doctor UUID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const markPatientContacted = async (patientId, doctorId) => {
  try {
    // Start a transaction-like operation
    const now = new Date().toISOString();
    
    // 1. Update patients table
    const { data: patientData, error: patientError } = await supabase
      .from('patients')
      .update({ 
        contacted: true, 
        contacted_at: now 
      })
      .eq('id', patientId)
      .select()
      .single();

    if (patientError) {
      const errorInfo = handleError(patientError, 'mark patient as contacted');
      return { 
        data: null, 
        error: { 
          ...patientError, 
          userMessage: errorInfo.message, 
          canRetry: errorInfo.canRetry 
        } 
      };
    }

    // 2. Insert into contact_history
    const { error: historyError } = await supabase
      .from('contact_history')
      .insert([{
        patient_id: patientId,
        doctor_id: doctorId,
        contacted_at: now
      }]);

    if (historyError) {
      console.error('Failed to log contact history:', historyError);
      // Don't fail the entire operation if history logging fails
      // The patient is still marked as contacted
    }

    return { data: patientData, error: null };
  } catch (error) {
    const errorInfo = handleError(error, 'mark patient as contacted');
    return { 
      data: null, 
      error: { 
        message: errorInfo.message, 
        canRetry: errorInfo.canRetry 
      } 
    };
  }
};
```

### 3. UI Components

#### PatientCard Component Updates

**New Props:**
- No new props needed (patient object already contains all data)

**UI Changes:**
```jsx
// Add phone display and call button
<div className="flex items-center gap-2 mb-2">
  <Phone className="w-4 h-4 text-accent-cyan" />
  <a 
    href={`tel:${patient.phone}`}
    className="text-sm text-accent-cyan hover:text-accent-teal transition-colors"
    onClick={(e) => e.stopPropagation()}
  >
    {patient.phone}
  </a>
</div>

// Add contact status badge
<Badge
  variant={patient.contacted ? 'success' : 'warning'}
  size="sm"
>
  {patient.contacted ? 'Contacted' : 'Pending'}
</Badge>
```

#### PatientDetail Component Updates

**New Props:**
```typescript
interface PatientDetailProps {
  patient: Patient;
  onMarkTreated: () => void;
  onMarkNotTreated: () => void;
  onMarkContacted: () => void;  // NEW
  onClose: () => void;
  loading: boolean;
  contactLoading: boolean;  // NEW
}
```

**UI Changes:**
```jsx
// Add call button section
<section aria-labelledby="contact-heading">
  <h4 id="contact-heading" className="text-lg font-semibold text-text-primary mb-2">
    Contact Information
  </h4>
  <div className="flex items-center gap-3">
    <a
      href={`tel:${patient.phone}`}
      className="inline-flex items-center gap-2 px-4 py-2 bg-accent-cyan hover:bg-accent-teal text-white rounded-lg transition-colors"
    >
      <Phone className="w-4 h-4" />
      Call Now
    </a>
    <span className="text-text-secondary">{patient.phone}</span>
  </div>
</section>

// Add mark as contacted button (only if not contacted)
{!patient.contacted && (
  <Button
    variant="secondary"
    onClick={onMarkContacted}
    disabled={contactLoading}
    loading={contactLoading}
    className="flex-1"
  >
    <Check className="w-4 h-4 mr-2" />
    Mark as Contacted
  </Button>
)}
```

#### Badge Component Updates

**New Variants:**
```javascript
// Add to Badge.jsx variant mapping
const variantStyles = {
  // ... existing variants
  success: 'bg-green-500/10 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
};
```

### 4. Dashboard Integration

#### DoctorDashboard.tsx Updates

**New State:**
```typescript
const [contactLoading, setContactLoading] = useState<string | null>(null);
```

**New Handler:**
```typescript
const handleMarkContacted = async (patientId: string) => {
  setContactLoading(patientId);
  
  // TODO: Get actual doctor ID from auth context
  const doctorId = 'temp-doctor-id';
  
  const { data, error } = await patientService.markPatientContacted(
    patientId, 
    doctorId
  );
  
  if (error) {
    console.error('Failed to mark patient as contacted:', error);
    // Show error toast/notification
  } else {
    // Update local state or refetch patients
    // Real-time subscription will handle the update
  }
  
  setContactLoading(null);
};
```

## Data Models

### Patient Model (Extended)
```typescript
interface Patient {
  id: string;
  name: string;
  age: number;
  phone: string;  // Existing field
  symptoms: string;
  pain_level: 'Low' | 'Medium' | 'High';
  risk_level: 'Low' | 'Medium' | 'Critical';
  image: string | null;
  treated: boolean;
  contacted: boolean;  // NEW
  contacted_at: string | null;  // NEW
  created_at: string;
}
```

### ContactHistory Model (New)
```typescript
interface ContactHistory {
  id: string;
  patient_id: string;
  doctor_id: string;
  contacted_at: string;
}
```

## Error Handling

### Service Layer Error Handling
- Use existing `handleError` utility for consistent error messages
- Gracefully handle contact history logging failures (don't block main operation)
- Return meaningful error messages for UI display

### UI Error Handling
- Show loading states during contact status updates
- Display error notifications if marking as contacted fails
- Disable buttons during loading to prevent duplicate requests
- Maintain existing error handling patterns

## Testing Strategy

### Unit Tests
1. **patientService.markPatientContacted**
   - Test successful contact marking
   - Test database update failure
   - Test contact history logging failure
   - Test error handling

### Integration Tests
2. **PatientCard Component**
   - Test phone number display
   - Test call button functionality
   - Test contact badge rendering (contacted vs pending)

3. **PatientDetail Component**
   - Test call button click
   - Test mark as contacted button
   - Test button disabled states
   - Test conditional rendering (hide button when contacted)

### Manual Testing
4. **End-to-End Flow**
   - Doctor views patient list
   - Doctor clicks call button (verify tel: link works)
   - Doctor marks patient as contacted
   - Verify badge updates to "Contacted" (green)
   - Verify button disappears after marking
   - Verify database records are created correctly

## Migration Plan

### Phase 1: Database Setup
1. Create SQL migration file for schema changes
2. Run migration on development database
3. Verify tables and columns created correctly

### Phase 2: Service Layer
1. Add `markPatientContacted` function to patientService
2. Export function in service module
3. Test function with mock data

### Phase 3: UI Components
1. Update Badge component with new variants
2. Update PatientCard with phone display and contact badge
3. Update PatientDetail with call button and mark contacted button
4. Update DoctorDashboard with new handler

### Phase 4: Testing & Validation
1. Test all components individually
2. Test integration with real Supabase instance
3. Verify real-time updates work correctly
4. Test error scenarios

## Security Considerations

1. **Doctor Authentication**: Ensure doctor ID is obtained from authenticated session
2. **Authorization**: Verify doctor has permission to mark patients as contacted
3. **Data Validation**: Validate patient ID and doctor ID before database operations
4. **SQL Injection**: Use parameterized queries (Supabase handles this)
5. **Phone Number Privacy**: Consider masking phone numbers in certain views

## Performance Considerations

1. **Database Indexes**: Add indexes on `contacted` and `contacted_at` columns
2. **Real-time Updates**: Existing subscription will handle contact status updates
3. **Batch Operations**: If marking multiple patients, consider batch update API
4. **Query Optimization**: Use `.select()` to fetch only needed fields

## Accessibility

1. **ARIA Labels**: Add descriptive labels for call buttons and contact badges
2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
3. **Screen Readers**: Provide meaningful text for status changes
4. **Color Contrast**: Ensure badge colors meet WCAG AA standards
5. **Focus Management**: Maintain focus after marking as contacted

## Future Enhancements

1. **Contact Notes**: Allow doctors to add notes when marking as contacted
2. **Contact History View**: Display full contact history for each patient
3. **Multiple Contact Methods**: Add email, SMS options
4. **Automated Reminders**: Remind doctors to contact high-risk patients
5. **Analytics Dashboard**: Track contact response times and patterns
