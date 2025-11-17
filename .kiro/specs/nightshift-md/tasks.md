# Implementation Plan

## Overview

This implementation plan breaks down the NightShift MD application into discrete, actionable coding tasks. Each task builds incrementally on previous work, ensuring a functional application at each stage. Tasks are organized to implement core functionality first, with optional testing tasks marked with *.

## Task List

- [x] 1. Project setup and configuration




  - Initialize React + Vite project with TypeScript support
  - Install and configure Tailwind CSS with custom dark theme
  - Install Supabase client library and React Router
  - Create environment variable configuration (.env.example)
  - Set up project directory structure (components, pages, services, hooks, utils)
  - Configure Tailwind with custom colors, fonts, and design tokens
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [x] 2. Supabase backend setup









  - Create Supabase project and obtain credentials
  - Write and execute SQL schema for patients table with constraints
  - Create patient-images storage bucket with size and type restrictions
  - Enable real-time subscriptions for patients table
  - Create supabaseClient.js service with initialized client
  - _Requirements: 3.2, 3.3_

- [x] 3. Core UI component library












  - [x] 3.1 Implement base Button component with variants and loading states







    - Create Button.jsx with props for variant (primary, secondary, danger, ghost), size, disabled, loading
    - Style with Tailwind classes for dark theme and accent colors
    - Add hover and focus states with accessibility support
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_


  - [x] 3.2 Implement Card component with hover effects


    - Create Card.jsx with props for children, className, onClick, hoverable
    - Apply dark background, rounded corners, and subtle shadow
    - Add hover scale and glow effect when hoverable is true

    - _Requirements: 11.1, 11.2, 11.4, 11.5_

  - [x] 3.3 Implement Badge component for risk and status indicators


    - Create Badge.jsx with variant prop (critical, medium, low, treated, untreated)
    - Apply color-coded backgrounds based on variant

    - Ensure proper contrast ratios for accessibility
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 3.4 Implement Input component with validation display


    - Create Input.jsx supporting text, number, and textarea types

    - Add label, error message display, and required indicator
    - Style with dark theme and accent color for focus states
    - _Requirements: 1.1, 1.2, 13.1, 13.2, 13.3_

  - [x] 3.5 Implement Modal component for patient details



    - Create Modal.jsx with isOpen, onClose, title, children, size props
    - Add overlay with click-to-close and escape key handler
    - Make responsive (full-screen on mobile, centered on desktop)
    - _Requirements: 7.1, 7.4, 10.4_

  - [x] 3.6 Implement LoadingSpinner and ErrorMessage components


    - Create LoadingSpinner.jsx with size variants
    - Create ErrorMessage.jsx with message and retry button props
    - Style consistently with dark theme
    - _Requirements: 12.1, 12.2, 12.5_


- [x] 4. Risk calculation and validation utilities





  - [x] 4.1 Implement risk calculator service

    - Create riskCalculator.js with calculateRiskLevel function
    - Implement logic: check for critical keywords (chest pain, bleeding, severe, unconscious)
    - Assign Critical if keywords found or pain level is High
    - Assign Medium if pain level is Medium, otherwise Low
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_



  - [x] 4.2 Implement form validation utilities

    - Create validation.js with functions for name, age, symptoms validation
    - Name: 2-100 characters, age: 0-150, symptoms: 10-1000 characters
    - Return validation result with error messages

    - _Requirements: 1.1, 1.2, 1.3, 13.1, 13.2, 13.3_

  - [x] 4.3 Write unit tests for risk calculator

    - Test critical keyword detection (chest pain, bleeding, severe, unconscious)
    - Test High pain level assignment to Critical
    - Test Medium pain level assignment to Medium
    - Test Low pain level assignment to Low
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 5. Patient service and image handling






  - [x] 5.1 Implement patient service with CRUD operations

    - Create patientService.js with createPatient, getPatients, updateTreatmentStatus functions
    - Implement Supabase queries with proper error handling
    - Add subscribeToPatients function for real-time updates
    - _Requirements: 3.1, 3.3, 5.1, 8.3, 8.4, 9.1, 9.2_


  - [x] 5.2 Implement image service with upload and validation

    - Create imageService.js with uploadImage and validateImage functions
    - Validate file size (max 5MB) and type (JPEG, PNG, WebP)
    - Upload to Supabase Storage and return public URL
    - _Requirements: 1.5, 14.2, 14.3, 14.4_

  - [x] 5.3 Create useImageUpload custom hook


    - Implement hook with uploadImage function, uploading state, and error state
    - Handle validation before upload
    - Return upload result with URL or error
    - _Requirements: 14.1, 14.2, 14.3, 14.5_

- [x] 6. Landing page and routing





  - [x] 6.1 Implement Landing page component


    - Create Landing.jsx with hero section and two CTA buttons
    - Add "I'm a Patient" button navigating to /patient/triage
    - Add "I'm a Doctor" button navigating to /doctor/dashboard
    - Style with dark gradient background and accent colors
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 6.2 Set up React Router with route configuration


    - Configure routes in App.jsx: /, /patient/triage, /doctor/dashboard
    - Implement lazy loading for route components
    - Add NotFound component for unmatched routes
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 7. Patient triage form - Step 1 (Basic Info)




  - [x] 7.1 Implement TriageStep1 component


    - Create component with name and age input fields
    - Add progress indicator showing Step 1 of 4
    - Implement real-time validation on blur
    - Add "Next" button that validates and proceeds
    - Store form data in parent component state
    - _Requirements: 1.1, 1.2, 13.1, 13.2, 13.4_

  - [x] 7.2 Create PatientTriage page with multi-step state management


    - Create PatientTriage.jsx with step state (1-4) and form data state
    - Implement navigation between steps
    - Handle form data updates from child components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8. Patient triage form - Step 2 (Symptoms)




  - Implement TriageStep2 component with large textarea
  - Add character counter (10-1000 characters)
  - Show validation error if less than 10 characters
  - Add "Back" and "Next" buttons
  - Update parent form data state on change
  - _Requirements: 1.3, 13.3, 13.5_

- [x] 9. Patient triage form - Step 3 (Pain Level)





  - Implement TriageStep3 component with three selectable cards
  - Create cards for Low, Medium, High pain levels with icons
  - Add visual feedback for selected card (border glow, scale)
  - Dim unselected cards
  - Add "Back" and "Next" buttons
  - _Requirements: 1.4, 10.1, 10.2_

- [x] 10. Patient triage form - Step 4 (Image Upload)




  - Implement TriageStep4 component with file input
  - Add drag-and-drop support for image selection
  - Display image preview thumbnail when file selected
  - Show file size and format requirements
  - Add "Remove" button to clear selected image
  - Add "Skip" and "Next" buttons
  - Integrate useImageUpload hook for validation
  - _Requirements: 1.5, 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 11. Patient triage form - Review and Submit






  - [x] 11.1 Implement ReviewSubmit component

    - Display all entered data in read-only format
    - Show sections: Basic Info, Symptoms, Pain Level, Image preview
    - Add "Edit" button for each section to return to that step
    - Add "Submit" button with loading state
    - _Requirements: 4.1, 4.4, 5.4_


  - [x] 11.2 Implement form submission logic

    - Calculate risk level using riskCalculator before submission
    - Upload image to Supabase Storage if provided
    - Create patient record in Supabase with all data
    - Handle submission errors with retry option
    - Navigate to success screen on successful submission
    - _Requirements: 2.5, 3.1, 3.3, 3.4, 3.5, 4.1_


- [x] 12. Patient triage form - Success screen




  - Implement SuccessScreen component with confirmation message
  - Display patient name in confirmation text
  - Add "Submit Another Case" button that resets form
  - Add "Return to Home" button navigating to landing page
  - Clear all form data after successful submission
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
-

- [x] 13. Doctor dashboard - Patient list and filtering



  - [x] 13.1 Implement usePatients custom hook


    - Create hook that fetches patients from Supabase
    - Implement sorting: Critical first, then Medium, then Low
    - Within each risk level, sort by created_at descending
    - Support filter parameter (all, treated, untreated)
    - Return patients array, loading state, error state, and refetch function
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 6.4_

  - [x] 13.2 Implement FilterControls component


    - Create three filter buttons: All, Untreated, Treated
    - Apply active state styling to selected filter
    - Call onFilterChange callback when filter clicked
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 13.3 Implement PatientCard component


    - Display patient name, age, risk badge, treated status badge
    - Show relative timestamp (e.g., "5 minutes ago")
    - Add hover effect (scale and glow)
    - Call onClick handler when card clicked
    - _Requirements: 5.4, 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 13.4 Implement PatientList component


    - Render grid of PatientCard components (responsive columns)
    - Handle empty state with helpful message
    - Show loading skeleton while fetching
    - Pass patient data and click handler to cards
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 10.2, 12.3_


- [x] 14. Doctor dashboard - Real-time updates



  - [x] 14.1 Implement useRealtimePatients custom hook


    - Subscribe to Supabase real-time changes on patients table
    - Handle INSERT events by adding new patient to list
    - Handle UPDATE events by updating existing patient in list
    - Handle DELETE events by removing patient from list
    - Maintain proper sorting after updates
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [x] 14.2 Integrate real-time updates in DoctorDashboard


    - Use useRealtimePatients hook with initial patient data
    - Update patient list state when real-time events occur
    - Add manual refresh button as fallback
    - _Requirements: 5.5, 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 15. Doctor dashboard - Patient detail view








  - [x] 15.1 Implement PatientDetail component




    - Display full patient information: name, age, symptoms, pain level, risk level
    - Render uploaded image if available (max 800px width)
    - Show submission timestamp in readable format
    - Display current treatment status
    - Add close button to exit detail view
    - _Requirements: 7.1, 7.2, 7.3, 7.4_


  - [x] 15.2 Implement treatment status update functionality



    - Add "Mark as Treated" button when treated is false
    - Add "Mark as Not Treated" button when treated is true
    - Call patientService.updateTreatmentStatus on button click
    - Show loading state during update
    - Update UI optimistically and handle errors
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_



  - [x] 15.3 Integrate PatientDetail modal in DoctorDashboard


    - Add state for selected patient
    - Open modal when patient card clicked
    - Pass patient data and action handlers to PatientDetail
    - Close modal and maintain scroll position on close
    - _Requirements: 7.1, 7.4, 7.5_

- [x] 16. Responsive design and mobile optimization




  - [x] 16.1 Implement mobile-responsive layouts


    - Apply single-column layout for patient cards on mobile (<768px)
    - Stack form fields vertically on mobile
    - Make patient detail modal full-screen on mobile
    - Ensure touch-friendly sizing (min 44x44px) for all interactive elements
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 16.2 Test and refine responsive breakpoints


    - Verify layouts at 640px, 768px, 1024px, 1280px breakpoints
    - Adjust spacing and sizing for optimal mobile experience
    - Test on actual mobile devices (iOS Safari, Android Chrome)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 17. Error handling and loading states










  - [x] 17.1 Implement error boundaries and error handling

    - Add error handling to all Supabase operations
    - Display user-friendly error messages with retry options
    - Show network error banner when connection fails
    - Handle image upload errors with specific messages
    - _Requirements: 12.2, 12.4, 12.5_





  - [x] 17.2 Implement comprehensive loading states
    - Add loading spinner for initial dashboard data fetch
    - Show skeleton cards while loading patient list


    - Display button spinner during form submission
    - Show inline spinner during image upload
    - _Requirements: 12.1_

- [x] 18. Accessibility improvements



  - Add ARIA labels to all interactive elements
  - Ensure proper focus management in modals
  - Implement keyboard navigation (Tab, Enter, Escape)
  - Add focus indicators with visible outlines
  - Associate form labels with inputs and error messages
  - Test with screen reader (NVDA or VoiceOver)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 19. Final polish and optimization





  - [x] 19.1 Optimize bundle size and performance

    - Implement code splitting for routes
    - Add lazy loading for images
    - Minimize and compress production build
    - Test performance with Lighthouse
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_


  - [x] 19.2 Cross-browser testing and bug fixes

    - Test on Chrome, Firefox, Safari, Edge
    - Fix any browser-specific issues
    - Verify all features work consistently
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 20. Integration testing





  - Write integration tests for complete patient triage flow
  - Test doctor dashboard patient list rendering and filtering
  - Test treatment status update flow
  - Test real-time update handling
  - Test image upload and display
  - _Requirements: 1.1-1.5, 5.1-5.5, 8.1-8.5_

- [x] 21. Deployment preparation




  - Create production environment variables
  - Build production bundle and test locally
  - Set up hosting on Vercel or Netlify
  - Configure custom domain and SSL
  - Verify Supabase production configuration
  - Test deployed application end-to-end
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

## Notes

- Each task should be completed and verified before moving to the next
- Refer to requirements.md and design.md for detailed specifications
- Test each feature in isolation before integration
- All testing tasks are required for comprehensive quality assurance
