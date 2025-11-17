import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DoctorDashboard from '../../pages/DoctorDashboard';
import * as patientService from '../../services/patientService';

// Mock services
vi.mock('../../services/patientService');
vi.mock('../../services/supabaseClient', () => ({
  supabase: {
    from: vi.fn(),
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

const mockPatients = [
  {
    id: '1',
    name: 'John Critical',
    age: 45,
    symptoms: 'Chest pain and difficulty breathing',
    pain_level: 'High',
    risk_level: 'Critical',
    treated: false,
    created_at: new Date().toISOString(),
    image: null,
  },
  {
    id: '2',
    name: 'Jane Medium',
    age: 30,
    symptoms: 'Severe headache',
    pain_level: 'Medium',
    risk_level: 'Medium',
    treated: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    image: null,
  },
  {
    id: '3',
    name: 'Bob Low',
    age: 25,
    symptoms: 'Minor discomfort',
    pain_level: 'Low',
    risk_level: 'Low',
    treated: true,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    image: null,
  },
];

describe('Doctor Dashboard Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders patient list with proper sorting', async () => {
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: mockPatients,
      error: null,
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for patients to load
    await waitFor(() => {
      expect(screen.getByText('John Critical')).toBeInTheDocument();
    });

    // Check all patients are displayed
    expect(screen.getByText('Jane Medium')).toBeInTheDocument();
    expect(screen.getByText('Bob Low')).toBeInTheDocument();

    // Verify risk badges
    expect(screen.getByText('Critical')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  test('filters patients by treatment status', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(patientService, 'getPatients').mockImplementation((filter) => {
      if (filter === 'untreated') {
        return Promise.resolve({
          data: mockPatients.filter(p => !p.treated),
          error: null,
        });
      }
      if (filter === 'treated') {
        return Promise.resolve({
          data: mockPatients.filter(p => p.treated),
          error: null,
        });
      }
      return Promise.resolve({ data: mockPatients, error: null });
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('John Critical')).toBeInTheDocument();
    });

    // Click "Untreated" filter
    const untreatedButton = screen.getByRole('button', { name: /untreated/i });
    await user.click(untreatedButton);

    await waitFor(() => {
      expect(patientService.getPatients).toHaveBeenCalledWith('untreated');
    });

    // Should show only untreated patients
    expect(screen.getByText('John Critical')).toBeInTheDocument();
    expect(screen.getByText('Jane Medium')).toBeInTheDocument();
    expect(screen.queryByText('Bob Low')).not.toBeInTheDocument();

    // Click "Treated" filter
    const treatedButton = screen.getByRole('button', { name: /^treated$/i });
    await user.click(treatedButton);

    await waitFor(() => {
      expect(patientService.getPatients).toHaveBeenCalledWith('treated');
    });
  });

  test('opens patient detail modal on card click', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: mockPatients,
      error: null,
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for patients to load
    await waitFor(() => {
      expect(screen.getByText('John Critical')).toBeInTheDocument();
    });

    // Click on patient card
    const patientCard = screen.getByText('John Critical').closest('div[role="button"]');
    await user.click(patientCard);

    // Modal should open with patient details
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Check modal content
    expect(screen.getByText(/chest pain/i)).toBeInTheDocument();
    expect(screen.getByText(/45/)).toBeInTheDocument();
  });

  test('updates treatment status', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: mockPatients,
      error: null,
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    vi.spyOn(patientService, 'updateTreatmentStatus').mockResolvedValue({
      data: { ...mockPatients[0], treated: true },
      error: null,
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for patients to load
    await waitFor(() => {
      expect(screen.getByText('John Critical')).toBeInTheDocument();
    });

    // Click on patient card to open modal
    const patientCard = screen.getByText('John Critical').closest('div[role="button"]');
    await user.click(patientCard);

    // Wait for modal
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Click "Mark as Treated" button
    const markTreatedButton = screen.getByRole('button', { name: /mark as treated/i });
    await user.click(markTreatedButton);

    // Verify service was called
    await waitFor(() => {
      expect(patientService.updateTreatmentStatus).toHaveBeenCalledWith('1', true);
    });
  });

  test('displays loading state while fetching patients', async () => {
    vi.spyOn(patientService, 'getPatients').mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: [], error: null }), 100))
    );

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    renderWithRouter(<DoctorDashboard />);

    // Should show loading indicator
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  test('displays error message on fetch failure', async () => {
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: null,
      error: { message: 'Failed to fetch patients' },
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    renderWithRouter(<DoctorDashboard />);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no patients exist', async () => {
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: [],
      error: null,
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    renderWithRouter(<DoctorDashboard />);

    // Should show empty state message
    await waitFor(() => {
      expect(screen.getByText(/no patients/i)).toBeInTheDocument();
    });
  });

  test('closes modal when close button is clicked', async () => {
    const user = userEvent.setup();
    
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: mockPatients,
      error: null,
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: vi.fn(),
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for patients to load
    await waitFor(() => {
      expect(screen.getByText('John Critical')).toBeInTheDocument();
    });

    // Open modal
    const patientCard = screen.getByText('John Critical').closest('div[role="button"]');
    await user.click(patientCard);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    // Modal should be closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
