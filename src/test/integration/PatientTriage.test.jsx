import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PatientTriage from '../../pages/PatientTriage';
import * as patientService from '../../services/patientService';
import * as imageService from '../../services/imageService';

// Mock services
vi.mock('../../services/patientService');
vi.mock('../../services/imageService');
vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    storage: vi.fn(),
  },
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Patient Triage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('completes full triage flow with valid data', async () => {
    const user = userEvent.setup();
    
    // Mock successful submission
    vi.spyOn(patientService, 'createPatient').mockResolvedValue({
      data: { id: '123', name: 'John Doe' },
      error: null,
    });

    renderWithRouter(<PatientTriage />);

    // Step 1: Basic Info
    expect(screen.getByText(/step 1/i)).toBeInTheDocument();
    
    const nameInput = screen.getByLabelText(/name/i);
    const ageInput = screen.getByLabelText(/age/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(ageInput, '35');
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    await user.click(nextButton);

    // Step 2: Symptoms
    await waitFor(() => {
      expect(screen.getByText(/step 2/i)).toBeInTheDocument();
    });
    
    const symptomsInput = screen.getByLabelText(/symptoms/i);
    await user.type(symptomsInput, 'I have a severe headache and dizziness');
    
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 3: Pain Level
    await waitFor(() => {
      expect(screen.getByText(/step 3/i)).toBeInTheDocument();
    });
    
    const mediumPainButton = screen.getByRole('button', { name: /medium/i });
    await user.click(mediumPainButton);
    
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 4: Image Upload (skip)
    await waitFor(() => {
      expect(screen.getByText(/step 4/i)).toBeInTheDocument();
    });
    
    const skipButton = screen.getByRole('button', { name: /skip/i });
    await user.click(skipButton);

    // Review and Submit
    await waitFor(() => {
      expect(screen.getByText(/review/i)).toBeInTheDocument();
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('35')).toBeInTheDocument();
    expect(screen.getByText(/severe headache/i)).toBeInTheDocument();
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    // Success screen
    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
    
    expect(patientService.createPatient).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        age: 35,
        symptoms: 'I have a severe headache and dizziness',
        pain_level: 'Medium',
        risk_level: 'Medium',
      })
    );
  });

  test('validates required fields in step 1', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PatientTriage />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Try to proceed without filling fields
    await user.click(nextButton);
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  test('validates minimum symptom length in step 2', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PatientTriage />);

    // Complete step 1
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/age/i), '35');
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 2: Enter short symptoms
    await waitFor(() => {
      expect(screen.getByText(/step 2/i)).toBeInTheDocument();
    });
    
    const symptomsInput = screen.getByLabelText(/symptoms/i);
    await user.type(symptomsInput, 'Short');
    
    await user.click(screen.getByRole('button', { name: /next/i }));
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/at least 10 characters/i)).toBeInTheDocument();
    });
  });

  test('allows navigation back through steps', async () => {
    const user = userEvent.setup();
    renderWithRouter(<PatientTriage />);

    // Complete step 1
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/age/i), '35');
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Go to step 2
    await waitFor(() => {
      expect(screen.getByText(/step 2/i)).toBeInTheDocument();
    });

    // Click back
    const backButton = screen.getByRole('button', { name: /back/i });
    await user.click(backButton);

    // Should be back at step 1
    await waitFor(() => {
      expect(screen.getByText(/step 1/i)).toBeInTheDocument();
    });
    
    // Data should be preserved
    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/age/i)).toHaveValue(35);
  });

  test('handles image upload with validation', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(imageService, 'validateImage').mockReturnValue({
      valid: true,
      error: null,
    });
    
    vi.spyOn(imageService, 'uploadImage').mockResolvedValue({
      data: 'https://example.com/image.jpg',
      error: null,
    });

    renderWithRouter(<PatientTriage />);

    // Navigate to step 4
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/age/i), '35');
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => screen.getByText(/step 2/i));
    await user.type(screen.getByLabelText(/symptoms/i), 'I have a severe headache');
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => screen.getByText(/step 3/i));
    await user.click(screen.getByRole('button', { name: /medium/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 4: Upload image
    await waitFor(() => {
      expect(screen.getByText(/step 4/i)).toBeInTheDocument();
    });

    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/upload/i);
    
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(imageService.validateImage).toHaveBeenCalledWith(file);
    });
  });

  test('displays error message on submission failure', async () => {
    const user = userEvent.setup();
    
    // Mock failed submission
    vi.spyOn(patientService, 'createPatient').mockResolvedValue({
      data: null,
      error: { message: 'Network error' },
    });

    renderWithRouter(<PatientTriage />);

    // Complete all steps quickly
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/age/i), '35');
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => screen.getByText(/step 2/i));
    await user.type(screen.getByLabelText(/symptoms/i), 'I have a severe headache');
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => screen.getByText(/step 3/i));
    await user.click(screen.getByRole('button', { name: /high/i }));
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => screen.getByText(/step 4/i));
    await user.click(screen.getByRole('button', { name: /skip/i }));

    await waitFor(() => screen.getByText(/review/i));
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
