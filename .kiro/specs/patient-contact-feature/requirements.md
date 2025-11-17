# Requirements Document

## Introduction

This document outlines the requirements for adding a patient contact management feature to the NightShift MD doctor dashboard. The feature enables doctors to call patients directly from the dashboard and track contact history.

## Glossary

- **Dashboard**: The doctor's interface for viewing and managing patient triage submissions
- **Patient Card**: A UI component displaying individual patient information
- **Contact Status**: A boolean indicator showing whether a patient has been contacted
- **Contact History**: A log of all contact attempts made by doctors
- **Supabase**: The backend database and API service

## Requirements

### Requirement 1: Call Patient Functionality

**User Story:** As a doctor, I want to call patients directly from the dashboard, so that I can quickly reach them without manually dialing numbers

#### Acceptance Criteria

1. WHEN a doctor views a patient card, THE Dashboard SHALL display a "Call Now" button with a phone icon
2. WHEN a doctor clicks the "Call Now" button, THE Dashboard SHALL initiate a phone call using the tel: protocol
3. THE Dashboard SHALL display the patient's phone number in a readable format on the patient card
4. THE Dashboard SHALL style the call button to be visually distinct and professional

### Requirement 2: Contact Status Tracking

**User Story:** As a doctor, I want to mark patients as contacted, so that I can track which patients I have already reached

#### Acceptance Criteria

1. WHEN a doctor views a patient card, THE Dashboard SHALL display a "Mark as Contacted" button IF the patient has not been contacted
2. WHEN a doctor clicks "Mark as Contacted", THE Dashboard SHALL update the patient's contact status to true
3. WHEN a patient is marked as contacted, THE Dashboard SHALL display a green "Contacted" badge
4. WHEN a patient has not been contacted, THE Dashboard SHALL display a yellow "Pending" badge
5. WHEN a patient is marked as contacted, THE Dashboard SHALL record the timestamp of contact

### Requirement 3: Contact History Logging

**User Story:** As a system administrator, I want to maintain a log of all patient contacts, so that we can track communication patterns and compliance

#### Acceptance Criteria

1. WHEN a doctor marks a patient as contacted, THE System SHALL create a new entry in the contact_history table
2. THE System SHALL record the patient ID, doctor ID, and timestamp for each contact
3. THE System SHALL maintain referential integrity between contact_history and patients tables

### Requirement 4: Database Schema Updates

**User Story:** As a developer, I want to extend the database schema to support contact tracking, so that the feature has proper data persistence

#### Acceptance Criteria

1. THE System SHALL add a "contacted" boolean column to the patients table with default value false
2. THE System SHALL add a "contacted_at" timestamp column to the patients table that is nullable
3. THE System SHALL create a new "contact_history" table with columns: id (uuid), patient_id (uuid), doctor_id (uuid), contacted_at (timestamp)
4. THE System SHALL establish a foreign key relationship from contact_history.patient_id to patients.id

### Requirement 5: Service Layer Integration

**User Story:** As a developer, I want to add service functions for contact management, so that the UI can interact with the backend consistently

#### Acceptance Criteria

1. THE patientService SHALL provide a markPatientContacted function that accepts patientId and doctorId
2. WHEN markPatientContacted is called, THE patientService SHALL update the patients table with contacted=true and contacted_at=now()
3. WHEN markPatientContacted is called, THE patientService SHALL insert a new record into contact_history
4. THE markPatientContacted function SHALL return the updated patient object
5. THE patientService SHALL handle errors gracefully and return meaningful error messages

### Requirement 6: UI Component Updates

**User Story:** As a doctor, I want an intuitive interface for patient contact management, so that I can efficiently manage patient communications

#### Acceptance Criteria

1. THE PatientCard component SHALL display the patient's phone number
2. THE PatientCard component SHALL display a "Call Now" button with appropriate styling
3. THE PatientCard component SHALL display a contact status badge (green for contacted, yellow for pending)
4. THE PatientCard component SHALL display a "Mark as Contacted" button only when the patient has not been contacted
5. WHEN the contact status changes, THE Dashboard SHALL update the UI in real-time
6. THE Dashboard SHALL maintain all existing functionality without breaking changes
