import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

const mockPatient = {
  id: '1',
  name: 'John Doe',
  age: 35,
  symptoms: 'Headache',
  pain_level: 'Medium',
  risk_level: 'Medium',
  treated: false,
  created_at: new Date().toISOString(),
  image: null,
};

describe('Real-time Updates Integration Tests', () => {
  let subscriptionCallback;

  beforeEach(() => {
    vi.clearAllMocks();
    subscriptionCallback = null;

    // Mock subscription to capture callback
    vi.spyOn(patientService, 'subscribeToPatients').mockImplementation((callback) => {
      subscriptionCallback = callback;
      return {
        unsubscribe: vi.fn(),
      };
    });
  });

  test('adds new patient to list on INSERT event', async () => {
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: [],
      error: null,
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/no patients/i)).toBeInTheDocument();
    });

    // Simulate INSERT event
    if (subscriptionCallback) {
      subscriptionCallback({
        eventType: 'INSERT',
        new: mockPatient,
      });
    }

    // New patient should appear
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('updates existing patient on UPDATE event', async () => {
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: [mockPatient],
      error: null,
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Verify initial state shows "Untreated"
    expect(screen.getByText(/untreated/i)).toBeInTheDocument();

    // Simulate UPDATE event (patient marked as treated)
    if (subscriptionCallback) {
      subscriptionCallback({
        eventType: 'UPDATE',
        new: { ...mockPatient, treated: true },
      });
    }

    // Patient status should update
    await waitFor(() => {
      expect(screen.getByText(/treated/i)).toBeInTheDocument();
    });
  });

  test('removes patient from list on DELETE event', async () => {
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: [mockPatient],
      error: null,
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate DELETE event
    if (subscriptionCallback) {
      subscriptionCallback({
        eventType: 'DELETE',
        old: mockPatient,
      });
    }

    // Patient should be removed
    await waitFor(() => {
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  test('maintains proper sorting after real-time updates', async () => {
    const lowRiskPatient = {
      id: '2',
      name: 'Jane Low',
      age: 25,
      symptoms: 'Minor discomfort',
      pain_level: 'Low',
      risk_level: 'Low',
      treated: false,
      created_at: new Date().toISOString(),
      image: null,
    };

    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: [lowRiskPatient],
      error: null,
    });

    renderWithRouter(<DoctorDashboard />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Jane Low')).toBeInTheDocument();
    });

    // Add critical patient via real-time
    const criticalPatient = {
      id: '3',
      name: 'Bob Critical',
      age: 45,
      symptoms: 'Chest pain',
      pain_level: 'High',
      risk_level: 'Critical',
      treated: false,
      created_at: new Date().toISOString(),
      image: null,
    };

    if (subscriptionCallback) {
      subscriptionCallback({
        eventType: 'INSERT',
        new: criticalPatient,
      });
    }

    // Critical patient should appear first
    await waitFor(() => {
      expect(screen.getByText('Bob Critical')).toBeInTheDocument();
    });

    // Verify order by checking DOM structure
    const patientCards = screen.getAllByRole('button');
    const firstCard = patientCards[0];
    expect(firstCard).toHaveTextContent('Bob Critical');
  });

  test('unsubscribes from real-time updates on unmount', async () => {
    const unsubscribeMock = vi.fn();
    
    vi.spyOn(patientService, 'getPatients').mockResolvedValue({
      data: [],
      error: null,
    });

    vi.spyOn(patientService, 'subscribeToPatients').mockReturnValue({
      unsubscribe: unsubscribeMock,
    });

    const { unmount } = renderWithRouter(<DoctorDashboard />);

    // Wait for component to mount
    await waitFor(() => {
      expect(patientService.subscribeToPatients).toHaveBeenCalled();
    });

    // Unmount component
    unmount();

    // Should unsubscribe
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
