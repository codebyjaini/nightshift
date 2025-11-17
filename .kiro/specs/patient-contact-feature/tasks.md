# Implementation Plan: Patient Contact Feature

- [x] 1. Create Supabase database migration





  - Create SQL migration file with ALTER TABLE and CREATE TABLE statements
  - Add `contacted` boolean column to patients table (default false)
  - Add `contacted_at` timestamp column to patients table (nullable)
  - Create `contact_history` table with proper schema
  - Add foreign key constraint from contact_history to patients
  - Add database indexes for performance optimization
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_


- [x] 2. Update patientService with contact management




  - [x] 2.1 Add markPatientContacted function


    - Implement function to update patients.contacted and patients.contacted_at
    - Insert record into contact_history table
    - Handle errors gracefully with existing error handler
    - Return updated patient object
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 2.2 Export new function in service module


    - Add markPatientContacted to service exports
    - Update TypeScript definitions if needed
    - _Requirements: 5.1_

- [x] 3. Update Badge component with new variants





  - Add 'success' variant (green) for contacted status
  - Add 'warning' variant (yellow) for pending status
  - Ensure proper styling matches design system
  - _Requirements: 2.3, 2.4, 6.3_


- [x] 4. Update PatientCard component





  - [x] 4.1 Add phone number display with icon

    - Display phone number with Phone icon
    - Make phone number clickable with tel: protocol
    - Stop event propagation to prevent card click
    - _Requirements: 1.1, 1.3, 6.1_
  

  - [x] 4.2 Add contact status badge

    - Display "Contacted" badge (green) when patient.contacted is true
    - Display "Pending" badge (yellow) when patient.contacted is false
    - Position badge appropriately in card layout
    - _Requirements: 2.3, 2.4, 6.3_
-

- [x] 5. Update PatientDetail component




  - [x] 5.1 Add contact information section

    - Create new section with heading "Contact Information"
    - Display phone number
    - Add "Call Now" button with Phone icon
    - Style button with accent colors
    - Use tel: protocol for phone link
    - _Requirements: 1.1, 1.2, 1.4, 6.2_
  

  - [x] 5.2 Add "Mark as Contacted" button

    - Add button below contact information section
    - Show button only when patient.contacted is false
    - Add Check icon to button
    - Wire up onClick handler
    - Show loading state during operation
    - Disable button when loading
    - _Requirements: 2.1, 2.2, 6.4_
  
  - [x] 5.3 Add contact status badge to header

    - Display contact badge alongside risk and treatment badges
    - Use appropriate colors (green/yellow)
    - _Requirements: 2.3, 2.4, 6.3_

- [x] 6. Update DoctorDashboard with contact functionality




  - [x] 6.1 Add contact loading state


    - Add state variable to track which patient is being marked as contacted
    - Prevent multiple simultaneous contact operations
    - _Requirements: 6.5_
  

  - [x] 6.2 Implement handleMarkContacted function


    - Get doctor ID from auth context (use placeholder for now)
    - Call patientService.markPatientContacted
    - Handle success and error cases
    - Update loading state appropriately
    - Show error notification on failure
    - _Requirements: 2.1, 2.2, 5.1, 5.2, 5.3, 5.4_
  


  - [x] 6.3 Pass contact handler to PatientDetail

    - Pass onMarkContacted prop to PatientDetail component
    - Pass contactLoading state to PatientDetail
    - Ensure real-time subscription updates UI automatically
    - _Requirements: 6.5_


- [x] 7. Verify no breaking changes




  - Test existing patient triage submission flow
  - Test existing doctor dashboard functionality
  - Verify treatment status updates still work
  - Verify real-time updates still work
  - Test image upload functionality
  - _Requirements: 6.6_


- [x] 8. Manual testing and validation




  - Test phone number display on patient cards
  - Test call button functionality (tel: link)
  - Test marking patient as contacted
  - Verify badge updates from pending to contacted
  - Verify "Mark as Contacted" button disappears after use
  - Test error handling scenarios
  - Verify database records are created correctly
  - Test real-time updates across multiple browser tabs
  - _Requirements: All_
