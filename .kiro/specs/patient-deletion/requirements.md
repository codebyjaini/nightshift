# Requirements Document

## Introduction

This feature enables doctors to delete patient records from the doctor dashboard. This is essential for removing test entries, duplicate records, or cases that were entered in error. The deletion capability provides data management flexibility while maintaining system integrity and audit trails.

## Glossary

- **Doctor Dashboard**: The web interface where doctors view and manage patient records
- **Patient Record**: A database entry containing patient information including name, age, symptoms, risk level, treatment status, and contact information
- **Soft Delete**: Marking a record as deleted without physically removing it from the database
- **Hard Delete**: Permanently removing a record from the database
- **Supabase**: The backend database and API service used by the system
- **Patient Service**: The service layer that handles all patient-related database operations

## Requirements

### Requirement 1

**User Story:** As a doctor, I want to delete individual patient records from the dashboard, so that I can remove test entries or cases entered in error.

#### Acceptance Criteria

1. WHEN a doctor views a patient's details THEN the system SHALL display a delete button or option
2. WHEN a doctor clicks the delete button THEN the system SHALL prompt for confirmation before deletion
3. WHEN a doctor confirms deletion THEN the system SHALL remove the patient record from the database
4. WHEN a patient record is deleted THEN the system SHALL remove it from the patient list immediately
5. WHEN a deletion fails THEN the system SHALL display an error message and maintain the current state


### Requirement 2

**User Story:** As a doctor, I want the system to prevent accidental deletions, so that I don't lose important patient data by mistake.

#### Acceptance Criteria

1. WHEN a doctor initiates deletion THEN the system SHALL display a confirmation dialog with clear warning text
2. WHEN the confirmation dialog is shown THEN the system SHALL display the patient's name for verification
3. WHEN a doctor cancels the deletion THEN the system SHALL close the dialog and maintain all data unchanged
4. WHEN a doctor confirms deletion THEN the system SHALL proceed with the deletion operation
5. WHILE the deletion is processing THEN the system SHALL disable the delete button to prevent duplicate requests

### Requirement 3

**User Story:** As a system administrator, I want deletion operations to be secure and authorized, so that only authenticated doctors can delete patient records.

#### Acceptance Criteria

1. WHEN a deletion request is made THEN the system SHALL verify the user is authenticated as a doctor
2. WHEN an unauthenticated user attempts deletion THEN the system SHALL reject the request with an authorization error
3. WHEN a deletion is performed THEN the system SHALL use the authenticated user's credentials for the database operation
4. WHEN database permissions are insufficient THEN the system SHALL return a clear error message to the user

### Requirement 4

**User Story:** As a developer, I want a reusable delete function in the patient service, so that deletion logic is centralized and maintainable.

#### Acceptance Criteria

1. WHEN the patient service is initialized THEN the system SHALL provide a deletePatient function
2. WHEN deletePatient is called with a valid patient ID THEN the system SHALL execute a DELETE operation on the patients table
3. WHEN deletePatient succeeds THEN the system SHALL return a success response with no error
4. WHEN deletePatient fails THEN the system SHALL return an error object with user-friendly message and retry capability flag
5. WHEN deletePatient is called with an invalid ID THEN the system SHALL handle the error gracefully and return appropriate error information



### Requirement 5

**User Story:** As a doctor, I want real-time updates after deletion, so that the patient list reflects changes immediately without manual refresh.

#### Acceptance Criteria

1. WHEN a patient is deleted THEN the system SHALL remove the patient from the displayed list automatically
2. WHEN a patient is deleted THEN the system SHALL close any open patient detail modal
3. WHEN deletion completes THEN the system SHALL update the UI state without requiring a page refresh
4. WHEN the real-time subscription is active THEN the system SHALL reflect deletions made by other users immediately

### Requirement 6

**User Story:** As a doctor, I want clear visual feedback during deletion, so that I understand the operation status and any errors that occur.

#### Acceptance Criteria

1. WHEN deletion is in progress THEN the system SHALL display a loading indicator on the delete button
2. WHEN deletion succeeds THEN the system SHALL provide visual confirmation before closing the modal
3. WHEN deletion fails THEN the system SHALL display the error message within the patient detail modal
4. WHEN an error is displayed THEN the system SHALL allow the user to retry or cancel the operation
5. WHILE deletion is processing THEN the system SHALL prevent the user from closing the modal or initiating other actions
