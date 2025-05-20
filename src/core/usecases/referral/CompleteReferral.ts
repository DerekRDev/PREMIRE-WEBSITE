import { Referral, ReferralStatus } from '../../entities/Referral';
import { ReferralRepository } from '../../interfaces/repositories/ReferralRepository';
import { AppointmentRepository } from '../../interfaces/repositories/AppointmentRepository';

export interface CompleteReferralRequest {
  referralId: string;
  appointmentId?: string;
  notes?: string;
  userId: string;  // ID of the user completing the referral
}

export interface CompleteReferralResponse {
  referral: Referral | null;
  message: string;
  success: boolean;
}

export class CompleteReferralUseCase {
  constructor(
    private referralRepository: ReferralRepository,
    private appointmentRepository: AppointmentRepository
  ) {}

  /**
   * Completes a referral by linking it to an appointment (if provided) and updating its status
   * @param request The complete referral request
   */
  async execute(request: CompleteReferralRequest): Promise<CompleteReferralResponse> {
    try {
      // Find the referral
      const referral = await this.referralRepository.findById(request.referralId);
      if (!referral) {
        return {
          referral: null,
          message: `Referral with ID ${request.referralId} not found`,
          success: false
        };
      }

      // Check if the referral can be completed (must be in SUBMITTED, PROCESSING, or SCHEDULED status)
      const validStatuses: ReferralStatus[] = ['SUBMITTED', 'PROCESSING', 'SCHEDULED'];
      if (!validStatuses.includes(referral.status)) {
        return {
          referral: referral,
          message: `Cannot complete referral with status ${referral.status}. Valid statuses are: ${validStatuses.join(', ')}`,
          success: false
        };
      }

      // If an appointment ID is provided, verify it exists
      if (request.appointmentId) {
        const appointment = await this.appointmentRepository.findById(request.appointmentId);
        if (!appointment) {
          return {
            referral: referral,
            message: `Appointment with ID ${request.appointmentId} not found`,
            success: false
          };
        }

        // Update the referral with the appointment ID
        await this.referralRepository.update(referral.id, { 
          appointmentId: request.appointmentId 
        });
      }

      // Update the referral status to COMPLETED
      const completedReferral = await this.referralRepository.updateStatus(
        referral.id,
        'COMPLETED',
        request.userId,
        request.notes || 'Referral completed'
      );

      return {
        referral: completedReferral,
        message: 'Referral completed successfully',
        success: true
      };
    } catch (error) {
      console.error('Error completing referral:', error);
      return {
        referral: null,
        message: `Error completing referral: ${error instanceof Error ? error.message : String(error)}`,
        success: false
      };
    }
  }
}