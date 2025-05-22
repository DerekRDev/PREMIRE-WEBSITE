import React, { useState } from 'react';
import { Tabs } from '../../design-system/components/Tabs';
import { Button } from '../../design-system/components/Button';
import { Card } from '../../design-system/components/Card';
import { Input } from '../../design-system/components/Input';
import { SpecialtySelection } from './SpecialtySelection';
import { ProviderSearch } from './ProviderSearch';
import { DateTimeSelection } from './DateTimeSelection';
import { AppointmentConfirmation } from './AppointmentConfirmation';

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  specialties: string[];
  profileImage?: string;
  locations: Location[];
}

interface TimeSlot {
  startTime: string; // ISO format date-time
  endTime: string;   // ISO format date-time
  providerId: string;
  providerName: string;
  locationId: string;
  locationName: string;
}

interface Appointment {
  id: string;
  patientId: string;
  providerId: string;
  providerName: string;
  startTime: string;
  endTime: string;
  type: string;
  reason: string;
  location: {
    id: string;
    name: string;
    address: string;
  };
  provider?: {
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    profileImage?: string;
    specialties: string[];
  };
}

enum SchedulingStep {
  SPECIALTY = 0,
  PROVIDER = 1,
  DATETIME = 2,
  REASON = 3,
  CONFIRMATION = 4,
}

export interface AppointmentSchedulerProps {
  specialties: Specialty[];
  providers: Provider[];
  patientId: string;
  onAppointmentScheduled?: (appointment: Appointment) => void;
  onCancel?: () => void;
  className?: string;
  // These would be functions that interact with the usecases
  getAvailableSlots?: (providerId: string, specialtyId?: string) => Promise<TimeSlot[]>;
  scheduleAppointment?: (data: any) => Promise<Appointment>;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  specialties,
  providers,
  patientId,
  onAppointmentScheduled,
  onCancel,
  className = '',
  getAvailableSlots,
  scheduleAppointment,
}) => {
  // State for each step
  const [currentStep, setCurrentStep] = useState<SchedulingStep>(SchedulingStep.SPECIALTY);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>();
  const [selectedProvider, setSelectedProvider] = useState<Provider | undefined>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>();
  const [appointmentReason, setAppointmentReason] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('INITIAL');
  const [scheduledAppointment, setScheduledAppointment] = useState<Appointment | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [showNextHint, setShowNextHint] = useState<boolean>(false);
  
  // Function to scroll to and highlight the next button
  const scrollToNextButton = () => {
    setTimeout(() => {
      const nextButton = document.querySelector('[data-next-button]') as HTMLElement;
      if (nextButton) {
        nextButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        setShowNextHint(true);
        // Hide hint after 4 seconds
        setTimeout(() => setShowNextHint(false), 4000);
      }
    }, 500);
  };
  
  // Move to the next step based on current step
  const handleNext = async () => {
    setError(undefined);
    setShowNextHint(false); // Hide hint when proceeding
    
    // Scroll to top when moving to next step
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (currentStep === SchedulingStep.SPECIALTY) {
      if (!selectedSpecialty) {
        setError('Please select a specialty to continue');
        return;
      }
      setCurrentStep(SchedulingStep.PROVIDER);
    } 
    else if (currentStep === SchedulingStep.PROVIDER) {
      if (!selectedProvider) {
        setError('Please select a provider to continue');
        return;
      }
      
      // Fetch available slots for selected provider
      setIsLoading(true);
      try {
        if (getAvailableSlots) {
          const slots = await getAvailableSlots(selectedProvider.id, selectedSpecialty);
          setAvailableSlots(slots);
        } else {
          // Mock data for demo purposes
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(9, 0, 0, 0);
          
          const mockSlots: TimeSlot[] = [];
          for (let i = 0; i < 8; i++) {
            const startTime = new Date(tomorrow);
            startTime.setHours(9 + Math.floor(i / 2), (i % 2) * 30, 0, 0);
            
            const endTime = new Date(startTime);
            endTime.setMinutes(endTime.getMinutes() + 30);
            
            mockSlots.push({
              startTime: startTime.toISOString(),
              endTime: endTime.toISOString(),
              providerId: selectedProvider.id,
              providerName: `${selectedProvider.firstName} ${selectedProvider.lastName}`,
              locationId: selectedProvider.locations[0].id,
              locationName: selectedProvider.locations[0].name,
            });
          }
          
          setAvailableSlots(mockSlots);
        }
      } catch (err) {
        setError('Failed to fetch available appointment slots. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      
      setCurrentStep(SchedulingStep.DATETIME);
    } 
    else if (currentStep === SchedulingStep.DATETIME) {
      if (!selectedSlot) {
        setError('Please select a time slot to continue');
        return;
      }
      setCurrentStep(SchedulingStep.REASON);
    } 
    else if (currentStep === SchedulingStep.REASON) {
      if (!appointmentReason.trim()) {
        setError('Please enter a reason for your appointment');
        return;
      }
      
      // Schedule the appointment
      setIsLoading(true);
      try {
        if (selectedSlot && selectedProvider) {
          const appointmentData = {
            patientId,
            providerId: selectedSlot.providerId,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            type: appointmentType,
            reason: appointmentReason,
            locationId: selectedSlot.locationId,
          };
          
          let appointment: Appointment;
          
          if (scheduleAppointment) {
            appointment = await scheduleAppointment(appointmentData);
          } else {
            // Mock appointment data for demo purposes
            const timestamp = Date.now();
            appointment = {
              id: `appt-${timestamp}`,
              patientId,
              providerId: selectedSlot.providerId,
              providerName: selectedSlot.providerName,
              startTime: selectedSlot.startTime,
              endTime: selectedSlot.endTime,
              type: appointmentType,
              reason: appointmentReason,
              location: {
                id: selectedSlot.locationId,
                name: selectedSlot.locationName,
                address: selectedProvider.locations.find(loc => loc.id === selectedSlot.locationId)?.address || '',
              },
              provider: {
                id: selectedProvider.id,
                firstName: selectedProvider.firstName,
                lastName: selectedProvider.lastName,
                title: selectedProvider.title,
                profileImage: selectedProvider.profileImage,
                specialties: selectedProvider.specialties,
              },
            };
            
          }
          
          setScheduledAppointment(appointment);
          
          if (onAppointmentScheduled) {
            onAppointmentScheduled(appointment);
          }
        }
      } catch (err) {
        setError('Failed to schedule appointment. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      
      setCurrentStep(SchedulingStep.CONFIRMATION);
    }
  };
  
  // Go back to the previous step
  const handleBack = () => {
    setError(undefined);
    
    // Scroll to top when going back
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Reset the scheduler
  const handleReset = () => {
    setCurrentStep(SchedulingStep.SPECIALTY);
    setSelectedSpecialty(undefined);
    setSelectedProvider(undefined);
    setSelectedSlot(undefined);
    setAppointmentReason('');
    setAppointmentType('INITIAL');
    setScheduledAppointment(undefined);
    setError(undefined);
  };
  
  // Define the content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case SchedulingStep.SPECIALTY:
        return (
          <SpecialtySelection
            specialties={specialties}
            selectedSpecialty={selectedSpecialty}
            onSelect={(specialty) => {
              setSelectedSpecialty(specialty);
              scrollToNextButton();
            }}
          />
        );
      
      case SchedulingStep.PROVIDER:
        return (
          <ProviderSearch
            providers={providers}
            specialtyId={selectedSpecialty}
            selectedProvider={selectedProvider}
            onSelectProvider={(provider) => {
              setSelectedProvider(provider);
              scrollToNextButton();
            }}
          />
        );
      
      case SchedulingStep.DATETIME:
        return (
          <DateTimeSelection
            availableSlots={availableSlots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => {
              setSelectedSlot(slot);
              scrollToNextButton();
            }}
          />
        );
      
      case SchedulingStep.REASON:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">
              Appointment details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="appointment-type" className="block text-sm font-medium text-neutral-700 mb-1">
                  Appointment Type
                </label>
                <select
                  id="appointment-type"
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full p-2 border border-neutral-300 rounded-md"
                >
                  <option value="INITIAL">Initial Visit</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="PHYSICAL">Annual Physical</option>
                  <option value="CONSULTATION">Consultation</option>
                  <option value="PROCEDURE">Procedure</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="appointment-reason" className="block text-sm font-medium text-neutral-700 mb-1">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
                <Input
                  id="appointment-reason"
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  placeholder="Please describe the reason for your appointment"
                  multiline
                  rows={4}
                  required
                />
                <p className="mt-1 text-sm text-neutral-500">
                  This information helps your provider prepare for your visit.
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800">Your selected appointment:</h3>
                
                {selectedProvider && selectedSlot && (
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="font-medium">
                      {new Date(selectedSlot.startTime).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p>
                      {new Date(selectedSlot.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - 
                      {new Date(selectedSlot.endTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    <p>
                      {selectedProvider.firstName} {selectedProvider.lastName}, {selectedProvider.title}
                    </p>
                    <p>
                      {selectedSlot.locationName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      case SchedulingStep.CONFIRMATION:
        return scheduledAppointment ? (
          <AppointmentConfirmation
            key={scheduledAppointment.id}
            appointment={scheduledAppointment}
            onReschedule={handleReset}
            onCancel={onCancel}
          />
        ) : (
          <div className="text-center py-10">
            <div className="text-red-600 mb-4">
              Failed to schedule appointment. Please try again.
            </div>
            <Button variant="primary" onClick={handleReset}>
              Try Again
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  // Define tab labels for the steps
  const tabLabels = ['Specialty', 'Provider', 'Date & Time', 'Details', 'Confirmation'];
  
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="p-6">
        <Tabs
          tabs={tabLabels}
          activeTab={currentStep}
          onChange={(tab) => {
            // Only allow going back to previous steps
            if (tab < currentStep) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setCurrentStep(tab);
            }
          }}
          className="mb-6"
        />
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-neutral-600">Loading...</p>
            </div>
          ) : (
            renderStepContent()
          )}
        </div>
        
        {currentStep < SchedulingStep.CONFIRMATION && (
          <div className="mt-8 flex justify-between">
            {currentStep > 0 ? (
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            
            <Button 
              variant="primary" 
              onClick={handleNext} 
              disabled={isLoading}
              data-next-button
              className={`relative transition-all duration-300 ${showNextHint ? 'ring-4 ring-blue-300 ring-opacity-75 scale-105' : ''}`}
            >
              {currentStep === SchedulingStep.REASON ? 'Schedule Appointment' : 'Next'}
              {showNextHint && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap animate-pulse shadow-lg">
                  Click here to continue →
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
                </div>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};