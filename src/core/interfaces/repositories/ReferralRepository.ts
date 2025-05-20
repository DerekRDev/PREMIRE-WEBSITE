import { Referral, ReferralStatus } from '../../entities/Referral';

/**
 * Repository interface for managing referrals in the system
 */
export interface ReferralRepository {
  /**
   * Find a referral by its ID
   */
  findById(id: string): Promise<Referral | null>;
  
  /**
   * Get all referrals in the system
   */
  findAll(): Promise<Referral[]>;
  
  /**
   * Find referrals by patient ID
   */
  findByPatientId(patientId: string): Promise<Referral[]>;
  
  /**
   * Find referrals by referring provider ID
   */
  findByReferringProviderId(providerId: string): Promise<Referral[]>;
  
  /**
   * Find referrals by receiving provider ID
   */
  findByReceivingProviderId(providerId: string): Promise<Referral[]>;
  
  /**
   * Find referrals by status
   */
  findByStatus(status: ReferralStatus): Promise<Referral[]>;
  
  /**
   * Find referrals by status and date range
   */
  findByStatusAndDateRange(status: ReferralStatus, startDate: Date, endDate: Date): Promise<Referral[]>;
  
  /**
   * Create a new referral
   */
  create(referral: Omit<Referral, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'auditTrail'>): Promise<Referral>;
  
  /**
   * Update an existing referral
   */
  update(id: string, referral: Partial<Referral>): Promise<Referral>;
  
  /**
   * Update the status of a referral
   */
  updateStatus(id: string, status: ReferralStatus, updatedBy: string, notes?: string): Promise<Referral>;
  
  /**
   * Delete a referral
   */
  delete(id: string): Promise<boolean>;
}