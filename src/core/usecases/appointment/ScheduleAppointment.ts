import { Appointment, AppointmentRequest, TimeSlot } from '../../entities/Appointment';
import { AppointmentRepository } from '../../interfaces/repositories/AppointmentRepository';
import { ProviderRepository } from '../../interfaces/repositories/ProviderRepository';
import { PatientRepository } from '../../interfaces/repositories/PatientRepository';

export interface ScheduleAppointmentResponse {
  appointment: Appointment;
  confirmationNumber: string;
}

export class ScheduleAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(request: AppointmentRequest): Promise<ScheduleAppointmentResponse> {
    // Validate patient exists
    const patient = await this.patientRepository.findById(request.patientId);
    if (!patient) {
      throw new Error(`Patient not found with ID: ${request.patientId}`);
    }

    // Validate provider exists
    const provider = await this.providerRepository.findById(request.providerId);
    if (!provider) {
      throw new Error(`Provider not found with ID: ${request.providerId}`);
    }

    // Check if the requested time slot is available
    const requestedSlot: TimeSlot = {
      startTime: request.startTime,
      endTime: request.endTime,
      status: 'AVAILABLE'
    };

    const isAvailable = await this.providerRepository.isAvailable(
      request.providerId,
      requestedSlot
    );

    if (!isAvailable) {
      throw new Error('The requested time slot is not available');
    }

    // Check for scheduling conflicts
    const existingAppointments = await this.appointmentRepository.findByDateRange(
      request.startTime,
      request.endTime
    );

    const hasConflict = existingAppointments.some(appointment => {
      return (
        appointment.providerId === request.providerId &&
        new Date(request.startTime) < new Date(appointment.endTime) &&
        new Date(request.endTime) > new Date(appointment.startTime)
      );
    });

    if (hasConflict) {
      throw new Error('The requested time slot conflicts with an existing appointment');
    }

    // Check if patient has other appointments at the same time
    const patientAppointments = await this.appointmentRepository.findByPatient(
      request.patientId
    );

    const hasPatientConflict = patientAppointments.some(appointment => {
      return (
        new Date(request.startTime) < new Date(appointment.endTime) &&
        new Date(request.endTime) > new Date(appointment.startTime)
      );
    });

    if (hasPatientConflict) {
      throw new Error('Patient has another appointment scheduled at this time');
    }

    // Create the appointment
    const appointment = Appointment.create(request);

    // Save the appointment
    await this.appointmentRepository.save(appointment);

    // Generate a confirmation number
    const confirmationNumber = this.generateConfirmationNumber(appointment);

    return {
      appointment,
      confirmationNumber
    };
  }

  private generateConfirmationNumber(appointment: Appointment): string {
    // Generate a unique confirmation number
    // Format: YYYYMMDD-PROV-XXXX
    const date = new Date(appointment.startTime);
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const providerPrefix = appointment.providerId.slice(0, 4).toUpperCase();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    return `${dateStr}-${providerPrefix}-${random}`;
  }
}