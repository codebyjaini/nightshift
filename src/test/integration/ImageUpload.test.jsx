import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import PatientTriage from '../../pages/PatientTriage';
import DoctorDashboard from '../../pages/DoctorDashboard';
import * as imageService from '../../services/imageService';
import * as patientService from '../../services/patientService';

// Mock services
vi.mock('../../services/imageService');
vi.mock('../../services/patientService');
vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
    storage: vi.fn(),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(),
      })),
    })),
  },
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Image Upload Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('validates image file size', async () => {
    const user = userEvent.setup();
    
    // Mock validation failure for large file
    vi.spyOn(imageService, 'validateImage').mockReturnValue({
      valid: false,
      error: 'File size must be less than 5MB',
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

    await waitFor(() => screen.getByText(/step 4/i));

    // Try to upload large file
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/upload/i);
    
    await user.upload(fileInput, largeFile);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/file size must be less than 5mb/i)).toBeInTheDocument();
    });
  });

  test('validates image file type', async () => {
    const user = userEvent.setup();
    
    // Mock validation failure for invalid type
    vi.spyOn(imageService, 'validateImage').mockReturnValue({
      valid: false,
      error: 'Only JPEG, PNG, and WebP formats are allowed',
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

    await waitFor(() => screen.getByText(/step 4/i));

    // Try to upload invalid file type
    const invalidFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/upload/i);
    
    await user.upload(fileInput, invalidFile);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/only jpeg, png, and webp/i)).toBeInTheDocument();
    });
  });

  test('uploads valid image successfully', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(imageService, 'validateImage').mockReturnValue({
      valid: true,
      error: null,
    });

    vi.spyOn(imageService, 'uploadImage').mockResolvedValue({
      data: 'https://example.com/images/test.jpg',
      error: null,
    });

    vi.spyOn(patientService, 'createPatient').mockResolvedValue({
      data: { id: '123', name: 'John Doe' },
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

    await waitFor(() => screen.getByText(/step 4/i));

    // Upload valid image
    const validFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/upload/i);
    
    await user.upload(fileInput, validFile);

    // Should show preview
    await waitFor(() => {
      expect(imageService.validateImage).toHaveBeenCalledWith(validFile);
    });

    // Continue to review
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => screen.getByText(/review/i));

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Should upload image and create patient
    await waitFor(() => {
      expect(imageService.uploadImage).toHaveBeenCalled();
      expect(patientService.createPatient).toHaveBeenCalledWith(
        expect.objectContaining({
          image: 'https://example.com/images/test.jpg',
        })
      );
    });
  });

  test('displays uploaded image in doctor dashboard', async () => {
    const patientWithImage = {
      id: '1',
      name: 'John Doe',
      age: 35,
      symptoms: 'Headache',
      pain_level: 'Medium',
      risk_level: 'Medium',
      treated: false,
      created_at: new Date().toISOString(),
      image: 'https://example.com/images/test.jpg',
    };

    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: [patientWithImage],
      error: null,
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    const user = userEvent.setup();
    renderWithRouter(<DoctorDashboard />);

    // Wait for patients to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Open patient detail
    const patientCard = screen.getByText('John Doe').closest('div[role="button"]');
    await user.click(patientCard);

    // Modal should show image
    await waitFor(() => {
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', 'https://example.com/images/test.jpg');
    });
  });

  test('handles image upload failure gracefully', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(imageService, 'validateImage').mockReturnValue({
      valid: true,
      error: null,
    });

    vi.spyOn(imageService, 'uploadImage').mockResolvedValue({
      data: null,
      error: { message: 'Upload failed' },
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

    await waitFor(() => screen.getByText(/step 4/i));

    // Upload image
    const validFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/upload/i);
    
    await user.upload(fileInput, validFile);
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => screen.getByText(/review/i));

    // Submit should handle upload error
    vi.spyOn(patientService, 'createPatient').mockResolvedValue({
      data: { id: '123', name: 'John Doe' },
      error: null,
    });

    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Should show error or continue without image
    await waitFor(() => {
      expect(imageService.uploadImage).toHaveBeenCalled();
    });
  });

  test('allows removing selected image before submission', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(imageService, 'validateImage').mockReturnValue({
      valid: true,
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

    await waitFor(() => screen.getByText(/step 4/i));

    // Upload image
    const validFile = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText(/upload/i);
    
    await user.upload(fileInput, validFile);

    // Wait for preview to appear
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    });

    // Remove image
    const removeButton = screen.getByRole('button', { name: /remove/i });
    await user.click(removeButton);

    // Image should be removed
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
    });
  });
});
