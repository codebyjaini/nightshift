# Requirements Document

## Introduction

NightShift MD is an emergency triage system designed to streamline patient intake and doctor monitoring in emergency care settings. The system consists of two primary interfaces: a patient-facing triage form for symptom submission and a doctor dashboard for case monitoring and treatment management. The application uses React for the frontend, Tailwind CSS for styling, and Supabase for backend data management.

## Glossary

- **Patient Interface**: The web-based form system where patients enter their medical information
- **Doctor Dashboard**: The administrative interface where medical staff view and manage patient cases
- **Triage System**: The automated risk assessment mechanism that categorizes patient urgency
- **Risk Level**: A classification (Low, Medium, Critical) assigned to each patient based on symptoms and pain level
- **Treatment Status**: A boolean flag indicating whether a patient case has been addressed by medical staff
- **Supabase**: The backend-as-a-service platform providing database, authentication, and storage
- **Patient Record**: A complete data entry in the patients table containing all submitted information
- **Real-time Sync**: The automatic update mechanism that reflects database changes in the UI without manual refresh

## Requirements

### Requirement 1: Patient Information Collection

**User Story:** As a patient, I want to submit my basic information and symptoms through a multi-step form, so that medical staff can assess my condition and prioritize my care.

#### Acceptance Criteria

1. THE Patient Interface SHALL accept text input for patient name with a minimum of 2 characters and maximum of 100 characters
2. THE Patient Interface SHALL accept numeric input for patient age between 0 and 150 years
3. THE Patient Interface SHALL accept text input for symptoms with a minimum of 10 characters and maximum of 1000 characters
4. THE Patient Interface SHALL provide three selectable pain level options: "Low", "Medium", and "High"
5. THE Patient Interface SHALL allow optional image upload with file size limited to 5MB and formats restricted to JPEG, PNG, and WebP

### Requirement 2: Risk Level Assessment

**User Story:** As a triage system, I want to automatically calculate patient risk levels based on symptoms and pain indicators, so that critical cases receive immediate attention.

#### Acceptance Criteria

1. WHEN symptoms contain the keywords "chest pain", "bleeding", "severe", or "unconscious", THE Triage System SHALL assign risk level as "Critical"
2. WHEN pain level equals "High" AND symptoms do not trigger critical keywords, THE Triage System SHALL assign risk level as "Critical"
3. WHEN pain level equals "Medium" AND symptoms do not trigger critical keywords, THE Triage System SHALL assign risk level as "Medium"
4. WHEN pain level equals "Low" AND symptoms do not trigger critical keywords, THE Triage System SHALL assign risk level as "Low"
5. THE Triage System SHALL perform risk level calculation before storing the Patient Record in Supabase

### Requirement 3: Patient Data Persistence

**User Story:** As a system administrator, I want all patient submissions stored securely in Supabase, so that data is preserved and accessible to authorized medical staff.

#### Acceptance Criteria

1. WHEN a patient completes the triage form, THE Patient Interface SHALL insert a new Patient Record into the Supabase patients table
2. THE Patient Interface SHALL store the following fields: id (UUID), name (text), age (integer), symptoms (text), pain_level (text), risk_level (text), image (text), treated (boolean default false), created_at (timestamp)
3. WHEN image upload is provided, THE Patient Interface SHALL upload the file to Supabase Storage and store the public URL in the image field
4. WHEN the database insert succeeds, THE Patient Interface SHALL display a success confirmation screen
5. WHEN the database insert fails, THE Patient Interface SHALL display an error message and allow the patient to retry submission

### Requirement 4: Patient Submission Confirmation

**User Story:** As a patient, I want to receive clear confirmation after submitting my information, so that I know my case has been registered successfully.

#### Acceptance Criteria

1. WHEN Patient Record insertion succeeds, THE Patient Interface SHALL navigate to a success screen within 2 seconds
2. THE Patient Interface SHALL display the patient name and a confirmation message on the success screen
3. THE Patient Interface SHALL provide a button to submit another case on the success screen
4. THE Patient Interface SHALL clear all form data after successful submission
5. THE Patient Interface SHALL prevent duplicate submissions by disabling the submit button during processing

### Requirement 5: Doctor Dashboard Patient List

**User Story:** As a doctor, I want to view all patient cases in a prioritized list, so that I can quickly identify and address the most urgent cases first.

#### Acceptance Criteria

1. THE Doctor Dashboard SHALL fetch all Patient Records from Supabase on initial load
2. THE Doctor Dashboard SHALL sort Patient Records with "Critical" risk level first, "Medium" second, and "Low" third
3. WITHIN each risk level group, THE Doctor Dashboard SHALL sort Patient Records by created_at timestamp in descending order (newest first)
4. THE Doctor Dashboard SHALL display each Patient Record as a card showing name, age, risk level badge, and treatment status
5. THE Doctor Dashboard SHALL update the patient list within 5 seconds when new Patient Records are added to Supabase

### Requirement 6: Patient Filtering

**User Story:** As a doctor, I want to filter patients by treatment status, so that I can focus on untreated cases or review treated cases separately.

#### Acceptance Criteria

1. THE Doctor Dashboard SHALL provide a filter control with three options: "All", "Untreated", and "Treated"
2. WHEN "Untreated" filter is selected, THE Doctor Dashboard SHALL display only Patient Records where treated equals false
3. WHEN "Treated" filter is selected, THE Doctor Dashboard SHALL display only Patient Records where treated equals true
4. WHEN "All" filter is selected, THE Doctor Dashboard SHALL display all Patient Records regardless of treatment status
5. THE Doctor Dashboard SHALL maintain the selected filter state when the patient list updates

### Requirement 7: Patient Detail View

**User Story:** As a doctor, I want to view complete patient details including symptoms and uploaded images, so that I can make informed treatment decisions.

#### Acceptance Criteria

1. WHEN a doctor clicks on a patient card, THE Doctor Dashboard SHALL open a detail modal or page displaying the full Patient Record
2. THE Doctor Dashboard SHALL display all fields in the detail view: name, age, symptoms, pain level, risk level, image (if provided), treatment status, and submission timestamp
3. WHEN an image URL exists in the Patient Record, THE Doctor Dashboard SHALL render the image with a maximum width of 800 pixels
4. THE Doctor Dashboard SHALL provide a close button to exit the detail view and return to the patient list
5. THE Doctor Dashboard SHALL maintain scroll position in the patient list when returning from detail view

### Requirement 8: Treatment Status Management

**User Story:** As a doctor, I want to mark patients as treated or not treated, so that I can track which cases have been addressed and manage my workflow.

#### Acceptance Criteria

1. THE Doctor Dashboard SHALL provide a "Mark as Treated" button in the patient detail view when treated equals false
2. THE Doctor Dashboard SHALL provide a "Mark as Not Treated" button in the patient detail view when treated equals true
3. WHEN "Mark as Treated" is clicked, THE Doctor Dashboard SHALL update the Patient Record in Supabase setting treated to true
4. WHEN "Mark as Not Treated" is clicked, THE Doctor Dashboard SHALL update the Patient Record in Supabase setting treated to false
5. WHEN the treatment status update succeeds, THE Doctor Dashboard SHALL reflect the change in the UI within 2 seconds

### Requirement 9: Real-time Data Synchronization

**User Story:** As a doctor, I want the dashboard to automatically update when new patients are added or treatment statuses change, so that I always see current information without manual refresh.

#### Acceptance Criteria

1. THE Doctor Dashboard SHALL subscribe to Supabase real-time updates on the patients table
2. WHEN a new Patient Record is inserted, THE Doctor Dashboard SHALL add the new record to the patient list within 3 seconds
3. WHEN a Patient Record treatment status is updated, THE Doctor Dashboard SHALL update the corresponding card in the patient list within 3 seconds
4. THE Doctor Dashboard SHALL maintain proper sorting order after real-time updates
5. THE Doctor Dashboard SHALL provide a manual refresh button as a fallback mechanism

### Requirement 10: Responsive Mobile Design

**User Story:** As a patient or doctor using a mobile device, I want the application to be fully functional and easy to use on small screens, so that I can access the system from any device.

#### Acceptance Criteria

1. THE Patient Interface SHALL render all form elements with touch-friendly sizing (minimum 44x44 pixels) on screens below 768 pixels width
2. THE Doctor Dashboard SHALL display patient cards in a single column layout on screens below 768 pixels width
3. THE Patient Interface SHALL stack form fields vertically on screens below 768 pixels width
4. THE Doctor Dashboard SHALL render the patient detail view as a full-screen overlay on screens below 768 pixels width
5. THE Patient Interface and Doctor Dashboard SHALL maintain readability with font sizes no smaller than 14 pixels on mobile devices

### Requirement 11: Dark Theme UI

**User Story:** As a user, I want a dark-themed interface with minimal design and medical aesthetics, so that the application is comfortable to use in low-light emergency settings.

#### Acceptance Criteria

1. THE Patient Interface and Doctor Dashboard SHALL use #0A1A2F as the primary background color
2. THE Patient Interface and Doctor Dashboard SHALL use #00E5A5 as the accent color for interactive elements and highlights
3. THE Patient Interface and Doctor Dashboard SHALL use white (#FFFFFF) or light gray (#E5E7EB) text for primary content
4. THE Patient Interface and Doctor Dashboard SHALL apply border-radius of 8-12 pixels to cards and buttons
5. THE Patient Interface and Doctor Dashboard SHALL use subtle box shadows (opacity 0.1-0.2) instead of heavy glow effects

### Requirement 12: Error Handling and Loading States

**User Story:** As a user, I want clear feedback when operations are in progress or when errors occur, so that I understand the system status and can take appropriate action.

#### Acceptance Criteria

1. WHEN data is being fetched from Supabase, THE Patient Interface and Doctor Dashboard SHALL display a loading spinner or skeleton screen
2. WHEN a Supabase operation fails, THE Patient Interface and Doctor Dashboard SHALL display an error message describing the issue
3. WHEN no Patient Records exist in the database, THE Doctor Dashboard SHALL display an empty state message with instructions
4. WHEN image upload fails, THE Patient Interface SHALL display an error message and allow the user to retry or skip the upload
5. THE Patient Interface and Doctor Dashboard SHALL provide error messages with actionable guidance (e.g., "Try again" button)

### Requirement 13: Form Validation

**User Story:** As a patient, I want immediate feedback on form input errors, so that I can correct mistakes before submission.

#### Acceptance Criteria

1. WHEN patient name is less than 2 characters, THE Patient Interface SHALL display a validation error message below the name field
2. WHEN patient age is outside the range 0-150, THE Patient Interface SHALL display a validation error message below the age field
3. WHEN symptoms text is less than 10 characters, THE Patient Interface SHALL display a validation error message below the symptoms field
4. THE Patient Interface SHALL disable the submit button when any validation errors exist
5. THE Patient Interface SHALL clear validation errors when the user corrects the input

### Requirement 14: Image Upload Handling

**User Story:** As a patient, I want to optionally upload an image of my condition, so that doctors can visually assess my situation.

#### Acceptance Criteria

1. THE Patient Interface SHALL provide a file input control for image selection
2. WHEN a file larger than 5MB is selected, THE Patient Interface SHALL display an error message and reject the file
3. WHEN a file format other than JPEG, PNG, or WebP is selected, THE Patient Interface SHALL display an error message and reject the file
4. WHEN a valid image is selected, THE Patient Interface SHALL display a preview thumbnail before submission
5. THE Patient Interface SHALL allow the patient to remove the selected image before submission

### Requirement 15: Risk Level Visual Indicators

**User Story:** As a doctor, I want clear visual indicators for patient risk levels, so that I can quickly identify critical cases at a glance.

#### Acceptance Criteria

1. THE Doctor Dashboard SHALL display a "Critical" badge with red background (#EF4444) for Patient Records with risk level "Critical"
2. THE Doctor Dashboard SHALL display a "Medium" badge with yellow background (#F59E0B) for Patient Records with risk level "Medium"
3. THE Doctor Dashboard SHALL display a "Low" badge with green background (#10B981) for Patient Records with risk level "Low"
4. THE Doctor Dashboard SHALL position the risk level badge prominently on each patient card
5. THE Doctor Dashboard SHALL use white text on all risk level badges for maximum contrast
