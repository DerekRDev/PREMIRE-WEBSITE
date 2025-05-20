import { Referral, ReferralStatus } from '../../entities/Referral';
import { ReferralRepository } from '../../interfaces/repositories/ReferralRepository';

export interface ReferralTrackingFilter {
  patientId?: string;
  referringProviderId?: string;
  receivingProviderId?: string;
  status?: ReferralStatus;
  startDate?: Date;
  endDate?: Date;
}

export class TrackReferralUseCase {
  constructor(
    private referralRepository: ReferralRepository
  ) {}

  /**
   * Get a referral by ID
   * @param id The referral ID
   */
  async getById(id: string): Promise<Referral | null> {
    return this.referralRepository.findById(id);
  }

  /**
   * Find referrals based on filter criteria
   * @param filter The filter criteria
   */
  async findReferrals(filter: ReferralTrackingFilter): Promise<Referral[]> {
    // Apply filters based on the criteria provided
    if (filter.patientId) {
      return this.referralRepository.findByPatientId(filter.patientId);
    }

    if (filter.referringProviderId) {
      return this.referralRepository.findByReferringProviderId(filter.referringProviderId);
    }

    if (filter.receivingProviderId) {
      return this.referralRepository.findByReceivingProviderId(filter.receivingProviderId);
    }

    if (filter.status && filter.startDate && filter.endDate) {
      return this.referralRepository.findByStatusAndDateRange(
        filter.status,
        filter.startDate,
        filter.endDate
      );
    }

    if (filter.status) {
      return this.referralRepository.findByStatus(filter.status);
    }

    // Default to all referrals if no filter is specified
    return this.referralRepository.findAll();
  }

  /**
   * Update the status of a referral
   * @param id The referral ID
   * @param status The new status
   * @param userId The ID of the user updating the status
   * @param notes Optional notes about the status change
   */
  async updateStatus(id: string, status: ReferralStatus, userId: string, notes?: string): Promise<Referral | null> {
    try {
      return this.referralRepository.updateStatus(id, status, userId, notes);
    } catch (error) {
      console.error(`Error updating referral status: ${error}`);
      return null;
    }
  }
}