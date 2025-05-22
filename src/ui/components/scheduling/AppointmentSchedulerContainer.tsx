import React, { useEffect } from 'react';
import { useAppointmentContext, useAppointmentActions } from '../../providers/appointments/AppointmentContext';
import { FindAvailableSlotsUseCase } from '../../../core/usecases/appointment/FindAvailableSlots';
import { ScheduleAppointmentUseCase } from '../../../core/usecases/appointment/ScheduleAppointment';
import { AppointmentRequest, TimeSlot as CoreTimeSlot, AppointmentType, AppointmentStatus } from '../../../core/entities/Appointment';
import { Provider } from '../../../core/entities/Provider';
import { SpecialtySelection } from './SpecialtySelection';
import { ProviderSearch } from './ProviderSearch';
import { DateTimeSelection, UITimeSlot } from './DateTimeSelection';
import { AppointmentConfirmation } from './AppointmentConfirmation';
import { AppointmentDetailsForm } from './AppointmentDetailsForm';
import { Card } from '../../design-system/components/Card';
import { Button } from '../../design-system/components/Button';
import { AppointmentSchedulerContainerProps, UIProvider, UIAppointment, toUIProvider } from './types';

enum SchedulingStep {
  SPECIALTY = 0,
  PROVIDER = 1,
  DATETIME = 2,
  DETAILS = 3,
  CONFIRMATION = 4
}

const convertToUITimeSlot = (coreSlot: CoreTimeSlot, provider: UIProvider): UITimeSlot => ({
  startTime: coreSlot.startTime,
  endTime: coreSlot.endTime,
  providerId: provider.id,
  providerName: provider.name,
  locationId: provider.locations[0]?.id || '',
  locationName: provider.locations[0]?.name || ''
});

const convertToCoreTimeSlot = (uiSlot: UITimeSlot): CoreTimeSlot => ({
  startTime: uiSlot.startTime,
  endTime: uiSlot.endTime,
  status: 'AVAILABLE'
});

export function AppointmentSchedulerContainer({
  className = '',
  onComplete,
  onCancel
}: AppointmentSchedulerContainerProps) {
  const { state } = useAppointmentContext();
  const {
    selectSpecialty,
    selectProvider,
    selectSlot,
    setAppointmentType,
    setReason,
    setNotes,
    nextStep,
    previousStep,
    resetFlow,
    setScheduledAppointment,
    setLoading,
    setError
  } = useAppointmentActions();

  // Reset flow on unmount
  useEffect(() => {
    return () => {
      resetFlow();
    };
  }, [resetFlow]);

  const handleSpecialtySelect = async (specialtyId: string) => {
    try {
      setLoading(true);
      // In a real app, we would fetch the specialty details here
      const specialty = { id: specialtyId, name: 'Mock Specialty', description: '' };
      selectSpecialty(specialty);
      nextStep();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to select specialty'));
    } finally {
      setLoading(false);
    }
  };

  const handleProviderSelect = async (provider: UIProvider) => {
    try {
      setLoading(true);
      selectProvider(provider);
      nextStep();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to select provider'));
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = async (slot: UITimeSlot) => {
    try {
      setLoading(true);
      const coreSlot = convertToCoreTimeSlot(slot);
      selectSlot(coreSlot);
      nextStep();
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to select time slot'));
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAppointment = async () => {
    try {
      setLoading(true);

      if (!state.selectedProvider || !state.selectedSlot || !state.appointmentType) {
        throw new Error('Missing required appointment information');
      }

      const request: AppointmentRequest = {
        patientId: 'mock-patient-id', // In a real app, this would come from auth context
        providerId: state.selectedProvider.id,
        locationId: state.selectedProvider.locations[0]?.id || 'mock-location-id',
        startTime: state.selectedSlot.startTime,
        endTime: state.selectedSlot.endTime,
        type: state.appointmentType,
        reason: state.reason,
        notes: state.notes
      };

      // In a real app, these would be injected via dependency injection
      const scheduleAppointmentUseCase = new ScheduleAppointmentUseCase(
        {} as any, // appointmentRepository
        {} as any, // providerRepository
        {} as any  // patientRepository
      );

      const result = await scheduleAppointmentUseCase.execute(request);
      
      // Create UIAppointment instance
      const uiAppointment = new UIAppointment(
        result.appointment.id,
        result.appointment.patientId,
        result.appointment.providerId,
        result.appointment.locationId,
        result.appointment.startTime,
        result.appointment.endTime,
        AppointmentStatus.SCHEDULED,
        result.appointment.type,
        result.appointment.reason,
        state.selectedProvider.name,
        {
          id: state.selectedProvider.locations[0]?.id || 'mock-location-id',
          name: state.selectedProvider.locations[0]?.name || 'Main Location',
          address: state.selectedProvider.locations[0]?.address || '123 Medical Center Dr'
        },
        result.appointment.notes
      );

      setScheduledAppointment(uiAppointment);
      nextStep();
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to schedule appointment'));
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (state.currentStep) {
      case SchedulingStep.SPECIALTY:
        return (
          <SpecialtySelection
            specialties={[]} // In a real app, these would be fetched
            selectedSpecialty={state.selectedSpecialty}
            onSelect={handleSpecialtySelect}
          />
        );

      case SchedulingStep.PROVIDER:
        return (
          <ProviderSearch
            specialty={state.selectedSpecialty}
            selectedProvider={state.selectedProvider}
            onSelectProvider={handleProviderSelect}
          />
        );

      case SchedulingStep.DATETIME:
        return state.selectedProvider ? (
          <DateTimeSelection
            selectedSlot={state.selectedSlot ? convertToUITimeSlot(state.selectedSlot, state.selectedProvider) : undefined}
            onSelectSlot={handleSlotSelect}
            availableSlots={[]} // In a real app, these would be fetched and converted to UITimeSlot
          />
        ) : null;

      case SchedulingStep.DETAILS:
        return (
          <AppointmentDetailsForm
            appointmentType={state.appointmentType}
            reason={state.reason}
            notes={state.notes}
            onTypeChange={setAppointmentType}
            onReasonChange={setReason}
            onNotesChange={setNotes}
          />
        );

      case SchedulingStep.CONFIRMATION:
        return state.scheduledAppointment ? (
          <AppointmentConfirmation
            appointment={state.scheduledAppointment}
            onReschedule={() => {
              resetFlow();
              nextStep();
            }}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className={className}>
      <Card className="p-6">
        {state.error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
            {state.error.message}
          </div>
        )}

        {renderStepContent()}

        {state.currentStep < SchedulingStep.CONFIRMATION && (
          <div className="mt-6 flex justify-between">
            <Button
              variant="secondary"
              onClick={state.currentStep === 0 ? onCancel : previousStep}
            >
              {state.currentStep === 0 ? 'Cancel' : 'Back'}
            </Button>

            <Button
              variant="primary"
              onClick={
                state.currentStep === SchedulingStep.DETAILS
                  ? handleScheduleAppointment
                  : nextStep
              }
              disabled={
                state.loading ||
                (state.currentStep === SchedulingStep.SPECIALTY && !state.selectedSpecialty) ||
                (state.currentStep === SchedulingStep.PROVIDER && !state.selectedProvider) ||
                (state.currentStep === SchedulingStep.DATETIME && !state.selectedSlot) ||
                (state.currentStep === SchedulingStep.DETAILS && !state.appointmentType)
              }
            >
              {state.loading
                ? 'Loading...'
                : state.currentStep === SchedulingStep.DETAILS
                ? 'Schedule Appointment'
                : 'Next'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}