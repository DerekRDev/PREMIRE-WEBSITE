import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Appointment, TimeSlot, AppointmentType } from '../../../core/entities/Appointment';
import { Specialty } from '../../../core/entities/Provider';
import { UIProvider, UIAppointment } from '../../components/scheduling/types';

// State interface
export interface AppointmentState {
  selectedSpecialty: Specialty | null;
  selectedProvider: UIProvider | null;
  selectedSlot: TimeSlot | null;
  appointmentType: AppointmentType | null;
  reason: string;
  notes: string;
  currentStep: number;
  scheduledAppointment: UIAppointment | null;
  loading: boolean;
  error: Error | null;
}

// Action types
export type AppointmentAction =
  | { type: 'SELECT_SPECIALTY'; specialty: Specialty }
  | { type: 'SELECT_PROVIDER'; provider: UIProvider }
  | { type: 'SELECT_SLOT'; slot: TimeSlot }
  | { type: 'SET_APPOINTMENT_TYPE'; appointmentType: AppointmentType }
  | { type: 'SET_REASON'; reason: string }
  | { type: 'SET_NOTES'; notes: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET_FLOW' }
  | { type: 'SET_SCHEDULED_APPOINTMENT'; appointment: UIAppointment }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: Error | null };

// Initial state
const initialState: AppointmentState = {
  selectedSpecialty: null,
  selectedProvider: null,
  selectedSlot: null,
  appointmentType: null,
  reason: '',
  notes: '',
  currentStep: 0,
  scheduledAppointment: null,
  loading: false,
  error: null
};

// Reducer
function appointmentReducer(
  state: AppointmentState,
  action: AppointmentAction
): AppointmentState {
  switch (action.type) {
    case 'SELECT_SPECIALTY':
      return {
        ...state,
        selectedSpecialty: action.specialty,
        selectedProvider: null, // Reset downstream selections
        selectedSlot: null,
        error: null
      };

    case 'SELECT_PROVIDER':
      return {
        ...state,
        selectedProvider: action.provider,
        selectedSlot: null, // Reset downstream selections
        error: null
      };

    case 'SELECT_SLOT':
      return {
        ...state,
        selectedSlot: action.slot,
        error: null
      };

    case 'SET_APPOINTMENT_TYPE':
      return {
        ...state,
        appointmentType: action.appointmentType,
        error: null
      };

    case 'SET_REASON':
      return {
        ...state,
        reason: action.reason,
        error: null
      };

    case 'SET_NOTES':
      return {
        ...state,
        notes: action.notes,
        error: null
      };

    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: state.currentStep + 1,
        error: null
      };

    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(0, state.currentStep - 1),
        error: null
      };

    case 'RESET_FLOW':
      return {
        ...initialState
      };

    case 'SET_SCHEDULED_APPOINTMENT':
      return {
        ...state,
        scheduledAppointment: action.appointment,
        error: null
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
        error: null
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.error,
        loading: false
      };

    default:
      return state;
  }
}

// Context
interface AppointmentContextValue {
  state: AppointmentState;
  dispatch: React.Dispatch<AppointmentAction>;
}

const AppointmentContext = createContext<AppointmentContextValue | undefined>(
  undefined
);

// Provider component
interface AppointmentProviderProps {
  children: ReactNode;
}

export function AppointmentProvider({ children }: AppointmentProviderProps) {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  return (
    <AppointmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AppointmentContext.Provider>
  );
}

// Custom hook for using the appointment context
export function useAppointmentContext() {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointmentContext must be used within an AppointmentProvider');
  }
  return context;
}

// Utility hook for appointment actions
export function useAppointmentActions() {
  const { dispatch } = useAppointmentContext();

  return {
    selectSpecialty: (specialty: Specialty) =>
      dispatch({ type: 'SELECT_SPECIALTY', specialty }),
    
    selectProvider: (provider: UIProvider) =>
      dispatch({ type: 'SELECT_PROVIDER', provider }),
    
    selectSlot: (slot: TimeSlot) =>
      dispatch({ type: 'SELECT_SLOT', slot }),
    
    setAppointmentType: (appointmentType: AppointmentType) =>
      dispatch({ type: 'SET_APPOINTMENT_TYPE', appointmentType }),
    
    setReason: (reason: string) =>
      dispatch({ type: 'SET_REASON', reason }),
    
    setNotes: (notes: string) =>
      dispatch({ type: 'SET_NOTES', notes }),
    
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    
    previousStep: () => dispatch({ type: 'PREVIOUS_STEP' }),
    
    resetFlow: () => dispatch({ type: 'RESET_FLOW' }),
    
    setScheduledAppointment: (appointment: UIAppointment) =>
      dispatch({ type: 'SET_SCHEDULED_APPOINTMENT', appointment }),
    
    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', loading }),
    
    setError: (error: Error | null) =>
      dispatch({ type: 'SET_ERROR', error })
  };
}